import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
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
  Upload,
  X,
  Plus
} from 'lucide-react'

const Profile = () => {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()
  const settingsStore = useSettingsStore()
  const [activeTab, setActiveTab] = useState('profile')
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState(user?.skills || [])
  
  // Fetch fresh profile data from API
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/users/profile')
      return response.data?.data || response.data
    },
    staleTime: 30000,
    retry: 2,
  })

  // The resolved user: prefer fresh API data, fallback to auth store
  const resolvedUser = profileData?.user || user

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    jobTitle: '',
    company: '',
    experience: '',
    targetRole: '',
  })

  // Sync form data when fresh profile data arrives
  useEffect(() => {
    const source = profileData?.user || user
    if (source) {
      setFormData({
        firstName: source.firstName || '',
        lastName: source.lastName || '',
        email: source.email || '',
        phone: source.phone || '',
        bio: source.bio || '',
        jobTitle: source.jobTitle || '',
        company: source.company || '',
        experience: source.experience != null ? String(source.experience) : '',
        targetRole: source.targetRole || '',
      })
      setSkills(source.skills || [])
    }
  }, [profileData]) // Only re-run when API data changes, not on every store update

  // Sync auth store when profileData arrives (separate effect to avoid loop)
  useEffect(() => {
    if (profileData?.user) {
      updateUser(profileData.user)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData])

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
      const updatedUser = data.data?.user || data.user
      updateUser(updatedUser)
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
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
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
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
      skills,
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
      confirmPassword: passwordData.confirmPassword,
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ]

  if (profileLoading && !user) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <LoadingCard count={3} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Gradient Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl overflow-hidden">
        {/* Decorative blur circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-300/10 rounded-full blur-2xl" />

        <div className="relative px-8 pt-10 pb-20">
          <div className="flex items-center gap-2">
            <Badge variant={resolvedUser?.role === 'admin' ? 'primary' : 'success'} className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {resolvedUser?.role === 'admin' ? 'Administrator' : 'Member'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Avatar + Info overlapping the banner */}
      <div className="relative -mt-16 ml-8 flex items-end gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-lg">
            {resolvedUser?.avatar && resolvedUser.avatar !== 'default-avatar.png' && resolvedUser.avatar.startsWith('http') ? (
              <img 
                src={resolvedUser.avatar} 
                alt={`${resolvedUser?.firstName} ${resolvedUser?.lastName}`} 
                className="w-28 h-28 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<span class="text-4xl font-bold text-indigo-600">${resolvedUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>`
                }}
              />
            ) : (
              <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {resolvedUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
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
            className="absolute bottom-1 right-1 w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 ring-2 ring-white dark:ring-slate-900 shadow-md"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="pb-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{resolvedUser?.firstName} {resolvedUser?.lastName}</h1>
          <p className="text-slate-500 dark:text-slate-400">{resolvedUser?.email}</p>
          {resolvedUser?.jobTitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{resolvedUser.jobTitle}{resolvedUser.company ? ` at ${resolvedUser.company}` : ''}</p>
          )}
        </div>
      </div>

      {/* Pill / Segment Tabs */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 overflow-x-auto">
        <nav className="flex gap-1 min-w-max sm:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 flex-none sm:flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 shadow-sm font-semibold text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <Card.Title>Personal Information</Card.Title>
                <Card.Description>Update your personal details</Card.Description>
              </div>
            </div>
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Skills Tag Editor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                        className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && skillInput.trim()) {
                        e.preventDefault()
                        if (!skills.includes(skillInput.trim())) {
                          setSkills([...skills, skillInput.trim()])
                        }
                        setSkillInput('')
                      }
                    }}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-colors"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={Plus}
                    onClick={() => {
                      if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                        setSkills([...skills, skillInput.trim()])
                        setSkillInput('')
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">e.g. JavaScript, React, Node.js, Python</p>
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
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <Card.Title>Change Password</Card.Title>
                <Card.Description>Update your password to keep your account secure</Card.Description>
              </div>
            </div>
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
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <Card.Title>Notification Settings</Card.Title>
                <Card.Description>Manage how you receive notifications</Card.Description>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email notifications', description: 'Receive email updates about your progress' },
                { key: 'interviewReminders', label: 'Interview reminders', description: 'Get reminded about scheduled practice sessions' },
                { key: 'weeklyReport', label: 'Weekly reports', description: 'Receive weekly performance summaries' },
                { key: 'marketingEmails', label: 'Tips and recommendations', description: 'Get personalized improvement tips' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{item.label}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                  <button
                    onClick={() => settingsStore.updateSetting(item.key, !settingsStore[item.key])}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      settingsStore[item.key] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settingsStore[item.key] ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <Card.Title>Preferences</Card.Title>
                <Card.Description>Customize your experience</Card.Description>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Difficulty</label>
                <div className="flex gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => settingsStore.updateSetting('defaultDifficulty', level)}
                      className={`px-4 py-2 rounded-xl font-medium capitalize transition-colors ${
                        settingsStore.defaultDifficulty === level
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Categories</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'dsa', label: 'DSA' },
                    { key: 'web', label: 'Web Dev' },
                    { key: 'system-design', label: 'System Design' },
                    { key: 'behavioral', label: 'Behavioral' },
                    { key: 'database', label: 'Database' },
                    { key: 'ml', label: 'ML/AI' },
                  ].map((cat) => {
                    const preferredCats = settingsStore.preferredCategories || ['dsa', 'web', 'behavioral']
                    const isSelected = preferredCats.includes(cat.key)
                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          const updated = isSelected
                            ? preferredCats.filter(c => c !== cat.key)
                            : [...preferredCats, cat.key]
                          settingsStore.updateSetting('preferredCategories', updated)
                        }}
                      >
                        <Badge 
                          variant={isSelected ? 'primary' : 'default'}
                          className="cursor-pointer"
                        >
                          {cat.label}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => settingsStore.setTheme('light')}
                    className={`w-12 h-12 bg-white border-2 ${settingsStore.theme === 'light' ? 'border-indigo-500' : 'border-slate-200'} rounded-xl flex items-center justify-center transition-colors`}
                  >
                    ☀️
                  </button>
                  <button 
                    onClick={() => settingsStore.setTheme('dark')}
                    className={`w-12 h-12 bg-slate-800 border-2 ${settingsStore.theme === 'dark' ? 'border-indigo-500' : 'border-transparent'} rounded-xl flex items-center justify-center transition-colors`}
                  >
                    🌙
                  </button>
                  <button 
                    onClick={() => settingsStore.setTheme('system')}
                    className={`w-12 h-12 bg-gradient-to-r from-white to-slate-800 border-2 ${settingsStore.theme === 'system' ? 'border-indigo-500' : 'border-transparent'} rounded-xl flex items-center justify-center transition-colors`}
                  >
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
