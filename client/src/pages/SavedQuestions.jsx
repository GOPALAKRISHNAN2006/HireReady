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

  // Default questions if API returns empty
  const defaultQuestions = [
    {
      id: 1,
      question: 'Design a URL shortening service like bit.ly',
      category: 'system-design',
      difficulty: 'medium',
      savedAt: '2 days ago',
      tags: ['system-design', 'scalability', 'distributed-systems'],
      notes: 'Focus on hash collisions and database sharding',
      starred: true,
    },
    {
      id: 2,
      question: 'Implement a LRU Cache with O(1) time complexity',
      category: 'dsa',
      difficulty: 'medium',
      savedAt: '3 days ago',
      tags: ['data-structures', 'hash-map', 'linked-list'],
      notes: 'Use HashMap + Doubly Linked List',
      starred: true,
    },
    {
      id: 3,
      question: 'Tell me about a time you dealt with a difficult team member',
      category: 'behavioral',
      difficulty: 'easy',
      savedAt: '4 days ago',
      tags: ['teamwork', 'conflict-resolution'],
      notes: 'Use STAR method',
      starred: false,
    },
    {
      id: 4,
      question: 'Design a distributed cache system',
      category: 'system-design',
      difficulty: 'hard',
      savedAt: '5 days ago',
      tags: ['caching', 'distributed-systems', 'consistency'],
      notes: 'Discuss CAP theorem, cache invalidation strategies',
      starred: false,
    },
    {
      id: 5,
      question: 'Find the longest palindromic substring',
      category: 'dsa',
      difficulty: 'medium',
      savedAt: '1 week ago',
      tags: ['strings', 'dynamic-programming'],
      notes: 'Expand around center approach is O(n²)',
      starred: false,
    },
    {
      id: 6,
      question: 'Design database schema for an e-commerce platform',
      category: 'database',
      difficulty: 'medium',
      savedAt: '1 week ago',
      tags: ['sql', 'normalization', 'indexing'],
      notes: 'Consider denormalization for read-heavy operations',
      starred: true,
    },
    {
      id: 7,
      question: 'Explain CI/CD pipeline and implement for a microservices architecture',
      category: 'devops',
      difficulty: 'hard',
      savedAt: '2 weeks ago',
      tags: ['ci-cd', 'docker', 'kubernetes'],
      notes: 'Include testing, staging, and deployment strategies',
      starred: false,
    },
    {
      id: 8,
      question: 'Implement binary tree traversal (inorder, preorder, postorder)',
      category: 'dsa',
      difficulty: 'easy',
      savedAt: '2 weeks ago',
      tags: ['trees', 'recursion'],
      notes: 'Both recursive and iterative solutions',
      starred: false,
    },
  ]

  const savedQuestions = savedData?.length > 0 ? savedData : defaultQuestions

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Questions</h1>
            <p className="text-gray-500">{savedQuestions.length} questions saved</p>
          </div>
        </div>
        <Button variant="primary" icon={FolderPlus}>
          Create Collection
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-gray-900 cursor-pointer"
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
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-100'
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
              <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No saved questions</h3>
              <p className="text-gray-500">
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
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CategoryIcon className="w-5 h-5 text-primary-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {question.question}
                      </h3>
                      <button className={`p-1 rounded transition-colors ${
                        question.starred 
                          ? 'text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-500'
                      }`}>
                        <Star className={`w-5 h-5 ${question.starred ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Notes */}
                    {question.notes && (
                      <p className="text-sm text-gray-500 mb-3 italic">
                        📝 {question.notes}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>

                    {/* Meta & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
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
                          className="text-gray-400 hover:text-red-500"
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
