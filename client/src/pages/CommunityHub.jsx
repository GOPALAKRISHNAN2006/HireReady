import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { communityApi } from '../services/featureApi'
import toast from 'react-hot-toast'
import { 
  Users, 
  MessageCircle, 
  Heart,
  Share2,
  Send,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Award,
  Star,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  Link as LinkIcon,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Trophy,
  Flame,
  Target,
  UserPlus,
  Bell
} from 'lucide-react'

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const queryClient = useQueryClient()

  const tabs = [
    { id: 'feed', name: 'Feed', icon: Sparkles },
    { id: 'discussions', name: 'Discussions', icon: MessageCircle },
    { id: 'success', name: 'Success Stories', icon: Trophy },
    { id: 'mentors', name: 'Find Mentors', icon: Users },
  ]

  // Fetch community feed
  const { data: feedData, isLoading: feedLoading } = useQuery({
    queryKey: ['community', 'feed', activeTab],
    queryFn: async () => {
      try {
        const type = activeTab === 'success' ? 'success-story' : undefined
        const response = await communityApi.getFeed({ type, limit: 20 })
        return response.data.data
      } catch (e) {
        return { posts: [] }
      }
    },
    enabled: activeTab === 'feed' || activeTab === 'success'
  })

  // Fetch discussions
  const { data: discussionsData } = useQuery({
    queryKey: ['community', 'discussions'],
    queryFn: async () => {
      try {
        const response = await communityApi.getDiscussions()
        return response.data.data.discussions
      } catch (e) {
        return []
      }
    },
    enabled: activeTab === 'discussions'
  })

  // Fetch mentors
  const { data: mentorsData } = useQuery({
    queryKey: ['community', 'mentors'],
    queryFn: async () => {
      try {
        const response = await communityApi.getMentors()
        return response.data.data.mentors
      } catch (e) {
        return []
      }
    },
    enabled: activeTab === 'mentors'
  })

  // Fetch trending
  const { data: trendingData } = useQuery({
    queryKey: ['community', 'trending'],
    queryFn: async () => {
      try {
        const response = await communityApi.getTrending()
        return response.data.data
      } catch (e) {
        return { trendingPosts: [], popularTags: [] }
      }
    },
  })

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data) => communityApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['community', 'feed'])
      setNewPost('')
      toast.success('Post created!')
    },
    onError: () => {
      toast.error('Failed to create post')
    }
  })

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: (id) => communityApi.likePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['community', 'feed'])
    }
  })

  // Handle post submit
  const handlePostSubmit = () => {
    if (!newPost.trim()) return
    createPostMutation.mutate({
      title: newPost.slice(0, 50),
      content: newPost,
      type: 'discussion'
    })
  }

  // Map API posts to display format
  const mapPostToDisplay = (post) => ({
    ...post,
    id: post._id,
    author: post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Anonymous',
    role: post.author?.jobTitle || 'Community Member',
    avatar: post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.firstName || 'User')}`,
    verified: true,
    time: timeAgo(post.createdAt),
    likes: post.likeCount || post.likes?.length || 0,
    comments: post.commentCount || post.comments?.length || 0,
    shares: post.shares || 0,
    tags: post.tags || [],
    isLiked: post.isLiked || false,
  })

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  // Use only API data
  const posts = feedData?.posts?.map(mapPostToDisplay) || []

  const trendingTopics = trendingData?.popularTags?.map(t => ({ 
    tag: t.tag, 
    count: `${t.count} posts` 
  })) || []

  const mentors = mentorsData?.map(m => ({
    name: m.user ? `${m.user.firstName} ${m.user.lastName}` : m.name || 'Mentor',
    avatar: m.user?.avatar || m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'M')}`,
    role: `${m.experience || 'Experienced'} @ ${m.company || 'Tech Company'}`,
    expertise: m.specializations || ['Interview Prep'],
    rating: m.rating || 4.5,
    sessions: m.sessionsCompleted || 0,
    available: m.availability === 'available',
  })) || []

  // Loading state
  if (feedLoading && activeTab === 'feed') {
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
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          
          {/* Floating elements */}
          <div className="absolute top-10 right-40 opacity-20">
            <Users className="w-12 h-12 animate-float" />
          </div>
          <div className="absolute bottom-10 right-20 opacity-20">
            <MessageCircle className="w-8 h-8 animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
            <Users className="w-4 h-4 mr-2" />
            Join the Community
          </div>
          <h1 className="text-4xl font-bold mb-3">Community Hub</h1>
          <p className="text-purple-100 text-lg max-w-2xl">
            Connect with fellow developers, share experiences, and learn from each other's interview journeys.
          </p>

          <div className="mt-6 flex gap-6">
            <div>
              <div className="text-3xl font-bold">25K+</div>
              <div className="text-sm text-purple-100">Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5K+</div>
              <div className="text-sm text-purple-100">Active Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-purple-100">Mentors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                Y
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your interview experience, ask questions, or help others..."
                  className="w-full p-4 bg-white text-gray-900 rounded-xl border border-gray-200 resize-none focus:ring-2 focus:ring-primary-500 min-h-[100px] placeholder:text-gray-400"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <LinkIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <Button icon={Send} disabled={!newPost.trim()}>Post</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Feed */}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {posts.length > 0 ? posts.map((post) => (
                <Card key={post.id} hover>
                  <div className="flex gap-4">
                    <img 
                      src={post.avatar} 
                      alt={post.author}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{post.author}</span>
                        {post.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-gray-400">·</span>
                        <span className="text-sm text-gray-500">{post.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{post.role}</p>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                        <button className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                          {post.comments}
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500 transition-colors">
                          <Share2 className="w-5 h-5" />
                          {post.shares}
                        </button>
                        <button className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card>
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
                    <p className="text-gray-600">Be the first to share something with the community!</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Mentors Tab */}
          {activeTab === 'mentors' && (
            <div className="space-y-4">
              {mentors.length > 0 ? mentors.map((mentor, index) => (
                <Card key={index} hover>
                  <div className="flex items-start gap-4">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{mentor.name}</h3>
                        {mentor.available ? (
                          <Badge variant="success" size="sm">Available</Badge>
                        ) : (
                          <Badge variant="default" size="sm">Busy</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{mentor.role}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.expertise.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-medium">{mentor.rating}</span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">{mentor.sessions} sessions</span>
                      </div>
                    </div>
                    <Button variant={mentor.available ? 'primary' : 'outline'} disabled={!mentor.available}>
                      {mentor.available ? 'Book Session' : 'Notify Me'}
                    </Button>
                  </div>
                </Card>
              )) : (
                <Card>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Mentors Available</h3>
                    <p className="text-gray-600">Check back later for available mentors!</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <Card.Title>Trending Topics</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              {trendingTopics.length > 0 ? (
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div 
                      key={topic.tag}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 group-hover:text-primary-600 transition-colors">#{topic.tag}</span>
                      </div>
                      <span className="text-xs text-gray-400">{topic.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No trending topics yet</p>
              )}
            </Card.Content>
          </Card>

          {/* Top Contributors */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <Card.Title>Top Contributors</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-gray-500 py-4">Start contributing to appear here!</p>
            </Card.Content>
          </Card>

          {/* Join Community CTA */}
          <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0">
            <div className="text-center">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Invite Friends</h3>
              <p className="text-sm text-purple-100 mb-4">
                Earn 100 points for each friend who joins!
              </p>
              <Button variant="secondary" className="w-full">
                Share Invite Link
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CommunityHub