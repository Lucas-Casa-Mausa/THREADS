import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { codeToHtml } from 'shiki'

// Shiki output is structurally limited (pre/code/span + class/style), but we
// run it through DOMPurify so any future highlighter regression cannot
// introduce <script>, event handlers, or javascript: URLs into the DOM.
const SHIKI_PURIFY_CONFIG = {
  ALLOWED_TAGS: ['pre', 'code', 'span', 'br'],
  ALLOWED_ATTR: ['class', 'style'],
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export default function CodeBlock({ code, language = 'python', className = '' }) {
  const [html, setHtml] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const highlight = async () => {
      try {
        const result = await codeToHtml(code, {
          lang: language,
          theme: 'github-dark',
        })
        setHtml(DOMPurify.sanitize(result, SHIKI_PURIFY_CONFIG))
      } catch (error) {
        console.error('Shiki highlighting failed:', error)
        setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlight()
  }, [code, language])

  if (isLoading) {
    return (
      <div className={`bg-dark-surface rounded-lg p-4 animate-pulse ${className}`}>
        <div className="h-48 bg-dark-border/50 rounded" />
      </div>
    )
  }

  return (
    <div 
      className={`bg-[#0d1117] rounded-lg overflow-hidden border border-dark-border ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
