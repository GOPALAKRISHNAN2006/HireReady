import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Badge } from '../components/ui'
import { 
  Building2, 
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Clock,
  Target,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Trophy,
  Briefcase,
  DollarSign,
  CheckCircle,
  Play,
  FileText,
  Video,
  Lightbulb,
  TrendingUp,
  Code2,
  MessageSquare,
  Layers
} from 'lucide-react'

const CompanyDetail = () => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // Company data (would come from API in production)
  const companies = {
    google: {
      id: 'google',
      name: 'Google',
      logo: 'https://www.google.com/favicon.ico',
      industry: 'Technology',
      difficulty: 'hard',
      rating: 4.5,
      location: 'Mountain View, CA',
      employees: '150,000+',
      website: 'https://careers.google.com',
      description: 'Google is a multinational technology company specializing in Internet-related services and products, including online advertising technologies, search engine, cloud computing, software, and hardware.',
      culture: 'Innovation-focused, flat hierarchy, emphasis on data-driven decisions',
      avgSalary: '$180K - $350K',
      interviewRounds: 5,
      timeToHire: '4-6 weeks',
      successRate: 85,
      interviewTypes: ['DSA', 'System Design', 'Behavioral'],
      hiringProcess: [
        { step: 1, name: 'Resume Screening', duration: '1-2 weeks' },
        { step: 2, name: 'Phone Screen', duration: '45 minutes' },
        { step: 3, name: 'Technical Phone Interview', duration: '45 minutes' },
        { step: 4, name: 'Onsite Interviews (4-5 rounds)', duration: '4-5 hours' },
        { step: 5, name: 'Hiring Committee Review', duration: '1-2 weeks' },
      ],
      topQuestions: [
        { id: 1, title: 'Design a URL Shortener', type: 'System Design', difficulty: 'Medium' },
        { id: 2, title: 'LRU Cache Implementation', type: 'DSA', difficulty: 'Medium' },
        { id: 3, title: 'Tell me about a time you failed', type: 'Behavioral', difficulty: 'Easy' },
        { id: 4, title: 'Design Google Search', type: 'System Design', difficulty: 'Hard' },
        { id: 5, title: 'Find Median in Data Stream', type: 'DSA', difficulty: 'Hard' },
      ],
      studyMaterials: [
        { title: 'Cracking the Coding Interview', type: 'Book', icon: BookOpen },
        { title: 'System Design Interview by Alex Xu', type: 'Book', icon: BookOpen },
        { title: 'Google Interview Prep Playlist', type: 'Video', icon: Video },
        { title: 'LeetCode Google Tagged Problems', type: 'Practice', icon: Code2 },
      ],
      tips: [
        'Focus on problem-solving approach over getting the optimal solution immediately',
        'Practice thinking out loud and explaining your thought process',
        'Prepare for "Googleyness" - cultural fit and teamwork questions',
        'Be ready to discuss trade-offs in system design',
        'Show genuine curiosity and ask thoughtful questions',
      ],
    },
    amazon: {
      id: 'amazon',
      name: 'Amazon',
      logo: 'https://www.amazon.com/favicon.ico',
      industry: 'Technology & E-commerce',
      difficulty: 'hard',
      rating: 4.3,
      location: 'Seattle, WA',
      employees: '1.5M+',
      website: 'https://amazon.jobs',
      description: 'Amazon is a multinational technology company focusing on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence.',
      culture: 'Customer obsession, ownership mentality, bias for action',
      avgSalary: '$160K - $320K',
      interviewRounds: 5,
      timeToHire: '3-5 weeks',
      successRate: 82,
      interviewTypes: ['DSA', 'System Design', 'Leadership Principles'],
      hiringProcess: [
        { step: 1, name: 'Online Assessment', duration: '2 hours' },
        { step: 2, name: 'Phone Interview', duration: '45-60 minutes' },
        { step: 3, name: 'Virtual Onsite (4-5 loops)', duration: '4-5 hours' },
        { step: 4, name: 'Bar Raiser Interview', duration: '1 hour' },
        { step: 5, name: 'Offer Decision', duration: '1 week' },
      ],
      topQuestions: [
        { id: 1, title: 'Design Amazon Product Page', type: 'System Design', difficulty: 'Medium' },
        { id: 2, title: 'Two Sum / Three Sum', type: 'DSA', difficulty: 'Easy' },
        { id: 3, title: 'Tell me about Customer Obsession', type: 'Leadership Principles', difficulty: 'Medium' },
        { id: 4, title: 'Design Distributed Cache', type: 'System Design', difficulty: 'Hard' },
        { id: 5, title: 'Word Ladder Problem', type: 'DSA', difficulty: 'Medium' },
      ],
      studyMaterials: [
        { title: 'Amazon Leadership Principles Guide', type: 'Article', icon: FileText },
        { title: 'STAR Method for Behavioral', type: 'Guide', icon: Lightbulb },
        { title: 'AWS Solutions Architect Prep', type: 'Course', icon: Video },
        { title: 'LeetCode Amazon Tagged', type: 'Practice', icon: Code2 },
      ],
      tips: [
        'Master all 16 Leadership Principles with specific examples',
        'Use the STAR method extensively for behavioral questions',
        'Prepare stories demonstrating ownership and customer focus',
        'Practice system design focusing on scalability',
        'Be prepared for the Bar Raiser - highest standard interview',
      ],
    },
    microsoft: {
      id: 'microsoft',
      name: 'Microsoft',
      logo: 'https://www.microsoft.com/favicon.ico',
      industry: 'Technology',
      difficulty: 'hard',
      rating: 4.4,
      location: 'Redmond, WA',
      employees: '220,000+',
      website: 'https://careers.microsoft.com',
      description: 'Microsoft is a technology corporation that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, and related services.',
      culture: 'Growth mindset, learn-it-all culture, diversity and inclusion',
      avgSalary: '$150K - $300K',
      interviewRounds: 4,
      timeToHire: '3-4 weeks',
      successRate: 80,
      interviewTypes: ['DSA', 'System Design', 'Behavioral'],
      hiringProcess: [
        { step: 1, name: 'Resume Screen', duration: '1 week' },
        { step: 2, name: 'Phone Screen', duration: '30-45 minutes' },
        { step: 3, name: 'Virtual Interview (3-4 rounds)', duration: '3-4 hours' },
        { step: 4, name: 'As Appropriate Interview', duration: '1 hour' },
      ],
      topQuestions: [
        { id: 1, title: 'Design a File Sync System', type: 'System Design', difficulty: 'Medium' },
        { id: 2, title: 'Binary Tree Problems', type: 'DSA', difficulty: 'Medium' },
        { id: 3, title: 'Describe your growth mindset', type: 'Behavioral', difficulty: 'Easy' },
        { id: 4, title: 'Design Microsoft Teams', type: 'System Design', difficulty: 'Hard' },
      ],
      studyMaterials: [
        { title: 'Microsoft Interview Guide', type: 'Article', icon: FileText },
        { title: 'Azure Fundamentals', type: 'Course', icon: Video },
        { title: 'LeetCode Microsoft Tagged', type: 'Practice', icon: Code2 },
      ],
      tips: [
        'Demonstrate a growth mindset throughout the interview',
        'Show collaborative problem-solving skills',
        'Be familiar with Microsoft products and services',
        'Focus on fundamentals over complex algorithms',
        'Prepare questions about team culture and projects',
      ],
    },
    meta: {
      id: 'meta',
      name: 'Meta',
      logo: 'https://www.facebook.com/favicon.ico',
      industry: 'Technology & Social Media',
      difficulty: 'hard',
      rating: 4.2,
      location: 'Menlo Park, CA',
      employees: '80,000+',
      website: 'https://metacareers.com',
      description: 'Meta is a technology conglomerate that owns Facebook, Instagram, WhatsApp, and is investing heavily in the metaverse and VR technologies.',
      culture: 'Move fast, be bold, focus on impact',
      avgSalary: '$170K - $340K',
      interviewRounds: 4,
      timeToHire: '4-6 weeks',
      successRate: 78,
      interviewTypes: ['DSA', 'System Design', 'Behavioral'],
      hiringProcess: [
        { step: 1, name: 'Initial Screen', duration: '1 week' },
        { step: 2, name: 'Technical Phone Screen', duration: '45 minutes' },
        { step: 3, name: 'Virtual Onsite (4 rounds)', duration: '4 hours' },
        { step: 4, name: 'Hiring Manager Interview', duration: '30 minutes' },
      ],
      topQuestions: [
        { id: 1, title: 'Design Facebook News Feed', type: 'System Design', difficulty: 'Hard' },
        { id: 2, title: 'Valid Parentheses', type: 'DSA', difficulty: 'Easy' },
        { id: 3, title: 'Product Sense Questions', type: 'Behavioral', difficulty: 'Medium' },
        { id: 4, title: 'Design Instagram Stories', type: 'System Design', difficulty: 'Medium' },
      ],
      studyMaterials: [
        { title: 'Meta Interview Prep Guide', type: 'Article', icon: FileText },
        { title: 'React Documentation', type: 'Guide', icon: BookOpen },
        { title: 'LeetCode Meta Tagged', type: 'Practice', icon: Code2 },
      ],
      tips: [
        'Speed is crucial - practice timed coding problems',
        'Focus on optimal solutions from the start',
        'Prepare for product sense questions',
        'Know Meta products well (FB, IG, WhatsApp)',
        'Show how you can make an impact quickly',
      ],
    },
    apple: {
      id: 'apple',
      name: 'Apple',
      logo: 'https://www.apple.com/favicon.ico',
      industry: 'Technology & Consumer Electronics',
      difficulty: 'hard',
      rating: 4.6,
      location: 'Cupertino, CA',
      employees: '160,000+',
      website: 'https://www.apple.com/careers',
      description: 'Apple designs, develops, and sells consumer electronics, computer software, and online services known for innovation and premium quality.',
      culture: 'Attention to detail, secrecy, perfection over speed',
      avgSalary: '$165K - $330K',
      interviewRounds: 5,
      timeToHire: '4-8 weeks',
      successRate: 75,
      interviewTypes: ['DSA', 'System Design', 'Domain Expertise'],
      hiringProcess: [
        { step: 1, name: 'Resume Review', duration: '2 weeks' },
        { step: 2, name: 'Phone Interview', duration: '30 minutes' },
        { step: 3, name: 'Technical Phone Interview', duration: '1 hour' },
        { step: 4, name: 'Onsite (5-6 interviews)', duration: '5-6 hours' },
        { step: 5, name: 'Final Decision', duration: '1-2 weeks' },
      ],
      topQuestions: [
        { id: 1, title: 'Design iCloud Sync', type: 'System Design', difficulty: 'Hard' },
        { id: 2, title: 'iOS Memory Management', type: 'Domain', difficulty: 'Medium' },
        { id: 3, title: 'Why Apple?', type: 'Behavioral', difficulty: 'Easy' },
        { id: 4, title: 'Linked List Cycle Detection', type: 'DSA', difficulty: 'Easy' },
      ],
      studyMaterials: [
        { title: 'Apple Human Interface Guidelines', type: 'Guide', icon: BookOpen },
        { title: 'Swift Programming', type: 'Course', icon: Video },
        { title: 'iOS Development Fundamentals', type: 'Course', icon: Code2 },
      ],
      tips: [
        'Know your domain extremely well',
        'Demonstrate attention to detail in solutions',
        'Show passion for Apple products',
        'Be prepared for longer interview process',
        'Focus on user experience in system design',
      ],
    },
    netflix: {
      id: 'netflix',
      name: 'Netflix',
      logo: 'https://www.netflix.com/favicon.ico',
      industry: 'Technology & Entertainment',
      difficulty: 'hard',
      rating: 4.4,
      location: 'Los Gatos, CA',
      employees: '12,000+',
      website: 'https://jobs.netflix.com',
      description: 'Netflix is a streaming entertainment service offering a wide variety of TV shows, movies, and documentaries.',
      culture: 'Freedom and responsibility, high performance, candor',
      avgSalary: '$200K - $400K',
      interviewRounds: 4,
      timeToHire: '3-5 weeks',
      successRate: 70,
      interviewTypes: ['DSA', 'System Design', 'Culture Fit'],
      hiringProcess: [
        { step: 1, name: 'Recruiter Screen', duration: '30 minutes' },
        { step: 2, name: 'Technical Phone Screen', duration: '1 hour' },
        { step: 3, name: 'Onsite (4-5 interviews)', duration: '4-5 hours' },
        { step: 4, name: 'Offer', duration: '1 week' },
      ],
      topQuestions: [
        { id: 1, title: 'Design Netflix Recommendation', type: 'System Design', difficulty: 'Hard' },
        { id: 2, title: 'Video Streaming Architecture', type: 'System Design', difficulty: 'Hard' },
        { id: 3, title: 'Describe a difficult decision', type: 'Behavioral', difficulty: 'Medium' },
      ],
      studyMaterials: [
        { title: 'Netflix Culture Deck', type: 'Article', icon: FileText },
        { title: 'Netflix Tech Blog', type: 'Blog', icon: BookOpen },
        { title: 'Streaming Architecture', type: 'Guide', icon: Layers },
      ],
      tips: [
        'Read and understand the Netflix Culture Deck thoroughly',
        'Prepare for high-bar discussions on impact',
        'Show independence and self-direction',
        'Be extremely candid in responses',
        'Demonstrate strong opinions loosely held',
      ],
    },
    goldman: {
      id: 'goldman',
      name: 'Goldman Sachs',
      logo: 'https://www.goldmansachs.com/favicon.ico',
      industry: 'Finance',
      difficulty: 'medium',
      rating: 4.1,
      location: 'New York, NY',
      employees: '45,000+',
      website: 'https://www.goldmansachs.com/careers',
      description: 'Goldman Sachs is a leading global investment banking, securities and investment management firm.',
      culture: 'Excellence, client focus, teamwork, integrity',
      avgSalary: '$120K - $250K',
      interviewRounds: 4,
      timeToHire: '4-8 weeks',
      successRate: 75,
      interviewTypes: ['DSA', 'Finance Knowledge', 'Behavioral'],
      hiringProcess: [
        { step: 1, name: 'HireVue Assessment', duration: '30 minutes' },
        { step: 2, name: 'Phone Interview', duration: '30-45 minutes' },
        { step: 3, name: 'Super Day (4-5 interviews)', duration: '4-5 hours' },
        { step: 4, name: 'Offer Decision', duration: '1-2 weeks' },
      ],
      topQuestions: [
        { id: 1, title: 'Design Trading System', type: 'System Design', difficulty: 'Hard' },
        { id: 2, title: 'SQL Queries for Finance', type: 'Technical', difficulty: 'Medium' },
        { id: 3, title: 'Market Risk Scenarios', type: 'Domain', difficulty: 'Medium' },
      ],
      studyMaterials: [
        { title: 'Investment Banking Prep', type: 'Course', icon: Video },
        { title: 'SQL for Finance', type: 'Guide', icon: Code2 },
        { title: 'Financial Markets Overview', type: 'Article', icon: BookOpen },
      ],
      tips: [
        'Understand financial markets and products',
        'Prepare for brain teasers and math problems',
        'Show strong analytical thinking',
        'Demonstrate teamwork experience',
        'Know why you want to work in finance',
      ],
    },
    jpmorgan: {
      id: 'jpmorgan',
      name: 'JP Morgan',
      logo: 'https://www.jpmorganchase.com/favicon.ico',
      industry: 'Finance',
      difficulty: 'medium',
      rating: 4.0,
      location: 'New York, NY',
      employees: '270,000+',
      website: 'https://careers.jpmorgan.com',
      description: 'JPMorgan Chase is one of the oldest financial institutions in the United States, offering investment banking, asset management, and more.',
      culture: 'Client-first, integrity, excellence',
      avgSalary: '$100K - $220K',
      interviewRounds: 3,
      timeToHire: '3-6 weeks',
      successRate: 78,
      interviewTypes: ['DSA', 'Finance', 'Behavioral'],
      hiringProcess: [
        { step: 1, name: 'Online Assessment', duration: '1 hour' },
        { step: 2, name: 'Phone Interview', duration: '30 minutes' },
        { step: 3, name: 'Final Round', duration: '2-3 hours' },
      ],
      topQuestions: [
        { id: 1, title: 'Design Payment System', type: 'System Design', difficulty: 'Medium' },
        { id: 2, title: 'Array/String Manipulation', type: 'DSA', difficulty: 'Easy' },
        { id: 3, title: 'Tell me about yourself', type: 'Behavioral', difficulty: 'Easy' },
      ],
      studyMaterials: [
        { title: 'Banking Fundamentals', type: 'Course', icon: Video },
        { title: 'Java for Finance', type: 'Guide', icon: Code2 },
        { title: 'JPMC Tech Talk Series', type: 'Video', icon: Video },
      ],
      tips: [
        'Understand banking operations and products',
        'Strong SQL knowledge is important',
        'Show teamwork and collaboration skills',
        'Be familiar with regulatory requirements',
        'Demonstrate problem-solving with data',
      ],
    },
  }

  const company = companies[companyId]

  if (!company) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Company Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The company you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/company-prep')}>Back to Companies</Button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'process', label: 'Interview Process', icon: Layers },
    { id: 'questions', label: 'Top Questions', icon: MessageSquare },
    { id: 'resources', label: 'Study Resources', icon: BookOpen },
    { id: 'tips', label: 'Tips & Tricks', icon: Lightbulb },
  ]

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'bg-green-100 dark:bg-green-900/30 text-green-700',
      Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700',
      Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700',
    }
    return colors[difficulty] || colors.Medium
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/company-prep')}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Companies</span>
      </button>

      {/* Company Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-start gap-6">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <img 
              src={company.logo} 
              alt={company.name}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=6366f1&color=fff&size=96`
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium bg-white/20`}>
                {company.difficulty.charAt(0).toUpperCase() + company.difficulty.slice(1)}
              </span>
            </div>
            <p className="text-blue-100 mb-4 max-w-2xl">{company.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {company.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {company.employees}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                {company.rating} rating
              </span>
              <a 
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Careers Page
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <DollarSign className="w-8 h-8 mx-auto text-green-500 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Avg Salary</p>
          <p className="font-bold text-slate-900 dark:text-white">{company.avgSalary}</p>
        </Card>
        <Card className="text-center">
          <Layers className="w-8 h-8 mx-auto text-blue-500 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Interview Rounds</p>
          <p className="font-bold text-slate-900 dark:text-white">{company.interviewRounds} Rounds</p>
        </Card>
        <Card className="text-center">
          <Clock className="w-8 h-8 mx-auto text-purple-500 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Time to Hire</p>
          <p className="font-bold text-slate-900 dark:text-white">{company.timeToHire}</p>
        </Card>
        <Card className="text-center">
          <Trophy className="w-8 h-8 mx-auto text-amber-500 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Success Rate</p>
          <p className="font-bold text-slate-900 dark:text-white">{company.successRate}%</p>
        </Card>
        <Card className="text-center">
          <Target className="w-8 h-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Interview Types</p>
          <p className="font-bold text-slate-900 dark:text-white">{company.interviewTypes.length} Types</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Company Culture</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-slate-600 dark:text-slate-400">{company.culture}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {company.interviewTypes.map((type, index) => (
                    <Badge key={index} variant="primary">{type}</Badge>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Why Prepare with Us?</Card.Title>
              </Card.Header>
              <Card.Content>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">Company-specific interview questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">Real interview experiences from candidates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">AI-powered mock interviews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">Detailed performance analytics</span>
                  </li>
                </ul>
              </Card.Content>
            </Card>

            <Card className="md:col-span-2">
              <Card.Header>
                <Card.Title>Start Practicing</Card.Title>
                <Card.Description>Choose your interview type to begin preparation</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid sm:grid-cols-3 gap-4">
                  {company.interviewTypes.map((type, index) => (
                    <button
                      key={index}
                      onClick={() => navigate('/interview/setup')}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all group text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600">{type}</span>
                        <Play className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Practice {type} interviews</p>
                    </button>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Interview Process Tab */}
        {activeTab === 'process' && (
          <Card>
            <Card.Header>
              <Card.Title>Interview Process at {company.name}</Card.Title>
              <Card.Description>What to expect during the interview journey</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                {company.hiringProcess.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      {index < company.hiringProcess.length - 1 && (
                        <div className="w-0.5 h-full bg-indigo-200 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{step.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4" />
                        {step.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Top Questions Tab */}
        {activeTab === 'questions' && (
          <Card>
            <Card.Header>
              <Card.Title>Frequently Asked Questions</Card.Title>
              <Card.Description>Most common questions asked at {company.name}</Card.Description>
            </Card.Header>
            <Card.Content padding="none">
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {company.topQuestions.map((question) => (
                  <div 
                    key={question.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/interview/setup')}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">{question.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{question.type}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </Card.Content>
            <Card.Footer>
              <Button onClick={() => navigate('/interview/setup')} className="w-full">
                Practice All Questions
              </Button>
            </Card.Footer>
          </Card>
        )}

        {/* Study Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid md:grid-cols-2 gap-6">
            {company.studyMaterials.map((material, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <material.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{material.type}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <Card>
            <Card.Header>
              <Card.Title>Interview Tips for {company.name}</Card.Title>
              <Card.Description>Insider tips to ace your interview</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {company.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700 dark:text-slate-300">{tip}</p>
                  </div>
                ))}
              </div>
            </Card.Content>
            <Card.Footer className="flex justify-center">
              <Button onClick={() => navigate('/interview/setup')} icon={Play}>
                Start Mock Interview
              </Button>
            </Card.Footer>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CompanyDetail
