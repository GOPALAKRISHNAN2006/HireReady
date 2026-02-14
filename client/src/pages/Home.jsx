import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { Button } from '../components/ui'
import { 
  Brain, 
  Target, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Award,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Star,
  Sun,
  Moon,
  Monitor,
  Menu,
  X
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuthStore()
  const { theme, setTheme } = useSettingsStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const toggleTheme = () => {
    const cycle = { light: 'dark', dark: 'system', system: 'light' }
    setTheme(cycle[theme] || 'light')
  }
  const themeLabel = theme === 'system' ? 'System theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode'

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description: 'Intelligent question generation tailored to your skill level and target role.',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Feedback',
      description: 'Get instant, actionable feedback on your answers powered by advanced NLP.',
    },
    {
      icon: Target,
      title: 'Personalized Practice',
      description: 'Focus on your weak areas with adaptive learning recommendations.',
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Track your improvement over time with detailed performance insights.',
    },
    {
      icon: Users,
      title: 'Expert Curated Content',
      description: 'Questions from real interviews at top tech companies.',
    },
    {
      icon: Award,
      title: 'Skill Certification',
      description: 'Earn badges and certificates to showcase your interview readiness.',
    },
  ]

  const stats = [
    { value: 'AI', label: 'Powered Feedback' },
    { value: '6+', label: 'Practice Modes' },
    { value: 'Free', label: 'To Get Started' },
    { value: '24/7', label: 'Available' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e1a] overflow-hidden transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-mesh opacity-60 dark:opacity-30 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0b1120]/85 backdrop-blur-xl border-b border-slate-100/50 dark:border-indigo-500/[0.08] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">HireReady</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Why HireReady</a>
            </div>
            
            <div className="flex items-center space-x-3">
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
                  <Moon className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
                )}
              </button>

              {isAuthenticated ? (
                <Link to="/dashboard" className="hidden sm:block">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup" className="hidden sm:block">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-100 dark:border-slate-700/50 py-4 space-y-3 animate-slide-down">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">How It Works</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">Why HireReady</a>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 px-4 space-y-2">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-400/30 dark:bg-indigo-500/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-60 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                AI-Powered Interview Preparation
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                Ace Your Next Interview with{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">AI-Powered</span> Practice
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Practice with intelligent mock interviews, get real-time feedback, 
                and track your progress to land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto group">
                    <span>Start Free Practice</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" icon={Play} className="w-full sm:w-auto">
                    Login to Practice
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-float">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 animate-float" style={{ animationDelay: '1s' }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl transform rotate-3 shadow-2xl shadow-indigo-500/30"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-xs text-slate-400 font-medium">HireReady Session</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold uppercase tracking-wider">Question:</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">What is the time complexity of binary search?</p>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-700/50">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2 font-semibold uppercase tracking-wider">Your Answer:</p>
                    <p className="text-slate-700 dark:text-slate-300">The time complexity is O(log n) because...</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-semibold text-green-700">Excellent Answer!</p>
                      <span className="ml-auto text-sm font-bold text-green-600">95%</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Your explanation correctly identifies the logarithmic complexity...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/40 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
              <Star className="w-4 h-4 mr-2" />
              Premium Features
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to prepare for and ace any interview.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-700/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-[#0f1525] dark:to-[#0a0e1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100/80 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-300 text-sm font-semibold mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Quick & Easy
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              How It <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Get started in minutes and begin improving your interview skills today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Your Focus', description: 'Select your target role, company, or skill area to practice.', color: 'from-blue-500 to-cyan-500' },
              { step: '02', title: 'Practice with AI', description: 'Answer AI-generated questions in realistic mock interviews.', color: 'from-purple-500 to-pink-500' },
              { step: '03', title: 'Get Better', description: 'Review feedback, track progress, and improve continuously.', color: 'from-orange-500 to-red-500' },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-300`}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg dark:shadow-slate-900/50">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} text-white font-bold text-lg mb-6 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why HireReady */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0e1a] dark:to-[#0f1525]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-pink-100/80 dark:bg-pink-900/40 rounded-full text-pink-700 dark:text-pink-300 text-sm font-semibold mb-4">
              <Users className="w-4 h-4 mr-2" />
              Community
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Built for <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Job Seekers</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to ace your next interview.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'AI Mock Interviews', desc: 'Practice with AI-powered interview simulations that give real-time feedback on your answers.' },
              { icon: '📊', title: 'Skill Analytics', desc: 'Track your progress with detailed analytics on every skill area you practice.' },
              { icon: '🤝', title: 'Community Support', desc: 'Connect with fellow job seekers, share tips, and learn from each other.' },
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl transform rotate-1 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Features Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-white text-sm font-semibold mb-4 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              Unique Features
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What Makes Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">Different</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Exclusive features you won't find anywhere else.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'Skill Radar', desc: 'Visual skill assessment with detailed analytics', gradient: 'from-cyan-400 to-blue-500' },
              { icon: Award, title: 'Career Roadmap', desc: 'Personalized learning path to your dream job', gradient: 'from-green-400 to-emerald-500' },
              { icon: MessageSquare, title: 'Community Hub', desc: 'Connect with mentors and fellow learners', gradient: 'from-pink-400 to-rose-500' },
              { icon: Sparkles, title: 'Daily Challenges', desc: 'Keep your streak and earn rewards daily', gradient: 'from-amber-400 to-orange-500' },
            ].map((item, index) => (
              <div key={index} className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold mb-6 backdrop-blur-sm">
            🚀 Start your journey today
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Start practicing for free today and land your dream job with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right" className="shadow-2xl shadow-white/20">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-[#060912] text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">HireReady</span>
              </Link>
              <p className="text-slate-400 mb-6 max-w-sm">
                AI-powered interview preparation platform to help you land your dream job with confidence.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/GOPALAKRISHNAN2006/HireReady" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors" title="GitHub">
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/roadmap" className="hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/daily-challenge" className="hover:text-white transition-colors">Daily Challenge</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} HireReady. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Made with ❤️ for job seekers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
