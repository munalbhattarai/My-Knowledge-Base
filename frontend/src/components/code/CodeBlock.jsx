import { useState } from 'react'
import { Highlight } from 'prism-react-renderer'
import { Check, Copy } from 'lucide-react'
import { lumenTheme } from './lumenTheme'
import { codeLanguage, languageLabels } from './languages'
import { cn } from '@/utils/cn'

export function CodeBlock({ code, language, title, className, showLineNumbers = true }) {
  const prismLanguage = codeLanguage(language)
  const [copied, setCopied] = useState(false)
  const displayLanguage = languageLabels[language] || languageLabels[prismLanguage] || (language ? language.toUpperCase() : 'Text')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      className={cn(
        'group/code overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117] shadow-lg shadow-slate-900/20',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/90 bg-[#161b22] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          {title && <span className="truncate text-xs font-bold text-slate-200">{title}</span>}
          <span className="mono rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            {displayLanguage}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors duration-150',
            copied ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-800',
          )}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <Highlight theme={lumenTheme} code={code} language={prismLanguage}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="code-scroll overflow-x-auto p-4 text-[13px] leading-relaxed">
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line })
              return (
                <div key={i} {...lineProps} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell select-none pr-4 text-right text-[11px] leading-relaxed text-slate-600">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell whitespace-pre pr-4">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              )
            })}
          </pre>
        )}
      </Highlight>
    </div>
  )
}