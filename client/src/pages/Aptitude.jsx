import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Button, Card, Spinner, Badge } from '../components/ui'
import { Brain, Calculator, BookOpen, BarChart, Globe, Play, History, Trophy } from 'lucide-react'

const Aptitude = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [questionCount, setQuestionCount] = useState(10)

  const icons = {
    'quantitative': Calculator,
    'logical': Brain,
    'verbal': BookOpen,
    'data-interpretation': BarChart,
    'general-knowledge': Globe
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [catRes, histRes] = await Promise.all([
        api.get('/aptitude/categories'),
        api.get('/aptitude/history?limit=5')
      ])
      setCategories(catRes.data.data || [])
      setHistory(histRes.data.data?.tests || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTest = async () => {
    if (!selectedCategory) return
    try {
      const response = await api.post('/aptitude/start', {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        totalQuestions: questionCount
      })
      navigate(`/aptitude/test/${response.data.data.testId}`, {
        state: { testData: response.data.data }
      })
    } catch (error) {
      console.error('Error starting test:', error)
      alert(error.response?.data?.message || 'Failed to start test')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aptitude Tests</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Practice quantitative, logical, and verbal reasoning</p>
      </div>

      {/* Category Selection */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const IconComponent = icons[cat.id] || Brain
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === cat.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                selectedCategory === cat.id ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <IconComponent className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
              </div>
              <h3 className="font-medium text-sm text-center dark:text-white">{cat.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{cat.questionCount} questions</p>
              <Badge variant="secondary" className="mt-2 mx-auto block w-fit text-xs">
                {cat.testsCompleted} completed
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Test Configuration */}
      {selectedCategory && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Configure Your Test</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg border capitalize ${
                      selectedDifficulty === d
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:text-gray-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Questions</label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-2 rounded-lg border ${
                      questionCount === n
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:text-gray-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button fullWidth onClick={startTest}>
                <Play className="w-4 h-4 mr-2" />
                Start Test
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Recent History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Recent Tests</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/aptitude/history')}>
            View All
          </Button>
        </div>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No tests taken yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((test) => (
              <div key={test._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    test.percentage >= 70 ? 'bg-green-100' : test.percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Trophy className={`w-5 h-5 ${
                      test.percentage >= 70 ? 'text-green-600' : test.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium capitalize dark:text-white">{test.category}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(test.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg dark:text-white">{test.percentage}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {test.correctAnswers}/{test.totalQuestions} correct
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Aptitude
