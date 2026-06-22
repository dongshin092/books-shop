import axios from 'axios'

// axios 로 /api/health 호출 (개발 모드에선 Vite proxy 가 8080 으로 전달).
export async function fetchHealth() {
  const { data } = await axios.get('/api/health')
  return data
}