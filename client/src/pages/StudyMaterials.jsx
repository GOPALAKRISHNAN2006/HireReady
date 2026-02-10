import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Badge } from '../components/ui'
import toast from 'react-hot-toast'
import { 
  BookOpen, 
  Search, 
  Clock,
  Star,
  FileText,
  Video,
  Code,
  Database,
  Cloud,
  Layers,
  MessageSquare,
  Bot,
  BookMarked,
  GraduationCap,
  TrendingUp,
  Bookmark,
  Filter,
  Sparkles,
  Eye,
  Heart,
  Zap,
  CheckCircle,
  X
} from 'lucide-react'

const StudyMaterials = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [savedMaterials, setSavedMaterials] = useState([])
  const [progressMap, setProgressMap] = useState({})
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('study-materials-saved')
    const progress = localStorage.getItem('study-materials-progress')
    if (saved) setSavedMaterials(JSON.parse(saved))
    if (progress) setProgressMap(JSON.parse(progress))
  }, [])

  const handleSave = (id) => {
    const updated = savedMaterials.includes(id) 
      ? savedMaterials.filter(s => s !== id)
      : [...savedMaterials, id]
    setSavedMaterials(updated)
    localStorage.setItem('study-materials-saved', JSON.stringify(updated))
    toast.success(savedMaterials.includes(id) ? 'Removed from saved' : 'Saved to library!')
  }

  const updateProgress = (id, progress) => {
    const updated = { ...progressMap, [id]: progress }
    setProgressMap(updated)
    localStorage.setItem('study-materials-progress', JSON.stringify(updated))
  }

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen, color: 'from-gray-500 to-gray-600' },
    { id: 'dsa', label: 'DSA', icon: Code, color: 'from-blue-500 to-indigo-600' },
    { id: 'system-design', label: 'System Design', icon: Layers, color: 'from-purple-500 to-violet-600' },
    { id: 'behavioral', label: 'Behavioral', icon: MessageSquare, color: 'from-pink-500 to-rose-600' },
    { id: 'database', label: 'Database', icon: Database, color: 'from-emerald-500 to-teal-600' },
    { id: 'devops', label: 'DevOps', icon: Cloud, color: 'from-orange-500 to-amber-600' },
    { id: 'ml', label: 'Machine Learning', icon: Bot, color: 'from-cyan-500 to-blue-600' },
  ]

  const types = [
    { id: 'all', label: 'All Types', icon: Filter },
    { id: 'article', label: 'Articles', icon: FileText },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'cheatsheet', label: 'Cheat Sheets', icon: BookMarked },
    { id: 'course', label: 'Courses', icon: GraduationCap },
  ]

  const materials = [
    {
      id: 1, title: 'Complete Guide to Data Structures',
      description: 'Master arrays, linked lists, trees, graphs, and more with detailed explanations, visual diagrams, and real interview examples.',
      category: 'dsa', type: 'article', duration: '45 min read', difficulty: 'beginner',
      rating: 4.8, reviews: 234, saved: true, progress: 60,
      tags: ['Arrays', 'Trees', 'Graphs'], author: 'Tech Interview Pro',
    },
    {
      id: 2, title: 'Dynamic Programming Patterns',
      description: 'Learn the most common DP patterns used in coding interviews with step-by-step visual solutions and complexity analysis.',
      category: 'dsa', type: 'video', duration: '2h 30min', difficulty: 'intermediate',
      rating: 4.9, reviews: 456, saved: false, progress: 0,
      tags: ['Memoization', 'Tabulation', 'Patterns'], author: 'Algorithm Academy',
    },
    {
      id: 3, title: 'Big O Notation Cheat Sheet',
      description: 'Quick reference for time and space complexity of common algorithms and data structures. Print-friendly format.',
      category: 'dsa', type: 'cheatsheet', duration: '5 min read', difficulty: 'beginner',
      rating: 4.7, reviews: 189, saved: true, progress: 100,
      tags: ['Complexity', 'Quick Reference'], author: 'CS Fundamentals',
    },
    {
      id: 4, title: 'System Design Interview Guide',
      description: 'Complete roadmap for system design interviews including distributed systems, load balancing, caching, and database sharding.',
      category: 'system-design', type: 'course', duration: '8 hours', difficulty: 'advanced',
      rating: 4.9, reviews: 567, saved: false, progress: 25,
      tags: ['Distributed Systems', 'Scalability', 'Architecture'], author: 'System Design Hub',
    },
    {
      id: 5, title: 'Designing a URL Shortener',
      description: 'Step-by-step guide to designing a URL shortening service like bit.ly. Covers API design, database schema, and caching.',
      category: 'system-design', type: 'article', duration: '30 min read', difficulty: 'intermediate',
      rating: 4.6, reviews: 123, saved: false, progress: 0,
      tags: ['API Design', 'Hashing', 'Caching'], author: 'Design Patterns Blog',
    },
    {
      id: 6, title: 'CAP Theorem Explained',
      description: 'Understanding consistency, availability, and partition tolerance in distributed systems with real-world examples.',
      category: 'system-design', type: 'video', duration: '45 min', difficulty: 'intermediate',
      rating: 4.8, reviews: 234, saved: true, progress: 100,
      tags: ['Distributed Systems', 'Theory'], author: 'Distributed Computing 101',
    },
    {
      id: 7, title: 'STAR Method Mastery',
      description: 'Learn to structure your behavioral interview answers effectively using the STAR framework with 20+ example responses.',
      category: 'behavioral', type: 'article', duration: '20 min read', difficulty: 'beginner',
      rating: 4.5, reviews: 345, saved: false, progress: 80,
      tags: ['STAR Method', 'Storytelling'], author: 'Career Coach Pro',
    },
    {
      id: 8, title: 'Top 50 Behavioral Questions',
      description: 'Most frequently asked behavioral questions at FAANG with sample answers and evaluation criteria.',
      category: 'behavioral', type: 'cheatsheet', duration: '15 min read', difficulty: 'beginner',
      rating: 4.7, reviews: 456, saved: true, progress: 0,
      tags: ['FAANG', 'Common Questions'], author: 'Interview Prep Hub',
    },
    {
      id: 9, title: 'SQL Query Optimization',
      description: 'Techniques to write efficient SQL queries and understand query execution plans, indexing strategies, and join optimization.',
      category: 'database', type: 'course', duration: '4 hours', difficulty: 'intermediate',
      rating: 4.6, reviews: 178, saved: false, progress: 0,
      tags: ['SQL', 'Performance', 'Indexing'], author: 'DB Masters',
    },
    {
      id: 10, title: 'NoSQL vs SQL: When to Use What',
      description: 'Comprehensive comparison of relational and non-relational databases with decision frameworks and use cases.',
      category: 'database', type: 'article', duration: '25 min read', difficulty: 'intermediate',
      rating: 4.4, reviews: 89, saved: false, progress: 0,
      tags: ['NoSQL', 'SQL', 'Comparison'], author: 'Data Engineering Weekly',
    },
    {
      id: 11, title: 'Docker & Kubernetes Fundamentals',
      description: 'Learn containerization and orchestration from scratch. Includes hands-on labs and deployment exercises.',
      category: 'devops', type: 'course', duration: '6 hours', difficulty: 'intermediate',
      rating: 4.8, reviews: 345, saved: true, progress: 40,
      tags: ['Docker', 'Kubernetes', 'Containers'], author: 'Cloud Native Academy',
    },
    {
      id: 12, title: 'Machine Learning Interview Prep',
      description: 'Key ML concepts and algorithms you need to know for interviews. Covers supervised, unsupervised, and deep learning.',
      category: 'ml', type: 'article', duration: '40 min read', difficulty: 'advanced',
      rating: 4.7, reviews: 167, saved: false, progress: 0,
      tags: ['Neural Networks', 'Classification', 'NLP'], author: 'ML Interview Guide',
    },
  ]

  const getTypeIcon = (type) => {
    const icons = { article: FileText, video: Video, cheatsheet: BookMarked, course: GraduationCap }
    return icons[type] || FileText
  }

  const getTypeColor = (type) => {
    const colors = {
      article: 'from-blue-500 to-blue-600',
      video: 'from-red-500 to-rose-600',
      cheatsheet: 'from-amber-500 to-orange-600',
      course: 'from-purple-500 to-violet-600',
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  const getTypeTextColor = (type) => {
    const colors = { article: 'text-blue-500 dark:text-blue-400', video: 'text-red-500 dark:text-red-400', cheatsheet: 'text-amber-500 dark:text-amber-400', course: 'text-purple-500 dark:text-purple-400' }
    return colors[type] || 'text-gray-500'
  }

  const getDifficultyConfig = (difficulty) => {
    const config = {
      beginner: { label: 'Beginner', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '🌱' },
      intermediate: { label: 'Intermediate', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: '🔥' },
      advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '⚡' },
    }
    return config[difficulty] || config.intermediate
  }

  const getEffectiveProgress = (material) => progressMap[material.id] ?? material.progress

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory
    const matchesType = selectedType === 'all' || m.type === selectedType
    const matchesSaved = !showSavedOnly || savedMaterials.includes(m.id) || m.saved
    return matchesSearch && matchesCategory && matchesType && matchesSaved
  })

  const completedCount = materials.filter(m => getEffectiveProgress(m) === 100).length
  const inProgressCount = materials.filter(m => { const p = getEffectiveProgress(m); return p > 0 && p < 100 }).length
  const savedCount = new Set([...savedMaterials, ...materials.filter(m => m.saved).map(m => m.id)]).size

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 md:p-10 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              Curated Learning Resources
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Study Materials</h1>
            <p className="text-emerald-100 max-w-lg text-lg leading-relaxed">
              Articles, videos, cheat sheets, and comprehensive courses — everything to ace your next interview.
            </p>
          </div>
          <div className="flex gap-3 md:gap-4">
            {[
              { label: 'Total', value: materials.length, icon: BookOpen },
              { label: 'Done', value: completedCount, icon: CheckCircle },
              { label: 'Saved', value: savedCount, icon: Bookmark },
            ].map(stat => (
              <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3.5 min-w-[80px]">
                <stat.icon className="w-5 h-5 mx-auto mb-1.5 text-emerald-200" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-[11px] text-emerald-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-medium transition-all border whitespace-nowrap ${
            showSavedOnly 
              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-current' : ''}`} />
          Saved Only
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Type Filter Chips */}
      <div className="flex gap-2 flex-wrap">
        {types.map((type) => {
          const Icon = type.icon
          const isActive = selectedType === type.id
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {type.label}
            </button>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Materials', value: materials.length, icon: BookOpen, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', sub: 'text-blue-600 dark:text-blue-400' },
          { label: 'Completed', value: completedCount, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400', sub: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'In Progress', value: inProgressCount, icon: TrendingUp, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', sub: 'text-amber-600 dark:text-amber-400' },
          { label: 'Saved', value: savedCount, icon: Heart, gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-100 dark:border-pink-800', text: 'text-pink-700 dark:text-pink-400', sub: 'text-pink-600 dark:text-pink-400' },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.bg} ${stat.border} border`}>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
                <p className={`text-xs font-medium ${stat.sub}`}>{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredMaterials.length}</span> of {materials.length} materials
      </p>

      {/* Materials Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const TypeIcon = getTypeIcon(material.type)
          const diffConfig = getDifficultyConfig(material.difficulty)
          const progress = getEffectiveProgress(material)
          const isSaved = savedMaterials.includes(material.id) || material.saved

          return (
            <Card key={material.id} className="group relative overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeColor(material.type)}`} />
              
              <div className="pt-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(material.type)} rounded-xl flex items-center justify-center shadow-md`}>
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${getTypeTextColor(material.type)}`}>
                        {material.type}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        {material.duration}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSave(material.id)}
                    className={`p-2 rounded-xl transition-all ${
                      isSaved ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-300 dark:text-gray-600 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {material.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                  {material.description}
                </p>

                {/* Tags */}
                {material.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {material.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress */}
                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Progress</span>
                      <span className={`font-bold ${progress === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${diffConfig.color}`}>
                    <span>{diffConfig.icon}</span> {diffConfig.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{material.rating}</span>
                    <span>({material.reviews})</span>
                  </span>
                  {material.author && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 truncate">by {material.author}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button 
                    size="sm" variant="outline" className="flex-1"
                    onClick={() => {
                      navigate(`/study-materials/${material.id}`)
                      if (progress === 0) updateProgress(material.id, 10)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    {progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                  </Button>
                  <Button 
                    size="sm" className="flex-1"
                    onClick={() => {
                      if (material.category === 'behavioral') navigate('/gd')
                      else if (material.category === 'system-design') navigate('/interview/setup', { state: { category: 'system-design' } })
                      else if (material.category === 'dsa') navigate('/aptitude')
                      else navigate('/interview/setup', { state: { category: material.category } })
                    }}
                  >
                    <Zap className="w-4 h-4 mr-1.5" />
                    Practice
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <Card className="border-dashed border-2 dark:border-gray-600">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No materials found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Try adjusting your search or clearing some filters to see more results.
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedType('all'); setShowSavedOnly(false) }}>
              Clear All Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default StudyMaterials
