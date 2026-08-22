import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const sizes = {
  xs: 'h-7 w-7 rounded-lg',
  sm: 'h-8.5 w-8.5 rounded-xl',
  md: 'h-9.5 w-9.5 rounded-xl',
}

const IconButton = forwardRef(function IconButton(
  { size = 'sm', className, label, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center text-slate-500',
        'transition-all duration-150 hover:text-slate-800 hover:bg-slate-200/60 active:scale-95',
        'disabled:pointer-events-none disabled:opacity-40',
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})

export default IconButton