import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { skillsApi } from '../services/featureApi'
import { 
  Radar, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  BookOpen,
  Zap,
  ChevronRight,
  Star,
  ArrowUp,
  Sparkles,
  RefreshCw,
  Download,
  Share2,
  Info,
  Clock
} from 'lucide-react'

const SkillRadar = () => {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [timeRange, setTimeRange] = useState('month')
  const canvasRef = useRef(null)

  // Fetch skills data
  const { data: skillsData, isLoading: skillsLoading, refetch: refetchSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      try {
        const response = await skillsApi.getSkills()
        return response.data.data
      } catch (e) {
        return null
      }
    },
  })

  // Fetch recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ['skills', 'recommendations'],
    queryFn: async () => {
      try {
        const response = await skillsApi.getRecommendations()
        return response.data.data
      } catch (e) {
        return null
      }
    },
  })

  // Default skills if no data
  const defaultSkills = [
    { categoryName: 'Data Structures', currentLevel: 0, trend: 'up', color: '#3B82F6' },
    { categoryName: 'Algorithms', currentLevel: 0, trend: 'up', color: '#8B5CF6' },
    { categoryName: 'System Design', currentLevel: 0, trend: 'same', color: '#EC4899' },
    { categoryName: 'Problem Solving', currentLevel: 0, trend: 'up', color: '#F59E0B' },
    { categoryName: 'Communication', currentLevel: 0, trend: 'up', color: '#10B981' },
    { categoryName: 'Behavioral', currentLevel: 0, trend: 'same', color: '#06B6D4' },
  ]

  // Map skills data to display format
  const skills = (skillsData?.skills || defaultSkills).map((skill, index) => ({
    name: skill.categoryName,
    score: skill.currentLevel || 0,
    target: skill.targetLevel || 80,
    change: skill.history?.length > 1 
      ? skill.currentLevel - (skill.history[skill.history.length - 2]?.level || 0)
      : 0,
    trend: skill.history?.length > 1 
      ? skill.currentLevel > (skill.history[skill.history.length - 2]?.level || 0) ? 'up' : 'down'
      : 'same',
    color: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'][index % 6]
  }))

  const overallScore = skillsData?.overallLevel || Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length)
  const rank = skillsData?.rank || 'beginner'
  const strengths = skillsData?.strengths || recommendationsData?.strengths || []
  const weaknesses = skillsData?.weaknesses || recommendationsData?.weaknesses || []

  // Draw radar chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const numSkills = skills.length
    const angleStep = (Math.PI * 2) / numSkills

    // Draw background circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2)
      ctx.strokeStyle = '#E5E7EB'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw axis lines
    skills.forEach((_, index) => {
      const angle = angleStep * index - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      )
      ctx.strokeStyle = '#E5E7EB'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw skill polygon
    ctx.beginPath()
    skills.forEach((skill, index) => {
      const angle = angleStep * index - Math.PI / 2
      const skillRadius = (skill.score / 100) * radius
      const x = centerX + Math.cos(angle) * skillRadius
      const y = centerY + Math.sin(angle) * skillRadius
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    
    // Fill
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)')
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)')
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Stroke
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points
    skills.forEach((skill, index) => {
      const angle = angleStep * index - Math.PI / 2
      const skillRadius = (skill.score / 100) * radius
      const x = centerX + Math.cos(angle) * skillRadius
      const y = centerY + Math.sin(angle) * skillRadius

      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = skill.color
      ctx.fill()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Draw labels
    ctx.font = '12px Inter, sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'center'
    
    skills.forEach((skill, index) => {
      const angle = angleStep * index - Math.PI / 2
      const labelRadius = radius + 25
      const x = centerX + Math.cos(angle) * labelRadius
      const y = centerY + Math.sin(angle) * labelRadius + 4
      
      ctx.fillText(skill.name, x, y)
    })
  }, [skills])

  const recommendations = [
    {
      skill: 'System Design',
      priority: 'High',
      action: 'Practice distributed system concepts',
      resources: 12,
    },
    {
      skill: 'SQL',
      priority: 'Medium',
      action: 'Work on complex query optimization',
      resources: 8,
    },
    {
      skill: 'Algorithms',
      priority: 'Medium',
      action: 'Focus on dynamic programming',
      resources: 15,
    },
  ]

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
              <Radar className="w-4 h-4 mr-2" />
              Skill Assessment
            </div>
            <h1 className="text-4xl font-bold mb-3">Skill Radar</h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Visualize your technical skills and track your improvement over time.
            </p>
          </div>

          {/* Overall Score */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">{overallScore}</div>
                <div className="text-sm text-blue-100">Overall Score</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Skills Overview</Card.Title>
                <div className="flex items-center gap-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 dark:text-white"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="flex justify-center">
                <canvas ref={canvasRef} width={400} height={400} />
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Skill Details */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Skill Breakdown</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div 
                    key={skill.name}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedSkill === skill.name 
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedSkill(skill.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: skill.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">{skill.score}%</span>
                        <span className={`flex items-center text-xs ${
                          skill.trend === 'up' ? 'text-green-500' : 
                          skill.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {skill.trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                          {skill.trend === 'down' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                          {skill.change > 0 && '+'}{skill.change}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${skill.score}%`,
                          backgroundColor: skill.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" icon={Download} className="flex-1">
              Export
            </Button>
            <Button variant="outline" icon={Share2} className="flex-1">
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <Card.Title>Improvement Recommendations</Card.Title>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered suggestions to boost your skills</p>
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={rec.priority === 'High' ? 'danger' : 'warning'}>
                    {rec.priority} Priority
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{rec.skill}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{rec.action}</p>
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{rec.resources} resources available</span>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Strongest Skill', value: 'JavaScript', subtext: '90%', icon: Star, color: 'from-amber-500 to-orange-500' },
          { label: 'Most Improved', value: 'Problem Solving', subtext: '+15%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
          { label: 'Focus Area', value: 'System Design', subtext: '65%', icon: Target, color: 'from-red-500 to-rose-500' },
          { label: 'Practice Time', value: '12.5 hrs', subtext: 'This month', icon: Clock, color: 'from-purple-500 to-indigo-500' },
        ].map((stat, index) => (
          <Card key={index} hover className="group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className="relative">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{stat.subtext}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SkillRadar
