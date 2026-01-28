import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Button, Card, Spinner, Badge } from '../components/ui'
import { Users, MessageSquare, Play, Clock, TrendingUp, History } from 'lucide-react'

const GroupDiscussion = () => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [categories, setCategories] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTopic, setSelectedTopic] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchTopics()
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      const [catRes, histRes] = await Promise.all([
        api.get('/gd/categories'),
        api.get('/gd/sessions/history?limit=5')
      ])
      setCategories(catRes.data.data || [])
      setHistory(histRes.data.data?.sessions || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopics = async () => {
    try {
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''
      const response = await api.get(`/gd/topics${params}`)
      setTopics(response.data.data || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  const startSession = async () => {
    if (!selectedTopic) return
    try {
      const response = await api.post('/gd/sessions/start', {
        topicId: selectedTopic._id,
        mode: 'ai-participants',
        duration: 15
      })
      navigate(`/gd/session/${response.data.data.sessionId}`, {
        state: { sessionData: response.data.data }
      })
    } catch (error) {
      console.error('Error starting session:', error)
      alert(error.response?.data?.message || 'Failed to start session')
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Group Discussion Practice</h1>
        <p className="text-gray-600 mt-1">Practice GD with AI participants and get detailed feedback</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Select a Topic</h2>
          <div className="space-y-3">
            {topics.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No topics available</p>
              </Card>
            ) : (
              topics.map((topic) => (
                <button
                  key={topic._id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTopic?._id === topic._id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDifficultyColor(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                        <Badge variant="secondary">{topic.category}</Badge>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Topic Details */}
          {selectedTopic && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Topic Details</h3>
              <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedTopic.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{selectedTopic.description}</p>
              
              {selectedTopic.keyPoints?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Points:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedTopic.keyPoints.slice(0, 4).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary-500">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4" />
                <span>15 minutes session</span>
              </div>

              <Button fullWidth onClick={startSession}>
                <Play className="w-4 h-4 mr-2" />
                Start GD Session
              </Button>
            </Card>
          )}

          {/* Recent History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Sessions</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-4">
                <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No sessions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((session) => (
                  <div key={session._id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm truncate">{session.topicTitle}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(session.completedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-sm font-medium">{session.feedback?.overallScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GroupDiscussion
