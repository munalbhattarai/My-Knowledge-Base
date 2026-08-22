import { api, mockApi, USE_MOCK } from './client'

// List params mirror the documented query API:
//   search, category, tags, status, is_favorite, is_archived, page
export const notesApi = {
  list(params = {}) {
    if (USE_MOCK) return mockApi.listNotes(params)
    return api.get('/notes/', { params }).then((r) => r.data)
  },

  get(id) {
    if (USE_MOCK) return mockApi.getNote(id)
    return api.get(`/notes/${id}/`).then((r) => r.data)
  },

  create(payload) {
    if (USE_MOCK) return mockApi.createNote(payload)
    return api.post('/notes/', payload).then((r) => r.data)
  },

  update(id, payload) {
    if (USE_MOCK) return mockApi.updateNote(id, payload)
    return api.put(`/notes/${id}/`, payload).then((r) => r.data)
  },

  patch(id, payload) {
    if (USE_MOCK) return mockApi.partialUpdateNote(id, payload)
    return api.patch(`/notes/${id}/`, payload).then((r) => r.data)
  },

  remove(id) {
    if (USE_MOCK) return mockApi.deleteNote(id)
    return api.delete(`/notes/${id}/`)
  },
}