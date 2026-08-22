// ---------------------------------------------------------------------------
// Central HTTP client.
//
// One axios instance, one base URL. Tokens are attached automatically and the
// response interceptor performs the single-flight access-token refresh dance.
//
// USE_MOCK toggles the whole frontend between the in-browser mock API and the
// real Django backend. Runtime config (USE_MOCK / API_BASE_URL) is read from
// environment variables in src/config.js (see .env / .env.example).
// ---------------------------------------------------------------------------

import axios from 'axios'
import { mockApi } from '@/mocks/handlers'
import { USE_MOCK, API_BASE_URL } from '@/config'

export { USE_MOCK }
export const BASE_URL = API_BASE_URL

const ACCESS_KEY = 'lumen.access'
const REFRESH_KEY = 'lumen.refresh'

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setTokens: ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
  hasSession: () => Boolean(localStorage.getItem(ACCESS_KEY)),
}

// Wired up once by the store to avoid a circular import (client <-> store).
let onAuthFailure = () => {}
export const setAuthFailureHandler = (fn) => {
  onAuthFailure = fn
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing = null
let refreshExpiry = 0

const REFRESH_TIMEOUT = 30000

const refreshTokens = async () => {
  const refresh = tokenStore.getRefresh()
  if (!refresh) throw new Error('No refresh token available')
  const { data } = await axios.post(`${API_BASE_URL}accounts/refresh/`, { refresh })
  tokenStore.setTokens({ access: data.access, refresh: data.refresh })
  return data.access
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const isLoginOrRefresh =
      response?.status === 401 &&
      (config?.url?.includes('accounts/refresh') || config?.url?.includes('accounts/login'))

    if (response?.status === 401 && config && !config._retry && !isLoginOrRefresh) {
      config._retry = true
      const now = Date.now()
      if (!refreshing || now > refreshExpiry) {
        refreshing = refreshTokens()
        refreshExpiry = now + REFRESH_TIMEOUT
      }
      try {
        const access = await refreshing
        config.headers.Authorization = `Bearer ${access}`
        return api(config)
      } catch (err) {
        refreshing = null
        refreshExpiry = 0
        onAuthFailure()
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  },
)

export const httpError = (error) => {
  const status = error?.response?.status ?? error?.status
  const data = error?.response?.data ?? error?.data
  if (status === 401) return { code: 'UNAUTHORIZED', message: 'Invalid username or password.' }
  if (status === 403) return { code: 'FORBIDDEN', message: 'You do not have permission to do that.' }
  if (status === 404) return { code: 'NOT_FOUND', message: 'That resource could not be found.' }
  if (status === 400) {
    if (data && typeof data === 'object') {
      const first = Object.values(data).flat().find(Boolean)
      return { code: 'VALIDATION', message: first || 'Please check the form and try again.' }
    }
    return { code: 'VALIDATION', message: 'Please check the form and try again.' }
  }
  if (status === 500) {
    const detail = data?.detail || data?.error || (typeof data === 'string' ? data : null)
    return { code: 'SERVER', message: detail || 'The server encountered an error. Please try again.' }
  }
  return { code: 'NETWORK', message: 'Something went wrong. Check the backend is running.' }
}

export { mockApi }