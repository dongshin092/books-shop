import { NavLink, Link, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { UserMenu } from '@/components/UserMenu/UserMenu'
import styles from './MainLayout.module.css'

const navClass = ({ isActive }) =>
  `${styles.link} ${isActive ? styles.active : ''}`

const menus = [
  { to: '/', label: 'Home', end: true },
  { to: '/it', label: 'IT 서적' },
  { to: '/novel', label: '소설' },
  { to: '/self-development', label: '자기개발서' },
]

export function MainLayout() {
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {menus.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Link
            to="/login"
            state={{ from: location }}
            className={styles.loginButton}
          >
            로그인
          </Link>
        )}
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
