import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  FileText,
  LayoutDashboard,
  Star,
  Clock3,
  Archive,
  Settings,
  Plus,
  CornerDownLeft,
} from 'lucide-react'
import { setCommandPaletteOpen } from '@/store/slices/uiSlice'
import { notesApi } from '@/api/notesApi'
import { useDebounce } from '@/hooks/useDebounce'
import { relativeTime } from '@/utils/time'
import { STATUS_META } from '@/utils/status'
import { cn } from '@/utils/cn'
import { Kbd } from '@/components/common/Kbd'

const ACTION_ITEMS = [
  { id: 'new-note', label: 'Create a new note', hint: 'Notes', icon: Plus, to: '/app/notes/new' },
  { id: 'dashboard', label: 'Go to dashboard', hint: 'Navigate', icon: LayoutDashboard, to: '/app' },
  { id: 'notes', label: 'Go to notes', hint: 'Navigate', icon: FileText, to: '/app/notes' },
  { id: 'favorites', label: 'Go to favorites', hint: 'Navigate', icon: Star, to: '/app/favorites' },
  { id: 'review', label: 'Go to review queue', hint: 'Navigate', icon: Clock3, to: '/app/review' },
  { id: 'archived', label: 'Go to archived', hint: 'Navigate', icon: Archive, to: '/app/archived' },
  { id: 'settings', label: 'Open settings', hint: 'Navigate', icon: Settings, to: '/app/settings' },
]

export function CommandPalette() {
  const open = useSelector((state) => state.ui.commandPaletteOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const debouncedQuery = useDebounce(query, 180)

  const close = useCallback(() => {
    dispatch(setCommandPaletteOpen(false))
    setQuery('')
    setNotes([])
    setActive(0)
  }, [dispatch])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    let cancelled = false
    if (!open) return undefined
    if (!debouncedQuery.trim()) {
      setNotes([])
      setLoading(false)
      return undefined
    }
    setLoading(true)
    notesApi
      .list({ search: debouncedQuery, page: 1 })
      .then((res) => {
        if (!cancelled) {
          setNotes(res.results || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, open])

  const filteredActions = useMemo(
    () =>
      ACTION_ITEMS.filter((a) => a.label.toLowerCase().includes(debouncedQuery.trim().toLowerCase())),
    [debouncedQuery],
  )

  const groups = useMemo(() => {
    const result = []
    if (filteredActions.length) result.push({ label: 'Actions', items: filteredActions.map((a) => ({ kind: 'action', ...a })) })
    if (notes.length) result.push({ label: 'Notes', items: notes.map((n) => ({ kind: 'note', note: n })) })
    return result
  }, [filteredActions, notes])

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (item) => {
    close()
    if (item.kind === 'action') navigate(item.to)
    else navigate(`/app/notes/${item.note.id}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && flat[active]) {
      e.preventDefault()
      run(flat[active])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      setActive((a) => (a + 1) % flat.length)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.28 }}
            className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-1">
              <Search size={17} className="shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search notes or jump to…"
                className="h-13 w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <Kbd>esc</Kbd>
            </div>

            <div ref={listRef} className="max-h-[42vh] overflow-y-auto p-2">
              {loading && (
                <div className="flex items-center gap-2.5 px-3 py-3 text-[13px] font-medium text-slate-400">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  Searching knowledge base…
                </div>
              )}

              {!loading && flat.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] font-medium text-slate-400">
                  {debouncedQuery.trim() ? 'No notes match that search.' : 'Type to search your knowledge base.'}
                </p>
              )}

              {groups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 pb-1 pt-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                    {group.label}
                  </p>
                  {group.items.map((item) => {
                    const index = flat.indexOf(item)
                    const isActive = index === active
                    return (
                      <button
                        key={item.kind === 'action' ? item.id : `note-${item.note.id}`}
                        data-active={isActive}
                        type="button"
                        onMouseEnter={() => setActive(index)}
                        onClick={() => run(item)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-all duration-100 cursor-pointer',
                          isActive ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs' : 'bg-transparent text-slate-700 hover:bg-slate-50',
                        )}
                      >
                        {item.kind === 'action' ? (
                          <>
                            <item.icon size={16} className={cn('shrink-0', isActive ? 'text-slate-900' : 'text-slate-400')} />
                            <span className="flex-1 truncate text-[13px]">{item.label}</span>
                            {item.hint && <span className="text-[11px] font-medium text-slate-400">{item.hint}</span>}
                          </>
                        ) : (
                          <>
                            <FileText size={16} className={cn('shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium">{item.note.title}</span>
                              <span className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                                <StatusMini status={item.note.status} />
                                <span>{relativeTime(item.note.updated_at)}</span>
                              </span>
                            </span>
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 bg-[#f8fafc] px-5 py-2.5 text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={11} />
                open
              </span>
              <span className="ml-auto">⌘K to toggle</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function StatusMini({ status }) {
  const meta = STATUS_META[status]
  if (!meta) return null
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-1.5 w-1.5 rounded-full ring-2', meta.dot, meta.ring)} />
      {meta.label}
    </span>
  )
}