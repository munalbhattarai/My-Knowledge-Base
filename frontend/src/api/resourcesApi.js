import { api, mockApi, USE_MOCK } from './client'

// Resources and code snippets are nested (read-only) inside the note detail.
// The backend manages them as their own endpoints, so create/update/delete
// operations target /api/resources/ and /api/code-snippets/ directly.
export const resourcesApi = {
  createResource(payload) {
    if (USE_MOCK) return mockApi.createResource(payload)
    return api.post('/resources/', payload).then((r) => r.data)
  },
  updateResource(id, payload) {
    if (USE_MOCK) return mockApi.updateResource(id, payload)
    return api.patch(`/resources/${id}/`, payload).then((r) => r.data)
  },
  deleteResource(id) {
    if (USE_MOCK) return mockApi.deleteResource(id)
    return api.delete(`/resources/${id}/`)
  },

  createSnippet(payload) {
    if (USE_MOCK) return mockApi.createSnippet(payload)
    return api.post('/code-snippets/', payload).then((r) => r.data)
  },
  updateSnippet(id, payload) {
    if (USE_MOCK) return mockApi.updateSnippet(id, payload)
    return api.patch(`/code-snippets/${id}/`, payload).then((r) => r.data)
  },
  deleteSnippet(id) {
    if (USE_MOCK) return mockApi.deleteSnippet(id)
    return api.delete(`/code-snippets/${id}/`)
  },
}