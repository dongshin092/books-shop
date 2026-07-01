import { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './Cart.module.css'
import { useCarts, useUpdateCartQuantity, useDeleteCartItems } from '@/hooks/queries/useCarts'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function formatWon(amount) {
  return amount.toLocaleString('ko-KR') + '원'
}

export function CartPage() {
  const navigate = useNavigate()
  const { data, isPending, isError } = useCarts()
  const updateQuantity = useUpdateCartQuantity()
  const deleteItems = useDeleteCartItems()
  const [selectedIds, setSelectedIds] = useState([])

  const items = data ?? []
  const allSelected = items.length > 0 && selectedIds.length === items.length

  function toggleSelectAll() {
    setSelectedIds(allSelected ? [] : items.map((item) => item.itemId))
  }

  function toggleSelect(itemId) {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    )
  }

  function handleQuantityChange(itemId, quantity) {
    if (quantity < 1) return
    updateQuantity.mutate(
      { itemId, quantity },
      {
        onSuccess: (result) => {
          if (result.code !== 200) alert(result.message)
        },
      },
    )
  }

  function handleDelete(itemId) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    deleteItems.mutate([itemId], {
      onSuccess: (result) => {
        if (result.code !== 200) {
          alert(result.message)
          return
        }
        setSelectedIds((prev) => prev.filter((id) => id !== itemId))
      },
    })
  }

  const selectedItems = items.filter((item) => selectedIds.includes(item.itemId))
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0)

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbHome}>홈</span>
        <span className={styles.breadcrumbSep}>&gt;</span>
        <span className={styles.breadcrumbCurrent}>장바구니</span>
      </div>

      <div className={styles.titleArea}>
        <h1 className={styles.title}>장바구니</h1>
        <p className={styles.subtitle}>선택한 상품을 확인하고 주문을 진행하세요.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.leftCol}>
          <div className={styles.cartHeader}>
            <div className={styles.cartTitleWrap}>
              <span className={styles.cartTitle}>장바구니</span>
              <span className={styles.cartCountBadge}>{items.length}</span>
            </div>
            <div className={styles.selectAllWrap} onClick={toggleSelectAll}>
              <span className={`${styles.checkbox} ${allSelected ? styles.checkboxChecked : ''}`}>
                {allSelected && <CheckIcon />}
              </span>
              <span className={styles.selectAllTxt}>전체 선택</span>
            </div>
          </div>

          {isPending ? (
            <p className={styles.empty}>불러오는 중…</p>
          ) : isError || items.length === 0 ? (
            <div className={styles.emptyBox}>
              <p className={styles.empty}>장바구니가 비어 있습니다.</p>
              <button type="button" className={styles.cartBtn} onClick={() => navigate('/')}>
                <ArrowLeftIcon />
                <span>쇼핑 계속하기</span>
              </button>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => {
                const checked = selectedIds.includes(item.itemId)
                return (
                  <div key={item.itemId} className={styles.item}>
                    <span
                      className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}
                      onClick={() => toggleSelect(item.itemId)}
                    >
                      {checked && <CheckIcon />}
                    </span>
                    <div className={styles.cover} />
                    <div className={styles.info}>
                      <p className={styles.itemTitle}>{item.title}</p>
                      <p className={styles.itemAuthor}>{item.author} · {item.publisher}</p>
                      <p className={styles.itemPrice}>{formatWon(item.salePrice)}</p>
                    </div>
                    <div className={styles.actions}>
                      <button type="button" className={styles.delButton} onClick={() => handleDelete(item.itemId)}>
                        <TrashIcon />
                        <span>삭제</span>
                      </button>
                      <div className={styles.qty}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className={styles.qtyNum}>{item.quantity}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.sidePanelHeader}>
            <p className={styles.sidePanelTitle}>주문 요약</p>
            {selectedItems.length === 0 ? (
              <p className={styles.priceRowLabel}>선택된 상품이 없습니다.</p>
            ) : (
              selectedItems.map((item) => (
                <div key={item.itemId} className={styles.priceRow}>
                  <span className={styles.priceRowLabel}>{item.title} × {item.quantity}</span>
                  <span className={styles.priceRowVal}>{formatWon(item.salePrice * item.quantity)}</span>
                </div>
              ))
            )}
          </div>

          <div className={styles.sideDivider} />

          <div className={styles.sideTotalWrap}>
            <div className={styles.totalRowLine}>
              <span className={styles.deliveryLabel}>배송비</span>
              <span className={styles.deliveryVal}>무료</span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>총 결제금액</span>
              <span className={styles.totalVal}>{formatWon(totalAmount)}</span>
            </div>
          </div>

          <div className={styles.sideBtnWrap}>
            <button type="button" className={styles.buyBtn}>
              <ZapIcon />
              <span>선택 상품 구매하기</span>
            </button>
            <button type="button" className={styles.cartBtn} onClick={() => navigate('/')}>
              <ArrowLeftIcon />
              <span>쇼핑 계속하기</span>
            </button>
          </div>

          <div className={styles.sideNotice}>
            <InfoIcon />
            <span>3만원 이상 구매 시 무료 배송</span>
          </div>
        </div>
      </div>
    </div>
  )
}
