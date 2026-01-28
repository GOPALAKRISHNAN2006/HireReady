/**
 * ===========================================
 * Enhanced Admin Users Page
 * ===========================================
 * 
 * Comprehensive user management page featuring:
 * - Searchable and filterable user table
 * - Role management with confirmation
 * - Block/unblock functionality
 * - User details modal with analytics
 * - Pagination support
 * - Responsive design
 */

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card, Button, Badge, Modal, Input } from '../../components/ui'
import { Spinner, LoadingCard } from '../../components/ui/Spinner'
import { adminUsers } from '../../services/adminApi'
import { 
  Users, 
  Search, 
  Shield,
  ShieldOff,
  Ban,
  CheckCircle,
  Trash2,
  Mail,
  Calendar,
  Filter,
  Eye,
  Target,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  User,
  FileText,
  X,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react'

// Debounce hook for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}

const AdminUsers = () => {
  const queryClient = useQueryClient()
  
  // State
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showActionMenu, setShowActionMenu] = useState(null)
  
  const debouncedSearch = useDebounce(search, 300)

  // Fetch users
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin', 'users', page, debouncedSearch, roleFilter, statusFilter],
    queryFn: () => adminUsers.getAll({
      page,
      limit: 15,
      search: debouncedSearch,
      role: roleFilter,
      isActive: statusFilter
    }),
  })

  // Fetch user details
  const { data: userDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['admin', 'user', selectedUser?._id],
    queryFn: () => adminUsers.getById(selectedUser._id),
    enabled: !!selectedUser?._id && showDetailsModal,
  })

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminUsers.updateRole(userId, role),
    onSuccess: (data) => {
      toast.success(data.message || 'Role updated successfully')
      queryClient.invalidateQueries(['admin', 'users'])
      setShowRoleModal(false)
      setSelectedUser(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update role')
    },
  })

  // Toggle ban mutation
  const toggleBanMutation = useMutation({
    mutationFn: (userId) => adminUsers.toggleBan(userId),
    onSuccess: (data) => {
      toast.success(data.message || 'User status updated')
      queryClient.invalidateQueries(['admin', 'users'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status')
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => adminUsers.delete(userId, false),
    onSuccess: (data) => {
      toast.success(data.message || 'User deleted')
      queryClient.invalidateQueries(['admin', 'users'])
      setShowDeleteModal(false)
      setSelectedUser(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    },
  })

  const users = data?.data?.users || []
  const pagination = data?.data?.pagination || { page: 1, pages: 1, total: 0 }

  // Helper functions
  const getRoleBadge = (role) => {
    const variants = {
      admin: { variant: 'danger', icon: Shield },
      moderator: { variant: 'warning', icon: ShieldOff },
      user: { variant: 'secondary', icon: User },
    }
    const { variant, icon: Icon } = variants[role] || variants.user
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="danger" className="flex items-center gap-1">
        <Ban className="w-3 h-3" />
        Blocked
      </Badge>
    )
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowDetailsModal(true)
    setShowActionMenu(null)
  }

  const handleRoleClick = (user) => {
    setSelectedUser(user)
    setShowRoleModal(true)
    setShowActionMenu(null)
  }

  const handleBanClick = (user) => {
    toggleBanMutation.mutate(user._id)
    setShowActionMenu(null)
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
    setShowActionMenu(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600">View, edit, and manage user accounts</p>
        </div>
        <Badge variant="primary" size="lg" className="self-start">
          <Users className="w-4 h-4 mr-1" />
          {pagination.total} Users
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[140px]"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Blocked</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <LoadingCard message="Loading users..." />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-white">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{user.interviewCount || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>
                          
                          {showActionMenu === user._id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10"
                                onClick={() => setShowActionMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                <button
                                  onClick={() => handleViewDetails(user)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleRoleClick(user)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={user.role === 'admin'}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Change Role
                                </button>
                                <button
                                  onClick={() => handleBanClick(user)}
                                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                    user.isActive ? 'text-orange-600' : 'text-green-600'
                                  }`}
                                  disabled={user.role === 'admin'}
                                >
                                  {user.isActive ? (
                                    <>
                                      <UserX className="w-4 h-4 mr-2" />
                                      Block User
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Unblock User
                                    </>
                                  )}
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleDeleteClick(user)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  disabled={user.role === 'admin'}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * 15) + 1} to {Math.min(page * 15, pagination.total)} of {pagination.total} users
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

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedUser(null)
        }}
        title="User Details"
        size="2xl"
      >
        {detailsLoading ? (
          <LoadingCard message="Loading user details..." />
        ) : userDetails?.data ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {userDetails.data.user.firstName?.charAt(0)}{userDetails.data.user.lastName?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {userDetails.data.user.firstName} {userDetails.data.user.lastName}
                </h3>
                <p className="text-gray-500">{userDetails.data.user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getRoleBadge(userDetails.data.user.role)}
                  {getStatusBadge(userDetails.data.user.isActive)}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Target className="w-6 h-6 mx-auto text-primary-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userDetails.data.stats.totalInterviews}</p>
                <p className="text-sm text-gray-500">Interviews</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userDetails.data.stats.completedInterviews}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Award className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userDetails.data.stats.averageScore}%</p>
                <p className="text-sm text-gray-500">Avg Score</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <FileText className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userDetails.data.stats.resumeCount}</p>
                <p className="text-sm text-gray-500">Resumes</p>
              </div>
            </div>

            {/* Recent Interviews */}
            {userDetails.data.recentInterviews?.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Interviews</h4>
                <div className="space-y-2">
                  {userDetails.data.recentInterviews.slice(0, 5).map((interview) => (
                    <div 
                      key={interview._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">{interview.category}</Badge>
                        <span className="text-sm text-gray-600">{interview.difficulty}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-medium ${
                          interview.overallScore >= 70 ? 'text-green-600' :
                          interview.overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(interview.overallScore)}%
                        </span>
                        <span className="text-sm text-gray-400">
                          {formatDate(interview.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Job Title</p>
                <p className="font-medium text-gray-900">{userDetails.data.user.jobTitle || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-500">Company</p>
                <p className="font-medium text-gray-900">{userDetails.data.user.company || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-500">Experience</p>
                <p className="font-medium text-gray-900">{userDetails.data.user.experience || 0} years</p>
              </div>
              <div>
                <p className="text-gray-500">Joined</p>
                <p className="font-medium text-gray-900">{formatDate(userDetails.data.user.createdAt)}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">User not found</p>
        )}
      </Modal>

      {/* Change Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false)
          setSelectedUser(null)
        }}
        title="Change User Role"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Select a new role for <span className="font-medium">{selectedUser?.firstName} {selectedUser?.lastName}</span>
          </p>
          
          <div className="space-y-2">
            {['user', 'moderator', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => updateRoleMutation.mutate({ userId: selectedUser?._id, role })}
                disabled={updateRoleMutation.isPending}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedUser?.role === role 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {role === 'admin' && <Shield className="w-5 h-5 text-red-500" />}
                    {role === 'moderator' && <ShieldOff className="w-5 h-5 text-yellow-500" />}
                    {role === 'user' && <User className="w-5 h-5 text-gray-500" />}
                    <span className="font-medium capitalize">{role}</span>
                  </div>
                  {selectedUser?.role === role && (
                    <Badge variant="success">Current</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">This action cannot be undone</p>
              <p className="text-sm text-red-600 mt-1">
                User "{selectedUser?.firstName} {selectedUser?.lastName}" will be deactivated and their email will be scrambled.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteUserMutation.mutate(selectedUser?._id)}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminUsers
