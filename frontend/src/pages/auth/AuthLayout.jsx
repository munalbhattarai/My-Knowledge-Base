import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { AuthVisual } from './AuthVisual'

export function AuthLayout({ children, title, subtitle, footer }) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50 text-slate-800 antialiased">
      {/* Background Ambient Radial Glow Orbs */}
      <div className="pointer-events-none fixed top-0 left-1/4 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 right-10 h-[500px] w-[500px] rounded-full bg-purple-400/15 blur-[140px]" />
      <div className="pointer-events-none fixed top-1/2 left-10 h-[400px] w-[400px] rounded-full bg-teal-400/10 blur-[120px]" />

      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden border-r border-slate-200/80 bg-white/60 backdrop-blur-2xl p-10 lg:flex">
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/login">
            <Logo size="md" />
          </Link>
          <span className="mono rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 shadow-xs">
            v0.1
          </span>
        </div>

        <div className="relative z-10 my-auto py-6">
          <AuthVisual />
        </div>

        <div className="relative z-10">
          <p className="text-balance max-w-md text-xl font-bold leading-snug tracking-tight text-slate-900">
            Knowledge you actually revisit — notes, snippets and resources in one
            searchable graph.
          </p>
          <p className="mono mt-3 text-[11px] font-semibold text-slate-400">~/knowledge-base</p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center overflow-y-auto px-6 py-8 sm:px-12 lg:max-w-[520px]">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 lg:hidden">
            <Logo size="md" />
          </div>

          <p className="mono mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-600">
            /access
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1.5 text-[14px] font-medium text-slate-500">{subtitle}</p>}

          <div className="relative mt-6 rounded-3xl border border-slate-200/90 bg-white/90 backdrop-blur-2xl p-6 shadow-xl shadow-slate-200/50 sm:p-7 overflow-hidden">
            {/* Top cyan-to-purple accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500" />
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-[13px] font-medium text-slate-500">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
