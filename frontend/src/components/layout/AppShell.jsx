import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, SlidersHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Sidebar } from './Sidebar'
import { Logo } from '@/components/common/Logo'
import { Avatar } from '@/components/common/Avatar'
import { setSidebarOpen, setCommandPaletteOpen } from '@/store/slices/uiSlice'
import { Kbd } from '@/components/common/Kbd'
import { CommandPalette } from '@/components/command/CommandPalette'
import { useCommandPaletteShortcut } from '@/hooks/useKeyboardShortcuts'

function TopHeader() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector((state) => state.auth.user)

  // Dynamic header title matching Image 1
  let title = 'MY NOTES'
  if (location.pathname === '/app') title = 'DASHBOARD'
  else if (location.pathname.startsWith('/app/notes/new')) title = 'NEW NOTE'
  else if (location.pathname.includes('/edit')) title = 'EDIT NOTE'
  else if (location.pathname.startsWith('/app/notes/')) title = 'NOTE DETAILS'
  else if (location.pathname === '/app/favorites') title = 'FAVORITES'
  else if (location.pathname === '/app/review') title = 'REVIEW QUEUE'
  else if (location.pathname === '/app/archived') title = 'ARCHIVED'
  else if (location.pathname === '/app/settings') title = 'SETTINGS'

  const displayName = user?.first_name || user?.username || 'Sayef mahmud'

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 bg-[#f4f6fb]/90 backdrop-blur-md px-4 sm:px-8 lg:px-10">
      {/* Left: Mobile Menu & Big Bold Page Title (Image 1) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(setSidebarOpen(true))}
          className="rounded-2xl p-2 text-slate-600 hover:bg-white hover:text-slate-900 lg:hidden shadow-xs border border-slate-200/80"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display uppercase">
          {title}
        </h1>
      </div>

      {/* Center: Floating Search Capsule Pill (Image 1) */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-auto hidden md:block">
        <button
          type="button"
          onClick={() => dispatch(setCommandPaletteOpen(true))}
          className="flex h-10 w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 text-xs font-medium text-slate-400 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <span className="flex items-center gap-2.5">
            <Search size={15} className="text-slate-400" />
            <span>Search notes, categories, tags…</span>
          </span>
          <Kbd>⌘K</Kbd>
        </button>
      </div>

      {/* Right: User Profile Capsule & Actions (Image 1) */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          onClick={() => dispatch(setCommandPaletteOpen(true))}
          className="flex h-10 w-10 md:hidden items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 shadow-xs"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        <div
          onClick={() => navigate('/app/settings')}
          className="flex items-center gap-3 cursor-pointer rounded-2xl border border-slate-200/80 bg-white px-3 py-1.5 shadow-xs hover:border-slate-300 transition-colors"
        >
          <span className="hidden sm:inline text-xs font-bold text-slate-800 font-display">
            {displayName}
          </span>
          <Avatar name={displayName} size="sm" />
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 transition-colors"
            title="Settings"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileDrawer() {
  const open = useSelector((state) => state.ui.sidebarOpen)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(setSidebarOpen(false))
  }, [location.pathname, dispatch])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.32 }}
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] p-3"
          >
            <Sidebar onNavigate={() => dispatch(setSidebarOpen(false))} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function AppShell() {
  const location = useLocation()
  useCommandPaletteShortcut()

  return (
    <div className="relative min-h-screen bg-[#f4f6fb] text-slate-800 antialiased">
      <MobileDrawer />

      {/* Floating Desktop Sidebar (Image 1) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block p-4">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopHeader />

        <main className="flex-1 px-4 py-4 sm:px-8 lg:px-10 max-w-7xl w-full mx-auto pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette />
    </div>
  )
}