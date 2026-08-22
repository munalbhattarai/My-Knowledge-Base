import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBlocker, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Star, Archive, Hash, Plus, X } from 'lucide-react'
import Button from '@/components/common/Button'
import Select from '@/components/common/Select'
import Input from '@/components/common/Input'
import { Segmented } from '@/components/common/Segmented'
import { Toggle } from '@/components/common/Toggle'
import { Popover, MenuItem, MenuLabel } from '@/components/common/Popover'
import { Modal } from '@/components/common/Modal'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Markdown } from '@/components/markdown/Markdown'
import { ResourceEditor } from '@/components/notes/ResourceEditor'
import { SnippetEditor } from '@/components/notes/SnippetEditor'
import { notesApi } from '@/api/notesApi'
import { resourcesApi } from '@/api/resourcesApi'
import { httpError } from '@/api/client'
import { useEntities } from '@/hooks/useEntities'
import { useToast } from '@/hooks/useToast'
import { createCategory, createTag } from '@/store/slices/entitiesSlice'

const STATUS_OPTIONS = [
  { value: 'LEARNING', label: 'Learning' },
  { value: 'LEARNED', label: 'Learned' },
  { value: 'REVIEW', label: 'Review' },
]

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

// Signature of everything the user can change, for dirty detection.
const signature = (form, resources, snippets) =>
  JSON.stringify([
    form,
    resources.map((r) => ({ title: r.title, url: r.url, resource_type: r.resource_type, description: r.description })),
    snippets.map((s) => ({ title: s.title, language: s.language, code: s.code })),
  ])

function TagPicker({ selected = [], onChange, onCreate }) {
  const { tags } = useEntities()
  const [newTag, setNewTag] = useState('')
  const [creating, setCreating] = useState(false)
  const selectedList = Array.isArray(selected) ? selected : []
  const available = tags.filter((t) => !selectedList.some((item) => {
    const itemId = typeof item === 'object' && item !== null ? item.id : item
    return Number(itemId) === Number(t.id)
  }))

  const handleCreate = async (e) => {
    e.preventDefault()
    const name = newTag.trim()
    if (!name || creating) return
    setCreating(true)
    try {
      const tag = await onCreate(name)
      if (tag?.id && !selectedList.some((item) => {
        const itemId = typeof item === 'object' && item !== null ? item.id : item
        return Number(itemId) === Number(tag.id)
      })) {
        onChange([...selectedList, tag.id])
      }
      setNewTag('')
    } catch {
      // toast handled by parent
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">Tags</span>
      {selectedList.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {selectedList.map((item) => {
            const itemId = typeof item === 'object' && item !== null ? item.id : item
            const tagObj = typeof item === 'object' && item !== null ? item : tags.find((t) => Number(t.id) === Number(itemId))
            const tagName = tagObj?.name || (typeof item === 'string' ? item : '')
            if (!itemId && !tagName) return null
            return (
              <span
                key={itemId || tagName}
                className="inline-flex items-center gap-1 rounded-full border border-purple-200/80 bg-purple-50/80 px-2.5 py-0.5 text-[12px] font-medium text-purple-700 shadow-xs"
              >
                #{tagName}
                <button
                  type="button"
                  onClick={() => onChange(selectedList.filter((s) => {
                    const sId = typeof s === 'object' && s !== null ? s.id : s
                    return Number(sId) !== Number(itemId)
                  }))}
                  className="rounded-full p-0.5 text-purple-400 transition-colors hover:text-purple-700 hover:bg-purple-100"
                  aria-label={`Remove tag ${tagName}`}
                >
                  <X size={11} />
                </button>
              </span>
            )
          })}
        </div>
      )}
      <Popover
        width="w-48"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white/60 text-[13px] font-semibold text-slate-500 transition-colors hover:border-cyan-400 hover:text-cyan-700 hover:bg-white"
          >
            <Plus size={14} className="text-cyan-600" />
            {selected.length ? 'Add tag' : 'Select tags'}
          </button>
        )}
      >
        {({ close }) => (
          <>
            <MenuLabel>Tags</MenuLabel>
            {available.length === 0 && <p className="px-3 py-2 text-[13px] font-medium text-slate-400">No more tags.</p>}
            {available.map((tag) => (
              <MenuItem
                key={tag.id}
                icon={<Hash size={13} />}
                label={tag.name}
                onClick={() => {
                  onChange([...selected, tag.id])
                  close()
                }}
              />
            ))}
            <form onSubmit={handleCreate} className="flex items-center gap-1.5 border-t border-slate-100 p-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag…"
                aria-label="Create a new tag"
                className="h-8 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                type="submit"
                disabled={creating || !newTag.trim()}
                aria-label="Add tag"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-cyan-300 hover:text-cyan-700 disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </form>
          </>
        )}
      </Popover>
    </div>
  )
}

