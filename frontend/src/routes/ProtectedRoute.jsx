import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Logo } from '@/components/common/Logo'

function BootSplash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink">
      <Logo size="md" />
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, bootstrapped } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!bootstrapped) return <BootSplash />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}