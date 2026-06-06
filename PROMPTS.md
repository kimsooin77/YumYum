# YumYum — 프로젝트 개발 규칙 (PROMPTS)

AI 코딩 어시스턴트 및 개발자가 이 프로젝트에서 코드를 작성할 때 반드시 따라야 할 규칙 모음.

---

## 기술 스택

- **Backend Framework**: NestJS (TypeScript)
- **ORM**: Prisma (PostgreSQL / Neon)
- **API 문서**: Swagger (`@nestjs/swagger`)
- **인증**: JWT (`@nestjs/passport` + `passport-jwt`)
- **Frontend**: Next.js 15, React 19, TailwindCSS, shadcn/ui

---

## 아키텍처 원칙

### 1. Controller는 비즈니스 로직 금지

Controller는 다음만 담당한다:
- 라우팅 (HTTP 메서드 및 경로 정의)
- Request DTO 바인딩 및 유효성 검사
- Service 호출
- Response DTO 반환

```typescript
// 올바른 예시
@Post()
async create(@Body() dto: CreateReviewDto, @CurrentUser() user: User) {
  return this.reviewsService.create(user.id, dto);
}

// 잘못된 예시 (Controller에서 직접 DB 접근 금지)
@Post()
async create(@Body() dto: CreateReviewDto) {
  const review = await this.prisma.review.create({ data: dto }); // X
  return review;
}
```

---

### 2. Service에서 비즈니스 로직 처리

모든 비즈니스 로직은 Service에서 처리한다.
- 조건 분기, 유효성 검증, 데이터 가공 등
- Repository를 통해서만 DB에 접근

```typescript
// 올바른 예시
@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async create(userId: number, dto: CreateReviewDto) {
    const existing = await this.reviewsRepository.findByUserAndSnack(userId, dto.snackId);
    if (existing) {
      throw new ConflictException('이미 리뷰를 작성했습니다.');
    }
    return this.reviewsRepository.create({ userId, ...dto });
  }
}
```

---

### 3. Repository 패턴 사용

DB 접근 로직은 Repository 클래스에 캡슐화한다.
- `PrismaService`를 직접 주입하는 대상은 Repository뿐
- Service는 Repository 메서드만 호출

```typescript
@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: number; snackId: number; rating: number; content: string }) {
    return this.prisma.review.create({
      data,
      include: { user: { select: { id: true, nickname: true } } },
    });
  }

  async findByUserAndSnack(userId: number, snackId: number) {
    return this.prisma.review.findUnique({
      where: { userId_snackId: { userId, snackId } },
    });
  }
}
```

---

### 4. DTO 사용 (Request / Response 분리)

- **Request DTO**: `class-validator` 데코레이터로 유효성 검사
- **Response DTO**: 클라이언트에 반환할 데이터 형태 정의
- DTO 파일은 각 모듈의 `dto/` 폴더에 위치

```typescript
// create-review.dto.ts
import { IsInt, IsString, Min, Max, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: '과자 ID' })
  @IsInt()
  snackId: number;

  @ApiProperty({ description: '별점 (1~5)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: '리뷰 내용 (최소 10자)' })
  @IsString()
  @MinLength(10)
  content: string;
}
```

---

### 5. Swagger 데코레이터 필수 작성

모든 Controller 및 DTO에 Swagger 데코레이터를 작성한다.

```typescript
// Controller
@ApiTags('reviews')
@ApiOperation({ summary: '리뷰 작성' })
@ApiCreatedResponse({ description: '리뷰 작성 성공', type: ReviewResponseDto })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Post()
async create(@Body() dto: CreateReviewDto, @CurrentUser() user: User) {
  return this.reviewsService.create(user.id, dto);
}

// DTO
export class ReviewResponseDto {
  @ApiProperty({ description: '리뷰 ID' })
  id: number;

  @ApiProperty({ description: '별점' })
  rating: number;
}
```

---

### 6. 에러는 HttpException 사용

NestJS 내장 예외 클래스를 사용하여 일관된 에러 응답을 반환한다.
직접 `throw new Error()` 사용 금지.

```typescript
// 사용 가능한 내장 예외 클래스
throw new BadRequestException('유효하지 않은 입력입니다.');     // 400
throw new UnauthorizedException('로그인이 필요합니다.');         // 401
throw new ForbiddenException('권한이 없습니다.');                // 403
throw new NotFoundException('과자를 찾을 수 없습니다.');         // 404
throw new ConflictException('이미 좋아요한 과자입니다.');        // 409
throw new InternalServerErrorException('서버 오류입니다.');      // 500
```

---

## 모듈 구조 규칙

각 모듈은 다음 파일 구조를 따른다:

```
{feature}/
  {feature}.module.ts      # 모듈 정의, 의존성 선언
  {feature}.controller.ts  # 라우팅, DTO 바인딩
  {feature}.service.ts     # 비즈니스 로직
  {feature}.repository.ts  # DB 접근
  dto/
    create-{feature}.dto.ts
    update-{feature}.dto.ts
    {feature}-response.dto.ts
```

---

## 코딩 컨벤션

| 항목 | 규칙 |
|------|------|
| 파일명 | kebab-case (`create-review.dto.ts`) |
| 클래스명 | PascalCase (`CreateReviewDto`) |
| 변수/함수명 | camelCase |
| DB 컬럼 매핑 | Prisma `@map()` 사용으로 camelCase 유지 |
| 비동기 | `async/await` 사용 (Promise chain 금지) |
| 타입 | `any` 사용 금지, 명시적 타입 또는 Prisma 생성 타입 사용 |
| 환경변수 | `.env` 파일 사용, 코드에 하드코딩 금지 |

---

## Prisma 사용 규칙

- Prisma Client는 `PrismaService`를 통해서만 사용
- `PrismaService`는 Repository에서만 주입
- 쿼리 결과 타입은 Prisma 생성 타입 활용 (`Prisma.ReviewGetPayload<...>`)
- 민감한 필드(`passwordHash`)는 `select`로 명시적 제외

```typescript
// passwordHash 제외 예시
async findById(id: number) {
  return this.prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, nickname: true, createdAt: true },
  });
}
```

---

## 인증 규칙

- 인증이 필요한 엔드포인트에는 `@UseGuards(JwtAuthGuard)` 데코레이터 적용
- 현재 사용자 정보는 `@CurrentUser()` 커스텀 데코레이터로 가져옴
- 리소스 소유권 검사는 Service에서 처리 (userId 비교 후 403 반환)

```typescript
// 소유권 검사 예시
async delete(reviewId: number, userId: number) {
  const review = await this.reviewsRepository.findById(reviewId);
  if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');
  if (review.userId !== userId) throw new ForbiddenException('권한이 없습니다.');
  return this.reviewsRepository.delete(reviewId);
}
```
