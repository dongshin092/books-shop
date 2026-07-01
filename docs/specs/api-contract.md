# API Contract — GET /api/books

작성: BE + FE 공동 합의  
확정일: 2026-06-29

---

## 1. 엔드포인트

| 항목 | 값 |
|---|---|
| Method | `GET` |
| URL | `/api/books` |
| 인증 | 불필요 (비로그인 허용) |
| 요청 파라미터 | 없음 |

---

## 2. 성공 응답

**HTTP Status:** `200 OK`

### 응답 구조

```json
{
  "success": true,
  "data": {
    "bestTopN": [ <BookSummary> ],
    "newTopN":  [ <BookSummary> ],
    "itTopN":   [ <BookSummary> ],
    "novelTopN":[ <BookSummary> ],
    "selfTopN": [ <BookSummary> ]
  }
}
```

### BookSummary 필드

| 필드 | 타입 | DB 컬럼 | 설명 |
|---|---|---|---|
| `id` | String | `books.id` | 도서 ID (예: `"IT-IT-6FB622"`) |
| `title` | String | `books.title` | 도서 제목 |
| `coverImage` | String | `books.cover_image` | 표지 이미지 URL (DB 저장 풀 URL 그대로) |
| `author` | String | `books.author` | 저자명 |
| `salePrice` | Integer | `books.sale_price` | 판매가 (원 단위 정수) |

### 섹션 정의

| 섹션 키 | 추출 조건 | 정렬 | 최대 건수 |
|---|---|---|---|
| `bestTopN` | `books.best_yn = 'Y'` | `published_date` DESC, `title` ASC | 5 |
| `newTopN` | `books.new_yn = 'Y'` | `published_date` DESC, `title` ASC | 5 |
| `itTopN` | `categories.types = 'IT'` (books.category_id JOIN) | `published_date` DESC, `title` ASC | 5 |
| `novelTopN` | `categories.types = 'NOVEL'` | `published_date` DESC, `title` ASC | 5 |
| `selfTopN` | `categories.types = 'SELF'` | `published_date` DESC, `title` ASC | 5 |

### 빈 섹션 처리

조건에 맞는 도서가 없을 경우 `null`이 아닌 빈 배열 `[]`을 반환한다.

### 응답 예시

```json
{
  "success": true,
  "data": {
    "bestTopN": [
      {
        "id": "IT-IT-6FB622",
        "title": "클린 코드",
        "coverImage": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788966260959.jpg",
        "author": "로버트 C. 마틴",
        "salePrice": 29700
      }
    ],
    "newTopN": [ ... ],
    "itTopN": [ ... ],
    "novelTopN": [ ... ],
    "selfTopN": [ ... ]
  }
}
```

---

## 3. 에러 응답

