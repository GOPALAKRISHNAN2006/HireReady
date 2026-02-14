import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  glow = false,
  className = '',
  ...props
}, ref) => {
  const variants = {
    primary: `bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-500 text-white 
              hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-600 
              focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 
              hover:shadow-xl hover:shadow-indigo-500/50
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent 
              before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700`,
    secondary: `bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-400 
                border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300`,
    success: `bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white 
              hover:from-emerald-700 hover:via-green-600 hover:to-teal-600 
              focus:ring-green-500 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50`,
    danger: `bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white 
             hover:from-red-700 hover:via-rose-600 hover:to-pink-600 
             focus:ring-red-500 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50`,
    warning: `bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white 
              hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 
              focus:ring-amber-400 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50`,
    outline: `border-2 border-indigo-500 text-indigo-600 bg-transparent
              hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-600 hover:text-white hover:border-transparent 
              focus:ring-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30`,
    ghost: `text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 focus:ring-slate-300 backdrop-blur-sm`,
    glass: `bg-white/20 backdrop-blur-xl text-white border border-white/30 
            hover:bg-white/30 focus:ring-white/50 shadow-lg`,
    neon: `bg-transparent border-2 border-indigo-400 text-indigo-400 
           hover:bg-indigo-400/10 hover:shadow-neon focus:ring-indigo-400
           relative overflow-hidden`,
  }

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
    sm: 'px-3.5 py-2 text-sm rounded-xl gap-2',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
    xl: 'px-8 py-4 text-lg rounded-2xl gap-3',
  }

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`
        group relative inline-flex items-center justify-center font-semibold overflow-hidden
        transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        transform hover:scale-[1.02] active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${glow ? 'animate-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-110`} />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]} transition-transform duration-300 group-hover:translate-x-1`} />
          )}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
