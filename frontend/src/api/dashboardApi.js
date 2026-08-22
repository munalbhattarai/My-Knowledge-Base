import { api, mockApi, USE_MOCK } from './client'

let cachedStats = null
let cacheTimestamp = 0
const CACHE_TTL = 30000

export const dashboardApi = {
  get() {
    const now = Date.now()
    if (cachedStats && now - cacheTimestamp < CACHE_TTL) {
      return Promise.resolve(cachedStats)
    }
    if (USE_MOCK) {
      return mockApi.dashboard().then((stats) => {
        cachedStats = stats
        cacheTimestamp = Date.now()
        return stats
      })
    }
    return api.get('/dashboard/').then((r) => {
      cachedStats = r.data
      cacheTimestamp = Date.now()
      return r.data
    })
  },

  invalidate() {
    cachedStats = null
    cacheTimestamp = 0
  },
}