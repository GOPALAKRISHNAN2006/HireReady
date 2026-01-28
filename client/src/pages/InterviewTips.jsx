import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { tipsApi } from '../services/featureApi'
import toast from 'react-hot-toast'
import { 
  Lightbulb, 
  Star, 
  BookmarkPlus,
  ChevronRight,
  ChevronDown,
  ThumbsUp,
  Share2,
  MessageCircle,
  Sparkles,
  Target,
  Brain,
  Clock,
  Zap,
  CheckCircle,
  AlertTriangle,
  Users,
  Code2,
  Mic,
  Video,
  Eye,
  Heart,
  Filter,
  Search
} from 'lucide-react'

const InterviewTips = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedTip, setExpandedTip] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const categories = [
    { id: 'all', name: 'All Tips', icon: Sparkles },
    { id: 'technical', name: 'Technical', icon: Code2 },
    { id: 'behavioral', name: 'Behavioral', icon: Users },
    { id: 'communication', name: 'Communication', icon: Mic },
    { id: 'preparation', name: 'Preparation', icon: Target },
    { id: 'general', name: 'General', icon: Brain },
  ]

  // Fetch tips
  const { data: tipsData, isLoading: tipsLoading } = useQuery({
    queryKey: ['tips', selectedCategory],
    queryFn: async () => {
      try {
        const params = { limit: 20 }
        if (selectedCategory !== 'all') params.category = selectedCategory
        const response = await tipsApi.getTips(params)
        return response.data.data
      } catch (e) {
        return { tips: [] }
      }
    },
  })

  // Fetch featured tips
  const { data: featuredData } = useQuery({
    queryKey: ['tips', 'featured'],
    queryFn: async () => {
      try {
        const response = await tipsApi.getFeatured({ limit: 3 })
        return response.data.data.tips
      } catch (e) {
        return []
      }
    },
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['tips', 'categories'],
    queryFn: async () => {
      try {
        const response = await tipsApi.getCategories()
        return response.data.data.categories
      } catch (e) {
        return []
      }
    },
  })

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: (id) => tipsApi.likeTip(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tips'])
      toast.success('Updated!')
    }
  })

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: (id) => tipsApi.bookmarkTip(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tips'])
      toast.success('Bookmark updated!')
    }
  })

  // Map API tips to display format
  const mapTipToDisplay = (tip) => ({
    ...tip,
    id: tip._id,
    likes: tip.likeCount || tip.likes?.length || 0,
    saves: tip.bookmarkCount || tip.bookmarks?.length || 0,
    author: tip.authorName || 'HireReady Team',
  })

  // Use only API data
  const tips = tipsData?.tips?.map(mapTipToDisplay) || []

  const filteredTips = tips.filter(tip => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory
    const matchesSearch = tip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Essential': return 'danger'
      case 'Important': return 'warning'
      default: return 'default'
    }
  }

  const featuredTips = featuredData?.map(mapTipToDisplay) || tips.slice(0, 3)
  const featuredTip = featuredTips[0] || null

  // Loading state
  if (tipsLoading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><LoadingCard /></div>
          <div><LoadingCard /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          
          {/* Floating light bulbs */}
          <div className="absolute top-10 right-20 opacity-30">
            <Lightbulb className="w-12 h-12 animate-float text-yellow-200" />
          </div>
          <div className="absolute bottom-10 right-40 opacity-20">
            <Lightbulb className="w-8 h-8 animate-float" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute top-20 left-1/3 opacity-20">
            <Sparkles className="w-10 h-10 animate-pulse-slow" />
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
            <Lightbulb className="w-4 h-4 mr-2" />
            Expert Insights
          </div>
          <h1 className="text-4xl font-bold mb-3">Interview Tips & Tricks</h1>
          <p className="text-orange-100 text-lg max-w-2xl">
            Curated advice from top tech professionals to help you ace your interviews.
          </p>

          {/* Stats */}
          <div className="mt-6 flex gap-6">
            <div>
              <div className="text-3xl font-bold">{tips.length}+</div>
              <div className="text-sm text-orange-100">Expert Tips</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm text-orange-100">Candidates Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-orange-100">Found Helpful</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Tip */}
      {featuredTip && selectedCategory === 'all' && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 border-2">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="warning">Featured</Badge>
                <Badge variant={getDifficultyColor(featuredTip.difficulty)}>{featuredTip.difficulty}</Badge>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{featuredTip.title}</h3>
              <p className="text-gray-600 mb-4">{featuredTip.content}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" /> {featuredTip.likes.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <BookmarkPlus className="w-4 h-4" /> {featuredTip.saves.toLocaleString()}
                </span>
                <span className="text-amber-600 font-medium">By {featuredTip.author}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tips Grid */}
      {filteredTips.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTips.map((tip) => (
            <Card 
              key={tip.id} 
              hover 
              className={`cursor-pointer transition-all duration-300 ${
                expandedTip === tip.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tip.category === 'technical' ? 'bg-blue-100 text-blue-600' :
                  tip.category === 'behavioral' ? 'bg-green-100 text-green-600' :
                  tip.category === 'communication' ? 'bg-purple-100 text-purple-600' :
                  tip.category === 'preparation' ? 'bg-amber-100 text-amber-600' :
                  'bg-pink-100 text-pink-600'
                }`}>
                  {tip.category === 'technical' && <Code2 className="w-6 h-6" />}
                  {tip.category === 'behavioral' && <Users className="w-6 h-6" />}
                  {tip.category === 'communication' && <Mic className="w-6 h-6" />}
                  {tip.category === 'preparation' && <Target className="w-6 h-6" />}
                  {tip.category === 'mindset' && <Brain className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getDifficultyColor(tip.difficulty)} size="sm">
                      {tip.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{tip.summary}</p>

                  {/* Expanded Content */}
                  {expandedTip === tip.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-up">
                      <p className="text-gray-600 mb-4">{tip.content}</p>
                      {tip.tags && tip.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tip.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" /> {(tip.likes || 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookmarkPlus className="w-3.5 h-3.5" /> {tip.saves || 0}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedTip === tip.id ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tips Available</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search query' : 'Check back later for new interview tips!'}
            </p>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 group hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Video Tutorials</h4>
              <p className="text-sm text-gray-500">Watch expert demonstrations</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 group hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Checklists</h4>
              <p className="text-sm text-gray-500">Pre-interview checklists</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 group hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Community</h4>
              <p className="text-sm text-gray-500">Ask the community</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default InterviewTips
