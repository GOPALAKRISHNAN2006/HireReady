/**
 * ===========================================
 * Communication Skills Assessment Page
 * ===========================================
 * 
 * Dedicated page for viewing communication skills
 * assessment history and detailed analysis.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { 
  CommunicationStats, 
  CommunicationAssessmentCard 
} from '../components/communication'
import communicationApi from '../services/communicationApi'
import { 
  Mic, 
  TrendingUp, 
  Award,
  Clock,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Volume2,
  BookOpen,
  Target,
  Sparkles,
  Play
} from 'lucide-react'

const CommunicationAssessment = () => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Fetch communication stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['communication', 'stats'],
    queryFn: async () => {
      try {
        const response = await communicationApi.getStats()
        return response.data.data || response.data
      } catch (e) {
        return null
      }
    }
  })

  // Fetch assessment history
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['communication', 'history', selectedFilter],
    queryFn: async () => {
      try {
        const params = { limit: 10 }
        const response = await communicationApi.getHistory(params)
        return response.data.data?.assessments || response.data.assessments || []
      } catch (e) {
        return []
      }
    }
  })

  const filters = [
    { id: 'all', name: 'All Assessments' },
    { id: 'recent', name: 'This Week' },
    { id: 'best', name: 'Best Scores' }
  ]

  const skills = [
    { 
      name: 'Clarity', 
      icon: Volume2, 
      description: 'How clear and understandable your speech is',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Fluency', 
      icon: MessageSquare, 
      description: 'Smoothness and flow of your communication',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Grammar', 
      icon: BookOpen, 
      description: 'Grammatical accuracy in your responses',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      name: 'Vocabulary', 
      icon: Sparkles, 
      description: 'Use of appropriate and varied vocabulary',
      color: 'from-amber-500 to-orange-500'
    },
    { 
      name: 'Confidence', 
      icon: Target, 
      description: 'Assertiveness and self-assurance in delivery',
      color: 'from-red-500 to-rose-500'
    },
    { 
      name: 'Relevance', 
      icon: ChevronRight, 
      description: 'How well you address and stay on topic',
      color: 'from-teal-500 to-cyan-500'
    }
  ]

  // Loading state
  if (statsLoading && historyLoading) {
    return (
      <div className="space-y-6">
        <LoadingCard />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><LoadingCard /></div>
          <div><LoadingCard /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          
          {/* Floating icons */}
          <div className="absolute top-10 right-20 opacity-30">
            <Mic className="w-12 h-12 animate-float" />
          </div>
          <div className="absolute bottom-10 right-40 opacity-20">
            <Volume2 className="w-8 h-8 animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
            <Mic className="w-4 h-4 mr-2" />
            Communication Skills
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Communication Assessment</h1>
          <p className="text-purple-100 text-lg max-w-2xl">
            Track and improve your verbal communication skills with AI-powered analysis.
          </p>

          {/* Quick Stats */}
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <div className="text-3xl font-bold">
                {statsData?.averages?.overall?.toFixed(1) || '0.0'}/10
              </div>
              <div className="text-sm text-purple-100">Average Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{historyData?.length || 0}</div>
              <div className="text-sm text-purple-100">Assessments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-300">
                {statsData?.trends?.overall > 0 ? '+' : ''}{statsData?.trends?.overall?.toFixed(1) || '0'}%
              </div>
              <div className="text-sm text-purple-100">Improvement</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              onClick={() => navigate('/communication/test')}
              className="bg-white text-purple-600 hover:bg-purple-50"
              icon={Play}
            >
              Take Communication Test
            </Button>
            <Button 
              onClick={() => navigate('/interview/setup')}
              variant="outline"
              className="border-white/50 text-white hover:bg-white/10"
            >
              Start Interview Practice
            </Button>
          </div>
        </div>
      </div>

      {/* Skills Overview */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          Skills Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map((skill) => (
            <Card key={skill.name} className="text-center hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${skill.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <skill.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{skill.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{skill.description}</p>
              <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {statsData?.averages?.[skill.name.toLowerCase()]?.toFixed(1) || '-'}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Component */}
      <CommunicationStats />

      {/* Assessment History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            Assessment History
          </h2>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {historyLoading ? (
          <LoadingCard />
        ) : historyData && historyData.length > 0 ? (
          <div className="space-y-4">
            {historyData.map((assessment, index) => (
              <CommunicationAssessmentCard
                key={assessment._id || index}
                assessment={assessment}
                questionNumber={index + 1}
                showDetails={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <Mic className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No Assessments Yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Complete an interview to get your communication skills assessed by our AI.
              </p>
              <Button onClick={() => navigate('/interview/setup')} icon={Play}>
                Start Interview
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-none">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Pro Tips for Better Communication</h3>
            <ul className="text-slate-600 dark:text-slate-400 space-y-1 text-sm">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Use varied vocabulary to express your ideas</li>
              <li>• Structure your responses with a clear beginning, middle, and end</li>
              <li>• Practice active listening and address the question directly</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 group hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate('/tips')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Interview Tips</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Learn from experts</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        <Card 
          className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 group hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate('/analytics')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Full Analytics</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">View detailed progress</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        <Card 
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 group hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate('/interview/setup')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Practice More</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Start a new interview</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CommunicationAssessment
