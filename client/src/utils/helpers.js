/**
 * Utility functions for HireReady
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Get the full URL for an avatar image
 * @param {string} avatar - The avatar path or URL
 * @param {string} fallbackName - Name to use for fallback initial
 * @returns {string|null} The full avatar URL or null
 */
export const getAvatarUrl = (avatar) => {
  if (!avatar || avatar === 'default-avatar.png') {
    return null
  }
  
  // If it's already a full URL, return as-is
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }
  
  // Otherwise, prepend the API URL
  return `${API_URL}${avatar}`
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return 'U'
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Format a date relative to now
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted relative date
 */
export const formatRelativeDate = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const then = new Date(date)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  
  return then.toLocaleDateString()
}

/**
 * Format a score with color class
 * @param {number} score - The score (0-100)
 * @returns {object} { color, label }
 */
export const getScoreInfo = (score) => {
  if (score >= 90) return { color: 'text-green-600', bg: 'bg-green-100', label: 'Excellent' }
  if (score >= 75) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Good' }
  if (score >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Average' }
  if (score >= 40) return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Below Average' }
  return { color: 'text-red-600', bg: 'bg-red-100', label: 'Needs Improvement' }
}

export default {
  getAvatarUrl,
  getInitials,
  formatRelativeDate,
  getScoreInfo
}
