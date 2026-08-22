import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export const PAGE_SIZE = 10

export function Pagination({ data, page, setPage, className }) {
  if (!data || data.count <= PAGE_SIZE) return null
  const totalPages = Math.max(1, Math.ceil(data.count / PAGE_SIZE))
  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <div className={cn('flex items-center justify-between gap-4 pt-4', className)}>
      <p className="text-[13px] text-fg-faint">
        {data.count} note{data.count === 1 ? '' : 's'}
        <span className="mx-1.5">·</span>
        page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => setPage(page - 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-line bg-surface px-2.5 text-[13px] font-medium text-fg-secondary transition-colors hover:border-line-strong hover:text-fg disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => setPage(page + 1)}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-line bg-surface px-2.5 text-[13px] font-medium text-fg-secondary transition-colors hover:border-line-strong hover:text-fg disabled:pointer-events-none disabled:opacity-40"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}