import { Skeleton } from '@/components/common/Skeleton'

export function NoteCardSkeleton({ layout = 'grid' }) {
  if (layout === 'list') {
    return (
      <div className="flex items-center gap-4 px-4 py-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="ml-auto h-4 w-24" />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  )
}

export function NotesGridSkeleton({ layout = 'grid', count = 6 }) {
  return (
    <div
      className={`grid gap-3 ${
        layout === 'grid'
          ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          : 'grid-cols-1 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface'
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <NoteCardSkeleton key={i} layout={layout} />
      ))}
    </div>
  )
}