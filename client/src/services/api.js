import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (zustand persist)
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      } catch (e) {
        console.error('Error parsing auth storage:', e)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    
    // Handle specific error codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth and redirect
          localStorage.removeItem('auth-storage')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
            toast.error('Session expired. Please login again.')
          }
          break
        case 403:
          toast.error('You do not have permission to perform this action.')
          break
        case 404:
          // Don't show toast for 404s, let component handle it
          break
        case 422:
          // Validation error
          const errors = response.data?.errors
          if (errors && Array.isArray(errors)) {
            errors.forEach((err) => toast.error(err.msg || err.message))
          }
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          // Show generic error message
          if (response.data?.message) {
            toast.error(response.data.message)
          }
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export default api
