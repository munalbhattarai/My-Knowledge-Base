import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Bookmark, SearchX, WifiOff } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { NotesGrid } from '@/components/notes/NotesGrid'
import { NotesGridSkeleton } from '@/components/notes/NotesGridSkeleton'
import { NotesFilters, NotesSearch } from '@/components/notes/NotesFilters'
import { Pagination } from '@/components/notes/Pagination'
import { EmptyState } from '@/components/common/EmptyState'
import Button from '@/components/common/Button'
import { useNotes } from '@/hooks/useNotes'
import { useToast } from '@/hooks/useToast'
import { notesApi } from '@/api/notesApi'
import { setCommandPaletteOpen } from '@/store/slices/uiSlice'

const LAYOUT_KEY = 'mino.layout'

export function NotesPage({
  title = 'All Notes',
  description,
  fixedFilters = {},
  emptyTitle = 'No notes here yet',
  emptyDescription = 'Capture what you learn — create your first note.',
  showCreate = true,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  const [searchParams, setSearchParams] = useSearchParams()
  const [layout, setLayout] = useState(() => localStorage.getItem(LAYOUT_KEY) || 'grid')

  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || fixedFilters.status || ''
  const category = searchParams.get('category') || fixedFilters.category || ''
  const tag = searchParams.get('tags') || fixedFilters.tags || ''
  const isFavorite = fixedFilters.isFavorite ?? (searchParams.get('favorite') === '1' ? true : undefined)

  const { data, loading, error, page, setPage, setResults } = useNotes({
    search,
    status,
    category,
    tags: tag,
    isFavorite,
    isArchived: fixedFilters.isArchived,
  })

  const count = data?.count ?? 0
  const notes = data?.results ?? []

  const changeFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === undefined || value === '' || value === null) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    const next = new URLSearchParams()
    setSearchParams(next, { replace: true })
  }

  const onLayoutChange = (next) => {
    setLayout(next)
    localStorage.setItem(LAYOUT_KEY, next)
  }

  const toggleFavorite = async (note) => {
    const next = !note.is_favorite
    setResults((results) => results.map((n) => (n.id === note.id ? { ...n, is_favorite: next } : n)))
    try {
      await notesApi.patch(note.id, { is_favorite: next })
      toast.success(next ? 'Added to favorites' : 'Removed from favorites')
    } catch {
      setResults((results) =>
        results.map((n) => (n.id === note.id ? { ...n, is_favorite: note.is_favorite } : n)),
      )
      toast.error('Could not update favorite')
    }
  }

  const handleDelete = async (note) => {
    try {
      await notesApi.remove(note.id)
      setResults((results) => results.filter((n) => n.id !== note.id))
      toast.success('Note deleted')
    } catch {
      toast.error('Could not delete the note')
    }
  }

  const isFiltered =
    Boolean(search) || Boolean(status) || Boolean(category) || Boolean(tag) || Boolean(isFavorite)

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-display">
              {title}
            </h2>
            {!loading && data && (
              <span className="rounded-full bg-white border border-slate-200/80 px-3 py-0.5 text-xs font-bold text-slate-600 shadow-xs font-mono">
                {count} {count === 1 ? 'note' : 'notes'}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <NotesSearch
            value={search}
            onChange={(v) => changeFilter('search', v || undefined)}
            onOpenCommand={() => dispatch(setCommandPaletteOpen(true))}
          />
          {showCreate && (
            <Button size="md" onClick={() => navigate('/app/notes/new')}>
              <Plus size={16} />
              <span className="hidden sm:inline">New note</span>
            </Button>
          )}
        </div>
      </header>

      {/* Filter Row */}
      <NotesFilters
        filters={{ status, category, tags: tag, isFavorite }}
        onChange={changeFilter}
        onClear={clearFilters}
        allowViewToggle
        layout={layout}
        onLayoutChange={onLayoutChange}
      />

      {/* Content Grid */}
      {error ? (
        <EmptyState
          icon={<WifiOff size={20} />}
          title="Couldn't load notes"
          description={error.message}
          action={
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      ) : loading ? (
        <NotesGridSkeleton layout={layout} />
      ) : notes.length === 0 ? (
        <div className="rounded-[28px] bg-white border border-slate-200/80 p-8 text-center">
          <EmptyState
            icon={isFiltered ? <SearchX size={22} /> : <Bookmark size={22} />}
            title={isFiltered ? 'No notes match' : emptyTitle}
            description={
              isFiltered
                ? 'Try clearing your active filters or search terms.'
                : emptyDescription
            }
            action={
              isFiltered ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        <>
          <NotesGrid notes={notes} layout={layout} onToggleFavorite={toggleFavorite} onDelete={handleDelete} />
          <Pagination data={data} page={page} setPage={setPage} />
        </>
      )}
    </div>
  )
}