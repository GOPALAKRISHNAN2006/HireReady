/**
 * ===========================================
 * Enhanced Admin Questions Page
 * ===========================================
 * 
 * Comprehensive question management page featuring:
 * - Full CRUD operations
 * - Category and difficulty filtering
 * - Modal-based forms
 * - Bulk import capability
 * - Pending approval workflow
 * - Responsive design
 */

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card, Button, Badge, Modal, Input } from '../../components/ui'
import { LoadingCard } from '../../components/ui/Spinner'
import { adminQuestions } from '../../services/adminApi'
import api from '../../services/api'
import { 
  FileQuestion, 
  Search, 
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Brain,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Upload,
  Clock,
  AlertCircle,
  Sparkles,
  Tag
} from 'lucide-react'

// Category and difficulty options
const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'dsa', label: 'Data Structures & Algorithms' },
  { value: 'web', label: 'Web Development' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'system-design', label: 'System Design' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'mobile', label: 'Mobile Development' }
]

const DIFFICULTIES = [
  { value: '', label: 'All Levels' },
  { value: 'easy', label: 'Easy', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'hard', label: 'Hard', color: 'danger' },
  { value: 'expert', label: 'Expert', color: 'primary' }
]

const TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'situational', label: 'Situational' },
  { value: 'coding', label: 'Coding' },
  { value: 'conceptual', label: 'Conceptual' }
]

// Initial form state
const initialFormState = {
  text: '',
  category: 'dsa',
  difficulty: 'medium',
  type: 'technical',
  expectedAnswer: '',
  hints: '',
  tags: '',
  keyPoints: '',
  recommendedTimeMinutes: 5
}

