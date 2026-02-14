import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { 
  Search, 
  BookOpen, 
  Code, 
  Users, 
  Database,
  Server,
  Brain,
  ChevronDown,
  Eye
} from 'lucide-react'

const Questions = () => {
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
  })
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  // Fetch questions
  const { data, isLoading } = useQuery({
    queryKey: ['questions', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      if (filters.search) params.append('search', filters.search)
      
      const response = await api.get(`/questions?${params.toString()}`)
      return response.data
    },
  })

  const categories = [
    { id: '', name: 'All Categories', icon: BookOpen },
    { id: 'dsa', name: 'DSA', icon: Code },
    { id: 'web-development', name: 'Web Dev', icon: Server },
    { id: 'behavioral', name: 'Behavioral', icon: Users },
    { id: 'system-design', name: 'System Design', icon: Database },
    { id: 'machine-learning', name: 'ML/AI', icon: Brain },
  ]

  const difficulties = [
    { id: '', name: 'All Levels' },
    { id: 'easy', name: 'Easy', color: 'success' },
    { id: 'medium', name: 'Medium', color: 'warning' },
    { id: 'hard', name: 'Hard', color: 'danger' },
  ]

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category)
    return cat?.icon || BookOpen
  }

  return (
    <div className="space-y-8">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Practice & Learn
          </div>
          <h1 className="text-3xl font-bold mb-2">Question Bank</h1>
          <p className="text-white/70 max-w-lg">Browse and practice interview questions across multiple categories and difficulty levels</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Search className="w-4 h-4 text-white" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-16 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="appearance-none w-full md:w-48 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all duration-200"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="appearance-none w-full md:w-40 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all duration-200"
            >
              {difficulties.map((diff) => (
                <option key={diff.id} value={diff.id}>{diff.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-8">
            <LoadingCard message="Loading questions..." />
          </div>
        ) : data?.questions?.length > 0 ? (
          data.questions.map((question) => {
            const CategoryIcon = getCategoryIcon(question.category)
            const isExpanded = selectedQuestion === question._id
            
            return (
              <div 
                key={question._id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all duration-300 cursor-pointer overflow-hidden" 
                onClick={() => setSelectedQuestion(isExpanded ? null : question._id)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-11 h-11 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-800/30">
                        <CategoryIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                            question.difficulty === 'easy' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                              : question.difficulty === 'medium'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {question.difficulty}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-bold">
                            {question.category}
                          </span>
                          {question.isAIGenerated && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-bold">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 leading-snug">
                          {question.text}
                        </h3>
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {question.tags.map((tag, index) => (
                              <span key={index} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex-shrink-0 ml-3">
                      <Eye className="w-3.5 h-3.5" />
                      {isExpanded ? 'Hide' : 'View'}
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4">
                    {question.hints && question.hints.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">Hints</h4>
                        <ul className="space-y-1.5">
                          {question.hints.map((hint, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="text-amber-500 mt-0.5">•</span>
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {question.expectedAnswer && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Expected Answer</h4>
                        <div className="text-sm text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 leading-relaxed">
                          {question.expectedAnswer}
                        </div>
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Explanation</h4>
                        <div className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200/60 dark:border-blue-800/40 leading-relaxed">
                          {question.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Questions Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button
              key={i}
              className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-200 ${
                i + 1 === data.pagination.page
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Questions