**HTTP Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "code": "INTERNAL_ERROR",
  "message": "서버 오류가 발생했습니다."
}
```

---

## 4. 인증 방식

- 인증 토큰 불필요.
- SecurityConfig에서 `/api/books` 경로를 `permitAll()`로 허용한다.

---

## 5. 네이밍 정규화 (mainPage.md 대비 변경 사항)

| 원본 (mainPage.md) | 확정 | 변경 이유 |
|---|---|---|
| `ItTopN` | `itTopN` | camelCase 소문자 시작 통일 |
| `slefTopN` | `selfTopN` | 오타 수정 |
| `Id` | `id` | camelCase 소문자 시작 통일 |
| `판매가` | `salePrice` | 한글 키 제거, camelCase |
| `"판매가": "15000"` (String) | `"salePrice": 15000` (Integer) | DB 컬럼 타입(INTEGER) 일치, 프론트 가격 포맷팅 지원 |
| `{code, data}` 래핑 | `{success, data}` 래핑 | 기존 ApiResponse 규약 준수 |

---

---

# API Contract — GET /api/books/{bookId}

작성: BE + FE 공동 합의
확정일: 2026-06-30

---

## 1. 엔드포인트

| 항목 | 값 |
|---|---|
| Method | `GET` |
| URL | `/api/books/{bookId}` |
| 인증 | 불필요 (비로그인 허용) |
| Path Variable | `bookId` — 도서 고유 ID (String) |
| Query Parameter | `page` (0부터 시작, 기본값 0), `size` (페이지당 리뷰 수, 기본값 10) |

---

## 2. 성공 응답

**HTTP Status:** `200 OK`

### 응답 구조

```json
{
  "success": true,
  "data": {
    "bookId": "IT-IT-6FB622",
    "title": "혼자 공부하는 파이썬",
    "coverImage": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788966260959.jpg",
    "author": "윤인성",
    "publisher": "한빛미디어",
    "publishedDate": "2023-01-05",
    "listPrice": 26000,
    "salePrice": 22000,
    "stocks": 10,
    "categoryName": "IT/컴퓨터",
    "description": "이 책은 파이썬 입문자가...",
    "reviewList": {
      "totalCount": 48,
      "page": 0,
      "size": 10,
      "totalPages": 5,
      "items": [
        {
          "reviewId": 1,
          "reviewerName": "김민준",
          "rating": 5,
          "content": "처음 파이썬을 배우는데 이 책 덕분에 정말 쉽게 이해했어요.",
          "reviewDate": "2024-05-12"
        }
      ]
    }
  }
}
```

### 도서 상세 필드

| 필드 | 타입 | DB 컬럼 | 설명 |
|---|---|---|---|
| `bookId` | String | `books.id` | 도서 고유 ID |
| `title` | String | `books.title` | 제목 |
| `coverImage` | String | `books.cover_image` | 표지 이미지 URL |
| `author` | String | `books.author` | 저자 |
| `publisher` | String | `books.publisher` | 출판사 |
| `publishedDate` | String | `books.published_date` | 출간일 (ISO 형식: `YYYY-MM-DD`) |
| `listPrice` | Integer | `books.list_price` | 정가 (원 단위) |
| `salePrice` | Integer | `books.sale_price` | 판매가 (원 단위) |
| `stocks` | Integer | `books.stocks` | 재고 수량 |
| `categoryName` | String | `categories.name` (JOIN) | 카테고리명 (예: `IT/컴퓨터`) |
| `description` | String | `books.description` | 책 소개 |
| `reviewList` | Object | — | 리뷰 페이징 객체 |

### reviewList 메타 필드

| 필드 | 타입 | 설명 |
|---|---|---|
| `totalCount` | Integer | 전체 리뷰 개수 |
| `page` | Integer | 현재 페이지 (0부터 시작) |
| `size` | Integer | 페이지당 리뷰 수 |
| `totalPages` | Integer | 전체 페이지 수 (`ceil(totalCount / size)`, 리뷰 없으면 0) |
| `items` | Array | 해당 페이지 리뷰 목록 |

### 리뷰 항목 (items[])

| 필드 | 타입 | 설명 |
|---|---|---|
| `reviewId` | Long | 리뷰 고유 ID (내부 식별자) |
| `reviewerName` | String | 작성자명 |
| `rating` | Integer | 별점 (0~5 정수) |
| `content` | String | 리뷰 본문 |
| `reviewDate` | String | 작성일 (ISO 형식: `YYYY-MM-DD`) |

### 리뷰 처리 규칙

- 정렬: 작성일 내림차순 (최신순)
- 리뷰 데이터가 없는 경우 `totalCount: 0`, `totalPages: 0`, `items: []` 반환 (오류 없음)
- Review 물리 DB 테이블은 추후 생성 예정 — 현 단계에서 데이터 없으면 빈 목록 반환

---

## 3. 에러 응답

### 존재하지 않는 bookId

**HTTP Status:** `404 Not Found`

```json
{
  "success": false,
  "code": "BOOK_NOT_FOUND",
  "message": "존재하지 않는 도서입니다."
}
```

### 서버 오류

**HTTP Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "code": "INTERNAL_ERROR",
  "message": "서버 오류가 발생했습니다."
}
```

---

## 4. 인증 방식

- 인증 토큰 불필요.
- SecurityConfig에서 `/api/books/**` 경로를 `permitAll()`로 허용한다.

---

## 5. 네이밍 정규화 (bookDetail.md PRD 대비 변경 사항)

| 원본 (bookDetail.md PRD) | 확정 | 변경 이유 |
|---|---|---|
| `{code, data}` 래핑 | `{success, data}` 래핑 | 기존 ApiResponse 규약 준수 |
| `reviewList: [...]` (단순 배열) | `reviewList: { totalCount, page, size, totalPages, items }` (페이징 객체) | 프론트 페이지네이션 UI 구성에 필요한 메타 포함 (`totalPages` 포함) |
| PRD에 없던 `categoryName` | 추가 | 디자인 카테고리 뱃지 렌더링에 필요 (`categories.name` JOIN) |
| PRD의 `authorName` | `reviewerName` | 작성자 의미 명확화, camelCase 통일 |
| PRD의 `createdAt` | `reviewDate` | 리뷰 도메인 맥락 명확화 |
