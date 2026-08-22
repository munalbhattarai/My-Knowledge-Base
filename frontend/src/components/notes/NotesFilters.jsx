import { useMemo } from 'react'
import { Search, X, ChevronDown, Star, RotateCcw, List, LayoutGrid } from 'lucide-react'
import { Popover, MenuItem, MenuLabel } from '@/components/common/Popover'
import { STATUS_META } from '@/utils/status'
import { useEntities } from '@/hooks/useEntities'
import { cn } from '@/utils/cn'
import { Kbd } from '@/components/common/Kbd'

function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold transition-all duration-150 shadow-xs select-none',
        active
          ? 'border-cyan-300 bg-cyan-50 text-cyan-700 shadow-sm'
          : 'border-slate-200/90 bg-white/80 backdrop-blur-md text-slate-700 hover:border-slate-300 hover:bg-white',
      )}
    >
      {children}
    </button>
  )
}

function OptionList({ options, value, onSelect }) {
  return (
    <>
      {options.map((option) => (
        <MenuItem
          key={option.value}
          label={option.label}
          active={option.value === value}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </>
  )
}

export function NotesFilters({ filters, onChange, onClear, allowViewToggle, layout, onLayoutChange }) {
  const { categories, tags } = useEntities()

  const statusOptions = [
    { value: '', label: 'All statuses' },
    ...Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label })),
  ]
  const categoryOptions = useMemo(
    () => [{ value: '', label: 'All categories' }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))],
    [categories],
  )
  const tagOptions = useMemo(
    () => [{ value: '', label: 'All tags' }, ...tags.map((t) => ({ value: String(t.id), label: `#${t.name}` }))],
    [tags],
  )

  const hasFilters = filters.status || filters.category || filters.tags || filters.isFavorite

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover
        width="w-48"
        trigger={({ toggle, open }) => (
          <FilterButton active={!!filters.status} onClick={toggle}>
            {filters.status ? STATUS_META[filters.status]?.label : 'Status'}
            <ChevronDown size={14} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
          </FilterButton>
        )}
      >
        {({ close }) => (
          <>
            <MenuLabel>Status</MenuLabel>
            <OptionList options={statusOptions} value={filters.status} onSelect={(v) => { onChange('status', v); close() }} />
          </>
        )}
      </Popover>

      <Popover
        width="w-52"
        trigger={({ toggle, open }) => (
          <FilterButton active={!!filters.category} onClick={toggle}>
            {filters.category ? categories.find((c) => String(c.id) === filters.category)?.name : 'Category'}
            <ChevronDown size={14} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
          </FilterButton>
        )}
      >
        {({ close }) => (
          <>
            <MenuLabel>Category</MenuLabel>
            <OptionList options={categoryOptions} value={filters.category} onSelect={(v) => { onChange('category', v); close() }} />
          </>
        )}
      </Popover>

      <Popover
        width="w-52"
        trigger={({ toggle, open }) => (
          <FilterButton active={!!filters.tags} onClick={toggle}>
            {filters.tags ? tags.find((t) => String(t.id) === filters.tags)?.name : 'Tag'}
            <ChevronDown size={14} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
          </FilterButton>
        )}
      >
        {({ close }) => (
          <>
            <MenuLabel>Tag</MenuLabel>
            <OptionList options={tagOptions} value={filters.tags} onSelect={(v) => { onChange('tags', v); close() }} />
          </>
        )}
      </Popover>

      <button
        type="button"
        onClick={() => onChange('isFavorite', filters.isFavorite ? undefined : true)}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold transition-all duration-150 shadow-xs select-none',
          filters.isFavorite
            ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm'
            : 'border-slate-200/90 bg-white/80 backdrop-blur-md text-slate-700 hover:border-slate-300 hover:bg-white',
        )}
      >
        <Star size={14} fill={filters.isFavorite ? 'currentColor' : 'none'} className={filters.isFavorite ? 'text-amber-500' : 'text-slate-400'} />
        Favorites
      </button>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-semibold text-slate-500 transition-colors hover:text-slate-800 hover:bg-slate-200/50"
        >
          <RotateCcw size={13} />
          Clear
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        {allowViewToggle && (
          <div className="flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white/70 backdrop-blur-md p-1 shadow-inner">
            <button
              type="button"
              onClick={() => onLayoutChange('grid')}
              className={cn(
                'rounded-lg p-1.5 transition-all',
                layout === 'grid' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700',
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => onLayoutChange('list')}
              className={cn(
                'rounded-lg p-1.5 transition-all',
                layout === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700',
              )}
              aria-label="List view"
            >
              <List size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function NotesSearch({ value, onChange, onOpenCommand }) {
  return (
    <div className="relative w-full sm:w-80">
      <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-600" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search notes…"
        className="h-10 w-full rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-md pl-10 pr-14 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-slate-300 hover:bg-white focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15"
      />
      <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-700 hover:bg-slate-100"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        {!value && (
          <button
            type="button"
            onClick={onOpenCommand}
            className="flex items-center gap-0.5 text-slate-400 transition-colors hover:text-slate-600"
            aria-label="Open command palette"
          >
            <Kbd>⌘K</Kbd>
          </button>
        )}
      </div>
    </div>
  )
}