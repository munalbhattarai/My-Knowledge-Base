import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  NotebookPen,
  Star,
  Clock3,
  Archive,
  Settings,
  LogOut,
  ChevronsUpDown,
  Layers,
  Hash,
  Plus,
  Sparkles,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { Avatar } from '@/components/common/Avatar'
import { Popover, MenuItem, MenuDivider } from '@/components/common/Popover'
import { logout } from '@/store/slices/authSlice'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/notes', label: 'All Notes', icon: NotebookPen },
  { to: '/app/favorites', label: 'Favorites', icon: Star },
  { to: '/app/review', label: 'Review Queue', icon: Clock3 },
  { to: '/app/archived', label: 'Trash / Archive', icon: Archive },
]

function NavLinkItem({ item, onNavigate }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex h-10 items-center gap-3.5 rounded-2xl px-3.5 text-[13.5px] font-semibold transition-all duration-200 select-none',
          isActive
            ? 'bg-slate-100/90 text-slate-900 font-bold shadow-xs'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={cn(
              'shrink-0 transition-colors',
              isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600',
            )}
          />
          <span>{item.label}</span>
          {isActive && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-900" />
          )}
        </>
      )}
    </NavLink>
  )
}

function CategorySection({ onNavigate }) {
  const navigate = useNavigate()
  const categories = useSelector((state) => state.entities.categories || [])
  if (!categories.length) return null
  const visible = categories.slice(0, 6)
  const overflow = categories.length - visible.length

  const dotColors = ['bg-[#facc15]', '#f87171', '#38bdf8', '#a855f7', '#4ade80', '#fb923c']

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between px-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Layers size={12} className="text-slate-400" />
          Categories
        </p>
        <button
          type="button"
          onClick={() => {
            navigate('/app/notes?view=categories')
            onNavigate?.()
          }}
          className="text-[11px] font-semibold text-slate-400 hover:text-slate-700"
        >
          View all
        </button>
      </div>
      <div className="flex flex-col gap-0.5">
        {visible.map((category, idx) => (
          <NavLink
            key={category.id}
            to={`/app/category/${category.id}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex h-8.5 items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'h-2 w-2 rounded-full transition-transform',
                    isActive ? 'scale-125' : '',
                  )}
                  style={{
                    backgroundColor:
                      idx === 0 ? '#facc15' : idx === 1 ? '#f87171' : idx === 2 ? '#38bdf8' : idx === 3 ? '#a855f7' : '#4ade80',
                  }}
                />
                <span className="truncate">{category.name}</span>
                {category.notes_count !== undefined && (
                  <span className="ml-auto text-[11px] text-slate-400 font-mono">
                    {category.notes_count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      {overflow > 0 && (
        <button
          type="button"
          onClick={() => {
            navigate('/app/notes')
            onNavigate?.()
          }}
          className="ml-3 mt-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-800"
        >
          +{overflow} more
        </button>
      )}
    </div>
  )
}

function UpgradeBanner() {
  const navigate = useNavigate()
  return (
    <div className="mt-auto rounded-3xl bg-[#f8fafc] border border-slate-200/80 p-4 text-center">
      {/* Decorative avatar / illustration icon */}
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Sparkles size={20} />
      </div>
      <p className="text-[12px] leading-snug font-medium text-slate-600">
        Want to access unlimited notes taking experience &amp; features?
      </p>
      <button
        type="button"
        onClick={() => navigate('/app/settings')}
        className="mt-3 w-full rounded-xl bg-[#1e293b] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0f172a] transition-colors"
      >
        Pro Workspace
      </button>
    </div>
  )
}

function UserMenu({ onNavigate }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <Popover
      width="w-52"
      align="start"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2.5 transition-all',
            open
              ? 'border-slate-300 bg-white shadow-sm'
              : 'border-slate-200/70 bg-white hover:border-slate-300',
          )}
        >
          <Avatar name={user?.username || '?'} size="sm" />
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[13px] font-bold text-slate-900 font-display">
              {user?.username || 'Account'}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">Free Plan</span>
          </span>
          <ChevronsUpDown size={14} className="text-slate-400 shrink-0" />
        </button>
      )}
    >
      {({ close }) => (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-1">
          <MenuItem
            icon={<Settings size={15} />}
            label="Settings"
            onClick={() => {
              navigate('/app/settings')
              close()
              onNavigate?.()
            }}
          />
          <MenuDivider />
          <MenuItem icon={<LogOut size={15} />} label="Log out" danger onClick={handleLogout} />
        </div>
      )}
    </Popover>
  )
}

export function Sidebar({ onNavigate }) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
      {/* Top Logo */}
      <div className="flex h-12 items-center px-1 mb-3">
        <NavLink to="/app" onClick={onNavigate} className="inline-flex">
          <Logo size="md" />
        </NavLink>
      </div>

      {/* "Add New" with 3 color dots picker (Matching Image 1) */}
      <div className="mb-5 rounded-2xl border border-slate-200/80 bg-[#f8fafc] p-3">
        <button
          type="button"
          onClick={() => {
            navigate('/app/notes/new')
            onNavigate?.()
          }}
          className="flex w-full items-center justify-between gap-2 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Plus size={15} className="text-slate-700" />
            Add new
          </span>
          {/* 3 Color dots as seen in Image 1 */}
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#facc15] shadow-xs" title="Yellow" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8] shadow-xs" title="Blue" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171] shadow-xs" title="Coral" />
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}

        <CategorySection onNavigate={onNavigate} />

        <div className="pt-4">
          <UpgradeBanner />
        </div>
      </nav>

      {/* User Footer */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <UserMenu onNavigate={onNavigate} />
      </div>
    </div>
  )
}