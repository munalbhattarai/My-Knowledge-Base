import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Star, Archive, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { STATUS_META } from '@/utils/status'
import { relativeTime, excerpt } from '@/utils/time'
import { cn } from '@/utils/cn'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'

function FavoriteButton({ note, onToggleFavorite }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggleFavorite?.(note)
      }}
      className={cn(
        'group/star rounded-xl p-1.5 transition-all duration-150',
        note.is_favorite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100/60',
      )}
      aria-label={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.span
        key={String(note.is_favorite)}
        initial={{ scale: 0.6, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.35 }}
        className="block"
      >
        <Star size={16} fill={note.is_favorite ? 'currentColor' : 'none'} />
      </motion.span>
    </button>
  )
}

export function NoteCard({ note, layout = 'grid', onToggleFavorite, onDelete, index = 0 }) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  const category = note.category && typeof note.category === 'object' ? note.category : null
  const tagNames = (note.tags || []).map((t) =>
    typeof t === 'object' && t !== null ? t.name : String(t)
  ).filter(Boolean)

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

  const handleCardMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 120)
  }, [])

  const handleCardMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current)
  }, [])

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => {
        if (!menuOpen) navigate(`/app/notes/${note.id}`)
      }}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      className={cn(
        'group relative cursor-pointer overflow-visible rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md shadow-md shadow-slate-200/50',
        'transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/50 hover:bg-white',
        isList
          ? 'flex items-center gap-4 px-5 py-3.5'
          : 'flex flex-col p-5',
        menuOpen && 'z-50',
      )}
    >
      {/* Top subtle glow line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Backdrop — stops propagation so card onClick doesn't fire */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(false)
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setMenuOpen(false)
          }}
        />
      )}

      <div className={cn('flex min-w-0 flex-1 items-start justify-between gap-3', !isList && 'mb-2.5')}>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold tracking-tight text-slate-900 transition-colors group-hover:text-cyan-700">
            {note.title}
          </h3>
        </div>
        <div
          ref={menuRef}
          className="flex shrink-0 items-center gap-0.5"
          onMouseEnter={handleCardMouseEnter}
        >
          <FavoriteButton note={note} onToggleFavorite={onToggleFavorite} />
          <button
            type="button"
            onClick={handleMenuToggle}
            className="rounded-xl p-1.5 text-slate-300 transition-colors hover:bg-slate-100/60 hover:text-slate-600"
            aria-label="More actions"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          style={{ originY: 0 }}
          className="absolute right-0 top-full z-[9999] mt-2 w-40 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl p-1"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(false)
              navigate(`/app/notes/${note.id}/edit`)
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100/80"
          >
            <Pencil size={14} className="shrink-0 opacity-70" />
            <span className="flex-1 truncate">Edit</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(false)
              setConfirmDelete(true)
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            <Trash2 size={14} className="shrink-0 opacity-70" />
            <span className="flex-1 truncate">Delete</span>
          </button>
        </motion.div>
      )}

      {note.content && (
        <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-500">{excerpt(note.content)}</p>
      )}

      <div
        className={cn(
          'flex items-center gap-2',
          !isList && 'mt-4',
          isList && 'ml-auto shrink-0',
        )}
      >
        {category && (
          <span className="hidden items-center gap-1 rounded-full border border-cyan-200/70 bg-cyan-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700 sm:inline-flex">
            {category.name}
          </span>
        )}
        <span className="flex flex-wrap items-center gap-1">
          {tagNames.slice(0, 2).map((name) => (
            <span
              key={name}
              className="inline-flex items-center rounded-full border border-purple-200/70 bg-purple-50/70 px-2.5 py-0.5 text-[11px] font-medium text-purple-700"
            >
              #{name}
            </span>
          ))}
          {tagNames.length > 2 && (
            <span className="text-[11px] font-medium text-slate-400">+{tagNames.length - 2}</span>
          )}
        </span>
      </div>

      <div className={cn('flex items-center justify-between gap-2 border-t border-slate-100', !isList && 'mt-4 pt-3', isList && 'ml-4 shrink-0 border-t-0 pt-0')}>
        <span className="mono text-[11px] tabular font-medium text-slate-400">{relativeTime(note.updated_at)}</span>
        <div className="flex items-center gap-2">
          {note.is_archived && <Archive size={13} className="text-slate-400" />}
          <StatusPill status={note.status} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this note?"
        description={`"${note.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete note"
        busy={deleting}
      />
    </motion.article>
  )
}

function StatusPill({ status }) {
  const meta = STATUS_META[status]
  if (!meta) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5">
      <span className={cn('h-1.5 w-1.5 rounded-full ring-2', meta.dot, meta.ring)} />
      <span className="text-[11px] font-semibold text-slate-600">{meta.label}</span>
    </span>
  )
}
