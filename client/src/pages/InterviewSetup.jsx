import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useInterviewStore } from '../store/interviewStore'
import { Card, Button, Badge } from '../components/ui'
import api from '../services/api'
import { 
  PlayCircle, 
  Clock, 
  Target, 
  Zap,
  Brain,
  Code,
  Users,
  Database,
  Server,
  MessageSquare
} from 'lucide-react'

const InterviewSetup = () => {
  const navigate = useNavigate()
  const { setSettings, settings, startInterview } = useInterviewStore()
  
  const [localSettings, setLocalSettings] = useState({
    category: settings.category,
    difficulty: settings.difficulty,
    questionCount: settings.questionCount,
    timeLimit: settings.timeLimit,
    type: settings.type,
  })

  const categories = [
    { id: 'general', name: 'General', icon: Target, description: 'Mixed questions across all topics' },
    { id: 'dsa', name: 'DSA', icon: Code, description: 'Data Structures & Algorithms' },
    { id: 'web-development', name: 'Web Dev', icon: Server, description: 'Frontend, Backend, Full-stack' },
    { id: 'behavioral', name: 'Behavioral', icon: Users, description: 'Soft skills & situational questions' },
    { id: 'system-design', name: 'System Design', icon: Database, description: 'Architecture & scalability' },
    { id: 'machine-learning', name: 'ML/AI', icon: Brain, description: 'Machine Learning & AI concepts' },
  ]

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'success', description: 'Great for beginners' },
    { id: 'medium', name: 'Medium', color: 'warning', description: 'Intermediate level' },
    { id: 'hard', name: 'Hard', color: 'danger', description: 'Advanced challenges' },
  ]

  const questionCounts = [5, 10, 15, 20]
  const timeLimits = [
    { value: null, label: 'No Limit' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' },
  ]

  // Create interview mutation
  const createInterviewMutation = useMutation({
    mutationFn: async (settings) => {
      // Map settings to API format
      const payload = {
        category: settings.category,
        difficulty: settings.difficulty,
        totalQuestions: settings.questionCount,
        type: settings.type || 'practice',
        timeLimitMinutes: settings.timeLimit || undefined
      }
      const response = await api.post('/interviews', payload)
      return response.data
    },
    onSuccess: (data) => {
      setSettings(localSettings)
      const interview = data.data?.interview || data.interview
      startInterview(interview)
      toast.success('Interview started!')
      navigate(`/interview/${interview._id || interview.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to start interview')
    },
  })

  const handleStartInterview = () => {
    createInterviewMutation.mutate(localSettings)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your Interview</h1>
        <p className="text-gray-600">Customize your practice session for the best experience</p>
      </div>

      {/* Category Selection */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary-600" />
            Select Category
          </Card.Title>
          <Card.Description>Choose the topic area you want to practice</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setLocalSettings(prev => ({ ...prev, category: category.id }))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  localSettings.category === category.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <category.icon className={`w-6 h-6 mb-2 ${
                  localSettings.category === category.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{category.description}</p>
              </button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Difficulty Selection */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary-600" />
            Select Difficulty
          </Card.Title>
          <Card.Description>Choose a level that matches your current skill</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => setLocalSettings(prev => ({ ...prev, difficulty: difficulty.id }))}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  localSettings.difficulty === difficulty.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Badge variant={difficulty.color} size="lg" className="mb-2">
                  {difficulty.name}
                </Badge>
                <p className="text-xs text-gray-500">{difficulty.description}</p>
              </button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Questions & Time */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Number of Questions */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary-600" />
              Number of Questions
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex gap-3">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setLocalSettings(prev => ({ ...prev, questionCount: count }))}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    localSettings.questionCount === count
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Time Limit */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-600" />
              Time Limit
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-wrap gap-2">
              {timeLimits.map((time) => (
                <button
                  key={time.label}
                  onClick={() => setLocalSettings(prev => ({ ...prev, timeLimit: time.value }))}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    localSettings.timeLimit === time.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Summary & Start */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-400 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {categories.find(c => c.id === localSettings.category)?.name}
              </span>
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                {difficulties.find(d => d.id === localSettings.difficulty)?.name}
              </span>
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                {localSettings.questionCount} questions
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {localSettings.timeLimit ? `${localSettings.timeLimit} min` : 'No limit'}
              </span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="lg"
            icon={PlayCircle}
            onClick={handleStartInterview}
            isLoading={createInterviewMutation.isPending}
            className="mt-4 md:mt-0"
          >
            Start Interview
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default InterviewSetup
