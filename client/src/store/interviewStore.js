import { create } from 'zustand'

export const useInterviewStore = create((set, get) => ({
  // Current interview state
  currentInterview: null,
  currentQuestionIndex: 0,
  responses: [],
  isActive: false,
  isPaused: false,
  timeRemaining: null,
  
  // Interview settings
  settings: {
    category: 'general',
    difficulty: 'medium',
    questionCount: 10,
    timeLimit: null,
    type: 'practice',
  },

  // Set interview settings
  setSettings: (newSettings) => {
    set({ settings: { ...get().settings, ...newSettings } })
  },

  // Start interview
  startInterview: (interview) => {
    // Handle questions from different response formats
    let questions = interview.questions || []
    if (!questions.length && interview.responses) {
      questions = interview.responses.map((r, index) => {
        const questionText = r.questionText || 
                           (r.question && typeof r.question === 'object' ? r.question.text : null) ||
                           `Question ${index + 1}`
        return {
          _id: r.question?._id || r.question || `q-${index}`,
          text: questionText,
          category: r.question?.category || interview.category,
          difficulty: r.question?.difficulty || interview.difficulty,
          hints: r.question?.hints || []
        }
      })
    }
    
    // Calculate time remaining in seconds
    let timeInSeconds = null
    if (interview.timeLimitMinutes && interview.timeLimitMinutes > 0) {
      timeInSeconds = interview.timeLimitMinutes * 60
    } else if (interview.settings?.timeLimit && interview.settings.timeLimit > 0) {
      timeInSeconds = interview.settings.timeLimit * 60
    }
    
    console.log('Starting interview with', questions.length, 'questions, time:', timeInSeconds)
    
    set({
      currentInterview: { ...interview, questions },
      currentQuestionIndex: 0,
      responses: [],
      isActive: true,
      isPaused: false,
      timeRemaining: timeInSeconds,
    })
  },

  // Submit answer for current question
  submitAnswer: (answer) => {
    const { currentQuestionIndex, responses } = get()
    const newResponses = [...responses]
    newResponses[currentQuestionIndex] = {
      ...newResponses[currentQuestionIndex],
      answer,
      submittedAt: new Date().toISOString(),
    }
    set({ responses: newResponses })
  },

  // Navigate to next question
  nextQuestion: () => {
    const { currentQuestionIndex, currentInterview } = get()
    const totalQuestions = currentInterview?.questions?.length || 0
    
    if (currentQuestionIndex < totalQuestions - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 })
      return true
    }
    return false
  },

  // Navigate to previous question
  previousQuestion: () => {
    const { currentQuestionIndex } = get()
    
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 })
      return true
    }
    return false
  },

  // Go to specific question
  goToQuestion: (index) => {
    const { currentInterview } = get()
    const totalQuestions = currentInterview?.questions?.length || 0
    
    if (index >= 0 && index < totalQuestions) {
      set({ currentQuestionIndex: index })
    }
  },

  // Pause interview
  pauseInterview: () => {
    set({ isPaused: true })
  },

  // Resume interview
  resumeInterview: () => {
    set({ isPaused: false })
  },

  // Update time remaining
  updateTime: (time) => {
    set({ timeRemaining: time })
  },

  // End interview
  endInterview: () => {
    set({
      isActive: false,
      isPaused: false,
    })
  },

  // Reset interview state
  resetInterview: () => {
    set({
      currentInterview: null,
      currentQuestionIndex: 0,
      responses: [],
      isActive: false,
      isPaused: false,
      timeRemaining: null,
      settings: {
        category: 'general',
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: null,
        type: 'practice',
      },
    })
  },

  // Get current question
  getCurrentQuestion: () => {
    const { currentInterview, currentQuestionIndex } = get()
    return currentInterview?.questions?.[currentQuestionIndex] || null
  },

  // Get progress percentage
  getProgress: () => {
    const { responses, currentInterview } = get()
    const totalQuestions = currentInterview?.questions?.length || 1
    const answeredCount = responses.filter(r => r?.answer).length
    return Math.round((answeredCount / totalQuestions) * 100)
  },
}))
