import { useQuery } from '@tanstack/react-query'
import { Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { CommunicationStats } from '../components/communication'
import api from '../services/api'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Analytics = () => {
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', 'full'],
    queryFn: async () => {
      const response = await api.get('/analytics/stats')
      return response.data
    },
  })

  // Fetch progress data
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['analytics', 'progress'],
    queryFn: async () => {
      const response = await api.get('/analytics/progress')
      return response.data
    },
  })

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  // Mock data for charts (replace with real data)
  const weeklyProgress = progressData?.weekly || [
    { day: 'Mon', score: 65, interviews: 2 },
    { day: 'Tue', score: 72, interviews: 3 },
    { day: 'Wed', score: 68, interviews: 2 },
    { day: 'Thu', score: 78, interviews: 4 },
    { day: 'Fri', score: 82, interviews: 3 },
    { day: 'Sat', score: 75, interviews: 1 },
    { day: 'Sun', score: 88, interviews: 2 },
  ]

  const categoryPerformance = analytics?.categoryScores || [
    { name: 'DSA', score: 75 },
    { name: 'Web Dev', score: 82 },
    { name: 'System Design', score: 68 },
    { name: 'Behavioral', score: 90 },
    { name: 'Database', score: 72 },
  ]

  const difficultyDistribution = analytics?.difficultyDistribution || [
    { name: 'Easy', value: 40, color: '#22c55e' },
    { name: 'Medium', value: 45, color: '#f59e0b' },
    { name: 'Hard', value: 15, color: '#ef4444' },
  ]

  const monthlyTrend = progressData?.monthly || [
    { month: 'Jan', score: 60 },
    { month: 'Feb', score: 65 },
    { month: 'Mar', score: 70 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 72 },
    { month: 'Jun', score: 80 },
  ]

  const statCards = [
    {
      title: 'Average Score',
      value: `${analytics?.averageScore || 0}%`,
      change: '+5%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Interviews',
      value: analytics?.totalInterviews || 0,
      change: '+12',
      isPositive: true,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Practice Hours',
      value: `${analytics?.totalTime || 0}h`,
      change: '+3h',
      isPositive: true,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Current Streak',
      value: `${analytics?.streak || 0} days`,
      change: analytics?.streak > 5 ? 'Great!' : 'Keep going!',
      isPositive: true,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your progress and performance over time</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Last updated: Today</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.isPositive ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card>
          <Card.Header>
            <Card.Title>Weekly Progress</Card.Title>
            <Card.Description>Your performance this week</Card.Description>
          </Card.Header>
          <Card.Content>
            {progressLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyProgress}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    fill="url(#colorScore)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>

        {/* Category Performance */}
        <Card>
          <Card.Header>
            <Card.Title>Category Performance</Card.Title>
            <Card.Description>Scores by interview category</Card.Description>
          </Card.Header>
          <Card.Content>
            {isLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Difficulty Distribution */}
        <Card>
          <Card.Header>
            <Card.Title>Difficulty Distribution</Card.Title>
            <Card.Description>Questions by difficulty</Card.Description>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={difficultyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {difficultyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>

        {/* Monthly Trend */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Monthly Trend</Card.Title>
            <Card.Description>Your progress over the last 6 months</Card.Description>
          </Card.Header>
          <Card.Content>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>

      {/* Achievements */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Communication Skills */}
        <CommunicationStats />
        
        {/* Achievements - Full Width */}
        <Card className="lg:col-span-2">
        <Card.Header>
          <Card.Title className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(analytics?.achievements || [
              { name: 'First Interview', icon: '🎯', unlocked: true },
              { name: '10 Interviews', icon: '🏆', unlocked: true },
              { name: 'Perfect Score', icon: '⭐', unlocked: false },
              { name: '7-Day Streak', icon: '🔥', unlocked: true },
              { name: 'DSA Master', icon: '💻', unlocked: false },
              { name: 'Speed Demon', icon: '⚡', unlocked: false },
            ]).map((achievement, index) => (
              <div 
                key={index}
                className={`text-center p-4 rounded-xl border-2 ${
                  achievement.unlocked 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-medium text-gray-700">{achievement.name}</p>
                {achievement.unlocked && (
                  <Badge variant="success" size="sm" className="mt-2">Unlocked</Badge>
                )}
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
      </div>
    </div>
  )
}

export default Analytics
