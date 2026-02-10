import { Outlet, Link } from 'react-router-dom'
import { Brain, Sparkles, Shield, Zap } from 'lucide-react'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-7 h-7 text-primary-600" />
            </div>
            <span className="text-2xl font-bold text-white">HireReady</span>
          </Link>
        </div>
        
        <div className="relative space-y-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 50,000+ professionals
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Prepare for Your Dream Job with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              AI-Powered
            </span>{' '}
            Mock Interviews
          </h1>
          <p className="text-primary-100 text-xl leading-relaxed">
            Practice with intelligent questions, get instant feedback, and track your progress 
            to ace your next interview.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-primary-100">Practice Questions</div>
            </div>
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
          </div>
        </div>
        
        <div className="relative text-primary-200 text-sm">
          © 2025 HireReady. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white dark:from-[#0b1120] dark:to-[#0f172a] relative transition-colors duration-300">
        <div className="absolute inset-0 gradient-mesh opacity-30 dark:opacity-20" />
        <div className="relative w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
