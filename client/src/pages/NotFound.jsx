import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { Home, ArrowLeft, Search, BookOpen, Trophy, Target, HelpCircle, Compass } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [countdown, setCountdown] = useState(15)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/help?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const popularPages = [
    { name: 'Dashboard', path: '/dashboard', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { name: 'Practice Interview', path: '/interview/setup', icon: Compass, color: 'from-purple-500 to-indigo-500' },
    { name: 'Study Materials', path: '/study-materials', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, color: 'from-amber-500 to-orange-500' },
    { name: 'Help Center', path: '/help', icon: HelpCircle, color: 'from-pink-500 to-rose-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}
      />

      {/* Floating dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-indigo-400/30 dark:bg-indigo-400/20 rounded-full animate-bounce"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 16}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + i * 0.5}s`,
          }}
        />
      ))}

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1
            className="text-[12rem] md:text-[16rem] font-black leading-none select-none"
            style={{ transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)` }}
          >
            <span className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              4
            </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                0
              </span>
              {/* Animated ring around the 0 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 md:w-36 md:h-36 border-4 border-dashed border-indigo-300/40 dark:border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              </div>
            </span>
            <span className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              4
            </span>
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Lost in Space? 🚀
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-2 max-w-md mx-auto">
          The page you're looking for has drifted into another dimension. Let's get you back on track!
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
          Auto-redirecting to home in <span className="font-bold text-indigo-600 dark:text-indigo-400">{countdown}s</span>
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for what you need..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/">
            <Button icon={Home} size="lg" className="shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow">
              Go to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            icon={ArrowLeft}
            size="lg"
            onClick={() => window.history.back()}
            className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Go Back
          </Button>
        </div>

        {/* Popular Pages */}
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
            Popular Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-7 h-7 bg-gradient-to-br ${page.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <page.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{page.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
