import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge, ProgressBar } from '../components/ui'
import { LoadingOverlay } from '../components/ui/Spinner'
import api from '../services/api'
import { useState } from 'react'
import {
  ArrowLeft,
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Clock,
  RefreshCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const InterviewFeedback = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSections, setExpandedSections] = useState({})

  const { data: interview, isLoading, error } = useQuery({
    queryKey: ['interview-feedback', id],
    queryFn: async () => {
      const response = await api.get(`/interviews/${id}`)
      return response.data?.data?.interview || response.data?.interview || response.data
    },
    enabled: !!id,
  })

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Generate AI-style feedback analysis from interview data
  const generateFeedback = (interview) => {
    if (!interview?.questions) return null

    const questions = interview.questions || []
    const totalQ = questions.length
    const answered = questions.filter(q => q.userAnswer?.trim()).length
    const avgScore = questions.reduce((sum, q) => sum + (q.score || 0), 0) / (totalQ || 1)

    const strengths = []
    const improvements = []
    const tips = []

    if (avgScore >= 7) strengths.push('Strong technical knowledge demonstrated across questions')
    if (avgScore >= 5 && avgScore < 7) strengths.push('Good foundational understanding of core concepts')
    if (answered === totalQ) strengths.push('Attempted all questions — shows commitment and confidence')
    if (answered / totalQ >= 0.8) strengths.push('High completion rate shows good time management')

    questions.forEach(q => {
      if (q.score >= 8) strengths.push(`Excellent answer on "${q.question?.substring(0, 50)}..."`)
      if (q.score <= 4 && q.score > 0) improvements.push(`Review topic: "${q.question?.substring(0, 50)}..."`)
    })

    if (avgScore < 5) improvements.push('Consider deeper study of fundamental concepts')
    if (answered < totalQ) improvements.push(`${totalQ - answered} question(s) were left unanswered`)
    if (interview.duration && interview.duration < 300) improvements.push('Spent very little time — consider taking more time to think through answers')

    tips.push('Use the STAR method (Situation, Task, Action, Result) for behavioral questions')
    tips.push('Practice explaining your thought process aloud before answering')
    tips.push('Review the topics you scored lowest on using the Study Materials section')
    if (avgScore < 7) tips.push('Try mock interviews to build confidence and reduce anxiety')
    if (avgScore >= 7) tips.push('Challenge yourself with harder difficulty levels to keep growing')

    return {
      overallScore: Math.round(avgScore * 10),
      totalQuestions: totalQ,
      answered,
      strengths: strengths.slice(0, 5),
      improvements: improvements.slice(0, 5),
      tips: tips.slice(0, 5),
      performanceLevel: avgScore >= 8 ? 'Excellent' : avgScore >= 6 ? 'Good' : avgScore >= 4 ? 'Average' : 'Needs Improvement',
      performanceColor: avgScore >= 8 ? 'emerald' : avgScore >= 6 ? 'blue' : avgScore >= 4 ? 'amber' : 'red',
    }
  }

  if (isLoading) return <LoadingOverlay message="Loading feedback..." />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Feedback</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Could not retrieve interview data.</p>
        <Button onClick={() => navigate('/analytics')}>Back to Analytics</Button>
      </div>
    )
  }

  const feedback = generateFeedback(interview)
  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Feedback Available</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Complete an interview first to receive feedback.</p>
        <Link to="/interview/setup"><Button>Start Interview</Button></Link>
      </div>
    )
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
    { key: 'strengths', label: 'Strengths', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'improve', label: 'Improve', icon: <TrendingDown className="w-4 h-4" /> },
    { key: 'tips', label: 'Tips', icon: <Lightbulb className="w-4 h-4" /> },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Debrief</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {interview?.type || 'Technical'} Interview • {new Date(interview?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge variant={feedback.performanceColor}>{feedback.performanceLevel}</Badge>
      </div>

      {/* Score Card */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className={`text-3xl font-bold text-${feedback.performanceColor}-600`}>{feedback.overallScore}%</div>
            <p className="text-sm text-gray-500 mt-1">Overall Score</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{feedback.totalQuestions}</div>
            <p className="text-sm text-gray-500 mt-1">Total Questions</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600">{feedback.answered}</div>
            <p className="text-sm text-gray-500 mt-1">Answered</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600">{feedback.totalQuestions - feedback.answered}</div>
            <p className="text-sm text-gray-500 mt-1">Skipped</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar 
            value={feedback.overallScore} 
            max={100} 
            color={feedback.performanceColor} 
            size="lg" 
            showPercentage 
          />
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-emerald-500" /> Top Strengths
            </h3>
            <ul className="space-y-2">
              {feedback.strengths.slice(0, 3).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-amber-500" /> Key Improvements
            </h3>
            <ul className="space-y-2">
              {feedback.improvements.slice(0, 3).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <TrendingDown className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
              {feedback.improvements.length === 0 && (
                <li className="text-sm text-gray-400">Great job! No major issues found.</li>
              )}
            </ul>
          </Card>
        </div>
      )}

      {activeTab === 'strengths' && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Your Strengths
          </h3>
          <div className="space-y-3">
            {feedback.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{s}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'improve' && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Areas to Improve
          </h3>
          <div className="space-y-3">
            {feedback.improvements.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Target className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{s}</p>
              </div>
            ))}
            {feedback.improvements.length === 0 && (
              <p className="text-gray-400 text-sm">No major improvements needed — keep going!</p>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'tips' && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-500" /> Personalized Tips
          </h3>
          <div className="space-y-3">
            {feedback.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Question Breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" /> Question Breakdown
        </h3>
        <div className="space-y-2">
          {(interview?.questions || []).map((q, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(`q-${i}`)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    (q.score || 0) >= 7 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                    (q.score || 0) >= 4 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                  }`}>
                    {q.score || 0}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-left">
                    {q.question?.substring(0, 80)}{q.question?.length > 80 ? '...' : ''}
                  </span>
                </div>
                {expandedSections[`q-${i}`] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections[`q-${i}`] && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Your Answer</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {q.userAnswer || <span className="italic text-gray-400">No answer provided</span>}
                    </p>
                  </div>
                  {q.feedback && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">AI Feedback</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        {q.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center pb-8">
        <Link to="/interview/setup">
          <Button className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Retry Interview
          </Button>
        </Link>
        <Link to="/study-materials">
          <Button variant="outline" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Study Materials
          </Button>
        </Link>
        <Link to="/analytics">
          <Button variant="outline" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> View Analytics
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewFeedback
