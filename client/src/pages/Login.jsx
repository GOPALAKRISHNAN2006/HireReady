import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button, Input } from '../components/ui'
import { Mail, Lock, Brain, ArrowRight, Loader2, Sparkles, Shield, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import api, { preWarmServer } from '../services/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const Login = () => {
  const { login, setUser, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [googleLoading, setGoogleLoading] = useState(false)
  const [slowRequest, setSlowRequest] = useState(false)
  const slowTimerRef = useRef(null)

  // Pre-warm the server as soon as the login page loads
  useEffect(() => {
    preWarmServer()
  }, [])

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

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
      toast.error(error.response?.data?.message || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error('Google Sign-In not configured. Please use email/password login or contact support.')
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
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
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
    
    // Handle remember me
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    // Detect slow request (Render cold start)
    setSlowRequest(false)
    slowTimerRef.current = setTimeout(() => setSlowRequest(true), 4000)
    
    await login(formData.email, formData.password)

    clearTimeout(slowTimerRef.current)
    setSlowRequest(false)
  }

  return (
    <div className="animate-slide-up">
      {/* Logo for mobile */}
      <div className="lg:hidden mb-8 text-center">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">HireReady</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full text-xs font-medium text-primary-600 dark:text-primary-400 mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          AI-Powered Interview Prep
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Welcome back!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Sign in to continue your interview preparation</p>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          <span>Secure</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>10K+ Users</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Free Plan</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mr-3">
            <span className="text-red-500 dark:text-red-400">!</span>
          </div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Enter your password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          loadingText={slowRequest ? 'Starting server... please wait' : 'Signing in...'}
          icon={ArrowRight}
          iconPosition="right"
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleGoogleLogin}
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

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Sign up for free →
          </Link>
        </p>
      </div>

      {/* Bottom feature highlights */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center group">
            <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">🎯</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mock Interviews</p>
          </div>
          <div className="text-center group">
            <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">🤖</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Feedback</p>
          </div>
          <div className="text-center group">
            <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">📊</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Track Progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
