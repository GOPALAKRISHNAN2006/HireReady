/**
 * ===========================================
 * Admin Layout Component
 * ===========================================
 * 
 * A dedicated layout for admin pages featuring:
 * - Admin-specific sidebar navigation
 * - Top navigation bar with admin controls
 * - Responsive design
 * - Admin context indicator
 */

import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  Target,
  Brain,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Shield,
  ChevronDown,
  Home,
  Eye
} from 'lucide-react'

const AdminLayout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Admin navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: LayoutDashboard,
      description: 'Overview & statistics'
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: Users,
      description: 'Manage user accounts'
    },
    { 
      name: 'Interview Questions', 
      path: '/admin/questions', 
      icon: FileQuestion,
      description: 'Manage question bank'
    },
    { 
      name: 'Interviews', 
      path: '/admin/interviews', 
      icon: Target,
      description: 'Review interviews'
    },
    { 
      name: 'Aptitude', 
      path: '/admin/aptitude', 
      icon: Brain,
      description: 'Aptitude questions'
    },
    { 
      name: 'GD Topics', 
      path: '/admin/gd-topics', 
      icon: MessageSquare,
      description: 'Group discussion topics'
    },
    { 
      name: 'Proctoring', 
      path: '/admin/proctoring', 
      icon: Eye,
      description: 'Monitor proctoring sessions'
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: Settings,
      description: 'System settings'
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      end={item.path === '/admin'}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive 
          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-200/50' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
          <div className="flex-1">
            <span className="font-medium">{item.name}</span>
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white' : 'text-gray-400'}`} />
        </>
      )}
    </NavLink>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo & Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">HireReady</p>
              </div>
            </div>
          </div>

          {/* Center: Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, questions..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Actions & User Menu */}
          <div className="flex items-center space-x-3">
            {/* Back to Main Site */}
            <NavLink
              to="/"
              className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Main Site</span>
            </NavLink>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {user?.firstName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 py-2">
                    <NavLink
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </NavLink>
                    <NavLink
                      to="/"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Back to Main Site
                    </NavLink>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-none lg:border-r lg:border-gray-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <span className="text-lg font-bold text-gray-900">Admin Menu</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Administration
          </p>
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-4 left-4 right-4 hidden lg:block">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5" />
              <h4 className="font-semibold">Admin Mode</h4>
            </div>
            <p className="text-sm text-orange-100 mb-3">
              You have full administrative access to the platform.
            </p>
            <NavLink
              to="/"
              className="block w-full py-2 bg-white text-orange-600 rounded-lg text-center font-medium hover:bg-orange-50 transition-colors text-sm"
            >
              Exit Admin Mode
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 lg:pl-72">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
