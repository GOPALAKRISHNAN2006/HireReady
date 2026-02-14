import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button, Input } from '../components/ui'
import { Mail, Lock, User, Loader2, Sparkles, Shield, Zap, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api, { preWarmServer, waitForServer } from '../services/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const Signup = () => {
  const navigate = useNavigate()
  const { register, googleLogin, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [slowRequest, setSlowRequest] = useState(false)
  const slowTimerRef = useRef(null)
  const googleBtnRef = useRef(null)

  // Pre-warm the server as soon as the signup page loads
  useEffect(() => {
    preWarmServer()
  }, [])

  // Initialize Google Sign-In (wait for script to load)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return false
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          ux_mode: 'popup',
          auto_select: false,
        })
        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = ''
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 400,
          })
        }
        setGoogleReady(true)
        return true
      } catch (err) {
        console.error('Google init error:', err)
        return false
      }
    }

    if (!initGoogle()) {
      const interval = setInterval(() => {
        if (initGoogle()) clearInterval(interval)
      }, 300)
      const timeout = setTimeout(() => clearInterval(interval), 10000)
      return () => { clearInterval(interval); clearTimeout(timeout) }
    }
  }, [])

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true)
    try {
      const result = await api.post('/auth/google', {
        credential: response.credential,
        clientId: GOOGLE_CLIENT_ID
      })
      if (result.data.success) {
        const { user, tokens } = result.data.data
        googleLogin(user, tokens)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      } else {
        toast.error(result.data.message || 'Google sign-up failed. Please try again.')
      }
    } catch (error) {
      console.error('Google signup error:', error)
      toast.error(error.response?.data?.message || 'Google sign-up failed. Please try again.')
    } finally {
      setGoogleLoading(false)
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

    // Show progressive loading states
    setSlowRequest(false)
    slowTimerRef.current = setTimeout(() => setSlowRequest(true), 3000)

    // Ensure server is awake before sending the register request
    const serverReady = await waitForServer({ silent: false })
    if (!serverReady) {
      clearTimeout(slowTimerRef.current)
      setSlowRequest(false)
      return
    }

    await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    })

    clearTimeout(slowTimerRef.current)
    setSlowRequest(false)
  }

  return (
    <div className="animate-in">
      {/* Logo for mobile */}
      <div className="lg:hidden mb-8 text-center">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">HireReady</span>
        </Link>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-full text-xs font-medium text-green-600 dark:text-green-400 mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Free to get started
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create an account</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Start your journey to interview success</p>
      </div>

      {/* Perks strip */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          <span>Free forever</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span>No credit card</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
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
              className="w-4 h-4 mt-0.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
              I agree to the{' '}
              <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          loadingText={slowRequest ? 'Starting server... please wait' : 'Creating account...'}
          className="mt-6"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-slate-500 dark:text-slate-400">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6">
          {googleLoading ? (
            <div className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Signing up...</span>
            </div>
          ) : (
            <div ref={googleBtnRef} className="flex justify-center" />
          )}
          {!googleReady && !googleLoading && (
            <div className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl opacity-50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Loading Google Sign-In...</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            Sign in →
          </Link>
        </p>
      </div>

      {/* What you'll get */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center mb-3">What you'll get</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '🎯', label: 'Mock Interviews' },
            { emoji: '🤖', label: 'AI Feedback' },
            { emoji: '📊', label: 'Analytics' },
            { emoji: '🏆', label: 'Achievements' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-base">{item.emoji}</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Signup
