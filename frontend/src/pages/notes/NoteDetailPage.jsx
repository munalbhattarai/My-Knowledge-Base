import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Pencil,
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  Trash2,
  Folder,
  Tag,
  CalendarClock,
  ChevronRight,
  SquareCode,
  Link2,
} from 'lucide-react'
import { notesApi } from '@/api/notesApi'
import { httpError } from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { Markdown } from '@/components/markdown/Markdown'
import { CodeBlock } from '@/components/code/CodeBlock'
import { ResourceItem } from '@/components/resources/ResourceItem'
import { STATUS_META } from '@/utils/status'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Popover, MenuItem, MenuDivider } from '@/components/common/Popover'
import { formatDateTime } from '@/utils/time'
import { cn } from '@/utils/cn'

function SectionHeading({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-cyan-600" />
      <span className="mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {children}
      </span>
    </div>
  )
}

export default function NoteDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    setError(null)
    notesApi
      .get(id)
      .then(setNote)
      .catch((err) => setError(httpError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const toggleFavorite = async () => {
    const next = !note.is_favorite
    setNote((n) => ({ ...n, is_favorite: next }))
    try {
      await notesApi.patch(note.id, { is_favorite: next })
      toast.success(next ? 'Added to favorites' : 'Removed from favorites')
    } catch {
      setNote((n) => ({ ...n, is_favorite: !next }))
      toast.error('Could not update favorite')
    }
  }

  const toggleArchived = async () => {
    const next = !note.is_archived
    try {
      await notesApi.patch(note.id, { is_archived: next })
      setNote((n) => ({ ...n, is_archived: next }))
      toast.success(next ? 'Note archived' : 'Note restored')
      if (next) navigate('/app/notes')
    } catch {
      toast.error('Could not update the note')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await notesApi.remove(note.id)
      toast.success('Note deleted')
      navigate('/app/notes')
    } catch {
      setDeleting(false)
      toast.error('Could not delete the note')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl">
        <Skeleton className="h-4 w-28 rounded-lg" />
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-4 w-48 rounded-lg" />
        <div className="my-2 h-px bg-slate-100" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
          <Skeleton className="h-4 w-11/12 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <EmptyState
        icon={<Link2 size={20} />}
        title="Note not found"
        description={error?.message || 'It may have been deleted.'}
        action={
          <Link to="/app/notes">
            <span className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-300">
              Back to notes
            </span>
          </Link>
        }
      />
    )
  }

  // Backend returns nested {id, name} objects for category and tags.
  const category = note.category && typeof note.category === 'object' ? note.category : null
  const tagNames = (note.tags || []).map((t) => (typeof t === 'object' && t !== null ? t.name : null)).filter(Boolean)
  const statusMeta = STATUS_META[note.status]
  const hasSnippets = (note.code_snippets || []).length > 0
  const hasResources = (note.resources || []).length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-9"
    >
      {/* Top cyan-to-purple gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500" />

      {/* 3-dot menu — top-right corner */}
      <div className="absolute right-4 top-5 z-10 sm:right-6">
        <Popover
          width="w-48"
          align="end"
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              className="rounded-xl border border-slate-200/90 bg-white/90 p-2.5 text-slate-500 shadow-xs transition-all hover:border-slate-300 hover:text-slate-900"
              aria-label="More actions"
            >
              <MoreHorizontal size={16} />
            </button>
          )}
        >
          {({ close }) => (
            <>
              <MenuItem
                icon={note.is_archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                label={note.is_archived ? 'Restore note' : 'Archive note'}
                onClick={() => {
                  close()
                  toggleArchived()
                }}
              />
              <MenuDivider />
              <MenuItem
                icon={<Trash2 size={15} />}
                label="Delete note"
                danger
                onClick={() => {
                  close()
                  setConfirmDelete(true)
                }}
              />
            </>
          )}
        </Popover>
      </div>

      <nav className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
        <button
          type="button"
          onClick={() => navigate('/app/notes')}
          className="inline-flex items-center gap-1 rounded-xl px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft size={14} />
          Notes
        </button>
        <ChevronRight size={13} className="text-slate-300" />
        <span className="truncate px-1 font-semibold text-slate-700">{note.title}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <h1 className="text-balance text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
          {note.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-medium text-slate-500">
          {statusMeta && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 shadow-xs">
              <span className={cn('h-2 w-2 rounded-full ring-2', statusMeta.dot, statusMeta.ring)} />
              <span className="font-semibold text-slate-700">{statusMeta.label}</span>
            </span>
          )}
          {category && (
            <Link
              to={`/app/category/${category.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 font-semibold text-cyan-700 shadow-xs transition-colors hover:border-cyan-300"
            >
              <Folder size={13} />
              {category.name}
            </Link>
          )}
          {tagNames.map((name) => (
            <span key={name} className="inline-flex items-center gap-1 rounded-full border border-purple-200/80 bg-purple-50/80 px-3 py-1 font-medium text-purple-700 shadow-xs">
              <Tag size={12} />
              {name}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <CalendarClock size={13} />
            Updated {formatDateTime(note.updated_at)}
          </span>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={toggleFavorite}
            className={cn(
              'inline-flex h-9.5 items-center gap-1.5 rounded-xl border px-3.5 text-[13px] font-semibold transition-all shadow-xs',
              note.is_favorite
                ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm'
                : 'border-slate-200/90 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-white',
            )}
          >
            <motion.span
              key={String(note.is_favorite)}
              initial={{ scale: 0.7, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
              className="flex"
            >
              <Star size={15} fill={note.is_favorite ? 'currentColor' : 'none'} className={note.is_favorite ? 'text-amber-500' : 'text-slate-400'} />
            </motion.span>
            {note.is_favorite ? 'Favorited' : 'Favorite'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/app/notes/${note.id}/edit`)}
            className="inline-flex h-9.5 items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 text-[13px] font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-white"
          >
            <Pencil size={14} className="text-cyan-600" />
            Edit
          </button>
        </div>
      </header>

      <div className="my-8 h-px bg-slate-100" />

      <div className="max-w-[72ch]">
        <Markdown content={note.content} className="lumen-prose" />
      </div>

      {hasSnippets && (
        <section className="mt-12 pt-8 border-t border-slate-100">
          <SectionHeading icon={SquareCode}>
            Code snippets · {note.code_snippets.length}
          </SectionHeading>
          <div className="mt-4 flex flex-col gap-5">
            {note.code_snippets.map((snippet) => (
              <CodeBlock
                key={snippet.id}
                code={snippet.code}
                language={snippet.language}
                title={snippet.title}
              />
            ))}
          </div>
        </section>
      )}

      {hasResources && (
        <section className="mt-12 pt-8 border-t border-slate-100">
          <SectionHeading icon={Link2}>Resources · {note.resources.length}</SectionHeading>
          <div className="mt-3 flex flex-col gap-2">
            {note.resources.map((resource) => (
              <ResourceItem key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this note?"
        description={`"${note.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete note"
        busy={deleting}
      />
    </motion.div>
  )
}