import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function Tooltip({ label, children, side = 'top', delay = 0.4 }) {
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef(null)
  const id = useId()
  let timer

  const show = () => {
    clearTimeout(timer)
    timer = setTimeout(() => setVisible(true), delay * 1000)
  }
  const hide = () => {
    clearTimeout(timer)
    setVisible(false)
  }

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            role="tooltip"
            id={id}
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            transition={{ duration: 0.12 }}
            className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-line-strong bg-panel px-2 py-1 text-xs text-fg-secondary shadow-pop ${
              side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            }`}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}