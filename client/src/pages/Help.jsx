import { useState, useMemo } from 'react'
import { Card, Button } from '../components/ui'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  MessageCircle,
  Mail,
  Book,
  Video,
  ExternalLink,
  Lightbulb,
  Shield,
  CreditCard,
  Settings,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react'

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    { id: 'all', label: 'All', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: Lightbulb },
    { id: 'interviews', label: 'Interviews', icon: Target },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ]

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I start my first mock interview?',
      answer: 'To start your first mock interview, go to the Dashboard and click "Start New Interview". Select your preferred category (DSA, System Design, Behavioral, etc.), difficulty level, and duration. The AI will generate relevant questions based on your selection and provide real-time feedback on your responses.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What types of interviews can I practice?',
      answer: 'We offer various interview types including Data Structures & Algorithms (DSA), System Design, Behavioral, Web Development, Machine Learning, Database, DevOps, and Mobile Development. Each category has questions tailored to that specific domain.'
    },
    {
      id: 3,
      category: 'interviews',
      question: 'How does the AI scoring system work?',
      answer: 'Our AI analyzes your responses based on multiple factors: technical accuracy, problem-solving approach, code quality (for coding questions), communication clarity, and completeness of the answer. The score is calculated on a 0-100 scale with detailed feedback for each criterion.'
    },
    {
      id: 4,
      category: 'interviews',
      question: 'Can I retake an interview?',
      answer: 'Yes! You can practice as many times as you want. Each interview session is unique with different questions. We recommend reviewing your previous interview feedback before retaking to focus on areas of improvement.'
    },
    {
      id: 5,
      category: 'interviews',
      question: 'How do I improve my interview scores?',
      answer: 'Review the detailed feedback after each interview, focus on weak areas identified in your analytics, practice consistently, and use the hints feature to learn optimal approaches. The leaderboard and achievements can also motivate you to improve.'
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Navigate to the Profile page from the sidebar menu. You can update your name, email, phone number, and profile picture. Click "Save Changes" to update your information.'
    },
    {
      id: 7,
      category: 'account',
      question: 'How do I change my password?',
      answer: 'Go to your Profile page and scroll to the "Change Password" section. Enter your current password, then your new password twice to confirm. Click "Change Password" to update.'
    },
    {
      id: 8,
      category: 'account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from Settings > Data & Account. Please note that this action is permanent and will delete all your data including interview history, analytics, and achievements.'
    },
    {
      id: 9,
      category: 'general',
      question: 'Is HireReady completely free?',
      answer: 'Yes! HireReady is completely free to use. All features including AI interviews, analytics, career roadmaps, and community access are available at no cost.'
    },
    {
      id: 10,
      category: 'general',
      question: 'How do I get the most out of HireReady?',
      answer: 'Practice regularly with mock interviews, complete daily challenges, use the career roadmap to track your progress, and engage with the community. Consistency is key!'
    },
    {
      id: 11,
      category: 'privacy',
      question: 'Is my data secure?',
      answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal information with third parties without your consent.'
    },
    {
      id: 12,
      category: 'privacy',
      question: 'Can others see my interview history?',
      answer: 'By default, your interview history is private. You can control visibility settings in Settings > Privacy. You can choose to appear on the leaderboard anonymously or hide your profile entirely.'
    },
  ]

  const resources = [
    {
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      icon: Book,
      link: '#',
      gradient: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      link: '#',
      gradient: 'from-red-500 to-pink-500',
      bgLight: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: Users,
      link: '#',
      gradient: 'from-green-500 to-emerald-500',
      bgLight: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: Mail,
      link: '#',
      gradient: 'from-purple-500 to-violet-500',
      bgLight: 'bg-purple-50 dark:bg-purple-900/20'
    },
  ]

  const popularTopics = [
    { emoji: '🎯', label: 'Start first interview', faqId: 1 },
    { emoji: '📊', label: 'AI scoring explained', faqId: 3 },
    { emoji: '🔒', label: 'Privacy settings', faqId: 12 },
    { emoji: '⭐', label: 'Getting started tips', faqId: 10 },
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <HelpCircle className="absolute top-6 right-8 w-24 h-24 text-white/5" />
        
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white/90 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Help Center
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">How can we help you?</h1>
          <p className="text-white/70 text-lg max-w-md mx-auto">Find answers to common questions or contact our support team</p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-xl text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 text-center">Popular topics</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {popularTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => {
                setExpandedFaq(topic.faqId)
                setActiveCategory('all')
                setSearchQuery('')
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
            >
              <span>{topic.emoji}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links / Resources */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            className="group p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${resource.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <resource.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{resource.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
          </a>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filteredFaqs.length} questions found</p>
          </div>
        </div>
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No matching questions found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term or category</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 ${
                  expandedFaq === faq.id
                    ? 'border-primary-200 dark:border-primary-700 shadow-md shadow-primary-500/5'
                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      expandedFaq === faq.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    expandedFaq === faq.id ? 'bg-primary-100 dark:bg-primary-900/30 rotate-180' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <ChevronDown className={`w-4 h-4 ${expandedFaq === faq.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
                  </div>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-5 pb-5 ml-11">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 md:p-12 border border-indigo-100 dark:border-indigo-800/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/10 to-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Our support team typically responds within 2 hours during business days</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onClick={() => {
                const event = new CustomEvent('openChatbot')
                window.dispatchEvent(event)
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-xl hover:from-primary-700 hover:to-purple-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </button>
            <a
              href="mailto:support@hireready.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:scale-105 hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 pb-4">
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">&lt; 2h</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg. Response Time</div>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Satisfaction Rate</div>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Chat Support</div>
        </div>
      </div>
    </div>
  )
}

export default Help
