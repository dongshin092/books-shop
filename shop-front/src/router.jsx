import { createBrowserRouter, Navigate } from 'react-router'
import { MainLayout } from '@/layouts/MainLayout/MainLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'
import HealthCheck from '@/pages/HealthCheck'
import { LoginPage } from '@/pages/Login/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 공개 라우트
      { path: 'login', element: <LoginPage /> },

      // 보호 라우트: isAuthenticated가 false면 /login으로 리다이렉트
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HealthCheck /> },
        ],
      },
    ],
  },
])
