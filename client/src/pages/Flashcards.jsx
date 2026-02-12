import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '../components/ui'
import toast from 'react-hot-toast'
import {
  Layers,
  Plus,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  Trash2,
  Edit3,
  Save,
  X,
  Brain,
  Code2,
  Building2,
  HelpCircle,
  Check,
  BookOpen,
  Zap,
  Trophy,
  Target,
  Clock,
  ArrowLeft
} from 'lucide-react'

const DEFAULT_DECKS = [
  {
    id: 'dsa-basics',
    name: 'DSA Fundamentals',
    icon: 'Code2',
    color: 'from-green-500 to-emerald-500',
    cards: [
      { id: 1, front: 'What is the time complexity of binary search?', back: 'O(log n) - It halves the search space with each comparison.', mastered: false },
      { id: 2, front: 'What is a Hash Map?', back: 'A data structure that maps keys to values using a hash function. Average O(1) for insert, delete, lookup.', mastered: false },
      { id: 3, front: 'Difference between BFS and DFS?', back: 'BFS: Level by level, uses Queue, good for shortest path.\nDFS: Depth first, uses Stack/recursion, good for cycle detection.', mastered: false },
      { id: 4, front: 'What is Dynamic Programming?', back: 'Solving complex problems by breaking them into overlapping subproblems. Key: optimal substructure + overlapping subproblems. Techniques: memoization (top-down), tabulation (bottom-up).', mastered: false },
      { id: 5, front: 'Two Pointer Technique', back: 'Use two pointers to iterate through a sorted array/string. Common patterns: opposite ends (two sum), slow/fast (linked list cycle), sliding window.', mastered: false },
      { id: 6, front: 'What is a Stack vs Queue?', back: 'Stack: LIFO (Last In First Out) - push/pop from top.\nQueue: FIFO (First In First Out) - enqueue at rear, dequeue from front.', mastered: false },
    ]
  },
  {
    id: 'behavioral',
    name: 'Behavioral Questions',
    icon: 'Brain',
    color: 'from-purple-500 to-pink-500',
    cards: [
      { id: 1, front: 'Tell me about yourself', back: 'Structure: Present → Past → Future.\n\n1. Current role/situation\n2. Key experiences that led here\n3. Why this role/company excites you\n\nKeep it 1-2 minutes. Be concise and relevant.', mastered: false },
      { id: 2, front: 'What is the STAR method?', back: 'Situation: Set the context\nTask: Describe your responsibility\nAction: Explain what YOU did\nResult: Share the outcome (quantify!)\n\nAlways prepare 5-6 STAR stories.', mastered: false },
      { id: 3, front: 'Describe a time you handled conflict', back: 'Use STAR. Focus on:\n- Professional approach\n- Active listening\n- Finding common ground\n- Positive outcome\n\nNever blame others. Show emotional intelligence.', mastered: false },
      { id: 4, front: 'Why do you want to work here?', back: 'Research the company! Mention:\n- Specific products/projects\n- Company culture/values\n- Growth opportunities\n- How your skills align\n\nBe genuine and specific.', mastered: false },
      { id: 5, front: 'Where do you see yourself in 5 years?', back: 'Show ambition + alignment with company:\n- Growth in the role\n- Developing specific skills\n- Taking on more responsibility\n- Contributing to team/company goals\n\nDon\'t say "in your chair!"', mastered: false },
    ]
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: 'Building2',
    color: 'from-blue-500 to-indigo-500',
    cards: [
      { id: 1, front: 'System Design Interview Framework', back: '1. Clarify requirements (5 min)\n2. Estimate scale (2 min)\n3. Define API (3 min)\n4. High-level design (10 min)\n5. Deep dive components (15 min)\n6. Address bottlenecks (5 min)', mastered: false },
      { id: 2, front: 'What is a Load Balancer?', back: 'Distributes incoming traffic across multiple servers.\n\nAlgorithms: Round Robin, Least Connections, IP Hash.\nTypes: L4 (transport) vs L7 (application).\nExamples: Nginx, AWS ELB, HAProxy.', mastered: false },
      { id: 3, front: 'CAP Theorem', back: 'Consistency: All nodes see same data\nAvailability: Every request gets a response\nPartition Tolerance: System works despite network failures\n\nYou can only guarantee 2 of 3. Choose CP or AP based on needs.', mastered: false },
      { id: 4, front: 'Horizontal vs Vertical Scaling', back: 'Vertical: Add more power (CPU, RAM) to one machine. Simple but has limits.\n\nHorizontal: Add more machines. More complex but infinitely scalable. Needs load balancing.', mastered: false },
      { id: 5, front: 'What is Caching?', back: 'Store frequently accessed data in fast storage.\n\nPatterns: Cache-aside, Write-through, Write-behind.\nTools: Redis, Memcached.\nEviction: LRU, LFU, TTL.\n\nConsider: cache invalidation, thundering herd.', mastered: false },
    ]
  },
]

