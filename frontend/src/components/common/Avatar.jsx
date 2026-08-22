import { cn } from '@/utils/cn'

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ name, size = 'md', className }) {
  const sizes = {
    sm: 'h-7 w-7 text-[11px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 font-medium text-fg-secondary',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}