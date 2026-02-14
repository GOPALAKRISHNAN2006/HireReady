import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Badge } from '../components/ui'
import { 
  Building2, 
  Search, 
  Star,
  MapPin,
  Users,
  Briefcase,
  ExternalLink,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Clock,
  Target,
  Filter
} from 'lucide-react'

const CompanyPrep = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const industries = [
    { id: 'all', label: 'All Industries' },
    { id: 'tech', label: 'Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'consulting', label: 'Consulting' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'healthcare', label: 'Healthcare' },
  ]

  const companies = [
    {
      id: 'google',
      name: 'Google',
      logo: 'https://www.google.com/favicon.ico',
      industry: 'tech',
      difficulty: 'hard',
      rating: 4.5,
      location: 'Mountain View, CA',
      employees: '150,000+',
      description: 'Leading technology company known for search engine and cloud services',
      interviewTypes: ['DSA', 'System Design', 'Behavioral'],
      avgSalary: '$180K - $350K',
      interviewRounds: 5,
      timeToHire: '4-6 weeks',
      tips: ['Focus on problem-solving approach', 'Practice on whiteboard', 'Prepare for behavioral (Googleyness)'],
      questionsCount: 250,
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: 'https://www.amazon.com/favicon.ico',
      industry: 'tech',
      difficulty: 'hard',
      rating: 4.3,
      location: 'Seattle, WA',
      employees: '1.5M+',
      description: 'E-commerce and cloud computing giant',
      interviewTypes: ['DSA', 'System Design', 'Leadership Principles'],
      avgSalary: '$160K - $320K',
      interviewRounds: 5,
      timeToHire: '3-5 weeks',
      tips: ['Master the 16 Leadership Principles', 'Use STAR method for behavioral', 'Practice system design at scale'],
      questionsCount: 320,
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      logo: 'https://www.microsoft.com/favicon.ico',
      industry: 'tech',
      difficulty: 'hard',
      rating: 4.4,
      location: 'Redmond, WA',
      employees: '220,000+',
      description: 'Software and cloud computing leader',
      interviewTypes: ['DSA', 'System Design', 'Behavioral'],
      avgSalary: '$150K - $300K',
      interviewRounds: 4,
      timeToHire: '3-4 weeks',
      tips: ['Focus on coding fundamentals', 'Prepare for design questions', 'Show growth mindset'],
      questionsCount: 280,
    },
    {
      id: 'meta',
      name: 'Meta',
      logo: 'https://www.facebook.com/favicon.ico',
      industry: 'tech',
      difficulty: 'hard',
      rating: 4.2,
      location: 'Menlo Park, CA',
      employees: '80,000+',
      description: 'Social media and metaverse company',
      interviewTypes: ['DSA', 'System Design', 'Behavioral'],
      avgSalary: '$170K - $340K',
      interviewRounds: 4,
      timeToHire: '4-6 weeks',
      tips: ['Speed is important - practice timed coding', 'Focus on optimal solutions', 'Prepare for product sense questions'],
      questionsCount: 200,
    },
    {
      id: 'apple',
      name: 'Apple',
      logo: 'https://www.apple.com/favicon.ico',
      industry: 'tech',
      difficulty: 'hard',
      rating: 4.6,
      location: 'Cupertino, CA',
      employees: '160,000+',
      description: 'Consumer electronics and software company',
      interviewTypes: ['DSA', 'System Design', 'Domain Expertise'],
      avgSalary: '$165K - $330K',
      interviewRounds: 5,
      timeToHire: '4-8 weeks',
      tips: ['Know your domain well', 'Demonstrate attention to detail', 'Show passion for products'],
      questionsCount: 180,
    },
    {
      id: 'netflix',
      name: 'Netflix',
      logo: 'https://www.netflix.com/favicon.ico',
      industry: 'tech',
      difficulty: 'hard',
      rating: 4.4,
      location: 'Los Gatos, CA',
      employees: '12,000+',
      description: 'Streaming entertainment service',
      interviewTypes: ['DSA', 'System Design', 'Culture Fit'],
      avgSalary: '$200K - $400K',
      interviewRounds: 4,
      timeToHire: '3-5 weeks',
      tips: ['Understand Netflix culture deck', 'Prepare for high bar discussions', 'Show independence'],
      questionsCount: 120,
    },
    {
      id: 'goldman',
      name: 'Goldman Sachs',
      logo: 'https://www.goldmansachs.com/favicon.ico',
      industry: 'finance',
      difficulty: 'medium',
      rating: 4.1,
      location: 'New York, NY',
      employees: '45,000+',
      description: 'Leading global investment banking firm',
      interviewTypes: ['DSA', 'Finance Knowledge', 'Behavioral'],
      avgSalary: '$120K - $250K',
      interviewRounds: 4,
      timeToHire: '4-8 weeks',
      tips: ['Know financial concepts', 'Prepare for brain teasers', 'Show analytical thinking'],
      questionsCount: 150,
    },
    {
      id: 'jpmorgan',
      name: 'JP Morgan',
      logo: 'https://www.jpmorganchase.com/favicon.ico',
      industry: 'finance',
      difficulty: 'medium',
      rating: 4.0,
      location: 'New York, NY',
      employees: '270,000+',
      description: 'Global financial services company',
      interviewTypes: ['DSA', 'Finance', 'Behavioral'],
      avgSalary: '$100K - $220K',
      interviewRounds: 3,
      timeToHire: '3-6 weeks',
      tips: ['Understand banking operations', 'Prepare SQL questions', 'Show teamwork skills'],
      questionsCount: 140,
    },
  ]

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 dark:bg-green-900/30 text-green-700',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700',
      hard: 'bg-red-100 dark:bg-red-900/30 text-red-700',
    }
    return colors[difficulty] || colors.medium
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchQuery === '' || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry
    const matchesDifficulty = selectedDifficulty === 'all' || company.difficulty === selectedDifficulty
    return matchesSearch && matchesIndustry && matchesDifficulty
  })

  return (
    <div className="space-y-8">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-600 via-blue-600 to-slate-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Building2 className="w-4 h-4 mr-2" />
            Interview Prep
          </div>
          <h1 className="text-3xl font-bold mb-2">Company Preparation</h1>
          <p className="text-white/70 max-w-lg">Research companies and prepare for specific interviews</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
          >
            {industries.map(ind => (
              <option key={ind.id} value={ind.id}>{ind.label}</option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{companies.length}</p>
              <p className="text-sm text-blue-600">Companies</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">2,000+</p>
              <p className="text-sm text-green-600">Questions</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">15</p>
              <p className="text-sm text-purple-600">Industries</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">89%</p>
              <p className="text-sm text-orange-600">Success Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <Card 
            key={company.id} 
            className="hover:shadow-xl transition-all duration-300 group cursor-pointer"
            onClick={() => navigate(`/company/${company.id}`)}
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=6366f1&color=fff`
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {company.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{company.location}</span>
                      <span className="text-slate-300">•</span>
                      <Users className="w-4 h-4" />
                      <span>{company.employees}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(company.difficulty)}`}>
                    {company.difficulty.charAt(0).toUpperCase() + company.difficulty.slice(1)}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">{company.description}</p>

                {/* Interview Types */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {company.interviewTypes.map((type, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
                      {type}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{company.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{company.questionsCount} questions</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{company.interviewRounds} rounds</span>
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No companies found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default CompanyPrep
