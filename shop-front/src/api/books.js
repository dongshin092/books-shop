import api from './client'

// GET /api/books — 메인페이지 5개 섹션 × Top5 도서 목록
export async function fetchMainBooks() {
  const { data } = await api.get('/books')
  return data.data
}
