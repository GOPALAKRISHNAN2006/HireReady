import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui'
import { Check, Loader2, Crown, Sparkles, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic interview prep',
    priceMonthly: 0,
    priceYearly: 0,
    icon: null,
    features: [
      '5 Mock Interviews/month',
      'Basic Analytics',
      'Community Access',
      'Daily Challenges',
      'Study Materials',
    ],
    highlighted: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For serious job seekers',
    priceMonthly: 19,
    priceYearly: 190,
    icon: Sparkles,
    features: [
      '25 Mock Interviews/month',
      'Advanced Analytics',
      'AI-Powered Feedback',
      'Resume Builder',
      'Priority Support',
      'All Free Features',
    ],
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Most popular for landing your dream job',
    priceMonthly: 49,
    priceYearly: 490,
    icon: Crown,
    features: [
      'Unlimited Mock Interviews',
      'Company-Specific Prep',
      'Career Roadmap',
      '1-on-1 Mentorship Sessions',
      'Certificate of Completion',
      'All Basic Features',
    ],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    priceMonthly: 99,
    priceYearly: 990,
    icon: Building2,
    features: [
      'Everything in Premium',
      'Custom Branding',
      'Team Management',
      'API Access',
      'Dedicated Support',
      'Custom Integrations',
    ],
    highlighted: false,
  },
]

const Pricing = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [interval, setInterval] = useState('monthly')
  const [loading, setLoading] = useState(null)
  const [currentPlan, setCurrentPlan] = useState('free')

  useEffect(() => {
    if (user?.plan) {
      setCurrentPlan(user.plan)
    }
  }, [user])

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      toast.success('You are already on the free plan!')
      return
    }

    if (!isAuthenticated) {
      toast('Please sign in to subscribe', { icon: '🔒' })
      navigate('/login?redirect=/pricing')
      return
    }

    if (currentPlan === planId) {
      toast('You are already on this plan!')
      return
    }

    if (!STRIPE_PUBLISHABLE_KEY) {
      toast.error('Payment system is not configured')
      return
    }

    setLoading(planId)

    try {
      const response = await api.post('/payments/create-checkout', {
        planId,
        interval,
      })

      if (response.data.success) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.data.url
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start checkout')
    } finally {
      setLoading(null)
    }
  }

  const getButtonText = (planId) => {
    if (currentPlan === planId) return 'Current Plan'
    if (planId === 'free') return 'Get Started'
    return 'Subscribe'
  }

  const getButtonVariant = (planId, highlighted) => {
    if (currentPlan === planId) return 'outline'
    if (highlighted) return 'default'
    return 'outline'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your interview preparation journey. Upgrade anytime as your needs grow.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm ${interval === 'monthly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setInterval(interval === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                interval === 'yearly' ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  interval === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${interval === 'yearly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-green-600 font-semibold">(Save 17%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = interval === 'yearly' ? plan.priceYearly : plan.priceMonthly
            const isCurrentPlan = currentPlan === plan.id

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col ${
                  plan.highlighted
                    ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 scale-105'
                    : ''
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Current
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  {Icon && (
                    <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        /{interval === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {price > 0 && interval === 'yearly' && (
                    <p className="text-sm text-green-600 mt-1">
                      ${Math.round(price / 12)}/month billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={getButtonVariant(plan.id, plan.highlighted)}
                  className={`w-full ${plan.highlighted ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || isCurrentPlan}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    getButtonText(plan.id)
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal through our secure payment processor, Stripe.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            🛡️ <strong>30-Day Money Back Guarantee</strong> - If you're not satisfied, we'll refund your payment, no questions asked.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing
