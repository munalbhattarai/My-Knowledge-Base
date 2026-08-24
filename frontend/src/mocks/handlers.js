// ---------------------------------------------------------------------------
// In-browser mock API handler.
//
// Simulates the Django REST endpoints (URLs, filtering, pagination, shapes) so
// the frontend can be built and previewed without a backend. Latency is
// simulated to exercise loading states. This module is only imported when
// USE_MOCK is enabled (see src/api/client.js).
// ---------------------------------------------------------------------------

import { notes, categories, tags, user } from '@/data/mock'

const PAGE_SIZE = 10
const latency = () => new Promise((resolve) => setTimeout(resolve, 220 + Math.random() * 380))

const clone = (value) => JSON.parse(JSON.stringify(value))

class MockApiError extends Error {
  constructor(status, data) {
    super(data?.detail || data?.non_field_errors?.[0] || 'Request failed')
    this.name = 'MockApiError'
    this.status = status
    this.response = { status, data }
  }
}

let notesStore = clone(notes)
let nextNoteId = 1000
let nextResourceId = 900
let nextSnippetId = 800
let nextEntityId = 500

let categoryStore = clone(categories)
let tagStore = clone(tags)

// In-memory user registry so login actually validates credentials (matching
// the real backend). Seeded with the demo account so the sample notes stay
// reachable: username "mausam" / password "password123".
let userStore = [{ id: 1, username: 'mausam', email: 'mausam@dev.local', password: 'password123' }]
let nextUserId = 2
let currentUser = null

// Notes are scoped to the logged-in user, matching the real backend
// (NoteViewSet.get_queryset filters owner=request.user).
const visibleNotes = () => (currentUser ? notesStore.filter((n) => n.owner === currentUser.id) : [])

const stripDetail = (note) => {
  const { content: _content, resources: _resources, code_snippets: _codeSnippets, ...list } = note
  return clone(list)
}

const matchesFilters = (note, params = {}) => {
  const { search, category, tags, status, is_favorite, is_archived } = params

  if (search && search.trim()) {
    const q = search.trim().toLowerCase()
    const inTitle = note.title.toLowerCase().includes(q)
    const inContent = (note.content || '').toLowerCase().includes(q)
    if (!inTitle && !inContent) return false
  }
  if (category && String(note.category) !== String(category)) return false
  if (tags && String(note.tags?.join(',')) !== String(tags) && !note.tags?.includes(Number(tags))) return false
  if (status && note.status !== status) return false
  if (is_favorite !== undefined && String(note.is_favorite) !== String(is_favorite)) return false
  if (is_archived !== undefined && String(note.is_archived) !== String(is_archived)) return false
  return true
}

const paginate = (items, page) => {
  const count = items.length
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const current = Math.min(Math.max(1, Number(page) || 1), pages)
  const start = (current - 1) * PAGE_SIZE
  const results = items.slice(start, start + PAGE_SIZE)
  const base = '/api/notes/'
  return {
    count,
    next: current < pages ? `${base}?page=${current + 1}` : null,
    previous: current > 1 ? `${base}?page=${current - 1}` : null,
    results,
  }
}

const dashboardStats = () => {
  const all = visibleNotes()
  return {
    total_notes: all.length,
    learning: all.filter((n) => n.status === 'LEARNING' && !n.is_archived).length,
    learned: all.filter((n) => n.status === 'LEARNED' && !n.is_archived).length,
    review: all.filter((n) => n.status === 'REVIEW' && !n.is_archived).length,
    favorites: all.filter((n) => n.is_favorite && !n.is_archived).length,
    archived: all.filter((n) => n.is_archived).length,
    categories: new Set(all.filter((n) => n.category).map((n) => n.category)).size,
  }
}

