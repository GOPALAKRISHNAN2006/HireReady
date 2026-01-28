import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { 
  Award, 
  Trophy, 
  Star, 
  Zap,
  Target,
  Clock,
  Flame,
  Medal,
  Crown,
  Sparkles,
  BookOpen,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Lock
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

  const achievements = data?.achievements || [
    // Interview Achievements
    { id: 1, name: 'First Steps', description: 'Complete your first interview', icon: Target, category: 'interview', progress: 100, unlocked: true, rarity: 'common', xp: 50 },
    { id: 2, name: 'Getting Warmed Up', description: 'Complete 5 interviews', icon: Flame, category: 'interview', progress: 100, unlocked: true, rarity: 'common', xp: 100 },
    { id: 3, name: 'Interview Pro', description: 'Complete 25 interviews', icon: Trophy, category: 'interview', progress: 60, unlocked: false, rarity: 'rare', xp: 250 },
    { id: 4, name: 'Interview Master', description: 'Complete 100 interviews', icon: Crown, category: 'interview', progress: 15, unlocked: false, rarity: 'epic', xp: 500 },
    
    // Score Achievements
    { id: 5, name: 'Rising Star', description: 'Score 70% or higher in an interview', icon: Star, category: 'score', progress: 100, unlocked: true, rarity: 'common', xp: 75 },
    { id: 6, name: 'High Achiever', description: 'Score 85% or higher in an interview', icon: TrendingUp, category: 'score', progress: 100, unlocked: true, rarity: 'rare', xp: 150 },
    { id: 7, name: 'Perfectionist', description: 'Score 95% or higher in an interview', icon: Sparkles, category: 'score', progress: 50, unlocked: false, rarity: 'epic', xp: 300 },
    { id: 8, name: 'Flawless', description: 'Score 100% in an interview', icon: Crown, category: 'score', progress: 0, unlocked: false, rarity: 'legendary', xp: 1000 },
    
    // Streak Achievements
    { id: 9, name: 'Consistent', description: 'Maintain a 3-day practice streak', icon: Flame, category: 'streak', progress: 100, unlocked: true, rarity: 'common', xp: 50 },
    { id: 10, name: 'Dedicated', description: 'Maintain a 7-day practice streak', icon: Flame, category: 'streak', progress: 85, unlocked: false, rarity: 'rare', xp: 150 },
    { id: 11, name: 'Unstoppable', description: 'Maintain a 30-day practice streak', icon: Zap, category: 'streak', progress: 20, unlocked: false, rarity: 'epic', xp: 500 },
    
    // Category Achievements
    { id: 12, name: 'DSA Expert', description: 'Complete 10 DSA interviews', icon: BookOpen, category: 'category', progress: 70, unlocked: false, rarity: 'rare', xp: 200 },
    { id: 13, name: 'System Designer', description: 'Complete 10 System Design interviews', icon: Target, category: 'category', progress: 40, unlocked: false, rarity: 'rare', xp: 200 },
    { id: 14, name: 'People Person', description: 'Complete 10 Behavioral interviews', icon: MessageSquare, category: 'category', progress: 30, unlocked: false, rarity: 'rare', xp: 200 },
    
    // Special Achievements
    { id: 15, name: 'Night Owl', description: 'Complete an interview after midnight', icon: Star, category: 'special', progress: 100, unlocked: true, rarity: 'rare', xp: 100 },
    { id: 16, name: 'Early Bird', description: 'Complete an interview before 6 AM', icon: Clock, category: 'special', progress: 0, unlocked: false, rarity: 'rare', xp: 100 },
  ]

  const stats = {
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.unlocked).length,
    totalXP: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0),
    nextMilestone: 1000,
  }

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Achievements</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.unlockedAchievements}</p>
              <p className="text-sm text-amber-100">Unlocked</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.totalAchievements}</p>
              <p className="text-sm text-amber-100">Total</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.totalXP}</p>
              <p className="text-sm text-amber-100">XP Earned</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)}%</p>
              <p className="text-sm text-amber-100">Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Experience Points</h2>
            <p className="text-sm text-gray-500">Keep earning XP to level up!</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{stats.totalXP} XP</p>
            <p className="text-sm text-gray-500">Next milestone: {stats.nextMilestone} XP</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(stats.totalXP / stats.nextMilestone) * 100}%` }}
          />
        </div>
      </Card>

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
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      {isLoading ? (
        <LoadingCard message="Loading achievements..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`relative overflow-hidden transition-all duration-300 ${
                achievement.unlocked 
                  ? 'hover:shadow-xl hover:-translate-y-1' 
                  : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-80'
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              )}
              
              {!achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{achievement.name}</h3>
                    <Badge variant={getRarityBadge(achievement.rarity)} size="sm">
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-500`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{achievement.progress}%</span>
                  </div>
                  
                  <p className="text-xs text-primary-600 font-medium mt-2">+{achievement.xp} XP</p>
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
