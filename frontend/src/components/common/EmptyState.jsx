import { cn } from '@/utils/cn'

export function EmptyState({ icon, title, description, action, className, compact }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300/80 bg-white/50 backdrop-blur-sm px-6 text-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]',
        compact ? 'py-10' : 'py-16',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50 to-teal-50 text-cyan-600 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-[16px] font-bold tracking-tight text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}