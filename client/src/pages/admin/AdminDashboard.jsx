import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, Badge } from '../../components/ui'
import { LoadingCard } from '../../components/ui/Spinner'
import api from '../../services/api'
import { 
  Users, 
  Target, 
  TrendingUp,
  ChevronRight,
  Activity,
  Award,
  Brain,
  MessageSquare,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('all')

  // Fetch admin stats
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin', 'stats', timeRange],
    queryFn: async () => {
      const params = timeRange !== 'all' ? `?range=${timeRange}` : ''
      const response = await api.get(`/admin/stats${params}`)
      return response.data?.data || response.data
    },
  })

  // Fetch recent activity data
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: async () => {
      const response = await api.get('/admin/activity')
      return response.data?.data || response.data
    },
  })

  const statCards = [
    {
      title: 'Total Users',
      value: statsData?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/admin/users',
      description: 'Registered users'
    },
    {
      title: 'Total Interviews',
      value: statsData?.totalInterviews || 0,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Interview sessions'
    },
    {
      title: 'Avg Score',
      value: `${statsData?.averageScore || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Overall performance'
    },
    {
      title: 'Completed',
      value: statsData?.completedInterviews || 0,
      icon: CheckCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      description: 'Finished interviews'
    },
  ]

  // Performance distribution - use real data from API
  const performanceDistribution = statsData?.scoreDistribution || []

  // Category performance - use real scores from API
  const categoryPerformance = [
    { name: 'Interview', avgScore: statsData?.averageScore || 0, count: statsData?.totalInterviews || 0 },
    { name: 'Aptitude', avgScore: statsData?.averageAptitudeScore || 0, count: statsData?.totalAptitudeTests || 0 },
    { name: 'GD', avgScore: statsData?.averageGDScore || 0, count: statsData?.totalGDSessions || 0 },
  ]

  // User growth trend
  const userGrowth = statsData?.userGrowth || [
    { month: 'Jan', users: 0 },
    { month: 'Feb', users: 0 },
    { month: 'Mar', users: 0 },
    { month: 'Apr', users: 0 },
    { month: 'May', users: 0 },
    { month: 'Jun', users: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor user performance and platform analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <Link 
            to="/admin/users" 
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All Users
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} hover className={stat.link ? 'cursor-pointer' : ''}>
            {stat.link ? (
              <Link to={stat.link} className="block">
                <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
                <div className="flex items-center mt-3 text-sm text-primary-600">
                  <span>View details</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Performance Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Distribution Pie Chart */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Score Distribution
            </Card.Title>
            <Card.Description>Overall user performance breakdown</Card.Description>
          </Card.Header>
          <Card.Content>
            {isLoading ? (
              <LoadingCard />
            ) : performanceDistribution.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No interview data yet</p>
                  <p className="text-sm text-gray-400">Data will appear once interviews are completed</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>

        {/* Category Performance */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Performance by Category
            </Card.Title>
            <Card.Description>Average scores across assessments</Card.Description>
          </Card.Header>
          <Card.Content>
            {isLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value}%`, 'Avg Score']}
                  />
                  <Bar dataKey="avgScore" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* User Growth & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              User Growth
            </Card.Title>
            <Card.Description>New registrations over time</Card.Description>
          </Card.Header>
          <Card.Content>
            {isLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-600" />
              Quick Stats
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Total Interviews</span>
                </div>
                <span className="font-bold text-blue-600">{statsData?.totalInterviews || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Aptitude Tests</span>
                </div>
                <span className="font-bold text-purple-600">{statsData?.totalAptitudeTests || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">GD Sessions</span>
                </div>
                <span className="font-bold text-orange-600">{statsData?.totalGDSessions || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Active Today</span>
                </div>
                <span className="font-bold text-green-600">{statsData?.activeToday || 0}</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-600" />
            Recent Activity
          </Card.Title>
          <Card.Description>Latest platform events</Card.Description>
        </Card.Header>
        <Card.Content>
          {activityLoading ? (
            <LoadingCard />
          ) : (activityData?.recentActivity || activityData?.activities || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(activityData?.recentActivity || activityData?.activities || []).slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === 'interview' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      item.type === 'registration' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {item.type === 'interview' ? (
                        <Target className="w-4 h-4 text-blue-600" />
                      ) : item.type === 'registration' ? (
                        <Users className="w-4 h-4 text-green-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.description || item.message || `${item.type} activity`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.userName || item.user || 'Unknown user'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

export default AdminDashboard
