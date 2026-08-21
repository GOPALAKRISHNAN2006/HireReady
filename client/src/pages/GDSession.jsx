import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button, Card, Spinner, Badge } from '../components/ui';
import { ProctoredSession } from '../components/proctoring';
import {
  Send,
  Clock,
  Users,
  MessageCircle,
  StopCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import toast from 'react-hot-toast';

const GDSession = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Check if proctoring is enabled
  const searchParams = new URLSearchParams(location.search);
  const proctoringEnabled = searchParams.get('proctored') !== 'false';

  const [sessionData, setSessionData] = useState(location.state?.sessionData || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [sessionActive, setSessionActive] = useState(true);

  // Voice State
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [speakingParticipant, setSpeakingParticipant] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (sessionData) {
      // Add initial AI messages to start the discussion
      setTimeout(() => {
        const welcomeMessage = {
          type: 'system',
          content: `Welcome to the GD on "${sessionData.topic.title}". You have 15 minutes. Start by sharing your thoughts!`,
        };
        setMessages([welcomeMessage]);
      }, 1000);
    }
  }, [sessionData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = event => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + finalTranscript);
        }
      };

      recognition.onerror = event => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleListening = () => {
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success('Microphone activated. Start speaking.');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const speakMessage = useCallback(
    (text, participantName) => {
      if (!ttsEnabled || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      const isFemale = ['Priya', 'Ananya', 'Sneha', 'Sarah'].includes(participantName);

      if (voices.length > 0) {
        const preferredVoices = voices.filter(
          v =>
            v.lang.includes('en') &&
            (isFemale
              ? v.name.includes('Female') ||
                v.name.includes('Zira') ||
                v.name.includes('Google UK English Female')
              : v.name.includes('Male') ||
                v.name.includes('David') ||
                v.name.includes('Google UK English Male'))
        );
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        }
      }

      utterance.pitch = isFemale ? 1.2 : 0.9;
      utterance.rate = 1.05;

      utterance.onstart = () => setSpeakingParticipant(participantName);
      utterance.onend = () => setSpeakingParticipant(null);
      utterance.onerror = () => setSpeakingParticipant(null);

      window.speechSynthesis.speak(utterance);
    },
    [ttsEnabled]
  );

  // Ensure voices are loaded
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Session data not found</p>
          <Button onClick={() => navigate('/gd')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || sending || !sessionActive) return;

    // Stop listening if sending
    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMessage = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await api.post(`/gd/sessions/${sessionId}/contribute`, {
        content: userMessage.content,
      });

      const data = response.data.data;

      // Add AI response
      if (data.aiResponse) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              type: 'ai',
              participant: data.aiResponse.participant,
              content: data.aiResponse.content,
              timestamp: new Date(),
            },
          ]);
          speakMessage(data.aiResponse.content, data.aiResponse.participant);
        }, 1500);
      }

      // Add score feedback
      setMessages(prev => [
        ...prev,
        {
          type: 'feedback',
          score: data.userScore,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send contribution');
    } finally {
      setSending(false);
    }
  };

  const endSession = async () => {
    setSessionActive(false);
    window.speechSynthesis?.cancel();
    try {
      const response = await api.post(`/gd/sessions/${sessionId}/complete`);
      navigate('/gd/result', { state: { result: response.data.data } });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const getParticipantColor = name => {
    const colors = {
      Priya: 'bg-primary-100 text-primary-700 ring-primary-500',
      Rahul: 'bg-blue-100 text-blue-700 ring-blue-500',
      Ananya: 'bg-pink-100 text-pink-700 ring-pink-500',
      Vikram: 'bg-orange-100 text-orange-700 ring-orange-500',
      Sneha: 'bg-teal-100 text-teal-700 ring-teal-500',
    };
    return (
      colors[name] ||
      'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 ring-slate-500'
    );
  };

  const SessionContent = (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {sessionData.topic.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            Group Discussion in Progress
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-1 rounded-full ${ttsEnabled ? 'text-primary-600 bg-primary-50' : 'text-slate-400 bg-slate-100'}`}
              title={ttsEnabled ? 'Mute AI Voices' : 'Unmute AI Voices'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              timeLeft < 60
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
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
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 overflow-hidden">
          {/* Avatar Roundtable */}
          <div className="flex justify-center gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-700 overflow-x-auto">
            {/* User Avatar */}
            <div className="flex flex-col items-center gap-2 transition-all">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-primary-500 shadow-md transition-all duration-300 ${isListening ? 'ring-4 ring-primary-400 shadow-primary-500/50 scale-110' : ''}`}
              >
                Y
              </div>
              <span
                className={`text-sm font-medium ${isListening ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}
              >
                You
              </span>
            </div>

            {/* AI Avatars */}
            {sessionData.aiParticipants.map((p, idx) => {
              const colorClasses = getParticipantColor(p.name).split(' ');
              const bgClass = colorClasses[0].replace('-100', '-500');
              const isSpeaking = speakingParticipant === p.name;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 transition-all">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${bgClass} shadow-md transition-all duration-300 ${isSpeaking ? `ring-4 ring-offset-2 dark:ring-offset-slate-900 ${colorClasses[2]} scale-110 shadow-lg` : ''}`}
                  >
                    {p.name[0]}
                  </div>
                  <span
                    className={`text-sm font-medium ${isSpeaking ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {p.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.type === 'system' && (
                  <div className="text-center my-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-full border dark:border-slate-700 shadow-sm">
                      {msg.content}
                    </span>
                  </div>
                )}

                {msg.type === 'user' && (
                  <div className="flex justify-end mb-2">
                    <div className="max-w-[75%] bg-primary-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
                      <p className="text-xs font-medium text-primary-100 mb-1">You</p>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                )}

                {msg.type === 'ai' && (
                  <div className="flex justify-start mb-2">
                    <div className="max-w-[75%]">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 shadow-sm border dark:border-slate-700/50 ${getParticipantColor(msg.participant).split(' ').slice(0, 2).join(' ')}`}
                      >
                        {msg.participant}
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm text-slate-800 dark:text-slate-200">
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )}

                {msg.type === 'feedback' && (
                  <div className="flex justify-center mt-2 mb-6">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm border ${
                        msg.score >= 70
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800/50'
                          : msg.score >= 50
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/50'
                      }`}
                    >
                      Relevance Score: {msg.score}%
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700">
            <div className="flex items-end gap-2">
              <button
                onClick={toggleListening}
                disabled={!sessionActive}
                className={`p-3 rounded-full flex-shrink-0 transition-colors shadow-sm ${
                  isListening
                    ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-900 animate-pulse'
                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                }`}
                title={isListening ? 'Stop Listening' : 'Start Voice Input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    isListening
                      ? 'Listening... speak now'
                      : 'Type your thoughts or use the microphone...'
                  }
                  disabled={!sessionActive}
                  rows={2}
                  className={`w-full px-4 py-3 border dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-800 dark:text-white resize-none shadow-sm transition-colors ${
                    isListening ? 'border-primary-300 bg-primary-50/50 dark:bg-primary-900/10' : ''
                  }`}
                />
              </div>

              <Button
                onClick={sendMessage}
                disabled={!input.trim() || sending || !sessionActive}
                className="h-[52px] px-6 rounded-xl shadow-sm flex-shrink-0"
              >
                {sending ? <Spinner size="sm" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            {isListening && (
              <p className="text-xs text-primary-600 mt-2 text-center animate-pulse">
                Listening to your microphone...
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Participants & Tips */}
        <div className="hidden lg:flex flex-col gap-4">
          <Card className="p-4 shadow-sm border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b dark:border-slate-700">
              <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <h3 className="font-semibold text-sm">Participants</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">You</span>
                </div>
              </div>
              {sessionData.aiParticipants.map((p, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${speakingParticipant === p.name ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${speakingParticipant === p.name ? 'bg-primary-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}
                    ></div>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                    {p.personality}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 flex-1 shadow-sm border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-sm mb-4 pb-2 border-b dark:border-slate-700">
              Key Points to Discuss
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
              {sessionData.topic.keyPoints?.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 bg-primary-100 dark:bg-primary-900/30 p-1 rounded">
                    <MessageCircle className="w-3 h-3 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  </div>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 border-primary-100 dark:border-primary-800/30 shadow-sm">
            <h3 className="font-semibold text-sm text-primary-800 dark:text-primary-300 mb-3">
              Discussion Tips
            </h3>
            <ul className="text-xs text-primary-700/80 dark:text-primary-300/80 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span> Be respectful of
                others' views
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span> Support your
                points with examples
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span> Build on others'
                ideas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span> Keep your
                microphone clear
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <ProctoredSession
      sessionType="group_discussion"
      sessionId={sessionId}
      enabled={proctoringEnabled}
      config={{
        cameraEnabled: true,
        screenMonitoringEnabled: false,
        audioMonitoringEnabled: true,
        fullscreenRequired: false,
      }}
    >
      {SessionContent}
    </ProctoredSession>
  );
};

export default GDSession;
