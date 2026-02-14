import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, Badge, Button } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { 
  History, 
  Target, 
  Clock, 
  Calendar,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  BarChart3,
  Eye,
  Download
} from 'lucide-react'

const PracticeHistory = () => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 20

  // Calculate date filter params
  const getDateParam = () => {
    const now = new Date()
    switch (dateRange) {
      case 'today': {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return `&from=${start.toISOString()}`
      }
      case 'week': {
        const start = new Date(now)
        start.setDate(now.getDate() - 7)
        return `&from=${start.toISOString()}`
      }
      case 'month': {
        const start = new Date(now)
        start.setMonth(now.getMonth() - 1)
        return `&from=${start.toISOString()}`
      }
      case 'year': {
        const start = new Date(now)
        start.setFullYear(now.getFullYear() - 1)
        return `&from=${start.toISOString()}`
      }
      default:
        return ''
    }
  }

  // Fetch practice history
  const { data, isLoading } = useQuery({
    queryKey: ['practice-history', filter, dateRange, page],
    queryFn: async () => {
      const dateParam = getDateParam()
      const response = await api.get(`/interviews?status=${filter}&limit=${limit}&page=${page}${dateParam}`)
      return response.data?.data || response.data
    },
  })

  const history = data?.interviews || []

  const stats = {
    totalSessions: history.length,
    completedSessions: history.filter(h => h.status === 'completed').length,
    averageScore: history.length > 0 
      ? Math.round(history.filter(h => h.overallScore > 0).reduce((sum, h) => sum + h.overallScore, 0) / history.filter(h => h.overallScore > 0).length) || 0
      : 0,
    totalTime: history.reduce((sum, h) => sum + (h.duration || 0), 0),
  }

  const getCategoryColor = (category) => {
    const colors = {
      dsa: 'primary',
      'system-design': 'purple',
      behavioral: 'success',
      web: 'info',
      ml: 'warning',
      database: 'danger',
      devops: 'default',
    }
    return colors[category] || 'default'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'danger'
      default: return 'default'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const filteredHistory = history.filter(item => {
    if (search) {
      const searchLower = search.toLowerCase()
      return item.category?.toLowerCase().includes(searchLower)
    }
    return true
  })

  // Export history as CSV
  const handleExportCSV = () => {
    if (filteredHistory.length === 0) return
    
    const headers = ['Date', 'Category', 'Difficulty', 'Status', 'Score', 'Duration (min)', 'Questions Answered']
    const rows = filteredHistory.map(session => [
      new Date(session.createdAt).toLocaleDateString(),
      session.category?.replace('-', ' ') || 'General',
      session.difficulty || 'N/A',
      session.status,
      session.overallScore || 0,
      session.duration || 0,
      `${session.questionsAnswered || 0}/${session.totalQuestions || 0}`
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `practice-history-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <History className="w-4 h-4 mr-2" />
            Your History
          </div>
          <h1 className="text-3xl font-bold mb-2">Practice History</h1>
          <p className="text-white/70 max-w-lg">Review your past practice sessions and track improvement</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="abandoned">Abandoned</option>
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => { setDateRange(e.target.value); setPage(1) }}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          {/* Export */}
          <Button 
            variant="outline" 
            icon={Download} 
            onClick={handleExportCSV}
            disabled={filteredHistory.length === 0}
          >
            Export CSV
          </Button>
        </div>
      </Card>

      {/* History List */}
      {isLoading ? (
        <LoadingCard message="Loading practice history..." />
      ) : filteredHistory.length === 0 ? (
        <Card className="text-center py-12">
          <History className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Practice Sessions Yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Start practicing to build your history!</p>
          <Link to="/interview/setup">
            <Button icon={Play}>Start Practice</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((session) => (
            <Card key={session._id} hover className="transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    session.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : session.status === 'in-progress'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    {session.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : session.status === 'in-progress' ? (
                      <Clock className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  {/* Session Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant={getCategoryColor(session.category)}>
                        {session.category?.replace('-', ' ').toUpperCase() || 'General'}
                      </Badge>
                      <Badge variant={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                      <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                        {session.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.duration || 0} mins
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {session.questionsAnswered || 0}/{session.totalQuestions} questions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center space-x-4">
                  {session.status === 'completed' && session.overallScore > 0 && (
                    <div className="text-center">
                      <p className={`text-3xl font-bold ${getScoreColor(session.overallScore)}`}>
                        {session.overallScore}%
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {session.status === 'completed' ? (
                      <Link to={`/interview/${session._id}/result`}>
                        <Button variant="outline" size="sm" icon={Eye}>
                          View Result
                        </Button>
                      </Link>
                    ) : session.status === 'in-progress' ? (
                      <Link to={`/interview/${session._id}`}>
                        <Button size="sm" icon={Play}>
                          Continue
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredHistory.length >= limit && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setPage(prev => prev + 1)}>Load More</Button>
        </div>
      )}
    </div>
  )
}

export default PracticeHistory
