import { useEffect, useRef } from 'react'
import { useNotificationStore } from '../store/notificationStore'
import { useAuthStore } from '../store/authStore'

/**
 * Hook to trigger real notifications based on user activity.
 * Call this once in the main layout so it monitors user events.
 */
export const useNotificationTriggers = () => {
  const { addNotification, notifications } = useNotificationStore()
  const { user } = useAuthStore()
  const hasRun = useRef(false)

  useEffect(() => {
    if (!user || hasRun.current) return
    hasRun.current = true

    // Welcome notification for new users (no prior notifications)
    if (notifications.length === 0) {
      addNotification({
        type: 'system',
        title: 'Welcome to HireReady!',
        message: 'Start with a mock interview or explore Daily Challenges to begin your journey.',
      })
    }
  }, [user, notifications.length, addNotification])
}

/**
 * Helper to dispatch a notification from anywhere in the app.
 * Import and call these when events happen.
 */
export const notifyInterviewComplete = (score, category) => {
  const { addNotification } = useNotificationStore.getState()
  addNotification({
    type: 'result',
    title: 'Interview Complete!',
    message: `You scored ${score}% on your ${category || 'practice'} interview. View your results now.`,
  })
  // Achievement check
  if (score >= 90) {
    addNotification({
      type: 'achievement',
      title: 'Outstanding Performance!',
      message: `You scored ${score}% — that's an excellent result. Keep it up!`,
    })
  }
}

export const notifyStreakMilestone = (streakDays) => {
  const { addNotification } = useNotificationStore.getState()
  const milestones = [3, 7, 14, 30, 50, 100]
  if (milestones.includes(streakDays)) {
    addNotification({
      type: 'achievement',
      title: `${streakDays}-Day Streak!`,
      message: `Amazing! You've maintained a ${streakDays}-day practice streak. Keep the momentum going!`,
    })
  }
}

export const notifyChallengeComplete = (points) => {
  const { addNotification } = useNotificationStore.getState()
  addNotification({
    type: 'success',
    title: 'Daily Challenge Complete',
    message: `You earned ${points} points today. Come back tomorrow for another challenge!`,
  })
}

export const notifyPostCreated = () => {
  const { addNotification } = useNotificationStore.getState()
  addNotification({
    type: 'info',
    title: 'Post Published',
    message: 'Your post is now visible in the Community Hub.',
  })
}

export const notifySkillImproved = (skillName, newScore) => {
  const { addNotification } = useNotificationStore.getState()
  addNotification({
    type: 'improvement',
    title: 'Skill Improved!',
    message: `Your ${skillName} score is now ${newScore}%. Keep practicing!`,
  })
}
