# YumYum — API 명세

## 공통 규칙

### Base URL
- 개발: `http://localhost:3000`
- 운영: `https://yumyum-api.onrender.com`

### 인증
JWT Bearer Token 방식 사용.

```
Authorization: Bearer <accessToken>
```

인증이 필요한 엔드포인트에 토큰 미전달 시 `401 Unauthorized` 반환.

### 요청 헤더
```
Content-Type: application/json
Authorization: Bearer <token>  # 인증 필요 시
```

### 공통 에러 응답 형식
```json
{
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "Bad Request"
}
```

### 페이지네이션
목록 API는 query parameter로 페이지네이션 지원.

| 파라미터 | 기본값 | 설명 |
|----------|--------|------|
| `page` | 1 | 페이지 번호 |
| `limit` | 20 | 페이지당 항목 수 (최대 100) |

페이지네이션 응답 형식:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Auth

### POST /auth/signup
회원가입

**Request Body**
```json
{
  "email": "user@example.com",
  "nickname": "얌얌이",
  "password": "password123!"
}
```

**Response 201**
```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "얌얌이",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 400 | 유효성 검사 실패 |
| 409 | 이미 존재하는 이메일 |

---

### POST /auth/login
로그인

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123!"
}
```

**Response 200**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "얌얌이"
  }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 400 | 유효성 검사 실패 |
| 401 | 이메일 또는 비밀번호 불일치 |

---

## Snacks

### GET /snacks
과자 목록 조회

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `page` | number | 페이지 번호 (기본: 1) |
| `limit` | number | 페이지당 항목 수 (기본: 20) |
| `categoryId` | number | 카테고리 필터 |
| `brandId` | number | 브랜드 필터 |
| `sort` | string | 정렬 기준: `newest` \| `rating` (기본: `newest`) |

