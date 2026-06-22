import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/health'
import { useHealthStore } from '../store/healthStore'
import styles from './HealthCheck.module.css'

// 검증용 화면: /api/health 응답의 status 값을 표시한다.
export default function HealthCheck() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  })

  const setStatus = useHealthStore((s) => s.setStatus)

  useEffect(() => {
    if (data?.status) {
      setStatus(data.status)
    }
  }, [data, setStatus])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>books-shop</h1>
      {isLoading && <p className={styles.status}>loading...</p>}
      {isError && <p className={styles.error}>health 호출 실패</p>}
      {data && <p className={styles.status}>status: {data.status}</p>}
    </div>
  )
}