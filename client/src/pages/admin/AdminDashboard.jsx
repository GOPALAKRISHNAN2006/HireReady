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
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3
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
  Legend,
  AreaChart,
  Area
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
      gradient: 'from-blue-600 to-indigo-600',
      lightBg: 'bg-blue-50 dark:bg-blue-950/30',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      link: '/admin/users',
      description: 'Registered users',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Total Interviews',
      value: statsData?.totalInterviews || 0,
      icon: Target,
      gradient: 'from-emerald-600 to-teal-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      link: '/admin/interviews',
      description: 'Interview sessions',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Avg Score',
      value: `${statsData?.averageScore || 0}%`,
      icon: TrendingUp,
      gradient: 'from-violet-600 to-purple-600',
      lightBg: 'bg-violet-50 dark:bg-violet-950/30',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600',
      description: 'Overall performance',
      trend: '+3%',
      trendUp: true
    },
    {
      title: 'Completed',
      value: statsData?.completedInterviews || 0,
      icon: CheckCircle,
      gradient: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-50 dark:bg-amber-950/30',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      description: 'Finished interviews',
      trend: '+15%',
      trendUp: true
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor platform activity and performance analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden rounded-2xl ${stat.lightBg} border border-slate-200/60 dark:border-slate-700/60 p-5 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 ${stat.link ? 'cursor-pointer' : ''} group`}>
            {stat.link ? (
              <Link to={stat.link} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
                </div>
                <div className="flex items-center mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View details</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </Link>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Performance Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <Award className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Score Distribution</h3>
                <p className="text-xs text-slate-500">Overall user performance breakdown</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {isLoading ? (
              <LoadingCard />
            ) : performanceDistribution.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">No interview data yet</p>
                  <p className="text-sm text-slate-400 mt-1">Data will appear once interviews are completed</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    strokeWidth={0}
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Performance by Category</h3>
                <p className="text-xs text-slate-500">Average scores across assessments</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {isLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 13, fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value) => [`${value}%`, 'Avg Score']}
                  />
                  <Bar dataKey="avgScore" fill="url(#barGradient)" radius={[0, 8, 8, 0]} barSize={28} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* User Growth & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">User Growth</h3>
                <p className="text-xs text-slate-500">New registrations over time</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {isLoading ? (
              <LoadingCard />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fill="url(#userGradient)"
                    dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Quick Stats</h3>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-100/60 dark:border-blue-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Interviews</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{statsData?.totalInterviews || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3.5 bg-violet-50/80 dark:bg-violet-900/20 rounded-xl border border-violet-100/60 dark:border-violet-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-100 dark:bg-violet-800/30 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Aptitude Tests</span>
                </div>
                <span className="text-lg font-bold text-violet-600">{statsData?.totalAptitudeTests || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3.5 bg-amber-50/80 dark:bg-amber-900/20 rounded-xl border border-amber-100/60 dark:border-amber-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-800/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GD Sessions</span>
                </div>
                <span className="text-lg font-bold text-amber-600">{statsData?.totalGDSessions || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-100/60 dark:border-emerald-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Today</span>
                </div>
                <span className="text-lg font-bold text-emerald-600">{statsData?.activeToday || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                <p className="text-xs text-slate-500">Latest platform events</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          {activityLoading ? (
            <LoadingCard />
          ) : (activityData?.recentActivity || activityData?.activities || []).length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="font-medium">No recent activity</p>
              <p className="text-sm text-slate-400 mt-1">Activity will appear here as users interact with the platform</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(activityData?.recentActivity || activityData?.activities || []).slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      item.type === 'interview' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      item.type === 'registration' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      {item.type === 'interview' ? (
                        <Target className="w-4 h-4 text-blue-600" />
                      ) : item.type === 'registration' ? (
                        <Users className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.description || item.message || `${item.type} activity`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.userName || item.user || 'Unknown user'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
