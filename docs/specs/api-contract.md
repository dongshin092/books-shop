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
