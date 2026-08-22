import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export function Toggle({ checked, onChange, label, description, className, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-md px-0 text-left',
        'disabled:opacity-50',
        className,
      )}
    >
      <span>
        {label && <span className="block text-sm font-medium text-fg">{label}</span>}
        {description && <span className="block text-xs text-fg-faint">{description}</span>}
      </span>
      <span
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200',
          checked ? 'border-accent bg-accent' : 'border-line-strong bg-surface-2',
        )}
      >
        <motion.span
          animate={{ x: checked ? 18 : 2 }}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.3 }}
          className="inline-block h-3.5 w-3.5 rounded-full bg-fg shadow-sm"
        />
      </span>
    </button>
  )
}