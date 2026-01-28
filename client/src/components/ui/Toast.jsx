import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Toast Context
const ToastContext = createContext(null)

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 5000,
      title: options.title,
    }

    setToasts((prev) => [...prev, toast])

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = {
    success: (message, options) => addToast(message, { ...options, type: 'success' }),
    error: (message, options) => addToast(message, { ...options, type: 'error' }),
    warning: (message, options) => addToast(message, { ...options, type: 'warning' }),
    info: (message, options) => addToast(message, { ...options, type: 'info' }),
    remove: removeToast,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  )
}

// Single Toast Component
const Toast = ({ id, message, type, title, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: 'text-white',
      text: 'text-white',
      progress: 'bg-white/30',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-500',
      icon: 'text-white',
      text: 'text-white',
      progress: 'bg-white/30',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      icon: 'text-white',
      text: 'text-white',
      progress: 'bg-white/30',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      icon: 'text-white',
      text: 'text-white',
      progress: 'bg-white/30',
    },
  }

  const IconComponent = icons[type]
  const style = styles[type]

  return (
    <div
      className={`
        ${style.bg} rounded-xl shadow-2xl p-4 pointer-events-auto
        animate-slide-in-right transform transition-all duration-300
        hover:scale-[1.02] cursor-pointer
      `}
      onClick={onClose}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <IconComponent className={`w-5 h-5 ${style.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-semibold ${style.text}`}>{title}</p>
          )}
          <p className={`text-sm ${style.text} ${title ? 'opacity-90' : ''}`}>
            {message}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className={`flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors ${style.icon}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
