import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
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

const AIChatbot = ({ externalOpen, onExternalClose }) => {
  const { isAuthenticated } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Open from sidebar
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }, [externalOpen])

  const handleClose = () => {
    setIsOpen(false)
    onExternalClose?.()
  }
  
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

  // AI Response via real API
  const generateAIResponse = async (userMessage) => {
    try {
      const response = await api.post('/ai/chat', {
        message: userMessage,
        conversationHistory: messages.slice(-10).map(m => ({
          type: m.type === 'bot' ? 'assistant' : 'user',
          text: m.text
        }))
      })
      return response.data?.data?.response || response.data?.response || 
        "I'm here to help with interview preparation! Try asking about interview tips, DSA, company prep, or platform features."
    } catch (error) {
      console.error('AI Chat Error:', error)
      // Fallback to basic local response on error
      return getFallbackResponse(userMessage)
    }
  }

  // Local fallback if API fails
  const getFallbackResponse = (msg) => {
    const lower = msg.toLowerCase()
    if (lower.includes('interview') || lower.includes('tip')) return 'Practice mock interviews regularly, use the STAR method for behavioral questions, and study DSA patterns. Check out our Interview Tips section!'
    if (lower.includes('dsa') || lower.includes('coding')) return 'Focus on arrays, trees, graphs, and dynamic programming. Try our Daily Challenges to build consistency!'
    if (lower.includes('resume')) return 'Use our Resume Builder to create an ATS-friendly resume. Quantify your achievements and use action verbs!'
    if (lower.includes('company') || lower.includes('faang')) return 'Visit Company Prep in the sidebar for detailed preparation guides for top tech companies!'
    return "I can help with interview prep, DSA concepts, company preparation, resume building, and more. What would you like to know?"
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
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(currentInput)
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } catch {
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
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
    return null
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-72' : 'w-96'} transition-all duration-300`}>
      <div className="bg-white dark:bg-[#0d1526] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[600px]">
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
                onClick={handleClose}
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
              className="flex-1 min-h-[300px] max-h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0a0f1a]"
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
                        : 'bg-white dark:bg-[#151d2e] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-tl-sm shadow-sm'
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
                    <div className="bg-white dark:bg-[#151d2e] border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
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
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#0d1526] flex-shrink-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#151d2e] hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1526] flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-[#151d2e] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
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
