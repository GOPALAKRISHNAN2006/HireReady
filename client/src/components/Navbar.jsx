import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { Menu, Bell, Search, User, LogOut, Settings, Brain, ChevronDown, Sun, Moon, Monitor } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useSettingsStore()
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

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggleTheme = () => {
    const cycle = { light: 'dark', dark: 'system', system: 'light' }
    setTheme(cycle[theme] || 'light')
  }

  const themeIcon = theme === 'system' ? Monitor : isDark ? Sun : Moon
  const themeLabel = theme === 'system' ? 'System theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode'

  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'User'

  return (
    <header className="bg-white/80 dark:bg-[#0b1120]/85 backdrop-blur-xl border-b border-slate-100/50 dark:border-indigo-500/[0.08] sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-all duration-200 active:scale-95"
          >
            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent hidden sm:block">HireReady</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search questions, topics..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100/80 dark:bg-[#0f172a]/80 border border-transparent dark:border-indigo-500/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-[#131c31] focus:border-indigo-200 dark:focus:border-indigo-500/30 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-all duration-300 relative group"
            title={themeLabel}
          >
            {theme === 'system' ? (
              <Monitor className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
            ) : isDark ? (
              <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            )}
          </button>

          {/* Notifications */}
          <Link 
            to="/notifications" 
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-all duration-200 relative group"
          >
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0b1120]"></span>
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-all duration-200 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                {user?.avatar && user.avatar !== 'default-avatar.png' && user.avatar.startsWith('http') ? (
                  <img 
                    src={user.avatar} 
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
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                {displayName}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/90 dark:bg-[#111827]/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100/50 dark:border-indigo-500/10 py-2 animate-slide-down">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-indigo-500/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.firstName} {user?.lastName || ''}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {user?.role === 'admin' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-indigo-500/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-slate-100 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    to="/profile#settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-indigo-500/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-slate-100 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span>Settings</span>
                  </Link>
                </div>
                
                <div className="border-t border-slate-100 dark:border-indigo-500/10 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full"
                  >
                    <div className="w-8 h-8 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
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
