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
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { Avatar } from '@/components/common/Avatar'
import { Popover, MenuItem, MenuDivider } from '@/components/common/Popover'
import IconButton from '@/components/common/IconButton'
import { Tooltip } from '@/components/common/Tooltip'
import { logout } from '@/store/slices/authSlice'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/notes', label: 'Notes', icon: NotebookPen },
  { to: '/app/favorites', label: 'Favorites', icon: Star },
  { to: '/app/review', label: 'Review', icon: Clock3 },
  { to: '/app/archived', label: 'Archived', icon: Archive },
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
          'group relative flex h-9 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition-all duration-200 select-none',
          isActive
            ? 'bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-transparent text-cyan-700 shadow-sm shadow-cyan-500/5 border border-cyan-500/20'
            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-500 to-teal-500 transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
          <Icon size={16} className={cn('shrink-0 transition-colors', isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600')} />
          {item.label}
        </>
      )}
    </NavLink>
  )
}

function CategorySection({ onNavigate }) {
  const navigate = useNavigate()
  const categories = useSelector((state) => state.entities.categories)
  if (!categories.length) return null
  const visible = categories.slice(0, 8)
  const overflow = categories.length - visible.length
  return (
    <div className="mt-6">
      <p className="mb-2 flex items-center gap-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Layers size={11} className="text-cyan-500" />
        Categories
      </p>
      <div className="flex flex-col gap-1">
        {visible.map((category) => (
          <NavLink
            key={category.id}
            to={`/app/category/${category.id}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex h-8 items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium transition-colors duration-150',
                isActive
                  ? 'bg-cyan-50 text-cyan-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'ml-0.5 h-1.5 w-1.5 rounded-full transition-colors',
                    isActive ? 'bg-cyan-500 ring-2 ring-cyan-200' : 'bg-slate-300',
                  )}
                />
                <span className="truncate">{category.name}</span>
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
          className="ml-3 mt-1.5 text-[12px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
        >
          +{overflow} more
        </button>
      )}
    </div>
  )
}

function TagSection({ onNavigate }) {
  const navigate = useNavigate()
  const tags = useSelector((state) => state.entities.tags)
  if (!tags.length) return null
  const visible = tags.slice(0, 12)
  const overflow = tags.length - visible.length
  return (
    <div className="mt-5">
      <p className="mb-2 flex items-center gap-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Hash size={11} className="text-purple-500" />
        Tags
      </p>
      <div className="flex flex-wrap gap-1 px-3">
        {visible.map((tag) => (
          <NavLink
            key={tag.id}
            to={`/app/tag/${tag.id}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-150 shadow-xs',
                isActive
                  ? 'border-purple-200 bg-purple-50 text-purple-700 font-semibold'
                  : 'border-slate-200/80 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-900',
              )
            }
          >
            #{tag.name}
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
          className="ml-3 mt-2 text-[12px] font-semibold text-purple-600 hover:text-purple-700 transition-colors"
        >
          +{overflow} more
        </button>
      )}
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
    <div className="flex items-center gap-1">
      <Popover
        width="w-52"
        align="start"
        trigger={({ toggle, open }) => (
          <button
            type="button"
            onClick={toggle}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all',
              open ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200/80 bg-white/60 hover:border-slate-300 hover:bg-white',
            )}
          >
            <Avatar name={user?.username || '?'} size="sm" />
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[13px] font-semibold text-slate-800">{user?.username || 'Account'}</span>
              <span className="block text-[11px] text-slate-400">Signed in</span>
            </span>
            <ChevronsUpDown size={14} className="text-slate-400" />
          </button>
        )}
      >
        {({ close }) => (
          <>
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
          </>
        )}
      </Popover>
      <Tooltip label="Log out" side="top">
        <IconButton label="Log out" onClick={handleLogout} className="shrink-0" aria-label="Log out">
          <LogOut size={16} />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="flex h-16 items-center px-4.5 border-b border-slate-100">
        <NavLink to="/app" onClick={onNavigate} className="inline-flex">
          <Logo size="md" />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </div>

        <CategorySection onNavigate={onNavigate} />
        <TagSection onNavigate={onNavigate} />
      </nav>

      <div className="border-t border-slate-100 p-3 bg-slate-50/50">
        <UserMenu onNavigate={onNavigate} />
      </div>
    </div>
  )
}