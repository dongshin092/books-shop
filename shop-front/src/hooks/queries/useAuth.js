import { useMutation, useQuery } from '@tanstack/react-query'
import { loginRequest, fetchMe } from '@/api/auth'

export function useLogin() {
  return useMutation({
    mutationFn: (payload) => loginRequest(payload),
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  })
}
