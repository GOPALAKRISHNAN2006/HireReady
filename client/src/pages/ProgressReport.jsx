import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Flame,
  Clock,
  BarChart3,
  CheckCircle,
  XCircle,
  Calendar,
  Zap,
  Brain,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  BookOpen,
  ChevronRight
} from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, subtitle, trend, color = 'primary' }) => {
  const colors = {
    primary: 'from-primary-500 to-purple-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    orange: 'from-orange-500 to-amber-500',
    pink: 'from-rose-500 to-pink-500',
    indigo: 'from-indigo-500 to-violet-500',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && trend !== null && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : trend < 0 ? <ArrowDownRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

const ProgressBar = ({ label, value, max = 100, color = 'primary' }) => {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  const colorMap = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{pct}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorMap[color] || colorMap.primary} rounded-full transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const ProgressReport = () => {
  const { user } = useAuthStore()
  const [timeRange, setTimeRange] = useState('all')

  // Fetch analytics
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-report'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard')
      return response.data?.data || response.data
    },
    retry: 1,
  })

  // Fetch interview history
  const { data: historyData } = useQuery({
    queryKey: ['interview-history'],
    queryFn: async () => {
      const response = await api.get('/interviews?limit=50')
      return response.data?.data || response.data
    },
    retry: 1,
  })

  // Fetch skills data
  const { data: skillsData } = useQuery({
    queryKey: ['skills-report'],
    queryFn: async () => {
      const response = await api.get('/skills')
      return response.data?.data || response.data
    },
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingCard count={4} />
      </div>
    )
  }

  const stats = analyticsData?.analytics?.overallStats || analyticsData?.overallStats || {}
  const interviews = historyData?.interviews || historyData || []
  const skills = skillsData?.skills || skillsData || []

  const totalInterviews = stats.totalInterviews || interviews.length || 0
  const avgScore = stats.averageScore || 0
  const currentStreak = stats.currentStreak || 0
  const bestScore = stats.bestScore || Math.max(...interviews.map(i => i.score || 0), 0)
  const totalTime = stats.totalPracticeTime || interviews.reduce((acc, i) => acc + (i.duration || 0), 0)

  // Calculate category breakdown
  const categoryMap = {}
  interviews.forEach(i => {
    const cat = i.category || i.type || 'General'
    if (!categoryMap[cat]) categoryMap[cat] = { total: 0, totalScore: 0 }
    categoryMap[cat].total++
    categoryMap[cat].totalScore += (i.score || 0)
  })

  const categories = Object.entries(categoryMap).map(([name, data]) => ({
    name,
    count: data.total,
    avgScore: Math.round(data.totalScore / data.total),
  })).sort((a, b) => b.count - a.count)

  // Performance level
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { label: 'Expert', color: 'text-purple-500', icon: Trophy }
    if (score >= 75) return { label: 'Advanced', color: 'text-blue-500', icon: Star }
    if (score >= 60) return { label: 'Intermediate', color: 'text-green-500', icon: Target }
    if (score >= 40) return { label: 'Beginner', color: 'text-orange-500', icon: BookOpen }
    return { label: 'Getting Started', color: 'text-gray-500', icon: Zap }
  }

  const performance = getPerformanceLevel(avgScore)

  // Weekly activity (fake calculated from history)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekActivity = daysOfWeek.map((day, i) => {
    const count = interviews.filter(interview => {
      const d = new Date(interview.createdAt || interview.date)
      return d.getDay() === (i + 1) % 7
    }).length
    return { day, count }
  })
  const maxWeekCount = Math.max(...weekActivity.map(d => d.count), 1)

  // Recent scores trend
  const recentInterviews = [...interviews].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 10).reverse()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Progress Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your interview preparation journey</p>
        </div>
        <div className="flex items-center gap-2">
          <performance.icon className={`w-6 h-6 ${performance.color}`} />
          <Badge variant="primary" className="text-sm px-3 py-1">{performance.label} Level</Badge>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Target} label="Interviews Done" value={totalInterviews} color="primary" />
        <StatCard icon={TrendingUp} label="Average Score" value={`${Math.round(avgScore)}%`} color="green" />
        <StatCard icon={Award} label="Best Score" value={`${Math.round(bestScore)}%`} color="blue" />
        <StatCard icon={Flame} label="Current Streak" value={`${currentStreak} days`} color="orange" />
        <StatCard icon={Clock} label="Practice Time" value={`${Math.round(totalTime / 60)}h`} subtitle="Total minutes" color="pink" />
        <StatCard icon={CheckCircle} label="Skills Tracked" value={skills.length} color="indigo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Score Trend
            </Card.Title>
            <Card.Description>Your last {recentInterviews.length} interview scores</Card.Description>
          </Card.Header>
          <Card.Content>
            {recentInterviews.length > 0 ? (
              <div className="space-y-4">
                {/* Simple bar chart */}
                <div className="flex items-end gap-2 h-40">
                  {recentInterviews.map((interview, i) => {
                    const score = interview.score || 0
                    const height = Math.max((score / 100) * 100, 5)
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{Math.round(score)}%</span>
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded" /> 80%+</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded" /> 60-79%</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded" /> 40-59%</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded" /> &lt;40%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Complete some interviews to see your score trend</p>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Weekly Activity
            </Card.Title>
            <Card.Description>Practice sessions by day of week</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {weekActivity.map(({ day, count }) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-medium text-gray-600 dark:text-gray-400">{day}</span>
                  <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${Math.max((count / maxWeekCount) * 100, count > 0 ? 15 : 0)}%` }}
                    >
                      {count > 0 && <span className="text-xs font-bold text-white">{count}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Category Performance */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Category Performance
            </Card.Title>
            <Card.Description>Performance by interview category</Card.Description>
          </Card.Header>
          <Card.Content>
            {categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((cat, i) => (
                  <ProgressBar
                    key={cat.name}
                    label={`${cat.name} (${cat.count} sessions)`}
                    value={cat.avgScore}
                    color={['primary', 'green', 'blue', 'orange', 'purple', 'red'][i % 6]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Brain className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Complete interviews in different categories</p>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Skills Overview */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Skills Overview
            </Card.Title>
            <Card.Description>Your skill levels from assessments</Card.Description>
          </Card.Header>
          <Card.Content>
            {skills.length > 0 ? (
              <div className="space-y-4">
                {skills.slice(0, 8).map((skill, i) => {
                  const score = skill.score || skill.level || 0
                  return (
                    <ProgressBar
                      key={skill.name || skill.skill || i}
                      label={skill.name || skill.skill || `Skill ${i + 1}`}
                      value={score}
                      color={score >= 80 ? 'green' : score >= 60 ? 'blue' : score >= 40 ? 'orange' : 'red'}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Zap className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Use Skill Radar to track your abilities</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Recommendations
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {totalInterviews === 0 && (
              <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-700/50">
                <Target className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Start Practicing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Take your first mock interview to begin tracking your progress.</p>
                </div>
              </div>
            )}
            {avgScore > 0 && avgScore < 60 && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700/50">
                <BookOpen className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Review Fundamentals</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your average score has room to grow. Check Study Materials for core concepts.</p>
                </div>
              </div>
            )}
            {currentStreak === 0 && totalInterviews > 0 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700/50">
                <Flame className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Build Consistency</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start a daily streak! Even 15 minutes of practice keeps skills sharp.</p>
                </div>
              </div>
            )}
            {avgScore >= 80 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700/50">
                <Trophy className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Great Performance!</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">You&apos;re doing excellent. Try harder difficulty or System Design questions.</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
              <Brain className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Diversify Practice</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Try different categories: DSA, behavioral, system design for well-rounded prep.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50">
              <Zap className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Daily Challenges</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete daily challenges to earn points and build momentum.</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default ProgressReport
