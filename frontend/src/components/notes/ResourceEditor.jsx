import { Plus, Trash2 } from 'lucide-react'
import { RESOURCE_TYPES } from '@/components/resources/resourceTypes'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'

function ResourceRow({ resource, onChange, onRemove }) {
  const set = (key) => (e) => onChange({ ...resource, [key]: e.target.value })
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            name={`resource-title-${resource.key}`}
            label="Title"
            placeholder="How to think in relational algebra"
            value={resource.title}
            onChange={set('title')}
          />
          <Input
            name={`resource-url-${resource.key}`}
            label="URL"
            placeholder="https://…"
            value={resource.url}
            onChange={set('url')}
          />
        </div>
        <div className="flex items-end gap-2">
          <Select
            name={`resource-type-${resource.key}`}
            label="Type"
            className="w-full sm:w-40"
            value={resource.resource_type}
            onChange={set('resource_type')}
          >
            {Object.entries(RESOURCE_TYPES).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={onRemove}
            className="mb-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Remove resource"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <Input
          name={`resource-desc-${resource.key}`}
          label="Description"
          placeholder="What this resource covers, and why it's worth it"
          value={resource.description}
          onChange={set('description')}
        />
      </div>
    </div>
  )
}

export function ResourceEditor({ resources = [], onChange }) {
  const add = () =>
    onChange([
      ...resources,
      { key: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: '', url: '', resource_type: 'ARTICLE', description: '' },
    ])
  const update = (key, patch) => onChange(resources.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  const remove = (key) => onChange(resources.filter((r) => r.key !== key))

  return (
    <div className="flex flex-col gap-3">
      {resources.map((resource) => (
        <ResourceRow key={resource.key} resource={resource} onChange={(p) => update(resource.key, p)} onRemove={() => remove(resource.key)} />
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={add} className="self-start">
        <Plus size={14} />
        Add resource
      </Button>
    </div>
  )
}