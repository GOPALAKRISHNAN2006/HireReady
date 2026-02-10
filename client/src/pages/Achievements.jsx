import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { 
  Award, 
  Trophy, 
  Star, 
  CheckCircle,
  Lock,
  Sparkles,
  Zap,
  TrendingUp,
  Share2,
  Clock
} from 'lucide-react'

const Achievements = () => {
  const [filter, setFilter] = useState('all')

  // Fetch achievements data
  const { data, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await api.get('/analytics/achievements')
      return response.data?.data || response.data
    },
  })

  const achievements = (data?.achievements || []).map((a, index) => ({
    id: index + 1,
    name: a.name,
    description: a.description,
    icon: a.icon || '🏆',
    category: a.category || 'milestone',
    unlocked: a.unlocked || false,
    unlockedAt: a.unlockedAt,
    // Derive rarity from category
    rarity: a.category === 'speed' || a.category === 'variety' ? 'epic' 
      : a.category === 'streak' ? 'rare' 
      : a.category === 'score' ? 'rare'
      : 'common',
    xp: a.unlocked ? 100 : 0,
    progress: a.unlocked ? 100 : 0,
  }))

  const stats = {
    totalAchievements: data?.totalCount || achievements.length,
    unlockedAchievements: data?.unlockedCount || achievements.filter(a => a.unlocked).length,
    totalXP: achievements.filter(a => a.unlocked).length * 100,
    nextMilestone: Math.max(1000, (achievements.filter(a => a.unlocked).length + 1) * 100),
  }

  // Level system
  const level = useMemo(() => {
    const xp = stats.totalXP
    const levels = [
      { name: 'Beginner', minXP: 0, emoji: '🌱', color: 'from-gray-400 to-gray-500' },
      { name: 'Learner', minXP: 200, emoji: '📚', color: 'from-blue-400 to-blue-600' },
      { name: 'Achiever', minXP: 500, emoji: '⭐', color: 'from-purple-400 to-purple-600' },
      { name: 'Expert', minXP: 1000, emoji: '🏆', color: 'from-amber-400 to-orange-500' },
      { name: 'Master', minXP: 2000, emoji: '👑', color: 'from-yellow-400 to-red-500' },
      { name: 'Legend', minXP: 5000, emoji: '🌟', color: 'from-pink-500 to-rose-600' },
    ]
    let current = levels[0]
    let next = levels[1]
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].minXP) {
        current = levels[i]
        next = levels[i + 1] || null
        break
      }
    }
    const progress = next ? ((xp - current.minXP) / (next.minXP - current.minXP)) * 100 : 100
    return { current, next, progress, number: levels.indexOf(current) + 1 }
  }, [stats.totalXP])

  // Recently unlocked achievements
  const recentlyUnlocked = useMemo(() => {
    return achievements
      .filter(a => a.unlocked && a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      .slice(0, 3)
  }, [achievements])

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : filter === 'unlocked' 
      ? achievements.filter(a => a.unlocked)
      : filter === 'locked'
        ? achievements.filter(a => !a.unlocked)
        : achievements.filter(a => a.category === filter)

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'common': return 'default'
      case 'rare': return 'primary'
      case 'epic': return 'purple'
      case 'legendary': return 'warning'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="absolute top-4 right-4 opacity-10">
          <Award className="w-32 h-32" />
        </div>
        
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-1" />
            Achievement Hall
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Achievements</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors">
              <p className="text-3xl font-bold">{stats.unlockedAchievements}</p>
              <p className="text-sm text-amber-100">Unlocked</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors">
              <p className="text-3xl font-bold">{stats.totalAchievements}</p>
              <p className="text-sm text-amber-100">Total</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors">
              <p className="text-3xl font-bold">{stats.totalXP}</p>
              <p className="text-sm text-amber-100">XP Earned</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors">
              <p className="text-3xl font-bold">{stats.totalAchievements > 0 ? Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100) : 0}%</p>
              <p className="text-sm text-amber-100">Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level System + XP Progress */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Level Badge */}
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 bg-gradient-to-br ${level.current.color} rounded-2xl flex flex-col items-center justify-center shadow-xl flex-shrink-0`}>
              <span className="text-3xl">{level.current.emoji}</span>
              <span className="text-xs font-bold text-white/80">Lv.{level.number}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{level.current.name}</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{stats.totalXP} XP</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {level.next ? `${Math.round(level.progress)}% to ${level.next.name} ${level.next.emoji}` : 'Max Level Reached!'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {level.next ? `${level.next.minXP - stats.totalXP} XP needed` : ''}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${level.current.color} rounded-full transition-all duration-700 ease-out relative`}
                style={{ width: `${Math.min(level.progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recently Unlocked Spotlight */}
      {recentlyUnlocked.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Recently Unlocked</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentlyUnlocked.map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <div className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(a.rarity)} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                  <span className="text-xl">{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{a.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(a.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'unlocked', label: 'Unlocked' },
          { value: 'locked', label: 'Locked' },
          { value: 'interview', label: 'Interview' },
          { value: 'score', label: 'Score' },
          { value: 'streak', label: 'Streak' },
          { value: 'category', label: 'Category' },
          { value: 'special', label: 'Special' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === f.value
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      {isLoading ? (
        <LoadingCard message="Loading achievements..." />
      ) : achievements.length === 0 ? (
        <Card className="text-center py-16">
          <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Achievements Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Start completing interviews to unlock achievements and earn XP!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`relative overflow-hidden transition-all duration-300 group ${
                achievement.unlocked 
                  ? 'hover:shadow-xl hover:-translate-y-1' 
                  : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-80'
              }`}
            >
              {/* Rarity glow effect for unlocked */}
              {achievement.unlocked && (
                <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              )}
              
              {achievement.unlocked && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              )}
              
              {!achievement.unlocked && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center shadow-lg flex-shrink-0 ${achievement.unlocked ? 'group-hover:scale-110' : ''} transition-transform`}>
                  <span className="text-3xl">{achievement.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{achievement.name}</h3>
                    <Badge variant={getRarityBadge(achievement.rarity)} size="sm">
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-500`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{achievement.progress}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      +{achievement.xp} XP
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Achievements
