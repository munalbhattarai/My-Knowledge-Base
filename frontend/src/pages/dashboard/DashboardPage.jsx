import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
  Folder,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
} from 'lucide-react'
import Button from '@/components/common/Button'
import { dashboardApi } from '@/api/dashboardApi'
import { notesApi } from '@/api/notesApi'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { NoteCard, NewNoteDashedCard } from '@/components/notes/NoteCard'
import { PushPin } from '@/components/common/PushPin'
import { formatSlashDate } from '@/utils/time'
import { cn } from '@/utils/cn'

// Pastel folder color sets (matching Image 1)
const FOLDER_COLORS = [
  {
    bg: 'bg-[#dbeafe]', // Soft Blue
    border: 'border-[#bfdbfe]',
    iconBg: 'bg-[#60a5fa]',
    text: 'text-[#1e3a8a]',
    subText: 'text-[#3b82f6]',
  },
  {
    bg: 'bg-[#ffedd5]', // Soft Peach / Terracotta
    border: 'border-[#fed7aa]',
    iconBg: 'bg-[#f97316]',
    text: 'text-[#7c2d12]',
    subText: 'text-[#ea580c]',
  },
  {
    bg: 'bg-[#fef9c3]', // Soft Yellow
    border: 'border-[#fef08a]',
    iconBg: 'bg-[#eab308]',
    text: 'text-[#713f12]',
    subText: 'text-[#ca8a04]',
  },
  {
    bg: 'bg-[#f3e8ff]', // Soft Purple
    border: 'border-[#e9d5ff]',
    iconBg: 'bg-[#a855f7]',
    text: 'text-[#581c87]',
    subText: 'text-[#9333ea]',
  },
  {
    bg: 'bg-[#dcfce7]', // Soft Mint
    border: 'border-[#bbf7d0]',
    iconBg: 'bg-[#22c55e]',
    text: 'text-[#14532d]',
    subText: 'text-[#16a34a]',
  },
]

// Folder Card (Image 1 top row)
function FolderCard({ category, index, onClick }) {
  const color = FOLDER_COLORS[index % FOLDER_COLORS.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      onClick={onClick}
      className={cn(
        'mino-card group flex flex-col justify-between rounded-[26px] p-5 border cursor-pointer select-none min-h-[140px]',
        color.bg,
        color.border,
      )}
    >
      <div className="flex items-center justify-between">
        {/* Folder Icon with Soft Gradient */}
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-xs', color.iconBg)}>
          <Folder size={18} fill="currentColor" />
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="mt-3">
        <h3 className={cn('text-base font-bold tracking-tight truncate font-display', color.text)}>
          {category.name}
        </h3>
        <p className={cn('text-xs font-semibold font-mono mt-0.5', color.subText)}>
          {category.notes_count !== undefined ? `${category.notes_count} Notes` : 'Category'}
        </p>
      </div>
    </motion.div>
  )
}

// Dashed "+ New Folder" Card (Image 1 top right tile)
function NewFolderDashedCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="dashed-card group flex flex-col items-center justify-center gap-2.5 rounded-[26px] p-5 min-h-[140px] text-slate-500 hover:text-slate-800 select-none cursor-pointer"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xs group-hover:scale-110 transition-transform">
        <Folder size={16} fill="currentColor" />
      </div>
      <span className="text-xs font-bold font-display">New folder</span>
    </button>
  )
}

// Pinned Note Card in Review Pathway (Image 2)
function PinnedPathwayCard({ note, step, pinColor, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="mino-card relative flex flex-col justify-between rounded-[24px] bg-white border border-slate-200/90 p-5 shadow-md hover:shadow-xl transition-all cursor-pointer min-w-[200px] max-w-[240px] shrink-0"
    >
      {/* 3D Push Pin on Top Center (Image 2) */}
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
  const categories = useSelector((state) => state.entities.categories || [])

  const [stats, setStats] = useState(null)
  const [recentNotes, setRecentNotes] = useState([])
  const [reviewNotes, setReviewNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [folderTab, setFolderTab] = useState('This Week')
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

  const currentMonthYear = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-10">
      {/* SECTION 1: Recent Folders (Categories) — Image 1 Top */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-slate-900 font-display tracking-tight">
            Recent Folders
          </h2>

          {/* Time Filter Tabs (Image 1) */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
            {['Todays', 'This Week', 'This Month'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFolderTab(tab)}
                className={cn(
                  'relative pb-1.5 transition-colors cursor-pointer',
                  folderTab === tab ? 'text-slate-900' : 'hover:text-slate-700',
                )}
              >
                {tab}
                {folderTab === tab && (
                  <motion.span
                    layoutId="folderTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-900"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-[26px]" />
            ))
          ) : (
            <>
              {categories.slice(0, 3).map((cat, idx) => (
                <FolderCard
                  key={cat.id}
                  category={cat}
                  index={idx}
                  onClick={() => navigate(`/app/category/${cat.id}`)}
                />
              ))}
              <NewFolderDashedCard onClick={() => navigate('/app/notes?view=categories')} />
            </>
          )}
        </div>
      </section>

      {/* SECTION 2: My Notes Grid — Image 1 Bottom */}
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

          {/* Month Navigator Arrow Buttons (Image 1) */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono">
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span>{currentMonthYear}</span>
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-slate-800 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
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

      {/* SECTION 3: Pinned Learning Roadmap / Review Pathway (Image 2) */}
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
              className="text-xs font-bold text-slate-700 hover:text-slate-950 inline-flex items-center gap-1"
            >
              View Queue <ArrowRight size={13} />
            </button>
          </div>

          {/* Curved Dotted Roadmap Container */}
          <div className="relative rounded-[32px] bg-white border border-slate-200/80 p-8 shadow-sm overflow-x-auto">
            {/* Subtle Horizontal Dotted Connecting Line */}
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
    </div>
  )
}