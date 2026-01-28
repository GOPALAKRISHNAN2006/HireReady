import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun,
  Globe,
  Shield,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Clock,
  Save,
  ChevronRight
} from 'lucide-react'

const Settings = () => {
  const { user, logout } = useAuthStore()
  const settingsStore = useSettingsStore()
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    // Appearance
    theme: settingsStore.theme,
    fontSize: settingsStore.fontSize,
    reducedMotion: settingsStore.reducedMotion,
    
    // Notifications
    emailNotifications: settingsStore.emailNotifications,
    pushNotifications: settingsStore.pushNotifications,
    interviewReminders: settingsStore.interviewReminders,
    weeklyReport: settingsStore.weeklyReport,
    marketingEmails: settingsStore.marketingEmails,
    
    // Privacy
    profileVisibility: settingsStore.profileVisibility,
    showOnLeaderboard: settingsStore.showOnLeaderboard,
    shareProgress: settingsStore.shareProgress,
    
    // Interview Preferences
    defaultDifficulty: settingsStore.defaultDifficulty,
    defaultDuration: settingsStore.defaultDuration,
    autoSaveAnswers: settingsStore.autoSaveAnswers,
    showHints: settingsStore.showHints,
    soundEnabled: settingsStore.soundEnabled,
    
    // Language & Region
    language: settingsStore.language,
    timezone: settingsStore.timezone,
  })

  // Sync with store on mount
  useEffect(() => {
    setSettings({
      theme: settingsStore.theme,
      fontSize: settingsStore.fontSize,
      reducedMotion: settingsStore.reducedMotion,
      emailNotifications: settingsStore.emailNotifications,
      pushNotifications: settingsStore.pushNotifications,
      interviewReminders: settingsStore.interviewReminders,
      weeklyReport: settingsStore.weeklyReport,
      marketingEmails: settingsStore.marketingEmails,
      profileVisibility: settingsStore.profileVisibility,
      showOnLeaderboard: settingsStore.showOnLeaderboard,
      shareProgress: settingsStore.shareProgress,
      defaultDifficulty: settingsStore.defaultDifficulty,
      defaultDuration: settingsStore.defaultDuration,
      autoSaveAnswers: settingsStore.autoSaveAnswers,
      showHints: settingsStore.showHints,
      soundEnabled: settingsStore.soundEnabled,
      language: settingsStore.language,
      timezone: settingsStore.timezone,
    })
  }, [])

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    // Apply setting immediately through store
    settingsStore.updateSetting(key, value)
  }

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData) => {
      // Save to localStorage
      localStorage.setItem('user-settings', JSON.stringify(settingsData))
      // Save preferences to backend
      const response = await api.put('/users/preferences', { preferences: settingsData })
      return response.data
    },
    onSuccess: () => {
      toast.success('Settings saved successfully!')
    },
    onError: (error) => {
      // Still save to localStorage even if backend fails
      localStorage.setItem('user-settings', JSON.stringify(settings))
      toast.success('Settings saved locally!')
    }
  })

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await saveSettingsMutation.mutateAsync(settings)
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await api.get('/users/export-data', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `interview-portal-data-${Date.now()}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Data exported successfully!')
    } catch (error) {
      // Fallback: export from localStorage
      const data = {
        settings,
        user: user,
        exportedAt: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `interview-portal-data-${Date.now()}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Data exported!')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmText = prompt('Type "DELETE" to confirm account deletion:')
    if (confirmText !== 'DELETE') {
      toast.error('Account deletion cancelled')
      return
    }
    
    try {
      await api.delete('/users/account')
      toast.success('Account deleted successfully')
      logout()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="w-7 h-7 mr-3 text-primary-600" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Appearance */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-purple-600" />
            Appearance
          </Card.Title>
          <Card.Description>Customize how the app looks</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Theme</p>
                <p className="text-sm text-gray-500">Choose your preferred color scheme</p>
              </div>
              <div className="flex space-x-2">
                {[
                  { value: 'light', icon: Sun, label: 'Light' },
                  { value: 'dark', icon: Moon, label: 'Dark' },
                  { value: 'system', icon: Monitor, label: 'System' },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange('theme', theme.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      settings.theme === theme.value
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <theme.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Font Size</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the text size</p>
              </div>
              <select
                value={settings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Reduced Motion</p>
                <p className="text-sm text-gray-500">Minimize animations</p>
              </div>
              <button
                onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.reducedMotion ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.reducedMotion ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Notifications
          </Card.Title>
          <Card.Description>Configure how you receive notifications</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'pushNotifications', icon: Bell, label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'interviewReminders', icon: Clock, label: 'Interview Reminders', desc: 'Get reminded about scheduled practices' },
              { key: 'weeklyReport', icon: MessageSquare, label: 'Weekly Progress Report', desc: 'Receive weekly summary of your progress' },
              { key: 'marketingEmails', icon: Mail, label: 'Marketing Emails', desc: 'Tips, offers, and updates' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingChange(item.key, !settings[item.key])}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings[item.key] ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[item.key] ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Privacy */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Privacy
          </Card.Title>
          <Card.Description>Control your privacy settings</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  {settings.profileVisibility === 'public' ? (
                    <Eye className="w-5 h-5 text-gray-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Profile Visibility</p>
                  <p className="text-sm text-gray-500">Who can see your profile</p>
                </div>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            {[
              { key: 'showOnLeaderboard', label: 'Show on Leaderboard', desc: 'Appear in public rankings' },
              { key: 'shareProgress', label: 'Share Progress', desc: 'Allow others to see your progress' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleSettingChange(item.key, !settings[item.key])}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings[item.key] ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[item.key] ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Interview Preferences */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
            Interview Preferences
          </Card.Title>
          <Card.Description>Customize your interview experience</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Default Difficulty</p>
                <p className="text-sm text-gray-500">Your preferred difficulty level</p>
              </div>
              <select
                value={settings.defaultDifficulty}
                onChange={(e) => handleSettingChange('defaultDifficulty', e.target.value)}
                className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Default Duration</p>
                <p className="text-sm text-gray-500">Preferred interview length</p>
              </div>
              <select
                value={settings.defaultDuration}
                onChange={(e) => handleSettingChange('defaultDuration', parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            {[
              { key: 'autoSaveAnswers', icon: Save, label: 'Auto-save Answers', desc: 'Automatically save your responses' },
              { key: 'showHints', icon: Eye, label: 'Show Hints', desc: 'Display helpful hints during interviews' },
              { key: 'soundEnabled', icon: settings.soundEnabled ? Volume2 : VolumeX, label: 'Sound Effects', desc: 'Play sounds for notifications' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingChange(item.key, !settings[item.key])}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings[item.key] ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[item.key] ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Language & Region */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-cyan-600" />
            Language & Region
          </Card.Title>
          <Card.Description>Set your language and timezone</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-700 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="hi">हिंदी</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-700 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">GMT/UTC</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Data & Account */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center text-red-600">
            <Trash2 className="w-5 h-5 mr-2" />
            Data & Account
          </Card.Title>
          <Card.Description>Manage your data and account</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Export Your Data</p>
                  <p className="text-sm text-gray-500">Download all your data in JSON format</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </Card.Content>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} icon={Save} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings
