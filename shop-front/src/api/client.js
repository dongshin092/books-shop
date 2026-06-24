import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const api = axios.create({
  baseURL: '/api',
})

// 요청 인터셉터: accessToken이 있으면 Authorization 헤더 자동 첨부
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 응답 인터셉터: 401 응답 시 logout 후 /login 리다이렉트
// 단, 로그인 요청(/auth/login) 자체의 401은 LoginForm이 직접 처리하므로 제외한다.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url === '/auth/login'
    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
