/**
 * ===========================================
 * Admin Settings Page
 * ===========================================
 * 
 * System configuration page for administrators:
 * - Site settings
 * - Feature toggles
 * - API configuration
 * - Security settings
 * - Notification preferences
 */

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card, Button, Badge } from '../../components/ui'
import { LoadingCard } from '../../components/ui/Spinner'
import api from '../../services/api'
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Globe,
  Zap,
  Database,
  Lock,
  Mail,
  MessageSquare,
  Users,
  FileText,
  AlertTriangle,
  Check,
  Info
} from 'lucide-react'

// Default settings structure
const defaultSettings = {
  site: {
    name: 'HireReady',
    tagline: 'Prepare smarter, interview better',
    maintenanceMode: false,
    allowRegistration: true
  },
  features: {
    aiInterviews: true,
    aptitudeTests: true,
    groupDiscussions: true,
    resumeBuilder: true,
    videoInterviews: false,
    codeEditor: true
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeoutMinutes: 60,
    requireEmailVerification: true,
    twoFactorEnabled: false,
    passwordMinLength: 8
  },
  interviews: {
    maxQuestionsPerSession: 10,
    defaultDurationMinutes: 30,
    allowRetakes: true,
    cooldownHours: 24,
    showAIFeedback: true
  },
  api: {
    rateLimit: 100,
    rateLimitWindowMinutes: 15,
    enableLogging: true,
    logLevel: 'info'
  },
  notifications: {
    emailNotifications: true,
    interviewReminders: true,
    weeklyDigest: true,
    marketingEmails: false
  }
}

