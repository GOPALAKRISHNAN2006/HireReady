import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
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
  Settings
} from 'lucide-react'

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const queryClient = useQueryClient()

  // Fetch notifications from API
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await api.get('/users/notifications')
        return response.data?.data?.notifications || []
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

  // Default notifications if API returns empty
  const defaultNotifications = [
    {
      id: 1,
      type: 'achievement',
      icon: Trophy,
      color: 'bg-yellow-500',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Quick Learner" badge for completing 5 interviews',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'result',
      icon: Star,
      color: 'bg-green-500',
      title: 'Interview Results Ready',
      message: 'Your System Design interview results are now available. You scored 85%!',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'reminder',
      icon: Calendar,
      color: 'bg-blue-500',
      title: 'Practice Reminder',
      message: "You haven't practiced in 3 days. Keep your streak going!",
      time: '2 hours ago',
      read: false,
    },
    {
      id: 4,
      type: 'system',
      icon: Info,
      color: 'bg-primary-500',
      title: 'New Features Available',
      message: 'Check out our new Group Discussion practice mode and enhanced analytics!',
      time: '1 day ago',
      read: true,
    },
    {
      id: 5,
      type: 'milestone',
      icon: Target,
      color: 'bg-purple-500',
      title: 'Milestone Reached!',
      message: 'Congratulations! You have completed 10 interviews. Keep up the great work!',
      time: '2 days ago',
      read: true,
    },
    {
      id: 6,
      type: 'improvement',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      title: 'Score Improvement',
      message: 'Your DSA interview scores have improved by 15% this week!',
      time: '3 days ago',
      read: true,
    },
    {
      id: 7,
      type: 'promo',
      icon: Gift,
      color: 'bg-pink-500',
      title: 'Limited Time Offer',
      message: 'Upgrade to Premium and get 50% off for the first 3 months!',
      time: '5 days ago',
      read: true,
    },
    {
      id: 8,
      type: 'alert',
      icon: AlertCircle,
      color: 'bg-red-500',
      title: 'Incomplete Interview',
      message: 'You have an incomplete interview session. Would you like to continue?',
      time: '1 week ago',
      read: true,
    },
  ]

  const [notifications, setNotifications] = useState(defaultNotifications)
  
  // Update notifications when data loads
  const displayNotifications = notificationsData?.length > 0 ? notificationsData : notifications

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
    markReadMutation.mutate(id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    markAllReadMutation.mutate()
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
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
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500">{unreadCount} unread notifications</p>
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
            disabled={notifications.length === 0}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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
        <Card.Content padding="none">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
              <p className="text-gray-500">
                {activeFilter === 'unread' 
                  ? "You're all caught up!" 
                  : 'You have no notifications yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 ${notification.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <notification.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <span className="text-xs text-gray-400 mt-2 block">{notification.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
