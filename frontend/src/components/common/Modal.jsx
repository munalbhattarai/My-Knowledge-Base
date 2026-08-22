import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

const widths = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, description, children, footer, width = 'md', hideClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
            className={cn(
              'relative w-full rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl shadow-2xl overflow-hidden',
              widths[width],
            )}
          >
            {/* Top cyan-to-purple gradient line */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500" />
            
            <div className="flex items-start justify-between gap-4 p-6 pb-0">
              <div>
                {title && <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>}
                {description && <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{description}</p>}
              </div>
              {!hideClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-1.5 text-slate-400 transition-colors hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="p-6">{children}</div>
            {footer && <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}