import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useLogin } from '@/hooks/queries/useAuth'
import { useAuthStore } from '@/stores/useAuthStore'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [userId, setUserId] = useState('')
  const [passwd, setPasswd] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const { mutate: login, isPending } = useLogin()

  const validate = () => {
    const errors = {}
    if (!userId.trim()) errors.userId = 'userId를 입력하세요.'
    if (!passwd.trim()) errors.passwd = '비밀번호를 입력하세요.'
    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setServerError('')

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    login(
      { userId, passwd },
      {
        onSuccess: (data) => {
          setAuth({ accessToken: data.accessToken, user: data.user })
          const from = location.state?.from?.pathname ?? '/'
          navigate(from, { replace: true })
        },
        onError: (error) => {
          const msg =
            error.response?.data?.message ?? '로그인 중 오류가 발생했습니다.'
          setServerError(msg)
        },
      },
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>

        {serverError && (
          <p className={styles.errorBanner}>{serverError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="userId" className={styles.label}>
              아이디
            </label>
            <input
              id="userId"
              type="text"
              className={styles.input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isPending}
              autoComplete="username"
            />
            {fieldErrors.userId && (
              <p className={styles.errorText}>{fieldErrors.userId}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="passwd" className={styles.label}>
              비밀번호
            </label>
            <input
              id="passwd"
              type="password"
              className={styles.input}
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              disabled={isPending}
              autoComplete="current-password"
            />
            {fieldErrors.passwd && (
              <p className={styles.errorText}>{fieldErrors.passwd}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isPending}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className={styles.footer}>
          계정이 없으신가요?
          <Link to="/signup" className={styles.signupLink}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
