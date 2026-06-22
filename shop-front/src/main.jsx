import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'
import HealthCheck from './pages/HealthCheck'
import './index.css'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <HealthCheck />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)