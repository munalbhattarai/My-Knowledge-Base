import { NoteCard } from './NoteCard'
import { cn } from '@/utils/cn'

export function NotesGrid({ notes, layout = 'grid', onToggleFavorite, onDelete }) {
  const isList = layout === 'list'

  return (
    <div
      className={cn(
        'grid gap-3',
        !isList && 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        isList && 'grid-cols-1 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface',
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