import { useState } from 'react'
import { useParams } from 'react-router'
import { useBookDetail } from '@/hooks/queries/useBooks'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAddToCart } from '@/hooks/useAddToCart'
import styles from './BookDetail.module.css'

function formatDate(iso) {
  if (!iso) return ''
  return iso.replace(/-/g, '.')
}

function discountRate(listPrice, salePrice) {
  if (!listPrice || listPrice <= salePrice) return 0
  return Math.round(((listPrice - salePrice) / listPrice) * 100)
}

function StarRating({ rating }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </span>
  )
}

function ReviewItem({ review }) {
  const initial = review.reviewerName?.charAt(0) ?? '?'
  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <div className={styles.avatar}>{initial}</div>
        <div className={styles.reviewMeta}>
          <span className={styles.reviewerName}>{review.reviewerName}</span>
          <span className={styles.reviewDate}>{formatDate(review.reviewDate)}</span>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className={styles.reviewContent}>{review.content}</p>
    </div>
  )
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        &lt;
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
      >
        &gt;
      </button>
    </div>
  )
}

export function BookDetailPage() {
  const { bookId } = useParams()
  const [page, setPage] = useState(0)
  const size = 10

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: book, isPending, isError } = useBookDetail(bookId, page, size)
  const { addToCart, isPending: isAdding } = useAddToCart()

  function handleAuthRequired() {
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.')
    }
  }

  if (isPending) {
    return <div className={styles.statusMessage}>불러오는 중…</div>
  }

  if (isError || !book) {
    return <div className={styles.statusMessage}>도서 정보를 불러올 수 없습니다.</div>
  }

  const rate = discountRate(book.listPrice, book.salePrice)
  const reviewList = book.reviewList ?? { totalCount: 0, page: 0, size, totalPages: 0, items: [] }

  return (
    <div className={styles.page}>
      {/* 도서 상단 정보 */}
      <section className={styles.topSection}>
        <div className={styles.coverWrapper}>
          <img
            src={book.coverImage}
            alt={book.title}
            className={styles.coverImage}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        <div className={styles.infoWrapper}>
          {book.categoryName && (
            <span className={styles.categoryBadge}>{book.categoryName}</span>
          )}
          <h1 className={styles.title}>{book.title}</h1>

          <dl className={styles.metaList}>
            <div className={styles.metaRow}>
              <dt>저자</dt>
              <dd>{book.author}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>출판사</dt>
              <dd>{book.publisher}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>출간일</dt>
              <dd>{formatDate(book.publishedDate)}</dd>
            </div>
          </dl>

          <div className={styles.priceBlock}>
            {rate > 0 && (
              <p className={styles.listPrice}>
                정가 {book.listPrice.toLocaleString('ko-KR')}원
              </p>
            )}
            <div className={styles.salePriceRow}>
              {rate > 0 && (
                <span className={styles.discountBadge}>{rate}% 할인</span>
              )}
              <span className={styles.salePrice}>
                {book.salePrice.toLocaleString('ko-KR')}원
              </span>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button
              className={styles.cartBtn}
              onClick={() => addToCart(book.bookId)}
              disabled={isAdding}
            >
              장바구니
            </button>
            <button
              className={styles.buyBtn}
              onClick={handleAuthRequired}
            >
              바로구매
            </button>
          </div>
        </div>
      </section>

      {/* 책 소개 */}
      <section className={styles.descSection}>
        <h2 className={styles.sectionTitle}>책 소개</h2>
        <div className={styles.descContent}>
          {book.description}
        </div>
      </section>

      {/* 독자 리뷰 */}
      <section className={styles.reviewSection}>
        <div className={styles.reviewTitleRow}>
          <h2 className={styles.sectionTitle}>독자 리뷰</h2>
          <span className={styles.reviewCount}>총 {reviewList.totalCount}개</span>
        </div>

        {reviewList.items.length === 0 ? (
          <p className={styles.emptyReview}>아직 작성된 리뷰가 없습니다.</p>
        ) : (
          <>
            <div className={styles.reviewList}>
              {reviewList.items.map((review) => (
                <ReviewItem key={review.reviewId} review={review} />
              ))}
            </div>
            <Pagination
              page={reviewList.page}
              totalPages={reviewList.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  )
}
