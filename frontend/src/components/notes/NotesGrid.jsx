import { NoteCard } from './NoteCard'
import { cn } from '@/utils/cn'

export function NotesGrid({ notes, layout = 'grid', onToggleFavorite, onDelete }) {
  const isList = layout === 'list'

  return (
    <div
      className={cn(
        'grid gap-5',
        !isList && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        isList && 'grid-cols-1 gap-3',
      )}
    >
      {notes.map((note, i) => (
        <NoteCard
          key={note.id}
          note={note}
          layout={layout}
          index={i}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}