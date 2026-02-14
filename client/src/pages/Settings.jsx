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

    const password = prompt('Enter your password to confirm:')
    if (!password) {
      toast.error('Password is required to delete account')
      return
    }
    
    try {
      await api.delete('/users/account', { data: { password, confirmation: 'DELETE' } })
      toast.success('Account deleted successfully')
      logout()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-900 rounded-3xl p-8 text-white">
        {/* Decorative blur circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        {/* Big background icon */}
        <SettingsIcon className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white/[0.06]" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <SettingsIcon className="w-8 h-8 mr-3 text-indigo-400" />
              Settings
            </h1>
            <p className="text-slate-300 mt-1">Manage your account preferences and settings</p>
          </div>
          <Button onClick={handleSaveSettings} icon={Save} size="lg" className="shrink-0">
            Save Settings
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Appearance</h3>
                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">Customize how the app looks</p>
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Theme</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred color scheme</p>
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${
                      settings.theme === theme.value
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <theme.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Font Size</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adjust the text size</p>
              </div>
              <select
                value={settings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Reduced Motion</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Minimize animations</p>
              </div>
              <button
                onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.reducedMotion ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">Configure how you receive notifications</p>
              </div>
            </div>
          </Card.Title>
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
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingChange(item.key, !settings[item.key])}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[item.key] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-0.5'
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
          <Card.Title>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Privacy</h3>
                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">Control your privacy settings</p>
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                  {settings.profileVisibility === 'public' ? (
                    <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Profile Visibility</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Who can see your profile</p>
                </div>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleSettingChange(item.key, !settings[item.key])}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[item.key] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-0.5'
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
          <Card.Title>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Interview Preferences</h3>
                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">Customize your interview experience</p>
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Default Difficulty</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your preferred difficulty level</p>
              </div>
              <select
                value={settings.defaultDifficulty}
                onChange={(e) => handleSettingChange('defaultDifficulty', e.target.value)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Default Duration</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Preferred interview length</p>
              </div>
              <select
                value={settings.defaultDuration}
                onChange={(e) => handleSettingChange('defaultDuration', parseInt(e.target.value))}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingChange(item.key, !settings[item.key])}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[item.key] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-0.5'
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
          <Card.Title>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Language & Region</h3>
                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">Set your language and timezone</p>
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
          <Card.Title>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500/10 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-red-600">Data & Account</h3>
                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">Manage your data and account</p>
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white">Export Your Data</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Download all your data in JSON format</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div className="text-left">
                  <p className="font-medium text-red-900 dark:text-red-300">Delete Account</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </Card.Content>
      </Card>

      {/* Sticky bottom Save Button */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button onClick={handleSaveSettings} icon={Save} size="lg" className="shadow-lg shadow-indigo-500/25">
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings
