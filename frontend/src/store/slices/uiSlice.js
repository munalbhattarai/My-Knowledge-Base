import { createSlice } from '@reduxjs/toolkit'

let toastId = 0

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    commandPaletteOpen: false,
    toasts: [],
  },
  reducers: {
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setCommandPaletteOpen(state, action) {
      state.commandPaletteOpen = action.payload
    },
    pushToast(state, action) {
      const { type = 'info', title, message } = action.payload
      state.toasts.push({
        id: ++toastId,
        type,
        title,
        message,
      })
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const {
  setSidebarOpen,
  toggleSidebar,
  setCommandPaletteOpen,
  pushToast,
  removeToast,
} = uiSlice.actions

export default uiSlice.reducer