export default function NoteEditorPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const { categories } = useEntities()

  const [loading, setLoading] = useState(isEditing)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mode, setMode] = useState('write')
  const [savedSignature, setSavedSignature] = useState(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)

  const savingRef = useRef(false)
  const lastSaveTimeRef = useRef(0)
  const textareaRef = useRef(null)

  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const nextHeight = Math.max(130, el.scrollHeight)
    el.style.height = `${nextHeight}px`
  }, [])

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    status: 'LEARNING',
    is_favorite: false,
    is_archived: false,
  })

  useEffect(() => {
    if (mode === 'write') {
      adjustTextareaHeight()
    }
  }, [form.content, mode, adjustTextareaHeight])
  const [resources, setResources] = useState([])
  const [snippets, setSnippets] = useState([])
  const [initialResources, setInitialResources] = useState([])
  const [initialSnippets, setInitialSnippets] = useState([])

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const handleCancel = () => navigate(isEditing ? `/app/notes/${id}` : '/app/notes')

  const handleCreateTag = async (name) => {
    try {
      const tag = await dispatch(createTag(name)).unwrap()
      return tag
    } catch (err) {
      toast.error('Could not create tag', err?.message)
      throw err
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    const name = newCategory.trim()
    if (!name || creatingCategory) return
    setCreatingCategory(true)
    try {
      const category = await dispatch(createCategory(name)).unwrap()
      setField('category')(category.id)
      setNewCategory('')
      setCategoryModalOpen(false)
    } catch (err) {
      toast.error('Could not create category', err?.message)
    } finally {
      setCreatingCategory(false)
    }
  }

  useEffect(() => {
    if (!isEditing) {
      setSavedSignature(signature(form, [], []))
      return
    }
    let cancelled = false
    setLoading(true)
    notesApi
      .get(id)
      .then((note) => {
        if (cancelled) return
        const resourcesWithKeys = (note.resources || []).map((r) => ({ ...r, key: `r-${r.id}` }))
        const snippetsWithKeys = (note.code_snippets || []).map((s) => ({ ...s, key: `s-${s.id}` }))
        const loadedForm = {
          title: note.title || '',
          content: note.content || '',
          category: note.category ?? '',
          tags: note.tags || [],
          status: note.status || 'LEARNING',
          is_favorite: Boolean(note.is_favorite),
          is_archived: Boolean(note.is_archived),
        }
        setForm(loadedForm)
        setResources(resourcesWithKeys)
        setSnippets(snippetsWithKeys)
        setInitialResources(resourcesWithKeys)
        setInitialSnippets(snippetsWithKeys)
        setSavedSignature(signature(loadedForm, resourcesWithKeys, snippetsWithKeys))
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const dirty = useMemo(
    () => savedSignature !== null && signature(form, resources, snippets) !== savedSignature,
    [form, resources, snippets, savedSignature],
  )

  const blocker = useBlocker(
    useMemo(
      () => ({ currentLocation, nextLocation }) =>
        dirty && !saving && currentLocation.pathname !== nextLocation.pathname,
      [dirty, saving],
    ),
  )

  useEffect(() => {
    if (!dirty) return undefined
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const syncAttachments = useCallback(
    async (noteId, originals) => {
      for (const resource of resources) {
      const payload = {
        note: noteId,
        title: resource.title,
        url: resource.url,
        resource_type: resource.resource_type,
        description: resource.description,
      }
      const original = originals.resources.find((r) => r.key === resource.key)
      if (original?.id) {
        if (JSON.stringify(payload) !== JSON.stringify({ ...original, note: noteId })) {
          await resourcesApi.updateResource(original.id, payload)
        }
      } else if (resource.title.trim() || resource.url.trim()) {
        await resourcesApi.createResource(payload)
      }
    }
    for (const original of originals.resources) {
      if (original.id && !resources.some((r) => r.key === original.key)) {
        await resourcesApi.deleteResource(original.id)
      }
    }

    for (const snippet of snippets) {
      const payload = {
        note: noteId,
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
      }
      const original = originals.snippets.find((s) => s.key === snippet.key)
      if (original?.id) {
        if (JSON.stringify(payload) !== JSON.stringify({ ...original, note: noteId })) {
          await resourcesApi.updateSnippet(original.id, payload)
        }
      } else if (snippet.title.trim() || snippet.code.trim()) {
        await resourcesApi.createSnippet(payload)
      }
    }
    for (const original of originals.snippets) {
      if (original.id && !snippets.some((s) => s.key === original.key)) {
        await resourcesApi.deleteSnippet(original.id)
      }
    }
    },
    [resources, snippets],
  )

  const handleSave = useCallback(async () => {
    const now = Date.now()
    if (savingRef.current || now - lastSaveTimeRef.current < 2000) return
    if (!form.title.trim()) {
      toast.error('Give your note a title')
      document.getElementById('note-title')?.focus()
      return
    }
    savingRef.current = true
    lastSaveTimeRef.current = now
    setSaving(true)
    const rawCategory = form.category
    const categoryId = rawCategory
      ? (typeof rawCategory === 'object' ? rawCategory.id : rawCategory)
      : null

    const rawTags = Array.isArray(form.tags) ? form.tags : []
    const tagIds = rawTags.map((t) => (typeof t === 'object' && t !== null ? t.id : t)).filter(Boolean)

    const fields = {
      title: form.title.trim(),
      content: form.content,
      category: categoryId,
      tags: tagIds,
      status: form.status,
      is_favorite: form.is_favorite,
      is_archived: form.is_archived,
    }
    try {
      let noteId
      if (isEditing) {
        await notesApi.update(id, fields)
        noteId = id
        await syncAttachments(noteId, { resources: initialResources, snippets: initialSnippets })
        toast.success('Changes saved')
      } else {
        const created = await notesApi.create(fields)
        noteId = created.id
        await syncAttachments(noteId, { resources: [], snippets: [] })
        toast.success('Note created')
      }
      navigate(`/app/notes/${noteId}`)
    } catch (err) {
      savingRef.current = false
      const { message } = httpError(err)
      toast.error('Could not save the note', message)
      setSaving(false)
    }
  }, [
    form.title,
    form.content,
    form.category,
    form.tags,
    form.status,
    form.is_favorite,
    form.is_archived,
    isEditing,
    id,
    syncAttachments,
    toast,
    navigate,
    initialResources,
    initialSnippets,
  ])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl">
        <Skeleton className="h-5 w-24 rounded-lg" />
        <Skeleton className="h-12 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-[40vh] w-full rounded-2xl" />
      </div>
    )
  }

  if (notFound) {
    return (
      <EmptyState
        title="Note not found"
        description="It may have been deleted."
        action={
          <Button variant="outline" onClick={() => navigate('/app/notes')}>
            Back to notes
          </Button>
        }
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="pb-20"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(isEditing ? `/app/notes/${id}` : '/app/notes')}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-200/60 hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          {isEditing ? 'Back to note' : 'Back to notes'}
        </button>
        <div className="flex items-center gap-2.5">
          {!dirty && (
            <>
              <span className="hidden items-center gap-1.5 text-[12px] font-semibold text-emerald-600 sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                All changes saved
              </span>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                <Check size={15} />
                {isEditing ? 'Save changes' : 'Create note'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main Editor Surface */}
        <div className="min-w-0 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            <input
              id="note-title"
              value={form.title}
              onChange={(e) => setField('title')(e.target.value)}
              placeholder="Untitled note"
              autoFocus={!isEditing}
              className="w-full border-none bg-transparent text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none"
            />

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <Segmented
                  id="editor-mode"
                  size="xs"
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'write', label: 'Write' },
                    { value: 'preview', label: 'Preview' },
                  ]}
                />
                <span className="text-[11px] font-medium text-slate-400">Markdown supported</span>
              </div>
              {mode === 'write' ? (
                <textarea
                  ref={textareaRef}
                  value={form.content}
                  onChange={(e) => {
                    setField('content')(e.target.value)
                    adjustTextareaHeight()
                  }}
                  placeholder={'Write in Markdown…\n\n# Heading\n- a point\n- another point\n\n```python\nprint("hello")\n```'}
                  style={{ minHeight: '130px' }}
                  className="w-full resize-none overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-4 text-[14.5px] leading-relaxed text-slate-800 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-150 hover:border-slate-300 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15"
                />
              ) : (
                <div className="min-h-[40vh] rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-6">
                  {form.content.trim() ? (
                    <Markdown content={form.content} className="lumen-prose" />
                  ) : (
                    <p className="text-[14px] font-medium text-slate-400">Nothing to preview yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <section className="rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-2xl shadow-xl shadow-slate-200/40 p-6 sm:p-8">
            <h2 className="mb-4 text-base font-bold tracking-tight text-slate-900">Resources</h2>
            <ResourceEditor resources={resources} onChange={setResources} />
          </section>

          <section className="rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-2xl shadow-xl shadow-slate-200/40 p-6 sm:p-8">
            <h2 className="mb-4 text-base font-bold tracking-tight text-slate-900">Code snippets</h2>
            <SnippetEditor snippets={snippets} onChange={setSnippets} />
          </section>
        </div>

        {/* Sidebar Controls */}
        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-2xl p-6 shadow-xl shadow-slate-200/40 lg:sticky lg:top-8">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="category" className="text-[13px] font-semibold text-slate-700">
                Category
              </label>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(true)}
                className="inline-flex items-center gap-1 rounded text-[12px] font-bold text-cyan-600 transition-colors hover:text-cyan-700"
              >
                <Plus size={13} />
                New
              </button>
            </div>
            <Select
              name="category"
              value={typeof form.category === 'object' && form.category !== null ? form.category.id : (form.category || '')}
              onChange={(e) => setField('category')(e.target.value ? e.target.value : '')}
              placeholder="No category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <TagPicker selected={form.tags} onChange={setField('tags')} onCreate={handleCreateTag} />

          <div>
            <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">Status</span>
            <Segmented
              id="status"
              size="sm"
              value={form.status}
              onChange={setField('status')}
              options={STATUS_OPTIONS}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-4">
            <Toggle
              checked={form.is_favorite}
              onChange={setField('is_favorite')}
              label={
                <span className="flex items-center gap-1.5 font-semibold">
                  <Star size={14} className="text-amber-500" />
                  Favorite
                </span>
              }
              description="Star it for quick access"
            />
            <Toggle
              checked={form.is_archived}
              onChange={setField('is_archived')}
              label={
                <span className="flex items-center gap-1.5 font-semibold">
                  <Archive size={14} className="text-slate-500" />
                  Archived
                </span>
              }
              description="Move out of the active list"
            />
          </div>
        </aside>
      </div>

      <Modal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="New category"
        description="Organise notes under a new category."
        width="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={creatingCategory}
              disabled={!newCategory.trim()}
              onClick={handleCreateCategory}
            >
              Create category
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateCategory}>
          <Input
            name="new-category"
            label="Name"
            placeholder="e.g. Networking"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            autoFocus
          />
        </form>
      </Modal>

      <Modal
        open={blocker.state === 'blocked'}
        onClose={() => blocker.reset?.()}
        title="Discard unsaved changes?"
        description="You have unsaved changes to this note. Leaving now will lose them."
        hideClose
        footer={
          <>
            <Button variant="ghost" onClick={() => blocker.reset?.()}>
              Keep editing
            </Button>
            <Button variant="danger-solid" onClick={() => blocker.proceed?.()}>
              Discard changes
            </Button>
          </>
        }
      />

      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 backdrop-blur-2xl shadow-2xl"
          >
            <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-10">
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-200 animate-pulse" />
                Unsaved changes
              </span>
              <div className="flex items-center gap-2.5">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                  <Check size={15} />
                  {isEditing ? 'Save changes' : 'Create note'}
                  <span className="ml-1 hidden text-[11px] font-mono text-white/80 sm:inline">
                    {isMac ? '⌘S' : 'Ctrl S'}
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}