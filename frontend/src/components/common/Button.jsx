import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Spinner } from './Spinner'

const variants = {
  primary:
    'bg-gradient-to-r from-cyan-500 via-teal-500 to-teal-600 text-white font-semibold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 hover:brightness-105 active:scale-[0.98] border border-cyan-400/30',
  subtle:
    'bg-slate-900 text-white hover:bg-slate-800 shadow-sm border border-slate-800 active:scale-[0.98]',
  carbon:
    'bg-slate-900 text-white hover:bg-slate-800 shadow-sm border border-slate-800 active:scale-[0.98]',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
  outline:
    'border border-slate-200/90 bg-white/70 backdrop-blur-md text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-sm',
  danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100/70 border border-rose-200/80',
  'danger-solid': 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/20',
}

const sizes = {
  xs: 'h-7 px-3 text-xs gap-1.5 rounded-lg',
  sm: 'h-8 px-3.5 text-[13px] gap-1.5 rounded-xl',
  md: 'h-9.5 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl font-semibold',
}

const Button = forwardRef(function Button(
  { variant = 'subtle', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'select-none disabled:pointer-events-none disabled:opacity-50',
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