import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  NotebookPen,
  Star,
  Clock3,
  Archive,
  User as UserIcon,
  LogOut,
  ChevronsUpDown,
  Layers,
  Hash,
  Plus,
  Settings,
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
          'group relative flex h-10 items-center gap-3.5 rounded-2xl px-3.5 text-[13.5px] font-semibold transition-all duration-200 select-none cursor-pointer',
          isActive
            ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs'
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
  const visible = categories.slice(0, 8)
  const overflow = categories.length - visible.length

  const dotColors = ['#facc15', '#f87171', '#38bdf8', '#a855f7', '#4ade80', '#fb923c']

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between px-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Layers size={12} className="text-slate-400" />
          Categories
        </p>
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
                    isActive ? 'scale-125 ring-2 ring-slate-300' : '',
                  )}
                  style={{
                    backgroundColor: dotColors[idx % dotColors.length],
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

function TagSection({ onNavigate }) {
  const navigate = useNavigate()
  const tags = useSelector((state) => state.entities.tags || [])
  if (!tags.length) return null
  const visible = tags.slice(0, 10)
  const overflow = tags.length - visible.length

  return (
    <div className="mt-5">
      <p className="mb-2 flex items-center gap-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Hash size={12} className="text-slate-400" />
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
                'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all',
                isActive
                  ? 'border-slate-800 bg-slate-900 text-white font-semibold'
                  : 'border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900',
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
          className="ml-3 mt-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-800"
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

  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || 'Account'

  return (
    <Popover
      width="w-56"
      align="start"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2.5 transition-all cursor-pointer',
            open
              ? 'border-slate-300 bg-white shadow-sm'
              : 'border-slate-200/80 bg-white hover:border-slate-300',
          )}
        >
          <Avatar name={displayName} size="sm" />
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[13px] font-bold text-slate-900 font-display">
              {displayName}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium truncate">
              {user?.email || `@${user?.username}`}
            </span>
          </span>
          <ChevronsUpDown size={14} className="text-slate-400 shrink-0" />
        </button>
      )}
    >
      {({ close }) => (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-1">
          <MenuItem
            icon={<UserIcon size={15} />}
            label="View Profile"
            onClick={() => {
              navigate('/app/profile')
              close()
              onNavigate?.()
            }}
          />
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

      {/* "Add New" Button with 3 Pastel Color Dots (Image 1) */}
      <div className="mb-4 rounded-2xl border border-slate-200/80 bg-[#f8fafc] p-3">
        <button
          type="button"
          onClick={() => {
            navigate('/app/notes/new')
            onNavigate?.()
          }}
          className="flex w-full items-center justify-between gap-2 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Plus size={15} className="text-slate-700" />
            Add new note
          </span>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]" title="Yellow" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" title="Blue" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" title="Coral" />
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}

        <CategorySection onNavigate={onNavigate} />
        <TagSection onNavigate={onNavigate} />
      </nav>

      {/* User Footer Profile */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <UserMenu onNavigate={onNavigate} />
      </div>
    </div>
  )
}