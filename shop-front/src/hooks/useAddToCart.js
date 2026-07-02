import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAddCart } from '@/hooks/queries/useCarts'

// 도서 상세·목록 화면 공용 "장바구니 담기" 흐름.
// 비로그인 → 로그인 이동 확인, 담기 성공 → 장바구니 이동 확인.
export function useAddToCart() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { mutate, isPending } = useAddCart()

  function addToCart(bookId) {
    if (!isAuthenticated) {
      if (window.confirm('로그인이 필요한 기능입니다. 로그인하시겠습니까?')) {
        navigate('/login')
      }
      return
    }

    mutate(bookId, {
      onSuccess: () => {
        if (window.confirm('장바구니에 담았습니다. 장바구니로 이동하시겠습니까?')) {
          navigate('/cart')
        }
      },
      onError: () => {
        alert('장바구니 담기에 실패했습니다. 잠시 후 다시 시도해 주세요.')
      },
    })
  }

  return { addToCart, isPending }
}
