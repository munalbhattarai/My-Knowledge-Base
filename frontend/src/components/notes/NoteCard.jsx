import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Star, Clock, Pencil, Trash2, MoreHorizontal, Layers } from 'lucide-react'
import { formatSlashDate, formatNoteTime, excerpt } from '@/utils/time'
import { cn } from '@/utils/cn'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'

const PASTEL_THEMES = [
  {
    card: 'bg-[#fef9c3] border-[#fef08a] text-[#422006]',
    badge: 'bg-[#fef08a] text-[#713f12] border-[#fde047]/60',
    iconBg: 'bg-[#1e293b] text-white',
    clockText: 'text-[#854d0e]',
    pinColor: 'orange',
  },
  {
    card: 'bg-[#fee2e2] border-[#fecdd3] text-[#4c0519]',
    badge: 'bg-[#fecdd3] text-[#881337] border-[#fda4af]/60',
    iconBg: 'bg-[#1e293b] text-white',
    clockText: 'text-[#9f1239]',
    pinColor: 'red',
  },
  {
    card: 'bg-[#e0f2fe] border-[#bae6fd] text-[#082f49]',
    badge: 'bg-[#bae6fd] text-[#075985] border-[#7dd3fc]/60',
    iconBg: 'bg-[#1e293b] text-white',
    clockText: 'text-[#0369a1]',
    pinColor: 'blue',
  },
  {
    card: 'bg-[#f3e8ff] border-[#e9d5ff] text-[#3b0764]',
    badge: 'bg-[#e9d5ff] text-[#581c87] border-[#d8b4fe]/60',
    iconBg: 'bg-[#1e293b] text-white',
    clockText: 'text-[#6b21a8]',
    pinColor: 'purple',
  },
  {
    card: 'bg-[#dcfce7] border-[#bbf7d0] text-[#052e16]',
    badge: 'bg-[#bbf7d0] text-[#14532d] border-[#86efac]/60',
    iconBg: 'bg-[#1e293b] text-white',
    clockText: 'text-[#166534]',
    pinColor: 'green',
  },
  {
    card: 'bg-[#ffedd5] border-[#fed7aa] text-[#431407]',
    badge: 'bg-[#fed7aa] text-[#7c2d12] border-[#fdba74]/60',
    iconBg: 'bg-[#1e293b] text-white',
    clockText: 'text-[#9a3412]',
    pinColor: 'orange',
  },
]

export function NoteCard({ note, layout = 'grid', onToggleFavorite, onDelete, index = 0 }) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const theme = PASTEL_THEMES[index % PASTEL_THEMES.length]
  const category = note.category && typeof note.category === 'object' ? note.category : null
  const isList = layout === 'list'

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(note)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleMenuToggle = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen((o) => !o)
  }, [])

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.03 }}
      onClick={() => {
        if (!menuOpen) navigate(`/app/notes/${note.id}`)
      }}
      className={cn(
        'mino-card group relative cursor-pointer rounded-[28px] border p-6 select-none',
        theme.card,
        isList ? 'flex items-center gap-6 py-4' : 'flex flex-col justify-between min-h-[220px]',
        menuOpen && 'z-50',
      )}
    >
      {/* Backdrop for Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(false)
          }}
        />
      )}

      {/* Top Header Row (Image 1): Date + Action Pen / Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-bold tracking-wider opacity-70 font-mono">
          {formatSlashDate(note.updated_at || note.created_at)}
        </span>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Favorite Star */}
          <button
            type="button"
            onClick={() => onToggleFavorite?.(note)}
            className={cn(
              'p-1.5 rounded-full transition-transform active:scale-90',
              note.is_favorite ? 'text-amber-500 bg-amber-100/70' : 'text-slate-400 hover:text-slate-700',
            )}
            title={note.is_favorite ? 'Favorited' : 'Add to favorites'}
          >
            <Star size={14} fill={note.is_favorite ? 'currentColor' : 'none'} />
          </button>

          {/* Quick Edit Pen Square Icon (Image 1) */}
          <button
            type="button"
            onClick={handleMenuToggle}
            className={cn(
              'h-7 w-7 rounded-xl flex items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95',
              theme.iconBg,
            )}
            title="Options"
          >
            <Pencil size={13} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-6 top-14 z-[9999] w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl text-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              navigate(`/app/notes/${note.id}/edit`)
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            <Pencil size={13} />
            <span>Edit Note</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setConfirmDelete(true)
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        <h3 className="text-base sm:text-lg font-bold tracking-tight line-clamp-1 group-hover:underline">
          {note.title}
        </h3>

        {note.content && (
          <p className="mt-2 text-xs sm:text-[13px] leading-relaxed opacity-80 line-clamp-3">
            {excerpt(note.content, 140)}
          </p>
        )}
      </div>

      {/* Bottom Row (Image 1): Clock Timestamp & Category Pill */}
      <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between gap-2">
        <span className={cn('flex items-center gap-1.5 text-[11px] font-semibold tracking-tight', theme.clockText)}>
          <Clock size={13} />
          <span>{formatNoteTime(note.updated_at)}</span>
        </span>

        {category && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs', theme.badge)}>
            {category.name}
          </span>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this note?"
        description={`"${note.title}" will be permanently removed.`}
        confirmLabel="Delete"
        busy={deleting}
      />
    </motion.article>
  )
}

// Dashed "+ New Note" quick creation card (matching Image 1 right tile)
export function NewNoteDashedCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="dashed-card group flex flex-col items-center justify-center gap-3 rounded-[28px] p-6 min-h-[220px] text-slate-500 hover:text-slate-800 select-none cursor-pointer"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md group-hover:scale-110 transition-transform">
        <Pencil size={18} />
      </div>
      <span className="text-sm font-bold font-display">New Note</span>
    </button>
  )
}
