# YumYum — AI 신상 과자 추천 서비스 PRD

## 1. 프로젝트 개요

편의점·마트·제조사에서 출시되는 신상 과자/간식 정보를 수집하여 사용자에게 제공하는 서비스.
사용자는 관심 상품 등록(좋아요), 리뷰 작성이 가능하며 AI 기반 맞춤 추천을 받을 수 있다.

---

## 2. 기술 스택

### Frontend
| 항목 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | TailwindCSS + shadcn/ui |
| React | React 19 |

### Backend
| 항목 | 기술 |
|------|------|
| Framework | NestJS |
| Language | TypeScript |
| ORM | Prisma |
| API 문서 | Swagger |
| 인증 | JWT (Bearer Token) |

### Database
| 항목 | 기술 |
|------|------|
| DB | PostgreSQL |
| 호스팅 | Neon |

### Crawling
| 항목 | 기술 |
|------|------|
| 브라우저 자동화 | Playwright |
| 스케줄링 | node-cron |

### Deployment
| 서비스 | 플랫폼 |
|--------|--------|
| Frontend | Vercel |
| Backend | Render |

---

## 3. 폴더 구조

```
YumYum/
  frontend/          # Next.js 15 앱
  backend/           # NestJS 앱
  PRD.md
  ERD.md
  API.md
  PROMPTS.md
```

### Backend 상세 구조

```
backend/
  src/
    auth/
      auth.module.ts
      auth.controller.ts
      auth.service.ts
      auth.repository.ts
      dto/
        signup.dto.ts
        login.dto.ts
        auth-response.dto.ts
      strategies/
        jwt.strategy.ts
    users/
      users.module.ts
      users.service.ts
      users.repository.ts
      dto/
        user-response.dto.ts
    snacks/
      snacks.module.ts
      snacks.controller.ts
      snacks.service.ts
      snacks.repository.ts
      dto/
        snack-query.dto.ts
        snack-response.dto.ts
    categories/
      categories.module.ts
      categories.controller.ts
      categories.service.ts
      categories.repository.ts
    brands/
      brands.module.ts
      brands.controller.ts
      brands.service.ts
      brands.repository.ts
    favorites/
      favorites.module.ts
      favorites.controller.ts
      favorites.service.ts
      favorites.repository.ts
      dto/
        create-favorite.dto.ts
        favorite-response.dto.ts
    reviews/
      reviews.module.ts
      reviews.controller.ts
      reviews.service.ts
      reviews.repository.ts
      dto/
        create-review.dto.ts
        update-review.dto.ts
        review-response.dto.ts
    recommendations/
      recommendations.module.ts
      recommendations.controller.ts
      recommendations.service.ts
    crawling/
      crawling.module.ts
      crawling.service.ts
      schedulers/
        crawl.scheduler.ts
    common/
      guards/
        jwt-auth.guard.ts
      decorators/
        current-user.decorator.ts
      filters/
        http-exception.filter.ts
      pipes/
        validation.pipe.ts
    prisma/
      prisma.module.ts
      prisma.service.ts
    app.module.ts
    main.ts
  prisma/
    schema.prisma
  .env
  package.json
  tsconfig.json
```

### Frontend 상세 구조

```
frontend/
  src/
    app/
      (auth)/
        login/
          page.tsx
        signup/
          page.tsx
      (main)/
        page.tsx              # 홈
        snacks/
          page.tsx            # 과자 목록
          [id]/
            page.tsx          # 과자 상세
        search/
          page.tsx            # 검색 결과
        favorites/
          page.tsx            # 관심상품 목록
        recommendations/
          page.tsx            # AI 추천
        profile/
          page.tsx            # 프로필 / 내 리뷰
      layout.tsx
    components/
      ui/                     # shadcn/ui 컴포넌트
      snack-card.tsx
      review-form.tsx
      favorite-button.tsx
      navbar.tsx
    lib/
      api.ts                  # API 클라이언트
      auth.ts                 # JWT 유틸
    types/
      index.ts
  .env.local
  package.json
  tailwind.config.ts
```

---

## 4. 화면 목록

| 경로 | 화면명 | 인증 필요 | 주요 기능 |
|------|--------|-----------|-----------|
| `/` | 홈 | N | 최신 신상품 피드, 카테고리 필터 |
| `/login` | 로그인 | N | 이메일/비밀번호 로그인, JWT 저장 |
| `/signup` | 회원가입 | N | 이메일·닉네임·비밀번호 입력 |
| `/snacks` | 과자 목록 | N | 전체 목록, 카테고리·브랜드 필터, 정렬 |
| `/snacks/:id` | 과자 상세 | N | 상세 정보, 좋아요, 리뷰 목록·작성 |
| `/search` | 검색 결과 | N | 키워드 검색 결과 |
| `/favorites` | 관심상품 | Y | 내가 좋아요한 과자 목록 |
| `/recommendations` | AI 추천 | Y | 맞춤 추천 과자 목록 |
| `/profile` | 프로필 | Y | 내 정보, 내가 쓴 리뷰 목록 |

---

## 5. 사용자 플로우

```
[비회원]
홈 접근
  └─> 신상품 피드 탐색 (로그인 불필요)
      └─> 과자 상세 확인 (로그인 불필요)
          └─> 좋아요/리뷰 시도 → 로그인 페이지로 리다이렉트

[회원가입]
/signup
  ├─> 이메일, 닉네임, 비밀번호 입력
  ├─> POST /auth/signup 호출
  └─> 성공 → 로그인 페이지로 이동

[로그인]
/login
  ├─> 이메일, 비밀번호 입력
  ├─> POST /auth/login 호출
  ├─> JWT accessToken 발급 → localStorage/cookie 저장
  └─> 홈으로 이동

[과자 탐색]
홈 / /snacks
  ├─> 카테고리·브랜드 필터 적용
  ├─> 키워드 검색 → /search
  └─> 과자 카드 클릭 → /snacks/:id

[과자 상세]
/snacks/:id
  ├─> 좋아요 토글 (POST/DELETE /favorites)
  ├─> 리뷰 목록 조회 (GET /reviews/snack/:id)
  └─> 리뷰 작성 (POST /reviews)
      ├─> 별점 1~5 선택
      └─> 텍스트 입력 후 제출

[관심상품]
/favorites
  ├─> 내가 좋아요한 과자 목록 조회
  └─> 좋아요 해제 (DELETE /favorites/:id)

[AI 추천]
/recommendations
  ├─> GET /recommendations 호출
  │     ├─> 관심 카테고리 기반 추천
  │     ├─> 최근 좋아요 기반 추천
  │     └─> 신상품 우선 추천
  └─> 추천 과자 목록 표시

[프로필]
/profile
  ├─> 내 정보 확인
  └─> 내가 쓴 리뷰 목록 (수정/삭제 가능)
```

---

## 6. MVP 범위 및 우선순위

| 우선순위 | 기능 | 설명 |
|----------|------|------|
| P0 | 회원가입 / 로그인 | JWT 인증 기반 |
| P0 | 신상품 조회 | 홈 피드, 목록, 상세 |
| P0 | 관심상품 등록 | 좋아요 토글 |
| P1 | 리뷰 작성/수정/삭제 | 별점 + 텍스트 |
| P1 | 검색 | 과자명 키워드 검색 |
| P2 | AI 추천 | 관심 카테고리·좋아요 기반 |
| P2 | 크롤링 | 편의점 신상품 자동 수집 |
| v2 | 소셜 로그인 | Google/Kakao OAuth |
| v2 | 알림 | 신상품 출시 푸시 알림 |
