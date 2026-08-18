import { api, mockApi, USE_MOCK } from './client'

export const authApi = {
  async login(credentials) {
    if (USE_MOCK) return mockApi.login(credentials)
    const { data } = await api.post('/accounts/login/', credentials)
    return data
  },

  async register(payload) {
    if (USE_MOCK) return mockApi.register(payload)
    const { data } = await api.post('/accounts/register/', payload)
    return data
  },

  async refresh(refreshToken) {
    if (USE_MOCK) return mockApi.refresh()
    const { data } = await api.post('/accounts/refresh/', { refresh: refreshToken })
    return data
  },

  async logout(refreshToken) {
    if (USE_MOCK) return mockApi.logout()
    // Blacklist the refresh token server-side. No access token required.
    return api.post('/accounts/logout/', { refresh: refreshToken }, { skipAuth: true })
  },

  // NOTE: the backend does not yet expose GET /api/accounts/profile/.
  // The settings page falls back to the locally known user until it exists.
  async profile() {
    if (USE_MOCK) return mockApi.profile()
    const { data } = await api.get('/accounts/profile/')
    return data
  },
}