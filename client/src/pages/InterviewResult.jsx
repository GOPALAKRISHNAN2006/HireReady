import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingOverlay } from '../components/ui/Spinner'
import api from '../services/api'
import communicationApi from '../services/communicationApi'
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RefreshCcw,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Mic
} from 'lucide-react'
import React, { useState } from 'react'
import { CommunicationAssessmentCard } from '../components/communication'

// Inner error boundary to catch render crashes gracefully
class ResultErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    console.error('InterviewResult render error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto space-y-6 py-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Displaying Results</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">There was an error rendering the interview results. Your interview data is saved.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/interview/setup">
                <Button>Start New Interview</Button>
              </Link>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}

const InterviewResult = () => {
  const { id } = useParams()
  const [expandedQuestions, setExpandedQuestions] = useState({})

  // Fetch interview result
  const { data: interview, isLoading, error } = useQuery({
    queryKey: ['interview', id, 'result'],
    queryFn: async () => {
      try {
        const response = await api.get(`/interviews/${id}`)
        const data = response.data?.data?.interview || response.data?.interview || response.data
        console.log('Interview result data:', data) // Debug log
        return data
      } catch (err) {
        console.error('Error fetching interview:', err)
        throw err
      }
    },
    retry: 1,
    enabled: !!id,
  })

  // Fetch communication assessments for this interview
  const { data: communicationData } = useQuery({
    queryKey: ['communication', 'interview', id],
    queryFn: async () => {
      try {
        const response = await communicationApi.getInterviewAssessments(id)
        // Unwrap the API response: { data: { success, data: { hasAssessments, assessments, summary } } }
        return response.data?.data || response.data || {}
      } catch (err) {
        console.error('Error fetching communication assessments:', err)
        return {}
      }
    },
    enabled: !!id,
    retry: false,
  })

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent!'
    if (score >= 80) return 'Great Job!'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (isLoading) {
    return <LoadingOverlay message="Loading results..." />
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/dashboard" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <Card className="p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Results</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">There was an error loading the interview results.</p>
          <Link to="/interview/setup">
            <Button>Try Another Interview</Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Handle case when interview data is incomplete
  const score = interview?.overallScore || interview?.score || 0
  const responses = interview?.responses || []
  const totalQuestions = interview?.totalQuestions || interview?.questions?.length || responses.length || 0
  const answeredQuestions = interview?.questionsAnswered || responses.filter(r => r?.answer).length
  const correctAnswers = responses.filter(r => r?.evaluation?.overallScore >= 70 || r?.isCorrect).length
  const duration = interview?.totalDurationSeconds ? Math.round(interview.totalDurationSeconds / 60) : interview?.duration || 0

  // Build questions array from responses if not available
  const questions = interview?.questions || responses.map((r, index) => ({
    _id: r.question?._id || r.question || `q-${index}`,
    text: r.questionText || r.question?.text || `Question ${index + 1}`,
    expectedAnswer: r.question?.expectedAnswer || ''
  }))

  // If no interview data at all, show error
  if (!interview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/dashboard" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <Card className="p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Interview Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This interview session could not be found or may have expired.</p>
          <Link to="/interview/setup">
            <Button>Start New Interview</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <ResultErrorBoundary>
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/dashboard" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Score Card */}
      <Card className="overflow-hidden">
        <div className={`${getScoreBgColor(score)} p-8 text-center text-white`}>
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <div className="text-6xl font-bold mb-2">{score}%</div>
          <div className="text-xl font-medium">{getScoreLabel(score)}</div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalQuestions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{answeredQuestions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Answered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{correctAnswers}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {duration} min
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Time Taken</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-600" />
              Performance Breakdown
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {interview?.categoryScores && typeof interview.categoryScores === 'object' ? (
                // Handle both array and object formats
                (Array.isArray(interview.categoryScores) 
                  ? interview.categoryScores 
                  : Object.entries(interview.categoryScores)
                      .filter(([key, val]) => val > 0)
                      .map(([key, val]) => ({ category: key.replace(/([A-Z])/g, ' $1').trim(), score: val }))
                ).length > 0 ? (
                  (Array.isArray(interview.categoryScores) 
                    ? interview.categoryScores 
                    : Object.entries(interview.categoryScores)
                        .filter(([key, val]) => val > 0)
                        .map(([key, val]) => ({ category: key.replace(/([A-Z])/g, ' $1').trim(), score: val }))
                  ).map((cat, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{cat.category}</span>
                        <span className={getScoreColor(cat.score)}>{cat.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getScoreBgColor(cat.score)}`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No category breakdown available
                  </div>
                )
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No category breakdown available
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Key Insights
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-3">
              {/* Handle insights as array or object with arrays */}
              {(() => {
                const insightItems = Array.isArray(interview?.insights)
                  ? interview.insights
                  : interview?.insights?.topStrengths || interview?.insights?.areasToImprove
                    ? [...(interview.insights.topStrengths || []), ...(interview.insights.areasToImprove || [])]
                    : null
                if (insightItems && insightItems.length > 0) {
                  return insightItems.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{typeof insight === 'string' ? insight : insight?.toString?.() || ''}</span>
                    </li>
                  ))
                }
                return (
                  <>
                    {interview?.insights?.overallFeedback && (
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{interview.insights.overallFeedback}</span>
                      </li>
                    )}
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {score >= 70 
                          ? 'Strong understanding of core concepts' 
                          : 'Focus on fundamental concepts'
                        }
                      </span>
                    </li>
                  <li className="flex items-start space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {answeredQuestions === totalQuestions
                        ? 'Great job completing all questions!'
                        : 'Try to answer all questions next time'
                      }
                    </span>
                  </li>
                  </>
                )
              })()}
            </ul>
          </Card.Content>
        </Card>
      </div>

      {/* Communication Assessment Section */}
      {communicationData?.assessments?.length > 0 && CommunicationAssessmentCard && (
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Mic className="w-5 h-5 mr-2 text-purple-600" />
              Communication Skills Assessment
            </Card.Title>
            <Card.Description>
              Evaluation of your verbal communication during the interview
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            {/* Average Communication Score */}
            {communicationData.summary?.averageScore && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Average Communication Score
                    </p>
                    <p className="text-xs text-purple-500 dark:text-purple-400">
                      Across all responses
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {Number(communicationData.summary.averageScore).toFixed(1)}/10
                  </div>
                </div>
              </div>
            )}
            
            {/* Individual Assessments */}
            {communicationData.assessments.map((assessment, index) => (
              <CommunicationAssessmentCard
                key={assessment._id || index}
                assessment={{
                  overall_score: assessment.overallScore || 0,
                  subscores: assessment.subscores || {},
                  strengths: assessment.strengths || [],
                  improvements: assessment.improvements || [],
                  summary_comment: assessment.summaryComment,
                  score_level: assessment.scoreLevel
                }}
                questionText={assessment.questionId?.text || `Response ${index + 1}`}
                expandable={true}
                defaultExpanded={index === 0}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Question Review */}
      <Card>
        <Card.Header>
          <Card.Title>Question Review</Card.Title>
          <Card.Description>
            Click on each question to see detailed feedback
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {questions.map((question, index) => {
            const response = responses[index]
            const isExpanded = expandedQuestions[index]
            const responseScore = response?.evaluation?.overallScore || response?.score || 0
            const isCorrect = responseScore >= 70 || response?.isCorrect
            
            return (
              <div 
                key={index}
                className={`border rounded-xl overflow-hidden ${
                  isCorrect ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'
                }`}
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : response?.answer ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white text-left">
                      Q{index + 1}: {(question?.text || 'Question').substring(0, 80)}{question?.text?.length > 80 ? '...' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {responseScore > 0 && (
                      <Badge variant={responseScore >= 70 ? 'success' : responseScore >= 50 ? 'warning' : 'danger'}>
                        {responseScore}%
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Question</h4>
                      <p className="text-gray-900 dark:text-white">{question.text}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Answer</h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded-lg border dark:border-gray-700">
                        {response?.answer || <span className="text-gray-400 italic">Not answered</span>}
                      </p>
                    </div>
                    
                    {question.expectedAnswer && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Answer</h4>
                        <p className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          {question.expectedAnswer}
                        </p>
                      </div>
                    )}
                    
                    {response?.feedback && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">AI Feedback</h4>
                        <div className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
                          {response.feedback.detailedFeedback && (
                            <p>{response.feedback.detailedFeedback}</p>
                          )}
                          {response.feedback.strengths?.length > 0 && (
                            <div>
                              <span className="font-medium text-green-700 dark:text-green-400">Strengths: </span>
                              {response.feedback.strengths.join(', ')}
                            </div>
                          )}
                          {response.feedback.improvements?.length > 0 && (
                            <div>
                              <span className="font-medium text-amber-700 dark:text-amber-400">Areas to improve: </span>
                              {response.feedback.improvements.join(', ')}
                            </div>
                          )}
                          {typeof response.feedback === 'string' && (
                            <p>{response.feedback}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </Card.Content>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/interview/setup">
          <Button size="lg" icon={RefreshCcw}>
            Practice Again
          </Button>
        </Link>
        <Link to="/analytics">
          <Button size="lg" variant="outline" icon={BarChart3}>
            View Analytics
          </Button>
        </Link>
      </div>
    </div>
    </ResultErrorBoundary>
  )
}

export default InterviewResult