export const mockApi = {
  async login({ username, password }) {
    await latency()
    if (!username || !password) {
      throw new MockApiError(400, { non_field_errors: ['Provide a username and password.'] })
    }
    const match = userStore.find((u) => u.username === username && u.password === password)
    if (!match) {
      throw new MockApiError(401, { detail: 'No active account found with the given credentials' })
    }
    currentUser = match
    return { refresh: 'mock-refresh-token', access: 'mock-access-token' }
  },

  async register({ username, email, password }) {
    await latency()
    if (!username || !email || !password) {
      throw new MockApiError(400, { detail: 'username, email and password are required.' })
    }
    if (String(password).length < 8) {
      throw new MockApiError(400, { password: ['This password is too short. It must contain at least 8 characters.'] })
    }
    if (userStore.some((u) => u.username.toLowerCase() === String(username).toLowerCase())) {
      throw new MockApiError(400, { username: ['A user with that username already exists.'] })
    }
    const newUser = { id: nextUserId++, username, email, password }
    userStore = [...userStore, newUser]
    return { id: newUser.id, username: newUser.username, email: newUser.email }
  },

  async refresh() {
    await latency()
    return { access: 'mock-access-token-refreshed' }
  },

  async logout() {
    await latency()
    currentUser = null
    return {}
  },

  async profile() {
    await latency()
    if (currentUser) {
      return {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
      }
    }
    return clone(user)
  },

  async updateProfile(payload) {
    await latency()
    if (currentUser) {
      currentUser = { ...currentUser, ...payload }
      return {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
      }
    }
    throw new MockApiError(401, { detail: 'Unauthorized' })
  },

  async listNotes(params = {}) {
    await latency()
    const filtered = visibleNotes()
      .filter((n) => matchesFilters(n, params))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    return paginate(filtered.map(stripDetail), params.page)
  },

  async getNote(id) {
    await latency()
    const note = visibleNotes().find((n) => n.id === Number(id))
    if (!note) throw new MockApiError(404, { detail: 'Not found.' })
    return clone(note)
  },

  async createNote(payload) {
    await latency()
    const now = new Date().toISOString()
    const note = {
      id: nextNoteId++,
      title: payload.title || 'Untitled',
      content: payload.content || '',
      owner: currentUser?.id ?? 1,
      category: payload.category ?? null,
      tags: payload.tags ?? [],
      status: payload.status || 'LEARNING',
      is_archived: payload.is_archived ?? false,
      is_favorite: payload.is_favorite ?? false,
      resources: [],
      code_snippets: [],
      created_at: now,
      updated_at: now,
    }
    notesStore = [note, ...notesStore]
    return clone(note)
  },

  async updateNote(id, payload) {
    await latency()
    const idx = notesStore.findIndex((n) => n.id === Number(id) && n.owner === currentUser?.id)
    if (idx === -1) throw new MockApiError(404, { detail: 'Not found.' })
    notesStore[idx] = {
      ...notesStore[idx],
      ...payload,
      id: Number(id),
      owner: currentUser?.id,
      updated_at: new Date().toISOString(),
    }
    return clone(notesStore[idx])
  },

  async partialUpdateNote(id, payload) {
    return this.updateNote(id, payload)
  },

  async deleteNote(id) {
    await latency()
    const idx = notesStore.findIndex((n) => n.id === Number(id) && n.owner === currentUser?.id)
    if (idx === -1) throw new MockApiError(404, { detail: 'Not found.' })
    notesStore = notesStore.filter((n) => n.id !== Number(id))
    return {}
  },

  async createResource(payload) {
    await latency()
    const resource = { id: nextResourceId++, created_at: new Date().toISOString(), ...payload }
    const note = visibleNotes().find((n) => n.id === Number(payload.note))
    if (note) note.resources = [...(note.resources || []), resource]
    return clone(resource)
  },

  async updateResource(id, payload) {
    await latency()
    for (const note of visibleNotes()) {
      const idx = (note.resources || []).findIndex((r) => r.id === Number(id))
      if (idx !== -1) {
        note.resources[idx] = { ...note.resources[idx], ...payload, id: Number(id) }
        return clone(note.resources[idx])
      }
    }
    throw new MockApiError(404, { detail: 'Not found.' })
  },

  async deleteResource(id) {
    await latency()
    for (const note of visibleNotes()) {
      note.resources = (note.resources || []).filter((r) => r.id !== Number(id))
    }
    return {}
  },

  async createSnippet(payload) {
    await latency()
    const snippet = {
      id: nextSnippetId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...payload,
    }
    const note = visibleNotes().find((n) => n.id === Number(payload.note))
    if (note) note.code_snippets = [...(note.code_snippets || []), snippet]
    return clone(snippet)
  },

  async updateSnippet(id, payload) {
    await latency()
    for (const note of visibleNotes()) {
      const idx = (note.code_snippets || []).findIndex((s) => s.id === Number(id))
      if (idx !== -1) {
        note.code_snippets[idx] = { ...note.code_snippets[idx], ...payload, id: Number(id) }
        return clone(note.code_snippets[idx])
      }
    }
    throw new MockApiError(404, { detail: 'Not found.' })
  },

  async deleteSnippet(id) {
    await latency()
    for (const note of visibleNotes()) {
      note.code_snippets = (note.code_snippets || []).filter((s) => s.id !== Number(id))
    }
    return {}
  },

  async dashboard() {
    await latency()
    return dashboardStats()
  },

  async categories() {
    await latency()
    return clone(currentUser ? categoryStore.filter((c) => !c.owner || c.owner === currentUser.id) : categoryStore)
  },

  async tags() {
    await latency()
    return clone(currentUser ? tagStore.filter((t) => !t.owner || t.owner === currentUser.id) : tagStore)
  },

  async createCategory(name) {
    await latency()
    const trimmed = String(name || '').trim()
    if (!trimmed) throw new MockApiError(400, { name: ['This field is required.'] })
    const existing = categoryStore.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase() && (!currentUser || c.owner === currentUser.id),
    )
    if (existing) return clone(existing)
    const category = { id: nextEntityId++, name: trimmed, owner: currentUser?.id }
    categoryStore = [...categoryStore, category]
    return clone(category)
  },

  async createTag(name) {
    await latency()
    const trimmed = String(name || '').trim()
    if (!trimmed) throw new MockApiError(400, { name: ['This field is required.'] })
    const existing = tagStore.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase() && (!currentUser || t.owner === currentUser.id),
    )
    if (existing) return clone(existing)
    const tag = { id: nextEntityId++, name: trimmed, owner: currentUser?.id }
    tagStore = [...tagStore, tag]
    return clone(tag)
  },
}

export { PAGE_SIZE }