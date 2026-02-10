import { Crown } from 'lucide-react'

/**
 * A small badge that indicates a feature requires premium.
 * Can be shown inline, or used as a mini pill.
 */
const PremiumBadge = ({ size = 'sm', className = '' }) => {
  if (size === 'xs') {
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full leading-none ${className}`}>
        <Crown className="w-2.5 h-2.5 mr-0.5" />
        PRO
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm ${className}`}>
      <Crown className="w-3 h-3" />
      Premium
    </span>
  )
}

export default PremiumBadge
