import api from './client'

// POST /api/auth/login
// 성공 응답: { success: true, data: { accessToken, tokenType, expiresIn, user: {userId, names, roles} } }
export async function loginRequest(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data.data // ApiResponse 래핑 벗기기
}

// GET /api/auth/me
// 성공 응답: { success: true, data: { userId, names, roles } }
export async function fetchMe() {
  const { data } = await api.get('/auth/me')
  return data.data
}
