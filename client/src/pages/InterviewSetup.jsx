import { useState, useMemo } from 'react'
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
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Timer,
  ArrowRight,
  Shield,
  Lightbulb
} from 'lucide-react'

const InterviewSetup = () => {
  const navigate = useNavigate()
  const { setSettings, settings, startInterview } = useInterviewStore()
  const [currentStep, setCurrentStep] = useState(0)
  
  const [localSettings, setLocalSettings] = useState({
    category: settings.category,
    difficulty: settings.difficulty,
    questionCount: settings.questionCount,
    timeLimit: settings.timeLimit,
    type: settings.type,
  })

  const categories = [
    { id: 'general', name: 'General', icon: Target, description: 'Mixed questions across all topics', emoji: '🎯', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'dsa', name: 'DSA', icon: Code, description: 'Data Structures & Algorithms', emoji: '💻', gradient: 'from-purple-500 to-violet-500' },
    { id: 'web-development', name: 'Web Dev', icon: Server, description: 'Frontend, Backend, Full-stack', emoji: '🌐', gradient: 'from-emerald-500 to-teal-500' },
    { id: 'behavioral', name: 'Behavioral', icon: Users, description: 'Soft skills & situational questions', emoji: '🤝', gradient: 'from-pink-500 to-rose-500' },
    { id: 'system-design', name: 'System Design', icon: Database, description: 'Architecture & scalability', emoji: '🏗️', gradient: 'from-orange-500 to-amber-500' },
    { id: 'machine-learning', name: 'ML/AI', icon: Brain, description: 'Machine Learning & AI concepts', emoji: '🧠', gradient: 'from-indigo-500 to-blue-500' },
  ]

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'success', description: 'Great for beginners', emoji: '🌱', gradient: 'from-green-400 to-emerald-500', tip: 'Perfect warm-up! Build confidence with foundational questions.' },
    { id: 'medium', name: 'Medium', color: 'warning', description: 'Intermediate level', emoji: '⚡', gradient: 'from-yellow-400 to-orange-500', tip: 'Challenge yourself with industry-standard interview questions.' },
    { id: 'hard', name: 'Hard', color: 'danger', description: 'Advanced challenges', emoji: '🔥', gradient: 'from-red-400 to-rose-600', tip: 'FAANG-level questions to push your limits.' },
  ]

  const questionCounts = [5, 10, 15, 20]
  const timeLimits = [
    { value: null, label: 'No Limit', icon: '♾️' },
    { value: 15, label: '15 min', icon: '⚡' },
    { value: 30, label: '30 min', icon: '⏱️' },
    { value: 45, label: '45 min', icon: '🕐' },
    { value: 60, label: '60 min', icon: '🕕' },
  ]

  // Estimated time calculation
  const estimatedTime = useMemo(() => {
    const baseTime = { easy: 2, medium: 3, hard: 5 }
    const mins = (baseTime[localSettings.difficulty] || 3) * localSettings.questionCount
    return mins
  }, [localSettings.difficulty, localSettings.questionCount])

  // Steps configuration
  const steps = [
    { title: 'Category', icon: Target, description: 'What to practice' },
    { title: 'Difficulty', icon: Zap, description: 'Challenge level' },
    { title: 'Settings', icon: Timer, description: 'Questions & time' },
    { title: 'Review', icon: CheckCircle, description: 'Confirm & start' },
  ]

  // Create interview mutation
  const createInterviewMutation = useMutation({
    mutationFn: async (settings) => {
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

  const selectedCategory = categories.find(c => c.id === localSettings.category)
  const selectedDifficulty = difficulties.find(d => d.id === localSettings.difficulty)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative text-center">
          <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-1" />
            Interview Setup
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Configure Your Session</h1>
          <p className="text-purple-100 max-w-lg mx-auto">Customize every detail of your practice interview for the perfect experience</p>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="flex items-center justify-between px-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center flex-1">
            <button
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-3 transition-all ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index < currentStep 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : index === currentStep 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-110' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-semibold ${index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{step.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
            </button>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 rounded transition-all duration-500 ${
                index < currentStep ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[350px]">
        {/* Step 1: Category Selection */}
        {currentStep === 0 && (
          <Card className="animate-slide-up">
            <Card.Header>
              <Card.Title className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                Choose Your Category
              </Card.Title>
              <Card.Description>Select the topic area you want to practice</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setLocalSettings(prev => ({ ...prev, category: category.id }))
                    }}
                    className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-1 ${
                      localSettings.category === category.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    {localSettings.category === category.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-primary-500" />
                      </div>
                    )}
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <span className="text-xl">{category.emoji}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{category.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Step 2: Difficulty Selection */}
        {currentStep === 1 && (
          <Card className="animate-slide-up">
            <Card.Header>
              <Card.Title className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                Select Difficulty
              </Card.Title>
              <Card.Description>Choose a challenge level that matches your skill</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => {
                      setLocalSettings(prev => ({ ...prev, difficulty: difficulty.id }))
                    }}
                    className={`group relative p-6 rounded-2xl border-2 text-center transition-all duration-300 hover:-translate-y-1 ${
                      localSettings.difficulty === difficulty.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    {localSettings.difficulty === difficulty.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-primary-500" />
                      </div>
                    )}
                    <div className={`w-16 h-16 bg-gradient-to-br ${difficulty.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <span className="text-2xl">{difficulty.emoji}</span>
                    </div>
                    <Badge variant={difficulty.color} size="lg" className="mb-2">
                      {difficulty.name}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{difficulty.description}</p>
                    {localSettings.difficulty === difficulty.id && (
                      <div className="mt-3 p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <p className="text-xs text-primary-700 dark:text-primary-300 flex items-center justify-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          {difficulty.tip}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Step 3: Questions & Time */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-slide-up">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  Number of Questions
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-4 gap-3">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setLocalSettings(prev => ({ ...prev, questionCount: count }))}
                      className={`relative py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:-translate-y-1 ${
                        localSettings.questionCount === count
                          ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'
                      }`}
                    >
                      {count}
                      <p className="text-[10px] font-medium mt-1 opacity-70">questions</p>
                    </button>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  Time Limit
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-5 gap-3">
                  {timeLimits.map((time) => (
                    <button
                      key={time.label}
                      onClick={() => setLocalSettings(prev => ({ ...prev, timeLimit: time.value }))}
                      className={`py-4 rounded-2xl font-medium transition-all duration-300 hover:-translate-y-1 ${
                        localSettings.timeLimit === time.value
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'
                      }`}
                    >
                      <span className="text-lg block mb-1">{time.icon}</span>
                      <span className="text-xs">{time.label}</span>
                    </button>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Estimated Time Widget */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Estimated Session Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{estimatedTime} minutes</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Based on {localSettings.questionCount} {localSettings.difficulty} questions</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">~{Math.round(estimatedTime / localSettings.questionCount)} min per question</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Review & Start */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-slide-up">
            {/* Session Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${selectedCategory?.gradient || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <span className="text-2xl">{selectedCategory?.emoji}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Category</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedCategory?.name}</p>
              </Card>
              <Card className="text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${selectedDifficulty?.gradient || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <span className="text-2xl">{selectedDifficulty?.emoji}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Difficulty</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedDifficulty?.name}</p>
              </Card>
              <Card className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Questions</p>
                <p className="font-bold text-gray-900 dark:text-white">{localSettings.questionCount}</p>
              </Card>
              <Card className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Time Limit</p>
                <p className="font-bold text-gray-900 dark:text-white">{localSettings.timeLimit ? `${localSettings.timeLimit} min` : 'No limit'}</p>
              </Card>
            </div>

            {/* Pro Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Quick Tips Before You Start</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Find a quiet place with no distractions</li>
                    <li>• Speak clearly and structure your answers using the STAR method</li>
                    <li>• Take your time to think before answering each question</li>
                    <li>• Estimated session time: <strong className="text-gray-900 dark:text-white">{estimatedTime} minutes</strong></li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Start Button */}
            <Card className="bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Ready to Begin? 🚀</h3>
                  <p className="text-white/80">Your session is configured. Click start when you're ready!</p>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={PlayCircle}
                  onClick={handleStartInterview}
                  isLoading={createInterviewMutation.isPending}
                  className="shadow-xl hover:shadow-2xl hover:scale-105 transition-all whitespace-nowrap"
                >
                  Start Interview
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          icon={ChevronLeft}
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'bg-primary-600 w-8' : i < currentStep ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
            className="shadow-lg"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleStartInterview}
            isLoading={createInterviewMutation.isPending}
            className="shadow-lg bg-gradient-to-r from-primary-600 to-purple-600"
          >
            Start <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default InterviewSetup
