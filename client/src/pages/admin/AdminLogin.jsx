import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button, Input } from '../../components/ui'
import { Mail, Lock, Shield, ArrowRight } from 'lucide-react'
import { preWarmServer, waitForServer } from '../../services/api'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const { adminLogin, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [slowRequest, setSlowRequest] = useState(false)
  const slowTimerRef = useRef(null)

  // Pre-warm the server as soon as the admin login page loads
  useEffect(() => {
    preWarmServer()
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    // Detect slow request (Render cold start)
    setSlowRequest(false)
    slowTimerRef.current = setTimeout(() => setSlowRequest(true), 4000)

    // Ensure server is awake before sending the login request
    const serverReady = await waitForServer({ silent: false })
    if (!serverReady) {
      clearTimeout(slowTimerRef.current)
      setSlowRequest(false)
      return
    }

    const res = await adminLogin(formData.email, formData.password)

    clearTimeout(slowTimerRef.current)
    setSlowRequest(false)

    if (res.success) {
      toast.success('Welcome back, Admin!')
      navigate('/admin')
    }
  }

  return (
    <div className="animate-slide-up">
      <div className="lg:hidden mb-8 text-center">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Admin Sign in</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Sign in with your administrator account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/30 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-center">
          <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center mr-3 text-rose-600 dark:text-rose-400 font-bold">!</div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="admin@example.com"
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
            <input type="checkbox" className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 rounded" />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">Forgot password?</Link>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isLoading} loadingText={slowRequest ? 'Starting server... please wait' : 'Signing in...'} icon={ArrowRight} iconPosition="right">Sign In</Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Back to{' '}
        <Link to="/" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Main Site</Link>
      </p>
    </div>
  )
}

export default AdminLogin
