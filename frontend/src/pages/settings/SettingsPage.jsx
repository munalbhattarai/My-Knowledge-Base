import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut, Mail, User as UserIcon, Calendar, Sun, Info, Pencil, Check } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { Skeleton } from '@/components/common/Skeleton'
import { logout, loadProfile, updateProfile } from '@/store/slices/authSlice'
import { dashboardApi } from '@/api/dashboardApi'
import { formatDate } from '@/utils/time'
import { useToast } from '@/hooks/useToast'

function SettingRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
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
  const toast = useToast()
  const user = useSelector((state) => state.auth.user)
  const [stats, setStats] = useState(null)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  })

  useEffect(() => {
    dispatch(loadProfile())
  }, [dispatch])

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

  const handleOpenEdit = () => {
    setForm({
      username: user?.username || '',
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    })
    setEditModalOpen(true)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!form.username.trim()) {
      toast.error('Username is required')
      return
    }
    setSaving(true)
    try {
      await dispatch(
        updateProfile({
          username: form.username.trim(),
          email: form.email.trim(),
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
        }),
      ).unwrap()
      toast.success('Profile updated successfully')
      setEditModalOpen(false)
    } catch (err) {
      toast.error('Could not update profile', err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const memberSince = user?.date_joined ? formatDate(user.date_joined) : null
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ')

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <header className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
          Account Settings
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-400">
          Manage your personal workspace and profile preferences.
        </p>
      </header>

      <div className="flex max-w-2xl flex-col gap-8">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Profile Details
            </h3>
            <Button variant="outline" size="sm" onClick={handleOpenEdit}>
              <Pencil size={13} className="text-slate-700" />
              Edit profile
            </Button>
          </div>

          <div className="flex items-center gap-4 rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-sm mb-3">
            <Avatar name={user?.username || '?'} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold tracking-tight text-slate-900 font-display">
                {fullName || user?.username || '…'}
              </p>
              <p className="truncate text-xs font-medium text-slate-400 mt-0.5 font-mono">
                {user?.email || 'No email configured'}
              </p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 rounded-[28px] border border-slate-200/90 bg-white px-6 shadow-sm">
            <SettingRow icon={UserIcon} label="Username" value={user?.username || '—'} />
            <SettingRow icon={UserIcon} label="Full name" value={fullName || '—'} />
            <SettingRow icon={Mail} label="Email" value={user?.email || '—'} />
            <SettingRow icon={Calendar} label="Member since" value={memberSince || '—'} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Workspace Stats
          </h3>
          {stats ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Total Notes', stats.total_notes, 'bg-[#e0f2fe] text-[#082f49] border-[#bae6fd]'],
                ['In Learning', stats.learning, 'bg-[#fef9c3] text-[#713f12] border-[#fef08a]'],
                ['Learned', stats.learned, 'bg-[#dcfce7] text-[#14532d] border-[#bbf7d0]'],
                ['Favorites', stats.favorites, 'bg-[#f3e8ff] text-[#581c87] border-[#e9d5ff]'],
              ].map(([label, value, colorClass]) => (
                <div key={label} className={`rounded-[24px] border p-5 shadow-xs ${colorClass}`}>
                  <p className="text-2xl font-bold font-mono">{value}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</p>
                </div>
              ))}
            </div>
          ) : (
            <Skeleton className="h-24 w-full rounded-[24px]" />
          )}
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Preferences &amp; System
          </h3>
          <div className="divide-y divide-slate-100 rounded-[28px] border border-slate-200/90 bg-white px-6 shadow-sm">
            <div className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Sun size={16} />
              </span>
              <p className="flex-1 text-sm font-semibold text-slate-700">Theme</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                Pastel Mino (Light)
              </span>
            </div>
            <div className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Info size={16} />
              </span>
              <p className="flex-1 text-sm font-semibold text-slate-700">Version</p>
              <span className="text-xs font-semibold text-slate-400 font-mono">v1.0.0</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Session
          </h3>
          <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-sm">
            <p className="text-xs leading-relaxed text-slate-500">
              Logging out ends your current session. All your notes, categories, and review queues remain safely synchronized.
            </p>
            <Button variant="danger" className="mt-4" onClick={handleLogout}>
              <LogOut size={15} />
              Log out
            </Button>
          </div>
        </section>
      </div>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit profile"
        description="Update your personal details and account info."
        width="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saving} onClick={handleSaveProfile}>
              <Check size={15} />
              Save changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5">
          <Input
            name="username"
            label="Username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            placeholder="Username"
            prefix={<UserIcon size={15} />}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            prefix={<Mail size={15} />}
          />
          <Input
            name="first_name"
            label="First name"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            placeholder="First name"
          />
          <Input
            name="last_name"
            label="Last name"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            placeholder="Last name"
          />
        </form>
      </Modal>
    </motion.div>
  )
}