**Response 200**
```json
{
  "data": [
    {
      "id": 1,
      "name": "허니버터칩 신제품",
      "brand": { "id": 1, "name": "해태제과" },
      "category": { "id": 2, "name": "감자칩" },
      "imageUrl": "https://...",
      "price": 1800,
      "releaseDate": "2026-01-15",
      "averageRating": 4.2,
      "reviewCount": 31,
      "isFavorited": false
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### GET /snacks/new
신상품 목록 조회 (최근 30일 출시)

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `page` | number | 페이지 번호 (기본: 1) |
| `limit` | number | 페이지당 항목 수 (기본: 20) |

**Response 200**
```json
{
  "data": [
    {
      "id": 5,
      "name": "오리온 신상 젤리",
      "brand": { "id": 2, "name": "오리온" },
      "category": { "id": 3, "name": "젤리" },
      "imageUrl": "https://...",
      "price": 1200,
      "releaseDate": "2026-01-20",
      "averageRating": null,
      "reviewCount": 0,
      "isFavorited": false
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### GET /snacks/search
과자 검색

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `q` | string | 검색 키워드 (필수, 최소 2자) |
| `page` | number | 페이지 번호 (기본: 1) |
| `limit` | number | 페이지당 항목 수 (기본: 20) |

**Response 200**
```json
{
  "data": [
    {
      "id": 1,
      "name": "허니버터칩",
      "brand": { "id": 1, "name": "해태제과" },
      "category": { "id": 2, "name": "감자칩" },
      "imageUrl": "https://...",
      "price": 1800,
      "releaseDate": "2026-01-15",
      "averageRating": 4.2,
      "reviewCount": 31
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 400 | 검색어 미입력 또는 2자 미만 |

---

### GET /snacks/:id
과자 상세 조회

**Path Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 과자 ID |

**Response 200**
```json
{
  "id": 1,
  "name": "허니버터칩 신제품",
  "brand": { "id": 1, "name": "해태제과" },
  "category": { "id": 2, "name": "감자칩" },
  "description": "달콤하고 고소한 허니버터칩 신제품",
  "imageUrl": "https://...",
  "price": 1800,
  "releaseDate": "2026-01-15",
  "createdAt": "2026-01-10T00:00:00.000Z",
  "averageRating": 4.2,
  "reviewCount": 31,
  "isFavorited": true,
  "favoriteId": 7
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 404 | 과자를 찾을 수 없음 |

---

## Categories

### GET /categories
카테고리 목록 조회

**Response 200**
```json
[
  { "id": 1, "name": "초콜릿" },
  { "id": 2, "name": "감자칩" },
  { "id": 3, "name": "젤리" }
]
```

---

## Brands

### GET /brands
브랜드 목록 조회

**Response 200**
```json
[
  { "id": 1, "name": "해태제과" },
  { "id": 2, "name": "오리온" },
  { "id": 3, "name": "롯데제과" }
]
```

---

## Favorites

> 모든 엔드포인트에 인증 필요 (JWT)

### POST /favorites
관심상품 등록 (좋아요)

**Request Body**
```json
{
  "snackId": 1
}
```

**Response 201**
```json
{
  "id": 7,
  "snackId": 1,
  "userId": 1,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 400 | 유효성 검사 실패 |
| 404 | 과자를 찾을 수 없음 |
| 409 | 이미 좋아요한 과자 |

---

### DELETE /favorites/:id
관심상품 해제 (좋아요 취소)

**Path Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | favorite ID |

**Response 200**
```json
{
  "message": "관심상품이 해제되었습니다."
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 403 | 다른 사용자의 좋아요 삭제 시도 |
| 404 | 좋아요 항목을 찾을 수 없음 |

---

### GET /favorites
내 관심상품 목록 조회

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `page` | number | 페이지 번호 (기본: 1) |
| `limit` | number | 페이지당 항목 수 (기본: 20) |

**Response 200**
```json
{
  "data": [
    {
      "id": 7,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "snack": {
        "id": 1,
        "name": "허니버터칩 신제품",
        "brand": { "id": 1, "name": "해태제과" },
        "category": { "id": 2, "name": "감자칩" },
        "imageUrl": "https://...",
        "price": 1800,
        "releaseDate": "2026-01-15"
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

## Reviews

### POST /reviews
리뷰 작성 (인증 필요)

**Request Body**
```json
{
  "snackId": 1,
  "rating": 4,
  "content": "생각보다 너무 맛있어요! 짭짤하고 달콤한 조합이 최고"
}
```

**Response 201**
```json
{
  "id": 15,
  "snackId": 1,
  "userId": 1,
  "rating": 4,
  "content": "생각보다 너무 맛있어요! 짭짤하고 달콤한 조합이 최고",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "user": { "id": 1, "nickname": "얌얌이" }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 400 | 유효성 검사 실패 (rating: 1~5, content: 필수) |
| 401 | 인증 필요 |
| 404 | 과자를 찾을 수 없음 |
| 409 | 이미 해당 과자에 리뷰 작성 |

---

### PUT /reviews/:id
리뷰 수정 (인증 필요, 본인만)

**Path Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 리뷰 ID |

**Request Body**
```json
{
  "rating": 5,
  "content": "먹을수록 맛있어서 별점 올립니다"
}
```

**Response 200**
```json
{
  "id": 15,
  "snackId": 1,
  "userId": 1,
  "rating": 5,
  "content": "먹을수록 맛있어서 별점 올립니다",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-02T00:00:00.000Z",
  "user": { "id": 1, "nickname": "얌얌이" }
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 400 | 유효성 검사 실패 |
| 401 | 인증 필요 |
| 403 | 다른 사용자의 리뷰 수정 시도 |
| 404 | 리뷰를 찾을 수 없음 |

---

### DELETE /reviews/:id
리뷰 삭제 (인증 필요, 본인만)

**Path Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 리뷰 ID |

**Response 200**
```json
{
  "message": "리뷰가 삭제되었습니다."
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 401 | 인증 필요 |
| 403 | 다른 사용자의 리뷰 삭제 시도 |
| 404 | 리뷰를 찾을 수 없음 |

---

### GET /reviews/snack/:snackId
특정 과자의 리뷰 목록 조회

**Path Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `snackId` | number | 과자 ID |

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `page` | number | 페이지 번호 (기본: 1) |
| `limit` | number | 페이지당 항목 수 (기본: 10) |
| `sort` | string | 정렬: `newest` \| `highest` \| `lowest` (기본: `newest`) |

**Response 200**
```json
{
  "data": [
    {
      "id": 15,
      "rating": 5,
      "content": "먹을수록 맛있어서 별점 올립니다",
      "createdAt": "2026-01-02T00:00:00.000Z",
      "updatedAt": "2026-01-02T00:00:00.000Z",
      "user": { "id": 1, "nickname": "얌얌이" }
    }
  ],
  "meta": {
    "total": 31,
    "page": 1,
    "limit": 10,
    "totalPages": 4,
    "averageRating": 4.2
  }
}
```

---

## Recommendations

### GET /recommendations
AI 맞춤 추천 (인증 필요)

추천 로직 우선순위:
1. 사용자가 좋아요한 과자의 카테고리와 동일한 신상품
2. 사용자가 좋아요한 과자와 같은 브랜드의 신상품
3. 전체 신상품 중 평점 높은 순

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `limit` | number | 추천 과자 수 (기본: 10, 최대: 30) |

**Response 200**
```json
{
  "recommendations": [
    {
      "id": 5,
      "name": "오리온 신상 젤리",
      "brand": { "id": 2, "name": "오리온" },
      "category": { "id": 3, "name": "젤리" },
      "imageUrl": "https://...",
      "price": 1200,
      "releaseDate": "2026-01-20",
      "averageRating": 4.5,
      "reviewCount": 8,
      "reason": "관심 카테고리 기반 추천"
    }
  ],
  "generatedAt": "2026-01-06T00:00:00.000Z"
}
```

**에러**
| 코드 | 상황 |
|------|------|
| 401 | 인증 필요 |
