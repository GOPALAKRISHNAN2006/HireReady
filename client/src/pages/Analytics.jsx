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
  // Fetch analytics data from /analytics/summary (real endpoint)
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const response = await api.get('/analytics/summary')
      return response.data?.data || response.data
    },
  })

  // Fetch weekly progress data
  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: ['analytics', 'progress', 'weekly'],
    queryFn: async () => {
      const response = await api.get('/analytics/progress?period=weekly')
      return response.data?.data || response.data
    },
  })

  // Fetch monthly progress data
  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ['analytics', 'progress', 'monthly'],
    queryFn: async () => {
      const response = await api.get('/analytics/progress?period=monthly')
      return response.data?.data || response.data
    },
  })

  // Fetch category performance
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['analytics', 'category-performance'],
    queryFn: async () => {
      const response = await api.get('/analytics/category-performance')
      return response.data?.data || response.data
    },
  })

  const progressLoading = weeklyLoading || monthlyLoading

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Transform weekly progress from API
  const weeklyProgress = (weeklyData?.progress || []).map(w => ({
    day: w.weekLabel || `W${w.week || ''}`,
    score: Math.round(w.averageScore || 0),
    interviews: w.interviewsCompleted || 0,
  }))

  // Transform category performance from API
  const categoryPerformance = (categoryData?.categoryPerformance || []).map(c => ({
    name: c.name || c.category,
    score: Math.round(c.averageScore || 0),
  }))

  // Build difficulty distribution from score distribution
  const scoreDistribution = analytics?.scoreDistribution || {}
  const difficultyDistribution = [
    { name: 'Easy (70-100)', value: (scoreDistribution['90-100'] || 0) + (scoreDistribution['70-89'] || 0), color: '#22c55e' },
    { name: 'Medium (40-69)', value: (scoreDistribution['50-69'] || 0) + (scoreDistribution['40-49'] || 0), color: '#f59e0b' },
    { name: 'Hard (0-39)', value: (scoreDistribution['0-49'] || 0), color: '#ef4444' },
  ].filter(d => d.value > 0)

  // Transform monthly progress from API
  const monthlyTrend = (monthlyData?.progress || []).map(m => ({
    month: monthNames[m.month - 1] || `M${m.month}`,
    score: Math.round(m.averageScore || 0),
  }))

  const stats = analytics?.stats || {}
  const statCards = [
    {
      title: 'Average Score',
      value: `${stats.averageScore || 0}%`,
      change: stats.improvementPercentage ? `${stats.improvementPercentage > 0 ? '+' : ''}${stats.improvementPercentage}%` : 'N/A',
      isPositive: (stats.improvementPercentage || 0) >= 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Interviews',
      value: stats.completedInterviews || stats.totalInterviews || 0,
      change: `${stats.totalInterviews || 0} total`,
      isPositive: true,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Practice Time',
      value: `${Math.round((stats.totalPracticeTime || 0) / 60)}h`,
      change: `${stats.totalPracticeTime || 0} mins`,
      isPositive: true,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak || 0} days`,
      change: stats.currentStreak > 5 ? 'Great!' : 'Keep going!',
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your progress and performance over time</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
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
            {(analytics?.achievements || []).map((achievement, index) => (
              <div 
                key={index}
                className={`text-center p-4 rounded-xl border-2 ${
                  achievement.unlocked 
                    ? 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{achievement.name}</p>
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
