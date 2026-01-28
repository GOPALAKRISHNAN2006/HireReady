import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { Button, Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  Clock, 
  Target,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const AptitudeHistory = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')
  const limit = 10

  // Fetch test history
  const { data, isLoading } = useQuery({
    queryKey: ['aptitude-history', page, category],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit })
      if (category !== 'all') params.append('category', category)
      const response = await api.get(`/aptitude/history?${params}`)
      return response.data.data
    },
  })

  const tests = data?.tests || []
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 }

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'quantitative', name: 'Quantitative' },
    { id: 'logical', name: 'Logical' },
    { id: 'verbal', name: 'Verbal' },
    { id: 'data-interpretation', name: 'Data Interpretation' },
    { id: 'general-knowledge', name: 'General Knowledge' },
  ]

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 text-green-700'
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-700'
    if (percentage >= 40) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B'
    if (percentage >= 60) return 'C'
    if (percentage >= 50) return 'D'
    return 'F'
  }

  const formatTime = (seconds) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  // Calculate stats
  const totalTests = pagination.total
  const avgScore = tests.length > 0 
    ? Math.round(tests.reduce((acc, t) => acc + t.percentage, 0) / tests.length)
    : 0
  const bestScore = tests.length > 0 
    ? Math.max(...tests.map(t => t.percentage))
    : 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/aptitude')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
            <p className="text-gray-600">View all your past aptitude tests</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">{bestScore}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by category:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  category === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Test List */}
      {tests.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-500 mb-6">
            {category !== 'all' 
              ? `You haven't completed any ${category} tests yet.`
              : "You haven't completed any aptitude tests yet."}
          </p>
          <Button onClick={() => navigate('/aptitude')}>
            Take a Test
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getGradeColor(test.percentage)}`}>
                    <span className="text-xl font-bold">{getGrade(test.percentage)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {test.category?.replace('-', ' ')} Test
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(test.completedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(test.totalTime)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{test.percentage}%</p>
                    <p className="text-sm text-gray-500">
                      {test.correctAnswers}/{test.totalQuestions} correct
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/aptitude/result/${test._id}`, { state: { result: test } })}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.pages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default AptitudeHistory
