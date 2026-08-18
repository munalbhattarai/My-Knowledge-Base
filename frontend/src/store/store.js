import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import entitiesReducer from './slices/entitiesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    entities: entitiesReducer,
  },
})

// Wire the axios layer to this store's logout without a circular import.
import { setAuthFailureHandler } from '@/api/client'
import { logout } from './slices/authSlice'

setAuthFailureHandler(() => {
  store.dispatch(logout())
})