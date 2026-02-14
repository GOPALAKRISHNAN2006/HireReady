export default function Tooltip({ children, text, position = 'top' }) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute ${positions[position]} hidden group-hover:block z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-md shadow-lg whitespace-nowrap pointer-events-none`}>
        {text}
        <div className={`absolute w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45 ${
          position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
          position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
          position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
          'right-full top-1/2 -translate-y-1/2 -mr-1'
        }`} />
      </div>
    </div>
  )
}
