import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { Lock, ArrowLeft, Brain, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await api.put(`/auth/reset-password/${token}`, {
        password: formData.password
      })
      
      if (response.data.success) {
        setIsSuccess(true)
        toast.success('Password reset successful!')
      }
    } catch (err) {
      setIsError(true)
      setErrorMessage(err.response?.data?.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setIsLoading(false)
    }
  }

  // Success State
  if (isSuccess) {
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

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Password reset successful!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your password has been changed. You can now sign in with your new password.
          </p>
          
          <Link to="/login">
            <Button fullWidth size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Error State
  if (isError) {
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
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Reset link expired</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {errorMessage}
          </p>
          
          <div className="space-y-4">
            <Link to="/forgot-password">
              <Button fullWidth size="lg">
                Request new reset link
              </Button>
            </Link>
            
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Set new password</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Your new password must be different from previous passwords</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="New Password"
          type="password"
          name="password"
          placeholder="Enter your new password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your new password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {/* Password requirements hint */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
              <span className="w-4 h-4 mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
              At least 8 characters
            </li>
            <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
              <span className="w-4 h-4 mr-2">{/[A-Z]/.test(formData.password) ? '✓' : '○'}</span>
              One uppercase letter
            </li>
            <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
              <span className="w-4 h-4 mr-2">{/[a-z]/.test(formData.password) ? '✓' : '○'}</span>
              One lowercase letter
            </li>
            <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
              <span className="w-4 h-4 mr-2">{/\d/.test(formData.password) ? '✓' : '○'}</span>
              One number
            </li>
          </ul>
        </div>

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

export default ResetPassword
