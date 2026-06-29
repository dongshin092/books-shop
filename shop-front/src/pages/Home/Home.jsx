import styles from './Home.module.css'
import { useMainBooks } from '@/hooks/queries/useBooks'
import { BookSection } from '@/components/BookSection/BookSection'

const SECTIONS = [
  { key: 'bestTopN', label: '베스트셀러 Top 5' },
  { key: 'newTopN',  label: '신간 Top 5' },
  { key: 'itTopN',   label: 'IT 서적 Top 5' },
  { key: 'novelTopN',label: '소설 Top 5' },
  { key: 'selfTopN', label: '자기계발서 Top 5' },
]

export function HomePage() {
  const { data, isPending, isError, error } = useMainBooks()

  if (isPending) return <div className={styles.loading}>불러오는 중…</div>
  if (isError) return <div className={styles.error}>데이터를 불러오지 못했습니다. ({error.message})</div>

  return (
    <div className={styles.container}>
      {SECTIONS.map(({ key, label }) => (
        <BookSection key={key} title={label} books={data[key] ?? []} />
      ))}
    </div>
  )
}
