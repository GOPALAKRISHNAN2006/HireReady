/**
 * ===========================================
 * Communication Skills Test Page
 * ===========================================
 * 
 * Interactive assessment for testing communication skills
 * with speech-to-text and AI evaluation.
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import communicationApi from '../services/communicationApi'
import toast from 'react-hot-toast'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Volume2,
  BookOpen,
  Target,
  Sparkles,
  Award,
  Timer,
  ChevronRight,
  Brain
} from 'lucide-react'

// Sample communication test questions
const COMMUNICATION_QUESTIONS = [
  {
    id: 1,
    category: 'Introduction',
    question: 'Tell me about yourself and your professional background.',
    timeLimit: 120,
    tips: ['Structure: Present → Past → Future', 'Keep it under 2 minutes', 'Focus on relevant experience']
  },
  {
    id: 2,
    category: 'Behavioral',
    question: 'Describe a challenging project you worked on. What was your role and how did you handle it?',
    timeLimit: 180,
    tips: ['Use the STAR method', 'Be specific about your actions', 'Quantify results if possible']
  },
  {
    id: 3,
    category: 'Technical Communication',
    question: 'Explain a complex technical concept to someone non-technical.',
    timeLimit: 150,
    tips: ['Use analogies and examples', 'Avoid jargon', 'Check for understanding']
  },
  {
    id: 4,
    category: 'Problem Solving',
    question: 'Tell me about a time when you had to make a difficult decision with limited information.',
    timeLimit: 180,
    tips: ['Explain your thought process', 'Show leadership', 'Discuss the outcome']
  },
  {
    id: 5,
    category: 'Teamwork',
    question: 'How do you handle disagreements with team members?',
    timeLimit: 120,
    tips: ['Show emotional intelligence', 'Give specific examples', 'Focus on resolution']
  }
]

const CommunicationTest = () => {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [responses, setResponses] = useState({})
  const [testCompleted, setTestCompleted] = useState(false)
  const [results, setResults] = useState(null)
  const [showTips, setShowTips] = useState(true)
  
  const mediaRecorderRef = useRef(null)
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)

  const currentQuestion = COMMUNICATION_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / COMMUNICATION_QUESTIONS.length) * 100

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording, isPaused])

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        recognition.maxAlternatives = 1

        recognition.onresult = (event) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart + ' '
            } else {
              interimTranscript += transcriptPart
            }
          }

          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript)
          }
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            // Auto-restart if no speech detected
            if (isRecording && !isPaused) {
              try {
                recognition.start()
              } catch (e) {
                console.log('Recognition restart failed:', e)
              }
            }
          } else if (event.error === 'aborted') {
            // Ignore aborted errors (normal when stopping)
          } else if (event.error === 'network') {
            toast.error('Network error. Please check your connection.')
          } else if (event.error === 'not-allowed') {
            toast.error('Microphone access denied. Please allow microphone access.')
          }
        }

        recognition.onend = () => {
          // Auto-restart if still recording
          if (isRecording && !isPaused) {
            try {
              recognition.start()
            } catch (e) {
              console.log('Recognition restart on end failed:', e)
            }
          }
        }

        recognitionRef.current = recognition
      } else {
        toast.error('Speech recognition not supported in this browser. Please use Chrome.')
      }
    }

    initSpeechRecognition()

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.log('Recognition stop failed:', e)
        }
      }
    }
  }, [isRecording, isPaused])

  // Submit assessment mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await communicationApi.batchAssess(data)
      return response.data
    },
    onSuccess: (data) => {
      setResults(data.data)
      setTestCompleted(true)
      toast.success('Assessment complete!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit assessment')
    }
  })

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Release immediately, we just need permission
    } catch (err) {
      toast.error('Microphone access required. Please allow microphone access and try again.')
      return
    }

    setIsRecording(true)
    setIsPaused(false)
    setTranscript('')
    setTimeElapsed(0)
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        toast.success('Recording started. Speak clearly!')
      } catch (err) {
        console.error('Failed to start recognition:', err)
        toast.error('Failed to start recording. Please try again.')
        setIsRecording(false)
      }
    } else {
      toast.error('Speech recognition not available. Please use Chrome browser.')
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.log('Stop error:', e)
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const pauseRecording = () => {
    setIsPaused(true)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const resumeRecording = () => {
    setIsPaused(false)
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const saveResponse = () => {
    if (!transcript.trim()) {
      toast.error('Please record your answer first')
      return
    }

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        transcript: transcript.trim(),
        timeSpent: timeElapsed,
        category: currentQuestion.category
      }
    }))

    stopRecording()
    toast.success('Response saved!')

    // Move to next question or submit
    if (currentQuestionIndex < COMMUNICATION_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setTranscript('')
      setTimeElapsed(0)
    }
  }

  const handleSubmitTest = () => {
    // Save current response if exists
    if (transcript.trim() && !responses[currentQuestion.id]) {
      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          questionText: currentQuestion.question,
          transcript: transcript.trim(),
          timeSpent: timeElapsed,
          category: currentQuestion.category
        }
      }))
    }

    const allResponses = Object.values({
      ...responses,
      ...(transcript.trim() && !responses[currentQuestion.id] ? {
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          questionText: currentQuestion.question,
          transcript: transcript.trim(),
          timeSpent: timeElapsed,
          category: currentQuestion.category
        }
      } : {})
    })

    if (allResponses.length === 0) {
      toast.error('Please answer at least one question')
      return
    }

    submitMutation.mutate({
      responses: allResponses,
      assessmentType: 'communication_test'
    })
  }

  const skipQuestion = () => {
    if (currentQuestionIndex < COMMUNICATION_QUESTIONS.length - 1) {
      stopRecording()
      setCurrentQuestionIndex(prev => prev + 1)
      setTranscript('')
      setTimeElapsed(0)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 9) return 'Excellent'
    if (score >= 7) return 'Good'
    if (score >= 5) return 'Average'
    return 'Needs Improvement'
  }

  // Results view
  if (testCompleted && results) {
    return (
      <div className="space-y-8 animate-slide-up">
        {/* Results Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-emerald-100 text-lg">
              Here's your communication skills evaluation
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Overall Score</h2>
          <div className={`text-7xl font-bold mb-2 ${getScoreColor(results.summary?.averageScore || 0)}`}>
            {(results.summary?.averageScore || 0).toFixed(1)}
          </div>
          <div className="text-2xl text-gray-500">out of 10</div>
          <Badge className="mt-4" variant={results.summary?.averageScore >= 7 ? 'success' : results.summary?.averageScore >= 5 ? 'warning' : 'danger'}>
            {getScoreLabel(results.summary?.averageScore || 0)}
          </Badge>
        </Card>

        {/* Subscores */}
        <Card>
          <Card.Header>
            <Card.Title>Skill Breakdown</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid md:grid-cols-3 gap-6">
              {results.summary?.averageSubscores && Object.entries(results.summary.averageSubscores).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(value)}`}>
                    {value.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Strengths
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-2">
                {results.summary?.topStrengths?.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Areas to Improve
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-2">
                {results.summary?.topImprovements?.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/communication')}>
            View All Assessments
          </Button>
          <Button onClick={() => {
            setTestCompleted(false)
            setResults(null)
            setResponses({})
            setCurrentQuestionIndex(0)
            setTranscript('')
            setTimeElapsed(0)
          }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Test
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/communication')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communication Skills Test</h1>
            <p className="text-gray-500">Question {currentQuestionIndex + 1} of {COMMUNICATION_QUESTIONS.length}</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {Object.keys(responses).length} answered
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-white/50 text-white bg-white/10">
              {currentQuestion.category}
            </Badge>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="text-sm">Suggested time: {Math.floor(currentQuestion.timeLimit / 60)} min</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h2>
          
          {/* Tips */}
          {showTips && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-900">Tips for this question:</span>
              </div>
              <ul className="space-y-1">
                {currentQuestion.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Recording Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isRecording 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isRecording ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to record'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTime(timeElapsed)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} icon={Play}>
                    Start Recording
                  </Button>
                ) : (
                  <>
                    {isPaused ? (
                      <Button onClick={resumeRecording} variant="outline" icon={Play}>
                        Resume
                      </Button>
                    ) : (
                      <Button onClick={pauseRecording} variant="outline" icon={Pause}>
                        Pause
                      </Button>
                    )}
                    <Button onClick={stopRecording} variant="danger" icon={MicOff}>
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Transcript Display */}
            <div className="min-h-[150px] p-4 bg-white rounded-lg border border-gray-200">
              {transcript ? (
                <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
              ) : (
                <p className="text-gray-400 italic">
                  Your speech will appear here as you speak...
                </p>
              )}
            </div>
            
            {/* Word count */}
            <div className="mt-2 text-sm text-gray-500 text-right">
              {transcript.split(/\s+/).filter(w => w).length} words
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => {
            stopRecording()
            setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
            const prevResponse = responses[COMMUNICATION_QUESTIONS[currentQuestionIndex - 1]?.id]
            setTranscript(prevResponse?.transcript || '')
            setTimeElapsed(prevResponse?.timeSpent || 0)
          }}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={skipQuestion}>
            Skip
          </Button>
          
          {transcript.trim() && (
            <Button onClick={saveResponse}>
              Save Response
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {currentQuestionIndex === COMMUNICATION_QUESTIONS.length - 1 && (
            <Button 
              onClick={handleSubmitTest}
              disabled={submitMutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitMutation.isPending ? 'Submitting...' : 'Submit Test'}
            </Button>
          )}
        </div>
      </div>

      {/* Question indicators */}
      <div className="flex justify-center gap-2">
        {COMMUNICATION_QUESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              stopRecording()
              setCurrentQuestionIndex(index)
              const response = responses[COMMUNICATION_QUESTIONS[index].id]
              setTranscript(response?.transcript || '')
              setTimeElapsed(response?.timeSpent || 0)
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              index === currentQuestionIndex
                ? 'bg-violet-500 text-white'
                : responses[COMMUNICATION_QUESTIONS[index].id]
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {responses[COMMUNICATION_QUESTIONS[index].id] ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CommunicationTest
