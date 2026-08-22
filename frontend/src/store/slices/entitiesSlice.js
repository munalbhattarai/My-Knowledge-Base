import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { entitiesApi } from '@/api/entitiesApi'
import { logout } from './authSlice'

export const loadEntities = createAsyncThunk('entities/load', async () => {
  const { categories, tags } = await entitiesApi.fetchAll()
  return { categories, tags }
})

export const createCategory = createAsyncThunk('entities/createCategory', async (name) => {
  return entitiesApi.createCategory(name)
})

export const createTag = createAsyncThunk('entities/createTag', async (name) => {
  return entitiesApi.createTag(name)
})

const initialState = {
  categories: [],
  tags: [],
  loaded: false,
  loading: false,
  failed: false,
}

// The backend treats category/tag names as globally unique and returns the
// existing entity for a duplicate, so merge by id OR case-insensitive name to
// avoid stale entries and keep the pickers de-duplicated.
const mergeEntity = (list, entity) => {
  const id = Number(entity.id)
  const name = String(entity?.name || '').toLowerCase()
  if (!id && !name) return list
  const exists = list.some((e) => Number(e.id) === id || String(e?.name || '').toLowerCase() === name)
  return exists ? list : [...list, entity]
}

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEntities.pending, (state) => {
        state.loading = true
        state.failed = false
      })
      .addCase(loadEntities.fulfilled, (state, action) => {
        state.categories = action.payload.categories
        state.tags = action.payload.tags
        state.loaded = true
        state.loading = false
        state.failed = false
      })
      .addCase(loadEntities.rejected, (state) => {
        state.loading = false
        state.failed = true
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories = mergeEntity(state.categories, action.payload)
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.tags = mergeEntity(state.tags, action.payload)
      })
      .addCase(logout.fulfilled, () => initialState)
  },
})

export default entitiesSlice.reducer