/**
 * ===========================================
 * Study Material Content Page
 * ===========================================
 * 
 * Displays the detailed content of study materials.
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
  BookMarked,
  ExternalLink
} from 'lucide-react'

// Study material content database
const MATERIAL_CONTENT = {
  // DSA Materials
  1: {
    title: 'Complete Guide to Data Structures',
    category: 'dsa',
    type: 'article',
    duration: '45 min read',
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
      {
        question: 'What is the time complexity of accessing an element in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 0
      },
      {
        question: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Array', 'Stack', 'Linked List'],
        correctIndex: 2
      },
      {
        question: 'In a Binary Search Tree, where are smaller values stored?',
        options: ['Right subtree', 'Left subtree', 'Root', 'Leaf nodes only'],
        correctIndex: 1
      }
    ]
  },
  
  // System Design Material
  4: {
    title: 'System Design Interview Guide',
    category: 'system-design',
    type: 'course',
    duration: '8 hours',
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
      {
        question: 'What does CAP theorem stand for?',
        options: [
          'Cache, API, Processing',
          'Consistency, Availability, Partition tolerance',
          'Compute, Analyze, Process',
          'Connect, Authorize, Protect'
        ],
        correctIndex: 1
      },
      {
        question: 'Which is better for read-heavy workloads?',
        options: [
          'Vertical scaling only',
          'No caching',
          'Read replicas with caching',
          'Single database instance'
        ],
        correctIndex: 2
      }
    ]
  },
  
  // Behavioral Material
  7: {
    title: 'STAR Method Mastery',
    category: 'behavioral',
    type: 'article',
    duration: '20 min read',
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
      {
        question: 'What does the "A" in STAR stand for?',
        options: ['Achievement', 'Action', 'Analysis', 'Approach'],
        correctIndex: 1
      },
      {
        question: 'Which part of STAR should describe the outcome?',
        options: ['Situation', 'Task', 'Action', 'Result'],
        correctIndex: 3
      }
    ]
  }
};

const MaterialContent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  
  const material = MATERIAL_CONTENT[id]
  
  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(`material-progress-${id}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      setCompletedSections(parsed.completedSections || [])
      setCurrentSection(parsed.currentSection || 0)
    }
  }, [id])
  
  useEffect(() => {
    // Save progress
    if (material) {
      localStorage.setItem(`material-progress-${id}`, JSON.stringify({
        completedSections,
        currentSection
      }))
    }
  }, [completedSections, currentSection, id, material])
  
  if (!material) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h2>
        <p className="text-gray-600 mb-6">This study material doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/study-materials')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Materials
        </Button>
      </div>
    )
  }
  
  const markSectionComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection])
      toast.success('Section completed!')
    }
    
    if (currentSection < material.sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else if (material.quiz && !showQuiz) {
      setShowQuiz(true)
    }
  }
  
  const calculateQuizScore = () => {
    if (!material.quiz) return 0
    let correct = 0
    material.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIndex) correct++
    })
    return Math.round((correct / material.quiz.length) * 100)
  }
  
  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    const score = calculateQuizScore()
    if (score >= 70) {
      toast.success(`Great job! You scored ${score}%`)
    } else {
      toast.error(`You scored ${score}%. Review the material and try again.`)
    }
  }
  
  const progress = Math.round((completedSections.length / material.sections.length) * 100)
  
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/study-materials')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{material.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="default">{material.category.toUpperCase()}</Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {material.duration}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Progress</div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Section Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
            <nav className="space-y-2">
              {material.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSection(index)
                    setShowQuiz(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    currentSection === index && !showQuiz
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {completedSections.includes(index) ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span className="text-sm truncate">{section.title}</span>
                </button>
              ))}
              
              {material.quiz && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    showQuiz
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Star className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Quiz</span>
                </button>
              )}
            </nav>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {!showQuiz ? (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {material.sections[currentSection].title}
              </h2>
              
              <div className="prose prose-primary max-w-none">
                {material.sections[currentSection].content.split('\n').map((paragraph, i) => {
                  if (paragraph.startsWith('```')) {
                    return null // Handle code blocks separately
                  }
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <h4 key={i} className="font-bold text-gray-900 mt-4">{paragraph.replace(/\*\*/g, '')}</h4>
                  }
                  if (paragraph.startsWith('- ')) {
                    return <li key={i} className="ml-4">{paragraph.substring(2)}</li>
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return <li key={i} className="ml-4">{paragraph}</li>
                  }
                  return paragraph.trim() && <p key={i} className="text-gray-700 my-2">{paragraph}</p>
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button onClick={markSectionComplete}>
                  {completedSections.includes(currentSection) ? 'Continue' : 'Mark as Complete'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Knowledge Check</h2>
              
              <div className="space-y-6">
                {material.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-3">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => !quizSubmitted && setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                          disabled={quizSubmitted}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                            quizSubmitted
                              ? oIndex === question.correctIndex
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : quizAnswers[qIndex] === oIndex
                                  ? 'bg-red-50 border-red-500 text-red-700'
                                  : 'bg-white border-gray-200'
                              : quizAnswers[qIndex] === oIndex
                                ? 'bg-primary-50 border-primary-500'
                                : 'bg-white border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                {!quizSubmitted ? (
                  <Button 
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== material.quiz.length}
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/study-materials')}>
                    Back to Materials
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaterialContent
