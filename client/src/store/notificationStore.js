import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      // Add a new notification
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          read: false,
          createdAt: new Date().toISOString(),
          ...notification,
        }
        set(state => ({
          notifications: [newNotification, ...state.notifications].slice(0, 100),
          unreadCount: state.unreadCount + 1,
        }))
        return newNotification
      },

      // Mark a single notification as read
      markAsRead: (id) => {
        set(state => {
          const updated = state.notifications.map(n =>
            n.id === id && !n.read ? { ...n, read: true } : n
          )
          const wasUnread = state.notifications.find(n => n.id === id && !n.read)
          return {
            notifications: updated,
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          }
        })
      },

      // Mark all as read
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },

      // Remove a notification
      removeNotification: (id) => {
        set(state => {
          const target = state.notifications.find(n => n.id === id)
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: target && !target.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          }
        })
      },

      // Clear all notifications
      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      // Get notifications by type
      getByType: (type) => get().notifications.filter(n => n.type === type),

      // Get unread notifications
      getUnread: () => get().notifications.filter(n => !n.read),

      // Notification types helper
      notify: {
        success: (title, message) => get().addNotification({ type: 'success', title, message }),
        error: (title, message) => get().addNotification({ type: 'error', title, message }),
        info: (title, message) => get().addNotification({ type: 'info', title, message }),
        warning: (title, message) => get().addNotification({ type: 'warning', title, message }),
        achievement: (title, message, badge) => get().addNotification({ type: 'achievement', title, message, badge }),
        interview: (title, message, interviewId) => get().addNotification({ type: 'interview', title, message, interviewId }),
      },
    }),
    {
      name: 'notification-store',
      partialize: state => ({
        notifications: state.notifications.slice(0, 50),
        unreadCount: state.unreadCount,
      }),
    }
  )
)
