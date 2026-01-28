/**
 * ===========================================
 * Enhanced Admin Interviews Page
 * ===========================================
 * 
 * Comprehensive interview management page featuring:
 * - Interview list with filtering and search
 * - Detailed interview view with responses
 * - Score analytics
 * - Export functionality (CSV/JSON)
 * - Pagination and responsive design
 */

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card, Button, Badge, Modal } from '../../components/ui'
import { LoadingCard } from '../../components/ui/Spinner'
import { adminInterviews } from '../../services/adminApi'
import { 
  Video, 
  Search, 
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Star,
  TrendingUp,
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  Filter
} from 'lucide-react'

// Status options
const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Category options
const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'dsa', label: 'Data Structures & Algorithms' },
  { value: 'web', label: 'Web Development' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'system-design', label: 'System Design' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' }
]

const AdminInterviews = () => {
  const queryClient = useQueryClient()
  
  // State
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState(null)

  // Fetch interviews
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'interviews', page, search, statusFilter, categoryFilter, dateFilter],
    queryFn: () => adminInterviews.getAll({
      page,
      limit: 15,
      search,
      status: statusFilter,
      category: categoryFilter,
      date: dateFilter
    }),
  })

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['admin', 'interviews', 'stats'],
    queryFn: adminInterviews.getStats,
  })

  // Fetch single interview for detail view
  const { data: interviewDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['admin', 'interview', selectedInterview?._id],
    queryFn: () => adminInterviews.getById(selectedInterview._id),
    enabled: !!selectedInterview?._id && showViewModal,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminInterviews.delete(id),
    onSuccess: () => {
      toast.success('Interview deleted')
      queryClient.invalidateQueries(['admin', 'interviews'])
      setShowDeleteModal(false)
      setSelectedInterview(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete interview')
    },
  })

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: (format) => adminInterviews.export(format, {
      status: statusFilter,
      category: categoryFilter,
      date: dateFilter
    }),
    onSuccess: (data, format) => {
      // Create download link
      const blob = new Blob(
        [format === 'json' ? JSON.stringify(data.data, null, 2) : data.data],
        { type: format === 'json' ? 'application/json' : 'text/csv' }
      )
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `interviews_export_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      toast.success(`Exported as ${format.toUpperCase()}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Export failed')
    },
  })

  const interviews = data?.data?.interviews || []
  const pagination = data?.data?.pagination || { page: 1, pages: 1, total: 0 }
  const stats = statsData?.data || {}
  const detail = interviewDetail?.data?.interview || null

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes} min`
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      'in-progress': 'warning',
      pending: 'secondary',
      cancelled: 'danger'
    }
    return colors[status] || 'secondary'
  }

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Handle view
  const handleView = (interview) => {
    setSelectedInterview(interview)
    setShowViewModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Interviews</h1>
          <p className="text-gray-600">View and manage mock interview sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            icon={Download}
            onClick={() => exportMutation.mutate('csv')}
            disabled={exportMutation.isPending}
          >
            Export CSV
          </Button>
          <Button 
            variant="secondary" 
            icon={FileText}
            onClick={() => exportMutation.mutate('json')}
            disabled={exportMutation.isPending}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total || 0}</p>
            </div>
            <Video className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Avg Score</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.averageScore || 0}%</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">This Week</p>
              <p className="text-2xl font-bold text-purple-700">{stats.thisWeek || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
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
              placeholder="Search by user name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[150px]"
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[180px]"
          >
            {CATEGORY_OPTIONS.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          />
        </div>
      </Card>

      {/* Interviews List */}
      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <LoadingCard message="Loading interviews..." />
          </div>
        ) : interviews.length === 0 ? (
          <div className="p-12 text-center">
            <Video className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No interviews found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
              <div className="col-span-3">User</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1">Score</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
              {interviews.map((interview) => (
                <div 
                  key={interview._id}
                  className="p-4 lg:px-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Desktop View */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                    {/* User */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {interview.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {interview.user?.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <Badge variant="secondary" className="text-xs">
                        {interview.category || 'General'}
                      </Badge>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-sm text-gray-600">
                      {formatDate(interview.createdAt)}
                    </div>

                    {/* Duration */}
                    <div className="col-span-1 text-sm text-gray-600">
                      {formatDuration(interview.duration)}
                    </div>

                    {/* Score */}
                    <div className="col-span-1">
                      <span className={`text-lg font-bold ${getScoreColor(interview.overallScore)}`}>
                        {interview.overallScore || 0}%
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <Badge variant={getStatusColor(interview.status)}>
                        {interview.status || 'pending'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(interview)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInterview(interview)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {interview.user?.name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {interview.user?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(interview.status)}>
                        {interview.status || 'pending'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge variant="secondary">{interview.category || 'General'}</Badge>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(interview.createdAt)}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(interview.duration)}
                      </span>
                      <span className={`font-bold ${getScoreColor(interview.overallScore)}`}>
                        {interview.overallScore || 0}%
                      </span>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(interview)}
                        className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInterview(interview)
                          setShowDeleteModal(true)
                        }}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Delete
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

      {/* View Interview Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedInterview(null)
        }}
        title="Interview Details"
        size="2xl"
      >
        {isLoadingDetail ? (
          <LoadingCard message="Loading interview details..." />
        ) : detail ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{detail.user?.name || 'Unknown User'}</h3>
                <p className="text-sm text-gray-500">{detail.user?.email || 'No email'}</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${getScoreColor(detail.overallScore)}`}>
                  {detail.overallScore || 0}%
                </p>
                <p className="text-sm text-gray-500">Overall Score</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{formatDate(detail.createdAt)}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{formatDuration(detail.duration)}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <BarChart3 className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{detail.category || 'General'}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Badge variant={getStatusColor(detail.status)} className="mx-auto mb-1">
                  {detail.status}
                </Badge>
                <p className="text-sm text-gray-500">Status</p>
              </div>
            </div>

            {/* Score Breakdown */}
            {detail.feedback && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
                <div className="space-y-3">
                  {detail.feedback.technicalAccuracy !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Technical Accuracy</span>
                        <span className="font-medium">{detail.feedback.technicalAccuracy}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${detail.feedback.technicalAccuracy}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {detail.feedback.communication !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Communication</span>
                        <span className="font-medium">{detail.feedback.communication}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${detail.feedback.communication}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {detail.feedback.problemSolving !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Problem Solving</span>
                        <span className="font-medium">{detail.feedback.problemSolving}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${detail.feedback.problemSolving}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Questions & Responses */}
            {detail.responses && detail.responses.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Questions & Responses ({detail.responses.length})
                </h4>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {detail.responses.map((response, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-gray-900 text-sm">
                          Q{index + 1}: {response.question?.text || 'Question text unavailable'}
                        </p>
                        <span className={`text-sm font-bold ${getScoreColor(response.score)}`}>
                          {response.score || 0}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {response.answer || 'No answer provided'}
                      </p>
                      {response.feedback && (
                        <p className="text-sm text-blue-600 mt-2 italic">
                          Feedback: {response.feedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Feedback */}
            {detail.aiFeedback && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI Feedback</h4>
                <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                  {detail.aiFeedback}
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              {detail.feedback?.strengths?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Strengths
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {detail.feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {detail.feedback?.areasToImprove?.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Areas to Improve
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {detail.feedback.areasToImprove.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Could not load interview details</p>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedInterview(null)
        }}
        title="Delete Interview"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Confirm deletion</p>
              <p className="text-sm text-red-600 mt-1">
                This action cannot be undone. The interview record will be permanently removed.
              </p>
            </div>
          </div>
          
          {selectedInterview && (
            <div className="text-sm text-gray-600">
              <p><strong>User:</strong> {selectedInterview.user?.name || 'Unknown'}</p>
              <p><strong>Date:</strong> {formatDate(selectedInterview.createdAt)}</p>
              <p><strong>Score:</strong> {selectedInterview.overallScore || 0}%</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedInterview(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(selectedInterview?._id)}
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

export default AdminInterviews
