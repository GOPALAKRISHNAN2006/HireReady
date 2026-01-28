/**
 * ===========================================
 * Enhanced Admin Dashboard
 * ===========================================
 * 
 * Comprehensive admin dashboard featuring:
 * - Real-time statistics from API
 * - Interactive charts and graphs
 * - Recent activity feed
 * - Quick action buttons
 * - Responsive design
 */

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, Badge } from '../../components/ui'
import { LoadingCard } from '../../components/ui/Spinner'
import { adminDashboard } from '../../services/adminApi'
import { 
  Users, 
  FileQuestion, 
  Target, 
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Activity,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  Brain,
  MessageSquare,
  BarChart3,
  RefreshCw
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
  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminDashboard.getStats,
    refetchInterval: 60000, // Auto-refresh every minute
  })

  // Fetch recent activity
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => adminDashboard.getActivity(15),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })

  const stats = statsData?.data || {}
  const activity = activityData?.data?.items || []

  // Stats cards configuration
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      subValue: `${stats.activeUsers || 0} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: stats.userGrowthPercent,
      trendLabel: 'vs last month',
      link: '/admin/users',
    },
    {
      title: 'Questions',
      value: stats.totalQuestions || 0,
      subValue: `${stats.pendingQuestions || 0} pending`,
      icon: FileQuestion,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/questions',
    },
    {
      title: 'Interviews',
      value: stats.totalInterviews || 0,
      subValue: `${stats.completedInterviews || 0} completed`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/admin/interviews',
    },
    {
      title: 'Avg Score',
      value: `${stats.averageScore || 0}%`,
      subValue: 'Overall performance',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Aptitude Questions',
      value: stats.totalAptitudeQuestions || 0,
      subValue: 'In question bank',
      icon: Brain,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      link: '/admin/aptitude',
    },
    {
      title: 'GD Topics',
      value: stats.totalGDTopics || 0,
      subValue: 'Active topics',
      icon: MessageSquare,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      link: '/admin/gd-topics',
    },
  ]

  // Activity icon and color mapping
  const getActivityIcon = (type) => {
    const icons = {
      user_signup: UserPlus,
      interview_complete: CheckCircle,
      interview_started: Clock,
      question_added: FileQuestion,
    }
    return icons[type] || Activity
  }

  const getActivityColor = (type) => {
    const colors = {
      user_signup: 'text-blue-600 bg-blue-100',
      interview_complete: 'text-green-600 bg-green-100',
      interview_started: 'text-yellow-600 bg-yellow-100',
      question_added: 'text-purple-600 bg-purple-100',
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  // Chart colors
  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your platform's performance and activity</p>
        </div>
        <button
          onClick={() => refetchStats()}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsLoading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => (
            <Card key={index} hover className={stat.link ? 'cursor-pointer' : ''}>
              {stat.link ? (
                <Link to={stat.link} className="block">
                  <StatCardContent stat={stat} />
                </Link>
              ) : (
                <StatCardContent stat={stat} />
              )}
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats Row */}
      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">New Users Today</p>
              <p className="text-3xl font-bold">{stats.newUsersToday || 0}</p>
            </div>
            <UserPlus className="w-10 h-10 text-blue-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">This Week</p>
              <p className="text-3xl font-bold">{stats.newUsersThisWeek || 0}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Interviews Today</p>
              <p className="text-3xl font-bold">{stats.interviewsToday || 0}</p>
            </div>
            <Target className="w-10 h-10 text-purple-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">This Week</p>
              <p className="text-3xl font-bold">{stats.interviewsThisWeek || 0}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <Card.Header>
            <Card.Title>User Growth</Card.Title>
            <Card.Description>Monthly user registrations</Card.Description>
          </Card.Header>
          <Card.Content>
            {statsLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>

        {/* Interviews by Category */}
        <Card>
          <Card.Header>
            <Card.Title>Interviews by Category</Card.Title>
            <Card.Description>Distribution of interview topics</Card.Description>
          </Card.Header>
          <Card.Content>
            {statsLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.interviewsByCategory || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [value, name === 'count' ? 'Interviews' : 'Avg Score']}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header className="flex items-center justify-between">
          <div>
            <Card.Title className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-600" />
              Recent Activity
            </Card.Title>
            <Card.Description>Latest platform events</Card.Description>
          </div>
          <Badge variant="secondary">{activity.length} events</Badge>
        </Card.Header>
        <Card.Content>
          {activityLoading ? (
            <LoadingCard />
          ) : activity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((item, index) => {
                const Icon = getActivityIcon(item.type)
                const colorClass = getActivityColor(item.type)
                
                return (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">{item.message}</p>
                      {item.details && (
                        <p className="text-sm text-gray-500 truncate">{item.details}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 whitespace-nowrap">
                      {item.time}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/questions" className="block">
          <Card hover className="text-center py-6">
            <FileQuestion className="w-8 h-8 mx-auto text-primary-600 mb-2" />
            <p className="font-medium text-gray-900">Add Question</p>
            <p className="text-sm text-gray-500">Create new interview question</p>
          </Card>
        </Link>
        
        <Link to="/admin/aptitude" className="block">
          <Card hover className="text-center py-6">
            <Brain className="w-8 h-8 mx-auto text-pink-600 mb-2" />
            <p className="font-medium text-gray-900">Add Aptitude</p>
            <p className="text-sm text-gray-500">Create aptitude test question</p>
          </Card>
        </Link>
        
        <Link to="/admin/gd-topics" className="block">
          <Card hover className="text-center py-6">
            <MessageSquare className="w-8 h-8 mx-auto text-cyan-600 mb-2" />
            <p className="font-medium text-gray-900">Add GD Topic</p>
            <p className="text-sm text-gray-500">Create discussion topic</p>
          </Card>
        </Link>
        
        <Link to="/admin/users" className="block">
          <Card hover className="text-center py-6">
            <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">View and manage accounts</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}

// Stat Card Content Component
const StatCardContent = ({ stat }) => (
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <p className="text-sm text-gray-500">{stat.title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
      {stat.subValue && (
        <p className="text-xs text-gray-400 mt-1">{stat.subValue}</p>
      )}
      {stat.trend !== undefined && (
        <div className={`flex items-center mt-2 text-sm ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stat.trend >= 0 ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          <span>{stat.trend >= 0 ? '+' : ''}{stat.trend}%</span>
          {stat.trendLabel && (
            <span className="text-gray-400 ml-1">{stat.trendLabel}</span>
          )}
        </div>
      )}
      {stat.link && (
        <div className="flex items-center mt-3 text-sm text-primary-600">
          <span>View details</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </div>
    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <stat.icon className={`w-6 h-6 ${stat.color}`} />
    </div>
  </div>
)

export default AdminDashboard
