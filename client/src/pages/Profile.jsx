import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { Card, Button, Input, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Save,
  Camera,
  Shield,
  Bell,
  Palette,
  Upload
} from 'lucide-react'

const Profile = () => {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    jobTitle: user?.jobTitle || '',
    company: user?.company || '',
    experience: user?.experience || '',
    targetRole: user?.targetRole || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/users/profile', data)
      return response.data
    },
    onSuccess: (data) => {
      updateUser(data.data?.user || data.user)
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })

  // Avatar upload handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response = await api.put('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Update user in auth store with new avatar
      const newAvatarUrl = response.data.data?.avatar || response.data.avatar
      updateUser({ ...user, avatar: newAvatarUrl })
      toast.success('Avatar updated successfully!')
      queryClient.invalidateQueries(['user'])
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/auth/change-password', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password')
    },
  })

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    
    // Prepare data, converting experience to number if present
    const dataToSend = {
      ...formData,
      experience: formData.experience ? parseInt(formData.experience, 10) : undefined,
    }
    
    // Remove empty/undefined fields
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === '' || dataToSend[key] === undefined) {
        delete dataToSend[key]
      }
    })
    
    updateProfileMutation.mutate(dataToSend)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar && user.avatar !== 'default-avatar.png' ? (
              <img 
                src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                alt={`${user?.firstName} ${user?.lastName}`} 
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
          <p className="text-gray-500">{user?.email}</p>
          <Badge variant={user?.role === 'admin' ? 'primary' : 'success'} className="mt-1">
            {user?.role === 'admin' ? 'Administrator' : 'Member'}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <Card>
          <Card.Header>
            <Card.Title>Personal Information</Card.Title>
            <Card.Description>Update your personal details</Card.Description>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  icon={User}
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  icon={User}
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  disabled
                  helperText="Email cannot be changed"
                />
                <Input
                  label="Phone Number"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                />
                <Input
                  label="Job Title"
                  icon={Briefcase}
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="Software Engineer"
                />
                <Input
                  label="Company"
                  icon={Briefcase}
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Tech Company Inc."
                />
                <Input
                  label="Years of Experience"
                  type="number"
                  min="0"
                  max="50"
                  icon={GraduationCap}
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="3"
                />
                <Input
                  label="Target Role"
                  icon={Briefcase}
                  value={formData.targetRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                  placeholder="Senior Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  icon={Save}
                  isLoading={updateProfileMutation.isPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <Card.Header>
            <Card.Title>Change Password</Card.Title>
            <Card.Description>Update your password to keep your account secure</Card.Description>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                helperText="Must be at least 8 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              
              <Button 
                type="submit" 
                icon={Shield}
                isLoading={changePasswordMutation.isPending}
              >
                Update Password
              </Button>
            </form>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <Card.Header>
            <Card.Title>Notification Settings</Card.Title>
            <Card.Description>Manage how you receive notifications</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {[
                { label: 'Email notifications', description: 'Receive email updates about your progress', enabled: true },
                { label: 'Interview reminders', description: 'Get reminded about scheduled practice sessions', enabled: true },
                { label: 'Weekly reports', description: 'Receive weekly performance summaries', enabled: false },
                { label: 'Tips and recommendations', description: 'Get personalized improvement tips', enabled: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card>
          <Card.Header>
            <Card.Title>Preferences</Card.Title>
            <Card.Description>Customize your experience</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Difficulty</label>
                <div className="flex gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      className={`px-4 py-2 rounded-lg font-medium capitalize ${
                        level === 'medium'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Categories</label>
                <div className="flex flex-wrap gap-2">
                  {['DSA', 'Web Dev', 'System Design', 'Behavioral', 'Database', 'ML/AI'].map((cat) => (
                    <Badge 
                      key={cat} 
                      variant={['DSA', 'Web Dev', 'Behavioral'].includes(cat) ? 'primary' : 'default'}
                      className="cursor-pointer"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex gap-3">
                  <button className="w-12 h-12 bg-white border-2 border-primary-500 rounded-lg flex items-center justify-center">
                    ☀️
                  </button>
                  <button className="w-12 h-12 bg-gray-800 border-2 border-transparent rounded-lg flex items-center justify-center">
                    🌙
                  </button>
                  <button className="w-12 h-12 bg-gradient-to-r from-white to-gray-800 border-2 border-transparent rounded-lg flex items-center justify-center">
                    🔄
                  </button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

export default Profile
