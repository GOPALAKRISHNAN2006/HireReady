/**
 * ===========================================
 * Feature API Service
 * ===========================================
 * 
 * API calls for new features:
 * - Daily Challenges
 * - Community Hub
 * - Career Roadmap
 * - Skill Radar
 * - Interview Tips
 */

import api from './api'

// ============================================
// Daily Challenge API
// ============================================

export const challengeApi = {
  // Get today's challenge
  getTodaysChallenge: () => api.get('/challenges/today'),
  
  // Get user streak
  getStreak: () => api.get('/challenges/streak'),
  
  // Submit challenge answer
  submitChallenge: (id, data) => api.post(`/challenges/${id}/submit`, data),
  
  // Get challenge history
  getHistory: (params) => api.get('/challenges/history', { params }),
  
  // Get leaderboard
  getLeaderboard: (params) => api.get('/challenges/leaderboard', { params }),
  
  // Get all challenges
  getAllChallenges: (params) => api.get('/challenges/all', { params })
}

// ============================================
// Community API
// ============================================

export const communityApi = {
  // Get feed
  getFeed: (params) => api.get('/community/feed', { params }),
  
  // Create post
  createPost: (data) => api.post('/community/posts', data),
  
  // Get single post
  getPost: (id) => api.get(`/community/posts/${id}`),
  
  // Update post
  updatePost: (id, data) => api.put(`/community/posts/${id}`, data),
  
  // Delete post
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  
  // Like/unlike post
  likePost: (id) => api.post(`/community/posts/${id}/like`),
  
  // Bookmark post
  bookmarkPost: (id) => api.post(`/community/posts/${id}/bookmark`),
  
  // Add comment
  addComment: (id, data) => api.post(`/community/posts/${id}/comments`, data),
  
  // Get trending
  getTrending: (params) => api.get('/community/trending', { params }),
  
  // Get discussions
  getDiscussions: () => api.get('/community/discussions'),
  
  // Get mentors
  getMentors: (params) => api.get('/community/mentors', { params }),
  
  // Get user's posts
  getMyPosts: (params) => api.get('/community/my-posts', { params }),
  
  // Get bookmarks
  getBookmarks: () => api.get('/community/bookmarks')
}

// ============================================
// Career API
// ============================================

export const careerApi = {
  // Get all career paths
  getPaths: () => api.get('/career/paths'),
  
  // Get single path
  getPath: (id) => api.get(`/career/paths/${id}`),
  
  // Get user's progress
  getProgress: () => api.get('/career/progress'),
  
  // Start a career path
  startPath: (data) => api.post('/career/progress/start', data),
  
  // Complete milestone
  completeMilestone: (data) => api.post('/career/progress/milestone', data),
  
  // Pause/resume path
  togglePause: (pathId) => api.put(`/career/progress/${pathId}/pause`),
  
  // Get recommendations
  getRecommendations: () => api.get('/career/recommendations'),
  
  // Get stats
  getStats: () => api.get('/career/stats')
}

// ============================================
// Skills API
// ============================================

export const skillsApi = {
  // Get user skills
  getSkills: () => api.get('/skills'),
  
  // Get skill categories
  getCategories: () => api.get('/skills/categories'),
  
  // Submit assessment
  submitAssessment: (data) => api.post('/skills/assess', data),
  
  // Update single skill
  updateSkill: (data) => api.put('/skills/update', data),
  
  // Get recommendations
  getRecommendations: () => api.get('/skills/recommendations'),
  
  // Get history
  getHistory: () => api.get('/skills/history'),
  
  // Get leaderboard
  getLeaderboard: (params) => api.get('/skills/leaderboard', { params }),
  
  // Get radar data
  getRadarData: () => api.get('/skills/radar-data')
}

// ============================================
// Tips API
// ============================================

export const tipsApi = {
  // Get all tips
  getTips: (params) => api.get('/tips', { params }),
  
  // Get featured tips
  getFeatured: (params) => api.get('/tips/featured', { params }),
  
  // Get popular tips
  getPopular: (params) => api.get('/tips/popular', { params }),
  
  // Get tips by category
  getByCategory: (category, params) => api.get(`/tips/category/${category}`, { params }),
  
  // Get categories
  getCategories: () => api.get('/tips/categories'),
  
  // Get single tip
  getTip: (id) => api.get(`/tips/${id}`),
  
  // Like tip
  likeTip: (id) => api.post(`/tips/${id}/like`),
  
  // Bookmark tip
  bookmarkTip: (id) => api.post(`/tips/${id}/bookmark`),
  
  // Get user's bookmarks
  getBookmarks: () => api.get('/tips/user/bookmarks'),
  
  // Search tips
  searchTips: (params) => api.get('/tips/search/query', { params })
}

// ============================================
// Analytics API (Enhanced)
// ============================================

export const analyticsApi = {
  // Get full analytics
  getAnalytics: () => api.get('/analytics'),
  
  // Get dashboard summary
  getSummary: () => api.get('/analytics/summary'),
  
  // Get progress data
  getProgress: (params) => api.get('/analytics/progress', { params }),
  
  // Get category performance
  getCategoryPerformance: () => api.get('/analytics/category-performance'),
  
  // Get leaderboard
  getLeaderboard: () => api.get('/analytics/leaderboard')
}

export default {
  challenge: challengeApi,
  community: communityApi,
  career: careerApi,
  skills: skillsApi,
  tips: tipsApi,
  analytics: analyticsApi
}
