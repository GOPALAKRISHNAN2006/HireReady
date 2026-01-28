/**
 * ===========================================
 * Admin API Service
 * ===========================================
 * 
 * Dedicated API service for admin operations.
 * Provides typed methods for all admin endpoints.
 */

import api from './api'

/**
 * Admin Dashboard API
 */
export const adminDashboard = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  /**
   * Get recent activity feed
   * @param {number} limit - Number of activities to fetch
   */
  getActivity: async (limit = 20) => {
    const response = await api.get(`/admin/activity?limit=${limit}`)
    return response.data
  },

  /**
   * Get analytics data
   * @param {string} period - Time period (day, week, month, year)
   */
  getAnalytics: async (period = 'week') => {
    const response = await api.get(`/admin/analytics?period=${period}`)
    return response.data
  }
}

/**
 * Admin Users API
 */
export const adminUsers = {
  /**
   * Get all users with filtering and pagination
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    const response = await api.get(`/admin/users?${queryParams.toString()}`)
    return response.data
  },

  /**
   * Get user by ID with details
   */
  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  /**
   * Get user's interviews
   */
  getUserInterviews: async (id, page = 1, limit = 10) => {
    const response = await api.get(`/admin/users/${id}/interviews?page=${page}&limit=${limit}`)
    return response.data
  },

  /**
   * Update user details
   */
  update: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  /**
   * Update user role
   */
  updateRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role })
    return response.data
  },

  /**
   * Toggle user ban status
   */
  toggleBan: async (id) => {
    const response = await api.put(`/admin/users/${id}/ban`)
    return response.data
  },

  /**
   * Delete user
   * @param {boolean} permanent - Hard delete if true
   */
  delete: async (id, permanent = false) => {
    const response = await api.delete(`/admin/users/${id}?permanent=${permanent}`)
    return response.data
  }
}

/**
 * Admin Questions API
 */
export const adminQuestions = {
  /**
   * Get all questions with filtering
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    const response = await api.get(`/admin/questions?${queryParams.toString()}`)
    return response.data
  },

  /**
   * Get question by ID
   */
  getById: async (id) => {
    const response = await api.get(`/admin/questions/${id}`)
    return response.data
  },

  /**
   * Get question statistics
   */
  getStats: async () => {
    const response = await api.get('/admin/questions/stats')
    return response.data
  },

  /**
   * Get pending questions for approval
   */
  getPending: async (page = 1, limit = 20) => {
    const response = await api.get(`/admin/questions/pending?page=${page}&limit=${limit}`)
    return response.data
  },

  /**
   * Create a new question
   */
  create: async (data) => {
    const response = await api.post('/admin/questions', data)
    return response.data
  },

  /**
   * Update a question
   */
  update: async (id, data) => {
    const response = await api.put(`/admin/questions/${id}`, data)
    return response.data
  },

  /**
   * Approve a question
   */
  approve: async (id) => {
    const response = await api.put(`/admin/questions/${id}/approve`)
    return response.data
  },

  /**
   * Reject a question
   */
  reject: async (id, reason = '') => {
    const response = await api.put(`/admin/questions/${id}/reject`, { reason })
    return response.data
  },

  /**
   * Delete a question
   */
  delete: async (id, permanent = false) => {
    const response = await api.delete(`/admin/questions/${id}?permanent=${permanent}`)
    return response.data
  },

  /**
   * Bulk import questions
   */
  bulkImport: async (questions) => {
    const response = await api.post('/admin/questions/bulk', { questions })
    return response.data
  }
}

/**
 * Admin Interviews API
 */
export const adminInterviews = {
  /**
   * Get all interviews with filtering
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    const response = await api.get(`/admin/interviews?${queryParams.toString()}`)
    return response.data
  },

  /**
   * Get interview by ID
   */
  getById: async (id) => {
    const response = await api.get(`/admin/interviews/${id}`)
    return response.data
  },

  /**
   * Get interview statistics
   */
  getStats: async (period = 'month') => {
    const response = await api.get(`/admin/interviews/stats?period=${period}`)
    return response.data
  },

  /**
   * Export interviews
   */
  export: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    const response = await api.get(`/admin/interviews/export?${queryParams.toString()}`)
    return response.data
  },

  /**
   * Delete an interview
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/interviews/${id}`)
    return response.data
  }
}

/**
 * Admin Aptitude API
 */
export const adminAptitude = {
  /**
   * Get all aptitude questions
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    const response = await api.get(`/admin/aptitude?${queryParams.toString()}`)
    return response.data
  },

  /**
   * Get aptitude question by ID
   */
  getById: async (id) => {
    const response = await api.get(`/admin/aptitude/${id}`)
    return response.data
  },

  /**
   * Create aptitude question
   */
  create: async (data) => {
    const response = await api.post('/admin/aptitude', data)
    return response.data
  },

  /**
   * Update aptitude question
   */
  update: async (id, data) => {
    const response = await api.put(`/admin/aptitude/${id}`, data)
    return response.data
  },

  /**
   * Delete aptitude question
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/aptitude/${id}`)
    return response.data
  }
}

/**
 * Admin GD Topics API
 */
export const adminGDTopics = {
  /**
   * Get all GD topics
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    const response = await api.get(`/admin/gd-topics?${queryParams.toString()}`)
    return response.data
  },

  /**
   * Get GD topic by ID
   */
  getById: async (id) => {
    const response = await api.get(`/admin/gd-topics/${id}`)
    return response.data
  },

  /**
   * Create GD topic
   */
  create: async (data) => {
    const response = await api.post('/admin/gd-topics', data)
    return response.data
  },

  /**
   * Update GD topic
   */
  update: async (id, data) => {
    const response = await api.put(`/admin/gd-topics/${id}`, data)
    return response.data
  },

  /**
   * Delete GD topic
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/gd-topics/${id}`)
    return response.data
  }
}

// Export all admin APIs
export default {
  dashboard: adminDashboard,
  users: adminUsers,
  questions: adminQuestions,
  interviews: adminInterviews,
  aptitude: adminAptitude,
  gdTopics: adminGDTopics
}
