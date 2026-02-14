import { useState, useRef, useEffect, useCallback } from 'react'
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
  MicOff,
  Loader2,
  Trash2,
  Copy,
  Check
} from 'lucide-react'

// Simple markdown renderer for bot responses
const MarkdownText = ({ text }) => {
  const renderLine = (line, i) => {
    // Bold
    let html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs font-mono">$1</code>')
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-indigo-500 underline">$1</a>')
    return html
  }

  const lines = text.split('\n')
  const elements = []
  let inCodeBlock = false
  let codeLines = []
  let listItems = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-1">{listItems.map((li, i) => <li key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: renderLine(li) }} />)}</ul>)
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(<pre key={`code-${i}`} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono"><code>{codeLines.join('\n')}</code></pre>)
        codeLines = []
        inCodeBlock = false
      } else {
        flushList()
        inCodeBlock = true
      }
      return
    }
    if (inCodeBlock) { codeLines.push(line); return }

    if (/^[•\-\*]\s/.test(line)) {
      listItems.push(line.replace(/^[•\-\*]\s/, ''))
      return
    }
    if (/^\d+\.\s/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s/, ''))
      return
    }

    flushList()

    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="font-bold text-sm mt-2 mb-1">{line.slice(4)}</h4>)
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-bold text-base mt-2 mb-1">{line.slice(3)}</h3>)
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(<p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderLine(line) }} />)
    }
  })
  flushList()
  if (inCodeBlock && codeLines.length) {
    elements.push(<pre key="code-end" className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono"><code>{codeLines.join('\n')}</code></pre>)
  }

  return <div className="space-y-0.5">{elements}</div>
}

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
  const [isListening, setIsListening] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

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

  // Speech-to-text using Web Speech API
  const toggleListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      // Fallback: no speech API
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      setInputValue(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isListening])

  const hasSpeechAPI = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

  const copyMessage = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      text: "Chat cleared. How can I help you?",
      timestamp: new Date()
    }])
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
      <div className="bg-white dark:bg-[#0d1526] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex-shrink-0">
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
                onClick={clearChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
              className="flex-1 min-h-[300px] max-h-[350px] overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0a0f1a]"
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
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-[#151d2e] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-sm'
                    }`}>
                      {message.type === 'bot' ? (
                        <MarkdownText text={message.text} />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${
                          message.type === 'user' ? 'text-indigo-200' : 'text-slate-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.type === 'bot' && message.id !== 1 && (
                          <button
                            onClick={() => copyMessage(message.text, message.id)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors ml-2"
                            title="Copy response"
                          >
                            {copiedId === message.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                          </button>
                        )}
                      </div>
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
                    <div className="bg-white dark:bg-[#151d2e] border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-[#0d1526] flex-shrink-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#151d2e] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1526] flex-shrink-0">
              <div className="flex items-center gap-2">
                {hasSpeechAPI && (
                  <button
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl transition-colors ${
                      isListening 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'
                    }`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? 'Listening...' : 'Type your question...'}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white dark:bg-[#151d2e] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
