import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

const Select = forwardRef(function Select(
  { label, error, hint, className, children, placeholder, ...props },
  ref,
) {
  const inputId = props.name
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full appearance-none rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-md py-2.5 pl-3.5 pr-10 text-sm text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]',
            'transition-all duration-150 hover:border-slate-300 hover:bg-white',
            'focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15',
            'disabled:opacity-50',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15',
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {error ? (
        <p className="text-xs font-medium text-rose-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
})

export default Select