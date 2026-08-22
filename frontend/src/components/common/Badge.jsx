import { cn } from '@/utils/cn'

const tones = {
  neutral: 'border-slate-200/80 bg-slate-100/70 text-slate-700 font-medium',
  accent: 'border-cyan-200 bg-cyan-50/80 text-cyan-700 font-semibold',
  purple: 'border-purple-200 bg-purple-50/80 text-purple-700 font-semibold',
  teal: 'border-teal-200 bg-teal-50/80 text-teal-700 font-semibold',
  ok: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 font-semibold',
  review: 'border-amber-200 bg-amber-50/80 text-amber-700 font-semibold',
  danger: 'border-rose-200 bg-rose-50/80 text-rose-700 font-semibold',
  gold: 'border-amber-200 bg-amber-50/80 text-amber-700 font-semibold',
}

export function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] leading-4 shadow-sm',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}