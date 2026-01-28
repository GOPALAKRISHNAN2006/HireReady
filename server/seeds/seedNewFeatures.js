/**
 * ===========================================
 * Seed Data for New Features
 * ===========================================
 * 
 * Seeds sample data for Daily Challenges, Career Paths, 
 * Interview Tips, and Skill Categories.
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('../config/database');

const { DailyChallenge } = require('../models/DailyChallenge.model');
const { CareerPath } = require('../models/Career.model');
const { SkillCategory } = require('../models/Skill.model');
const { InterviewTip } = require('../models/Tip.model');
const { Discussion, CommunityPost, Mentor } = require('../models/Community.model');

// Sample Daily Challenges
const challenges = [
  {
    title: 'Two Sum Problem',
    description: 'Find two numbers in an array that add up to a target sum',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 20,
    question: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    hints: [
      'Think about using a hash map to store values',
      'You can solve this in O(n) time complexity',
      'Consider what you need to find for each number'
    ],
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0, 1]',
    tags: ['array', 'hash-map', 'two-pointers'],
    activeDate: new Date(),
    isActive: true
  },
  {
    title: 'Valid Parentheses',
    description: 'Check if a string of brackets is valid',
    category: 'coding',
    difficulty: 'easy',
    points: 100,
    timeLimit: 15,
    question: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example:
Input: s = "()"
Output: true

Input: s = "([)]"
Output: false`,
    hints: [
      'Use a stack data structure',
      'Push opening brackets onto the stack',
      'For closing brackets, check if it matches the top of stack'
    ],
    solution: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    tags: ['stack', 'string'],
    activeDate: new Date(Date.now() + 86400000),
    isActive: true
  },
  {
    title: 'Design a Rate Limiter',
    description: 'System design challenge for API rate limiting',
    category: 'system-design',
    difficulty: 'medium',
    points: 200,
    timeLimit: 45,
    question: `Design a rate limiter that can be used to limit the number of API requests from a user within a given time window.

Requirements:
1. Should support configurable rate limits
2. Must handle high traffic efficiently
3. Should be distributed-system friendly

Discuss:
- Algorithms (Token bucket, Leaky bucket, Fixed window, Sliding window)
- Data structures to use
- How to handle distributed systems
- Trade-offs of different approaches`,
    hints: [
      'Consider using Redis for distributed rate limiting',
      'Think about the trade-offs between accuracy and performance',
      'Consider race conditions in distributed systems'
    ],
    tags: ['system-design', 'distributed-systems', 'api'],
    activeDate: new Date(Date.now() + 172800000),
    isActive: true
  },
  {
    title: 'Tell Me About Yourself',
    description: 'Practice the most common behavioral interview question',
    category: 'behavioral',
    difficulty: 'easy',
    points: 100,
    timeLimit: 10,
    question: `Practice answering "Tell me about yourself" - the most common interview opening question.

Guidelines:
1. Keep it professional and relevant
2. Follow the Present-Past-Future formula
3. Highlight key achievements
4. Connect your experience to the role

Write a 2-3 minute response for your target role.`,
    hints: [
      'Start with your current role and key responsibilities',
      'Mention 2-3 relevant past experiences',
      'End with why you\'re excited about this opportunity'
    ],
    tags: ['behavioral', 'introduction', 'soft-skills'],
    activeDate: new Date(Date.now() + 259200000),
    isActive: true
  }
];

// Sample Career Paths
const careerPaths = [
  {
    name: 'Frontend Developer',
    description: 'Build beautiful, responsive user interfaces',
    icon: '🎨',
    color: '#3B82F6',
    estimatedDuration: '6-9 months',
    salaryRange: { min: 60000, max: 150000, currency: 'USD' },
    demandLevel: 'very-high',
    milestones: [
      {
        order: 1,
        title: 'HTML & CSS Fundamentals',
        description: 'Master the building blocks of the web',
        skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid'],
        estimatedTime: '2-4 weeks',
        isRequired: true
      },
      {
        order: 2,
        title: 'JavaScript Mastery',
        description: 'Learn modern JavaScript ES6+',
        skills: ['JavaScript', 'ES6+', 'DOM Manipulation', 'Async/Await'],
        estimatedTime: '4-6 weeks',
        isRequired: true
      },
      {
        order: 3,
        title: 'React Fundamentals',
        description: 'Build applications with React',
        skills: ['React', 'JSX', 'Hooks', 'State Management'],
        estimatedTime: '4-6 weeks',
        isRequired: true
      },
      {
        order: 4,
        title: 'Advanced React Patterns',
        description: 'Master advanced React concepts',
        skills: ['Context API', 'Redux/Zustand', 'React Query', 'Testing'],
        estimatedTime: '3-4 weeks',
        isRequired: true
      },
      {
        order: 5,
        title: 'Build Portfolio Projects',
        description: 'Create impressive projects to showcase',
        skills: ['Project Planning', 'Git', 'Deployment', 'Performance'],
        estimatedTime: '4-8 weeks',
        isRequired: true
      }
    ],
    prerequisites: ['Basic computer skills', 'Problem-solving mindset']
  },
  {
    name: 'Backend Developer',
    description: 'Build scalable server-side applications',
    icon: '⚙️',
    color: '#10B981',
    estimatedDuration: '8-12 months',
    salaryRange: { min: 70000, max: 180000, currency: 'USD' },
    demandLevel: 'very-high',
    milestones: [
      {
        order: 1,
        title: 'Programming Fundamentals',
        description: 'Master a backend programming language',
        skills: ['Node.js/Python/Java', 'Data Structures', 'Algorithms'],
        estimatedTime: '6-8 weeks',
        isRequired: true
      },
      {
        order: 2,
        title: 'Databases',
        description: 'Learn SQL and NoSQL databases',
        skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Database Design'],
        estimatedTime: '4-6 weeks',
        isRequired: true
      },
      {
        order: 3,
        title: 'API Development',
        description: 'Build RESTful and GraphQL APIs',
        skills: ['REST APIs', 'GraphQL', 'Authentication', 'Authorization'],
        estimatedTime: '4-6 weeks',
        isRequired: true
      },
      {
        order: 4,
        title: 'System Design',
        description: 'Design scalable systems',
        skills: ['Microservices', 'Message Queues', 'Caching', 'Load Balancing'],
        estimatedTime: '6-8 weeks',
        isRequired: true
      }
    ],
    prerequisites: ['Basic programming knowledge', 'Understanding of web concepts']
  },
  {
    name: 'Full Stack Developer',
    description: 'Master both frontend and backend development',
    icon: '🚀',
    color: '#8B5CF6',
    estimatedDuration: '12-18 months',
    salaryRange: { min: 80000, max: 200000, currency: 'USD' },
    demandLevel: 'very-high',
    milestones: [
      {
        order: 1,
        title: 'Frontend Foundation',
        description: 'Build strong frontend skills',
        skills: ['HTML', 'CSS', 'JavaScript', 'React/Vue'],
        estimatedTime: '8-12 weeks',
        isRequired: true
      },
      {
        order: 2,
        title: 'Backend Foundation',
        description: 'Build strong backend skills',
        skills: ['Node.js', 'Express', 'Databases', 'APIs'],
        estimatedTime: '8-12 weeks',
        isRequired: true
      },
      {
        order: 3,
        title: 'DevOps Basics',
        description: 'Learn deployment and CI/CD',
        skills: ['Docker', 'CI/CD', 'Cloud Platforms', 'Monitoring'],
        estimatedTime: '4-6 weeks',
        isRequired: true
      },
      {
        order: 4,
        title: 'Full Stack Projects',
        description: 'Build complete applications',
        skills: ['Project Management', 'End-to-End Testing', 'Performance'],
        estimatedTime: '8-12 weeks',
        isRequired: true
      }
    ],
    prerequisites: ['Dedication to learn', 'Problem-solving skills']
  },
  {
    name: 'Data Scientist',
    description: 'Extract insights from data using ML',
    icon: '📊',
    color: '#F59E0B',
    estimatedDuration: '9-15 months',
    salaryRange: { min: 90000, max: 200000, currency: 'USD' },
    demandLevel: 'high',
    milestones: [
      {
        order: 1,
        title: 'Python & Statistics',
        description: 'Foundation in Python and stats',
        skills: ['Python', 'NumPy', 'Pandas', 'Statistics'],
        estimatedTime: '6-8 weeks',
        isRequired: true
      },
      {
        order: 2,
        title: 'Machine Learning',
        description: 'Learn ML algorithms and frameworks',
        skills: ['Scikit-learn', 'TensorFlow', 'ML Algorithms'],
        estimatedTime: '8-12 weeks',
        isRequired: true
      },
      {
        order: 3,
        title: 'Data Visualization',
        description: 'Communicate insights effectively',
        skills: ['Matplotlib', 'Seaborn', 'Tableau', 'Storytelling'],
        estimatedTime: '4-6 weeks',
        isRequired: true
      }
    ],
    prerequisites: ['Math background helpful', 'Analytical thinking']
  }
];

// Sample Skill Categories
const skillCategories = [
  {
    name: 'data-structures',
    displayName: 'Data Structures',
    description: 'Arrays, linked lists, trees, graphs, and more',
    icon: '🏗️',
    color: '#3B82F6',
    subSkills: [
      { name: 'Arrays', weight: 1 },
      { name: 'Linked Lists', weight: 1 },
      { name: 'Trees', weight: 1.5 },
      { name: 'Graphs', weight: 1.5 },
      { name: 'Hash Tables', weight: 1 }
    ]
  },
  {
    name: 'algorithms',
    displayName: 'Algorithms',
    description: 'Sorting, searching, dynamic programming',
    icon: '⚡',
    color: '#10B981',
    subSkills: [
      { name: 'Sorting', weight: 1 },
      { name: 'Searching', weight: 1 },
      { name: 'Dynamic Programming', weight: 2 },
      { name: 'Recursion', weight: 1 },
      { name: 'Greedy', weight: 1 }
    ]
  },
  {
    name: 'system-design',
    displayName: 'System Design',
    description: 'Designing scalable distributed systems',
    icon: '🏢',
    color: '#8B5CF6',
    subSkills: [
      { name: 'Scalability', weight: 1.5 },
      { name: 'Database Design', weight: 1 },
      { name: 'Caching', weight: 1 },
      { name: 'Load Balancing', weight: 1 },
      { name: 'Microservices', weight: 1.5 }
    ]
  },
  {
    name: 'problem-solving',
    displayName: 'Problem Solving',
    description: 'Breaking down complex problems',
    icon: '🧩',
    color: '#F59E0B',
    subSkills: [
      { name: 'Analysis', weight: 1 },
      { name: 'Pattern Recognition', weight: 1.5 },
      { name: 'Optimization', weight: 1 },
      { name: 'Edge Cases', weight: 1 }
    ]
  },
  {
    name: 'communication',
    displayName: 'Communication',
    description: 'Explaining your thought process',
    icon: '💬',
    color: '#EC4899',
    subSkills: [
      { name: 'Clarity', weight: 1 },
      { name: 'Technical Explanation', weight: 1.5 },
      { name: 'Active Listening', weight: 1 },
      { name: 'Questions', weight: 1 }
    ]
  },
  {
    name: 'behavioral',
    displayName: 'Behavioral',
    description: 'STAR method and soft skills',
    icon: '🤝',
    color: '#6366F1',
    subSkills: [
      { name: 'STAR Method', weight: 1.5 },
      { name: 'Leadership', weight: 1 },
      { name: 'Teamwork', weight: 1 },
      { name: 'Conflict Resolution', weight: 1 }
    ]
  }
];

// Sample Interview Tips
const tips = [
  {
    title: 'Master the STAR Method',
    content: `The STAR method is your secret weapon for behavioral interviews. Here's how to use it effectively:

**Situation**: Set the scene. Describe the context briefly.
**Task**: Explain your responsibility or challenge.
**Action**: Detail the specific steps YOU took.
**Result**: Share the outcomes with metrics when possible.

Pro tips:
- Prepare 5-7 stories that can be adapted
- Always quantify results when possible
- Practice out loud to improve fluency
- Keep responses to 2-3 minutes`,
    summary: 'Structure your behavioral answers using Situation, Task, Action, Result',
    category: 'behavioral',
    tags: ['star-method', 'behavioral', 'storytelling'],
    difficulty: 'beginner',
    isFeatured: true
  },
  {
    title: 'Think Out Loud During Technical Interviews',
    content: `Interviewers want to understand your thought process, not just see the solution. Here's how to think out loud effectively:

1. **Clarify the problem**: Ask questions about edge cases and constraints
2. **Brainstorm approaches**: Discuss multiple solutions before coding
3. **Explain trade-offs**: Compare time and space complexity
4. **Narrate as you code**: Explain each step as you implement
5. **Test your solution**: Walk through examples

Remember: A partial solution with great communication beats a perfect silent solution.`,
    summary: 'Verbalize your thought process to show problem-solving skills',
    category: 'technical',
    tags: ['communication', 'coding', 'problem-solving'],
    difficulty: 'intermediate',
    isFeatured: true
  },
  {
    title: 'Research the Company Thoroughly',
    content: `Going beyond the "About Us" page can set you apart:

**What to research:**
- Recent news and press releases
- Company values and culture
- Products and services
- Competitors and market position
- Glassdoor reviews and interview experiences
- LinkedIn profiles of your interviewers
- Recent blog posts or tech talks

**How to use this knowledge:**
- Tailor your examples to their industry
- Ask informed questions
- Show genuine interest in their challenges
- Connect your experience to their needs`,
    summary: 'Deep company research helps you stand out and ask better questions',
    category: 'preparation',
    tags: ['research', 'preparation', 'company-culture'],
    difficulty: 'beginner',
    isFeatured: true
  },
  {
    title: 'Handle "I Don\'t Know" Gracefully',
    content: `It's okay not to know everything. Here's how to handle knowledge gaps:

**DO:**
- Be honest: "I haven't worked with X, but here's what I do know..."
- Show learning ability: "I'd approach learning this by..."
- Relate to similar experiences: "I've used Y which is similar..."
- Ask clarifying questions to buy thinking time

**DON'T:**
- Pretend to know something you don't
- Give up immediately
- Get defensive or flustered

Interviewers appreciate humility and intellectual curiosity.`,
    summary: 'Turn knowledge gaps into opportunities to show learning ability',
    category: 'communication',
    tags: ['honesty', 'soft-skills', 'adaptability'],
    difficulty: 'intermediate'
  },
  {
    title: 'Salary Negotiation Tips',
    content: `Negotiating can feel uncomfortable, but it's expected. Here's how to do it well:

**Before the negotiation:**
- Research market rates (Levels.fyi, Glassdoor)
- Know your minimum and target numbers
- Consider total compensation (base, bonus, equity, benefits)

**During negotiation:**
- Let them make the first offer if possible
- Express enthusiasm before negotiating
- Use ranges, not specific numbers
- Negotiate holistically (start date, remote work, etc.)
- Get offers in writing

**Key phrase:** "I'm excited about this opportunity. Based on my research and experience, I was expecting something closer to [range]."`,
    summary: 'Research, prepare, and negotiate the full compensation package',
    category: 'negotiation',
    tags: ['salary', 'compensation', 'negotiation'],
    difficulty: 'advanced',
    isFeatured: true
  },
  {
    title: 'Virtual Interview Best Practices',
    content: `Remote interviews have unique challenges. Set yourself up for success:

**Technical setup:**
- Test your camera, mic, and internet beforehand
- Have a backup plan (phone hotspot, phone number)
- Use headphones to reduce echo
- Close unnecessary applications

**Environment:**
- Choose a quiet, well-lit space
- Position camera at eye level
- Have a clean, professional background
- Keep water nearby

**During the interview:**
- Look at the camera, not the screen
- Nod and use verbal acknowledgments
- Have notes visible but don't read from them
- Dress professionally (at least from waist up!)`,
    summary: 'Technical prep and environment setup for virtual interview success',
    category: 'remote',
    tags: ['remote', 'video-interview', 'technical-setup'],
    difficulty: 'beginner'
  }
];

// Sample Discussions
const discussions = [
  {
    title: 'Interview Preparation',
    description: 'Tips and strategies for interview prep',
    category: 'interview-prep',
    icon: '📝',
    color: '#3B82F6',
    isActive: true
  },
  {
    title: 'Coding Challenges',
    description: 'Discuss LeetCode, algorithms, and problem-solving',
    category: 'coding',
    icon: '💻',
    color: '#10B981',
    isActive: true
  },
  {
    title: 'System Design',
    description: 'Architecture and design discussions',
    category: 'system-design',
    icon: '🏗️',
    color: '#8B5CF6',
    isActive: true
  },
  {
    title: 'Career Advice',
    description: 'Career growth and job search tips',
    category: 'career',
    icon: '🚀',
    color: '#F59E0B',
    isActive: true
  },
  {
    title: 'Success Stories',
    description: 'Share your interview wins!',
    category: 'general',
    icon: '🎉',
    color: '#EC4899',
    isActive: true
  }
];

// Sample Community Posts (will be associated with users later)
const samplePosts = [
  {
    title: 'Just cleared my Meta L5 interview!',
    content: "Just cleared my Meta L5 interview! 🎉 The system design round was tough but practicing here really helped. Ask me anything about the process! The key was to practice distributed systems concepts and always communicate my thought process.",
    type: 'success-story',
    category: 'interview-prep',
    tags: ['success', 'meta', 'system-design'],
    views: 1234,
    isPinned: false,
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Pro tip for behavioral interviews',
    content: "Pro tip for behavioral interviews: Always have 3-4 solid stories from your experience that can be adapted to different questions. I use the same project story for 'biggest challenge', 'failure', and 'leadership' questions with different angles. The STAR method is essential!",
    type: 'tip',
    category: 'behavioral',
    tags: ['tips', 'behavioral', 'star-method'],
    views: 890,
    isPinned: false,
    isApproved: true
  },
  {
    title: 'System Design Study Group - Looking for Members',
    content: "Created a study group for system design interviews. We meet every Saturday for 2 hours to practice. Currently 8 members, looking for 2 more. We cover topics like distributed systems, database design, and scalability patterns. DM if interested! 📚",
    type: 'discussion',
    category: 'system-design',
    tags: ['study-group', 'system-design', 'collaboration'],
    views: 567,
    isPinned: true,
    isApproved: true
  },
  {
    title: 'How I prepared for Google interviews in 3 months',
    content: "Here's my 3-month preparation journey for Google: Month 1 - LeetCode fundamentals (arrays, strings, trees). Month 2 - Advanced topics (DP, graphs, system design). Month 3 - Mock interviews and revision. I did 2-3 problems daily and practiced explaining my solutions out loud.",
    type: 'experience',
    category: 'interview-prep',
    tags: ['google', 'preparation', 'leetcode'],
    views: 2345,
    isPinned: false,
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Common mistakes in coding interviews',
    content: "After 50+ interviews, here are the most common mistakes I see: 1) Jumping to code without clarifying requirements 2) Not considering edge cases 3) Poor variable naming 4) Not testing the solution 5) Panic when stuck instead of communicating. Avoid these and you'll stand out!",
    type: 'tip',
    category: 'coding',
    tags: ['coding', 'mistakes', 'advice'],
    views: 1567,
    isPinned: false,
    isApproved: true
  }
];

// Main seed function
async function seedNewFeatures() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await DailyChallenge.deleteMany({});
    await CareerPath.deleteMany({});
    await SkillCategory.deleteMany({});
    await InterviewTip.deleteMany({});
    await Discussion.deleteMany({});
    await CommunityPost.deleteMany({});

    // Seed challenges
    console.log('Seeding daily challenges...');
    await DailyChallenge.insertMany(challenges);
    console.log(`✅ Seeded ${challenges.length} daily challenges`);

    // Seed career paths
    console.log('Seeding career paths...');
    const createdPaths = await CareerPath.insertMany(careerPaths);
    // Update totalMilestones
    for (const path of createdPaths) {
      path.totalMilestones = path.milestones.length;
      await path.save();
    }
    console.log(`✅ Seeded ${careerPaths.length} career paths`);

    // Seed skill categories
    console.log('Seeding skill categories...');
    await SkillCategory.insertMany(skillCategories);
    console.log(`✅ Seeded ${skillCategories.length} skill categories`);

    // Seed interview tips
    console.log('Seeding interview tips...');
    await InterviewTip.insertMany(tips);
    console.log(`✅ Seeded ${tips.length} interview tips`);

    // Seed discussions
    console.log('Seeding discussions...');
    await Discussion.insertMany(discussions);
    console.log(`✅ Seeded ${discussions.length} discussions`);

    // Seed community posts (without author - will work with anonymous posts)
    console.log('Seeding community posts...');
    // Get any existing user to associate posts with, or create posts without author
    const User = require('../models/User.model');
    let sampleUser = await User.findOne();
    
    const postsWithAuthor = samplePosts.map(post => ({
      ...post,
      author: sampleUser?._id // May be undefined, which is okay
    }));
    
    // Only seed posts if we have a user, otherwise skip
    if (sampleUser) {
      await CommunityPost.insertMany(postsWithAuthor);
      console.log(`✅ Seeded ${samplePosts.length} community posts`);
    } else {
      console.log(`⚠️ Skipped community posts (no users found - run seedAdmin.js first)`);
    }

    console.log('\n✨ All new feature data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedNewFeatures();
}

module.exports = seedNewFeatures;
