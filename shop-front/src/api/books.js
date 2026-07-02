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

// GET /api/books/categories/{types}?page&size&orderType — 카테고리별 도서 목록 페이징
// 응답 필드(bookId, reviewRating)를 화면이 쓰는 필드(id, rating)로 매핑해서 반환한다.
export async function fetchCategoryBooks(types, { page = 0, size = 10, orderType = 'new' } = {}) {
  const { data } = await api.get(`/books/categories/${types}`, { params: { page, size, orderType } })
  const { items, ...rest } = data.data
  return {
    ...rest,
    items: items.map(({ bookId, reviewRating, ...item }) => ({
      ...item,
      id: bookId,
      rating: reviewRating,
    })),
  }
}
