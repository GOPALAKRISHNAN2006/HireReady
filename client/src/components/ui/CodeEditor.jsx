import { useState, useRef, useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'

const LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
}

export default function CodeEditor({
  value = '',
  onChange,
  language = 'javascript',
  placeholder = '// Write your code here...',
  readOnly = false,
  lineNumbers = true,
  className = '',
  minHeight = '200px',
}) {
  const textareaRef = useRef(null)
  const highlightRef = useRef(null)
  const [code, setCode] = useState(value)

  useEffect(() => {
    setCode(value)
  }, [value])

  useEffect(() => {
    if (highlightRef.current) {
      Prism.highlightElement(highlightRef.current)
    }
  }, [code, language])

  const handleChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)
    onChange?.(newCode)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      onChange?.(newCode)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      })
    }
  }

  const handleScroll = (e) => {
    if (highlightRef.current?.parentElement) {
      highlightRef.current.parentElement.scrollTop = e.target.scrollTop
      highlightRef.current.parentElement.scrollLeft = e.target.scrollLeft
    }
  }

  const lines = code.split('\n')
  const langClass = `language-${LANGUAGE_MAP[language] || 'javascript'}`

  return (
    <div className={`relative rounded-lg border border-gray-700 bg-gray-900 overflow-hidden ${className}`}>
      {/* Language badge */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 uppercase font-mono">{language}</span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
        </div>
      </div>

      <div className="flex" style={{ minHeight }}>
        {/* Line numbers */}
        {lineNumbers && (
          <div className="flex-shrink-0 py-3 px-2 bg-gray-800/50 text-gray-500 text-right text-xs font-mono select-none border-r border-gray-700"
               style={{ minWidth: '3rem' }}>
            {lines.map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
        )}

        {/* Editor area */}
        <div className="relative flex-1 overflow-auto">
          {/* Syntax highlighted layer */}
          <pre className="absolute inset-0 p-3 m-0 pointer-events-none overflow-hidden"
               aria-hidden="true">
            <code ref={highlightRef} className={langClass}>
              {code || ' '}
            </code>
          </pre>

          {/* Editable textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            readOnly={readOnly}
            placeholder={placeholder}
            spellCheck={false}
            className="relative w-full h-full p-3 m-0 bg-transparent text-transparent caret-white font-mono text-sm leading-6 resize-none outline-none"
            style={{ minHeight, WebkitTextFillColor: 'transparent' }}
          />
        </div>
      </div>
    </div>
  )
}
