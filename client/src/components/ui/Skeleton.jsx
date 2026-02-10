export default function Skeleton({ width = '100%', height = '1rem', rounded = 'md', className = '' }) {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${roundedMap[rounded]} ${className}`}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="0.875rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${90 - i * 15}%`} height="0.75rem" />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="1rem" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height="0.875rem" />
          ))}
        </div>
      ))}
    </div>
  )
}
