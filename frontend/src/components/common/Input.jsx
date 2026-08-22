import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(function Input(
  { label, error, hint, className, prefix, suffix, id, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10.5 rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-md px-3.5 text-sm text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]',
            'placeholder:text-slate-400 transition-all duration-150',
            'hover:border-slate-300 hover:bg-white',
            'focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15',
            'disabled:opacity-50 disabled:pointer-events-none',
            prefix ? 'pl-10' : '',
            suffix ? 'pr-10' : '',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15',
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-xs font-medium text-rose-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
})

export default Input