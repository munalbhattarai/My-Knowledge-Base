import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { AuthVisual } from './AuthVisual'
import { PushPin } from '@/components/common/PushPin'

export function AuthLayout({ children, title, subtitle, footer }) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#f4f6fb] text-slate-800 antialiased">
      {/* Left Visual Panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden border-r border-slate-200/80 bg-white p-10 lg:flex">
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/login">
            <Logo size="md" />
          </Link>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 font-mono">
            Mino v1.0
          </span>
        </div>

        <div className="relative z-10 my-auto py-6">
          <AuthVisual />
        </div>

        <div className="relative z-10">
          <p className="text-balance max-w-md text-2xl font-extrabold leading-snug tracking-tight text-slate-900 font-display">
            Notes, snippets &amp; knowledge taking experience in one beautiful workspace.
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-400 font-mono">~/mino-notes</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full flex-col justify-center overflow-y-auto px-6 py-8 sm:px-12 lg:max-w-[500px]">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 lg:hidden">
            <Logo size="md" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Sign In / Sign Up
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">{title}</h2>
          {subtitle && <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>}

          <div className="relative mt-6 rounded-[32px] border border-slate-200/90 bg-white p-7 shadow-lg shadow-slate-200/50">
            {/* 3D Push Pin on top center of the card */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <PushPin color="blue" size="md" />
            </div>

            {children}
          </div>

          {footer && <div className="mt-6 text-center text-xs font-medium text-slate-500">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
