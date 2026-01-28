import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { getAvatarUrl } from '../utils/helpers'
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Users,
  Target,
  Flame,
  Star,
  ChevronUp,
  ChevronDown,
  Minus
} from 'lucide-react'

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState('all')
  const [category, setCategory] = useState('all')

  // Fetch leaderboard data
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', timeRange, category],
    queryFn: async () => {
      const response = await api.get(`/analytics/leaderboard?timeRange=${timeRange}&category=${category}`)
      return response.data?.data || response.data
    },
  })

  // Transform API data to expected format, or use mock data
  const leaderboardData = data?.leaderboard?.length > 0 
    ? data.leaderboard.map(entry => ({
        rank: entry.rank,
        name: entry.user?.name || 'Unknown',
        avatar: entry.user?.avatar,
        score: entry.averageScore || 0,
        interviews: entry.completedInterviews || 0,
        streak: entry.currentStreak || 0,
        change: 'same'
      }))
    : [
        { rank: 1, name: 'Alex Johnson', avatar: null, score: 95, interviews: 45, streak: 12, change: 'up' },
        { rank: 2, name: 'Sarah Chen', avatar: null, score: 92, interviews: 38, streak: 8, change: 'up' },
        { rank: 3, name: 'Mike Williams', avatar: null, score: 89, interviews: 42, streak: 15, change: 'down' },
        { rank: 4, name: 'Emily Davis', avatar: null, score: 87, interviews: 35, streak: 5, change: 'same' },
        { rank: 5, name: 'James Brown', avatar: null, score: 85, interviews: 30, streak: 7, change: 'up' },
        { rank: 6, name: 'Lisa Anderson', avatar: null, score: 83, interviews: 28, streak: 4, change: 'down' },
        { rank: 7, name: 'David Wilson', avatar: null, score: 81, interviews: 25, streak: 6, change: 'up' },
        { rank: 8, name: 'Jennifer Taylor', avatar: null, score: 79, interviews: 22, streak: 3, change: 'same' },
        { rank: 9, name: 'Robert Martinez', avatar: null, score: 77, interviews: 20, streak: 2, change: 'down' },
        { rank: 10, name: 'Amanda Garcia', avatar: null, score: 75, interviews: 18, streak: 1, change: 'up' },
      ]

  const userRank = data?.userRank || null
  const userScore = data?.userScore || 0

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
      default:
        return 'bg-white border-gray-100'
    }
  }

  const getChangeIcon = (change) => {
    switch (change) {
      case 'up':
        return <ChevronUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <ChevronDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Leaderboard</h1>
            </div>
            <p className="text-purple-100">Compete with others and climb the ranks!</p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{leaderboardData.length}</p>
              <p className="text-sm text-purple-200">Participants</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">1,234</p>
              <p className="text-sm text-purple-200">Interviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
          <option value="today">Today</option>
        </select>
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
        >
          <option value="all">All Categories</option>
          <option value="dsa">DSA</option>
          <option value="system-design">System Design</option>
          <option value="behavioral">Behavioral</option>
          <option value="web">Web Development</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboardData.slice(0, 3).map((user, index) => (
          <Card 
            key={user.rank} 
            className={`relative overflow-hidden ${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${
              index === 0 ? 'from-yellow-400/20 to-amber-500/20' :
              index === 1 ? 'from-gray-300/20 to-slate-400/20' :
              'from-amber-500/20 to-orange-500/20'
            }`} />
            
            <div className="relative text-center p-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : 'bg-amber-100'
              }`}>
                {index === 0 ? (
                  <Crown className="w-8 h-8 text-yellow-500" />
                ) : (
                  <Medal className={`w-8 h-8 ${index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                )}
              </div>
              
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                {getAvatarUrl(user.avatar) ? (
                  <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-20 h-20 object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mt-2">
                {user.score}%
              </p>
              
              <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {user.interviews}
                </div>
                <div className="flex items-center">
                  <Flame className="w-4 h-4 mr-1 text-orange-500" />
                  {user.streak} days
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-600" />
            Full Rankings
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            <LoadingCard message="Loading leaderboard..." />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaderboardData.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${getRankBg(user.rank)} border-l-4`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 flex justify-center">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
                    {getAvatarUrl(user.avatar) ? (
                      <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-12 h-12 object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        {user.interviews} interviews
                      </span>
                      <span className="flex items-center">
                        <Flame className="w-3 h-3 mr-1 text-orange-500" />
                        {user.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    {getChangeIcon(user.change)}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{user.score}%</p>
                    <p className="text-xs text-gray-500">avg score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Leaderboard
