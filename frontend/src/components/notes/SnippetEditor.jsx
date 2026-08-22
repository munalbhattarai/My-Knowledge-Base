import { Plus, Trash2 } from 'lucide-react'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'
import { languageLabels } from '@/components/code/languages'

const LANGUAGES = ['PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'HTML', 'CSS', 'SQL', 'BASH', 'JSON', 'OTHER']

function SnippetRow({ snippet, onChange, onRemove }) {
  const set = (key) => (e) => onChange({ ...snippet, [key]: e.target.value })
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-end gap-2.5">
        <Input
          name={`snippet-title-${snippet.key}`}
          label="Title"
          placeholder="Connection pooling setup"
          className="flex-1"
          value={snippet.title}
          onChange={set('title')}
        />
        <Select
          name={`snippet-lang-${snippet.key}`}
          label="Language"
          className="w-36"
          value={snippet.language}
          onChange={set('language')}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {languageLabels[lang] || lang}
            </option>
          ))}
        </Select>
        <button
          type="button"
          onClick={onRemove}
          className="mb-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          aria-label="Remove snippet"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="mt-3">
        <textarea
          name={`snippet-code-${snippet.key}`}
          placeholder="Paste your code here…"
          rows={5}
          value={snippet.code}
          onChange={set('code')}
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-slate-800 bg-[#0d1117] p-3.5 font-mono text-[13px] leading-relaxed text-slate-100 placeholder:text-slate-500 shadow-inner transition-colors hover:border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>
    </div>
  )
}

export function SnippetEditor({ snippets = [], onChange }) {
  const add = () =>
    onChange([
      ...snippets,
      { key: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title: '', language: 'PYTHON', code: '' },
    ])
  const update = (key, patch) => onChange(snippets.map((s) => (s.key === key ? { ...s, ...patch } : s)))
  const remove = (key) => onChange(snippets.filter((s) => s.key !== key))

  return (
    <div className="flex flex-col gap-3">
      {snippets.map((snippet) => (
        <SnippetRow key={snippet.key} snippet={snippet} onChange={(p) => update(snippet.key, p)} onRemove={() => remove(snippet.key)} />
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={add} className="self-start">
        <Plus size={14} />
        Add code snippet
      </Button>
    </div>
  )
}