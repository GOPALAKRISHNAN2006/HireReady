/**
 * ===========================================
 * Admin Layout Component - Modern UI
 * ===========================================
 * 
 * Features:
 * - Collapsible sidebar with grouped navigation
 * - Glass-morphism header with backdrop blur
 * - Breadcrumb navigation
 * - Smooth animations & transitions
 * - Dark mode ready
 */

import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
  Eye,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react'

const AdminLayout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Close dropdowns on route change
  useEffect(() => {
    setUserMenuOpen(false)
    setNotificationsOpen(false)
    setSidebarOpen(false)
  }, [location.pathname])

  // Grouped navigation
  const navGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      ]
    },
    {
      label: 'Management',
      items: [
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Questions', path: '/admin/questions', icon: FileQuestion },
        { name: 'Interviews', path: '/admin/interviews', icon: Target },
      ]
    },
    {
      label: 'Assessments',
      items: [
        { name: 'Aptitude', path: '/admin/aptitude', icon: Brain },
        { name: 'GD Topics', path: '/admin/gd-topics', icon: MessageSquare },
        { name: 'Proctoring', path: '/admin/proctoring', icon: Eye },
      ]
    },
    {
      label: 'System',
      items: [
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Current page for breadcrumb
  const getCurrentPageTitle = () => {
    const allItems = navGroups.flatMap(g => g.items)
    const current = allItems.find(item => 
      item.path === '/admin' 
        ? location.pathname === '/admin'
        : location.pathname.startsWith(item.path)
    )
    return current?.name || 'Admin'
  }

  const NavItem = ({ item }) => {
    const collapsed = sidebarCollapsed
    return (
      <NavLink
        to={item.path}
        end={item.path === '/admin'}
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
          `group relative flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
            {!collapsed && <span className="font-medium text-sm flex-1">{item.name}</span>}
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                {item.name}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            )}
          </>
        )}
      </NavLink>
    )
  }

  const mainPadding = sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeft className="w-5 h-5 text-slate-600" /> : <PanelLeftClose className="w-5 h-5 text-slate-600" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">HireReady</h1>
                <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className={`relative w-full transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users, questions, interviews..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-700 focus:shadow-lg focus:shadow-indigo-500/10 placeholder:text-slate-400 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded hidden lg:inline">⌘K</kbd>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <NavLink to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Home className="w-4 h-4" />
              <span className="font-medium">Site</span>
            </NavLink>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              </button>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="p-4 text-center text-slate-500 text-sm py-8">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No new notifications
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-sm font-semibold text-white">{user?.firstName?.charAt(0) || 'A'}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Admin</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <NavLink to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl" onClick={() => setUserMenuOpen(false)}>
                        <Users className="w-4 h-4" />
                        Profile Settings
                      </NavLink>
                      <NavLink to="/" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl" onClick={() => setUserMenuOpen(false)}>
                        <Home className="w-4 h-4" />
                        Back to Main Site
                      </NavLink>
                    </div>
                    <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen ${sidebarCollapsed ? 'w-20' : 'w-72'}
          bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
          border-r border-slate-200/60 dark:border-slate-800/60
          transform transition-all duration-300 ease-out
          lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-5 overflow-y-auto h-[calc(100%-160px)]">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!sidebarCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {group.label}
                </p>
              )}
              {sidebarCollapsed && <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 mx-auto mb-2" />}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>


      </aside>

      {/* Main Content */}
      <main className={`pt-16 ${mainPadding} transition-all duration-300`}>
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <NavLink to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Admin</NavLink>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-900 dark:text-white font-medium">{getCurrentPageTitle()}</span>
              </>
            )}
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
