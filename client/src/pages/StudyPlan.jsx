import { useState, useCallback, useMemo } from 'react'
import { Card, Button, Badge, ProgressBar } from '../components/ui'
import {
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Plus,
  Trash2,
  RotateCcw,
  Calendar,
  Target,
  Flame,
  Star,
  TrendingUp,
  Sparkles,
  Award,
  Zap,
  Brain,
  ChevronDown,
  ChevronUp,
  X,
  GripVertical,
} from 'lucide-react'

const DEFAULT_TOPICS = [
  { id: '1', title: 'Data Structures & Algorithms', category: 'Technical', emoji: '🧩', subtopics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'] },
  { id: '2', title: 'System Design', category: 'Technical', emoji: '🏗️', subtopics: ['Scalability', 'Load Balancing', 'Caching', 'Database Design', 'Microservices'] },
  { id: '3', title: 'Behavioral Questions', category: 'Soft Skills', emoji: '💬', subtopics: ['STAR Method', 'Leadership', 'Conflict Resolution', 'Teamwork', 'Failure Stories'] },
  { id: '4', title: 'JavaScript/React', category: 'Technical', emoji: '⚛️', subtopics: ['Closures', 'Promises', 'Hooks', 'State Management', 'Performance'] },
  { id: '5', title: 'SQL & Databases', category: 'Technical', emoji: '🗄️', subtopics: ['Joins', 'Indexing', 'Normalization', 'Transactions', 'NoSQL'] },
  { id: '6', title: 'Communication Skills', category: 'Soft Skills', emoji: '🎙️', subtopics: ['Clarity', 'Active Listening', 'Presentation', 'Body Language'] },
]

const STORAGE_KEY = 'study-plan-data'

const loadPlan = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

const savePlan = (plan) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
}

