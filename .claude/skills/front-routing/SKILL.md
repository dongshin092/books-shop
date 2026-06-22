---
name: front-routing
description: >
  shop-front에서 새 페이지를 추가하거나 라우팅(페이지 이동) 구조를 수정할 때 반드시 사용한다.
  react-router v7 기반 라우트 등록 규칙과 페이지 추가 절차를 정의한다.
  "페이지 추가", "새 화면 라우트", "URL 경로", "페이지 이동", "네비게이션", "활성 메뉴 스타일",
  router, route, NavLink, Link, navigate 같은 작업이 나오면 이 스킬을 적용한다.
---

# front-routing (react-router v7 규칙)

shop-front는 react-router v7을 **데이터 라우터(`createBrowserRouter`)** 방식으로 쓴다.
import는 모두 `react-router` 패키지에서 한다(v7에서 통합됨, `react-router-dom` 별도 import 금지).
프론트는 순수 JavaScript(.jsx)로 작성한다.

## 라우트 정의 위치 (고정)
- `src/router.jsx` — 라우트 정의 1곳에 모은다.
- 페이지 컴포넌트는 `src/pages/<PageName>/<PageName>.jsx`.

## 페이지 추가 절차
1. `src/pages/<PageName>/`에 페이지 컴포넌트를 만든다(스타일은 front-ui-component 규칙을 따른다).
2. `src/router.jsx`의 라우트 배열에 항목을 추가한다.
3. 페이지 이동은 아래 규칙대로 한다. `<a href>` 직접 사용 금지.

## 링크 컴포넌트 선택 (중요)
- **`NavLink`를 기본으로 쓴다.** 메뉴/네비게이션처럼 "현재 페이지 여부에 따라 스타일을 다르게 줄 가능성"이 있는 링크는 모두 `NavLink`로 작성한다.
- `Link`는 활성 상태 표시가 전혀 필요 없는 단순 본문 링크에만 쓴다.
- 코드(이벤트 핸들러 등)에서 이동할 때는 `useNavigate()`를 쓴다.
- `NavLink`의 `className`은 **함수 형태**(`({ isActive }) => ...`)로 받아 활성 상태에 따라 클래스를 바꾼다. 스타일은 front-ui-component 규칙(CSS Module + Tailwind v4)을 따른다.

## 표준 템플릿
`src/router.jsx`
```jsx
import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/Home/Home'
import { BookListPage } from '@/pages/BookList/BookList'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/books',
    element: <BookListPage />,
  },
])
```

`src/main.jsx` (진입부, 최초 1회)
```jsx
import { RouterProvider } from 'react-router'
import { router } from './router'

// <RouterProvider router={router} />
```

## 이동/링크 예시

### NavLink + CSS Module (활성 상태 스타일)
`Nav.module.css`
```css
@reference "@/styles/index.css";

.link {
  @apply px-3 py-2 text-gray-600;
}
.link.active {
  @apply font-bold text-blue-600;
}
```

`Nav.jsx`
```jsx
import { NavLink, useNavigate } from 'react-router'
import styles from './Nav.module.css'

function Nav() {
  const navigate = useNavigate()
  return (
    <nav>
      {/* isActive에 따라 active 클래스를 덧붙인다 */}
      <NavLink
        to="/books"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        도서 목록
      </NavLink>

      <button onClick={() => navigate('/')}>홈으로</button>
    </nav>
  )
}
```

### NavLink + Tailwind 유틸리티만 쓰는 경우
```jsx
<NavLink
  to="/books"
  className={({ isActive }) =>
    isActive ? 'font-bold text-blue-600' : 'text-gray-600'
  }
>
  도서 목록
</NavLink>
```

### 단순 본문 링크(활성 표시 불필요)
```jsx
import { Link } from 'react-router'

<Link to="/books">도서 목록 보기</Link>
```

## 규칙 요약
- import는 항상 `react-router`에서.
- 라우트는 `src/router.jsx` 한 곳에서만 관리한다.
- 페이지 컴포넌트는 `src/pages/` 아래, 라우트 경로와 일관된 이름으로 둔다.
- 네비게이션 링크는 `NavLink`를 기본으로 쓰고, `className`은 `({ isActive }) => ...` 함수로 활성 스타일을 부여한다.
- 활성 표시가 필요 없는 단순 링크에만 `Link`를 쓴다.