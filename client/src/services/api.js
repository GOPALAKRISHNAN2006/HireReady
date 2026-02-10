import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 60000,
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
  async (error) => {
    const { response, config } = error
    
    // Retry logic for network errors (Render cold start)
    // Only retry once, and only for POST requests that might be affected by cold starts
    if (!response && error.request && !config._retried) {
      config._retried = true
      
      // Show a friendly message instead of "Network error"
      toast.loading('Server is waking up... Please wait.', { 
        id: 'cold-start',
        duration: 15000 
      })
      
      // Wait 3 seconds then retry
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      try {
        const retryResponse = await api.request(config)
        toast.dismiss('cold-start')
        toast.success('Connected! Request completed.', { duration: 2000 })
        return retryResponse
      } catch (retryError) {
        toast.dismiss('cold-start')
        // If retry also fails, fall through to normal error handling
        if (retryError.response) {
          // Server responded on retry — handle normally
          error = retryError
        } else {
          toast.error('Server is starting up. Please try again in a moment.', { duration: 5000 })
          return Promise.reject(retryError)
        }
      }
    }

    // Handle specific error codes
    if (error.response) {
      const { response: resp } = error
      switch (resp.status) {
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
          const errors = resp.data?.errors
          if (errors && Array.isArray(errors)) {
            errors.forEach((err) => toast.error(err.msg || err.message))
          }
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          // Show generic error message
          if (resp.data?.message) {
            toast.error(resp.data.message)
          }
      }
    } else if (error.request) {
      // Network error — already handled by retry logic above
      toast.error('Server is starting up. Please try again in a moment.')
    }
    
    return Promise.reject(error)
  }
)

export default api
