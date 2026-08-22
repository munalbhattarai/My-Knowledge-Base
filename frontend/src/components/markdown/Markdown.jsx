import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from '@/components/code/CodeBlock'

function isExternal(url) {
  return /^(https?:)?\/\//.test(url)
}

export function Markdown({ content, className }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children }) {
            if (isExternal(href)) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              )
            }
            return <a href={href}>{children}</a>
          },
          code({ className, children, ...props }) {
            const languageMatch = /language-(\w+)/.exec(className || '')
            const language = languageMatch ? languageMatch[1] : null
            const code = String(children).replace(/\n$/, '')
            if (language) {
              return <CodeBlock code={code} language={language} />
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          pre() {
            // `pre` is handled inside CodeBlock (code component returns the full block)
            return null
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}