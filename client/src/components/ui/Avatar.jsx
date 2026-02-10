export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const colors = [
    'bg-emerald-500', 'bg-blue-500', 'bg-purple-500',
    'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'
  ]
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800 ${className}`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-gray-800 ${className}`}>
      {initials}
    </div>
  )
}
