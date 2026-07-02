import api from './client'

// GET /api/carts — 장바구니 목록
export async function fetchCarts() {
  const { data } = await api.get('/carts')
  return data.data
}

// POST /api/carts — 장바구니 담기 (수량 1 고정, 동일 도서면 서버에서 수량 +1)
export async function addCart(bookId) {
  const { data } = await api.post('/carts', { bookId, quantity: 1 })
  return data
}

// PUT /api/carts — 장바구니 아이템 수량 변경
export async function updateCartQuantity({ itemId, quantity }) {
  const { data } = await api.put('/carts', { itemId, quantity })
  return data
}

// DELETE /api/carts?items=1,2,3 — 장바구니 아이템 삭제
export async function deleteCartItems(itemIds) {
  const { data } = await api.delete('/carts', { params: { items: itemIds.join(',') } })
  return data
}
