import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchCarts, updateCartQuantity, deleteCartItems } from '@/api/carts'

export function useCarts() {
  return useQuery({
    queryKey: ['carts'],
    queryFn: fetchCarts,
    retry: 1,
  })
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
  })
}

export function useDeleteCartItems() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCartItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
  })
}
