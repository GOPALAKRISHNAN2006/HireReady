import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { Mail, ArrowLeft, Brain, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = () => {
    if (!email) {
      setError('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format')
      return false
    }
    setError('')
    return true
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) return

    setIsLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', { email })
      
      if (response.data.success) {
        setIsSubmitted(true)
        toast.success('Password reset instructions sent!')
      }
    } catch (err) {
      // For security, we show a generic success message even on failure
      // The backend already handles this, but we add frontend fallback
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="animate-slide-up">
        {/* Logo for mobile */}
        <div className="lg:hidden mb-8 text-center">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">HireReady</span>
          </Link>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Check your email</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            If an account with <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span> exists, 
            we've sent password reset instructions to your inbox.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
              variant="outline"
              fullWidth
            >
              Try another email
            </Button>
            
            <Link to="/login">
              <Button variant="ghost" fullWidth>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-slide-up">
      {/* Logo for mobile */}
      <div className="lg:hidden mb-8 text-center">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">HireReady</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Forgot password?</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No worries, we'll send you reset instructions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          icon={Mail}
          value={email}
          onChange={handleChange}
          error={error}
          autoComplete="email"
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          className="mt-2"
        >
          Reset Password
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
