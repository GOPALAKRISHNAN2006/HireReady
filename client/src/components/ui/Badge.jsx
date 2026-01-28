const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  glow = false,
  pulse = false,
  dot = false,
  icon = null,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25',
    warning: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
    purple: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25',
    neon: 'bg-black/80 text-neon-green border border-neon-green/50 shadow-lg shadow-neon-green/20',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
    outline: 'bg-transparent border-2 border-current',
    soft: 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
    'soft-success': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'soft-warning': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'soft-danger': 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'soft-info': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  }

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
    xl: 'px-4 py-2 text-lg',
  }

  const glowStyles = glow ? {
    primary: 'animate-pulse shadow-lg shadow-primary-500/50',
    success: 'animate-pulse shadow-lg shadow-green-500/50',
    warning: 'animate-pulse shadow-lg shadow-orange-500/50',
    danger: 'animate-pulse shadow-lg shadow-red-500/50',
    info: 'animate-pulse shadow-lg shadow-blue-500/50',
    purple: 'animate-pulse shadow-lg shadow-purple-500/50',
    neon: 'animate-pulse shadow-lg shadow-neon-green/50',
  }[variant] || '' : ''

  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-white',
    success: 'bg-white',
    warning: 'bg-white',
    danger: 'bg-white',
    info: 'bg-white',
    purple: 'bg-white',
    neon: 'bg-neon-green',
    glass: 'bg-white',
    soft: 'bg-primary-500',
    'soft-success': 'bg-emerald-500',
    'soft-warning': 'bg-amber-500',
    'soft-danger': 'bg-red-500',
    'soft-info': 'bg-blue-500',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        transition-all duration-300 ease-out
        hover:scale-105
        ${variants[variant] || variants.default}
        ${sizes[size]}
        ${glowStyles}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Status Dot */}
      {dot && (
        <span className={`
          w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}
          ${pulse ? 'animate-ping' : ''}
        `} />
      )}
      
      {/* Icon */}
      {icon && (
        <span className="flex-shrink-0 -ml-0.5">
          {icon}
        </span>
      )}
      
      {/* Content */}
      <span>{children}</span>
      
      {/* Remove Button */}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="
            flex-shrink-0 -mr-1 ml-0.5
            w-4 h-4 rounded-full
            flex items-center justify-center
            bg-black/10 hover:bg-black/20
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-white/50
          "
        >
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  )
}

// Badge Group Component
export const BadgeGroup = ({ children, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {children}
  </div>
)

// Animated Count Badge
export const CountBadge = ({ count, max = 99, variant = 'danger', className = '' }) => {
  const displayCount = count > max ? `${max}+` : count
  
  if (count === 0) return null
  
  return (
    <Badge 
      variant={variant} 
      size="xs" 
      className={`min-w-[18px] justify-center ${className}`}
    >
      {displayCount}
    </Badge>
  )
}

export default Badge
