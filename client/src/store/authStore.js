import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/login', { email, password })
          const { user, tokens } = response.data.data
          
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`
          
          set({
            user,
            token: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed'
          set({ isLoading: false, error: message })
          return { success: false, error: message }
        }
      },

      // Admin login action (separate endpoint)
      adminLogin: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/admin/login', { email, password })
          const { user, tokens } = response.data.data

          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`

          set({
            user,
            token: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Admin login failed'
          set({ isLoading: false, error: message })
          return { success: false, error: message }
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/register', userData)
          const { user, tokens } = response.data.data
          
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`
          
          set({
            user,
            token: tokens.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 
            error.response?.data?.errors?.map(e => e.message).join(', ') || 
            'Registration failed'
          set({ isLoading: false, error: message })
          return { success: false, error: message }
        }
      },

      // Logout action
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear token from API headers
          delete api.defaults.headers.common['Authorization']
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      // Update user profile
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },

      // Check auth status on app load
      checkAuth: async () => {
        const token = get().token
        if (!token) return
        
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await api.get('/users/me')
          // Handle both response formats: {data: {user}} or {user}
          const user = response.data?.data?.user || response.data?.user
          if (user) {
            set({ user, isAuthenticated: true })
          } else {
            get().logout()
          }
        } catch (error) {
          // Token invalid or expired
          get().logout()
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
