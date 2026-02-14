import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { communityApi } from '../services/featureApi'
import { useAuthStore } from '../store/authStore'
import { notifyPostCreated } from '../hooks/useNotifications'
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

// Helper to get a valid avatar URL
const getAvatarUrl = (avatar, name = 'User') => {
  if (avatar && avatar !== 'default-avatar.png' && avatar.startsWith('http')) {
    return avatar
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`
}

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const [commentInputs, setCommentInputs] = useState({})
  const [expandedComments, setExpandedComments] = useState({})
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

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
      notifyPostCreated()
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

  // Bookmark post mutation
  const bookmarkPostMutation = useMutation({
    mutationFn: (id) => communityApi.bookmarkPost ? communityApi.bookmarkPost(id) : Promise.resolve(),
    onSuccess: () => {
      toast.success('Bookmark updated!')
      queryClient.invalidateQueries(['community', 'feed'])
    },
    onError: () => {
      toast.error('Could not bookmark post')
    }
  })

  // Comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }) => communityApi.addComment(postId, { content }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries(['community', 'feed'])
      setCommentInputs(prev => ({ ...prev, [vars.postId]: '' }))
      toast.success('Comment added!')
    },
    onError: () => {
      toast.error('Failed to add comment')
    }
  })

  // Share post (copy link)
  const sharePost = (postId) => {
    const url = `${window.location.origin}/community?post=${postId}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!')
    }).catch(() => {
      toast.error('Could not copy link')
    })
  }

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
    avatar: getAvatarUrl(post.author?.avatar, post.author?.firstName || 'User'),
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
    avatar: getAvatarUrl(m.user?.avatar || m.avatar, m.name || 'Mentor'),
    role: m.company ? `${m.experience || ''} @ ${m.company}` : (m.experience || 'Mentor'),
    expertise: m.specializations || [],
    rating: m.rating || 0,
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
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-5 md:p-8 text-white shadow-2xl">
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
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Community Hub</h1>
          <p className="text-purple-100 text-base md:text-lg max-w-2xl">
            Connect with fellow developers, share experiences, and learn from each other's interview journeys.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 md:gap-6">
            <div>
              <div className="text-2xl md:text-3xl font-bold">{posts.length}</div>
              <div className="text-xs md:text-sm text-purple-100">Posts</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">{mentors.length}</div>
              <div className="text-xs md:text-sm text-purple-100">Mentors</div>
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
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
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
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your interview experience, ask questions, or help others..."
                  className="w-full p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 resize-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <LinkIcon className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <Smile className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  <Button icon={Send} disabled={!newPost.trim() || createPostMutation.isPending} onClick={handlePostSubmit}>Post</Button>
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
                      onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, post.author) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{post.author}</span>
                        {post.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-slate-400">·</span>
                        <span className="text-sm text-slate-500">{post.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{post.role}</p>
                      <p className="text-slate-700 dark:text-slate-300 mb-4">{post.content}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button onClick={() => likePostMutation.mutate(post.id)} className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        <button 
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-500 transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                          {post.comments}
                        </button>
                        <button 
                          onClick={() => sharePost(post.id)}
                          className="flex items-center gap-2 text-sm text-slate-500 hover:text-green-500 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          Share
                        </button>
                        <button 
                          onClick={() => bookmarkPostMutation.mutate(post.id)}
                          className="ml-auto text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Inline comment form */}
                      {expandedComments[post.id] && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={commentInputs[post.id] || ''}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && commentInputs[post.id]?.trim()) {
                                    addCommentMutation.mutate({ postId: post.id, content: commentInputs[post.id] })
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  if (commentInputs[post.id]?.trim()) {
                                    addCommentMutation.mutate({ postId: post.id, content: commentInputs[post.id] })
                                  }
                                }}
                                disabled={!commentInputs[post.id]?.trim() || addCommentMutation.isPending}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )) : (
                <Card>
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Posts Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400">Be the first to share something with the community!</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              {(discussionsData || []).length > 0 ? discussionsData.map((discussion, index) => (
                <Card key={index} hover>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{discussion.title || discussion.topic}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{discussion.description || discussion.content}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{discussion.participantCount || discussion.participants?.length || 0} participants</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{discussion.replyCount || discussion.replies?.length || 0} replies</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card>
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Discussions Yet</h3>
                    <p className="text-slate-600 dark;text-slate-400">Start a discussion by creating a post!</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Success Stories Tab (uses same feed with type filter) */}
          {activeTab === 'success' && (
            <div className="space-y-6">
              {posts.length > 0 ? posts.map((post) => (
                <Card key={post.id} hover>
                  <div className="flex gap-4">
                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover flex-shrink-0" onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, post.author) }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{post.author}</span>
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-slate-500">{post.time}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <button onClick={() => likePostMutation.mutate(post.id)} className={`flex items-center gap-2 text-sm ${post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card>
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Success Stories Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400">Share your interview success with the community!</p>
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
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(null, mentor.name) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">{mentor.name}</h3>
                        {mentor.available ? (
                          <Badge variant="success" size="sm">Available</Badge>
                        ) : (
                          <Badge variant="default" size="sm">Busy</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{mentor.role}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.expertise.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{mentor.rating}</span>
                          </div>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-500 dark:text-slate-400">{mentor.sessions} sessions</span>
                        </div>
                        <Button size="sm" variant={mentor.available ? 'primary' : 'outline'} disabled={!mentor.available}>
                          {mentor.available ? 'Book' : 'Notify Me'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <Card>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Mentors Available</h3>
                    <p className="text-slate-600 dark:text-slate-400">Check back later for available mentors!</p>
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
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <Card.Title>Trending Topics</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              {trendingTopics.length > 0 ? (
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div 
                      key={topic.tag}
                      className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">#{topic.tag}</span>
                      </div>
                      <span className="text-xs text-slate-400">{topic.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">No trending topics yet</p>
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
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">Start contributing to appear here!</p>
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
              <Button variant="secondary" className="w-full" onClick={() => {
                navigator.clipboard.writeText(window.location.origin)
                toast.success('Invite link copied!')
              }}>
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