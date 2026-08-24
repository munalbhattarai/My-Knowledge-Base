import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Plus, ArrowRight, Star, Clock3, NotebookPen, Sparkles } from 'lucide-react'
import Button from '@/components/common/Button'
import { dashboardApi } from '@/api/dashboardApi'
import { notesApi } from '@/api/notesApi'
import { STATUS_META } from '@/utils/status'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { relativeTime, formatDate } from '@/utils/time'
import { cn } from '@/utils/cn'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 5) return 'Working late'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function Stat({ value, label, tone, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 min-w-[140px] items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-4 shadow-sm shadow-slate-200/50 hover:shadow-md transition-all"
    >
      {Icon && (
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone.bg)}>
          <Icon size={18} className={tone.icon} />
        </div>
      )}
      <div className="flex flex-col">
        <span className="mono text-2xl font-bold tabular tracking-tight text-slate-900">{value}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      </div>
    </motion.div>
  )
}

function NoteRow({ note, onOpen }) {
  const meta = STATUS_META[note.status]
  return (
    <button
      type="button"
      onClick={() => onOpen(note.id)}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 hover:bg-cyan-50/60"
    >
      <span className={cn('h-2 w-2 shrink-0 rounded-full ring-2', meta?.dot, meta?.ring)} />
      <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-slate-800 group-hover:text-cyan-700">
        {note.title}
      </span>
      <span className="mono shrink-0 text-[11px] tabular text-slate-400 font-medium">{relativeTime(note.updated_at)}</span>
    </button>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState(null)
  const [review, setReview] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      dashboardApi.get(),
      notesApi.list({ page: 1 }),
      notesApi.list({ status: 'REVIEW', is_archived: false, page: 1 }),
    ])
      .then(([s, r, q]) => {
        if (cancelled) return
        setStats(s)
        const sorted = [...(r.results || [])].sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
        )
        setRecent(sorted.slice(0, 6))
        setReview((q.results || []).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)))
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const progress = useMemo(() => {
    if (!stats || stats.total_notes === 0) return 0
    return Math.round((stats.learned / Math.max(1, stats.learned + stats.learning)) * 100)
  }, [stats])

  const username = user?.username || 'developer'

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700 shadow-xs">
            <Sparkles size={12} className="text-cyan-600" />
            <span>{formatDate(new Date().toISOString())}</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {greeting()}, <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{username}</span>.
          </h1>
          <p className="mt-1.5 text-[14.5px] font-medium text-slate-500">
            {stats
              ? `${stats.learning} note${stats.learning === 1 ? '' : 's'} in progress${stats.review ? ` · ${stats.review} waiting for review` : ''}`
              : 'Loading your knowledge base…'}
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => navigate('/app/notes/new')}>
          <Plus size={16} />
          New note
        </Button>
      </motion.header>

      {error ? (
        <EmptyState
          icon={<NotebookPen size={20} />}
          title="Couldn't load your dashboard"
          description="The API didn't respond. Check that the backend is running and try again."
          action={
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          }
        />
      ) : (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats ? (
              <>
                <Stat
                  value={stats.total_notes}
                  label="Total notes"
                  icon={NotebookPen}
                  tone={{ bg: 'bg-slate-100', icon: 'text-slate-700' }}
                  delay={0.05}
                />
                <Stat
                  value={stats.learning}
                  label="Learning"
                  icon={Sparkles}
                  tone={{ bg: 'bg-cyan-50', icon: 'text-cyan-600' }}
                  delay={0.1}
                />
                <Stat
                  value={stats.review}
                  label="To review"
                  icon={Clock3}
                  tone={{ bg: 'bg-amber-50', icon: 'text-amber-600' }}
                  delay={0.15}
                />
                <Stat
                  value={stats.favorites}
                  label="Favorites"
                  icon={Star}
                  tone={{ bg: 'bg-purple-50', icon: 'text-purple-600' }}
                  delay={0.2}
                />
              </>
            ) : (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recently Updated */}
            <section className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold tracking-tight text-slate-900">Recently updated</h2>
                <button
                  type="button"
                  onClick={() => navigate('/app/notes')}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                >
                  All notes
                  <ArrowRight size={14} />
                </button>
              </div>
              {!recent ? (
                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                  ))}
                </div>
              ) : recent.length === 0 ? (
                <EmptyState
                  compact
                  icon={<NotebookPen size={18} />}
                  title="No notes yet"
                  description="Create your first note and it will show up here."
                />
              ) : (
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-2 shadow-md shadow-slate-200/40">
                  {recent.map((note) => (
                    <NoteRow key={note.id} note={note} onOpen={(id) => navigate(`/app/notes/${id}`)} />
                  ))}
                </div>
              )}
            </section>

            {/* Sidebar Widgets */}
            <aside className="flex flex-col gap-6">
              {/* Needs Review */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
                    <Clock3 size={16} className="text-amber-500" />
                    Needs review
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate('/app/review')}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-600 transition-colors hover:text-amber-700"
                  >
                    View
                    <ArrowRight size={14} />
                  </button>
                </div>
                {!review ? (
                  <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-xl" />
                    ))}
                  </div>
                ) : review.length === 0 ? (
                  <EmptyState
                    compact
                    icon={<Clock3 size={18} />}
                    title="All caught up"
                    description="No notes waiting for review."
                  />
                ) : (
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-2 shadow-md shadow-slate-200/40">
                    {review.slice(0, 5).map((note) => (
                      <NoteRow key={note.id} note={note} onOpen={(id) => navigate(`/app/notes/${id}`)} />
                    ))}
                  </div>
                )}
              </section>

              {/* Learning Progress */}
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 px-1">
                  <Star size={16} className="text-amber-500" />
                  Learning progress
                </h2>
                <div className="rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-5 shadow-md shadow-slate-200/40">
                  <div className="flex items-end justify-between">
                    <span className="mono text-3xl font-extrabold tabular text-slate-900">{progress}%</span>
                    <span className="text-[12px] font-semibold text-slate-500">
                      {stats ? `${stats.learned} of ${stats.learned + stats.learning} learned` : '—'}
                    </span>
                  </div>
                  <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-[width] duration-700 shadow-sm shadow-cyan-500/30"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}