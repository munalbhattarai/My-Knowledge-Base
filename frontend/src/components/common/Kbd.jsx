export function Kbd({ children, className }) {
  return (
    <kbd
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-slate-200 bg-slate-100/90 px-1.5 font-mono text-[10px] font-semibold text-slate-600 shadow-[inset_0_-1px_0_rgba(0,0,0,0.1)] ${className || ''}`}
    >
      {children}
    </kbd>
  )
}