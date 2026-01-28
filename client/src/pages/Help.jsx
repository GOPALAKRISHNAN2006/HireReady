import { useState } from 'react'
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
  Target
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
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. All payments are securely processed through Stripe.'
    },
    {
      id: 10,
      category: 'billing',
      question: 'How do I upgrade to a premium plan?',
      answer: 'You can upgrade from your Dashboard or Settings page. Click on "Upgrade" and select your preferred plan. Premium features include unlimited interviews, detailed analytics, priority support, and exclusive content.'
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
      color: 'bg-blue-500'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      link: '#',
      color: 'bg-red-500'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: Users,
      link: '#',
      color: 'bg-green-500'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: Mail,
      link: '#',
      color: 'bg-purple-500'
    },
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How can we help you?</h1>
        <p className="text-gray-500">Find answers to common questions or contact our support team</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-white text-gray-900 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm text-lg placeholder:text-gray-400"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            className="group p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 ${resource.color} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <resource.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
            <p className="text-sm text-gray-500">{resource.description}</p>
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
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <Card.Header>
          <Card.Title>Frequently Asked Questions</Card.Title>
          <Card.Description>Click on a question to see the answer</Card.Description>
        </Card.Header>
        <Card.Content padding="none">
          <div className="divide-y divide-gray-100">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No matching questions found</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 text-gray-600 bg-gray-50">
                      <p className="leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-8">Our support team is here to assist you</p>
          <div className="flex justify-center">
            <button 
              onClick={() => {
                // Trigger chatbot open - the chatbot component handles this via its own state
                const event = new CustomEvent('openChatbot')
                window.dispatchEvent(event)
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help
