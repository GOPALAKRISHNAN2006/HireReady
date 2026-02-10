import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'

/**
 * Hook to check premium status and feature access.
 *
 * Returns:
 *  - isPremium: boolean  — true if user is on any paid plan (basic/premium/enterprise)
 *  - plan: string        — current plan id
 *  - planName: string    — display name
 *  - features: string[]  — list of features the user has
 *  - limits: object      — plan limits (interviews, aptitudeTests, resumeUploads)
 *  - expiresAt: Date|null
 *  - isLoading: boolean
 *  - canAccess(feature): boolean — quick feature gate check
 */
const PREMIUM_FEATURES = [
  'ai-feedback',
  'resume-analysis',
  'career-roadmap',
  'advanced-analytics',
  'mentorship',
  'company-prep',
  'certificate',
  'unlimited-interviews',
  'priority-support',
  'team-management',
  'api-access',
]

const PLAN_FEATURE_MAP = {
  free: [],
  basic: ['ai-feedback', 'resume-analysis', 'advanced-analytics', 'priority-support'],
  premium: ['ai-feedback', 'resume-analysis', 'career-roadmap', 'advanced-analytics', 'mentorship', 'company-prep', 'certificate', 'unlimited-interviews', 'priority-support'],
  enterprise: PREMIUM_FEATURES,
}

export const usePremium = () => {
  const { user, isAuthenticated } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['premium-status'],
    queryFn: async () => {
      const res = await api.get('/payments/status')
      return res.data?.data
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // cache for 5 min
    refetchOnWindowFocus: false,
  })

  const plan = data?.plan || user?.plan || 'free'
  const isPremium = data?.isPremium || ['basic', 'premium', 'enterprise'].includes(plan)
  const allowedFeatures = PLAN_FEATURE_MAP[plan] || []

  const canAccess = (feature) => allowedFeatures.includes(feature)

  return {
    isPremium,
    plan,
    planName: data?.planName || plan.charAt(0).toUpperCase() + plan.slice(1),
    features: data?.features || [],
    limits: data?.limits || { interviews: 5, aptitudeTests: 10, resumeUploads: 1 },
    expiresAt: data?.expiresAt ? new Date(data.expiresAt) : null,
    isExpired: data?.isExpired || false,
    isLoading,
    canAccess,
  }
}

export default usePremium
