import { api, mockApi, USE_MOCK } from './client'

// DRF returns `{ results, count, ... }` when pagination is enabled and a plain
// array when it isn't. Normalise both to a list so callers never care.
const toList = (data) => (Array.isArray(data) ? data : (data?.results ?? []))

// Categories & tags metadata. Exposed via GET /api/categories/ and
// GET /api/tags/ (and their POST/update/delete counterparts on the backend).
// Categories are global; tags are global; note serializers return raw ids and
// the frontend resolves the names from this registry.
export const entitiesApi = {
  async categories() {
    if (USE_MOCK) return mockApi.categories()
    const { data } = await api.get('/categories/')
    return toList(data)
  },

  async tags() {
    if (USE_MOCK) return mockApi.tags()
    const { data } = await api.get('/tags/')
    return toList(data)
  },

  async createCategory(name) {
    if (USE_MOCK) return mockApi.createCategory(name)
    const { data } = await api.post('/categories/', { name })
    return data
  },

  async createTag(name) {
    if (USE_MOCK) return mockApi.createTag(name)
    const { data } = await api.post('/tags/', { name })
    return data
  },

  async fetchAll() {
    const [categories, tags] = await Promise.all([this.categories(), this.tags()])
    return { categories, tags }
  },
}