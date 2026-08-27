import { cn } from '@/utils/cn'

export function PushPin({ color = 'orange', className, size = 'md' }) {
  const pinColors = {
    orange: {
      head: 'from-[#fb923c] via-[#f97316] to-[#c2410c]',
      glow: 'rgba(249, 115, 22, 0.5)',
      shadow: 'pin-shadow-orange',
      cap: '#fdba74',
    },
    blue: {
      head: 'from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8]',
      glow: 'rgba(59, 130, 246, 0.5)',
      shadow: 'pin-shadow-blue',
      cap: '#93c5fd',
    },
    purple: {
      head: 'from-[#c084fc] via-[#a855f7] to-[#7e22ce]',
      glow: 'rgba(168, 85, 247, 0.5)',
      shadow: 'pin-shadow-purple',
      cap: '#d8b4fe',
    },
    green: {
      head: 'from-[#4ade80] via-[#22c55e] to-[#15803d]',
      glow: 'rgba(34, 197, 94, 0.5)',
      shadow: 'pin-shadow-green',
      cap: '#86efac',
    },
    red: {
      head: 'from-[#f87171] via-[#ef4444] to-[#b91c1c]',
      glow: 'rgba(239, 68, 68, 0.5)',
      shadow: 'pin-shadow-orange',
      cap: '#fca5a5',
    },
  }

  const selected = pinColors[color] || pinColors.orange

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center select-none', selected.shadow, className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizes[size], 'shrink-0')}
      >
        {/* Soft Ambient Base Shadow */}
        <ellipse cx="16" cy="26" rx="8" ry="3.5" fill="rgba(0,0,0,0.18)" />
        
        {/* Pin Stem / Base */}
        <circle cx="16" cy="16" r="10" fill={`url(#pin-grad-${color})`} />
        
        {/* Glossy Spherical Highlight (3D Glass Bead Effect) */}
        <ellipse cx="13" cy="13" rx="4.5" ry="3" fill="rgba(255, 255, 255, 0.65)" />
        <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
        
        {/* Center Cap Indent */}
        <circle cx="16" cy="16" r="4.5" fill={selected.cap} opacity="0.8" />
        <circle cx="16" cy="16" r="2.5" fill="#ffffff" opacity="0.5" />

        <defs>
          <radialGradient
            id={`pin-grad-${color}`}
            cx="35%"
            cy="35%"
            r="65%"
            fx="30%"
            fy="30%"
          >
            <stop offset="0%" stopColor={selected.cap} />
            <stop offset="50%" stopColor={color === 'orange' ? '#f97316' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#a855f7' : '#22c55e'} />
            <stop offset="100%" stopColor={color === 'orange' ? '#9a3412' : color === 'blue' ? '#1e3a8a' : color === 'purple' ? '#581c87' : '#14532d'} />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
