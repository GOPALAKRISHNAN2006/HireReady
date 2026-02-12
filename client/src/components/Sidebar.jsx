import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { 
  LayoutDashboard, 
  PlayCircle, 
  BarChart3, 
  HelpCircle, 
  Users, 
  FileQuestion,
  X,
  ChevronRight,
  FileText,
  Brain,
  MessageSquare,
  Target,
  ClipboardList,
  Settings,
  Trophy,
  Award,
  History,
  Bookmark,
  Bell,
  Building2,
  BookOpen,
  Flame,
  Map,
  Radar,
  Lightbulb,
  UsersRound,
  Shield,
  Mic,
  CalendarCheck,
  Monitor,
  Bot
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Daily Challenge', path: '/daily-challenge', icon: Flame, badge: 'Hot' },
    { name: 'Start Interview', path: '/interview/setup', icon: PlayCircle },
    { name: 'Communication', path: '/communication', icon: Mic },
    { name: 'Skill Radar', path: '/skills', icon: Radar },
    { name: 'Career Roadmap', path: '/roadmap', icon: Map },
    { name: 'Resume Builder', path: '/resume', icon: FileText },
    { name: 'Aptitude Tests', path: '/aptitude', icon: Brain },
    { name: 'Group Discussion', path: '/gd', icon: MessageSquare },
    { name: 'Mock Interview Lab', path: '/mock-lab', icon: Monitor },
  ]

  const learnItems = [
    { name: 'Interview Tips', path: '/tips', icon: Lightbulb },
    { name: 'Study Materials', path: '/study-materials', icon: BookOpen },
    { name: 'Flashcards', path: '/flashcards', icon: ClipboardList, badge: 'New' },
    { name: 'Interview Notes', path: '/notes', icon: FileText },
    { name: 'Study Plan', path: '/study-plan', icon: CalendarCheck },
    { name: 'Company Prep', path: '/company-prep', icon: Building2 },
    { name: 'Questions', path: '/questions', icon: HelpCircle },
  ]

  const socialItems = [
    { name: 'Community Hub', path: '/community', icon: UsersRound },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Achievements', path: '/achievements', icon: Award },
  ]

  const additionalItems = [
    { name: 'Progress Report', path: '/progress', icon: BarChart3 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Practice History', path: '/history', icon: History },
    { name: 'Saved Questions', path: '/saved', icon: Bookmark },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help & FAQ', path: '/help', icon: HelpCircle },
  ]

  const aiItems = [
    { name: 'AI Assistant', path: '/ai-chat', icon: Bot, badge: 'AI' },
  ]

  const adminItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Interview Questions', path: '/admin/questions', icon: FileQuestion },
    { name: 'Aptitude Questions', path: '/admin/aptitude', icon: Brain },
    { name: 'GD Topics', path: '/admin/gd-topics', icon: MessageSquare },
    { name: 'Interview Reviews', path: '/admin/interviews', icon: Target },
    { name: 'Proctoring', path: '/admin/proctoring', icon: Shield },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
        ${isActive 
          ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-indigo-500/[0.08] dark:hover:to-purple-500/[0.05]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-indigo-500/10 group-hover:bg-primary-100 dark:group-hover:bg-indigo-500/20'}`}>
            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`} />
          </div>
          <span className="font-medium flex-1">{item.name}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-full animate-pulse">
              {item.badge}
            </span>
          )}
          <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-white opacity-100 translate-x-0' : 'text-gray-400 dark:text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
        </>
      )}
    </NavLink>
  )

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#0d1526] shadow-xl dark:shadow-black/40 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-none lg:border-r lg:border-gray-200 dark:lg:border-indigo-500/[0.08]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-indigo-500/10">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-indigo-500/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] lg:max-h-[calc(100vh-200px)] scrollbar-hide">
          {/* Main Navigation - Only show for non-admin users */}
          {!isAdmin && (
            <>
              <div className="space-y-1">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Practice
                </p>
                {navItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
              
              <div className="space-y-1 pt-4 mt-4 border-t border-gray-100 dark:border-indigo-500/[0.08]">
                <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Learn
                </p>
                {learnItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>

              <div className="space-y-1 pt-4 mt-4 border-t border-gray-100 dark:border-indigo-500/[0.08]">
                <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Community
                </p>
                {socialItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
              
              <div className="space-y-1 pt-4 mt-4 border-t border-gray-100 dark:border-indigo-500/[0.08]">
                <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  AI & More
                </p>
                {aiItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
                {additionalItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <div className="space-y-1">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Administration
              </p>
              {adminItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          )}
        </nav>

        {/* Bottom CTA - Only show for non-admin users */}
        {!isAdmin && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-700 dark:to-purple-600 rounded-xl p-4 text-white shadow-lg dark:shadow-primary-900/30">
                <h4 className="font-semibold mb-1">Ready for Practice?</h4>
                <p className="text-sm text-primary-100 mb-3">Start a mock interview now!</p>
                <NavLink
                  to="/interview/setup"
                  onClick={onClose}
                  className="block w-full py-2 bg-white dark:bg-white/95 text-primary-600 rounded-lg text-center font-medium hover:bg-primary-50 dark:hover:bg-white transition-colors"
                >
                  Start Interview
                </NavLink>
              </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
