import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
  NotebookPen,
  Clock3,
  Star,
  Layers,
  Hash,
} from 'lucide-react'
import Button from '@/components/common/Button'
import { dashboardApi } from '@/api/dashboardApi'
import { notesApi } from '@/api/notesApi'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { NoteCard, NewNoteDashedCard } from '@/components/notes/NoteCard'
import { PushPin } from '@/components/common/PushPin'
import { formatDate } from '@/utils/time'
import { cn } from '@/utils/cn'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 5) return 'Working late'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// Stat Card with Mino Pastel styling
function PastelStatCard({ value, label, tone, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'mino-card flex items-center gap-4 rounded-[26px] border p-5 select-none',
        tone.bg,
        tone.border,
      )}
    >
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-xs', tone.iconBg)}>
        <Icon size={20} className={tone.iconColor} />
      </div>
      <div className="flex flex-col">
        <span className={cn('text-2xl sm:text-3xl font-extrabold font-mono tracking-tight', tone.text)}>
          {value}
        </span>
        <span className={cn('text-xs font-bold uppercase tracking-wider', tone.subText)}>
          {label}
        </span>
      </div>
    </motion.div>
  )
}

// Pinned Note Card in Review Pathway (Image 2)
function PinnedPathwayCard({ note, step, pinColor, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="mino-card relative flex flex-col justify-between rounded-[24px] bg-white border border-slate-200/90 p-5 shadow-md hover:shadow-xl transition-all cursor-pointer min-w-[210px] max-w-[240px] shrink-0"
    >
      {/* 3D Push Pin on Top Center */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
        <PushPin color={pinColor} size="md" />
      </div>

      <div className="pt-2">
        <span className="text-xs font-extrabold text-orange-500 font-mono">
          0{step}
        </span>
        <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-1 font-display">
          {note.title}
        </h4>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {note.content || 'Ready for spaced repetition review.'}
        </p>
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Review item</span>
        <span className="text-amber-600 font-bold">Needs review</span>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const categories = useSelector((state) => state.entities.categories || [])
  const tags = useSelector((state) => state.entities.tags || [])

  const [stats, setStats] = useState(null)
  const [recentNotes, setRecentNotes] = useState([])
  const [reviewNotes, setReviewNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [notesTab, setNotesTab] = useState('Todays')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      dashboardApi.get(),
      notesApi.list({ page: 1 }),
      notesApi.list({ status: 'REVIEW', is_archived: false, page: 1 }),
    ])
      .then(([s, r, q]) => {
        if (cancelled) return
        setStats(s)
        setRecentNotes(r.results || [])
        setReviewNotes(q.results || [])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const progress = useMemo(() => {
    if (!stats || stats.total_notes === 0) return 0
    return Math.round((stats.learned / Math.max(1, stats.learned + stats.learning)) * 100)
  }, [stats])

  const username = user?.first_name || user?.username || 'User'
  const currentMonthYear = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-9">
      {/* 1. Header Banner & Greeting */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/80 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-2xs font-mono">
            <Sparkles size={13} className="text-amber-500" />
            <span>{formatDate(new Date().toISOString())}</span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            {greeting()},{' '}
            <span className="text-indigo-600">{username}</span>.
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-400">
            {stats
              ? `${stats.learning} note${stats.learning === 1 ? '' : 's'} in progress · ${stats.review} waiting for review`
              : 'Loading your knowledge base…'}
          </p>
        </div>

        <Button size="lg" onClick={() => navigate('/app/notes/new')}>
          <Plus size={16} />
          <span>New note</span>
        </Button>
      </motion.header>

      {/* 2. Knowledge Metrics Bar (Pastel Mino Theme) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-[26px]" />
          ))
        ) : (
          <>
            <PastelStatCard
              value={stats?.total_notes ?? 0}
              label="Total notes"
              icon={NotebookPen}
              tone={{
                bg: 'bg-[#e0f2fe]',
                border: 'border-[#bae6fd]',
                iconBg: 'bg-[#bae6fd]',
                iconColor: 'text-[#0369a1]',
                text: 'text-[#082f49]',
                subText: 'text-[#0284c7]',
              }}
              delay={0.04}
            />
            <PastelStatCard
              value={stats?.learning ?? 0}
              label="In Progress"
              icon={Sparkles}
              tone={{
                bg: 'bg-[#fef9c3]',
                border: 'border-[#fef08a]',
                iconBg: 'bg-[#fef08a]',
                iconColor: 'text-[#854d0e]',
                text: 'text-[#422006]',
                subText: 'text-[#ca8a04]',
              }}
              delay={0.08}
            />
            <PastelStatCard
              value={stats?.review ?? 0}
              label="Needs Review"
              icon={Clock3}
              tone={{
                bg: 'bg-[#fee2e2]',
                border: 'border-[#fecdd3]',
                iconBg: 'bg-[#fecdd3]',
                iconColor: 'text-[#9f1239]',
                text: 'text-[#4c0519]',
                subText: 'text-[#e11d48]',
              }}
              delay={0.12}
            />
            <PastelStatCard
              value={stats?.favorites ?? 0}
              label="Favorites"
              icon={Star}
              tone={{
                bg: 'bg-[#f3e8ff]',
                border: 'border-[#e9d5ff]',
                iconBg: 'bg-[#e9d5ff]',
                iconColor: 'text-[#6b21a8]',
                text: 'text-[#3b0764]',
                subText: 'text-[#9333ea]',
              }}
              delay={0.16}
            />
          </>
        )}
      </div>

      {/* 3. Learning Progress Card */}
      {stats && (
        <section className="rounded-[28px] bg-white border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Star size={16} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Learning Progress</h3>
                <p className="text-xs text-slate-400">
                  {stats.learned} of {stats.learned + stats.learning} notes mastered
                </p>
              </div>
            </div>
            <span className="text-xl font-extrabold font-mono text-slate-900">{progress}%</span>
          </div>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-indigo-600"
            />
          </div>
        </section>
      )}

      {/* 4. My Notes Pastel Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-extrabold text-slate-900 font-display tracking-tight">
              My Notes
            </h2>

            {/* Time Filter Tabs */}
            <div className="flex items-center gap-5 text-xs font-bold text-slate-400">
              {['Todays', 'This Week', 'This Month'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setNotesTab(tab)}
                  className={cn(
                    'relative pb-1.5 transition-colors cursor-pointer',
                    notesTab === tab ? 'text-slate-900' : 'hover:text-slate-700',
                  )}
                >
                  {tab}
                  {notesTab === tab && (
                    <motion.span
                      layoutId="notesTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-900"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/app/notes')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
            >
              View all <ArrowRight size={13} />
            </button>

            {/* Month Navigator Arrow Buttons */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono">
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{currentMonthYear}</span>
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid with Dashed "+ New Note" Card */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-[28px]" />
            ))}
          </div>
        ) : recentNotes.length === 0 ? (
          <div className="rounded-[28px] bg-white border border-slate-200/80 p-8 text-center">
            <EmptyState
              icon={<Bookmark size={22} />}
              title="No notes created yet"
              description="Start capturing your knowledge notes and code snippets."
              action={
                <Button onClick={() => navigate('/app/notes/new')}>
                  <Plus size={15} />
                  Create First Note
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentNotes.slice(0, 3).map((note, idx) => (
              <NoteCard
                key={note.id}
                note={note}
                index={idx}
                onToggleFavorite={async (n) => {
                  await notesApi.update(n.id, { is_favorite: !n.is_favorite })
                  setRecentNotes((prev) =>
                    prev.map((item) =>
                      item.id === n.id ? { ...item, is_favorite: !item.is_favorite } : item,
                    ),
                  )
                }}
                onDelete={async (n) => {
                  await notesApi.delete(n.id)
                  setRecentNotes((prev) => prev.filter((item) => item.id !== n.id))
                }}
              />
            ))}
            <NewNoteDashedCard onClick={() => navigate('/app/notes/new')} />
          </div>
        )}
      </section>

      {/* 5. Review Pathway Roadmap (Spaced Repetition / Review Queue) */}
      {reviewNotes.length > 0 && (
        <section className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display tracking-tight flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Review Pathway
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Pinned items scheduled for active recall &amp; revision.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/app/review')}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 inline-flex items-center gap-1 cursor-pointer"
            >
              View Queue <ArrowRight size={13} />
            </button>
          </div>

          <div className="relative rounded-[32px] bg-white border border-slate-200/80 p-8 shadow-xs overflow-x-auto">
            {/* Horizontal Dotted Connecting Line */}
            <div className="absolute top-1/2 left-10 right-10 h-0.5 border-t-2 border-dashed border-slate-200 -translate-y-1/2 pointer-events-none hidden sm:block" />

            <div className="relative z-10 flex items-center gap-8 py-2">
              {reviewNotes.slice(0, 5).map((note, index) => {
                const pinColors = ['orange', 'blue', 'purple', 'green', 'red']
                return (
                  <PinnedPathwayCard
                    key={note.id}
                    note={note}
                    step={index + 1}
                    pinColor={pinColors[index % pinColors.length]}
                    onClick={() => navigate(`/app/notes/${note.id}`)}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. Quick Categories & Tags Explorer */}
      {(categories.length > 0 || tags.length > 0) && (
        <section className="rounded-[28px] bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Quick Collections &amp; Tags
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat, idx) => {
              const pastelTags = [
                'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
                'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]',
                'bg-[#fee2e2] text-[#9f1239] border-[#fecdd3]',
                'bg-[#f3e8ff] text-[#6b21a8] border-[#e9d5ff]',
                'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]',
              ]
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate(`/app/category/${cat.id}`)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-transform hover:scale-105 cursor-pointer',
                    pastelTags[idx % pastelTags.length],
                  )}
                >
                  <Layers size={12} />
                  <span>{cat.name}</span>
                </button>
              )
            })}

            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => navigate(`/app/tag/${tag.id}`)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Hash size={11} className="text-slate-400" />
                <span>{tag.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}