import { useState } from 'react'
import { Link } from 'react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCategoryBooks } from '@/hooks/queries/useBooks'
import { useAddToCart } from '@/hooks/useAddToCart'
import styles from './BookListPage.module.css'

const CATEGORIES = {
  it: { types: 'IT', label: 'IT 서적' },
  novel: { types: 'NOVEL', label: '소설' },
  'self-development': { types: 'SELF', label: '자기개발서' },
}

const SORT_OPTIONS = [
  { key: 'new', label: '최신순' },
  { key: 'lower', label: '낮은가격순' },
  { key: 'high', label: '높은가격순' },
  { key: 'reviewCnt', label: '리뷰많은순' },
]

const PAGE_SIZE = 10

function StarDisplay({ rating }) {
  // rating은 10점 만점 → 5개 별로 표시
  const filled = Math.round(rating / 2)
  return (
    <span className={styles.starsText}>
      {'★'.repeat(filled)}{'☆'.repeat(5 - filled)}
    </span>
  )
}

function BookItem({ book }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { addToCart, isPending: isAdding } = useAddToCart()

  function handleAuthRequired() {
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.')
    }
  }

  const discountRate =
    book.listPrice && book.listPrice > book.salePrice
      ? Math.round(((book.listPrice - book.salePrice) / book.listPrice) * 100)
      : 0

  return (
    <div className={styles.bookItem}>
      {/* 표지 */}
      <div className={styles.coverWrapper}>
        <img
          src={book.coverImage}
          alt={book.title}
          className={styles.coverImage}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* 도서 정보 */}
      <div className={styles.bookInfo}>
        {book.badge && (
          <div className={styles.badgeRow}>
            {book.badge === 'BEST' && <span className={styles.badgeBest}>베스트</span>}
            {book.badge === 'NEW' && <span className={styles.badgeNew}>신간</span>}
          </div>
        )}

        <Link to={`/books/${book.id}`} className={styles.bookTitle}>
          {book.title}
        </Link>

        <p className={styles.bookSubtitle}>{book.subtitle}</p>

        <p className={styles.bookMeta}>
          {book.author} &nbsp;|&nbsp; {book.publisher} &nbsp;|&nbsp; {book.publishedDate}
        </p>

        <div className={styles.ratingRow}>
          <StarDisplay rating={book.rating} />
          <span className={styles.ratingScore}>{book.rating}</span>
          <span className={styles.reviewCount}>(리뷰 {book.reviewCount.toLocaleString('ko-KR')}건)</span>
        </div>

        <div className={styles.priceRow}>
          {discountRate > 0 && (
            <span className={styles.listPrice}>
              정가 {book.listPrice.toLocaleString('ko-KR')}원
            </span>
          )}
          {discountRate > 0 && (
            <span className={styles.discountRate}>{discountRate}%</span>
          )}
          <span className={styles.salePrice}>
            {book.salePrice.toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className={styles.actions}>
        <button
          className={styles.cartBtn}
          onClick={() => addToCart(book.id)}
          disabled={isAdding}
        >
          장바구니
        </button>
        <button className={styles.buyBtn} onClick={handleAuthRequired}>
          바로구매
        </button>
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // 최대 5개 페이지 번호 표시
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(0, page - half)
  const end = Math.min(totalPages - 1, start + maxVisible - 1)
  if (end - start < maxVisible - 1) {
    start = Math.max(0, end - maxVisible + 1)
  }
  const visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className={styles.pagination}>
      {/* 처음 */}
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(0)}
        disabled={page === 0}
        aria-label="처음 페이지"
      >
        «
      </button>
      {/* 이전 */}
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}

      {/* 다음 */}
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        aria-label="다음 페이지"
      >
        ›
      </button>
      {/* 끝 */}
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(totalPages - 1)}
        disabled={page === totalPages - 1}
        aria-label="끝 페이지"
      >
        »
      </button>
    </div>
  )
}

export function BookListPage({ categoryKey }) {
  const [orderType, setOrderType] = useState('new')
  const [page, setPage] = useState(0)

  const category = CATEGORIES[categoryKey]
  const { data, isPending, isError, error } = useCategoryBooks(category?.types, {
    page,
    size: PAGE_SIZE,
    orderType,
  })

  function handleSort(key) {
    setOrderType(key)
    setPage(0)
  }

  function handlePageChange(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 0
  const books = data?.items ?? []

  return (
    <div className={styles.page}>
      {/* 브레드크럼 */}
      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        <Link to="/" className={styles.breadcrumbLink}>홈</Link>
        <span className={styles.breadcrumbSep}>&gt;</span>
        <span className={styles.breadcrumbSep}>도서</span>
        <span className={styles.breadcrumbSep}>&gt;</span>
        <span className={styles.breadcrumbCurrent}>{category?.label}</span>
      </nav>

      {/* 헤더: 제목 + 정렬 탭 */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.categoryTitle}>{category?.label}</h1>
          <span className={styles.totalBadge}>총 {totalCount}권</span>
        </div>
        <div className={styles.sortTabs}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`${styles.sortTab} ${orderType === opt.key ? styles.sortTabActive : ''}`}
              onClick={() => handleSort(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isPending && <p className={styles.bookMeta}>불러오는 중…</p>}
      {isError && <p className={styles.bookMeta}>데이터를 불러오지 못했습니다. ({error.message})</p>}

      {!isPending && !isError && (
        <>
          {/* 도서 목록 */}
          <div className={styles.bookList}>
            {books.map((book) => (
              <BookItem key={book.id} book={book} />
            ))}
          </div>

          {/* 페이지네이션 */}
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}
