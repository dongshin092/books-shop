import { useQuery } from '@tanstack/react-query'
import { fetchMainBooks, fetchBookDetail, fetchCategoryBooks } from '@/api/books'

export function useMainBooks() {
  return useQuery({
    queryKey: ['books', 'main'],
    queryFn: fetchMainBooks,
  })
}

export function useBookDetail(bookId, page = 0, size = 10) {
  return useQuery({
    queryKey: ['books', bookId, { page, size }],
    queryFn: () => fetchBookDetail(bookId, page, size),
    enabled: !!bookId,
  })
}

export function useCategoryBooks(types, { page = 0, size = 10, orderType = 'new' } = {}) {
  return useQuery({
    queryKey: ['books', 'categories', types, { page, size, orderType }],
    queryFn: () => fetchCategoryBooks(types, { page, size, orderType }),
    enabled: !!types,
  })
}
