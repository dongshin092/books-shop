import api from './client'

// GET /api/books — 메인페이지 5개 섹션 × Top5 도서 목록
export async function fetchMainBooks() {
  const { data } = await api.get('/books')
  return data.data
}

// GET /api/books/{bookId}?page={page}&size={size} — 도서 상세 + 리뷰 페이징
export async function fetchBookDetail(bookId, page = 0, size = 10) {
  const { data } = await api.get(`/books/${bookId}`, { params: { page, size } })
  return data.data
}
