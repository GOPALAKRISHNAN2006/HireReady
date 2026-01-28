import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { challengeApi } from '../services/featureApi'
import toast from 'react-hot-toast'
import { 
  Clock, 
  Send, 
  Lightbulb, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Code,
  FileText,
  Award,
  Timer
} from 'lucide-react'

const ChallengeSolve = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [answer, setAnswer] = useState('')
  const [timeSpent, setTimeSpent] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [activeTab, setActiveTab] = useState('problem')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  // Fetch challenge details
  const { data: challengeData, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      // If id is 'today', fetch today's challenge
      if (id === 'today') {
        const response = await challengeApi.getTodaysChallenge()
        return response.data.data
      }
      // Otherwise fetch specific challenge
      const response = await challengeApi.getTodaysChallenge()
      return response.data.data
    },
  })

  const challenge = challengeData?.challenge

  // Timer effect
  useEffect(() => {
    let interval
    if (isRunning && !submitted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, submitted])

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Check if over time limit
  const isOverTime = challenge?.timeLimit && timeSpent > challenge.timeLimit * 60

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await challengeApi.submitChallenge(challenge._id, data)
      return response.data
    },
    onSuccess: (data) => {
      setSubmitted(true)
      setIsRunning(false)
      setResult(data.data)
      if (data.data.attempt?.isCompleted) {
        toast.success(`Challenge completed! +${data.data.attempt.pointsEarned} points`)
      } else {
        toast.error(data.data.attempt?.feedback || 'Keep trying! Your solution needs improvement.')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit')
    }
  })

  const handleSubmit = () => {
    if (!code.trim() && !answer.trim()) {
      toast.error('Please write your solution before submitting')
      return
    }
    
    submitMutation.mutate({
      code: code.trim(),
      answer: answer.trim(),
      timeSpent,
      hintsUsed
    })
  }

  const handleUseHint = () => {
    if (challenge?.hints && hintsUsed < challenge.hints.length) {
      setHintsUsed(prev => prev + 1)
      setShowHints(true)
      toast.success('Hint revealed! (-10 points)')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Challenge Found</h2>
        <p className="text-gray-600 mb-6">There's no active challenge available right now.</p>
        <Button onClick={() => navigate('/daily-challenge')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up max-h-screen overflow-y-auto pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/daily-challenge')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={
                challenge.difficulty === 'easy' ? 'success' :
                challenge.difficulty === 'medium' ? 'warning' : 'danger'
              }>
                {challenge.difficulty}
              </Badge>
              <Badge variant="default">{challenge.category}</Badge>
              <span className="text-sm text-gray-500">+{challenge.points} points</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
          isOverTime ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'
        }`}>
          <Timer className="w-5 h-5" />
          <span className="text-xl font-mono font-bold">{formatTime(timeSpent)}</span>
          {challenge.timeLimit && (
            <span className="text-sm opacity-70">/ {challenge.timeLimit} min</span>
          )}
        </div>
      </div>

      {/* Result Banner */}
      {submitted && result && (
        <Card className={`${
          result.attempt?.isCompleted 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {result.attempt?.isCompleted ? (
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {result.attempt?.isCompleted ? 'Challenge Completed!' : 'Keep Practicing!'}
                </h3>
                <p className="text-gray-600">
                  Score: {result.attempt?.score}% • Points earned: +{result.attempt?.pointsEarned}
                </p>
              </div>
            </div>
            <div className="text-right">
              {result.streak && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Award className="w-5 h-5" />
                  <span className="font-bold">{result.streak.currentStreak} day streak!</span>
                </div>
              )}
              <Button className="mt-2" onClick={() => navigate('/daily-challenge')}>
                Back to Challenges
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problem Panel */}
        <Card className="min-h-[500px] max-h-[700px] flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'problem'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Problem
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'hints'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Lightbulb className="w-4 h-4 inline mr-2" />
              Hints ({hintsUsed}/{challenge.hints?.length || 0})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {activeTab === 'problem' ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Question</h4>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
                  {challenge.question}
                </div>

                {challenge.sampleInput && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Sample Input</h4>
                    <div className="bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-sm">
                      {challenge.sampleInput}
                    </div>
                  </>
                )}

                {challenge.sampleOutput && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Expected Output</h4>
                    <div className="bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-sm">
                      {challenge.sampleOutput}
                    </div>
                  </>
                )}

                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {challenge.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {challenge.hints && challenge.hints.length > 0 ? (
                  <>
                    {challenge.hints.slice(0, hintsUsed).map((hint, index) => (
                      <div key={index} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
                          <Lightbulb className="w-4 h-4" />
                          Hint {index + 1}
                        </div>
                        <p className="text-gray-700">{hint}</p>
                      </div>
                    ))}
                    
                    {hintsUsed < challenge.hints.length && !submitted && (
                      <Button
                        variant="outline"
                        onClick={handleUseHint}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Reveal Next Hint (-10 points)
                      </Button>
                    )}
                    
                    {hintsUsed === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No hints revealed yet. Using hints will reduce your points.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No hints available for this challenge.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Code/Answer Panel */}
        <Card className="min-h-[500px] max-h-[700px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Your Solution</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCode('')
                setAnswer('')
              }}
              disabled={submitted}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>

          <div className="flex-1 p-4 flex flex-col">
            {/* Code Editor */}
            <div className="flex-1 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Solution
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your code here..."
                disabled={submitted}
                className="w-full h-[200px] p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Text Answer */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation / Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Explain your approach or write your answer here..."
                disabled={submitted}
                className="w-full h-[150px] p-4 bg-white text-gray-900 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 resize-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4 border-t border-gray-200">
            {!submitted ? (
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Solution
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center text-gray-500">
                Solution submitted • Time: {formatTime(timeSpent)}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Show Solution after submission */}
      {submitted && result?.solution && (
        <Card>
          <Card.Header>
            <Card.Title>Solution</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
              {result.solution}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

export default ChallengeSolve