const AdminQuestions = () => {
  const queryClient = useQueryClient()
  
  // State
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [isEditing, setIsEditing] = useState(false)

  // Fetch questions
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'questions', page, search, categoryFilter, difficultyFilter],
    queryFn: () => adminQuestions.getAll({
      page,
      limit: 15,
      search,
      category: categoryFilter,
      difficulty: difficultyFilter
    }),
  })

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['admin', 'questions', 'stats'],
    queryFn: adminQuestions.getStats,
  })

  // Create question mutation
  const createMutation = useMutation({
    mutationFn: (data) => adminQuestions.create(data),
    onSuccess: () => {
      toast.success('Question created successfully')
      queryClient.invalidateQueries(['admin', 'questions'])
      setShowAddModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create question')
    },
  })

  // Update question mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminQuestions.update(id, data),
    onSuccess: () => {
      toast.success('Question updated successfully')
      queryClient.invalidateQueries(['admin', 'questions'])
      setShowAddModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update question')
    },
  })

  // Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminQuestions.delete(id),
    onSuccess: () => {
      toast.success('Question deleted')
      queryClient.invalidateQueries(['admin', 'questions'])
      setShowDeleteModal(false)
      setSelectedQuestion(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete question')
    },
  })

  // AI Generate question mutation
  const generateMutation = useMutation({
    mutationFn: async (params) => {
      const response = await api.post('/ai/generate-question', params)
      return response.data
    },
    onSuccess: (data) => {
      if (data.question) {
        setFormData({
          text: data.question.text || '',
          category: data.question.category || 'dsa',
          difficulty: data.question.difficulty || 'medium',
          type: data.question.type || 'technical',
          expectedAnswer: data.question.expectedAnswer || '',
          hints: Array.isArray(data.question.hints) ? data.question.hints.join('\n') : '',
          tags: Array.isArray(data.question.tags) ? data.question.tags.join(', ') : '',
          keyPoints: Array.isArray(data.question.keyPoints) ? data.question.keyPoints.join('\n') : '',
          recommendedTimeMinutes: data.question.recommendedTimeMinutes || 5
        })
        toast.success('Question generated by AI!')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to generate question')
    },
  })

  const questions = data?.data?.questions || []
  const pagination = data?.data?.pagination || { page: 1, pages: 1, total: 0 }
  const stats = statsData?.data || {}

  // Reset form
  const resetForm = () => {
    setFormData(initialFormState)
    setSelectedQuestion(null)
    setIsEditing(false)
  }

  // Handle edit
  const handleEdit = (question) => {
    setSelectedQuestion(question)
    setFormData({
      text: question.text || '',
      category: question.category || 'dsa',
      difficulty: question.difficulty || 'medium',
      type: question.type || 'technical',
      expectedAnswer: question.expectedAnswer || '',
      hints: Array.isArray(question.hints) ? question.hints.join('\n') : '',
      tags: Array.isArray(question.tags) ? question.tags.join(', ') : '',
      keyPoints: Array.isArray(question.keyPoints) ? question.keyPoints.join('\n') : '',
      recommendedTimeMinutes: question.recommendedTimeMinutes || 5
    })
    setIsEditing(true)
    setShowAddModal(true)
  }

  // Handle view
  const handleView = (question) => {
    setSelectedQuestion(question)
    setShowViewModal(true)
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.text.trim()) {
      toast.error('Question text is required')
      return
    }

    // Process form data
    const processedData = {
      ...formData,
      hints: formData.hints.split('\n').filter(h => h.trim()),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      keyPoints: formData.keyPoints.split('\n').filter(k => k.trim()),
    }

    if (isEditing && selectedQuestion) {
      updateMutation.mutate({ id: selectedQuestion._id, data: processedData })
    } else {
      createMutation.mutate(processedData)
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger',
      expert: 'primary'
    }
    return colors[difficulty] || 'secondary'
  }

  // Get category label
  const getCategoryLabel = (value) => {
    const cat = CATEGORIES.find(c => c.value === value)
    return cat ? cat.label : value
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
          <p className="text-gray-600">Create, edit, and manage interview questions</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>
          Add Question
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total || 0}</p>
            </div>
            <FileQuestion className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-700">{stats.active || 0}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <button 
            onClick={() => generateMutation.mutate({ category: categoryFilter || 'dsa', difficulty: difficultyFilter || 'medium' })}
            disabled={generateMutation.isPending}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">AI Generate</p>
                <p className="text-sm font-medium text-purple-700">
                  {generateMutation.isPending ? 'Generating...' : 'Click to generate'}
                </p>
              </div>
              <Sparkles className={`w-8 h-8 text-purple-500 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
            </div>
          </button>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[180px]"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[140px]"
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff.value} value={diff.value}>{diff.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Questions List */}
      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <LoadingCard message="Loading questions..." />
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center">
            <FileQuestion className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No questions found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new question</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {questions.map((question) => (
                <div 
                  key={question._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Question Text */}
                      <p className="text-gray-900 font-medium line-clamp-2">
                        {question.text}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(question.category)}
                        </Badge>
                        <Badge variant={getDifficultyColor(question.difficulty)} className="text-xs">
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {question.type || 'technical'}
                        </Badge>
                        {question.isAIGenerated && (
                          <Badge variant="primary" className="text-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </Badge>
                        )}
                        {!question.isApproved && (
                          <Badge variant="warning" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {question.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.tags.slice(0, 5).map((tag, i) => (
                            <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {question.tags.length > 5 && (
                            <span className="text-xs text-gray-400">+{question.tags.length - 5} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(question)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(question)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuestion(question)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * 15) + 1} to {Math.min(page * 15, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Add/Edit Question Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          resetForm()
        }}
        title={isEditing ? 'Edit Question' : 'Add New Question'}
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter the interview question..."
              required
            />
          </div>

          {/* Category, Difficulty, Type */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {CATEGORIES.filter(c => c.value).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {DIFFICULTIES.filter(d => d.value).map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expected Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Answer
            </label>
            <textarea
              value={formData.expectedAnswer}
              onChange={(e) => setFormData({ ...formData, expectedAnswer: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter the ideal answer or key concepts..."
            />
          </div>

          {/* Key Points and Hints */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Points (one per line)
              </label>
              <textarea
                value={formData.keyPoints}
                onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Key point 1&#10;Key point 2&#10;Key point 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hints (one per line)
              </label>
              <textarea
                value={formData.hints}
                onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="Hint 1&#10;Hint 2"
              />
            </div>
          </div>

          {/* Tags and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="arrays, sorting, optimization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recommended Time (minutes)
              </label>
              <input
                type="number"
                value={formData.recommendedTimeMinutes}
                onChange={(e) => setFormData({ ...formData, recommendedTimeMinutes: parseInt(e.target.value) || 5 })}
                min={1}
                max={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Form Actions */}
          <Modal.Footer>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? 'Saving...' 
                : isEditing ? 'Update Question' : 'Create Question'
              }
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* View Question Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedQuestion(null)
        }}
        title="Question Details"
        size="2xl"
      >
        {selectedQuestion && (
          <div className="space-y-4">
            {/* Question */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Question</h4>
              <p className="text-gray-900">{selectedQuestion.text}</p>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{getCategoryLabel(selectedQuestion.category)}</Badge>
              <Badge variant={getDifficultyColor(selectedQuestion.difficulty)}>{selectedQuestion.difficulty}</Badge>
              <Badge variant="outline">{selectedQuestion.type}</Badge>
              {selectedQuestion.isAIGenerated && (
                <Badge variant="primary" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Generated
                </Badge>
              )}
            </div>

            {/* Expected Answer */}
            {selectedQuestion.expectedAnswer && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Expected Answer</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {selectedQuestion.expectedAnswer}
                </p>
              </div>
            )}

            {/* Key Points */}
            {selectedQuestion.keyPoints?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Key Points</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {selectedQuestion.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints */}
            {selectedQuestion.hints?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Hints</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {selectedQuestion.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {selectedQuestion.tags?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedQuestion.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedQuestion.timesAsked || 0}</p>
                <p className="text-sm text-gray-500">Times Asked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedQuestion.averageScore || 0}%</p>
                <p className="text-sm text-gray-500">Avg Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedQuestion.recommendedTimeMinutes || 5}</p>
                <p className="text-sm text-gray-500">Minutes</p>
              </div>
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowViewModal(false)
                handleEdit(selectedQuestion)
              }}>
                Edit Question
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedQuestion(null)
        }}
        title="Delete Question"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Confirm deletion</p>
              <p className="text-sm text-red-600 mt-1">
                This will deactivate the question. It can be restored later if needed.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            "{selectedQuestion?.text}"
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedQuestion(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(selectedQuestion?._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminQuestions
