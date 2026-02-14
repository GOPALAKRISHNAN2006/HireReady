import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Button, Card, Spinner, Badge } from '../components/ui'
import { ProctoredSession } from '../components/proctoring'
import { Send, Clock, Users, MessageCircle, StopCircle } from 'lucide-react'

const GDSession = () => {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  
  // Check if proctoring is enabled
  const searchParams = new URLSearchParams(location.search)
  const proctoringEnabled = searchParams.get('proctored') !== 'false'
  
  const [sessionData, setSessionData] = useState(location.state?.sessionData || null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
  const [sessionActive, setSessionActive] = useState(true)

  useEffect(() => {
    if (sessionData) {
      // Add initial AI messages to start the discussion
      setTimeout(() => {
        const welcomeMessage = {
          type: 'system',
          content: `Welcome to the GD on "${sessionData.topic.title}". You have 15 minutes. Start by sharing your thoughts!`
        }
        setMessages([welcomeMessage])
      }, 1000)
    }
  }, [sessionData])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          endSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Session data not found</p>
          <Button onClick={() => navigate('/gd')}>Go Back</Button>
        </div>
      </div>
    )
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const sendMessage = async () => {
    if (!input.trim() || sending || !sessionActive) return
    
    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const response = await api.post(`/gd/sessions/${sessionId}/contribute`, {
        content: userMessage.content
      })

      const data = response.data.data

      // Add AI response
      if (data.aiResponse) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'ai',
            participant: data.aiResponse.participant,
            content: data.aiResponse.content,
            timestamp: new Date()
          }])
        }, 1500)
      }

      // Add score feedback
      setMessages(prev => [...prev, {
        type: 'feedback',
        score: data.userScore,
        timestamp: new Date()
      }])

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const endSession = async () => {
    setSessionActive(false)
    try {
      const response = await api.post(`/gd/sessions/${sessionId}/complete`)
      navigate('/gd/result', { state: { result: response.data.data } })
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  const getParticipantColor = (name) => {
    const colors = {
      'Priya': 'bg-purple-100 text-purple-700',
      'Rahul': 'bg-blue-100 text-blue-700',
      'Ananya': 'bg-pink-100 text-pink-700',
      'Vikram': 'bg-orange-100 text-orange-700',
      'Sneha': 'bg-teal-100 text-teal-700',
    }
    return colors[name] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
  }

  const SessionContent = (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{sessionData.topic.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Group Discussion in Progress</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            timeLeft < 60 ? 'bg-red-100 dark:bg-red-900/30 text-red-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </div>
          <Button variant="outline" className="text-red-600" onClick={endSession}>
            <StopCircle className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-4 gap-4 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.type === 'system' && (
                  <div className="text-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                )}
                
                {msg.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-indigo-500 text-white rounded-lg px-4 py-2">
                      <p className="text-sm font-medium mb-1">You</p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                )}
                
                {msg.type === 'ai' && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%]">
                      <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${getParticipantColor(msg.participant)}`}>
                        {msg.participant}
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {msg.type === 'feedback' && (
                  <div className="flex justify-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      msg.score >= 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                      msg.score >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700'
                    }`}>
                      Relevance Score: {msg.score}%
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Share your thoughts..."
                disabled={!sessionActive}
                className="flex-1 px-4 py-2 border dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
              />
              <Button onClick={sendMessage} disabled={!input.trim() || sending || !sessionActive}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Participants & Tips */}
        <div className="hidden lg:flex flex-col gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <h3 className="font-semibold text-sm">Participants</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">You</span>
              </div>
              {sessionData.aiParticipants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">{p.name}</span>
                  <Badge variant="secondary" className="text-xs">{p.personality}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 flex-1">
            <h3 className="font-semibold text-sm mb-3">Key Points</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              {sessionData.topic.keyPoints?.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <MessageCircle className="w-3 h-3 text-indigo-500 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 bg-indigo-50 border-indigo-200">
            <h3 className="font-semibold text-sm text-indigo-700 mb-2">Tips</h3>
            <ul className="text-xs text-indigo-600 space-y-1">
              <li>• Be respectful of others' views</li>
              <li>• Support your points with examples</li>
              <li>• Build on others' ideas</li>
              <li>• Stay on topic</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <ProctoredSession
      sessionType="gd"
      sessionId={sessionId}
      enabled={proctoringEnabled}
      config={{
        cameraEnabled: true,
        screenMonitoringEnabled: false,
        audioMonitoringEnabled: true,
        fullscreenRequired: false
      }}
    >
      {SessionContent}
    </ProctoredSession>
  )
}

export default GDSession
