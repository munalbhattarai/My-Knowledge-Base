import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCommandPaletteOpen } from '@/store/slices/uiSlice'

export function useKeyboardShortcuts(handlers = {}) {
  const refs = useRef(handlers)
  refs.current = handlers

  useEffect(() => {
    const onKeyDown = (event) => {
      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        refs.current['toggle-command']?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}

// Registers the global ⌘K / Ctrl+K command palette toggle once.
export function useCommandPaletteShortcut() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.ui.commandPaletteOpen)
  useKeyboardShortcuts({
    'toggle-command': () => dispatch(setCommandPaletteOpen(!open)),
  })
  return open
}