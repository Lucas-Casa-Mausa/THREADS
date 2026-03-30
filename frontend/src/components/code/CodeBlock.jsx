import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

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
        setHtml(result)
      } catch (error) {
        console.error('Shiki highlighting failed:', error)
        setHtml(`<pre><code>${code}</code></pre>`)
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
