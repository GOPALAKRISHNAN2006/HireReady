import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Minimize2,
  Maximize2,
  HelpCircle,
  BookOpen,
  Target,
  Building2,
  Mic,
  Loader2
} from 'lucide-react'

const AIChatbot = () => {
  const { isAuthenticated } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "👋 Hi! I'm your HireReady Assistant. I can help you with:\n\n• Interview preparation tips\n• How to use the platform\n• Company-specific guidance\n• Technical concepts\n\nHow can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Listen for custom event to open chatbot
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }
    window.addEventListener('openChatbot', handleOpenChatbot)
    return () => window.removeEventListener('openChatbot', handleOpenChatbot)
  }, [])

  const quickActions = [
    { icon: Target, label: 'Interview Tips', query: 'Give me some interview tips' },
    { icon: BookOpen, label: 'How to Use', query: 'How do I use this platform?' },
    { icon: Building2, label: 'Company Prep', query: 'How to prepare for FAANG interviews?' },
    { icon: HelpCircle, label: 'Get Help', query: 'I need help with something' },
  ]

  // AI Response Generation based on user query
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Interview Tips
    if (lowerMessage.includes('interview tip') || lowerMessage.includes('prepare for interview')) {
      return `Here are some key interview tips:

🎯 **Before the Interview:**
• Research the company thoroughly
• Review the job description
• Prepare your elevator pitch
• Practice common questions

💡 **During the Interview:**
• Use the STAR method for behavioral questions
• Think out loud for technical problems
• Ask clarifying questions
• Show enthusiasm and curiosity

📝 **Technical Interviews:**
• Practice DSA problems daily on our platform
• Focus on problem-solving approach
• Explain your thought process
• Consider edge cases

Would you like specific tips for a particular type of interview?`
    }

    // Platform Usage
    if (lowerMessage.includes('how to use') || lowerMessage.includes('platform') || lowerMessage.includes('how do i')) {
      return `Here's how to get the most out of our platform:

📚 **Start Interview** - Practice mock interviews with AI
• Choose your interview type (DSA, System Design, Behavioral)
• Get real-time feedback and scoring

📊 **Dashboard** - Track your progress
• View performance analytics
• See your improvement over time

🏢 **Company Prep** - Company-specific preparation
• Access company interview patterns
• Practice company-specific questions

🎯 **Career Roadmap** - Personalized learning path
• Follow structured learning milestones
• Access study materials

📝 **Communication** - Improve speaking skills
• Take communication assessments
• Get pronunciation feedback

Need help with any specific feature?`
    }

    // Company Preparation
    if (lowerMessage.includes('company') || lowerMessage.includes('faang') || lowerMessage.includes('google') || lowerMessage.includes('amazon') || lowerMessage.includes('microsoft') || lowerMessage.includes('meta') || lowerMessage.includes('apple')) {
      return `Here's how to prepare for top tech companies:

🔵 **Google:**
• Focus on problem-solving approach
• Practice medium-hard LeetCode problems
• Prepare for "Googleyness" behavioral questions

🟠 **Amazon:**
• Master the 16 Leadership Principles
• Use STAR method extensively
• Practice system design at scale

🔷 **Microsoft:**
• Strong coding fundamentals
• Growth mindset demonstration
• Collaborative problem-solving

🔵 **Meta:**
• Speed is crucial - practice timed coding
• Focus on optimal solutions
• Product sense questions

Go to **Company Prep** in the sidebar to access company-specific questions and detailed preparation guides!

Which company are you preparing for?`
    }

    // Resume Help
    if (lowerMessage.includes('resume')) {
      return `Our Resume Builder can help you create a standout resume!

📝 **Features:**
• Multiple professional templates
• ATS-friendly formatting
• AI suggestions for improvements
• Export to PDF

**Tips for a great resume:**
• Use action verbs (Developed, Implemented, Led)
• Quantify achievements with numbers
• Keep it to 1-2 pages
• Tailor for each application

Navigate to **Resume Builder** in the sidebar to get started!`
    }

    // Aptitude Tests
    if (lowerMessage.includes('aptitude') || lowerMessage.includes('logical') || lowerMessage.includes('quantitative')) {
      return `Our Aptitude Tests help you prepare for screening rounds!

📊 **Available Categories:**
• Quantitative Aptitude
• Logical Reasoning  
• Verbal Ability
• Data Interpretation

**Tips:**
• Time yourself during practice
• Learn shortcuts and tricks
• Focus on accuracy first, then speed
• Review mistakes carefully

Go to **Aptitude Tests** in the sidebar to start practicing!`
    }

    // Communication Assessment
    if (lowerMessage.includes('communication') || lowerMessage.includes('speaking') || lowerMessage.includes('pronunciation')) {
      return `Our Communication Assessment helps you improve speaking skills!

🎤 **What we assess:**
• Pronunciation clarity
• Fluency and pace
• Grammar usage
• Vocabulary range
• Confidence level

**Tips to improve:**
• Practice speaking daily
• Record and listen to yourself
• Read aloud regularly
• Join our Group Discussions

Navigate to **Communication** in the sidebar to take an assessment!`
    }

    // Group Discussion
    if (lowerMessage.includes('group discussion') || lowerMessage.includes('gd')) {
      return `Group Discussions are important for many interviews!

👥 **GD Tips:**
• Listen before speaking
• Make quality contributions
• Don't interrupt others
• Support your points with examples
• Maintain positive body language

**Our GD Practice:**
• AI-simulated group discussions
• Various topics available
• Performance feedback
• Speaking time analysis

Go to **Group Discussion** in the sidebar to practice!`
    }

    // DSA / Coding
    if (lowerMessage.includes('dsa') || lowerMessage.includes('data structure') || lowerMessage.includes('algorithm') || lowerMessage.includes('coding')) {
      return `Master DSA for technical interviews!

📚 **Key Topics:**
• Arrays & Strings
• Linked Lists
• Trees & Graphs
• Dynamic Programming
• Sorting & Searching

**Study Plan:**
1. Start with basic data structures
2. Learn common algorithms
3. Practice pattern recognition
4. Solve problems daily

**On our platform:**
• Practice coding interviews
• Get AI feedback on solutions
• Track your progress
• Daily coding challenges

Would you like resources for any specific topic?`
    }

    // Default response
    return `Thanks for your question! Here's how I can help:

🎯 **Interview Preparation** - Tips and strategies
📚 **Platform Features** - How to use different tools
🏢 **Company-Specific** - FAANG and other companies
💻 **Technical Topics** - DSA, System Design
📝 **Resume & Skills** - Building your profile

Try asking about:
• "How do I prepare for Google interviews?"
• "What interview tips do you have?"
• "How do I use the platform?"
• "Help me with DSA preparation"

What would you like to know more about?`
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: generateAIResponse(inputValue),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (query) => {
    setInputValue(query)
    setTimeout(() => handleSend(), 100)
  }

  // Don't render chatbot if not authenticated
  if (!isAuthenticated) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs animate-pulse">
          <Sparkles className="w-3 h-3" />
        </span>
        
        {/* Tooltip */}
        <span className="absolute right-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Need help? Chat with AI
        </span>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-72' : 'w-96'} transition-all duration-300`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-purple-200">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div 
              className="flex-1 min-h-[300px] max-h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50"
              style={{ overflowY: 'scroll' }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <span className={`text-xs mt-1 block ${
                        message.type === 'user' ? 'text-primary-200' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-white flex-shrink-0">
                <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full text-xs font-medium text-gray-600 transition-colors"
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white text-gray-900 placeholder:text-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AIChatbot
