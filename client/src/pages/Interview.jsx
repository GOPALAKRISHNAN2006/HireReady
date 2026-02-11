import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useInterviewStore } from '../store/interviewStore'
import { Card, Button, Badge, Modal } from '../components/ui'
import { LoadingOverlay } from '../components/ui/Spinner'
import { ProctoredSession } from '../components/proctoring'
import api from '../services/api'
import communicationApi from '../services/communicationApi'
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Send, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Flag,
  MessageSquare,
  Lightbulb,
  Target,
  Zap,
  Award,
  SkipForward
} from 'lucide-react'

const Interview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if proctoring is enabled (can be set via query param or interview settings)
  const searchParams = new URLSearchParams(location.search)
  const proctoringEnabled = searchParams.get('proctored') !== 'false'
  
  const {
    currentInterview,
    currentQuestionIndex,
    responses,
    isActive,
    isPaused,
    timeRemaining,
    startInterview,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    pauseInterview,
    resumeInterview,
    updateTime,
    endInterview,
    getProgress,
  } = useInterviewStore()

  const [answer, setAnswer] = useState('')
  const [showEndModal, setShowEndModal] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultData, setResultData] = useState(null)

  // Start interview mutation
  const startInterviewMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/interviews/${id}/start`)
      return response.data
    },
    onError: (error) => {
      // Interview might already be started, continue anyway
      console.log('Start interview:', error.response?.data?.message)
    },
  })

  // Fetch interview data
  const { data: interviewData, isLoading } = useQuery({
    queryKey: ['interview', id],
    queryFn: async () => {
      const response = await api.get(`/interviews/${id}`)
      const interview = response.data.data?.interview || response.data.interview
      console.log('Interview data:', interview) // Debug log
      // Transform responses to questions format for frontend
      if (interview && interview.responses && interview.responses.length > 0) {
        interview.questions = interview.responses.map((r, index) => {
          // Get question text from multiple possible sources with better fallbacks
          let questionText = r.questionText
          if (!questionText && r.question) {
            if (typeof r.question === 'object') {
              questionText = r.question.text || r.question.questionText
            }
          }
          // Fallback to generated question text if still not found
          if (!questionText) {
            const fallbackQuestions = {
              'dsa': 'Explain the time and space complexity of common data structures.',
              'web': 'Explain the key concepts of modern web development.',
              'behavioral': 'Tell me about a challenging situation you faced at work.',
              'system-design': 'How would you design a scalable web application?',
              'mixed': 'Tell me about your experience and technical skills.'
            }
            questionText = fallbackQuestions[interview.category] || `Interview Question ${index + 1}: Describe your approach to problem-solving.`
          }
          return {
            _id: r.question?._id || r.question || `q-${index}`,
            text: questionText,
            category: r.question?.category || interview.category,
            difficulty: r.question?.difficulty || interview.difficulty,
            hints: r.question?.hints || ['Take your time to think', 'Structure your answer clearly', 'Provide specific examples']
          }
        })
        console.log('Transformed questions:', interview.questions) // Debug log
      }
      return interview
    },
    enabled: !currentInterview || currentInterview._id !== id,
  })

  // Start interview on load
  useEffect(() => {
    if (interviewData && !isActive) {
      // If interview is scheduled, call start API first
      if (interviewData.status === 'scheduled') {
        startInterviewMutation.mutate()
      }
      startInterview(interviewData)
    }
  }, [interviewData, isActive, startInterview])

  // Handle browser/page close - complete interview
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isActive) {
        // Complete interview on page close
        navigator.sendBeacon(`/api/interviews/${id}/complete`, JSON.stringify({}))
        e.preventDefault()
        e.returnValue = 'You have an interview in progress. Are you sure you want to leave?'
        return e.returnValue
      }
    }
    
    // Block Escape key to prevent fullscreen exit
    const handleKeyDown = (e) => {
      if (isActive && e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        toast.error('Cannot exit fullscreen during interview. Complete the interview first.', { id: 'no-escape' })
        return false
      }
    }
    
    // Re-request fullscreen if exited
    const handleFullscreenChange = () => {
      if (isActive && !document.fullscreenElement) {
        toast.error('Fullscreen mode is required during interview', { id: 'fullscreen-required' })
        // Try to re-enter fullscreen
        setTimeout(() => {
          document.documentElement.requestFullscreen?.().catch(() => {})
        }, 500)
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [isActive, id])

  // Ref to track whether auto-submit has fired (prevent double-fire)
  const autoSubmittedRef = useRef(false)

  // Reset auto-submit flag when interview starts
  useEffect(() => {
    if (isActive) autoSubmittedRef.current = false
  }, [isActive])

  // Timer effect — use ref-based approach to avoid stale closures
  const timeRemainingRef = useRef(timeRemaining)
  useEffect(() => {
    timeRemainingRef.current = timeRemaining
  }, [timeRemaining])

  useEffect(() => {
    if (!isActive || isPaused || timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      const currentTime = timeRemainingRef.current
      if (currentTime === null || currentTime <= 0) {
        clearInterval(timer)
        return
      }

      const newTime = currentTime - 1
      updateTime(newTime)
      
      // Show warning at 5 minutes
      if (newTime === 300) {
        setShowTimeWarning(true)
        toast.error('Only 5 minutes remaining!', { icon: '⏰', id: 'time-warning-5' })
      }
      
      // Show warning at 1 minute
      if (newTime === 60) {
        toast.error('Only 1 minute remaining! Your interview will auto-submit.', { icon: '⏰', id: 'time-warning-1', duration: 10000 })
      }
      
      // Auto-submit when time is up
      if (newTime <= 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true
        clearInterval(timer)
        toast.error('Time is up! Submitting your interview...', { icon: '⏰', duration: 5000 })
        // Use setTimeout to ensure state updates have propagated
        setTimeout(() => {
          completeInterviewMutation.mutate(undefined, {
            onSuccess: (data) => {
              endInterview()
              const result = data.data?.interview || data.interview || data.data || data
              setResultData({
                overallScore: result.overallScore || Math.round(responses.filter(r => r?.answer).length / (currentInterview?.questions?.length || 1) * 100),
                questionsAnswered: result.questionsAnswered || responses.filter(r => r?.answer).length,
                totalQuestions: result.totalQuestions || currentInterview?.questions?.length || 0,
                totalDurationSeconds: result.totalDurationSeconds,
                feedback: result.feedback || { summary: 'Great job completing your interview!' },
                category: result.category || currentInterview?.category,
                difficulty: result.difficulty || currentInterview?.difficulty
              })
              setShowResultModal(true)
            },
            onError: () => {
              // Force end even if server call fails
              endInterview()
              navigate(`/interview/${id}/result`)
            }
          })
        }, 100)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, isPaused])  // Only depend on isActive and isPaused, not timeRemaining

  // Load saved answer when navigating questions
  useEffect(() => {
    const savedResponse = responses[currentQuestionIndex]
    if (savedResponse?.answer) {
      setAnswer(savedResponse.answer)
    } else {
      setAnswer('')
    }
  }, [currentQuestionIndex, responses])

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, questionIndex, answer, questionText }) => {
      // Submit answer to interview
      const response = await api.post(`/interviews/${id}/submit-answer`, {
        questionId,
        questionIndex,
        answer,
      })
      
      // Also submit for communication assessment (async, non-blocking)
      try {
        await communicationApi.assessTranscript({
          transcript: answer,
          interviewId: id,
          questionId,
          questionText
        })
      } catch (err) {
        console.log('Communication assessment skipped:', err.message)
      }
      
      return response.data
    },
    onError: (error) => {
      console.error('Submit answer error:', error)
    },
  })

  // Complete interview mutation
  const completeInterviewMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/interviews/${id}/complete`)
      return response.data
    },
    onSuccess: (data) => {
      endInterview()
      // Show result popup instead of navigating immediately
      const result = data.data?.interview || data.interview || data.data || data
      setResultData({
        overallScore: result.overallScore || Math.round(responses.filter(r => r?.answer).length / (currentInterview?.questions?.length || 1) * 100),
        questionsAnswered: result.questionsAnswered || responses.filter(r => r?.answer).length,
        totalQuestions: result.totalQuestions || currentInterview?.questions?.length || 0,
        totalDurationSeconds: result.totalDurationSeconds,
        feedback: result.feedback || { summary: 'Great job completing your interview!' },
        category: result.category || currentInterview?.category,
        difficulty: result.difficulty || currentInterview?.difficulty
      })
      setShowResultModal(true)
      toast.success('🎉 Interview completed successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to complete interview')
    },
  })

  const handleSubmitAnswer = useCallback(() => {
    if (!answer.trim()) {
      toast.error('Please provide an answer')
      return
    }

    const currentQuestion = currentInterview?.questions?.[currentQuestionIndex]
    if (!currentQuestion) {
      toast.error('No question found')
      return
    }

    // Save to local state
    submitAnswer(answer)

    // Get question ID - ensure it's a valid string ID
    const questionId = typeof currentQuestion._id === 'object' 
      ? currentQuestion._id.toString() 
      : currentQuestion._id

    // Submit to server with communication assessment (async)
    submitAnswerMutation.mutate({
      questionId: questionId,
      questionIndex: currentQuestionIndex,
      answer,
      questionText: currentQuestion.text,
    }, {
      onSuccess: (data) => {
        // Show evaluation feedback if available
        if (data?.data?.evaluation?.overallScore) {
          toast.success(`Answer submitted! Score: ${data.data.evaluation.overallScore}%`, { duration: 3000 })
        } else {
          toast.success('Answer submitted!', { duration: 2000 })
        }
      },
      onError: (error) => {
        console.error('Submit error:', error)
        // Still move forward even if server submission fails
        toast('Answer saved locally', { icon: '⚠️' })
      }
    })

    // Move to next question after saving
    const totalQuestions = currentInterview?.questions?.length || 0
    if (currentQuestionIndex >= totalQuestions - 1) {
      // Last question - show complete modal
      setShowEndModal(true)
    } else {
      nextQuestion()
      setAnswer('')
    }
  }, [answer, currentInterview, currentQuestionIndex, submitAnswer, submitAnswerMutation, nextQuestion])

  const handleCompleteInterview = () => {
    setShowEndModal(false)
    completeInterviewMutation.mutate()
  }

  const handleSkipQuestion = () => {
    if (!nextQuestion()) {
      setShowEndModal(true)
    }
  }

  const formatTime = (seconds) => {
    if (!seconds) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return <LoadingOverlay message="Loading interview..." />
  }

  const currentQuestion = currentInterview?.questions?.[currentQuestionIndex]
  const totalQuestions = currentInterview?.questions?.length || 0
  const progress = getProgress()
  const answeredCount = responses.filter(r => r?.answer).length

  // Wrap with ProctoredSession if enabled
  const InterviewContent = (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-auto z-40">
      <div className="max-w-6xl mx-auto p-6">
        {/* Premium Header Bar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-5 mb-8 sticky top-4 z-30">
          <div className="flex items-center justify-between">
            {/* Left Section - Progress */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Question</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{currentQuestionIndex + 1} <span className="text-gray-400 font-normal">/ {totalQuestions}</span></p>
                </div>
              </div>
              
              <div className="hidden md:block h-10 w-px bg-gray-200"></div>
              
              <div className="hidden md:flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary-600">{Math.round((currentQuestionIndex / totalQuestions) * 100)}%</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {answeredCount} answered
                  </span>
                  <span className="flex items-center text-gray-400">
                    <XCircle className="w-3 h-3 mr-1" />
                    {totalQuestions - answeredCount} remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Timer & Controls */}
            <div className="flex items-center space-x-4">
              {timeRemaining !== null && (
                <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-lg ${
                  timeRemaining < 300 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                    : timeRemaining < 600 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">{formatTime(timeRemaining)}</span>
                </div>
              )}
              
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowEndModal(true)}
                icon={Flag}
                className="shadow-lg shadow-red-500/20"
              >
                End
              </Button>
            </div>
          </div>
        </div>

        {/* Question Navigation Pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-3 scrollbar-hide px-1">
          {currentInterview?.questions?.map((_, index) => {
            const hasAnswer = responses[index]?.answer
            const isCurrent = index === currentQuestionIndex
            
            return (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40 scale-110'
                    : hasAnswer
                      ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md shadow-green-500/30'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm'
                }`}
              >
                {hasAnswer && !isCurrent ? (
                  <CheckCircle className="w-5 h-5 mx-auto" />
                ) : (
                  index + 1
                )}
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Card - Takes up more space */}
          <div className="lg:col-span-3">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                {/* Question Header */}
                <div className="bg-gradient-to-r from-primary-500 to-indigo-500 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="default" className="bg-white/20 text-white border-0 px-3 py-1">
                        <Zap className="w-3 h-3 mr-1" />
                        {currentQuestion?.difficulty || 'medium'}
                      </Badge>
                      <Badge variant="default" className="bg-white/20 text-white border-0 px-3 py-1">
                        <Target className="w-3 h-3 mr-1" />
                        {currentQuestion?.category || currentInterview?.category}
                      </Badge>
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Question #{currentQuestionIndex + 1}
                    </div>
                  </div>
                </div>
                
                {/* Question Content */}
                <div className="p-8">
                  <div className="mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed flex-1">
                        {currentQuestion?.text || (currentInterview?.category === 'behavioral' 
                          ? 'Tell me about yourself and your relevant experience.' 
                          : currentInterview?.category === 'dsa'
                            ? 'Explain your approach to solving algorithmic problems.'
                            : currentInterview?.category === 'web'
                              ? 'Describe your experience with web development technologies.'
                              : 'Share your thoughts on this interview topic.')}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Answer Section */}
                  <div className="space-y-4">
                    <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Award className="w-4 h-4 mr-2 text-primary-500" />
                      Your Answer
                    </label>
                    <div className="relative">
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.ctrlKey && e.key === 'Enter') {
                            handleSubmitAnswer()
                          }
                        }}
                        placeholder="Type your comprehensive answer here... Be detailed and specific."
                        rows={12}
                        className="w-full px-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <div className="absolute bottom-4 left-6 right-6 flex justify-between text-sm">
                        <span className={`font-medium ${answer.length > 100 ? 'text-green-500' : 'text-gray-400'}`}>
                          {answer.length} characters
                        </span>
                        <span className="text-gray-400 flex items-center">
                          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mr-1">Ctrl</kbd>
                          <span className="mr-1">+</span>
                          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mr-2">Enter</kbd>
                          to submit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Footer */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 px-8 py-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      icon={ChevronLeft}
                      size="lg"
                      className="text-gray-600"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-4">
                      <Button
                        variant="secondary"
                        onClick={handleSkipQuestion}
                        icon={SkipForward}
                        size="lg"
                        className="border-2"
                      >
                        Skip
                      </Button>
                      <Button
                        onClick={handleSubmitAnswer}
                        isLoading={submitAnswerMutation.isPending}
                        icon={currentQuestionIndex === totalQuestions - 1 ? CheckCircle : Send}
                        iconPosition="right"
                        size="lg"
                        className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 px-8"
                      >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Submit & Finish' : 'Submit & Next'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* Side Panel - Tips & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary-500" />
                Your Progress
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Answered</span>
                  <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">{answeredCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Remaining</span>
                  <span className="font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">{totalQuestions - answeredCount}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-100/50 p-6">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                Interview Tips
              </h3>
              <ul className="space-y-3 text-sm text-amber-800">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                  <span>Be specific with examples</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                  <span>Use the STAR method</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                  <span>Take your time to think</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
                  <span>Structure your answer</span>
                </li>
              </ul>
            </div>

            {/* Hints (if available) */}
            {currentQuestion?.hints?.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100/50 p-6">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
                  Hints
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  {currentQuestion.hints.map((hint, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-5 h-5 bg-blue-200 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">{i + 1}</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* End Interview Modal */}
        <Modal
          isOpen={showEndModal}
          onClose={() => setShowEndModal(false)}
          title="End Interview?"
        >
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">
                  Are you sure you want to end this interview?
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  You have answered {answeredCount} out of {totalQuestions} questions.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Summary</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-green-600">{answeredCount}</div>
                  <div className="text-sm text-gray-500 mt-1">Answered</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-amber-500">{totalQuestions - answeredCount}</div>
                  <div className="text-sm text-gray-500 mt-1">Skipped</div>
                </div>
              </div>
            </div>
          </div>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEndModal(false)} size="lg">
              Continue Interview
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCompleteInterview}
              isLoading={completeInterviewMutation.isPending}
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-primary-600"
              icon={Award}
            >
              End & Get Results
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Result Modal - Shows after completing interview */}
        <Modal
          isOpen={showResultModal}
          onClose={() => {
            setShowResultModal(false)
            navigate(`/interview/${id}/result`)
          }}
          title="🎉 Interview Completed!"
          size="lg"
        >
          <div className="space-y-6">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(resultData?.overallScore || 0) * 2.83} 283`}
                    className={`${
                      (resultData?.overallScore || 0) >= 80 ? 'text-green-500' :
                      (resultData?.overallScore || 0) >= 60 ? 'text-blue-500' :
                      (resultData?.overallScore || 0) >= 40 ? 'text-amber-500' :
                      'text-red-500'
                    } transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${
                    (resultData?.overallScore || 0) >= 80 ? 'text-green-600' :
                    (resultData?.overallScore || 0) >= 60 ? 'text-blue-600' :
                    (resultData?.overallScore || 0) >= 40 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {resultData?.overallScore || 0}%
                  </span>
                  <span className="text-sm text-gray-500">Score</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {resultData?.questionsAnswered || 0}
                </div>
                <div className="text-xs text-green-700">Answered</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {resultData?.totalQuestions || 0}
                </div>
                <div className="text-xs text-blue-700">Total</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {resultData?.totalDurationSeconds 
                    ? `${Math.floor(resultData.totalDurationSeconds / 60)}m`
                    : 'N/A'
                  }
                </div>
                <div className="text-xs text-purple-700">Duration</div>
              </div>
            </div>

            {/* Category & Difficulty */}
            <div className="flex justify-center gap-3">
              <Badge variant="primary" className="px-4 py-2">
                <Target className="w-4 h-4 mr-1" />
                {resultData?.category || 'General'}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="w-4 h-4 mr-1" />
                {resultData?.difficulty || 'Medium'}
              </Badge>
            </div>

            {/* Performance Message */}
            <div className={`p-4 rounded-xl text-center ${
              (resultData?.overallScore || 0) >= 80 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                : (resultData?.overallScore || 0) >= 60 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800'
                  : (resultData?.overallScore || 0) >= 40 
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800'
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'
            }`}>
              <p className="font-semibold">
                {(resultData?.overallScore || 0) >= 80 
                  ? '🌟 Excellent Performance!' 
                  : (resultData?.overallScore || 0) >= 60 
                    ? '👍 Good Job!'
                    : (resultData?.overallScore || 0) >= 40 
                      ? '💪 Keep Practicing!'
                      : '📚 More Practice Needed'
                }
              </p>
              <p className="text-sm mt-1 opacity-80">
                {resultData?.feedback?.summary || 'Check the detailed results for feedback and improvement areas.'}
              </p>
            </div>
          </div>
          
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowResultModal(false)
                navigate('/dashboard')
              }} 
              size="lg"
            >
              Back to Dashboard
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowResultModal(false)
                navigate(`/interview/${id}/result`)
              }}
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-primary-600"
              icon={ChevronRight}
              iconPosition="right"
            >
              View Detailed Results
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )

  return (
    <ProctoredSession
      sessionType="interview"
      sessionId={id}
      enabled={proctoringEnabled}
      config={{
        cameraEnabled: true,
        screenMonitoringEnabled: true,
        audioMonitoringEnabled: true,
        fullscreenRequired: true
      }}
      onProctoringEnd={(data) => {
        console.log('Proctoring ended:', data)
        // Automatically complete interview when proctoring session ends
        if (isActive) {
          handleCompleteInterview()
        }
      }}
    >
      {InterviewContent}
    </ProctoredSession>
  )
}

export default Interview
