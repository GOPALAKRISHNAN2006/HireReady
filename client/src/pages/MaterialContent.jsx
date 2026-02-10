/**
 * ===========================================
 * Study Material Content Page — Redesigned
 * ===========================================
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, Badge } from '../components/ui'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  Play,
  FileText,
  Video,
  Code,
  ChevronRight,
  ChevronLeft,
  BookMarked,
  ExternalLink,
  Sparkles,
  Award,
  Brain,
  RotateCcw,
  Share2,
  Bookmark,
  GraduationCap,
  Zap,
  CircleDot,
  ListChecks,
} from 'lucide-react'

// ─── Study material content database ────────────────────────
const MATERIAL_CONTENT = {
  1: {
    title: 'Complete Guide to Data Structures',
    category: 'dsa',
    type: 'article',
    duration: '45 min read',
    difficulty: 'beginner',
    author: 'Tech Interview Pro',
    sections: [
      {
        title: 'Introduction to Data Structures',
        content: `Data structures are fundamental building blocks of any software application. They define how data is organized, stored, and manipulated in memory.

**Why Learn Data Structures?**
- Efficient problem solving
- Better code organization
- Optimal resource usage
- Essential for technical interviews

**Types of Data Structures:**
1. **Linear**: Arrays, Linked Lists, Stacks, Queues
2. **Non-Linear**: Trees, Graphs
3. **Hash-Based**: Hash Tables, Hash Maps`
      },
      {
        title: 'Arrays',
        content: `Arrays are the most basic data structure - a contiguous block of memory storing elements of the same type.

**Key Operations:**
- Access: O(1)
- Search: O(n)
- Insertion: O(n)
- Deletion: O(n)

**Code Example:**
\`\`\`javascript
// Array declaration
const arr = [1, 2, 3, 4, 5];

// Access element
console.log(arr[2]); // 3

// Insert at end
arr.push(6); // [1, 2, 3, 4, 5, 6]

// Remove from end
arr.pop(); // [1, 2, 3, 4, 5]
\`\`\`

**When to Use Arrays:**
- Fixed-size collections
- Random access needed
- Memory efficiency important`
      },
      {
        title: 'Linked Lists',
        content: `Linked lists are dynamic data structures where each element (node) contains data and a reference to the next node.

**Types:**
1. **Singly Linked List** - Forward traversal only
2. **Doubly Linked List** - Both directions
3. **Circular Linked List** - Last node points to first

**Key Operations:**
- Access: O(n)
- Search: O(n)
- Insertion at head: O(1)
- Deletion at head: O(1)

**Code Example:**
\`\`\`javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  append(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }
}
\`\`\``
      },
      {
        title: 'Stacks and Queues',
        content: `**Stack (LIFO - Last In, First Out)**
Think of a stack of plates - you add and remove from the top.

Operations:
- push() - Add to top
- pop() - Remove from top
- peek() - View top element

**Queue (FIFO - First In, First Out)**
Think of a line at a store - first person in line is served first.

Operations:
- enqueue() - Add to back
- dequeue() - Remove from front
- peek() - View front element

**Common Interview Questions:**
1. Implement a queue using stacks
2. Valid parentheses
3. Next greater element
4. Sliding window maximum`
      },
      {
        title: 'Trees',
        content: `Trees are hierarchical data structures with a root node and child nodes.

**Binary Tree** - Each node has at most 2 children
**Binary Search Tree (BST)** - Left child < Parent < Right child

**Key Operations (BST):**
- Search: O(log n) average, O(n) worst
- Insertion: O(log n) average
- Deletion: O(log n) average

**Tree Traversals:**
1. **In-order**: Left → Root → Right (gives sorted order in BST)
2. **Pre-order**: Root → Left → Right
3. **Post-order**: Left → Right → Root
4. **Level-order**: BFS level by level

**Code Example:**
\`\`\`javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function inorderTraversal(root) {
  if (!root) return [];
  return [
    ...inorderTraversal(root.left),
    root.val,
    ...inorderTraversal(root.right)
  ];
}
\`\`\``
      }
    ],
    quiz: [
      { question: 'What is the time complexity of accessing an element in an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0 },
      { question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Array', 'Stack', 'Linked List'], correctIndex: 2 },
      { question: 'In a Binary Search Tree, where are smaller values stored?', options: ['Right subtree', 'Left subtree', 'Root', 'Leaf nodes only'], correctIndex: 1 },
    ]
  },
  4: {
    title: 'System Design Interview Guide',
    category: 'system-design',
    type: 'course',
    duration: '8 hours',
    difficulty: 'advanced',
    author: 'System Design Hub',
    sections: [
      {
        title: 'Introduction to System Design',
        content: `System design interviews assess your ability to design large-scale distributed systems.

**What Interviewers Look For:**
1. Problem-solving approach
2. Knowledge of system components
3. Trade-off analysis
4. Scalability considerations
5. Communication skills

**Framework for System Design:**
1. **Clarify Requirements** (5 min)
   - Functional requirements
   - Non-functional requirements
   - Scale estimates

2. **High-Level Design** (10-15 min)
   - System components
   - Data flow
   - API design

3. **Deep Dive** (20-25 min)
   - Database design
   - Scaling strategies
   - Bottleneck identification

4. **Wrap Up** (5 min)
   - Trade-offs discussion
   - Future improvements`
      },
      {
        title: 'Key Concepts',
        content: `**Scalability**
- Vertical scaling: Add more power to existing machine
- Horizontal scaling: Add more machines

**Load Balancing**
- Round Robin
- Least Connections
- IP Hash
- Weighted Round Robin

**Caching**
- CDN for static content
- Application cache (Redis, Memcached)
- Database query cache
- Cache invalidation strategies

**Database**
- SQL vs NoSQL
- Sharding strategies
- Replication
- Consistency vs Availability (CAP theorem)

**Message Queues**
- Async processing
- Decoupling services
- Examples: Kafka, RabbitMQ, SQS`
      },
      {
        title: 'Common System Design Problems',
        content: `**1. Design URL Shortener (bit.ly)**
- Key generation service
- Base62 encoding
- Read-heavy (100:1 read/write ratio)

**2. Design Twitter**
- Feed generation
- Fanout on write vs read
- Celebrity problem

**3. Design WhatsApp**
- WebSocket connections
- Message delivery & receipts
- End-to-end encryption

**4. Design YouTube**
- Video upload & processing
- CDN for delivery
- Recommendation engine

**5. Design Uber**
- Location tracking
- Matching algorithm
- ETA calculation`
      }
    ],
    quiz: [
      { question: 'What does CAP theorem stand for?', options: ['Cache, API, Processing', 'Consistency, Availability, Partition tolerance', 'Compute, Analyze, Process', 'Connect, Authorize, Protect'], correctIndex: 1 },
      { question: 'Which is better for read-heavy workloads?', options: ['Vertical scaling only', 'No caching', 'Read replicas with caching', 'Single database instance'], correctIndex: 2 },
    ]
  },
  7: {
    title: 'STAR Method Mastery',
    category: 'behavioral',
    type: 'article',
    duration: '20 min read',
    difficulty: 'beginner',
    author: 'Career Coach Pro',
    sections: [
      {
        title: 'What is the STAR Method?',
        content: `The STAR method is a structured approach to answering behavioral interview questions.

**S - Situation**
Set the scene. Describe the context and background.
- When did this happen?
- Where were you working?
- What was the project/team?

**T - Task**
Explain your responsibility or goal.
- What were you trying to achieve?
- What was your role?
- What were the expectations?

**A - Action**
Describe the specific steps YOU took.
- What did you do?
- How did you do it?
- Why did you choose that approach?

**R - Result**
Share the outcome and what you learned.
- What was the impact?
- What did you learn?
- Would you do anything differently?`
      },
      {
        title: 'Example: Tell me about a time you faced a challenge',
        content: `**Situation:**
"In my previous role as a software developer at TechCorp, our team was tasked with migrating a legacy monolithic application to microservices. We had a tight deadline of 3 months, and the system served 10 million daily active users."

**Task:**
"As the lead developer, I was responsible for designing the migration strategy and ensuring zero downtime during the transition. I needed to coordinate with 4 other developers and the DevOps team."

**Action:**
"I broke down the migration into phases:
1. First, I analyzed the monolith and identified 12 bounded contexts
2. I implemented a strangler fig pattern to gradually replace functionality
3. I set up comprehensive monitoring and feature flags
4. I organized daily standups and created detailed documentation
5. I personally handled the most complex payment service migration"

**Result:**
"We completed the migration 2 weeks ahead of schedule with zero downtime. The new architecture reduced average response time by 40% and allowed teams to deploy independently. This approach was later adopted as the company standard for migrations."`
      },
      {
        title: 'Common Behavioral Questions',
        content: `**Leadership:**
- Tell me about a time you led a team
- Describe a situation where you had to motivate others
- How do you handle underperforming team members?

**Problem Solving:**
- Describe a difficult technical problem you solved
- Tell me about a time you had to make a decision with incomplete information
- How do you approach debugging complex issues?

**Conflict:**
- Tell me about a disagreement with a coworker
- How do you handle conflicting priorities?
- Describe a time you received critical feedback

**Failure:**
- Tell me about a project that failed
- What's your biggest professional mistake?
- How do you handle setbacks?

**Success:**
- What's your proudest achievement?
- Tell me about exceeding expectations
- Describe an innovative solution you created`
      }
    ],
    quiz: [
      { question: 'What does the "A" in STAR stand for?', options: ['Achievement', 'Action', 'Analysis', 'Approach'], correctIndex: 1 },
      { question: 'Which part of STAR should describe the outcome?', options: ['Situation', 'Task', 'Action', 'Result'], correctIndex: 3 },
    ]
  }
}

// ─── Helpers ────────────────────────────────────────────────
const getCategoryGradient = (cat) => {
  const map = {
    dsa: 'from-blue-500 to-indigo-600',
    'system-design': 'from-purple-500 to-violet-600',
    behavioral: 'from-pink-500 to-rose-600',
    database: 'from-emerald-500 to-teal-600',
    devops: 'from-orange-500 to-amber-600',
    ml: 'from-cyan-500 to-blue-600',
  }
  return map[cat] || 'from-gray-500 to-gray-600'
}

const getDifficultyConfig = (d) => {
  const map = {
    beginner: { label: 'Beginner', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '🌱' },
    intermediate: { label: 'Intermediate', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: '🔥' },
    advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '⚡' },
  }
  return map[d] || map.intermediate
}

// ─── Markdown-lite renderer ─────────────────────────────────
const renderContent = (text) => {
  const lines = text.split('\n')
  const elements = []
  let inCodeBlock = false
  let codeLines = []
  let codeLang = ''

  const flushCode = (key) => {
    if (codeLines.length) {
      elements.push(
        <div key={key} className="my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 uppercase">{codeLang || 'code'}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(codeLines.join('\n')); toast.success('Copied!') }}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto bg-gray-50 dark:bg-[#0d1117] text-sm">
            <code className="text-gray-800 dark:text-gray-200 font-mono leading-relaxed">{codeLines.join('\n')}</code>
          </pre>
        </div>
      )
      codeLines = []
      codeLang = ''
    }
  }

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) { flushCode(`code-${i}`); inCodeBlock = false }
      else { inCodeBlock = true; codeLang = line.slice(3).trim() }
      return
    }
    if (inCodeBlock) { codeLines.push(line); return }

    // bold heading line
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      const text = line.trim().replace(/\*\*/g, '')
      elements.push(<h4 key={i} className="font-bold text-gray-900 dark:text-white mt-5 mb-1.5 text-[15px]">{text}</h4>)
      return
    }
    // inline bold
    const renderBold = (str) => {
      const parts = str.split(/(\*\*[^*]+\*\*)/g)
      return parts.map((p, j) =>
        p.startsWith('**') ? <strong key={j} className="font-semibold text-gray-900 dark:text-white">{p.replace(/\*\*/g, '')}</strong> : p
      )
    }
    // inline code
    const renderInlineCode = (nodes) => {
      if (typeof nodes === 'string') {
        const pts = nodes.split(/(`[^`]+`)/g)
        return pts.map((p, j) =>
          p.startsWith('`') ? <code key={j} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-pink-600 dark:text-pink-400">{p.replace(/`/g, '')}</code> : renderBold(p)
        )
      }
      return nodes
    }
    
    if (line.startsWith('- ')) {
      elements.push(
        <li key={i} className="ml-5 list-disc text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed my-0.5">
          {renderInlineCode(line.substring(2))}
        </li>
      )
    } else if (/^\d+\./.test(line)) {
      elements.push(
        <li key={i} className="ml-5 list-decimal text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed my-0.5">
          {renderInlineCode(line.replace(/^\d+\.\s*/, ''))}
        </li>
      )
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed my-2">
          {renderInlineCode(line)}
        </p>
      )
    }
  })
  flushCode('code-final')
  return elements
}

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════
const MaterialContent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const material = MATERIAL_CONTENT[id]

  useEffect(() => {
    const saved = localStorage.getItem(`material-progress-${id}`)
    if (saved) { const p = JSON.parse(saved); setCompletedSections(p.completedSections || []); setCurrentSection(p.currentSection || 0) }
  }, [id])

  useEffect(() => {
    if (material) localStorage.setItem(`material-progress-${id}`, JSON.stringify({ completedSections, currentSection }))
  }, [completedSections, currentSection, id, material])

  // ─── Not found ────────────────────────
  if (!material) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Material Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">This study material doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/study-materials')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Materials
        </Button>
      </div>
    )
  }

  const progress = Math.round((completedSections.length / material.sections.length) * 100)
  const diff = getDifficultyConfig(material.difficulty)

  const markSectionComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection])
      toast.success('Section completed!')
    }
    if (currentSection < material.sections.length - 1) setCurrentSection(currentSection + 1)
    else if (material.quiz && !showQuiz) setShowQuiz(true)
  }

  const calculateQuizScore = () => {
    if (!material.quiz) return 0
    let c = 0; material.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correctIndex) c++ })
    return Math.round((c / material.quiz.length) * 100)
  }

  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    const s = calculateQuizScore()
    s >= 70 ? toast.success(`Great job! You scored ${s}%`) : toast.error(`You scored ${s}%. Review the material and try again.`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* ─── Hero Header ──────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getCategoryGradient(material.category)} p-8 md:p-10 text-white`}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />

        <div className="relative">
          <button
            onClick={() => navigate('/study-materials')}
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full backdrop-blur-sm transition-all mb-5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Materials
          </button>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 leading-tight">{material.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold ${diff.color}`}>
              {diff.icon} {diff.label}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5" /> {material.duration}
            </span>
            {material.author && (
              <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                <GraduationCap className="w-3.5 h-3.5" /> {material.author}
              </span>
            )}
          </div>

          {/* Progress strip */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium opacity-80">Progress</span>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <div className="h-2.5 bg-white/15 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Area ────────────────────────────── */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="lg:order-1 order-2">
          <Card className="sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <ListChecks className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">Sections</h3>
            </div>
            <nav className="space-y-1.5">
              {material.sections.map((section, index) => {
                const done = completedSections.includes(index)
                const active = currentSection === index && !showQuiz
                return (
                  <button
                    key={index}
                    onClick={() => { setCurrentSection(index); setShowQuiz(false) }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-3 group ${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {done ? (
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    ) : active ? (
                      <CircleDot className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0" />
                    )}
                    <span className="text-sm truncate">{section.title}</span>
                  </button>
                )
              })}

              {material.quiz && (
                <>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                  <button
                    onClick={() => setShowQuiz(true)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                      showQuiz
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Star className={`w-4.5 h-4.5 shrink-0 ${showQuiz ? 'text-amber-500' : ''}`} />
                    <span className="text-sm">Knowledge Quiz</span>
                  </button>
                </>
              )}
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
              <div className="text-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/15">
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{completedSections.length}</p>
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-500">Done</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/15">
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{material.sections.length - completedSections.length}</p>
                <p className="text-[10px] font-medium text-blue-600 dark:text-blue-500">Remaining</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Panel */}
        <div className="lg:order-2 order-1">
          {!showQuiz ? (
            <Card className="relative overflow-hidden">
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(material.category)}`} />

              <div className="pt-2">
                {/* Section chip */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Section {currentSection + 1} of {material.sections.length}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-snug">
                  {material.sections[currentSection].title}
                </h2>

                {/* Rendered markdown content */}
                <div className="max-w-none">
                  {renderContent(material.sections[currentSection].content)}
                </div>

                {/* Bottom Navigation */}
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className="rounded-xl"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1.5" /> Previous
                  </Button>

                  <Button onClick={markSectionComplete} className="rounded-xl">
                    {completedSections.includes(currentSection) ? (
                      <>Next <ChevronRight className="w-4 h-4 ml-1.5" /></>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            /* ─── Quiz Panel ─────────────────────────────── */
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

              <div className="pt-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Knowledge Check</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Test what you've learned</p>
                  </div>
                </div>

                {quizSubmitted && (
                  <div className={`mb-6 p-4 rounded-xl border ${
                    calculateQuizScore() >= 70
                      ? 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      {calculateQuizScore() >= 70 ? (
                        <Award className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <RotateCcw className="w-8 h-8 text-red-500" />
                      )}
                      <div>
                        <p className={`font-bold text-lg ${calculateQuizScore() >= 70 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                          Score: {calculateQuizScore()}%
                        </p>
                        <p className={`text-sm ${calculateQuizScore() >= 70 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                          {calculateQuizScore() >= 70 ? 'Great job! You\'ve mastered this material.' : 'Review the sections above and try again.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {material.quiz.map((question, qIndex) => (
                    <div key={qIndex} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white mb-3 text-[15px]">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 mr-2">
                          {qIndex + 1}
                        </span>
                        {question.question}
                      </p>
                      <div className="space-y-2 mt-3">
                        {question.options.map((option, oIndex) => {
                          const selected = quizAnswers[qIndex] === oIndex
                          const isCorrect = oIndex === question.correctIndex
                          let cls = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                          if (quizSubmitted) {
                            if (isCorrect) cls = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                            else if (selected) cls = 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-700 text-red-800 dark:text-red-300'
                            else cls = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
                          } else if (selected) {
                            cls = 'bg-primary-50 dark:bg-primary-900/20 border-primary-400 dark:border-primary-700 ring-2 ring-primary-200 dark:ring-primary-800'
                          }
                          return (
                            <button
                              key={oIndex}
                              onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex })}
                              disabled={quizSubmitted}
                              className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${cls}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                                <span className="text-gray-800 dark:text-gray-200">{option}</span>
                                {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 ml-auto text-emerald-500 shrink-0" />}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setShowQuiz(false)} className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sections
                  </Button>
                  {!quizSubmitted ? (
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== material.quiz.length}
                      className="rounded-xl"
                    >
                      <Zap className="w-4 h-4 mr-1.5" /> Submit Quiz
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl" onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }}>
                        <RotateCcw className="w-4 h-4 mr-1.5" /> Retry
                      </Button>
                      <Button onClick={() => navigate('/study-materials')} className="rounded-xl">
                        <BookOpen className="w-4 h-4 mr-1.5" /> All Materials
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaterialContent
