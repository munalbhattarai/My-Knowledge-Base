import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const sizes = {
  xs: 'h-7 text-xs',
  sm: 'h-8 text-[13px]',
  md: 'h-9 text-sm',
}

export function Segmented({ options, value, onChange, size = 'sm', className, id }) {
  return (
    <div
      className={cn('inline-flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white/70 backdrop-blur-md p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]', className)}
      role="tablist"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative rounded-lg px-3 font-semibold transition-colors duration-150',
              sizes[size],
              active ? 'text-white' : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {active && (
              <motion.span
                layoutId={`segmented-${id || 'default'}`}
                className="absolute inset-0 rounded-lg bg-slate-900 shadow-sm"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}