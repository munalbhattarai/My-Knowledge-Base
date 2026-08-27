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
        'inline-flex h-9.5 items-center gap-1.5 rounded-2xl border px-3.5 text-xs font-bold transition-all duration-150 shadow-xs select-none cursor-pointer',
        active
          ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
          : 'border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
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
    <div className="flex flex-wrap items-center gap-2.5">
      <Popover
        width="w-48"
        trigger={({ toggle, open }) => (
          <FilterButton active={!!filters.status} onClick={toggle}>
            {filters.status ? STATUS_META[filters.status]?.label : 'Status'}
            <ChevronDown size={13} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
          </FilterButton>
        )}
      >
        {({ close }) => (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-1">
            <MenuLabel>Status</MenuLabel>
            <OptionList options={statusOptions} value={filters.status} onSelect={(v) => { onChange('status', v); close() }} />
          </div>
        )}
      </Popover>

      <Popover
        width="w-52"
        trigger={({ toggle, open }) => (
          <FilterButton active={!!filters.category} onClick={toggle}>
            {filters.category ? categories.find((c) => String(c.id) === filters.category)?.name : 'Category'}
            <ChevronDown size={13} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
          </FilterButton>
        )}
      >
        {({ close }) => (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-1">
            <MenuLabel>Category</MenuLabel>
            <OptionList options={categoryOptions} value={filters.category} onSelect={(v) => { onChange('category', v); close() }} />
          </div>
        )}
      </Popover>

      <Popover
        width="w-52"
        trigger={({ toggle, open }) => (
          <FilterButton active={!!filters.tags} onClick={toggle}>
            {filters.tags ? tags.find((t) => String(t.id) === filters.tags)?.name : 'Tag'}
            <ChevronDown size={13} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
          </FilterButton>
        )}
      >
        {({ close }) => (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-1">
            <MenuLabel>Tag</MenuLabel>
            <OptionList options={tagOptions} value={filters.tags} onSelect={(v) => { onChange('tags', v); close() }} />
          </div>
        )}
      </Popover>

      <button
        type="button"
        onClick={() => onChange('isFavorite', filters.isFavorite ? undefined : true)}
        className={cn(
          'inline-flex h-9.5 items-center gap-1.5 rounded-2xl border px-3.5 text-xs font-bold transition-all duration-150 shadow-xs select-none cursor-pointer',
          filters.isFavorite
            ? 'border-amber-400 bg-amber-100/60 text-amber-900 shadow-sm'
            : 'border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
        )}
      >
        <Star size={13} fill={filters.isFavorite ? 'currentColor' : 'none'} className={filters.isFavorite ? 'text-amber-500' : 'text-slate-400'} />
        Favorites
      </button>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9.5 items-center gap-1.5 rounded-2xl px-3 text-xs font-bold text-slate-500 transition-colors hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer"
        >
          <RotateCcw size={13} />
          Clear
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        {allowViewToggle && (
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => onLayoutChange('grid')}
              className={cn(
                'rounded-xl p-1.5 transition-all cursor-pointer',
                layout === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700',
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => onLayoutChange('list')}
              className={cn(
                'rounded-xl p-1.5 transition-all cursor-pointer',
                layout === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700',
              )}
              aria-label="List view"
            >
              <List size={15} />
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
      <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search in notes…"
        className="h-10 w-full rounded-2xl border border-slate-200/80 bg-white pl-10 pr-12 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-xs transition-all hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
      />
      <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-700"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}