import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  BookOpen,
  Target,
  Building2,
  Mic,
  MicOff,
  Loader2,
  Trash2,
  Copy,
  Check,
  Code2,
  FileText,
  Brain,
  Briefcase,
  GraduationCap,
  Zap,
  Download,
  Star,
  Clock,
  MessageSquare,
  ChevronDown,
  Plus
} from 'lucide-react'

// Markdown renderer
const MarkdownText = ({ text }) => {
  const renderLine = (line) => {
    let html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-primary-600 dark:text-primary-400">$1</code>')
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-primary-500 underline hover:text-primary-600">$1</a>')
    return html
  }

  const lines = text.split('\n')
  const elements = []
  let inCodeBlock = false
  let codeLines = []
  let codeLang = ''
  let listItems = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-2">
          {listItems.map((li, i) => (
            <li key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderLine(li) }} />
          ))}
        </ul>
      )
      listItems = []
    }
  }

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {codeLang && (
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono border-b border-gray-200 dark:border-gray-700">
                {codeLang}
              </div>
            )}
            <pre className="bg-gray-50 dark:bg-[#0d1526] p-4 overflow-x-auto text-sm font-mono leading-relaxed">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        )
        codeLines = []
        codeLang = ''
        inCodeBlock = false
      } else {
        flushList()
        codeLang = line.slice(3).trim()
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
      elements.push(<h4 key={i} className="font-bold text-base mt-3 mb-1 text-gray-900 dark:text-white">{line.slice(4)}</h4>)
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-bold text-lg mt-3 mb-1 text-gray-900 dark:text-white">{line.slice(3)}</h3>)
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(<p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderLine(line) }} />)
    }
  })
  flushList()
  if (inCodeBlock && codeLines.length) {
    elements.push(
      <pre key="code-end" className="bg-gray-50 dark:bg-[#0d1526] rounded-xl p-4 my-3 overflow-x-auto text-sm font-mono border border-gray-200 dark:border-gray-700">
        <code>{codeLines.join('\n')}</code>
      </pre>
    )
  }

  return <div className="space-y-1">{elements}</div>
}

// Conversation presets
const CONVERSATION_MODES = [
  { id: 'general', label: 'General', icon: MessageSquare, color: 'from-blue-500 to-cyan-500', prompt: '' },
  { id: 'interview', label: 'Mock Interview', icon: Target, color: 'from-purple-500 to-pink-500', prompt: 'You are an interviewer. Ask me technical interview questions one by one, wait for my answer, evaluate it, and then ask the next question. Start with a brief introduction.' },
  { id: 'dsa', label: 'DSA Helper', icon: Code2, color: 'from-green-500 to-emerald-500', prompt: 'You are a DSA expert. Help me solve coding problems step by step. Explain time/space complexity. Give hints before full solutions.' },
  { id: 'resume', label: 'Resume Review', icon: FileText, color: 'from-orange-500 to-amber-500', prompt: 'You are a resume expert. Help me improve my resume for tech roles. Ask me about my experience and give specific actionable feedback.' },
  { id: 'behavioral', label: 'Behavioral Prep', icon: Brain, color: 'from-rose-500 to-red-500', prompt: 'You are a behavioral interview coach. Help me prepare STAR method answers. Ask me behavioral questions and coach me on my responses.' },
  { id: 'system', label: 'System Design', icon: Building2, color: 'from-indigo-500 to-violet-500', prompt: 'You are a system design expert. Help me practice system design interviews. Ask me to design systems and guide me through the process.' },
]

const QUICK_PROMPTS = [
  { label: 'Explain Big O notation', icon: Zap },
  { label: 'Common React interview questions', icon: Code2 },
  { label: 'How to answer "Tell me about yourself"', icon: User },
  { label: 'Top 10 DSA patterns for interviews', icon: Brain },
  { label: 'System design: URL shortener', icon: Building2 },
  { label: 'How to negotiate salary', icon: Briefcase },
  { label: 'Tips for coding under pressure', icon: Target },
  { label: 'Explain REST vs GraphQL', icon: GraduationCap },
]

