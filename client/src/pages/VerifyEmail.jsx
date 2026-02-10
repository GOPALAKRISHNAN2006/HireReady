import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error, resend
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (token) {
      verifyEmail()
    } else {
      setStatus('resend')
    }
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await api.post(`/auth/verify-email/${token}`)
      if (response.data.success) {
        setStatus('success')
        setMessage(response.data.message)
        toast.success('Email verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      setStatus('error')
      setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.')
    }
  }

  const handleResendVerification = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)
    try {
      const response = await api.post('/auth/resend-verification', { email })
      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.')
        setEmail('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verifying Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Email Verified! 🎉
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message || 'Your email has been verified successfully. You can now access all features.'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Redirecting to login page...
              </p>
              <Link to="/login">
                <Button className="w-full">
                  Go to Login
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStatus('resend')}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Request New Verification Email
                </Button>
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === 'resend' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Resend Verification Email
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter your email address and we'll send you a new verification link.
              </p>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Verification Email
                    </>
                  )}
                </Button>
              </form>
              <Link to="/login" className="block mt-4">
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          Need help?{' '}
          <Link to="/help" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail
