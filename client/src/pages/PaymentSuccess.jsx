import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card, Button } from '../components/ui'
import Confetti from '../components/Confetti'
import {
  CheckCircle,
  Crown,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  PartyPopper,
} from 'lucide-react'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(true)

  const plan = location.state?.plan || 'Premium'
  const features = location.state?.features || []
  const expiresAt = location.state?.expiresAt

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      {showConfetti && <Confetti />}

      <div className="max-w-lg w-full space-y-8 animate-scale-in">
        {/* Success icon */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-bounce">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to {plan}! 🎉
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Your premium features are now active
          </p>
        </div>

        {/* Plan details */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{plan} Plan</h3>
              {expiresAt && (
                <p className="text-sm text-gray-500">
                  Active until {new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {features.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                What you unlocked
              </p>
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="w-full"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/interview/setup')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Start Interview <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <p className="text-center text-sm text-gray-400">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccess
