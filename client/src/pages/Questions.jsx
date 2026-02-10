import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge, Input } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Code, 
  Users, 
  Database,
  Server,
  Brain,
  ChevronDown,
  Eye
} from 'lucide-react'

const Questions = () => {
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
  })
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  // Fetch questions
  const { data, isLoading } = useQuery({
    queryKey: ['questions', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      if (filters.search) params.append('search', filters.search)
      
      const response = await api.get(`/questions?${params.toString()}`)
      return response.data
    },
  })

  const categories = [
    { id: '', name: 'All Categories', icon: BookOpen },
    { id: 'dsa', name: 'DSA', icon: Code },
    { id: 'web-development', name: 'Web Dev', icon: Server },
    { id: 'behavioral', name: 'Behavioral', icon: Users },
    { id: 'system-design', name: 'System Design', icon: Database },
    { id: 'machine-learning', name: 'ML/AI', icon: Brain },
  ]

  const difficulties = [
    { id: '', name: 'All Levels' },
    { id: 'easy', name: 'Easy', color: 'success' },
    { id: 'medium', name: 'Medium', color: 'warning' },
    { id: 'hard', name: 'Hard', color: 'danger' },
  ]

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category)
    return cat?.icon || BookOpen
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
    }
    return colors[difficulty] || 'default'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Bank</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse and practice interview questions</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="appearance-none w-full md:w-48 px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="appearance-none w-full md:w-40 px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
            >
              {difficulties.map((diff) => (
                <option key={diff.id} value={diff.id}>{diff.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Questions List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <LoadingCard message="Loading questions..." />
          </Card>
        ) : data?.questions?.length > 0 ? (
          data.questions.map((question) => {
            const CategoryIcon = getCategoryIcon(question.category)
            const isExpanded = selectedQuestion === question._id
            
            return (
              <Card key={question._id} hover className="cursor-pointer" onClick={() => setSelectedQuestion(isExpanded ? null : question._id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getDifficultyColor(question.difficulty)} size="sm">
                          {question.difficulty}
                        </Badge>
                        <Badge variant="primary" size="sm">
                          {question.category}
                        </Badge>
                        {question.isAIGenerated && (
                          <Badge variant="purple" size="sm">AI Generated</Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {question.text}
                      </h3>
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.tags.map((tag, index) => (
                            <span key={index} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={Eye}>
                    {isExpanded ? 'Hide' : 'View'}
                  </Button>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                    {question.hints && question.hints.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hints</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {question.hints.map((hint, index) => (
                            <li key={index}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {question.expectedAnswer && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Answer</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          {question.expectedAnswer}
                        </p>
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Explanation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })
        ) : (
          <Card className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Questions Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button
              key={i}
              className={`w-10 h-10 rounded-lg font-medium ${
                i + 1 === data.pagination.page
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Questions
