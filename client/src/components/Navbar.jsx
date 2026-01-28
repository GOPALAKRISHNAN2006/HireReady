import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Menu, Bell, Search, User, LogOut, Settings, Brain, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
  }

  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'User'

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden sm:block">HireReady</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search questions, topics..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-100/80 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:bg-white focus:border-primary-200 transition-all duration-300 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Link 
            to="/notifications" 
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 relative group"
          >
            <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                {user?.avatar && user.avatar !== 'default-avatar.png' ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                    alt={displayName} 
                    className="w-9 h-9 rounded-xl object-cover" 
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<span class="text-sm font-bold text-white">${displayName.charAt(0).toUpperCase()}</span>`
                    }}
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {displayName}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/50 py-2 animate-slide-down">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName || ''}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                  {user?.role === 'admin' && (
                    <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      Admin
                    </span>
                  )}
                </div>
                
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    to="/profile#settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>Settings</span>
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
