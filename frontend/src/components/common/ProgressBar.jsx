import { cn } from '@/utils/cn'

export function ProgressBar({ value = 0, className, trackClassName }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 shadow-inner', trackClassName)}>
      <div
        className={cn('h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-[width] duration-500 ease-out shadow-sm shadow-cyan-500/30', className)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}