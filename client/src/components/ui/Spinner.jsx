import { Loader2 } from 'lucide-react'

const Spinner = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  }

  const variants = {
    default: 'text-indigo-600',
    white: 'text-white',
    gradient: 'text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text',
    neon: 'text-neon-green drop-shadow-lg',
  }

  return (
    <Loader2
      className={`animate-spin ${variants[variant]} ${sizes[size]} ${className}`}
    />
  )
}

// Dots Spinner
const DotsSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${sizes[size]} rounded-full bg-indigo-500
            animate-bounce
          `}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

// Pulse Spinner
const PulseSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75" />
      <div className="absolute inset-2 rounded-full bg-indigo-600" />
    </div>
  )
}

// Ring Spinner
const RingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }

  return (
    <div className={`
      ${sizes[size]} rounded-full
      border-indigo-200 border-t-primary-600
      animate-spin
      ${className}
    `} />
  )
}

// Bars Spinner
const BarsSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 gap-0.5',
    md: 'h-8 gap-1',
    lg: 'h-12 gap-1.5',
  }

  const barWidths = {
    sm: 'w-1',
    md: 'w-1.5',
    lg: 'w-2',
  }

  return (
    <div className={`flex items-end ${sizes[size]} ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`
            ${barWidths[size]} bg-indigo-500 rounded-full
            animate-wave origin-bottom
          `}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            height: '100%'
          }}
        />
      ))}
    </div>
  )
}

const LoadingOverlay = ({ message = 'Loading...', variant = 'default' }) => {
  const variants = {
    default: 'bg-white/80 backdrop-blur-sm',
    dark: 'bg-slate-900/80 backdrop-blur-sm',
    glass: 'bg-white/10 backdrop-blur-xl',
  }

  const textColors = {
    default: 'text-slate-600',
    dark: 'text-white',
    glass: 'text-white',
  }

  return (
    <div className={`fixed inset-0 ${variants[variant]} z-50 flex items-center justify-center`}>
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-200 border-t-primary-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse" />
          </div>
        </div>
        <p className={`mt-6 ${textColors[variant]} font-medium animate-pulse`}>{message}</p>
      </div>
    </div>
  )
}

const LoadingCard = ({ message = 'Loading...', variant = 'spinner' }) => {
  const spinners = {
    spinner: <Spinner size="md" />,
    dots: <DotsSpinner size="md" />,
    pulse: <PulseSpinner size="md" />,
    ring: <RingSpinner size="md" />,
    bars: <BarsSpinner size="md" />,
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      {spinners[variant]}
      <p className="mt-4 text-slate-500 animate-pulse">{message}</p>
    </div>
  )
}

// Skeleton Loader
const Skeleton = ({ variant = 'text', width, height, className = '', count = 1 }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded w-3/4',
    avatar: 'w-12 h-12 rounded-full',
    thumbnail: 'w-20 h-20 rounded-lg',
    card: 'h-32 rounded-xl',
    button: 'h-10 w-24 rounded-lg',
  }

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`
        bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200
        animate-shimmer bg-[length:200%_100%]
        ${variants[variant]}
        ${className}
      `}
      style={{ width, height }}
    />
  ))

  return count === 1 ? items[0] : <div className="space-y-2">{items}</div>
}

export { Spinner, DotsSpinner, PulseSpinner, RingSpinner, BarsSpinner, LoadingOverlay, LoadingCard, Skeleton }
export default Spinner
