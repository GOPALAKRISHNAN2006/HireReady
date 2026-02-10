import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { Card, Button, Badge } from '../components/ui'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Crown,
  Sparkles,
  Building2,
  Check,
  X,
  CreditCard,
  Wallet,
  Smartphone,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Loader2,
  Clock,
  Gift,
  Infinity,
  Brain,
  FileText,
  BarChart3,
  Users,
  Headphones,
  Lock,
  CheckCircle,
  ChevronRight,
} from 'lucide-react'

// ─── Plan Definitions ────────────────────────────────────
const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic interview prep',
    priceMonthly: 0,
    priceYearly: 0,
    icon: Zap,
    color: 'from-gray-400 to-gray-500',
    features: [
      { text: '5 Mock Interviews/month', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Community Access', included: true },
      { text: 'Daily Challenges', included: true },
      { text: 'AI-Powered Feedback', included: false },
      { text: 'Resume Builder', included: false },
      { text: 'Career Roadmap', included: false },
      { text: '1-on-1 Mentorship', included: false },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For serious job seekers',
    priceMonthly: 19,
    priceYearly: 190,
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    features: [
      { text: '25 Mock Interviews/month', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'AI-Powered Feedback', included: true },
      { text: 'Resume Builder', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Career Roadmap', included: false },
      { text: '1-on-1 Mentorship', included: false },
      { text: 'Custom Integrations', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Most popular — land your dream job',
    priceMonthly: 49,
    priceYearly: 490,
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      { text: 'Unlimited Mock Interviews', included: true },
      { text: 'Company-Specific Prep', included: true },
      { text: 'Career Roadmap', included: true },
      { text: '1-on-1 Mentorship Sessions', included: true },
      { text: 'Certificate of Completion', included: true },
      { text: 'Advanced AI Feedback', included: true },
      { text: 'Resume Analysis', included: true },
      { text: 'All Basic Features', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    priceMonthly: 99,
    priceYearly: 990,
    icon: Building2,
    color: 'from-amber-500 to-orange-500',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Custom Branding', included: true },
      { text: 'Team Management', included: true },
      { text: 'API Access', included: true },
      { text: 'Dedicated Support', included: true },
      { text: 'Custom Integrations', included: true },
      { text: 'Priority Onboarding', included: true },
      { text: 'SLA Guarantee', included: true },
    ],
  },
]

// ─── Payment Method Options ──────────────────────────────
const paymentMethods = [
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, MasterCard, Amex' },
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
  { id: 'wallet', name: 'Digital Wallet', icon: Wallet, description: 'PayPal, Apple Pay' },
]

const Premium = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()

  const [interval, setInterval] = useState('monthly')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [step, setStep] = useState('plans') // plans | payment | processing
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })

  // ─── Fetch current premium status ──────────────────────
  const { data: statusData, isLoading } = useQuery({
    queryKey: ['premium-status'],
    queryFn: async () => {
      const res = await api.get('/payments/status')
      return res.data?.data
    },
  })

  const currentPlan = statusData?.plan || user?.plan || 'free'
  const isPremium = statusData?.isPremium || false

  // ─── Activate premium mutation ─────────────────────────
  const activateMutation = useMutation({
    mutationFn: async ({ planId, paymentMethod, interval: billingInterval }) => {
      const res = await api.post('/payments/activate-premium', {
        planId,
        paymentMethod,
        interval: billingInterval,
      })
      return res.data
    },
    onSuccess: (data) => {
      if (data.data?.method === 'stripe' && data.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url
        return
      }
      // Direct activation
      updateUser({ plan: data.data.plan, planExpiresAt: data.data.expiresAt })
      queryClient.invalidateQueries({ queryKey: ['premium-status'] })
      toast.success(data.message || 'Plan activated!')
      navigate('/payment-success', {
        state: {
          plan: data.data.planName,
          features: data.data.features,
          expiresAt: data.data.expiresAt,
        },
      })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Activation failed')
      setStep('payment')
    },
  })

  const handleSelectPlan = (planId) => {
    if (planId === 'free' || planId === currentPlan) return
    setSelectedPlan(planId)
    setStep('payment')
  }

  const handleActivate = () => {
    if (!selectedPlan) return
    setStep('processing')
    activateMutation.mutate({
      planId: selectedPlan,
      paymentMethod: selectedPayment,
      interval,
    })
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  // ─── STEP: Processing ─────────────────────────────────
  if (step === 'processing') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Processing Payment...</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we activate your premium plan</p>
          <Loader2 className="w-8 h-8 mx-auto text-purple-500 animate-spin" />
        </div>
      </div>
    )
  }

  // ─── STEP: Payment Method ──────────────────────────────
  if (step === 'payment' && selectedPlanData) {
    const price = interval === 'yearly' ? selectedPlanData.priceYearly : selectedPlanData.priceMonthly
    const PlanIcon = selectedPlanData.icon

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        {/* Back button */}
        <button
          onClick={() => setStep('plans')}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to plans
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Payment form */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Purchase</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Choose your preferred payment method</p>
            </div>

            {/* Payment methods */}
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const MIcon = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPayment === method.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <MIcon className={`w-6 h-6 mb-2 ${selectedPayment === method.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    <p className={`font-semibold text-sm ${selectedPayment === method.id ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {method.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
                  </button>
                )
              })}
            </div>

            {/* Card details form */}
            {selectedPayment === 'card' && (
              <Card className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
                      setCardDetails({ ...cardDetails, number: v })
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '')
                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
                        setCardDetails({ ...cardDetails, expiry: v })
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* UPI form */}
            {selectedPayment === 'upi' && (
              <Card className="p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </Card>
            )}

            {/* Net banking */}
            {selectedPayment === 'netbanking' && (
              <Card className="p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Bank</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                  <option value="">Choose your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra</option>
                  <option>Punjab National Bank</option>
                </select>
              </Card>
            )}

            {/* Wallet */}
            {selectedPayment === 'wallet' && (
              <Card className="p-6 space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your wallet provider</p>
                {['PayPal', 'Apple Pay', 'Google Pay'].map((w) => (
                  <button key={w} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-left font-medium text-gray-700 dark:text-gray-300 transition-all">
                    {w}
                  </button>
                ))}
              </Card>
            )}

            {/* Security */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL encrypted — your payment details are secure</span>
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-2">
            <Card className="p-6 sticky top-24 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedPlanData.color} flex items-center justify-center`}>
                  <PlanIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedPlanData.name} Plan</h3>
                  <p className="text-sm text-gray-500">{interval === 'yearly' ? 'Annual' : 'Monthly'} billing</p>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">${price}</span>
                </div>
                {interval === 'yearly' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Yearly discount</span>
                    <span className="text-green-600 font-medium">-${(selectedPlanData.priceMonthly * 12 - price).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white font-medium">$0</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${price}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleActivate}
                disabled={activateMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30"
              >
                {activateMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Pay ${price} &amp; Activate</>
                )}
              </Button>

              <p className="text-xs text-center text-gray-400">
                30-day money-back guarantee. Cancel anytime.
              </p>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ─── STEP: Plan Selection (default) ────────────────────
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
            <Crown className="w-4 h-4 mr-2 text-yellow-400" />
            Premium Plans
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Unlock Your Full Potential</h1>
          <p className="text-purple-200 text-lg max-w-2xl">
            Get unlimited access to AI-powered interviews, advanced analytics, career roadmaps, and much more.
          </p>

          {isPremium && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-300">
                You&apos;re on the {statusData?.planName} plan
                {statusData?.expiresAt && (
                  <span className="text-green-400/70 ml-2 text-sm">
                    — expires {new Date(statusData.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${interval === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
          Monthly
        </span>
        <button
          onClick={() => setInterval(interval === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${interval === 'yearly' ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${interval === 'yearly' ? 'translate-x-8' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium ${interval === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
          Yearly <span className="text-green-500 font-bold">(Save 17%)</span>
        </span>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const PIcon = plan.icon
          const price = interval === 'yearly' ? plan.priceYearly : plan.priceMonthly
          const isCurrent = currentPlan === plan.id
          const isUpgrade = plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentPlan)

          return (
            <Card
              key={plan.id}
              className={`relative p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular ? 'ring-2 ring-purple-500 dark:ring-purple-400 shadow-purple-500/20 shadow-lg' : ''
              } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="success">Current Plan</Badge>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                <PIcon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
                  {price > 0 && (
                    <span className="text-gray-400 text-sm">/{interval === 'yearly' ? 'year' : 'mo'}</span>
                  )}
                </div>
                {price > 0 && interval === 'yearly' && (
                  <p className="text-xs text-green-500 mt-1">${Math.round(price / 12)}/mo billed annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {f.included ? (
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${f.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrent || plan.id === 'free'}
                variant={plan.popular ? 'default' : 'outline'}
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25' : ''}`}
              >
                {isCurrent ? (
                  'Current Plan'
                ) : plan.id === 'free' ? (
                  'Free Forever'
                ) : isUpgrade ? (
                  <><ArrowRight className="w-4 h-4 mr-1" /> Upgrade</>
                ) : (
                  'Select Plan'
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Premium Features Showcase */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Premium Features You&apos;ll Unlock
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Brain, title: 'AI Feedback', desc: 'Get detailed AI-powered analysis on every answer', color: 'text-purple-500' },
            { icon: FileText, title: 'Resume Analysis', desc: 'Advanced ATS scoring and optimization tips', color: 'text-blue-500' },
            { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights into your performance trends', color: 'text-emerald-500' },
            { icon: Headphones, title: '1-on-1 Mentorship', desc: 'Personal sessions with industry experts', color: 'text-orange-500' },
            { icon: Infinity, title: 'Unlimited Interviews', desc: 'Practice without limits, any time of day', color: 'text-pink-500' },
            { icon: Star, title: 'Company Prep', desc: 'Targeted prep for FAANG & top companies', color: 'text-amber-500' },
            { icon: Gift, title: 'Certificate', desc: 'Shareable certificate of completion', color: 'text-cyan-500' },
            { icon: Users, title: 'Priority Support', desc: 'Fast-track support from our team', color: 'text-rose-500' },
          ].map((feat, i) => (
            <Card key={i} className="p-5 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <feat.icon className={`w-8 h-8 mx-auto mb-3 ${feat.color}`} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feat.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secure Payment</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Cancel Anytime</div>
          <div className="flex items-center gap-1"><Gift className="w-4 h-4" /> 30-Day Guarantee</div>
        </div>
      </div>
    </div>
  )
}

export default Premium
