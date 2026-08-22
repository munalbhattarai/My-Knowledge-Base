import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Sidebar } from './Sidebar'
import { Logo } from '@/components/common/Logo'
import { setSidebarOpen, setCommandPaletteOpen } from '@/store/slices/uiSlice'
import { Kbd } from '@/components/common/Kbd'
import { CommandPalette } from '@/components/command/CommandPalette'
import { useCommandPaletteShortcut } from '@/hooks/useKeyboardShortcuts'

function MobileTopbar() {
  const dispatch = useDispatch()
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-2 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl px-4 lg:hidden shadow-sm">
      <button
        type="button"
        onClick={() => dispatch(setSidebarOpen(true))}
        className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>
      <Logo size="sm" />
      <button
        type="button"
        onClick={() => dispatch(setCommandPaletteOpen(true))}
        className="ml-auto inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200/90 bg-white/70 backdrop-blur-md px-3 text-[13px] text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-800"
      >
        <Search size={14} className="text-cyan-600" />
        <span>Search</span>
        <Kbd>⌘K</Kbd>
      </button>
    </header>
  )
}

function MobileDrawer() {
  const open = useSelector((state) => state.ui.sidebarOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    dispatch(setSidebarOpen(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const close = () => dispatch(setSidebarOpen(false))

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.32 }}
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw]"
          >
            <div className="h-full">
              <Sidebar onNavigate={() => navigate} />
            </div>
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
    <div className="relative min-h-screen bg-slate-50/90 text-slate-800 antialiased overflow-x-hidden">
      {/* Soft Luminous Ambient Radial Orbs in Background */}
      <div className="pointer-events-none fixed top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-purple-400/10 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-teal-400/10 blur-[110px]" />

      <MobileTopbar />
      <MobileDrawer />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block p-3">
        <Sidebar />
      </aside>

      <main className="pt-16 lg:pl-64 lg:pt-0">
        <div className="mx-auto max-w-[1080px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <CommandPalette />
    </div>
  )
}