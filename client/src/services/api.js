import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Wait for the server to be alive by polling the health endpoint.
 * Useful for Render/Railway free-tier cold starts (~30-60s).
 * Returns true when server responds, false if all retries exhausted.
 */
let _serverWarm = false
export const waitForServer = async ({ maxAttempts = 10, interval = 5000, silent = false } = {}) => {
  if (_serverWarm) return true

  if (!silent) {
    toast.loading('Server is waking up... This may take up to 60 seconds.', {
      id: 'cold-start',
      duration: 90000,
    })
  }

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(`${API_BASE}/health`, { timeout: 8000 })
      _serverWarm = true
      if (!silent) {
        toast.dismiss('cold-start')
        toast.success('Server is ready!', { duration: 2000 })
      }
      return true
    } catch {
      // Server not up yet — wait and retry
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
  }

  if (!silent) {
    toast.dismiss('cold-start')
    toast.error('Server is taking too long. Please refresh and try again.', { duration: 8000 })
  }
  return false
}

/**
 * Pre-warm the server in background (call on page load).
 */
export const preWarmServer = () => {
  if (_serverWarm) return
  axios.get(`${API_BASE}/health`, { timeout: 8000 })
    .then(() => { _serverWarm = true })
    .catch(() => { /* server is cold — will be handled on actual request */ })
}

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
    _serverWarm = true
    return response
  },
  async (error) => {
    const { response, config } = error

    // Retry logic for network errors (Render cold start)
    if (!response && error.request && !config._retried) {
      config._retried = true

      // Wait for the server to come alive via health polling
      const alive = await waitForServer()
      if (alive) {
        try {
          const retryResponse = await api.request(config)
          return retryResponse
        } catch (retryError) {
          if (retryError.response) {
            error = retryError
          } else {
            return Promise.reject(retryError)
          }
        }
      } else {
        return Promise.reject(error)
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
      toast.error('Unable to connect to server. Please check your connection and try again.', { duration: 5000 })
    }

    return Promise.reject(error)
  }
)

export default api
