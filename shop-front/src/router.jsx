import { createBrowserRouter } from 'react-router'
import { MainLayout } from '@/layouts/MainLayout/MainLayout'
import { HomePage } from '@/pages/Home/Home'
import { ItBooksPage } from '@/pages/ItBooks/ItBooks'
import { NovelPage } from '@/pages/Novel/Novel'
import { SelfDevelopmentPage } from '@/pages/SelfDevelopment/SelfDevelopment'
import { LoginPage } from '@/pages/Login/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'it', element: <ItBooksPage /> },
      { path: 'novel', element: <NovelPage /> },
      { path: 'self-development', element: <SelfDevelopmentPage /> },
    ],
  },

  // 헤더 없는 독립 페이지
  { path: '/login', element: <LoginPage /> },
])
