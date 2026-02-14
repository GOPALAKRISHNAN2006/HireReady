import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  Code2, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Zap,
  Brain,
  Terminal,
  CheckCircle,
  XCircle,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  Monitor,
  Laptop,
  Coffee,
  Rocket,
  Target,
  Award,
  Trophy,
  TrendingUp,
  Star,
  Settings
} from 'lucide-react'

const MockInterviewLab = () => {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isStarting, setIsStarting] = useState(false)

  // Fetch user's lab stats
  const { data: statsData } = useQuery({
    queryKey: ['lab-stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/analytics/summary')
        return response.data?.data?.stats || {}
      } catch (e) {
        return {}
      }
    }
  })

  // Fetch recent sessions
  const { data: sessionsData } = useQuery({
    queryKey: ['recent-sessions'],
    queryFn: async () => {
      try {
        const response = await api.get('/interviews?limit=5&status=completed')
        return response.data?.data?.interviews || []
      } catch (e) {
        return []
      }
    }
  })

  // Create interview mutation
  const createInterviewMutation = useMutation({
    mutationFn: async (mode) => {
      const modeSettings = {
        'speed-round': { category: 'mixed', difficulty: 'easy', totalQuestions: 10, timeLimitMinutes: 10 },
        'deep-dive': { category: 'behavioral', difficulty: 'hard', totalQuestions: 5, timeLimitMinutes: 45 },
        'coding-challenge': { category: 'dsa', difficulty: 'medium', totalQuestions: 3, timeLimitMinutes: 30 },
        'system-design': { category: 'system-design', difficulty: 'hard', totalQuestions: 2, timeLimitMinutes: 60 },
      }
      const settings = modeSettings[mode] || modeSettings['speed-round']
      const response = await api.post('/interviews', { ...settings, type: 'practice', mode: 'text' })
      return response.data
    },
    onSuccess: (data) => {
      const interview = data.data?.interview || data.interview
      if (interview) {
        toast.success('Interview started!')
        navigate(`/interview/${interview._id || interview.id}`)
      } else {
        toast.error('Failed to create interview session')
        setIsStarting(false)
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to start interview')
      setIsStarting(false)
    }
  })

  const handleStartInterview = () => {
    if (!selectedMode) {
      toast.error('Please select an interview mode')
      return
    }
    setIsStarting(true)
    createInterviewMutation.mutate(selectedMode)
  }

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const interviewModes = [
    {
      id: 'speed-round',
      title: 'Speed Round',
      description: 'Quick-fire questions, 30 seconds each',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/30',
      difficulty: 'Easy',
      duration: '10 mins',
      questions: 20,
    },
    {
      id: 'deep-dive',
      title: 'Deep Dive',
      description: 'In-depth technical discussions',
      icon: Brain,
      gradient: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-purple-500/30',
      difficulty: 'Hard',
      duration: '45 mins',
      questions: 5,
    },
    {
      id: 'coding-challenge',
      title: 'Coding Challenge',
      description: 'Live coding with AI interviewer',
      icon: Code2,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/30',
      difficulty: 'Medium',
      duration: '30 mins',
      questions: 3,
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Architecture and scalability focus',
      icon: Monitor,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/30',
      difficulty: 'Expert',
      duration: '60 mins',
      questions: 2,
    },
  ]

  // Transform API sessions to display format
  const recentSessions = sessionsData?.map(s => ({
        id: s._id,
        mode: s.category || 'General',
        score: s.overallScore || 0,
        date: new Date(s.completedAt || s.createdAt).toLocaleDateString(),
        status: s.status
      })) || []

  const achievements = [
    { icon: Star, label: 'First Timer', unlocked: statsData?.totalInterviews >= 1 },
    { icon: Zap, label: 'Speed Demon', unlocked: statsData?.totalInterviews >= 10 },
    { icon: Target, label: 'Sharpshooter', unlocked: statsData?.averageScore >= 80 },
    { icon: Trophy, label: 'Champion', unlocked: statsData?.highestScore >= 95 },
  ]

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          {/* Floating code snippets */}
          <div className="absolute top-10 right-20 text-purple-300/20 font-mono text-xs animate-float">
            {'{ code: "perfect" }'}
          </div>
          <div className="absolute bottom-10 left-20 text-blue-300/20 font-mono text-xs animate-float" style={{ animationDelay: '2s' }}>
            {'function interview() { }'}
          </div>
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
              <Terminal className="w-4 h-4 mr-2" />
              Interactive Lab Environment
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 flex items-center gap-3">
              Mock Interview Lab
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </h1>
            <p className="text-purple-200 text-lg max-w-xl">
              Practice in a realistic interview environment with AI-powered feedback and real-time coding challenges.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold">{statsData?.totalInterviews || 0}</div>
              <div className="text-sm text-purple-200">Sessions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold">{statsData?.averageScore || 0}%</div>
              <div className="text-sm text-purple-200">Avg Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold">{Math.round((statsData?.totalPracticeTime || 0) / 60)}h</div>
              <div className="text-sm text-purple-200">Practice</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Mode Selection */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-indigo-500" />
          Choose Your Challenge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {interviewModes.map((mode) => (
            <Card 
              key={mode.id} 
              hover 
              className={`cursor-pointer group relative overflow-hidden transition-all duration-300 ${
                selectedMode === mode.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
              }`}
              onClick={() => setSelectedMode(mode.id)}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${mode.gradient} rounded-2xl flex items-center justify-center shadow-lg ${mode.shadow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <mode.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{mode.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{mode.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={mode.difficulty === 'Easy' ? 'success' : mode.difficulty === 'Medium' ? 'warning' : mode.difficulty === 'Hard' ? 'danger' : 'purple'}>
                    {mode.difficulty}
                  </Badge>
                  <Badge variant="default">
                    <Clock className="w-3 h-3 mr-1" />
                    {mode.duration}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{mode.questions} questions</span>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${selectedMode === mode.id ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Start Session Panel */}
      {selectedMode && (
        <Card className="bg-gradient-to-r from-slate-50 to-white border-2 border-dashed border-indigo-200 animate-scale-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse-slow">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Start?</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {interviewModes.find(m => m.id === selectedMode)?.title} - {interviewModes.find(m => m.id === selectedMode)?.duration}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-slate-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </button>
              <button className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <Button 
                size="lg" 
                icon={Play}
                onClick={handleStartInterview}
                disabled={isStarting}
              >
                {isStarting ? 'Starting...' : 'Start Interview'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title>Recent Sessions</Card.Title>
            </Card.Header>
            <Card.Content>
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <Code2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{session.mode}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{session.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-xl font-bold ${session.score >= 85 ? 'text-green-500' : session.score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                            {session.score}%
                          </div>
                          <div className="text-xs text-slate-400">Score</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => navigate(`/interview/${session.id}/result`)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No interview sessions yet. Start your first interview above!
                </p>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Lab Achievements */}
        <Card>
          <Card.Header>
            <Card.Title>Lab Achievements</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl text-center transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100' 
                      : 'bg-slate-50 dark:bg-slate-800 opacity-50'
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30' 
                      : 'bg-slate-200'
                  }`}>
                    <achievement.icon className={`w-5 h-5 ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <p className={`text-sm font-medium ${achievement.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {achievement.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-3 mb-2">
                <Coffee className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-900 dark:text-white">Daily Goal</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '60%' }} />
                </div>
                <span className="text-sm font-medium text-amber-600">3/5</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-none">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Pro Tip</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Start with Speed Round to warm up, then move to Deep Dive sessions for more thorough practice. 
              Consistency is key - try to complete at least one session daily!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MockInterviewLab
