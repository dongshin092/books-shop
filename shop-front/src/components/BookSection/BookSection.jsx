import styles from './BookSection.module.css'
import { BookCard } from '@/components/BookCard/BookCard'

export function BookSection({ title, books }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.grid}>
        {books.length === 0 ? (
          <p className={styles.empty}>등록된 도서가 없습니다.</p>
        ) : (
          books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </section>
  )
}
