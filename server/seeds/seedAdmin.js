/**
 * ===========================================
 * Admin Seed Data Script
 * ===========================================
 * 
 * Seeds the database with:
 * - Admin and moderator users
 * - Sample interview questions
 * - Sample interviews with responses
 * 
 * Usage: node seeds/seedAdmin.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('../config/database')

// Import models
const User = require('../models/User.model')
const Question = require('../models/Question.model')
const Interview = require('../models/Interview.model')

// Sample admin users
const adminUsers = [
  {
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@interviewportal.com',
    password: 'Admin@123456',
    role: 'admin',
    isEmailVerified: true,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    firstName: 'Jane',
    lastName: 'Moderator',
    email: 'moderator@interviewportal.com',
    password: 'Mod@123456',
    role: 'moderator',
    isEmailVerified: true,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
  },
  {
    firstName: 'John',
    lastName: 'Developer',
    email: 'john@example.com',
    password: 'User@123456',
    role: 'user',
    isEmailVerified: true,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    firstName: 'Sarah',
    lastName: 'Engineer',
    email: 'sarah@example.com',
    password: 'User@123456',
    role: 'user',
    isEmailVerified: true,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    firstName: 'Mike',
    lastName: 'Student',
    email: 'mike@example.com',
    password: 'User@123456',
    role: 'user',
    isEmailVerified: true,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  }
]

// Sample questions
const sampleQuestions = [
  // DSA Questions
  {
    text: 'Explain the difference between Array and LinkedList. When would you use one over the other?',
    category: 'dsa',
    difficulty: 'easy',
    type: 'technical',
    expectedAnswer: 'Arrays offer O(1) random access but O(n) insertion/deletion. LinkedLists offer O(1) insertion/deletion but O(n) access. Use arrays for frequent access, linked lists for frequent modifications.',
    hints: ['Think about memory layout', 'Consider time complexity of operations'],
    tags: ['data-structures', 'arrays', 'linked-list', 'fundamentals'],
    keyPoints: ['Memory allocation', 'Time complexity', 'Use cases'],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true
  },
  {
    text: 'What is the time complexity of QuickSort? Explain the best, average, and worst cases.',
    category: 'dsa',
    difficulty: 'medium',
    type: 'technical',
    expectedAnswer: 'Best/Average: O(n log n), Worst: O(n²) when pivot selection is poor. Randomized pivot selection can help avoid worst case.',
    hints: ['Consider pivot selection', 'Think about already sorted arrays'],
    tags: ['sorting', 'algorithms', 'time-complexity'],
    keyPoints: ['Pivot selection strategy', 'Partition algorithm', 'Space complexity O(log n)'],
    recommendedTimeMinutes: 8,
    isApproved: true,
    isActive: true
  },
  {
    text: 'Implement a function to detect a cycle in a linked list. Explain your approach.',
    category: 'dsa',
    difficulty: 'medium',
    type: 'coding',
    expectedAnswer: 'Use Floyd\'s Cycle Detection (tortoise and hare). Two pointers, one moves 2x speed. If they meet, there\'s a cycle.',
    hints: ['Two pointer technique', 'Different speeds'],
    tags: ['linked-list', 'two-pointers', 'cycle-detection'],
    keyPoints: ['Floyd\'s algorithm', 'O(1) space', 'O(n) time'],
    recommendedTimeMinutes: 10,
    isApproved: true,
    isActive: true
  },
  {
    text: 'Explain dynamic programming. Solve the Fibonacci sequence using DP.',
    category: 'dsa',
    difficulty: 'hard',
    type: 'coding',
    expectedAnswer: 'DP breaks problems into overlapping subproblems with optimal substructure. Fibonacci: use memoization or tabulation to achieve O(n) time vs O(2^n) recursive.',
    hints: ['Think about overlapping subproblems', 'Memoization vs Tabulation'],
    tags: ['dynamic-programming', 'fibonacci', 'optimization'],
    keyPoints: ['Memoization', 'Tabulation', 'State transition'],
    recommendedTimeMinutes: 15,
    isApproved: true,
    isActive: true
  },

  // Web Development Questions
  {
    text: 'Explain the difference between REST and GraphQL. When would you choose one over the other?',
    category: 'web',
    difficulty: 'medium',
    type: 'conceptual',
    expectedAnswer: 'REST uses multiple endpoints with fixed data structures. GraphQL uses single endpoint with flexible queries. GraphQL for complex data needs, REST for simpler APIs.',
    hints: ['Consider over-fetching', 'Think about endpoint management'],
    tags: ['api', 'rest', 'graphql', 'web-services'],
    keyPoints: ['Over/under fetching', 'Type system', 'Versioning'],
    recommendedTimeMinutes: 8,
    isApproved: true,
    isActive: true
  },
  {
    text: 'What is the Virtual DOM in React? How does it improve performance?',
    category: 'web',
    difficulty: 'easy',
    type: 'technical',
    expectedAnswer: 'Virtual DOM is a lightweight copy of the real DOM. React compares changes (diffing) and updates only what changed (reconciliation), minimizing expensive DOM operations.',
    hints: ['Think about DOM manipulation cost', 'Batch updates'],
    tags: ['react', 'virtual-dom', 'performance', 'frontend'],
    keyPoints: ['Diffing algorithm', 'Reconciliation', 'Batch updates'],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true
  },
  {
    text: 'Explain the concept of closures in JavaScript with an example.',
    category: 'web',
    difficulty: 'medium',
    type: 'technical',
    expectedAnswer: 'A closure is a function that remembers variables from its outer scope even after the outer function returns. Used for data privacy, callbacks, and maintaining state.',
    hints: ['Lexical scope', 'Function factories'],
    tags: ['javascript', 'closures', 'scope', 'fundamentals'],
    keyPoints: ['Lexical environment', 'Private variables', 'Memory considerations'],
    recommendedTimeMinutes: 8,
    isApproved: true,
    isActive: true
  },

  // System Design Questions
  {
    text: 'Design a URL shortening service like bit.ly. Discuss the architecture and database schema.',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    expectedAnswer: 'Use base62 encoding for short URLs, NoSQL for high write throughput, caching layer (Redis) for popular URLs, load balancer for distribution.',
    hints: ['Consider scale', 'Think about collision handling'],
    tags: ['system-design', 'url-shortener', 'scalability'],
    keyPoints: ['Encoding algorithm', 'Database choice', 'Caching strategy', 'Analytics'],
    recommendedTimeMinutes: 20,
    isApproved: true,
    isActive: true
  },
  {
    text: 'How would you design a rate limiter? What algorithms would you consider?',
    category: 'system-design',
    difficulty: 'hard',
    type: 'technical',
    expectedAnswer: 'Algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window. Consider distributed systems using Redis. Handle edge cases and configure per-user limits.',
    hints: ['Token bucket vs Leaky bucket', 'Distributed rate limiting'],
    tags: ['system-design', 'rate-limiting', 'api-design'],
    keyPoints: ['Algorithm tradeoffs', 'Distributed implementation', 'Configuration'],
    recommendedTimeMinutes: 15,
    isApproved: true,
    isActive: true
  },

  // Behavioral Questions
  {
    text: 'Tell me about a time when you had to deal with a difficult team member. How did you handle it?',
    category: 'behavioral',
    difficulty: 'medium',
    type: 'behavioral',
    expectedAnswer: 'Use STAR method. Show empathy, communication skills, conflict resolution. Focus on professional outcome and lessons learned.',
    hints: ['Use STAR format', 'Focus on resolution'],
    tags: ['behavioral', 'teamwork', 'conflict-resolution'],
    keyPoints: ['Situation clarity', 'Actions taken', 'Positive outcome', 'Learning'],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true
  },
  {
    text: 'Describe a project you\'re most proud of. What was your role and what challenges did you face?',
    category: 'behavioral',
    difficulty: 'easy',
    type: 'behavioral',
    expectedAnswer: 'Should demonstrate technical skills, problem-solving, ownership, and impact. Include metrics if possible.',
    hints: ['Quantify impact', 'Highlight technical decisions'],
    tags: ['behavioral', 'experience', 'projects'],
    keyPoints: ['Role clarity', 'Technical challenges', 'Impact/results'],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true
  },

  // Database Questions
  {
    text: 'Explain the difference between SQL and NoSQL databases. Give examples of when to use each.',
    category: 'database',
    difficulty: 'easy',
    type: 'conceptual',
    expectedAnswer: 'SQL: structured data, ACID compliance, complex queries (MySQL, PostgreSQL). NoSQL: flexible schema, horizontal scaling, high throughput (MongoDB, Cassandra).',
    hints: ['Think about data relationships', 'Consider scaling patterns'],
    tags: ['database', 'sql', 'nosql', 'data-modeling'],
    keyPoints: ['ACID vs BASE', 'Schema flexibility', 'Scaling patterns'],
    recommendedTimeMinutes: 5,
    isApproved: true,
    isActive: true
  },
  {
    text: 'What are database indexes? How do they improve query performance? What are the trade-offs?',
    category: 'database',
    difficulty: 'medium',
    type: 'technical',
    expectedAnswer: 'Indexes are data structures (B-trees usually) that speed up lookups. Trade-offs: slower writes, storage overhead. Choose based on query patterns.',
    hints: ['B-tree structure', 'Write performance impact'],
    tags: ['database', 'indexing', 'performance', 'optimization'],
    keyPoints: ['Index types', 'Query optimization', 'Maintenance overhead'],
    recommendedTimeMinutes: 8,
    isApproved: true,
    isActive: true
  },

  // ML Questions
  {
    text: 'Explain the bias-variance tradeoff in machine learning.',
    category: 'ml',
    difficulty: 'medium',
    type: 'conceptual',
    expectedAnswer: 'Bias: error from oversimplified assumptions (underfitting). Variance: error from sensitivity to training data (overfitting). Goal: find optimal balance.',
    hints: ['Think about model complexity', 'Training vs test error'],
    tags: ['machine-learning', 'bias-variance', 'model-selection'],
    keyPoints: ['Underfitting', 'Overfitting', 'Model complexity', 'Cross-validation'],
    recommendedTimeMinutes: 8,
    isApproved: true,
    isActive: true
  },
  {
    text: 'What is gradient descent? Explain different variants and when to use them.',
    category: 'ml',
    difficulty: 'medium',
    type: 'technical',
    expectedAnswer: 'Optimization algorithm to minimize loss. Variants: Batch (full dataset), Stochastic (single sample), Mini-batch (subset). Adam, RMSprop for adaptive learning rates.',
    hints: ['Learning rate importance', 'Convergence speed'],
    tags: ['machine-learning', 'optimization', 'gradient-descent'],
    keyPoints: ['Learning rate', 'Convergence', 'Computational cost', 'Local minima'],
    recommendedTimeMinutes: 10,
    isApproved: true,
    isActive: true
  }
]

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB()
    console.log('🔌 Connected to MongoDB')

    // Clear existing data (optional - comment out in production)
    console.log('🧹 Clearing existing seed data...')
    await User.deleteMany({ email: { $in: adminUsers.map(u => u.email) } })
    
    // Create users
    console.log('👥 Creating users...')
    const createdUsers = []
    for (const userData of adminUsers) {
      // Don't hash password here - User model's pre-save middleware handles it
      const user = await User.create(userData)
      createdUsers.push(user)
      console.log(`   ✓ Created ${userData.role}: ${userData.email}`)
    }

    // Create questions
    console.log('❓ Creating sample questions...')
    const existingQuestions = await Question.countDocuments()
    if (existingQuestions < 10) {
      const createdQuestions = await Question.insertMany(
        sampleQuestions.map(q => ({
          ...q,
          createdBy: createdUsers[0]._id // Admin user
        }))
      )
      console.log(`   ✓ Created ${createdQuestions.length} questions`)
    } else {
      console.log(`   ⏭ Skipping questions (${existingQuestions} already exist)`)
    }

    // Create sample interviews for regular users
    console.log('🎤 Creating sample interviews...')
    const regularUsers = createdUsers.filter(u => u.role === 'user')
    const questions = await Question.find().limit(5)
    
    if (questions.length > 0) {
      for (const user of regularUsers) {
        // Create 2-3 interviews per user
        const numInterviews = Math.floor(Math.random() * 2) + 2
        
        for (let i = 0; i < numInterviews; i++) {
          const selectedQuestions = questions.slice(0, Math.floor(Math.random() * 3) + 2)
          const overallScore = Math.floor(Math.random() * 40) + 60 // 60-100
          
          await Interview.create({
            user: user._id,
            category: ['dsa', 'web', 'system-design', 'behavioral'][Math.floor(Math.random() * 4)],
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            status: 'completed',
            totalQuestions: selectedQuestions.length,
            questionsAnswered: selectedQuestions.length,
            overallScore,
            responses: selectedQuestions.map(q => ({
              question: q._id,
              questionText: q.text,
              answer: 'Sample answer for the question demonstrating understanding of the concept.',
              evaluation: {
                overallScore: Math.floor(Math.random() * 30) + 70,
                relevanceScore: Math.floor(Math.random() * 20) + 80,
                completenessScore: Math.floor(Math.random() * 25) + 75,
                clarityScore: Math.floor(Math.random() * 20) + 80,
                technicalAccuracyScore: Math.floor(Math.random() * 30) + 70
              },
              isEvaluated: true
            })),
            insights: {
              overallFeedback: 'Overall solid performance. Continue practicing data structures and system design concepts.',
              strengths: ['Clear communication', 'Good problem breakdown'],
              areasToImprove: ['Could provide more examples', 'Time management']
            },
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
          })
        }
        console.log(`   ✓ Created ${numInterviews} interviews for ${user.firstName} ${user.lastName}`)
      }
    } else {
      console.log('   ⏭ Skipping interviews (no questions available)')
    }

    console.log('\n✅ Database seeding completed successfully!')
    console.log('\n📝 Login Credentials:')
    console.log('   Admin:     admin@interviewportal.com / Admin@123456')
    console.log('   Moderator: moderator@interviewportal.com / Mod@123456')
    console.log('   User:      john@example.com / User@123456')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seed
seedDatabase()
