import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button, Input } from '../../components/ui'
import { Mail, Lock, Shield, ArrowRight } from 'lucide-react'

const AdminLogin = () => {
  const { adminLogin, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

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
    const res = await adminLogin(formData.email, formData.password)
    if (res.success) navigate('/admin')
  }

  return (
    <div className="animate-slide-up">
      <div className="lg:hidden mb-8 text-center">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl font-bold">Admin Panel</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Admin Sign in</h1>
        <p className="text-gray-500 text-lg">Sign in with your administrator account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">!
          </div>
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
            <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isLoading} icon={ArrowRight} iconPosition="right">Sign In</Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Back to{' '}
        <Link to="/" className="font-medium text-primary-600 hover:text-primary-700">Main Site</Link>
      </p>
    </div>
  )
}

export default AdminLogin
