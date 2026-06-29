import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import styles from './UserMenu.module.css'

export function UserMenu() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleProfile = () => {
    setOpen(false)
    navigate('/profile')
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/')
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.name}>{user?.names}</span>
        <span className={styles.caret}>▾</span>
      </button>

      {open && (
        <div className={styles.menu}>
          <button type="button" className={styles.item} onClick={handleProfile}>
            프로필
          </button>
          <button type="button" className={styles.item} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
