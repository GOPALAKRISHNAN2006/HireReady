/**
 * ===========================================
 * Seed Data - Initial Questions and Admin User
 * ===========================================
 * 
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Question = require('../models/Question.model');
const Analytics = require('../models/Analytics.model');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview-portal');
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
    // await User.deleteMany({});
    // await Question.deleteMany({});
    // await Analytics.deleteMany({});

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@aiportal.com' });
    if (!adminExists) {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@aiportal.com',
        password: 'Admin@123',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });
      await Analytics.create({ user: admin._id });
      console.log('✅ Admin user created: admin@aiportal.com / Admin@123');
    }

    // Create sample questions
    const existingQuestions = await Question.countDocuments();
    if (existingQuestions === 0) {
      const sampleQuestions = [
        // DSA Questions
        {
          text: 'Explain the difference between an Array and a Linked List. When would you use one over the other?',
          category: 'dsa',
          difficulty: 'easy',
          type: 'conceptual',
          tags: ['arrays', 'linked-list', 'data-structures'],
          expectedAnswer: 'Arrays store elements in contiguous memory locations with O(1) random access but O(n) insertions. Linked Lists store elements non-contiguously with O(1) insertions but O(n) access. Use arrays when you need random access; use linked lists for frequent insertions/deletions.',
          keyPoints: ['Contiguous vs non-contiguous memory', 'Time complexity differences', 'Use case scenarios'],
          hints: ['Think about memory allocation', 'Consider insertion and access patterns'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'Implement a function to reverse a linked list. Explain your approach.',
          category: 'dsa',
          difficulty: 'medium',
          type: 'coding',
          tags: ['linked-list', 'pointers', 'iteration'],
          expectedAnswer: 'Iterate through the list maintaining three pointers: previous, current, and next. For each node, save next, point current to previous, move previous to current, and current to next.',
          keyPoints: ['Three pointer technique', 'Iterative approach', 'O(n) time complexity'],
          hints: ['Use three pointers', 'Be careful with null checks'],
          recommendedTimeMinutes: 10,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'Explain the concept of Dynamic Programming and when it should be used.',
          category: 'dsa',
          difficulty: 'hard',
          type: 'conceptual',
          tags: ['dynamic-programming', 'optimization', 'memoization'],
          expectedAnswer: 'Dynamic Programming is an optimization technique for problems with overlapping subproblems and optimal substructure. It stores results of subproblems to avoid redundant computations. Use when problem can be broken into smaller overlapping subproblems.',
          keyPoints: ['Overlapping subproblems', 'Optimal substructure', 'Memoization vs tabulation'],
          hints: ['Think about recursive problems', 'Consider Fibonacci as an example'],
          recommendedTimeMinutes: 7,
          isApproved: true,
          aiProvider: 'manual'
        },

        // Web Development Questions
        {
          text: 'Explain the Virtual DOM in React and why it improves performance.',
          category: 'web',
          difficulty: 'medium',
          type: 'conceptual',
          tags: ['react', 'virtual-dom', 'performance'],
          expectedAnswer: 'Virtual DOM is a lightweight JavaScript representation of the actual DOM. React creates a virtual copy, performs diffing to identify changes, and batches minimal updates to the real DOM, reducing expensive DOM operations.',
          keyPoints: ['JavaScript representation of DOM', 'Diffing algorithm', 'Batched updates'],
          hints: ['Think about DOM manipulation costs', 'Consider reconciliation process'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'What is the difference between REST and GraphQL? When would you choose one over the other?',
          category: 'web',
          difficulty: 'medium',
          type: 'conceptual',
          tags: ['rest', 'graphql', 'api'],
          expectedAnswer: 'REST uses multiple endpoints with fixed data structures. GraphQL uses a single endpoint where clients request exactly what they need. Choose REST for simple APIs with caching needs; GraphQL for complex data requirements and reducing over-fetching.',
          keyPoints: ['Single vs multiple endpoints', 'Over-fetching/under-fetching', 'Use cases'],
          hints: ['Think about data fetching patterns', 'Consider caching strategies'],
          recommendedTimeMinutes: 6,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'Explain how CORS works and why it is important for web security.',
          category: 'web',
          difficulty: 'medium',
          type: 'technical',
          tags: ['cors', 'security', 'http'],
          expectedAnswer: 'CORS (Cross-Origin Resource Sharing) is a security mechanism that restricts cross-origin HTTP requests. Browsers enforce same-origin policy; CORS allows servers to specify which origins can access resources through HTTP headers.',
          keyPoints: ['Same-origin policy', 'Preflight requests', 'CORS headers'],
          hints: ['Think about browser security', 'Consider OPTIONS requests'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        },

        // Behavioral Questions
        {
          text: 'Tell me about a time when you had to work with a difficult team member. How did you handle it?',
          category: 'behavioral',
          difficulty: 'medium',
          type: 'behavioral',
          tags: ['teamwork', 'conflict-resolution', 'communication'],
          expectedAnswer: 'Use STAR method: Describe the Situation, Task you needed to accomplish, Actions you took (active listening, finding common ground, compromising), and Results achieved.',
          keyPoints: ['STAR method', 'Specific example', 'Positive outcome', 'Lessons learned'],
          hints: ['Use STAR format', 'Focus on your actions', 'End with positive outcome'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'Describe a project where you had to learn a new technology quickly. How did you approach it?',
          category: 'behavioral',
          difficulty: 'easy',
          type: 'behavioral',
          tags: ['learning', 'adaptability', 'self-improvement'],
          expectedAnswer: 'Explain your learning strategy: researching documentation, hands-on practice, seeking help from experts, breaking down concepts, and applying knowledge through small projects.',
          keyPoints: ['Learning approach', 'Time management', 'Practical application', 'Results'],
          hints: ['Show structured learning approach', 'Demonstrate curiosity'],
          recommendedTimeMinutes: 4,
          isApproved: true,
          aiProvider: 'manual'
        },

        // System Design Questions
        {
          text: 'Design a URL shortening service like bit.ly. What are the key components?',
          category: 'system-design',
          difficulty: 'hard',
          type: 'technical',
          tags: ['system-design', 'scalability', 'database'],
          expectedAnswer: 'Key components: URL shortening algorithm (base62 encoding), database for mapping, caching layer (Redis), load balancer, API layer. Consider: custom short URLs, analytics, expiration, rate limiting.',
          keyPoints: ['Encoding algorithm', 'Database design', 'Caching strategy', 'Scalability'],
          hints: ['Start with requirements', 'Consider scale', 'Think about analytics'],
          recommendedTimeMinutes: 15,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'How would you design a real-time chat application like Slack?',
          category: 'system-design',
          difficulty: 'expert',
          type: 'technical',
          tags: ['system-design', 'real-time', 'websockets'],
          expectedAnswer: 'Components: WebSocket servers for real-time messaging, message queue (Kafka), database (relational for users, NoSQL for messages), caching, CDN for media. Consider: message delivery guarantees, presence indicators, search functionality.',
          keyPoints: ['WebSocket for real-time', 'Message persistence', 'Scalability', 'Offline handling'],
          hints: ['Think about message ordering', 'Consider offline scenarios'],
          recommendedTimeMinutes: 20,
          isApproved: true,
          aiProvider: 'manual'
        },

        // Database Questions
        {
          text: 'Explain the difference between SQL and NoSQL databases. When would you choose each?',
          category: 'database',
          difficulty: 'medium',
          type: 'conceptual',
          tags: ['sql', 'nosql', 'database-design'],
          expectedAnswer: 'SQL: structured, ACID compliant, relational, fixed schema. NoSQL: flexible schema, horizontal scaling, various data models. Use SQL for complex queries and transactions; NoSQL for high scalability and flexible data.',
          keyPoints: ['ACID vs BASE', 'Schema flexibility', 'Scaling patterns', 'Use cases'],
          hints: ['Think about data relationships', 'Consider scaling needs'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'What are database indexes? How do they improve query performance?',
          category: 'database',
          difficulty: 'medium',
          type: 'technical',
          tags: ['indexes', 'performance', 'optimization'],
          expectedAnswer: 'Indexes are data structures that improve query speed by allowing quick lookups without scanning entire tables. They use B-trees or hash structures. Trade-off: faster reads but slower writes and additional storage.',
          keyPoints: ['B-tree structure', 'Query optimization', 'Trade-offs', 'When to use'],
          hints: ['Think about book indexes', 'Consider write performance impact'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        },

        // Machine Learning Questions
        {
          text: 'Explain the difference between supervised and unsupervised learning with examples.',
          category: 'ml',
          difficulty: 'easy',
          type: 'conceptual',
          tags: ['machine-learning', 'supervised', 'unsupervised'],
          expectedAnswer: 'Supervised: learns from labeled data (classification, regression). Examples: spam detection, price prediction. Unsupervised: finds patterns in unlabeled data (clustering, dimensionality reduction). Examples: customer segmentation, anomaly detection.',
          keyPoints: ['Labeled vs unlabeled data', 'Common algorithms', 'Use cases'],
          hints: ['Think about training data', 'Consider output types'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        },
        {
          text: 'What is overfitting and how can you prevent it?',
          category: 'ml',
          difficulty: 'medium',
          type: 'technical',
          tags: ['machine-learning', 'overfitting', 'regularization'],
          expectedAnswer: 'Overfitting occurs when a model learns training data too well, including noise, failing to generalize. Prevention: cross-validation, regularization (L1/L2), dropout, early stopping, more training data, simpler models.',
          keyPoints: ['Definition', 'Symptoms', 'Prevention techniques', 'Validation strategies'],
          hints: ['Think about train vs test performance', 'Consider model complexity'],
          recommendedTimeMinutes: 5,
          isApproved: true,
          aiProvider: 'manual'
        }
      ];

      await Question.insertMany(sampleQuestions);
      console.log(`✅ ${sampleQuestions.length} sample questions created`);
    }

    console.log('✅ Seed data complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
