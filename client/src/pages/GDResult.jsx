import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Home, MessageSquare, Star, TrendingUp } from 'lucide-react'

const GDResult = () => {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const stateResult = location.state?.result

  // Fetch result from API if we have a sessionId but no state
  const { data: fetchedResult, isLoading } = useQuery({
    queryKey: ['gd-result', sessionId],
    queryFn: async () => {
      const response = await api.get(`/gd/sessions/${sessionId}/result`)
      return response.data.data
    },
    enabled: !!sessionId && !stateResult,
  })

  const result = stateResult || fetchedResult

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No result data found</p>
          <Button onClick={() => navigate('/gd')}>Go to GD Topics</Button>
        </div>
      </div>
    )
  }

  const {
    topic,
    overallScore,
    feedback,
    contributions,
    strengths,
    improvements,
    duration
  } = result

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', label: 'Excellent' }
    if (score >= 80) return { grade: 'A', color: 'text-green-500', label: 'Very Good' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', label: 'Good' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', label: 'Average' }
    return { grade: 'D', color: 'text-red-600', label: 'Needs Improvement' }
  }

  const gradeInfo = getGrade(overallScore || 65)

  const feedbackCategories = feedback || {
    content: 70,
    clarity: 75,
    relevance: 80,
    engagement: 65,
    leadership: 60
  }

  const contributionsList = contributions || [
    { content: 'Sample contribution about the topic...', score: 75 },
    { content: 'Another point made during the discussion...', score: 80 }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in pb-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">GD Session Complete!</h1>
        <p className="text-gray-600">{topic?.title || 'Group Discussion'}</p>
      </div>

      {/* Overall Score */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Overall Score</p>
            <p className={`text-4xl font-bold ${gradeInfo.color}`}>{overallScore || 72}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Grade</p>
            <p className={`text-4xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Performance</p>
            <Badge 
              variant={overallScore >= 70 ? 'success' : overallScore >= 50 ? 'warning' : 'error'}
              className="text-lg py-1 px-3"
            >
              {gradeInfo.label}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Detailed Feedback */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Skill-wise Performance
        </h2>
        <div className="space-y-4">
          {Object.entries(feedbackCategories).map(([skill, score]) => (
            <div key={skill}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">{skill}</span>
                <span className={`text-sm font-medium ${
                  score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {score}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {(strengths || [
              'Good understanding of the topic',
              'Clear communication style',
              'Respectful of others\' opinions'
            ]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Areas to Improve
          </h3>
          <ul className="space-y-2">
            {(improvements || [
              'Could contribute more frequently',
              'Try to use more examples',
              'Work on building on others\' points'
            ]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Your Contributions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-500" />
          Your Contributions ({contributionsList.length})
        </h2>
        <div className="space-y-3">
          {contributionsList.map((contribution, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-700">{contribution.content}</p>
              </div>
              <Badge variant={contribution.score >= 70 ? 'success' : contribution.score >= 50 ? 'warning' : 'error'}>
                {contribution.score}%
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Tips for Next Time */}
      <Card className="p-6 bg-primary-50 border-primary-200">
        <h3 className="font-semibold text-primary-700 mb-3">💡 Tips for Your Next GD</h3>
        <ul className="grid md:grid-cols-2 gap-2 text-sm text-primary-600">
          <li>• Start with a clear stance on the topic</li>
          <li>• Support your points with facts and examples</li>
          <li>• Listen actively to others' viewpoints</li>
          <li>• Build on others' ideas constructively</li>
          <li>• Maintain a respectful and calm demeanor</li>
          <li>• Summarize key points when appropriate</li>
        </ul>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => navigate('/gd')} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Practice Another Topic
        </Button>
        <Button asChild>
          <Link to="/dashboard">
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default GDResult
