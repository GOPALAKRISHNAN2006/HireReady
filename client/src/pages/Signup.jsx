import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button, Input } from '../components/ui'
import { Mail, Lock, User, Loader2, Sparkles, Shield, Zap, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const Signup = () => {
  const { register, setUser, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [googleLoading, setGoogleLoading] = useState(false)

  // Initialize Google Sign-In
  useEffect(() => {
    if (GOOGLE_CLIENT_ID && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      })
    }
  }, [])

  const handleGoogleCallback = async (response) => {
    setGoogleLoading(true)
    try {
      const result = await api.post('/auth/google', {
        credential: response.credential,
        clientId: GOOGLE_CLIENT_ID
      })
      
      if (result.data.success) {
        const { user, tokens } = result.data.data
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        setUser(user)
        toast.success(result.data.message)
        window.location.href = '/dashboard'
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google sign-up failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error('Google Sign-In not configured. Please use email/password registration.')
      return
    }
    
    if (window.google) {
      window.google.accounts.id.prompt()
    } else {
      toast.error('Google Sign-In not available. Please try again.')
    }
  }
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    })
  }

  return (
    <div className="animate-in">
      {/* Logo for mobile */}
      <div className="lg:hidden mb-8 text-center">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">HireReady</span>
        </Link>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-full text-xs font-medium text-green-600 dark:text-green-400 mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Join 10,000+ learners
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Start your journey to interview success</p>
      </div>

      {/* Perks strip */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          <span>Free forever</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span>No credit card</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Instant access</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="John"
            icon={User}
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            autoComplete="given-name"
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Doe"
            icon={User}
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText="Must be at least 8 characters with uppercase, lowercase, and number"
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="pt-2">
          <label className="flex items-start">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</Link>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          className="mt-6"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500 dark:text-gray-400">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleGoogleSignup}
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-500" />
            ) : (
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Sign in →
          </Link>
        </p>
      </div>

      {/* What you'll get */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center mb-3">What you'll get</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '🎯', label: 'Mock Interviews' },
            { emoji: '🤖', label: 'AI Feedback' },
            { emoji: '📊', label: 'Analytics' },
            { emoji: '🏆', label: 'Achievements' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-base">{item.emoji}</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Signup
