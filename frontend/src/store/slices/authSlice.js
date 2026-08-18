import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '@/api/authApi'
import { tokenStore } from '@/api/client'

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const data = await authApi.login(credentials)
      tokenStore.setTokens(data)
      dispatch(loadProfile()).catch(() => {})
      return { username: credentials.username }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      // Registration never signs you in. The account is created, then the user
      // is taken to the login page to sign in explicitly.
      const data = await authApi.register(payload)
      return { username: data.username || payload.username, email: data.email || payload.email }
    } catch (error) {
      return rejectWithValue(error)
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
      return rejectWithValue(error)
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