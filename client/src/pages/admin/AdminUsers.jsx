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
  Eye
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600">View and manage all registered users</p>
        </div>
        <Badge variant="primary" size="lg">
          {data?.pagination?.total || data?.users?.length || 0} Users
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="p-6">
            <LoadingCard message="Loading users..." />
          </div>
        ) : (
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
                {data?.users?.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                          {user.avatar && user.avatar !== 'default-avatar.png' ? (
                            <img 
                              src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <span className="text-sm font-medium text-primary-600">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Banned'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.interviewCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          icon={Eye}
                          title="View Details"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowRoleModal(true)
                          }}
                          icon={Shield}
                          title="Change Role"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => banUserMutation.mutate(user._id)}
                          icon={Ban}
                          title="Ban/Unban"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteModal(true)
                          }}
                          icon={Trash2}
                          className="text-red-600 hover:bg-red-50"
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

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
          <p className="text-gray-600">
            Change role for <span className="font-medium">{selectedUser?.name}</span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleRoleChange('user')}
              className={`flex-1 p-4 rounded-xl border-2 ${
                selectedUser?.role === 'user'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">User</p>
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 p-4 rounded-xl border-2 ${
                selectedUser?.role === 'admin'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Admin</p>
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
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-medium text-red-600">{selectedUser?.name}</span>?
            This action cannot be undone.
          </p>
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
