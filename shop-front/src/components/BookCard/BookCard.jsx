import styles from './BookCard.module.css'

export function BookCard({ book }) {
  const formattedPrice = book.salePrice.toLocaleString('ko-KR') + '원'

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={book.coverImage}
          alt={book.title}
          className={styles.image}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <p className={styles.title}>{book.title}</p>
      <p className={styles.author}>{book.author}</p>
      <p className={styles.price}>{formattedPrice}</p>
    </div>
  )
}
