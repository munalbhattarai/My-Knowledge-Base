import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { AuthVisual } from './AuthVisual'

export function AuthLayout({ children, title, subtitle, footer }) {
  return (
    <div className="flex h-screen overflow-hidden bg-ink">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden border-r border-line bg-panel p-10 lg:flex">
        {/* fine dot grid — restrained texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(160,160,176,0.13) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* vertical scanline for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent 0%, transparent 55%, rgba(242,107,58,0.05) 95%, transparent 100%)',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <Link to="/login">
            <Logo size="md" />
          </Link>
          <span className="mono rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-fg-faint">
            v0.1
          </span>
        </div>

        <div className="relative z-10">
          <AuthVisual />
        </div>

        <div className="relative z-10">
          <p className="text-balance max-w-md text-lg font-medium leading-snug tracking-tight text-fg">
            Knowledge you actually revisit — notes, snippets and resources in one
            searchable graph.
          </p>
          <p className="mono mt-3 text-[11px] text-fg-subtle">~/knowledge-base</p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center overflow-hidden px-6 py-8 sm:px-12 lg:max-w-[520px]">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 lg:hidden">
            <Logo size="md" />
          </div>

          <p className="mono mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
            /access
          </p>
          <h2 className="text-[26px] font-semibold tracking-tight text-fg">{title}</h2>
          {subtitle && <p className="mt-1.5 text-[14px] text-fg-secondary">{subtitle}</p>}

          <div className="mt-6 rounded-xl border border-line bg-panel p-4 shadow-raise sm:p-5">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-[13px] text-fg-faint">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
