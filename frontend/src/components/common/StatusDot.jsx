import { cn } from '@/utils/cn'
import { STATUS_META } from '@/utils/status'

export function StatusDot({ status, showLabel = true, className }) {
  const meta = STATUS_META[status] || STATUS_META.LEARNING
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-fg-faint', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full ring-2', meta.dot, meta.ring)} />
      {showLabel && <span className="text-xs">{meta.label}</span>}
    </span>
  )
}