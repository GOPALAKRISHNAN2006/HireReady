import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { useNotificationStore } from '../store/notificationStore'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Bell, 
  Check, 
  CheckCheck,
  Trash2,
  Trophy,
  Star,
  MessageCircle,
  AlertCircle,
  Info,
  Gift,
  Target,
  TrendingUp,
  Calendar,
  Settings,
  Sparkles,
  CheckCircle
} from 'lucide-react'

// Map notification type to icon and color
const notificationMeta = {
  achievement: { icon: Trophy, color: 'bg-yellow-500' },
  result:      { icon: Star, color: 'bg-green-500' },
  reminder:    { icon: Calendar, color: 'bg-blue-500' },
  system:      { icon: Info, color: 'bg-primary-500' },
  milestone:   { icon: Target, color: 'bg-purple-500' },
  improvement: { icon: TrendingUp, color: 'bg-emerald-500' },
  promo:       { icon: Gift, color: 'bg-pink-500' },
  alert:       { icon: AlertCircle, color: 'bg-red-500' },
  success:     { icon: CheckCircle, color: 'bg-green-500' },
  info:        { icon: Info, color: 'bg-blue-500' },
  warning:     { icon: AlertCircle, color: 'bg-amber-500' },
  error:       { icon: AlertCircle, color: 'bg-red-500' },
  interview:   { icon: Target, color: 'bg-indigo-500' },
}

const getNotificationIcon = (type) => notificationMeta[type]?.icon || Bell
const getNotificationColor = (type) => notificationMeta[type]?.color || 'bg-gray-500'

// Format time: if ISO date string, convert to relative time; otherwise return as-is
const formatRelativeTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  if (isNaN(date.getTime())) return time // Already a friendly string like "5 minutes ago"
  const now = new Date()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const queryClient = useQueryClient()
  const notificationStore = useNotificationStore()

  // Fetch notifications from API
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await api.get('/users/notifications')
        return response.data?.data?.notifications || response.data?.notifications || []
      } catch (e) {
        return []
      }
    }
  })

  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      await api.put(`/users/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
    }
  })

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.put('/users/notifications/read-all')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('All notifications marked as read')
    }
  })

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/notifications/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Notification deleted')
    }
  })

  // Merge API notifications + client-side notification store
  const displayNotifications = useMemo(() => {
    const apiNotifs = (notificationsData || []).map(n => ({ ...n, source: 'api' }))
    const storeNotifs = (notificationStore.notifications || []).map(n => ({ ...n, source: 'store' }))
    // Combine and sort by time, newest first
    const all = [...apiNotifs, ...storeNotifs].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.time || 0)
      const dateB = new Date(b.createdAt || b.time || 0)
      return dateB - dateA
    })
    return all
  }, [notificationsData, notificationStore.notifications])

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'result', label: 'Results' },
    { id: 'system', label: 'System' },
  ]

  const unreadCount = displayNotifications.filter(n => !n.read).length

  const filteredNotifications = displayNotifications.filter(n => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !n.read
    return n.type === activeFilter
  })

  const markAsRead = (id) => {
    // Try API first
    markReadMutation.mutate(id)
    // Also mark in store
    notificationStore.markAsRead(id)
  }

  const markAllAsRead = () => {
    markAllReadMutation.mutate()
    notificationStore.markAllAsRead()
  }

  const deleteNotification = (id) => {
    deleteMutation.mutate(id)
    notificationStore.removeNotification(id)
  }

  const clearAll = () => {
    displayNotifications.forEach(n => {
      const nid = n.id || n._id
      if (n.source === 'api') deleteMutation.mutate(nid)
    })
    notificationStore.clearAll()
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <LoadingCard count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Bell className="w-6 h-6 text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400">{unreadCount} unread notifications</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={CheckCheck}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={Trash2}
            onClick={clearAll}
            disabled={displayNotifications.length === 0}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {filter.label}
            {filter.id === 'unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card>
        <Card.Content>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No notifications</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeFilter === 'unread' 
                  ? "You're all caught up!" 
                  : 'You have no notifications yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700 -mx-6 -my-4">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type)
                const colorClass = getNotificationColor(notification.type)

                return (
                  <div 
                    key={notification.id || notification._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                              {formatRelativeTime(notification.time || notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id || notification._id)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id || notification._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Settings Link */}
      <div className="text-center">
        <Button variant="ghost" icon={Settings}>
          Notification Settings
        </Button>
      </div>
    </div>
  )
}

export default Notifications
