import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Button, Card, Spinner, Badge } from '../components/ui'
import { ProctoredSession } from '../components/proctoring'
import { Clock, ArrowRight, CheckCircle, XCircle } from 'lucide-react'

const AptitudeTest = () => {
  const { testId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Check if proctoring is enabled
  const searchParams = new URLSearchParams(location.search)
  const proctoringEnabled = searchParams.get('proctored') !== 'false'
  
  const [testData, setTestData] = useState(location.state?.testData || null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!testData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Test data not found</p>
          <Button onClick={() => navigate('/aptitude')}>Go Back</Button>
        </div>
      </div>
    )
  }

  const currentQuestion = testData.questions[currentIndex]
  const totalQuestions = testData.totalQuestions

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const submitAnswer = async () => {
    if (selectedOption === null) return
    setSubmitting(true)

    try {
      const response = await api.post(`/aptitude/${testId}/submit-answer`, {
        questionIndex: currentIndex,
        selectedOption,
        timeTaken: timeElapsed
      })

      setAnswers(prev => ({
        ...prev,
        [currentIndex]: {
          selected: selectedOption,
          isCorrect: response.data.data.isCorrect,
          correctAnswer: response.data.data.correctAnswer
        }
      }))

      setLastResult(response.data.data)
      setShowResult(true)
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const nextQuestion = () => {
    setShowResult(false)
    setSelectedOption(null)
    setLastResult(null)
    
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setTimeElapsed(0)
    } else {
      completeTest()
    }
  }

  const completeTest = async () => {
    try {
      const response = await api.post(`/aptitude/${testId}/complete`)
      navigate('/aptitude/result', { state: { result: response.data.data } })
    } catch (error) {
      console.error('Error completing test:', error)
    }
  }

  const TestContent = (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="secondary">
            Question {currentIndex + 1} of {totalQuestions}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let optionClass = 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            
            if (showResult) {
              if (index === lastResult.correctAnswer) {
                optionClass = 'border-green-500 bg-green-50'
              } else if (index === selectedOption && !lastResult.isCorrect) {
                optionClass = 'border-red-500 bg-red-50'
              }
            } else if (selectedOption === index) {
              optionClass = 'border-primary-500 bg-primary-50'
            }

            return (
              <button
                key={index}
                onClick={() => !showResult && setSelectedOption(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {showResult && index === lastResult.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {showResult && index === selectedOption && !lastResult.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div className={`mt-6 p-4 rounded-lg ${lastResult.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {lastResult.isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-700">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-700">Incorrect</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          {!showResult ? (
            <Button 
              onClick={submitAnswer} 
              disabled={selectedOption === null}
              isLoading={submitting}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              {currentIndex < totalQuestions - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Finish Test'
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Question Navigator */}
      <Card className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <button
              key={idx}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                idx === currentIndex
                  ? 'bg-primary-500 text-white'
                  : answers[idx]
                  ? answers[idx].isCorrect
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )

  return (
    <ProctoredSession
      sessionType="aptitude"
      sessionId={testId}
      enabled={proctoringEnabled}
      config={{
        cameraEnabled: true,
        screenMonitoringEnabled: true,
        audioMonitoringEnabled: false,
        fullscreenRequired: true
      }}
      strictMode={true}
    >
      {TestContent}
    </ProctoredSession>
  )
}

export default AptitudeTest
