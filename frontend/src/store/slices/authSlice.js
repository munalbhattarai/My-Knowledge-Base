import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '@/api/authApi'
import { tokenStore } from '@/api/client'

const normalizeError = (error) => {
  if (error?.response?.status === 401 || error?.status === 401) {
    return 'Incorrect username or password.'
  }
  if (error instanceof Error) return error.message
  if (typeof error === 'string') {
    if (error === 'No active account found with the given credentials') {
      return 'Incorrect username or password.'
    }
    return error
  }
  const data = error?.response?.data || error?.data
  if (data?.detail) {
    if (data.detail === 'No active account found with the given credentials') {
      return 'Incorrect username or password.'
    }
    return data.detail
  }
  if (data?.non_field_errors?.[0]) return data.non_field_errors[0]
  if (data?.username?.[0]) return data.username[0]
  if (data?.password?.[0]) return data.password[0]
  if (data?.email?.[0]) return data.email[0]
  return error?.message || 'An unexpected error occurred.'
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const data = await authApi.login(credentials)
      tokenStore.setTokens(data)
      dispatch(loadProfile()).catch(() => {})
      return { username: credentials.username }
    } catch (error) {
      return rejectWithValue(normalizeError(error))
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload)
      return { username: data.username || payload.username, email: data.email || payload.email }
    } catch (error) {
      return rejectWithValue(normalizeError(error))
    }
  },
)

export const loadProfile = createAsyncThunk(
  'auth/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await authApi.profile()
      return profile
    } catch (error) {
      return rejectWithValue(normalizeError(error))
    }
  },
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const profile = await authApi.updateProfile(payload)
      return profile
    } catch (error) {
      return rejectWithValue(normalizeError(error))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  const refresh = tokenStore.getRefresh()
  // Always clear local tokens, even if the server call fails (e.g. refresh
  // token already expired). Best-effort server-side revocation.
  try {
    if (refresh) await authApi.logout(refresh)
  } catch {
    // ignore — local logout must still succeed
  } finally {
    tokenStore.clear()
  }
})

export const bootstrap = createAsyncThunk('auth/bootstrap', async () => {
  return { authed: tokenStore.hasSession() }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    bootstrapped: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload || 'Unable to sign in.'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Unable to create your account.'
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload }
      })
      .addCase(bootstrap.fulfilled, (state, action) => {
        state.bootstrapped = true
        if (action.payload.authed) {
          state.isAuthenticated = true
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export default authSlice.reducer