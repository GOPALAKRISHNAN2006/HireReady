import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Badge } from '../components/ui'
import toast from 'react-hot-toast'
import { 
  BookOpen, 
  Search, 
  Play,
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
  Smartphone,
  ExternalLink,
  BookMarked,
  GraduationCap,
  TrendingUp,
  ChevronRight
} from 'lucide-react'

const StudyMaterials = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [savedMaterials, setSavedMaterials] = useState([])
  const [progressMap, setProgressMap] = useState({})

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('study-materials-saved')
    const progress = localStorage.getItem('study-materials-progress')
    if (saved) setSavedMaterials(JSON.parse(saved))
    if (progress) setProgressMap(JSON.parse(progress))
  }, [])

  // Save material
  const handleSave = (id) => {
    const updated = savedMaterials.includes(id) 
      ? savedMaterials.filter(s => s !== id)
      : [...savedMaterials, id]
    setSavedMaterials(updated)
    localStorage.setItem('study-materials-saved', JSON.stringify(updated))
    toast.success(savedMaterials.includes(id) ? 'Removed from saved' : 'Saved!')
  }

  // Update progress
  const updateProgress = (id, progress) => {
    const updated = { ...progressMap, [id]: progress }
    setProgressMap(updated)
    localStorage.setItem('study-materials-progress', JSON.stringify(updated))
    toast.success('Progress updated!')
  }

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'dsa', label: 'DSA', icon: Code },
    { id: 'system-design', label: 'System Design', icon: Layers },
    { id: 'behavioral', label: 'Behavioral', icon: MessageSquare },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'devops', label: 'DevOps', icon: Cloud },
    { id: 'ml', label: 'Machine Learning', icon: Bot },
  ]

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'article', label: 'Articles' },
    { id: 'video', label: 'Videos' },
    { id: 'cheatsheet', label: 'Cheat Sheets' },
    { id: 'course', label: 'Courses' },
  ]

  const materials = [
    // DSA
    {
      id: 1,
      title: 'Complete Guide to Data Structures',
      description: 'Master arrays, linked lists, trees, graphs, and more with detailed explanations and examples.',
      category: 'dsa',
      type: 'article',
      duration: '45 min read',
      difficulty: 'beginner',
      rating: 4.8,
      reviews: 234,
      saved: true,
      progress: 60,
    },
    {
      id: 2,
      title: 'Dynamic Programming Patterns',
      description: 'Learn the most common DP patterns used in coding interviews with step-by-step solutions.',
      category: 'dsa',
      type: 'video',
      duration: '2h 30min',
      difficulty: 'intermediate',
      rating: 4.9,
      reviews: 456,
      saved: false,
      progress: 0,
    },
    {
      id: 3,
      title: 'Big O Notation Cheat Sheet',
      description: 'Quick reference for time and space complexity of common algorithms and data structures.',
      category: 'dsa',
      type: 'cheatsheet',
      duration: '5 min read',
      difficulty: 'beginner',
      rating: 4.7,
      reviews: 189,
      saved: true,
      progress: 100,
    },
    // System Design
    {
      id: 4,
      title: 'System Design Interview Guide',
      description: 'Complete roadmap for system design interviews including distributed systems concepts.',
      category: 'system-design',
      type: 'course',
      duration: '8 hours',
      difficulty: 'advanced',
      rating: 4.9,
      reviews: 567,
      saved: false,
      progress: 25,
    },
    {
      id: 5,
      title: 'Designing a URL Shortener',
      description: 'Step-by-step guide to designing a URL shortening service like bit.ly.',
      category: 'system-design',
      type: 'article',
      duration: '30 min read',
      difficulty: 'intermediate',
      rating: 4.6,
      reviews: 123,
      saved: false,
      progress: 0,
    },
    {
      id: 6,
      title: 'CAP Theorem Explained',
      description: 'Understanding consistency, availability, and partition tolerance in distributed systems.',
      category: 'system-design',
      type: 'video',
      duration: '45 min',
      difficulty: 'intermediate',
      rating: 4.8,
      reviews: 234,
      saved: true,
      progress: 100,
    },
    // Behavioral
    {
      id: 7,
      title: 'STAR Method Mastery',
      description: 'Learn to structure your behavioral interview answers effectively.',
      category: 'behavioral',
      type: 'article',
      duration: '20 min read',
      difficulty: 'beginner',
      rating: 4.5,
      reviews: 345,
      saved: false,
      progress: 80,
    },
    {
      id: 8,
      title: 'Top 50 Behavioral Questions',
      description: 'Most frequently asked behavioral questions with sample answers.',
      category: 'behavioral',
      type: 'cheatsheet',
      duration: '15 min read',
      difficulty: 'beginner',
      rating: 4.7,
      reviews: 456,
      saved: true,
      progress: 0,
    },
    // Database
    {
      id: 9,
      title: 'SQL Query Optimization',
      description: 'Techniques to write efficient SQL queries and understand query execution plans.',
      category: 'database',
      type: 'course',
      duration: '4 hours',
      difficulty: 'intermediate',
      rating: 4.6,
      reviews: 178,
      saved: false,
      progress: 0,
    },
    {
      id: 10,
      title: 'NoSQL vs SQL: When to Use What',
      description: 'Comprehensive comparison of relational and non-relational databases.',
      category: 'database',
      type: 'article',
      duration: '25 min read',
      difficulty: 'intermediate',
      rating: 4.4,
      reviews: 89,
      saved: false,
      progress: 0,
    },
    // DevOps
    {
      id: 11,
      title: 'Docker & Kubernetes Fundamentals',
      description: 'Learn containerization and orchestration from scratch.',
      category: 'devops',
      type: 'course',
      duration: '6 hours',
      difficulty: 'intermediate',
      rating: 4.8,
      reviews: 345,
      saved: true,
      progress: 40,
    },
    // ML
    {
      id: 12,
      title: 'Machine Learning Interview Prep',
      description: 'Key ML concepts and algorithms you need to know for interviews.',
      category: 'ml',
      type: 'article',
      duration: '40 min read',
      difficulty: 'advanced',
      rating: 4.7,
      reviews: 167,
      saved: false,
      progress: 0,
    },
  ]

  const getTypeIcon = (type) => {
    const icons = {
      article: FileText,
      video: Video,
      cheatsheet: BookMarked,
      course: GraduationCap,
    }
    return icons[type] || FileText
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700',
    }
    return colors[difficulty] || colors.intermediate
  }

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory
    const matchesType = selectedType === 'all' || m.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Study Materials</h1>
          </div>
          <p className="text-emerald-100 max-w-xl">
            Curated learning resources to help you prepare for your dream job. Articles, videos, cheat sheets, and comprehensive courses.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Type Filters */}
      <div className="flex gap-2">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedType === type.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{materials.length}</p>
              <p className="text-sm text-blue-600">Total Materials</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{materials.filter(m => m.progress === 100).length}</p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{materials.filter(m => m.progress > 0 && m.progress < 100).length}</p>
              <p className="text-sm text-yellow-600">In Progress</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">{materials.filter(m => m.saved).length}</p>
              <p className="text-sm text-purple-600">Saved</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Materials List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredMaterials.map((material) => {
          const TypeIcon = getTypeIcon(material.type)
          return (
            <Card key={material.id} className="hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TypeIcon className="w-6 h-6 text-primary-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {material.title}
                    </h3>
                    <button className={`p-1 rounded transition-colors ${
                      material.saved 
                        ? 'text-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-500'
                    }`}>
                      <Star className={`w-5 h-5 ${material.saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{material.description}</p>

                  {/* Progress Bar */}
                  {material.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{material.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${material.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(material.difficulty)}`}>
                      {material.difficulty.charAt(0).toUpperCase() + material.difficulty.slice(1)}
                    </span>
                    <span className="flex items-center space-x-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{material.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gray-500">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{material.rating} ({material.reviews})</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <Button 
                  size="sm" 
                  variant="outline" 
                  icon={BookOpen}
                  onClick={() => {
                    // Navigate to material content page
                    navigate(`/study-materials/${material.id}`)
                    // Update progress for 'Start'
                    if (material.progress === 0) {
                      updateProgress(material.id, 10)
                    }
                  }}
                >
                  {material.progress === 100 ? 'Review' : material.progress > 0 ? 'Continue Reading' : 'Start Learning'}
                </Button>
                <Button 
                  size="sm" 
                  variant="primary" 
                  icon={Play}
                  onClick={() => {
                    // Navigate based on material type for practice
                    if (material.category === 'behavioral') {
                      navigate('/gd')
                    } else if (material.category === 'system-design') {
                      navigate('/interview/setup', { state: { category: 'system-design' } })
                    } else if (material.category === 'dsa') {
                      navigate('/aptitude')
                    } else {
                      navigate('/interview/setup', { state: { category: material.category } })
                    }
                  }}
                >
                  Practice Now
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No materials found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default StudyMaterials
