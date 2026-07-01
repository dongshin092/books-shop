import api from './client'

// GET /api/carts — 장바구니 목록
export async function fetchCarts() {
  const { data } = await api.get('/carts')
  return data.data
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
