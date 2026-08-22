import { ArrowUpRight, Link2 } from 'lucide-react'
import { RESOURCE_TYPES } from './resourceTypes'
import { cn } from '@/utils/cn'

export function ResourceItem({ resource, className }) {
  const typeKey = resource?.resource_type ? String(resource.resource_type).toUpperCase() : 'OTHER'
  const meta = RESOURCE_TYPES[typeKey] || RESOURCE_TYPES.OTHERS || RESOURCE_TYPES.OTHER || { label: 'Link', icon: Link2 }
  const Icon = meta.icon || Link2

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md p-3.5 shadow-sm',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-md hover:shadow-cyan-500/10',
        className,
      )}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-200/80 bg-cyan-50/80 text-cyan-700 shadow-xs">
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-cyan-700">
          {resource.title}
        </span>
        {resource.description && (
          <span className="mt-0.5 line-clamp-2 block text-[13px] leading-relaxed font-medium text-slate-500">
            {resource.description}
          </span>
        )}
        <span className="mt-1.5 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {meta.label}
        </span>
      </span>
      <ArrowUpRight size={16} className="mt-1 shrink-0 text-slate-400 transition-colors group-hover:text-cyan-600" />
    </a>
  )
}