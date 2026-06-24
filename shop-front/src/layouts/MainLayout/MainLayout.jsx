import { NavLink, Outlet } from 'react-router'
import styles from './MainLayout.module.css'

const navClass = ({ isActive }) =>
  `${styles.link} ${isActive ? styles.active : ''}`

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.brand}>books-shop</span>
        <nav className={styles.nav}>
          <NavLink to="/" end className={navClass}>홈</NavLink>
        </nav>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