const ICON_MAP = { Code2, Brain, Building2, HelpCircle, BookOpen, Layers }

const Flashcards = () => {
  const [decks, setDecks] = useState(() => {
    try {
      const saved = localStorage.getItem('hireready-flashcards')
      return saved ? JSON.parse(saved) : DEFAULT_DECKS
    } catch { return DEFAULT_DECKS }
  })
  const [activeDeckId, setActiveDeckId] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isCreatingDeck, setIsCreatingDeck] = useState(false)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newDeck, setNewDeck] = useState({ name: '', icon: 'Layers', color: 'from-primary-500 to-purple-500' })
  const [newCard, setNewCard] = useState({ front: '', back: '' })
  const [studyMode, setStudyMode] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 })

  useEffect(() => {
    localStorage.setItem('hireready-flashcards', JSON.stringify(decks))
  }, [decks])

  const activeDeck = decks.find(d => d.id === activeDeckId)
  const activeCards = activeDeck?.cards || []
  const currentCard = activeCards[currentIndex]

  const nextCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % activeCards.length)
    }, 150)
  }

  const prevCard = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + activeCards.length) % activeCards.length)
    }, 150)
  }

  const shuffleDeck = () => {
    if (!activeDeck) return
    const shuffled = [...activeDeck.cards].sort(() => Math.random() - 0.5)
    setDecks(prev => prev.map(d => d.id === activeDeckId ? { ...d, cards: shuffled } : d))
    setCurrentIndex(0)
    setIsFlipped(false)
    toast.success('Deck shuffled!')
  }

  const toggleMastered = (cardId) => {
    setDecks(prev => prev.map(d => {
      if (d.id !== activeDeckId) return d
      return { ...d, cards: d.cards.map(c => c.id === cardId ? { ...c, mastered: !c.mastered } : c) }
    }))
  }

  const markKnow = () => {
    if (currentCard) {
      if (!currentCard.mastered) toggleMastered(currentCard.id)
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }))
    }
    nextCard()
  }

  const markDontKnow = () => {
    if (currentCard?.mastered) toggleMastered(currentCard.id)
    setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
    nextCard()
  }

  const createDeck = () => {
    if (!newDeck.name.trim()) { toast.error('Enter a deck name'); return }
    const deck = {
      id: `custom-${Date.now()}`,
      name: newDeck.name,
      icon: newDeck.icon,
      color: newDeck.color,
      cards: [],
    }
    setDecks(prev => [...prev, deck])
    setNewDeck({ name: '', icon: 'Layers', color: 'from-primary-500 to-purple-500' })
    setIsCreatingDeck(false)
    toast.success('Deck created!')
  }

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) { toast.error('Fill in both sides'); return }
    const card = { id: Date.now(), front: newCard.front, back: newCard.back, mastered: false }
    setDecks(prev => prev.map(d => d.id === activeDeckId ? { ...d, cards: [...d.cards, card] } : d))
    setNewCard({ front: '', back: '' })
    setIsAddingCard(false)
    toast.success('Card added!')
  }

  const deleteCard = (cardId) => {
    setDecks(prev => prev.map(d => {
      if (d.id !== activeDeckId) return d
      return { ...d, cards: d.cards.filter(c => c.id !== cardId) }
    }))
    if (currentIndex >= activeCards.length - 1) setCurrentIndex(Math.max(0, activeCards.length - 2))
    toast.success('Card deleted')
  }

  const deleteDeck = (deckId) => {
    setDecks(prev => prev.filter(d => d.id !== deckId))
    if (activeDeckId === deckId) setActiveDeckId(null)
    toast.success('Deck deleted')
  }

  const startStudy = () => {
    setStudyMode(true)
    setSessionStats({ correct: 0, incorrect: 0 })
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  // Deck Selection View
  if (!activeDeckId) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              Flashcards
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Study with spaced repetition flashcards</p>
          </div>
          <Button onClick={() => setIsCreatingDeck(true)} icon={Plus}>New Deck</Button>
        </div>

        {isCreatingDeck && (
          <Card>
            <Card.Content className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Deck</h3>
              <div className="space-y-4">
                <input
                  value={newDeck.name}
                  onChange={(e) => setNewDeck(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Deck name..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setIsCreatingDeck(false)}>Cancel</Button>
                  <Button onClick={createDeck}>Create Deck</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map(deck => {
            const IconComp = ICON_MAP[deck.icon] || Layers
            const masteredCount = deck.cards.filter(c => c.mastered).length
            const progress = deck.cards.length > 0 ? Math.round((masteredCount / deck.cards.length) * 100) : 0
            return (
              <div
                key={deck.id}
                onClick={() => { setActiveDeckId(deck.id); setCurrentIndex(0); setIsFlipped(false); setStudyMode(false) }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 hover:shadow-xl transition-all cursor-pointer group relative"
              >
                {deck.id.startsWith('custom-') && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id) }}
                    className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
                <div className={`w-14 h-14 bg-gradient-to-br ${deck.color} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{deck.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{deck.cards.length} cards</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Mastered</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{masteredCount}/{deck.cards.length}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{decks.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Decks</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-2xl font-bold text-primary-500">{decks.reduce((a, d) => a + d.cards.length, 0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Cards</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-2xl font-bold text-green-500">{decks.reduce((a, d) => a + d.cards.filter(c => c.mastered).length, 0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mastered</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-2xl font-bold text-orange-500">
              {decks.reduce((a, d) => a + d.cards.length, 0) - decks.reduce((a, d) => a + d.cards.filter(c => c.mastered).length, 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">To Review</p>
          </div>
        </div>
      </div>
    )
  }

  // Card Study View
  const totalStudied = sessionStats.correct + sessionStats.incorrect
  const sessionComplete = studyMode && totalStudied >= activeCards.length && activeCards.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setActiveDeckId(null); setStudyMode(false) }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{activeDeck?.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{activeCards.length} cards · {activeCards.filter(c => c.mastered).length} mastered</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAddingCard(true)} icon={Plus}>Add Card</Button>
          <Button variant="outline" size="sm" onClick={shuffleDeck} icon={Shuffle}>Shuffle</Button>
          {!studyMode && activeCards.length > 0 && (
            <Button size="sm" onClick={startStudy} icon={Zap}>Study Mode</Button>
          )}
        </div>
      </div>

      {/* Add Card */}
      {isAddingCard && (
        <Card>
          <Card.Content className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Card</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Front (Question)</label>
                <textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                  rows={4}
                  placeholder="Enter the question..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Back (Answer)</label>
                <textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                  rows={4}
                  placeholder="Enter the answer..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setIsAddingCard(false)}>Cancel</Button>
              <Button onClick={addCard} icon={Save}>Add Card</Button>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Session Complete */}
      {sessionComplete ? (
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Study Session Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Great job reviewing this deck.</p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{sessionStats.correct}</p>
              <p className="text-sm text-gray-500">Knew It</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{sessionStats.incorrect}</p>
              <p className="text-sm text-gray-500">Review Again</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-500">
                {totalStudied > 0 ? Math.round((sessionStats.correct / totalStudied) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => { setActiveDeckId(null); setStudyMode(false) }}>Back to Decks</Button>
            <Button onClick={startStudy} icon={RotateCcw}>Study Again</Button>
          </div>
        </div>
      ) : activeCards.length > 0 ? (
        <>
          {/* Progress */}
          {studyMode && (
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all" style={{ width: `${(totalStudied / activeCards.length) * 100}%` }} />
              </div>
              <span className="text-sm text-gray-500">{totalStudied}/{activeCards.length}</span>
            </div>
          )}

          {/* Card */}
          <div className="max-w-2xl mx-auto">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[320px] cursor-pointer perspective-1000"
            >
              <div className={`relative w-full min-h-[320px] transition-all duration-500 preserve-3d ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center shadow-lg">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                    <HelpCircle className="w-6 h-6 text-primary-500" />
                  </div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white text-center leading-relaxed whitespace-pre-wrap">
                    {currentCard?.front}
                  </p>
                  <p className="text-sm text-gray-400 mt-6">Click to flip</p>
                  {currentCard?.mastered && (
                    <Badge variant="success" className="mt-3">✓ Mastered</Badge>
                  )}
                </div>
                {/* Back */}
                <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border-2 border-primary-200 dark:border-primary-700/50 p-8 flex flex-col items-center justify-center shadow-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-lg text-gray-800 dark:text-gray-200 text-center leading-relaxed whitespace-pre-wrap">
                    {currentCard?.back}
                  </p>
                  <p className="text-sm text-gray-400 mt-6">Click to flip back</p>
                </div>
              </div>
            </div>

            {/* Study Mode Actions */}
            {studyMode && isFlipped && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={markDontKnow}
                  className="flex items-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl font-medium transition-colors"
                >
                  <X className="w-5 h-5" />
                  Still Learning
                </button>
                <button
                  onClick={markKnow}
                  className="flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-xl font-medium transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Got It!
                </button>
              </div>
            )}

            {/* Navigation */}
            {!studyMode && (
              <div className="flex items-center justify-between mt-6">
                <button onClick={prevCard} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {currentIndex + 1} / {activeCards.length}
                  </span>
                  <button
                    onClick={() => toggleMastered(currentCard?.id)}
                    className={`p-2 rounded-lg transition-colors ${currentCard?.mastered ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <Star className={`w-5 h-5 ${currentCard?.mastered ? 'fill-green-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteCard(currentCard?.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={nextCard} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layers className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No cards in this deck</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Add some flashcards to start studying</p>
          <Button onClick={() => setIsAddingCard(true)} icon={Plus}>Add First Card</Button>
        </div>
      )}
    </div>
  )
}

export default Flashcards
