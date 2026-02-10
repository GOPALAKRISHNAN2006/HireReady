import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { challengeApi } from '../services/featureApi'
import { 
  Flame, 
  Clock, 
  Target,
  Award,
  Trophy,
  Zap,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  Timer,
  Sparkles,
  Gift,
  TrendingUp,
  Calendar,
  Crown,
  Rocket,
  AlertCircle
} from 'lucide-react'

const DailyChallenge = () => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  // Fetch today's challenge
  const { data: challengeData, isLoading: challengeLoading } = useQuery({
    queryKey: ['challenges', 'today'],
    queryFn: async () => {
      try {
        const response = await challengeApi.getTodaysChallenge()
        return response.data.data
      } catch (e) {
        return null
      }
    },
  })

  // Fetch streak data
  const { data: streakData, isLoading: streakLoading } = useQuery({
    queryKey: ['challenges', 'streak'],
    queryFn: async () => {
      try {
        const response = await challengeApi.getStreak()
        return response.data.data
      } catch (e) {
        return null
      }
    },
  })

  // Fetch leaderboard
  const { data: leaderboardData } = useQuery({
    queryKey: ['challenges', 'leaderboard'],
    queryFn: async () => {
      try {
        const response = await challengeApi.getLeaderboard({ type: 'streak', limit: 5 })
        return response.data.data
      } catch (e) {
        return null
      }
    },
  })

  const currentStreak = streakData?.currentStreak || 0
  const longestStreak = streakData?.longestStreak || 0
  const totalPoints = streakData?.totalPoints || 0

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft({ hours, minutes, seconds })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  // Handle solve challenge - navigate to solve page
  const handleSolveChallenge = () => {
    if (challengeData?.challenge?._id) {
      navigate(`/daily-challenge/solve/${challengeData.challenge._id}`)
    } else {
      navigate('/daily-challenge/solve/today')
    }
  }

  // Get today's challenge from real data
  const todayChallenge = challengeData?.challenge || null
  const userAttempt = challengeData?.userAttempt || null
  const todayAttemptCount = challengeData?.todayAttemptCount || 0
  const maxDailyAttempts = challengeData?.maxDailyAttempts || 3
  const canAttempt = challengeData?.canAttempt ?? (todayAttemptCount < maxDailyAttempts && !userAttempt?.isCompleted)

  // Calculate weekly progress from streak history
  const getWeeklyProgress = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const today = new Date().getDay()
    const todayIndex = today === 0 ? 6 : today - 1
    
    return days.map((day, index) => {
      const historyEntry = streakData?.recentHistory?.find(h => {
        const d = new Date(h.date).getDay()
        const dIndex = d === 0 ? 6 : d - 1
        return dIndex === index
      })
      
      return {
        day,
        completed: historyEntry ? true : false,
        xp: historyEntry?.pointsEarned || 0,
        isToday: index === todayIndex
      }
    })
  }

  const weeklyProgress = getWeeklyProgress()

  // Calculate rewards based on streak
  const rewards = [
    { streak: 3, reward: '50 Bonus XP', unlocked: currentStreak >= 3 },
    { streak: 7, reward: 'Exclusive Badge', unlocked: currentStreak >= 7 },
    { streak: 14, reward: 'Premium Question Pack', unlocked: currentStreak >= 14 },
    { streak: 30, reward: 'Interview Coaching Session', unlocked: currentStreak >= 30 },
  ]

  // Get leaderboard from API
  const leaderboard = leaderboardData?.leaderboard?.map(entry => ({
    rank: entry.rank,
    name: entry.user ? `${entry.user.firstName} ${entry.user.lastName?.charAt(0) || ''}.` : 'User',
    streak: entry.currentStreak,
    avatar: entry.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user?.firstName || 'U')}`
  })) || []

  // Loading state
  if (challengeLoading || streakLoading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><LoadingCard /></div>
          <div><LoadingCard /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-up max-h-screen overflow-y-auto pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {/* Header with Countdown */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          
          {/* Animated flames */}
          <div className="absolute top-10 right-20 opacity-30">
            <Flame className="w-16 h-16 animate-pulse text-yellow-300" />
          </div>
          <div className="absolute bottom-10 right-40 opacity-20">
            <Flame className="w-10 h-10 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
              <Flame className="w-4 h-4 mr-2 text-yellow-300" />
              Day {currentStreak} Streak!
            </div>
            <h1 className="text-4xl font-bold mb-3">Daily Challenge</h1>
            <p className="text-orange-100 text-lg max-w-xl">
              Complete today's challenge to maintain your streak and earn rewards!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-sm text-orange-100 mb-3 text-center">Time Remaining</p>
            <div className="flex gap-4">
              {[
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Min' },
                { value: timeLeft.seconds, label: 'Sec' },
              ].map((item, index) => (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <p className="text-xs text-orange-100 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <Card.Title>This Week's Progress</Card.Title>
                <p className="text-sm text-gray-500 dark:text-gray-400">You're on fire! 🔥</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">{currentStreak} day streak</span>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="flex justify-between">
            {weeklyProgress.map((day, index) => (
              <div key={day.day} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all ${
                  day.completed 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30' 
                    : day.isToday
                      ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30 animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {day.completed ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : day.isToday ? (
                    <Flame className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className={`text-sm font-medium ${day.isToday ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {day.day}
                </span>
                {day.completed && (
                  <span className="text-xs text-green-500 font-medium">+{day.xp} XP</span>
                )}
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Challenge */}
        <div className="lg:col-span-2 space-y-6">
          {todayChallenge ? (
            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={
                      todayChallenge.difficulty === 'easy' ? 'success' :
                      todayChallenge.difficulty === 'medium' ? 'warning' : 'danger'
                    }>
                      {todayChallenge.difficulty}
                    </Badge>
                    <Badge variant="default">{todayChallenge.category}</Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{todayChallenge.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{todayChallenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xl font-bold">+{todayChallenge.points} XP</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    <Timer className="w-4 h-4 inline mr-1" />
                    {todayChallenge.timeLimit} min limit
                  </p>
                </div>
              </div>

              {/* Challenge Status */}
              <div className={`p-4 rounded-xl mb-4 ${
                userAttempt?.isCompleted 
                  ? 'bg-green-50 border border-green-200' 
                  : !canAttempt
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      userAttempt?.isCompleted ? 'bg-green-500' : !canAttempt ? 'bg-amber-500' : 'bg-orange-100'
                    }`}>
                      {userAttempt?.isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : !canAttempt ? (
                        <Lock className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        userAttempt?.isCompleted ? 'text-green-700' : !canAttempt ? 'text-amber-700' : 'text-gray-900'
                      }`}>
                        {userAttempt?.isCompleted 
                          ? 'Completed!' 
                          : !canAttempt 
                            ? `Daily limit reached (${todayAttemptCount}/${maxDailyAttempts})` 
                            : 'Ready to solve'}
                      </h4>
                      {userAttempt && (
                        <p className="text-sm text-gray-500">
                          Score: {userAttempt.score}% | Earned: +{userAttempt.pointsEarned} XP
                        </p>
                      )}
                      {!userAttempt?.isCompleted && canAttempt && (
                        <p className="text-sm text-gray-500">
                          Attempts today: {todayAttemptCount}/{maxDailyAttempts}
                        </p>
                      )}
                      {!canAttempt && !userAttempt?.isCompleted && (
                        <p className="text-sm text-amber-600">
                          Come back tomorrow for more attempts!
                        </p>
                      )}
                    </div>
                  </div>
                  {canAttempt && !userAttempt?.isCompleted && (
                    <Button onClick={handleSolveChallenge} icon={Play}>
                      Solve Now
                    </Button>
                  )}
                  {userAttempt?.isCompleted && (
                    <Button variant="outline" onClick={handleSolveChallenge}>
                      View Solution
                    </Button>
                  )}
                </div>
              </div>

              {/* Tags */}
              {todayChallenge.tags && todayChallenge.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {todayChallenge.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ) : (
            <Card className="border-2 border-gray-200">
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Challenge Available</h3>
                <p className="text-gray-600 dark:text-gray-400">Check back later for new challenges!</p>
              </div>
            </Card>
          )}

          {/* Past Challenges - using empty state since we need API */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Challenges</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Complete challenges to see your history here!
              </p>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Streak Rewards */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                <Card.Title>Streak Rewards</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-xl ${
                      reward.unlocked 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      reward.unlocked 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {reward.unlocked ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${reward.unlocked ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {reward.streak} Day Streak
                      </p>
                      <p className={`text-sm ${reward.unlocked ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                        {reward.reward}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Streak Leaderboard */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <Card.Title>Streak Leaders</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              {leaderboard.length > 0 ? (
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-amber-100 text-amber-600' :
                        user.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {user.rank}
                      </div>
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-orange-500">
                          <Flame className="w-3 h-3" />
                          {user.streak} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No leaderboard data yet
                </p>
              )}
              <Button variant="ghost" className="w-full mt-4">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Card.Content>
          </Card>

          {/* Motivation Card */}
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Keep Going!</h3>
              <p className="text-sm text-purple-100 mb-4">
                {currentStreak < 7 
                  ? `${7 - currentStreak} more days to unlock the Exclusive Badge!`
                  : currentStreak < 14
                    ? `${14 - currentStreak} more days to unlock the Premium Question Pack!`
                    : 'You are doing amazing!'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-bold">You got this!</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DailyChallenge