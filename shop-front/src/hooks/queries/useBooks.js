import { useQuery } from '@tanstack/react-query'
import { fetchMainBooks } from '@/api/books'

export function useMainBooks() {
  return useQuery({
    queryKey: ['books', 'main'],
    queryFn: fetchMainBooks,
  })
}