const StudyPlan = () => {
  const saved = loadPlan()
  const [topics, setTopics] = useState(saved?.topics || DEFAULT_TOPICS.map(t => ({
    ...t,
    subtopics: t.subtopics.map(s => ({ name: s, completed: false, lastStudied: null })),
  })))
  const [streak, setStreak] = useState(saved?.streak || 0)
  const [lastStudyDate, setLastStudyDate] = useState(saved?.lastStudyDate || null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTopic, setNewTopic] = useState('')
  const [newSubtopics, setNewSubtopics] = useState('')
  const [filter, setFilter] = useState('all')
  const [expandedTopics, setExpandedTopics] = useState(new Set())

  const persistState = useCallback((newTopics, newStreak, newDate) => {
    const state = { topics: newTopics || topics, streak: newStreak ?? streak, lastStudyDate: newDate || lastStudyDate }
    savePlan(state)
  }, [topics, streak, lastStudyDate])

  const toggleExpand = (topicId) => {
    setExpandedTopics(prev => {
      const next = new Set(prev)
      if (next.has(topicId)) next.delete(topicId)
      else next.add(topicId)
      return next
    })
  }

  const toggleSubtopic = (topicId, subIndex) => {
    const updated = topics.map(t => {
      if (t.id !== topicId) return t
      const subs = t.subtopics.map((s, i) => {
        if (i !== subIndex) return s
        return { ...s, completed: !s.completed, lastStudied: !s.completed ? new Date().toISOString() : s.lastStudied }
      })
      return { ...t, subtopics: subs }
    })

    const today = new Date().toDateString()
    let newStreak = streak
    let newDate = lastStudyDate
    if (lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      newStreak = lastStudyDate === yesterday ? streak + 1 : 1
      newDate = today
      setStreak(newStreak)
      setLastStudyDate(newDate)
    }

    setTopics(updated)
    persistState(updated, newStreak, newDate)
  }

  const addTopic = () => {
    if (!newTopic.trim()) return
    const subs = newSubtopics.split(',').map(s => s.trim()).filter(Boolean).map(name => ({
      name, completed: false, lastStudied: null,
    }))
    const topic = {
      id: Date.now().toString(),
      title: newTopic,
      category: 'Custom',
      emoji: '📌',
      subtopics: subs.length ? subs : [{ name: 'General', completed: false, lastStudied: null }],
    }
    const updated = [...topics, topic]
    setTopics(updated)
    setNewTopic('')
    setNewSubtopics('')
    setShowAddForm(false)
    persistState(updated)
  }

  const removeTopic = (topicId) => {
    const updated = topics.filter(t => t.id !== topicId)
    setTopics(updated)
    persistState(updated)
  }

  const resetProgress = () => {
    const reset = topics.map(t => ({
      ...t,
      subtopics: t.subtopics.map(s => ({ ...s, completed: false, lastStudied: null })),
    }))
    setTopics(reset)
    setStreak(0)
    setLastStudyDate(null)
    persistState(reset, 0, null)
  }

  // Stats
  const totalSubtopics = topics.reduce((sum, t) => sum + t.subtopics.length, 0)
  const completedSubtopics = topics.reduce((sum, t) => sum + t.subtopics.filter(s => s.completed).length, 0)
  const overallProgress = totalSubtopics ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0
  const categories = [...new Set(topics.map(t => t.category))]

  const filteredTopics = filter === 'all' ? topics :
    filter === 'incomplete' ? topics.filter(t => t.subtopics.some(s => !s.completed)) :
    topics.filter(t => t.category === filter)

  // Spaced repetition — items studied > 3 days ago
  const needsReview = useMemo(() => topics.flatMap(t =>
    t.subtopics.filter(s => s.completed && s.lastStudied &&
      (Date.now() - new Date(s.lastStudied).getTime()) > 3 * 86400000
    ).map(s => ({ topic: t.title, subtopic: s.name, lastStudied: s.lastStudied }))
  ), [topics])

  const getCategoryGradient = (category) => {
    const gradients = {
      'Technical': 'from-blue-500 to-indigo-600',
      'Soft Skills': 'from-pink-500 to-rose-600',
      'Custom': 'from-violet-500 to-purple-600',
    }
    return gradients[category] || 'from-gray-500 to-gray-600'
  }

  const getCategoryBadge = (category) => {
    const variants = { 'Technical': 'blue', 'Soft Skills': 'emerald', 'Custom': 'purple' }
    return variants[category] || 'gray'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 md:p-10 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              Personalized Study Tracker
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Study Plan</h1>
            <p className="text-purple-100 max-w-lg text-lg leading-relaxed">
              Track your progress, build study streaks, and stay on top of every topic with spaced repetition.
            </p>
          </div>
          <div className="flex gap-3 md:gap-4">
            {[
              { label: 'Progress', value: `${overallProgress}%`, icon: Target },
              { label: 'Streak', value: streak, icon: Flame, highlight: streak >= 3 },
              { label: 'Done', value: `${completedSubtopics}/${totalSubtopics}`, icon: CheckCircle },
            ].map(stat => (
              <div key={stat.label} className={`text-center backdrop-blur-sm rounded-2xl px-5 py-3.5 min-w-[80px] ${stat.highlight ? 'bg-amber-500/20 ring-1 ring-amber-400/40' : 'bg-white/10'}`}>
                <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.highlight ? 'text-amber-300' : 'text-purple-200'}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-[11px] text-purple-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress in Hero */}
        <div className="relative mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-200">Overall Completion</span>
            <span className="text-sm font-bold text-white">{overallProgress}%</span>
          </div>
          <div className="h-3 bg-white/15 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={resetProgress}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 transition-all text-sm font-medium"
            title="Reset all progress"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 rounded-xl">
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Close' : 'Add Topic'}
        </Button>
      </div>

      {/* Add Topic Form */}
      {showAddForm && (
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
          <div className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">Add Custom Topic</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Create a new topic to track your learning progress</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Topic Name</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="e.g., Machine Learning, Cloud Architecture..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subtopics</label>
                <input
                  type="text"
                  value={newSubtopics}
                  onChange={e => setNewSubtopics(e.target.value)}
                  placeholder="Comma-separated, e.g., Neural Networks, NLP, Computer Vision"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button onClick={addTopic} className="rounded-xl">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Topic
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${overallProgress}%`, icon: Target, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400' },
          { label: 'Completed', value: `${completedSubtopics}/${totalSubtopics}`, icon: CheckCircle, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400' },
          { label: 'Day Streak', value: streak, icon: Flame, gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400', highlight: streak >= 3 },
          { label: 'Needs Review', value: needsReview.length, icon: Brain, gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-400' },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.bg} border ${stat.border} relative overflow-hidden`}>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
                <p className={`text-xs font-medium ${stat.text} opacity-80 truncate`}>{stat.label}</p>
              </div>
            </div>
            {stat.highlight && (
              <div className="absolute top-2 right-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'incomplete', ...categories].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              filter === f
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f === 'all' ? '📋 All' : f === 'incomplete' ? '⏳ Incomplete' : f === 'Technical' ? '💻 Technical' : f === 'Soft Skills' ? '🤝 Soft Skills' : `📌 ${f}`}
          </button>
        ))}
      </div>

      {/* Spaced Repetition Review */}
      {needsReview.length > 0 && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Spaced Repetition Review</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">These subtopics were last studied over 3 days ago — time for a refresh!</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {needsReview.slice(0, 12).map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-800"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="text-amber-500 dark:text-amber-500 font-semibold">{item.topic}:</span> {item.subtopic}
                </span>
              ))}
              {needsReview.length > 12 && (
                <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-sm font-medium">
                  +{needsReview.length - 12} more
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Topics List */}
      <div className="space-y-5">
        {filteredTopics.map(topic => {
          const completed = topic.subtopics.filter(s => s.completed).length
          const progress = Math.round((completed / topic.subtopics.length) * 100)
          const isExpanded = expandedTopics.has(topic.id) || expandedTopics.size === 0
          const isDone = progress === 100

          return (
            <Card key={topic.id} className={`relative overflow-hidden transition-all duration-300 ${isDone ? 'ring-2 ring-emerald-200 dark:ring-emerald-800' : ''}`}>
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(topic.category)}`} />

              <div className="pt-1">
                {/* Header — clickable to expand */}
                <button
                  onClick={() => toggleExpand(topic.id)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      isDone
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                    }`}>
                      {isDone ? <Award className="w-6 h-6 text-white" /> : <span>{topic.emoji || '📚'}</span>}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getCategoryBadge(topic.category)} className="text-xs">
                          {topic.category}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {completed}/{topic.subtopics.length} completed
                        </span>
                        {isDone && (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Done!</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {/* Circular Progress Indicator */}
                    <div className="relative w-12 h-12 hidden sm:flex items-center justify-center">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3"
                          className="stroke-gray-200 dark:stroke-gray-700" />
                        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3"
                          strokeDasharray={`${progress * 0.94} 100`}
                          strokeLinecap="round"
                          className={isDone ? 'stroke-emerald-500' : 'stroke-purple-500'} />
                      </svg>
                      <span className={`absolute text-[10px] font-bold ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="text-gray-400 dark:text-gray-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* Linear Progress Bar (for mobile) */}
                <div className="mt-3 sm:hidden">
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Subtopics - expandable */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.subtopics.map((sub, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); toggleSubtopic(topic.id, i) }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all group/sub ${
                            sub.completed
                              ? 'bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/50'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                        >
                          {sub.completed
                            ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover/sub:text-purple-400 shrink-0 transition-colors" />
                          }
                          <span className={`font-medium ${sub.completed ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-gray-700 dark:text-gray-300'}`}>
                            {sub.name}
                          </span>
                          {sub.completed && sub.lastStudied && (
                            <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                              {new Date(sub.lastStudied).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Topic Actions */}
                    <div className="flex justify-end mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => removeTopic(topic.id)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove Topic
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <Card className="border-dashed border-2 dark:border-gray-600">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No topics found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              {filter !== 'all' ? 'Try selecting a different filter' : 'Add your first study topic to get started!'}
            </p>
            {filter !== 'all' ? (
              <Button variant="outline" onClick={() => setFilter('all')}>Show All Topics</Button>
            ) : (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Add Your First Topic
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Motivation Footer */}
      {completedSubtopics > 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {overallProgress === 100
              ? '🎉 You\'ve completed everything! Amazing work — you\'re interview-ready!'
              : overallProgress >= 75
                ? '🚀 Almost there! Keep up the incredible momentum!'
                : overallProgress >= 50
                  ? '💪 Halfway done! You\'re making great progress!'
                  : '✨ Great start! Consistency is key — keep going!'}
          </p>
        </div>
      )}
    </div>
  )
}

export default StudyPlan