const AdminSettings = () => {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('site')

  // Fetch current settings
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/settings')
        return response.data
      } catch (error) {
        // If endpoint doesn't exist, return defaults
        if (error.response?.status === 404) {
          return { data: defaultSettings }
        }
        throw error
      }
    },
  })

  // Update settings when data loads
  useEffect(() => {
    if (data?.data) {
      setSettings({ ...defaultSettings, ...data.data })
    }
  }, [data])

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      const response = await api.put('/admin/settings', newSettings)
      return response.data
    },
    onSuccess: () => {
      toast.success('Settings saved successfully')
      setHasChanges(false)
      queryClient.invalidateQueries(['admin', 'settings'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    },
  })

  // Handle setting change
  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  // Toggle component
  const Toggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  // Input component
  const NumberInput = ({ value, onChange, label, description, min, max }) => (
    <div className="py-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          min={min}
          max={max}
          className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
      </div>
    </div>
  )

  // Select component
  const SelectInput = ({ value, onChange, label, description, options }) => (
    <div className="py-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer transition-all"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )

  // Tab configuration
  const tabs = [
    { id: 'site', label: 'Site', icon: Globe },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'interviews', label: 'Interviews', icon: MessageSquare },
    { id: 'api', label: 'API', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure system settings</p>
        </div>
        <LoadingCard message="Loading settings..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure system settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={() => refetch()}
          >
            Reset
          </Button>
          <Button
            icon={Save}
            onClick={() => saveMutation.mutate(settings)}
            disabled={!hasChanges || saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Unsaved changes alert */}
      {hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">You have unsaved changes</p>
        </div>
      )}

      {/* Settings content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm lg:col-span-1 h-fit p-3">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm lg:col-span-3 p-6">
          {/* Site Settings */}
          {activeTab === 'site' && (
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Site Settings
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">General website configuration</p>
              </div>

              <div className="py-3.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Site Name</label>
                <input
                  type="text"
                  value={settings.site.name}
                  onChange={(e) => handleChange('site', 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="py-3.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={settings.site.tagline}
                  onChange={(e) => handleChange('site', 'tagline', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <Toggle
                checked={settings.site.allowRegistration}
                onChange={(val) => handleChange('site', 'allowRegistration', val)}
                label="Allow Registration"
                description="Enable new user registration"
              />

              <Toggle
                checked={settings.site.maintenanceMode}
                onChange={(val) => handleChange('site', 'maintenanceMode', val)}
                label="Maintenance Mode"
                description="Show maintenance page to non-admin users"
              />
            </div>
          )}

          {/* Features Settings */}
          {activeTab === 'features' && (
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Feature Toggles
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enable or disable platform features</p>
              </div>

              <Toggle
                checked={settings.features.aiInterviews}
                onChange={(val) => handleChange('features', 'aiInterviews', val)}
                label="AI Interviews"
                description="AI-powered mock interview sessions"
              />

              <Toggle
                checked={settings.features.aptitudeTests}
                onChange={(val) => handleChange('features', 'aptitudeTests', val)}
                label="Aptitude Tests"
                description="Aptitude and reasoning tests"
              />

              <Toggle
                checked={settings.features.groupDiscussions}
                onChange={(val) => handleChange('features', 'groupDiscussions', val)}
                label="Group Discussions"
                description="Group discussion practice sessions"
              />

              <Toggle
                checked={settings.features.resumeBuilder}
                onChange={(val) => handleChange('features', 'resumeBuilder', val)}
                label="Resume Builder"
                description="AI-assisted resume creation tool"
              />

              <Toggle
                checked={settings.features.codeEditor}
                onChange={(val) => handleChange('features', 'codeEditor', val)}
                label="Code Editor"
                description="Integrated code editor for coding interviews"
              />

              <Toggle
                checked={settings.features.videoInterviews}
                onChange={(val) => handleChange('features', 'videoInterviews', val)}
                label="Video Interviews"
                description="Video recording during interviews (Beta)"
              />
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Security Settings
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authentication and security configuration</p>
              </div>

              <NumberInput
                value={settings.security.maxLoginAttempts}
                onChange={(val) => handleChange('security', 'maxLoginAttempts', val)}
                label="Max Login Attempts"
                description="Lock account after failed attempts"
                min={3}
                max={10}
              />

              <NumberInput
                value={settings.security.sessionTimeoutMinutes}
                onChange={(val) => handleChange('security', 'sessionTimeoutMinutes', val)}
                label="Session Timeout (minutes)"
                description="Automatic logout after inactivity"
                min={15}
                max={480}
              />

              <NumberInput
                value={settings.security.passwordMinLength}
                onChange={(val) => handleChange('security', 'passwordMinLength', val)}
                label="Minimum Password Length"
                description="Required password length"
                min={6}
                max={20}
              />

              <Toggle
                checked={settings.security.requireEmailVerification}
                onChange={(val) => handleChange('security', 'requireEmailVerification', val)}
                label="Require Email Verification"
                description="Users must verify email before access"
              />

              <Toggle
                checked={settings.security.twoFactorEnabled}
                onChange={(val) => handleChange('security', 'twoFactorEnabled', val)}
                label="Two-Factor Authentication"
                description="Enable 2FA for all users"
              />
            </div>
          )}

          {/* Interview Settings */}
          {activeTab === 'interviews' && (
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Interview Settings
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure mock interview behavior</p>
              </div>

              <NumberInput
                value={settings.interviews.maxQuestionsPerSession}
                onChange={(val) => handleChange('interviews', 'maxQuestionsPerSession', val)}
                label="Max Questions per Session"
                description="Maximum questions in one interview"
                min={3}
                max={20}
              />

              <NumberInput
                value={settings.interviews.defaultDurationMinutes}
                onChange={(val) => handleChange('interviews', 'defaultDurationMinutes', val)}
                label="Default Duration (minutes)"
                description="Default interview time limit"
                min={10}
                max={120}
              />

              <NumberInput
                value={settings.interviews.cooldownHours}
                onChange={(val) => handleChange('interviews', 'cooldownHours', val)}
                label="Retake Cooldown (hours)"
                description="Wait time before retaking same category"
                min={0}
                max={168}
              />

              <Toggle
                checked={settings.interviews.allowRetakes}
                onChange={(val) => handleChange('interviews', 'allowRetakes', val)}
                label="Allow Retakes"
                description="Let users retry interview categories"
              />

              <Toggle
                checked={settings.interviews.showAIFeedback}
                onChange={(val) => handleChange('interviews', 'showAIFeedback', val)}
                label="Show AI Feedback"
                description="Display AI-generated feedback to users"
              />
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  API Configuration
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Rate limiting and logging settings</p>
              </div>

              <NumberInput
                value={settings.api.rateLimit}
                onChange={(val) => handleChange('api', 'rateLimit', val)}
                label="Rate Limit"
                description="Max requests per window"
                min={10}
                max={1000}
              />

              <NumberInput
                value={settings.api.rateLimitWindowMinutes}
                onChange={(val) => handleChange('api', 'rateLimitWindowMinutes', val)}
                label="Rate Limit Window (minutes)"
                description="Time window for rate limiting"
                min={1}
                max={60}
              />

              <SelectInput
                value={settings.api.logLevel}
                onChange={(val) => handleChange('api', 'logLevel', val)}
                label="Log Level"
                description="Minimum log level to capture"
                options={[
                  { value: 'debug', label: 'Debug' },
                  { value: 'info', label: 'Info' },
                  { value: 'warn', label: 'Warning' },
                  { value: 'error', label: 'Error' }
                ]}
              />

              <Toggle
                checked={settings.api.enableLogging}
                onChange={(val) => handleChange('api', 'enableLogging', val)}
                label="Enable API Logging"
                description="Log all API requests"
              />
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Notification Settings
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Email and notification preferences</p>
              </div>

              <Toggle
                checked={settings.notifications.emailNotifications}
                onChange={(val) => handleChange('notifications', 'emailNotifications', val)}
                label="Email Notifications"
                description="Send email notifications to users"
              />

              <Toggle
                checked={settings.notifications.interviewReminders}
                onChange={(val) => handleChange('notifications', 'interviewReminders', val)}
                label="Interview Reminders"
                description="Send practice reminders"
              />

              <Toggle
                checked={settings.notifications.weeklyDigest}
                onChange={(val) => handleChange('notifications', 'weeklyDigest', val)}
                label="Weekly Digest"
                description="Send weekly progress summary"
              />

              <Toggle
                checked={settings.notifications.marketingEmails}
                onChange={(val) => handleChange('notifications', 'marketingEmails', val)}
                label="Marketing Emails"
                description="Send promotional content"
              />
            </div>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">Configuration Notes</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 mt-1.5 space-y-1">
              <li>• Changes take effect immediately after saving</li>
              <li>• Security settings may require users to re-authenticate</li>
              <li>• Disabling features will hide them from the user interface</li>
              <li>• Contact support for advanced configuration options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
