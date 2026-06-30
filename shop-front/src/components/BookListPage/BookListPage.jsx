import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { BOOK_CATEGORIES } from '@/mocks/bookList'
import styles from './BookListPage.module.css'

const PAGE_SIZE = 10

const SORT_OPTIONS = [
  { key: 'popular', label: '인기순' },
  { key: 'newest', label: '최신순' },
  { key: 'priceLow', label: '낮은가격순' },
  { key: 'priceHigh', label: '높은가격순' },
  { key: 'review', label: '리뷰많은순' },
]

function sortBooks(books, sortKey) {
  const sorted = [...books]
  switch (sortKey) {
    case 'popular':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'newest':
      return sorted.sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    case 'priceLow':
      return sorted.sort((a, b) => a.salePrice - b.salePrice)
    case 'priceHigh':
      return sorted.sort((a, b) => b.salePrice - a.salePrice)
    case 'review':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    default:
      return sorted
  }
}

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
        <button className={styles.cartBtn} onClick={handleAuthRequired}>
          장바구니
        </button>
        <button className={styles.buyBtn} onClick={handleAuthRequired}>
          바로구매
        </button>
        <button className={styles.listBtn} onClick={handleAuthRequired}>
          리스트에 담기
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
  const [sortKey, setSortKey] = useState('popular')
  const [page, setPage] = useState(0)

  const category = BOOK_CATEGORIES[categoryKey]
  const allBooks = category?.books ?? []

  const sortedBooks = useMemo(() => sortBooks(allBooks, sortKey), [allBooks, sortKey])
  const totalPages = Math.ceil(sortedBooks.length / PAGE_SIZE)
  const pageBooks = sortedBooks.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSort(key) {
    setSortKey(key)
    setPage(0)
  }

  function handlePageChange(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
          <span className={styles.totalBadge}>총 {allBooks.length}권</span>
        </div>
        <div className={styles.sortTabs}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`${styles.sortTab} ${sortKey === opt.key ? styles.sortTabActive : ''}`}
              onClick={() => handleSort(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 도서 목록 */}
      <div className={styles.bookList}>
        {pageBooks.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}
