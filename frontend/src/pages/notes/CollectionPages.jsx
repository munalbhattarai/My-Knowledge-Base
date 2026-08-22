import { useParams } from 'react-router-dom'
import { NotesPage } from './NotesPage'

export function CategoryNotesPage() {
  const { id } = useParams()
  return (
    <NotesPage
      title="Notes by category"
      fixedFilters={{ category: id }}
      emptyTitle="No notes in this category"
      emptyDescription="Notes in this category will appear here."
    />
  )
}

export function TagNotesPage() {
  const { id } = useParams()
  return (
    <NotesPage
      title="Notes by tag"
      fixedFilters={{ tags: id }}
      emptyTitle="No notes with this tag"
      emptyDescription="Notes tagged with this will appear here."
    />
  )
}