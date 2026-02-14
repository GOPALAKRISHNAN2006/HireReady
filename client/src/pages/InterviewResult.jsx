import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Button } from '../components/ui'
import { LoadingOverlay } from '../components/ui/Spinner'
import api from '../services/api'
import communicationApi from '../services/communicationApi'
import { notifyInterviewComplete } from '../hooks/useNotifications'
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ArrowLeft,
  RefreshCcw,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Mic
} from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
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
          <Link to="/dashboard" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Displaying Results</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">There was an error rendering the interview results. Your interview data is saved.</p>
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
  const notifiedRef = useRef(false)

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

  // Fire notification when result loads
  useEffect(() => {
    if (interview?.score && !notifiedRef.current) {
      notifiedRef.current = true
      notifyInterviewComplete(interview.score, interview.category || interview.type)
    }
  }, [interview])

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

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent!'
    if (score >= 80) return 'Great Job!'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  if (isLoading) {
    return <LoadingOverlay message="Loading results..." />
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/dashboard" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <Card className="p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unable to Load Results</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">There was an error loading the interview results.</p>
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
        <Link to="/dashboard" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <Card className="p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Interview Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">This interview session could not be found or may have expired.</p>
          <Link to="/interview/setup">
            <Button>Start New Interview</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <ResultErrorBoundary>
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </Link>

      {/* Hero Score Card */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient background based on score */}
        <div className={`relative p-10 text-white ${
          score >= 80 
            ? 'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600' 
            : score >= 60 
              ? 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500' 
              : 'bg-gradient-to-br from-rose-600 via-red-500 to-pink-600'
        }`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Trophy className="w-4 h-4 mr-2" />
              Interview Complete
            </div>
            
            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${score * 3.267} ${326.7 - score * 3.267}`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{score}%</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{getScoreLabel(score)}</h1>
            <p className="text-white/70 max-w-md mx-auto">
              {score >= 80 ? 'Outstanding performance! You demonstrated excellent knowledge.' :
               score >= 60 ? 'Good effort! Review the feedback to improve further.' :
               'Keep practicing! Focus on the areas highlighted below.'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Questions', value: totalQuestions, icon: Target, gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
          { label: 'Answered', value: answeredQuestions, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', shadow: 'shadow-green-500/20' },
          { label: 'Correct', value: correctAnswers, icon: Trophy, gradient: 'from-indigo-500 to-violet-500', shadow: 'shadow-indigo-500/20' },
          { label: 'Duration', value: `${duration}m`, icon: Clock, gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-lg ${stat.shadow} transition-all duration-300`}>
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Target className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance Breakdown</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              {interview?.categoryScores && typeof interview.categoryScores === 'object' ? (
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
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{cat.category}</span>
                        <span className={`font-semibold ${cat.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : cat.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>{cat.score}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${cat.score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : cat.score >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-pink-400'}`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-6">
                    <Target className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    No category breakdown available
                  </div>
                )
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-6">
                  <Target className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  No category breakdown available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Lightbulb className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Key Insights</h3>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {(() => {
                const insightItems = Array.isArray(interview?.insights)
                  ? interview.insights
                  : interview?.insights?.topStrengths || interview?.insights?.areasToImprove
                    ? [...(interview.insights.topStrengths || []), ...(interview.insights.areasToImprove || [])]
                    : null
                if (insightItems && insightItems.length > 0) {
                  return insightItems.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{typeof insight === 'string' ? insight : insight?.toString?.() || ''}</span>
                    </li>
                  ))
                }
                return (
                  <>
                    {interview?.insights?.overallFeedback && (
                      <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{interview.insights.overallFeedback}</span>
                      </li>
                    )}
                    <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {score >= 70 
                          ? 'Strong understanding of core concepts' 
                          : 'Focus on fundamental concepts'
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
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
          </div>
        </div>
      </div>

      {/* Communication Assessment Section */}
      {communicationData?.assessments?.length > 0 && CommunicationAssessmentCard && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Mic className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Communication Skills Assessment</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Evaluation of your verbal communication during the interview</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Average Communication Score */}
            {communicationData.summary?.averageScore && (
              <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 mb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      Average Communication Score
                    </p>
                    <p className="text-xs text-purple-500 dark:text-purple-400 mt-0.5">
                      Across all responses
                    </p>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
          </div>
        </div>
      )}

      {/* Question Review */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Question Review</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Click on each question to see detailed feedback</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-slate-100 dark:scrollbar-track-slate-800">
          {questions.map((question, index) => {
            const response = responses[index]
            const isExpanded = expandedQuestions[index]
            const responseScore = response?.evaluation?.overallScore || response?.score || 0
            const isCorrect = responseScore >= 70 || response?.isCorrect
            
            return (
              <div 
                key={index}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isCorrect 
                    ? 'border-emerald-200/80 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700' 
                    : response?.answer 
                      ? 'border-rose-200/80 dark:border-rose-800/50 hover:border-rose-300 dark:hover:border-rose-700'
                      : 'border-slate-200/80 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCorrect 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                        : response?.answer 
                          ? 'bg-rose-100 dark:bg-rose-900/30'
                          : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : response?.answer ? (
                        <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">{index + 1}</span>
                      )}
                    </div>
                    <span className="font-medium text-sm text-slate-900 dark:text-white text-left leading-snug">
                      Q{index + 1}: {(question?.text || 'Question').substring(0, 80)}{question?.text?.length > 80 ? '...' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    {responseScore > 0 && (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        responseScore >= 70 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : responseScore >= 50 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {responseScore}%
                      </span>
                    )}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} bg-slate-100 dark:bg-slate-800`}>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Question</h4>
                      <p className="text-sm text-slate-900 dark:text-white leading-relaxed">{question.text}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Your Answer</h4>
                      <div className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                        {response?.answer || <span className="text-slate-400 italic">Not answered</span>}
                      </div>
                    </div>
                    
                    {question.expectedAnswer && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Expected Answer</h4>
                        <div className="text-sm text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                          {question.expectedAnswer}
                        </div>
                      </div>
                    )}
                    
                    {response?.feedback && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">AI Feedback</h4>
                        <div className="text-sm text-slate-700 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200/60 dark:border-blue-800/40 space-y-3">
                          {response.feedback.detailedFeedback && (
                            <p className="leading-relaxed">{response.feedback.detailedFeedback}</p>
                          )}
                          {response.feedback.strengths?.length > 0 && (
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Strengths: </span>
                                <span className="leading-relaxed">{response.feedback.strengths.join(', ')}</span>
                              </div>
                            </div>
                          )}
                          {response.feedback.improvements?.length > 0 && (
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-amber-700 dark:text-amber-400">Areas to improve: </span>
                                <span className="leading-relaxed">{response.feedback.improvements.join(', ')}</span>
                              </div>
                            </div>
                          )}
                          {typeof response.feedback === 'string' && (
                            <p className="leading-relaxed">{response.feedback}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pb-6">
        <Link to="/interview/setup">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <RefreshCcw className="w-5 h-5" />
            Practice Again
          </button>
        </Link>
        <Link to="/analytics">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <BarChart3 className="w-5 h-5" />
            View Analytics
          </button>
        </Link>
      </div>
    </div>
    </ResultErrorBoundary>
  )
}

export default InterviewResult
