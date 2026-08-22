import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export function Popover({ trigger, children, align = 'start', width = 'w-56', className }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const toggle = () => setOpen((o) => !o)
  const close = () => setOpen(false)

  return (
    <div ref={rootRef} className="relative inline-block">
      {trigger({ open, toggle })}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={close}
              onContextMenu={(e) => {
                e.preventDefault()
                close()
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              style={{ originY: 0 }}
              className={cn(
                'absolute left-0 top-full z-[9999] mt-2 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl p-1',
                align === 'end' ? 'right-0 left-auto' : '',
                width,
                className,
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {children({ close })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export function MenuItem({ icon, label, onClick, active, danger, kbd, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.()
        onSelect?.()
      }}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors',
        'hover:bg-slate-100/80',
        active ? 'text-cyan-700 bg-cyan-50/80' : 'text-slate-700',
        danger && 'text-rose-600 hover:bg-rose-50',
      )}
    >
      {icon && <span className="shrink-0 opacity-70">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {kbd && <span className="font-mono text-[10px] text-slate-400">{kbd}</span>}
    </button>
  )
}

export function MenuDivider() {
  return <div className="my-1 h-px bg-slate-100" />
}

export function MenuLabel({ children }) {
  return <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{children}</div>
}
