import { useState } from 'react'

export default function Accordion({ items, allowMultiple = false, className = '' }) {
  const [openIndexes, setOpenIndexes] = useState([])

  const toggle = idx => {
    setOpenIndexes(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx)
      return allowMultiple ? [...prev, idx] : [idx]
    })
  }

  return (
    <div className={`divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx)
        return (
          <div key={idx}>
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                {item.title}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
