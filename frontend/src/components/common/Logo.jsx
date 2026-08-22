import { cn } from '@/utils/cn'

export function Logo({ size = 'md', className }) {
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-8.5 w-8.5 text-sm',
    lg: 'h-10 w-10 text-base',
  }
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 font-mono font-bold text-white shadow-md shadow-cyan-500/25 ring-1 ring-white/40',
          sizes[size],
        )}
      >
        kb
      </div>
      {size !== 'sm' && (
        <div className="flex flex-col leading-none">
          <span className="text-[16px] font-bold tracking-tight text-slate-900">knowledge base</span>
        </div>
      )}
    </div>
  )
}