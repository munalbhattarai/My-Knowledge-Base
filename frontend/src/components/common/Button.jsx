import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Spinner } from './Spinner'

const variants = {
  primary:
    'bg-[#1e293b] text-white font-semibold shadow-md shadow-slate-900/10 hover:bg-[#0f172a] hover:shadow-lg active:scale-[0.98]',
  subtle:
    'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 active:scale-[0.98]',
  carbon:
    'bg-[#1e293b] text-white hover:bg-[#0f172a] shadow-sm active:scale-[0.98]',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
  outline:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs active:scale-[0.98]',
  pastel:
    'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 active:scale-[0.98]',
  danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100/80 border border-rose-200',
  'danger-solid': 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/20',
}

const sizes = {
  xs: 'h-7 px-3 text-xs gap-1.5 rounded-xl',
  sm: 'h-8.5 px-3.5 text-[13px] gap-1.5 rounded-xl',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-5 text-sm gap-2 rounded-2xl font-bold',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'select-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size={14} className="shrink-0" />}
      {children}
    </motion.button>
  )
})

export default Button