const AIChatPage = () => {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [activeConvIndex, setActiveConvIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [selectedMode, setSelectedMode] = useState('general')
  const [showModeSelector, setShowModeSelector] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  // Initialize first conversation
  useEffect(() => {
    if (conversations.length === 0) {
      setConversations([createNewConversation()])
    }
  }, [])

  const createNewConversation = (mode = 'general') => ({
    id: Date.now(),
    mode,
    title: 'New Chat',
    messages: [{
      id: 1,
      type: 'bot',
      text: `👋 Hi ${user?.firstName || 'there'}! I'm your **HireReady AI Assistant**.\n\nI can help you with:\n- 🎯 Mock interview practice\n- 💻 DSA problem solving\n- 📝 Resume review & improvement\n- 🧠 Behavioral interview prep\n- 🏗️ System design practice\n- 💡 Career guidance\n\nChoose a mode above or just ask me anything!`,
      timestamp: new Date()
    }],
    createdAt: new Date()
  })

  const activeConv = conversations[activeConvIndex] || conversations[0]
  const messages = activeConv?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [activeConvIndex])

  // AI Response
  const generateAIResponse = async (userMessage) => {
    const modeConfig = CONVERSATION_MODES.find(m => m.id === selectedMode)
    const systemPrompt = modeConfig?.prompt || ''
    
    try {
      const conversationHistory = messages.slice(-12).map(m => ({
        type: m.type === 'bot' ? 'assistant' : 'user',
        text: m.text
      }))
      
      if (systemPrompt) {
        conversationHistory.unshift({ type: 'assistant', text: systemPrompt })
      }
      
      const response = await api.post('/ai/chat', {
        message: userMessage,
        conversationHistory
      })
      return response.data?.data?.response || response.data?.response || "I'm here to help! Try asking about interview tips, DSA, or career guidance."
    } catch (error) {
      console.error('AI Chat Error:', error)
      return getFallbackResponse(userMessage)
    }
  }

  const getFallbackResponse = (msg) => {
    const lower = msg.toLowerCase()
    if (lower.includes('interview') || lower.includes('tip')) return '**Interview Tips:**\n\n1. Practice the STAR method for behavioral questions\n2. Study common DSA patterns (sliding window, two pointers, BFS/DFS)\n3. Mock interview regularly\n4. Research the company beforehand\n5. Prepare thoughtful questions for the interviewer'
    if (lower.includes('dsa') || lower.includes('coding')) return '**Key DSA Topics:**\n\n- Arrays & Strings\n- Linked Lists\n- Trees & Graphs\n- Dynamic Programming\n- Sorting & Searching\n\nTip: Focus on patterns, not memorizing solutions!'
    if (lower.includes('resume')) return '**Resume Tips:**\n\n1. Use strong action verbs\n2. Quantify achievements with numbers\n3. Tailor for each application\n4. Keep it to 1-2 pages\n5. Use our Resume Builder for ATS-friendly formatting!'
    return "I can help with interview prep, DSA concepts, company preparation, resume building, and more. What would you like to know?"
  }

  const handleSend = async (overrideText) => {
    const text = overrideText || inputValue.trim()
    if (!text) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text,
      timestamp: new Date()
    }

    setConversations(prev => {
      const updated = [...prev]
      const conv = { ...updated[activeConvIndex] }
      conv.messages = [...conv.messages, userMessage]
      // Update title with first user message
      if (conv.messages.filter(m => m.type === 'user').length === 1) {
        conv.title = text.slice(0, 40) + (text.length > 40 ? '...' : '')
      }
      updated[activeConvIndex] = conv
      return updated
    })
    setInputValue('')
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(text)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      }
      setConversations(prev => {
        const updated = [...prev]
        const conv = { ...updated[activeConvIndex] }
        conv.messages = [...conv.messages, botMessage]
        updated[activeConvIndex] = conv
        return updated
      })
    } catch {
      const errMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: "Sorry, I'm having trouble right now. Please try again.",
        timestamp: new Date()
      }
      setConversations(prev => {
        const updated = [...prev]
        const conv = { ...updated[activeConvIndex] }
        conv.messages = [...conv.messages, errMsg]
        updated[activeConvIndex] = conv
        return updated
      })
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

  const startNewChat = () => {
    const newConv = createNewConversation(selectedMode)
    setConversations(prev => [...prev, newConv])
    setActiveConvIndex(conversations.length)
  }

  const deleteConversation = (index) => {
    if (conversations.length <= 1) {
      setConversations([createNewConversation()])
      setActiveConvIndex(0)
      return
    }
    setConversations(prev => prev.filter((_, i) => i !== index))
    if (activeConvIndex >= index && activeConvIndex > 0) {
      setActiveConvIndex(prev => prev - 1)
    }
  }

  // Speech-to-text
  const toggleListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

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
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('')
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

  const exportChat = () => {
    const text = messages.map(m => `[${m.type === 'bot' ? 'AI' : 'You'}] ${m.text}`).join('\n\n---\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hireready-chat-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Chat exported!')
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] -mt-2 gap-4">
      {/* Sidebar - Conversation History */}
      <div className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/25"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations.map((conv, idx) => (
            <button
              key={conv.id}
              onClick={() => setActiveConvIndex(idx)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all group ${
                idx === activeConvIndex
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate flex-1">{conv.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteConversation(idx) }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
            <span>{messages.length} messages</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 px-6 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Assistant</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-purple-200">
                    {CONVERSATION_MODES.find(m => m.id === selectedMode)?.label || 'General'} Mode
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Export chat"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={startNewChat}
                className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="New chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CONVERSATION_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => { setSelectedMode(mode.id); setShowModeSelector(false) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedMode === mode.id
                    ? `bg-gradient-to-r ${mode.color} text-white shadow-md`
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                }`}>
                  {message.type === 'user' ? (
                    <span className="text-sm font-bold">{user?.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className={`rounded-2xl px-5 py-4 ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-md'
                    : 'bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 rounded-tl-md'
                }`}>
                  {message.type === 'bot' ? (
                    <MarkdownText text={message.text} />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-600/30">
                    <span className={`text-xs ${message.type === 'user' ? 'text-primary-200' : 'text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.type === 'bot' && message.id !== 1 && (
                      <button
                        onClick={() => copyMessage(message.text, message.id)}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy"
                      >
                        {copiedId === message.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl rounded-tl-md px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /> 
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-400 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts - shown when few messages */}
        {messages.length <= 2 && (
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/20 flex-shrink-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.label)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 transition-all hover:border-primary-300 dark:hover:border-primary-500/30"
                >
                  <prompt.icon className="w-3.5 h-3.5" />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#111827] flex-shrink-0">
          <div className="flex items-end gap-3">
            {hasSpeechAPI && (
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  isListening
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse ring-2 ring-red-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={isListening ? 'Listening...' : 'Ask me anything about interviews, coding, career...'}
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = '48px'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/25 flex-shrink-0"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
            AI responses are generated and may not always be accurate. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIChatPage
