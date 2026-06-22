# books-shop

도서 판매 사이트의 **초기 골격(스캐폴딩)** 프로젝트입니다.
비즈니스 로직과 실제 화면은 포함하지 않으며, 빌드·실행이 되는 최소 멀티 모듈 구조만 제공합니다.

## 구성

하나의 Git 저장소 안에 두 개의 모듈을 둡니다.

- `shop-back` — Spring Boot 4.x 백엔드 (REST API, JDK 21, 포트 8080)
- `shop-front` — React 19 + Vite + JavaScript 프론트엔드 (개발 서버 포트 3000)

루트는 Gradle 멀티 프로젝트로, `shop-front` 빌드 결과물을 `shop-back` 의 static 으로 포함해
**단일 실행 jar** 로 프론트 + API 를 함께 서빙합니다.

## 환경 요구사항

- JDK 21
- Node.js v24.15.0
- (Gradle 은 별도 설치 불필요 — Gradle Wrapper 가 9.6.0 을 자동으로 내려받습니다.)

## 검증용 기능

- 백엔드: `GET /api/health` → `{"status":"ok"}` (인증 없이 허용)
- 프론트: 첫 화면에서 axios 로 `/api/health` 를 호출하고 응답의 `status` 값을 표시

---

## 개발 모드 실행법

백엔드와 프론트를 각각 띄웁니다. 프론트의 `/api` 요청은 Vite proxy 를 통해 `http://localhost:8080` 으로 전달됩니다.

### 1) 백엔드 (포트 8080)

```bash
./gradlew :shop-back:bootRun
```

### 2) 프론트 (포트 3000)

```bash
cd shop-front
npm install   # 최초 1회
npm run dev
```

브라우저에서 <http://localhost:3000> 접속 → 화면에 `status: ok` 가 표시되면 정상입니다.

---

## 통합 빌드 실행법

루트에서 한 번에 빌드합니다. `shop-front` 가 `npm ci` → `npm run build` 로 빌드되고,
그 결과물(`shop-front/dist`)이 `shop-back` 의 `static` 으로 복사되어 단일 jar 에 포함됩니다.

```bash
./gradlew build
```

실행:

```bash
java -jar shop-back/build/libs/shop-back-0.0.1-SNAPSHOT.jar
```

확인:

```bash
curl http://localhost:8080/api/health
# {"status":"ok"}
```

> 참고: 통합 jar 의 루트(`/`) 정적 페이지는 현재 Spring Security 최소 설정상
> 인증이 요구됩니다. 본 골격은 PRD 에 명시된 `/api/health` 만 인증 없이 허용하도록
> 구성되어 있으며, 정적 리소스 공개 등 그 외 보안 정책은 추후 요구사항에 따라 확장합니다.
> 개발 모드(3000 + proxy)에서는 화면 검증이 정상 동작합니다.

---

## 디렉터리 구조

```
books-shop/
├─ settings.gradle              # shop-back, shop-front 서브프로젝트 포함
├─ build.gradle                 # 루트 공통 설정
├─ gradlew, gradlew.bat, gradle/  # Gradle Wrapper (9.6.0)
├─ README.md
├─ shop-back/
│  ├─ build.gradle
│  └─ src/main/java, src/main/resources, src/test/java
└─ shop-front/
   ├─ build.gradle              # node-gradle 플러그인만 적용
   ├─ package.json
   ├─ vite.config.js
   ├─ index.html
   └─ src/
```
