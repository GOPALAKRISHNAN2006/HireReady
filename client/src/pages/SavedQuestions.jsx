import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Bookmark, 
  Search, 
  Filter,
  Trash2,
  ExternalLink,
  Play,
  Code,
  Database,
  Cloud,
  MessageSquare,
  Layers,
  Smartphone,
  Bot,
  ChevronDown,
  FolderPlus,
  Tag,
  Clock,
  Star
} from 'lucide-react'

const SavedQuestions = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const queryClient = useQueryClient()

  // Fetch saved questions from API
  const { data: savedData, isLoading } = useQuery({
    queryKey: ['saved-questions'],
    queryFn: async () => {
      try {
        const response = await api.get('/questions/saved')
        return response.data?.data?.questions || []
      } catch (e) {
        return []
      }
    }
  })

  // Delete saved question mutation
  const deleteMutation = useMutation({
    mutationFn: async (questionId) => {
      await api.delete(`/questions/${questionId}/save`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-questions'])
      toast.success('Question removed from saved')
    },
    onError: () => {
      toast.error('Failed to remove question')
    }
  })

  // Toggle star mutation
  const starMutation = useMutation({
    mutationFn: async ({ questionId, starred }) => {
      await api.put(`/questions/${questionId}/star`, { starred })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-questions'])
    }
  })

  const categories = [
    { id: 'all', label: 'All', icon: Bookmark, count: savedData?.length || 0 },
    { id: 'dsa', label: 'DSA', icon: Code, count: savedData?.filter(q => q.category === 'dsa').length || 0 },
    { id: 'system-design', label: 'System Design', icon: Layers, count: savedData?.filter(q => q.category === 'system-design').length || 0 },
    { id: 'behavioral', label: 'Behavioral', icon: MessageSquare, count: savedData?.filter(q => q.category === 'behavioral').length || 0 },
    { id: 'database', label: 'Database', icon: Database, count: savedData?.filter(q => q.category === 'database').length || 0 },
    { id: 'devops', label: 'DevOps', icon: Cloud, count: savedData?.filter(q => q.category === 'devops').length || 0 },
    { id: 'ml', label: 'Machine Learning', icon: Bot, count: savedData?.filter(q => q.category === 'ml' || q.category === 'machine-learning').length || 0 },
  ]

  // No fake defaults — only show real saved questions from API
  const savedQuestions = savedData?.length > 0 ? savedData : []

  const handleDelete = (questionId) => {
    if (window.confirm('Remove this question from saved?')) {
      deleteMutation.mutate(questionId)
    }
  }

  const handleStar = (questionId, currentStarred) => {
    starMutation.mutate({ questionId, starred: !currentStarred })
  }

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : Bookmark
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-red-100 text-red-700',
    }
    return colors[difficulty] || colors.medium
  }

  const filteredQuestions = savedQuestions.filter(q => {
    const matchesCategory = activeCategory === 'all' || q.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === 'starred') return (b.starred ? 1 : 0) - (a.starred ? 1 : 0)
    return 0 // Keep original order for 'newest'
  })

  return (
    <div className="space-y-8">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved
          </div>
          <h1 className="text-3xl font-bold mb-2">Saved Questions</h1>
          <p className="text-white/70 max-w-lg">Review and practice your bookmarked questions</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="starred">Starred First</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
              }`}>
                {cat.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {sortedQuestions.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No saved questions</h3>
              <p className="text-slate-500 dark:text-slate-400">
                {searchQuery ? 'No questions match your search' : 'Save questions from your interviews to practice later'}
              </p>
            </div>
          </Card>
        ) : (
          sortedQuestions.map((question) => {
            const CategoryIcon = getCategoryIcon(question.category)
            return (
              <Card key={question.id} className="hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CategoryIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {question.question}
                      </h3>
                      <button 
                        onClick={() => handleStar(question.id, question.starred)}
                        className={`p-1 rounded transition-colors ${
                        question.starred 
                          ? 'text-yellow-500' 
                          : 'text-slate-300 hover:text-yellow-500'
                      }`}>
                        <Star className={`w-5 h-5 ${question.starred ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Notes */}
                    {question.notes && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 italic">
                        📝 {question.notes}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>

                    {/* Meta & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{question.savedAt}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          icon={Trash2} 
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => handleDelete(question.id)}
                        >
                          Remove
                        </Button>
                        <Button 
                          size="sm" 
                          variant="primary" 
                          icon={Play}
                          onClick={() => {
                            // Navigate to practice based on question category
                            if (question.category === 'dsa') {
                              navigate('/aptitude')
                            } else if (question.category === 'behavioral') {
                              navigate('/gd')
                            } else if (question.category === 'system-design') {
                              navigate('/interview/setup', { state: { category: 'system-design' } })
                            } else {
                              navigate('/interview/setup', { state: { category: question.category } })
                            }
                            toast.success('Starting practice session...')
                          }}
                        >
                          Practice
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SavedQuestions
