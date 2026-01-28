import { createPortal } from 'react-dom'
import { useEffect, useCallback, useState } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  dark = false,
  centered = true,
  animate = true,
  footer,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-[95vw] mx-4',
  }

  const variantStyles = {
    default: dark 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white',
    neon: 'bg-black/90 border border-neon-green/50 shadow-lg shadow-neon-green/20',
    gradient: 'bg-gradient-to-br from-primary-500 to-purple-600 text-white',
  }

  const iconVariants = {
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
    error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100' },
  }

  // Handle escape key
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    },
    [onClose, closeOnEscape]
  )

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      requestAnimationFrame(() => setIsAnimating(true))
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!shouldRender) return null

  const IconComponent = icon && iconVariants[icon]?.icon

  return createPortal(
    <div className={`fixed inset-0 z-50 flex ${centered ? 'items-center' : 'items-start pt-20'} justify-center p-4`}>
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`
          relative rounded-2xl shadow-2xl w-full ${sizes[size]}
          max-h-[90vh] overflow-hidden flex flex-col
          transition-all duration-300 ease-out
          ${variantStyles[variant]}
          ${isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
      >
        {/* Decorative gradient border */}
        {variant === 'default' && !dark && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
        )}

        {/* Header */}
        {(title || showCloseButton || icon) && (
          <div className={`
            flex items-start gap-4 p-6 
            ${title ? `border-b ${dark ? 'border-slate-700' : variant === 'default' ? 'border-gray-100' : 'border-white/10'}` : ''}
          `}>
            {/* Icon */}
            {IconComponent && (
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full 
                flex items-center justify-center
                ${iconVariants[icon].bg}
              `}>
                <IconComponent className={`w-6 h-6 ${iconVariants[icon].color}`} />
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className={`
                  text-xl font-semibold 
                  ${dark || variant === 'glass' || variant === 'neon' ? 'text-white' : variant === 'gradient' ? 'text-white' : 'text-gray-900'}
                `}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={`
                  mt-1 text-sm 
                  ${dark || variant === 'glass' || variant === 'neon' ? 'text-gray-400' : variant === 'gradient' ? 'text-white/80' : 'text-gray-500'}
                `}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`
                  flex-shrink-0 p-2 rounded-xl transition-all duration-200
                  hover:scale-110 active:scale-95
                  ${dark || variant === 'glass' || variant === 'neon' 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : variant === 'gradient'
                      ? 'hover:bg-white/20 text-white/80 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`
          p-6 overflow-y-auto flex-1
          ${dark || variant === 'glass' || variant === 'neon' || variant === 'gradient' ? 'text-gray-300' : 'text-gray-600'}
        `}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`
            p-6 border-t 
            ${dark ? 'border-slate-700 bg-slate-900/50' : variant === 'default' ? 'border-gray-100 bg-gray-50/50' : 'border-white/10 bg-black/20'}
          `}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// Modal Footer Component
const ModalFooter = ({ children, className = '', dark = false, align = 'end' }) => {
  const alignments = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={`
      flex items-center gap-3 
      ${alignments[align]}
      ${className}
    `}>
      {children}
    </div>
  )
}

// Confirm Modal Component
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={variant}
      size="sm"
      footer={
        <ModalFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg text-white font-medium transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${variant === 'error' ? 'bg-red-500 hover:bg-red-600' : ''}
              ${variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : ''}
              ${variant === 'info' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              ${variant === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}
            `}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </ModalFooter>
      }
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  )
}

Modal.Footer = ModalFooter

export default Modal
