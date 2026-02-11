import { useState, useEffect, useMemo } from 'react'
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
  Calendar,
  CheckCircle2,
  Circle,
  Quote,
  Sun,
  Moon,
  Sunrise,
  Coffee
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('interview-checklist')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Review common interview questions', done: false },
      { id: 2, text: 'Practice STAR method responses', done: false },
      { id: 3, text: 'Research target company', done: false },
      { id: 4, text: 'Prepare 3 questions to ask interviewer', done: false },
      { id: 5, text: 'Do a mock interview practice', done: false },
    ]
  })

  // Save checklist to localStorage
  useEffect(() => {
    localStorage.setItem('interview-checklist', JSON.stringify(checklist))
  }, [checklist])

  const toggleCheckItem = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 6) return { text: 'Good Night', emoji: '🌙', icon: Moon, color: 'from-indigo-600 via-purple-600 to-blue-700' }
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️', icon: Sunrise, color: 'from-amber-500 via-orange-500 to-yellow-500' }
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️', icon: Sun, color: 'from-blue-500 via-cyan-500 to-teal-500' }
    if (hour < 21) return { text: 'Good Evening', emoji: '🌅', icon: Coffee, color: 'from-purple-600 via-pink-600 to-rose-500' }
    return { text: 'Good Night', emoji: '🌙', icon: Moon, color: 'from-indigo-600 via-purple-600 to-blue-700' }
  }, [])

  // Motivational quotes
  const dailyQuote = useMemo(() => {
    const quotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
      { text: "Your limitation—it's only your imagination.", author: "Unknown" },
      { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    ]
    const dayIndex = Math.floor(Date.now() / 86400000) % quotes.length
    return quotes[dayIndex]
  }, [])

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
      {/* Welcome Section — Dynamic Time-of-Day */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${greeting.color} rounded-3xl p-8 text-white shadow-2xl`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="absolute top-4 right-4 opacity-10">
          <greeting.icon className="w-32 h-32" />
        </div>
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {greeting.text}, {user?.firstName || user?.name?.split(' ')[0] || 'User'}! {greeting.emoji}
            </h1>
            <p className="text-white/80 text-lg max-w-lg">
              Ready to continue your interview preparation? Let's make today count!
            </p>
          </div>
          <Link to="/interview/setup" className="mt-6 md:mt-0">
            <Button variant="secondary" size="lg" icon={PlayCircle} className="shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
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
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Motivational Quote + Preparation Checklist Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quote of the Day */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 border-l-4 border-l-primary-500">
          <div className="absolute top-4 right-4 opacity-5">
            <Quote className="w-24 h-24" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Quote of the Day</span>
            </div>
            <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-3 italic">
              "{dailyQuote.text}"
            </blockquote>
            <p className="text-sm text-gray-500 dark:text-gray-400">— {dailyQuote.author}</p>
          </div>
        </Card>

        {/* Preparation Checklist */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <Card.Title>Interview Prep Checklist</Card.Title>
              </div>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {checklist.filter(i => i.done).length}/{checklist.length}
              </span>
            </div>
          </Card.Header>
          <Card.Content>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(checklist.filter(i => i.done).length / checklist.length) * 100}%` }}
              />
            </div>
            <div className="space-y-2">
              {checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheckItem(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                    item.done 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 line-through text-gray-400 dark:text-gray-500' 
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-500 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{item.text}</span>
                </button>
              ))}
            </div>
            {checklist.every(i => i.done) && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  🎉 All done! You're fully prepared!
                </p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Weekly Activity Heatmap */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <Card.Title>This Week's Activity</Card.Title>
            </div>
            <Link to="/analytics" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center">
              Full Analytics <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-7 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const today = new Date().getDay()
              const adjustedToday = today === 0 ? 6 : today - 1 // Monday = 0
              const isToday = i === adjustedToday
              const isPast = i < adjustedToday
              // Simulate activity from recent interviews
              const activity = recentInterviews.filter(interview => {
                const d = new Date(interview.createdAt)
                const interviewDay = d.getDay() === 0 ? 6 : d.getDay() - 1
                return interviewDay === i
              }).length
              const intensity = activity === 0 ? 0 : activity === 1 ? 1 : activity === 2 ? 2 : 3
              const colors = [
                'bg-gray-100 dark:bg-gray-700',
                'bg-emerald-200 dark:bg-emerald-800',
                'bg-emerald-400 dark:bg-emerald-600',
                'bg-emerald-600 dark:bg-emerald-400',
              ]
              return (
                <div key={day} className="text-center">
                  <p className={`text-xs font-medium mb-2 ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>{day}</p>
                  <div className={`w-full aspect-square rounded-xl ${colors[intensity]} ${isToday ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800' : ''} transition-all duration-200 flex items-center justify-center`}>
                    {activity > 0 && <span className="text-xs font-bold text-white dark:text-gray-900">{activity}</span>}
                    {isToday && activity === 0 && <span className="text-xs text-gray-400 dark:text-gray-500">Today</span>}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
            {[0, 1, 2, 3].map(level => (
              <div key={level} className={`w-4 h-4 rounded-sm ${
                level === 0 ? 'bg-gray-100 dark:bg-gray-700' :
                level === 1 ? 'bg-emerald-200 dark:bg-emerald-800' :
                level === 2 ? 'bg-emerald-400 dark:bg-emerald-600' :
                'bg-emerald-600 dark:bg-emerald-400'
              }`} />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
          </div>
        </Card.Content>
      </Card>

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
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {interview.type} Interview
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getCategoryColor(interview.category)} size="sm">
                              {interview.category}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(interview.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {interview.responses?.length || 0} questions
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No interviews yet</p>
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
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Beaker className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 flex-1">Interview Lab</span>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/skills"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-900/30 dark:hover:to-blue-900/30 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Radar className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 flex-1">Skill Radar</span>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/roadmap"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Map className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 flex-1">Career Roadmap</span>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/community"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 transition-all group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200 flex-1">Community Hub</span>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Card.Content>
          </Card>

          {/* Streak Card */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streakData?.currentStreak || stats.currentStreak || 0} Days {(streakData?.currentStreak || stats.currentStreak || 0) > 0 && '🔥'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Best Streak</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">{streakData?.longestStreak || stats.longestStreak || 0} Days</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/tips" className="group">
          <Card hover className="h-full bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Interview Tips</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expert advice to ace your next interview</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/leaderboard" className="group">
          <Card hover className="h-full bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-100 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Leaderboard</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Compete with others and climb the ranks</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/achievements" className="group">
          <Card hover className="h-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Achievements</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your progress and earn badges</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
