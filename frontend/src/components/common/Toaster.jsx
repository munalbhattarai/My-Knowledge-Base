import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '@/store/slices/uiSlice'
import { cn } from '@/utils/cn'

const icons = {
  success: <CheckCircle2 size={18} className="text-emerald-500" />,
  error: <AlertCircle size={18} className="text-rose-500" />,
  info: <Info size={18} className="text-cyan-500" />,
}

function ToastItem({ toast }) {
  const dispatch = useDispatch()
  const dismiss = () => dispatch(removeToast(toast.id))

  useEffect(() => {
    const timer = setTimeout(dismiss, toast.type === 'success' ? 3200 : 5000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
      className={cn(
        'pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-xl p-3.5 shadow-xl',
      )}
      role="status"
    >
      <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-slate-900">{toast.title}</p>
        {toast.message && <p className="mt-0.5 text-[13px] leading-snug text-slate-500">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-700 hover:bg-slate-100"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export function Toaster() {
  const toasts = useSelector((state) => state.ui.toasts)
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}