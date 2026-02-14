import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { useAuthStore } from '../store/authStore'
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
  Minus,
  Search,
  Sparkles,
  Zap
} from 'lucide-react'

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState('all')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { user: currentUser } = useAuthStore()

  // Fetch leaderboard data
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', timeRange, category],
    queryFn: async () => {
      const response = await api.get(`/analytics/leaderboard?timeRange=${timeRange}&category=${category}`)
      return response.data?.data || response.data
    },
  })

  // Transform API data to expected format, or show empty
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
    : []

  const userRank = data?.userRank || null
  const userScore = data?.userScore || 0

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-slate-500">#{rank}</span>
    }
  }

  const getRankBg = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700'
      case 2:
        return 'bg-gradient-to-r from-slate-50 to-slate-50 dark:from-slate-800 dark:to-slate-800 border-slate-200 dark:border-slate-600'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700'
      default:
        return 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
    }
  }

  const getChangeIcon = (change) => {
    switch (change) {
      case 'up':
        return <ChevronUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <ChevronDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Trophy className="w-4 h-4 mr-2" />
            Top Performers
          </div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-white/70 max-w-lg">See how you rank against other candidates</p>
        </div>
      </div>

      {/* Your Rank Card — only show if user has a rank */}
      {userRank && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Your Position</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Rank #{userRank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Average Score</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{userScore}%</p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
          <option value="today">Today</option>
        </select>
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100"
        >
          <option value="all">All Categories</option>
          <option value="dsa">DSA</option>
          <option value="system-design">System Design</option>
          <option value="behavioral">Behavioral</option>
          <option value="web">Web Development</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      {leaderboardData.length === 0 && !isLoading ? (
        <Card className="text-center py-16">
          <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Rankings Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Complete at least 5 interviews to appear on the leaderboard. Start practicing to climb the ranks!
          </p>
        </Card>
      ) : (
      <>
      {/* Podium with height differences */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-4 px-4">
        {/* 2nd Place */}
        {leaderboardData[1] && (
          <div className="w-full sm:flex-1 max-w-[280px] sm:max-w-[200px] order-2 sm:order-1">
            <Card className="relative overflow-hidden text-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-600">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-300 to-slate-400" />
              <div className="p-4 pt-5">
                <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden ring-3 ring-slate-300 dark:ring-slate-500">
                  {getAvatarUrl(leaderboardData[1].avatar) ? (
                    <img src={getAvatarUrl(leaderboardData[1].avatar)} alt={leaderboardData[1].name} className="w-14 h-14 object-cover" />
                  ) : (
                    leaderboardData[1].name.charAt(0)
                  )}
                </div>
                <Medal className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{leaderboardData[1].name}</h3>
                <p className="text-xl font-bold text-slate-600 dark:text-slate-300">{leaderboardData[1].score}%</p>
                <div className="flex justify-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span><Target className="w-3 h-3 inline mr-0.5" />{leaderboardData[1].interviews}</span>
                  <span><Flame className="w-3 h-3 inline mr-0.5 text-orange-500" />{leaderboardData[1].streak}d</span>
                </div>
              </div>
            </Card>
            <div className="h-16 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-b-xl mx-2 hidden sm:flex items-center justify-center">
              <span className="text-2xl font-black text-slate-400 dark:text-slate-500">2</span>
            </div>
          </div>
        )}
        
        {/* 1st Place */}
        {leaderboardData[0] && (
          <div className="w-full sm:flex-1 max-w-[280px] sm:max-w-[220px] order-1 sm:order-2">
            <Card className="relative overflow-hidden text-center bg-gradient-to-b from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-700 shadow-xl shadow-yellow-500/20">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400" />
              <div className="p-5 pt-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl overflow-hidden ring-4 ring-yellow-400/50">
                    {getAvatarUrl(leaderboardData[0].avatar) ? (
                      <img src={getAvatarUrl(leaderboardData[0].avatar)} alt={leaderboardData[0].name} className="w-20 h-20 object-cover" />
                    ) : (
                      leaderboardData[0].name.charAt(0)
                    )}
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Crown className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg truncate mt-1">{leaderboardData[0].name}</h3>
                <p className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{leaderboardData[0].score}%</p>
                <div className="flex justify-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span><Target className="w-3 h-3 inline mr-0.5" />{leaderboardData[0].interviews}</span>
                  <span><Flame className="w-3 h-3 inline mr-0.5 text-orange-500" />{leaderboardData[0].streak}d</span>
                </div>
              </div>
            </Card>
            <div className="h-24 bg-gradient-to-b from-yellow-300 to-amber-400 dark:from-yellow-700 dark:to-amber-800 rounded-b-xl mx-2 hidden sm:flex items-center justify-center">
              <span className="text-3xl font-black text-yellow-600 dark:text-yellow-300">1</span>
            </div>
          </div>
        )}
        
        {/* 3rd Place */}
        {leaderboardData[2] && (
          <div className="w-full sm:flex-1 max-w-[280px] sm:max-w-[200px] order-3">
            <Card className="relative overflow-hidden text-center bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-4 pt-5">
                <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden ring-3 ring-amber-400/50">
                  {getAvatarUrl(leaderboardData[2].avatar) ? (
                    <img src={getAvatarUrl(leaderboardData[2].avatar)} alt={leaderboardData[2].name} className="w-14 h-14 object-cover" />
                  ) : (
                    leaderboardData[2].name.charAt(0)
                  )}
                </div>
                <Medal className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{leaderboardData[2].name}</h3>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{leaderboardData[2].score}%</p>
                <div className="flex justify-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span><Target className="w-3 h-3 inline mr-0.5" />{leaderboardData[2].interviews}</span>
                  <span><Flame className="w-3 h-3 inline mr-0.5 text-orange-500" />{leaderboardData[2].streak}d</span>
                </div>
              </div>
            </Card>
            <div className="h-10 bg-gradient-to-b from-amber-200 to-orange-300 dark:from-amber-800 dark:to-orange-900 rounded-b-xl mx-2 hidden sm:flex items-center justify-center">
              <span className="text-2xl font-black text-amber-500 dark:text-amber-400">3</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard */}
      <Card padding="none">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-600" />
            Full Rankings
            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
              ({leaderboardData.filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase())).length} players)
            </span>
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            <LoadingCard message="Loading leaderboard..." />
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {leaderboardData
              .filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((user) => {
              const isCurrentUser = currentUser && (user.name === currentUser.name || user.name === `${currentUser.firstName} ${currentUser.lastName}`)
              return (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${getRankBg(user.rank)} border-l-4 ${
                  isCurrentUser ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                  <div className="w-8 sm:w-10 flex justify-center flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md overflow-hidden flex-shrink-0">
                    {getAvatarUrl(user.avatar) ? (
                      <img src={getAvatarUrl(user.avatar)} alt={user.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm sm:text-base truncate">
                      {user.name}
                      {isCurrentUser && (
                        <Badge variant="primary" size="sm">You</Badge>
                      )}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">{user.interviews} interviews</span>
                        <span className="sm:hidden">{user.interviews}</span>
                      </span>
                      <span className="flex items-center">
                        <Flame className="w-3 h-3 mr-1 text-orange-500" />
                        <span className="hidden sm:inline">{user.streak} day streak</span>
                        <span className="sm:hidden">{user.streak}d</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
                  <div className="hidden sm:flex items-center">
                    {getChangeIcon(user.change)}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{user.score}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">avg score</p>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </Card>
      </>
      )}
    </div>
  )
}

export default Leaderboard
