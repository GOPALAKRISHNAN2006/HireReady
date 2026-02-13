import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card, Button, Badge, Modal } from '../../components/ui'
import { LoadingCard } from '../../components/ui/Spinner'
import api from '../../services/api'
import { 
  Users, 
  Search, 
  Shield, 
  Ban,
  Trash2,
  Mail,
  Calendar,
  Eye,
  Filter,
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react'

const AdminUsers = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (roleFilter) params.append('role', roleFilter)
      
      const response = await api.get(`/admin/users?${params.toString()}`)
      return response.data?.data || response.data
    },
  })

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await api.put(`/admin/users/${userId}/role`, { role })
      return response.data
    },
    onSuccess: () => {
      toast.success('User role updated')
      queryClient.invalidateQueries(['admin', 'users'])
      setShowRoleModal(false)
      setSelectedUser(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update role')
    },
  })

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await api.put(`/admin/users/${userId}/ban`)
      return response.data
    },
    onSuccess: () => {
      toast.success('User status updated')
      queryClient.invalidateQueries(['admin', 'users'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user status')
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await api.delete(`/admin/users/${userId}`)
      return response.data
    },
    onSuccess: () => {
      toast.success('User deleted')
      queryClient.invalidateQueries(['admin', 'users'])
      setShowDeleteModal(false)
      setSelectedUser(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    },
  })

  const handleRoleChange = (role) => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser._id, role })
    }
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser._id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Users</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{data?.pagination?.total || data?.users?.length || 0} Users</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingCard message="Loading users..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data?.users?.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                          {user.avatar && user.avatar !== 'default-avatar.png' ? (
                            <img 
                              src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-xl object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <span className="text-sm font-semibold text-white">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30' 
                          : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        user.isActive 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-100 dark:border-rose-800/30'
                      }`}>
                        {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {user.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.interviewCount || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setShowRoleModal(true) }}
                          className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                          title="Change Role"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => banUserMutation.mutate(user._id)}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          title="Ban/Unban"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setShowDeleteModal(true) }}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false)
          setSelectedUser(null)
        }}
        title="Change User Role"
      >
        <div className="space-y-4">
          <p className="text-slate-500 dark:text-slate-400">
            Change role for <span className="font-semibold text-slate-900 dark:text-white">{selectedUser?.name}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleRoleChange('user')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                selectedUser?.role === 'user'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Users className={`w-6 h-6 mx-auto mb-2 ${selectedUser?.role === 'user' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <p className={`font-semibold ${selectedUser?.role === 'user' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>User</p>
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                selectedUser?.role === 'admin'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Shield className={`w-6 h-6 mx-auto mb-2 ${selectedUser?.role === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <p className={`font-semibold ${selectedUser?.role === 'admin' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>Admin</p>
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        title="Delete User"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/30">
            <Trash2 className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <span className="font-semibold text-rose-600 dark:text-rose-400">{selectedUser?.name}</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteUser}
            isLoading={deleteUserMutation.isPending}
          >
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminUsers
