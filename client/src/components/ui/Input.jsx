import { forwardRef, useState } from 'react'
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react'

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  success,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  floating = false,
  showCount = false,
  maxLength,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState(props.value || props.defaultValue || '')
  const isPassword = type === 'password'

  const variants = {
    default: `
      border-gray-200
      bg-white
      text-gray-900
      placeholder:text-gray-400
      focus:border-primary-500 focus:ring-primary-500/20
    `,
    filled: `
      border-transparent
      bg-gray-100
      text-gray-900
      placeholder:text-gray-500
      focus:bg-gray-50
      focus:border-primary-500 focus:ring-primary-500/20
    `,
    underline: `
      border-0 border-b-2 rounded-none px-0
      border-gray-300
      bg-transparent
      text-gray-900
      placeholder:text-gray-400
      focus:border-primary-500 focus:ring-0
    `,
    glass: `
      border-white/20
      bg-white/10 backdrop-blur-md
      text-white placeholder:text-white/60
      focus:border-white/40 focus:ring-white/20
    `,
    neon: `
      border-neon-green/30
      bg-black/50 text-neon-green
      placeholder:text-neon-green/50
      focus:border-neon-green focus:ring-neon-green/20
      focus:shadow-lg focus:shadow-neon-green/20
    `,
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3.5 text-lg',
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  const inputClasses = `
    w-full rounded-lg
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-4
    ${sizes[size]}
    ${variants[variant]}
    ${error 
      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
      : success 
        ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
        : ''
    }
    ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-11' : ''}
    ${isPassword ? 'pr-11' : ''}
    ${(error || success) ? 'pr-11' : ''}
    ${props.disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900' : ''}
    ${className}
  `

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && !floating && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className={`
            absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none
            transition-colors duration-200
            ${isFocused ? 'text-primary-500' : 'text-gray-400'}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Floating Label */}
        {floating && (
          <label className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isFocused || value 
              ? '-top-2.5 text-xs bg-white dark:bg-gray-800 px-1 text-primary-500' 
              : 'top-1/2 -translate-y-1/2 text-gray-400'
            }
          `}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          maxLength={maxLength}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          onChange={handleChange}
          className={inputClasses}
          {...props}
        />

        {/* Animated Border Gradient */}
        {variant === 'default' && (
          <div className={`
            absolute inset-0 rounded-lg pointer-events-none
            bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500
            opacity-0 group-hover:opacity-10 transition-opacity duration-300
            -z-10 blur-sm
          `} />
        )}
        
        {/* Right Icon */}
        {Icon && iconPosition === 'right' && !isPassword && !error && !success && (
          <div className={`
            absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none
            transition-colors duration-200
            ${isFocused ? 'text-primary-500' : 'text-gray-400'}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Status Icons */}
        {error && !isPassword && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
        
        {success && !error && !isPassword && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <Check className="w-5 h-5 text-green-500" />
          </div>
        )}
        
        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute inset-y-0 right-0 pr-3.5 flex items-center
              text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
              transition-colors duration-200
            "
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {/* Helper Text / Error / Character Count */}
      <div className="flex items-center justify-between">
        {(error || helperText || success) && (
          <p className={`
            text-sm transition-colors duration-200
            ${error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'}
          `}>
            {error || (success && typeof success === 'string' ? success : helperText) || helperText}
          </p>
        )}
        
        {showCount && maxLength && (
          <span className={`
            text-xs ml-auto
            ${value.length >= maxLength ? 'text-red-500' : 'text-gray-400'}
          `}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
})

Input.displayName = 'Input'

// Textarea Component
export const Textarea = forwardRef(({
  label,
  error,
  success,
  helperText,
  variant = 'default',
  showCount = false,
  maxLength,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [value, setValue] = useState(props.value || props.defaultValue || '')

  const variants = {
    default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-primary-500/20',
    filled: 'border-transparent bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500',
    glass: 'border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/50 focus:border-white/40',
  }

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        maxLength={maxLength}
        onChange={(e) => {
          setValue(e.target.value)
          props.onChange?.(e)
        }}
        className={`
          w-full px-4 py-3 rounded-lg
          transition-all duration-300
          focus:outline-none focus:ring-4
          resize-none
          ${variants[variant]}
          ${error ? 'border-red-500 focus:ring-red-500/20' : ''}
          ${success ? 'border-green-500 focus:ring-green-500/20' : ''}
          ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      
      <div className="flex items-center justify-between">
        {(error || helperText) && (
          <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
        
        {showCount && maxLength && (
          <span className={`text-xs ml-auto ${value.length >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Input
