import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { challengeApi, skillsApi } from '../services/featureApi'
import { 
  PlayCircle, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  ChevronRight,
  BookOpen,
  Flame,
  Beaker,
  Map,
  Radar,
  Lightbulb,
  Users,
  Trophy,
  Zap,
  Star,
  Sparkles,
  Calendar
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()

  // Fetch dashboard summary from analytics
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const response = await api.get('/analytics/summary')
      return response.data.data
    },
  })

  // Fetch user streak data
  const { data: streakData } = useQuery({
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

  // Fetch skill radar data
  const { data: skillData } = useQuery({
    queryKey: ['skills', 'summary'],
    queryFn: async () => {
      try {
        const response = await skillsApi.getSkills()
        return response.data.data
      } catch (e) {
        return null
      }
    },
  })

  // Extract data from summary
  const stats = summaryData?.stats || {}
  const recentInterviews = summaryData?.recentInterviews || []
  const achievements = summaryData?.achievements || []

  const statCards = [
    {
      title: 'Total Interviews',
      value: stats.totalInterviews || 0,
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/30',
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore || 0}%`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-green-500/30',
    },
    {
      title: 'Practice Time',
      value: `${Math.round((stats.totalPracticeTime || 0) / 60)} hrs`,
      icon: Clock,
      gradient: 'from-purple-500 to-violet-500',
      shadow: 'shadow-purple-500/30',
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak || 0} days`,
      icon: Flame,
      gradient: 'from-orange-500 to-amber-500',
      shadow: 'shadow-orange-500/30',
    },
  ]

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'primary',
      behavioral: 'success',
      dsa: 'warning',
      'system-design': 'purple',
      'web-development': 'info',
    }
    return colors[category] || 'default'
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-primary-500/30">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Dashboard
            </div>
            <h1 className="text-3xl font-bold mb-3">
              Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to continue your interview preparation? Let's get started!
            </p>
          </div>
          <Link to="/interview/setup" className="mt-6 md:mt-0">
            <Button variant="secondary" size="lg" icon={PlayCircle} className="shadow-xl hover:shadow-2xl">
              Start New Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover className="group relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Interviews */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Recent Interviews</Card.Title>
                <Link to="/analytics" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </Card.Header>
            <Card.Content>
              {summaryLoading ? (
                <LoadingCard message="Loading interviews..." />
              ) : recentInterviews?.length > 0 ? (
                <div className="space-y-4">
                  {recentInterviews.map((interview) => (
                    <Link
                      key={interview._id}
                      to={`/interview/${interview._id}/result`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {interview.type} Interview
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getCategoryColor(interview.category)} size="sm">
                              {interview.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(interview.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {interview.responses?.length || 0} questions
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No interviews yet</p>
                  <Link to="/interview/setup">
                    <Button size="sm">Start Your First Interview</Button>
                  </Link>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Quick Actions & Achievements */}
        <div className="space-y-6">
          {/* Daily Challenge Card */}
          <Card className="bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 border-0 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-yellow-300 flame-animation" />
                <span className="font-semibold">Daily Challenge</span>
              </div>
              <h3 className="text-lg font-bold mb-2">
                {streakData?.currentStreak > 0 ? `${streakData.currentStreak} Day Streak!` : 'Start Your Streak'}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {streakData?.currentStreak > 0 
                  ? 'Keep going! Complete today\'s challenge.'
                  : 'Complete today\'s challenge to start your streak!'}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">{streakData?.totalPoints || 0} points</span>
                </div>
                <Link to="/daily-challenge">
                  <Button variant="secondary" size="sm">
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Quick Actions</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3">
              <Link
                to="/lab"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Beaker className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 flex-1">Interview Lab</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/skills"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl hover:from-cyan-100 hover:to-blue-100 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Radar className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 flex-1">Skill Radar</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/roadmap"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Map className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 flex-1">Career Roadmap</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/community"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl hover:from-pink-100 hover:to-rose-100 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 flex-1">Community Hub</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card.Content>
          </Card>

          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-amber-600 font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {streakData?.currentStreak || stats.currentStreak || 0} Days {(streakData?.currentStreak || stats.currentStreak || 0) > 0 && '🔥'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Best Streak</p>
                <p className="font-bold text-gray-700">{streakData?.longestStreak || stats.longestStreak || 0} Days</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/tips" className="group">
          <Card hover className="h-full bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Interview Tips</h3>
                <p className="text-sm text-gray-500">Expert advice to ace your next interview</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/leaderboard" className="group">
          <Card hover className="h-full bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Leaderboard</h3>
                <p className="text-sm text-gray-500">Compete with others and climb the ranks</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/achievements" className="group">
          <Card hover className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Achievements</h3>
                <p className="text-sm text-gray-500">Track your progress and earn badges</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
