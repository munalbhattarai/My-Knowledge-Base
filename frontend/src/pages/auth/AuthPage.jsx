import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { login, register } from '@/store/slices/authSlice'
import { httpError } from '@/api/client'
import { cn } from '@/utils/cn'

function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      aria-label={show ? 'Hide password' : 'Show password'}
      onClick={onToggle}
      className="pointer-events-auto text-fg-faint transition-colors hover:text-fg-secondary"
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  )
}

function LoginForm({ loading, registeredUsername }) {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Enter your username and password.')
      return
    }
    try {
      await dispatch(login({ username: username.trim(), password })).unwrap()
    } catch (err) {
      setError(httpError(err).message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {registeredUsername && (
        <div className="flex items-center gap-2 rounded-md border border-ok/25 bg-ok-soft px-3 py-2.5 text-[13px] text-ok">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>
            Account created for{' '}
            <span className="font-medium">{registeredUsername}</span>. Sign in to continue.
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-danger/25 bg-danger-soft px-3 py-2.5 text-[13px] text-danger">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <Input
        name="username"
        label="Username"
        autoComplete="username"
        placeholder="mausam"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        prefix={<UserIcon size={15} />}
        autoFocus
      />
      <Input
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        prefix={<Lock size={15} />}
        suffix={<EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
      />

      <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1 w-full">
        Sign in <ArrowRight size={15} />
      </Button>
    </form>
  )
}

function RegisterForm({ loading, onSuccess }) {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (!username.trim() || !email.trim() || !password || !confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    try {
      const result = await dispatch(
        register({ username: username.trim(), email: email.trim(), password }),
      ).unwrap()
      onSuccess?.(result.username)
    } catch (err) {
      const { message } = httpError(err)
      const lower = message.toLowerCase()
      if (lower.includes('password')) {
        setFieldErrors({ password: message })
      } else if (lower.includes('email')) {
        setFieldErrors({ email: message })
      } else {
        setError(message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-danger/25 bg-danger-soft px-3 py-2.5 text-[13px] text-danger">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <Input
        name="username"
        label="Username"
        autoComplete="username"
        placeholder="mausam"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        prefix={<UserIcon size={15} />}
        autoFocus
      />
      <Input
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        prefix={<Mail size={15} />}
        error={fieldErrors.email}
      />
      <Input
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        prefix={<Lock size={15} />}
        suffix={<EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
        error={fieldErrors.password}
      />
      <Input
        name="confirmPassword"
        label="Confirm password"
        type={showConfirm ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="Re-enter password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        prefix={<Lock size={15} />}
        suffix={<EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />}
      />

      <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1 w-full">
        Create account <ArrowRight size={15} />
      </Button>
    </form>
  )
}

function Tabs({ mode, onChange }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface p-1">
      {[
        { key: 'login', label: 'Sign in' },
        { key: 'register', label: 'Create account' },
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'h-8 rounded-md text-[13px] font-medium transition-colors',
            mode === tab.key
              ? 'bg-panel text-fg shadow-raise'
              : 'text-fg-faint hover:text-fg-secondary',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector((state) => state.auth)
  const [mode, setMode] = useState(initialMode)
  const [registeredUsername, setRegisteredUsername] = useState(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/app', { replace: true })
  }, [isAuthenticated, navigate])

  const isLogin = mode === 'login'

  return (
    <AuthLayout
      title={isLogin ? 'Welcome back' : 'Create your account'}
      subtitle={
        isLogin
          ? 'Sign in to your knowledge base.'
          : 'Start building your searchable knowledge graph.'
      }
    >
      <Tabs mode={mode} onChange={setMode} />

      {isLogin ? (
        <LoginForm loading={loading} registeredUsername={registeredUsername} />
      ) : (
        <RegisterForm
          loading={loading}
          onSuccess={(username) => {
            setRegisteredUsername(username)
            setMode('login')
          }}
        />
      )}
    </AuthLayout>
  )
}