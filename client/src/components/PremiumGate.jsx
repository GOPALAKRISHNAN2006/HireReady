import { Link } from 'react-router-dom'
import { Crown, Lock, ArrowRight } from 'lucide-react'
import { Button } from './ui'
import { usePremium } from '../hooks/usePremium'

/**
 * Wraps children behind a premium paywall.
 *
 * Props:
 *  - feature: string — feature key to check (e.g. 'ai-feedback')
 *  - fallback: ReactNode — custom fallback (optional)
 *  - blur: boolean — if true, shows content behind a blur overlay instead of hiding completely
 *  - children: ReactNode
 */
const PremiumGate = ({ feature, fallback, blur = false, children }) => {
  const { isPremium, canAccess } = usePremium()

  // If user has access, render children
  if (isPremium && (!feature || canAccess(feature))) {
    return children
  }

  // Blur mode — show content with overlay
  if (blur) {
    return (
      <div className="relative">
        <div className="filter blur-sm pointer-events-none select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/70 backdrop-blur-[2px] rounded-xl">
          <div className="text-center p-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Premium Feature</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Upgrade to unlock this feature
            </p>
            <Link to="/premium">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Custom fallback
  if (fallback) return fallback

  // Default upgrade card
  return (
    <div className="border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl p-8 text-center bg-purple-50/50 dark:bg-purple-900/10">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse-slow">
        <Crown className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Premium Feature
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        This feature is available on paid plans. Upgrade to unlock AI feedback, advanced analytics, and more.
      </p>
      <Link to="/premium">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25">
          <Crown className="w-4 h-4 mr-2" />
          View Plans
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  )
}

export default PremiumGate
