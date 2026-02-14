import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import api from '../services/api'
import { Trophy, CheckCircle, XCircle, RotateCcw, Home, ArrowLeft } from 'lucide-react'

const AptitudeResult = () => {
  const { testId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const stateResult = location.state?.result

  // Fetch result from API if we have a testId but no state
  const { data: fetchedResult, isLoading } = useQuery({
    queryKey: ['aptitude-result', testId],
    queryFn: async () => {
      const response = await api.get(`/aptitude/${testId}`)
      const test = response.data.data
      // Transform to expected format
      return {
        percentage: test.percentage,
        correctAnswers: test.correctAnswers,
        totalQuestions: test.totalQuestions,
        timeTaken: test.totalTime,
        responses: test.responses?.map(r => ({
          question: r.questionText,
          selectedOption: r.selectedOption,
          isCorrect: r.isCorrect,
          correctAnswer: r.options?.findIndex(o => o.isCorrect)
        })) || []
      }
    },
    enabled: !!testId && !stateResult,
  })

  const result = stateResult || fetchedResult

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No result data found</p>
          <Button onClick={() => navigate('/aptitude')}>Go to Aptitude Tests</Button>
        </div>
      </div>
    )
  }

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' }
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' }
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' }
  }

  const gradeInfo = getGrade(result.percentage)

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      {/* Score Card */}
      <Card className="p-8 text-center">
        <div className={`w-24 h-24 rounded-full ${gradeInfo.bg} flex items-center justify-center mx-auto mb-4`}>
          <Trophy className={`w-12 h-12 ${gradeInfo.color}`} />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Test Completed!</h1>
        
        <div className="flex items-center justify-center gap-8 my-6">
          <div>
            <p className={`text-5xl font-bold ${gradeInfo.color}`}>{result.percentage}%</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Score</p>
          </div>
          <div className="h-16 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className={`text-5xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Grade</p>
          </div>
        </div>

        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>{result.correctAnswers} Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span>{result.totalQuestions - result.correctAnswers} Incorrect</span>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 mt-4">
          Time taken: {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
        </p>
      </Card>

      {/* Detailed Results */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Question Review</h2>
        <div className="space-y-4">
          {result.responses.map((response, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                response.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  response.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {response.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <XCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white mb-2">
                    Q{index + 1}: {response.question}
                  </p>
                  <div className="text-sm">
                    <p className="text-slate-600 dark:text-slate-400">
                      Your answer: <span className={response.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        Option {String.fromCharCode(65 + response.selectedOption)}
                      </span>
                    </p>
                    {!response.isCorrect && (
                      <p className="text-green-600">
                        Correct answer: Option {String.fromCharCode(65 + response.correctAnswer)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate('/aptitude')}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Take Another Test
        </Button>
        <Button onClick={() => navigate('/dashboard')}>
          <Home className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default AptitudeResult
