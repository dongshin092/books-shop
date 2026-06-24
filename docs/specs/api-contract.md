# API 계약 — 로그인 기능

> **이 문서는 백엔드·프론트엔드가 공유하는 단일 계약이다.**  
> PRD `docs/login.md` 5절을 기반으로 하되, 프로젝트 공통 응답 규약(스킬 `backend-api-response`)을 적용하여 재정의했다.  
> 변경이 필요하면 백엔드·프론트 양측 합의 후 이 파일을 갱신한다.

---

## 공통 규칙

### 성공 응답 — ApiResponse 래핑

모든 성공 응답은 `ApiResponse<T>` 형태로 래핑된다.

```json
{
  "success": true,
  "data": { ... }
}
```

### 에러 응답 — ErrorResponse

> **PRD 5.3과의 차이:** PRD 5.3은 에러 응답을 `{ "code": string, "message": string }` 형태로 정의하지만,  
> 프로젝트 공통 규약(`backend-api-response` 스킬)에 따라 `success: false` 필드가 추가된다.

모든 에러 응답은 아래 형태로 통일된다.

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "사용자에게 보여줄 메시지"
}
```

### 인증 방식

- `Authorization: Bearer <accessToken>` 헤더를 사용한다.
- 세션 정책: `STATELESS` (서버에 세션 저장 없음)

### CORS

- 허용 Origin: `http://localhost:3000` (Vite dev 서버 포트)
- 허용 헤더: `Content-Type`, `Authorization`
- 허용 메서드: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

---

## POST /api/auth/login

로그인 — userId/passwd로 인증하고 JWT를 발급한다.

- **인증 불필요** (permitAll)

### Request

```
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "userId": "hong123",
  "passwd": "plaintext_password"
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| userId | string | Y | 로그인 ID |
| passwd | string | Y | 평문 비밀번호 (서버에서 bcrypt 검증) |

### Response 200 — 로그인 성공

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "userId": "hong123",
      "names": "홍길동",
      "roles": "USER"
    }
  }
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| data.accessToken | string | JWT Access Token |
| data.tokenType | string | 항상 `"Bearer"` |
| data.expiresIn | number | 만료까지 남은 시간 (초 단위, 3600) |
| data.user.userId | string | 사용자 ID |
| data.user.names | string | 사용자 이름 |
| data.user.roles | string | 권한 (`"USER"` 또는 `"ADMIN"`) |

### Response 401 — 인증 실패

아이디 없음/비밀번호 틀림 모두 동일한 메시지로 응답한다 (보안상 구분 불가).

```json
{
  "success": false,
  "code": "AUTH_FAILED",
  "message": "아이디 또는 비밀번호가 올바르지 않습니다."
}
```

### Response 400 — 입력값 오류

userId 또는 passwd가 누락된 경우.

```json
{
  "success": false,
  "code": "INVALID_INPUT",
  "message": "userId와 passwd는 필수입니다."
}
```

---

## GET /api/auth/me

현재 토큰의 사용자 정보를 반환한다. 앱 진입 시 토큰 유효성 확인 용도로 사용한다.

- **인증 필요** (`Authorization: Bearer <accessToken>` 헤더 필수)

### Request

```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### Response 200 — 성공

```json
{
  "success": true,
  "data": {
    "userId": "hong123",
    "names": "홍길동",
    "roles": "USER"
  }
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| data.userId | string | 사용자 ID |
| data.names | string | 사용자 이름 |
| data.roles | string | 권한 (`"USER"` 또는 `"ADMIN"`) |

### Response 401 — 토큰 없음 / 만료 / 위변조

```json
{
  "success": false,
  "code": "TOKEN_INVALID",
  "message": "유효하지 않은 토큰입니다."
}
```

---

## JWT Claims 구조

서버가 발급하는 JWT의 payload:

```json
{
  "sub": "hong123",
  "names": "홍길동",
  "roles": "USER",
  "iat": 1700000000,
  "exp": 1700003600
}
```

- 알고리즘: `HS256`
- 시크릿 키: 환경변수 `JWT_SECRET` (256bit 이상, 코드 하드코딩 금지)
- 만료: 3600초 (환경변수 `JWT_EXPIRATION_SECONDS`로 조정 가능)

---

## 에러 코드 목록

| code | HTTP 상태 | 설명 |
|---|---|---|
| AUTH_FAILED | 401 | 아이디 없음 또는 비밀번호 불일치 |
| TOKEN_INVALID | 401 | 토큰 없음, 만료, 위변조 |
| INVALID_INPUT | 400 | 필수 입력값 누락 또는 형식 오류 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |
