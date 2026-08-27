import { cn } from '@/utils/cn'

export function MinoLogoIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('shrink-0', className)}>
      {/* Left Capsule Arc */}
      <path
        d="M13 6C9.13401 6 6 9.13401 6 13V19C6 22.866 9.13401 26 13 26C14.1046 26 15 25.1046 15 24V8C15 6.89543 14.1046 6 13 6Z"
        fill="#3b82f6"
      />
      {/* Right Circle / Arc */}
      <path
        d="M19 6C17.8954 6 17 6.89543 17 8V24C17 25.1046 17.8954 26 19 26C22.866 26 26 22.866 26 19V13C26 9.13401 22.866 6 19 6Z"
        fill="#1e293b"
      />
    </svg>
  )
}

export function Logo({ size = 'md', className, subtitle }) {
  const containerSizes = {
    sm: 'gap-2',
    md: 'gap-2.5',
    lg: 'gap-3',
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
    lg: 'h-8 w-8',
  }

  return (
    <div className={cn('flex items-center select-none', containerSizes[size], className)}>
      <MinoLogoIcon className={iconSizes[size]} />
      {size !== 'sm' && (
        <div className="flex flex-col leading-none">
          <span className="text-[17px] font-extrabold tracking-tight text-slate-900 font-display uppercase">
            MINO <span className="font-semibold text-slate-500 lowercase text-xs tracking-normal font-sans ml-1">notes</span>
          </span>
          {subtitle && (
            <span className="text-[11px] font-medium text-slate-400 mt-0.5">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  )
}