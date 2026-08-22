import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut, Mail, User as UserIcon, Calendar, Sun, Info } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import { Skeleton } from '@/components/common/Skeleton'
import { logout } from '@/store/slices/authSlice'
import { dashboardApi } from '@/api/dashboardApi'
import { formatDate } from '@/utils/time'

function SettingRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/70 text-cyan-600">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
      <p className="truncate text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export default function SettingsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let cancelled = false
    dashboardApi
      .get()
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const memberSince = user?.date_joined ? formatDate(user.date_joined) : null

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1.5 text-[14.5px] font-medium text-slate-500">Your account and preferences.</p>
      </header>

      <div className="flex max-w-2xl flex-col gap-8">
        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Profile
          </h2>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white/85 backdrop-blur-md p-5 shadow-md shadow-slate-200/40 mb-3">
            <Avatar name={user?.username || '?'} size="lg" />
            <div className="min-w-0">
              <p className="text-lg font-bold tracking-tight text-slate-900">
                {user?.username || '…'}
              </p>
              <p className="truncate text-[13px] font-medium text-slate-500">{user?.email || 'No email on file'}</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/90 bg-white/85 backdrop-blur-md px-5 shadow-md shadow-slate-200/40">
            <SettingRow icon={UserIcon} label="Username" value={user?.username || '—'} />
            <SettingRow icon={Mail} label="Email" value={user?.email || '—'} />
            <SettingRow icon={Calendar} label="Member since" value={memberSince || '—'} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            At a glance
          </h2>
          {stats ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Notes', stats.total_notes],
                ['Learning', stats.learning],
                ['Learned', stats.learned],
                ['Favorites', stats.favorites],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200/90 bg-white/85 backdrop-blur-md p-4 shadow-sm">
                  <p className="mono text-2xl font-bold tabular text-slate-900">{value}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          ) : (
            <Skeleton className="h-24 w-full rounded-2xl" />
          )}
        </section>

        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Preferences
          </h2>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/90 bg-white/85 backdrop-blur-md px-5 shadow-md shadow-slate-200/40">
            <div className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/70 text-cyan-600">
                <Sun size={16} />
              </span>
              <p className="flex-1 text-sm font-semibold text-slate-700">Theme</p>
              <span className="rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 text-[12px] font-bold text-cyan-700 shadow-xs">
                Soft Glass (Light)
              </span>
            </div>
            <div className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/70 text-cyan-600">
                <Info size={16} />
              </span>
              <p className="flex-1 text-sm font-semibold text-slate-700">Version</p>
              <span className="mono text-[12px] font-semibold text-slate-400">v0.1.0</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Session
          </h2>
          <div className="rounded-2xl border border-slate-200/90 bg-white/85 backdrop-blur-md p-5 shadow-md shadow-slate-200/40">
            <p className="text-[13.5px] leading-relaxed text-slate-500">
              Logging out revokes your session on the server and clears tokens from this device. Your notes stay
              safe on the server.
            </p>
            <Button variant="danger" className="mt-4" onClick={handleLogout}>
              <LogOut size={15} />
              Log out
            </Button>
          </div>
        </section>
      </div>
    </motion.div>
  )
}