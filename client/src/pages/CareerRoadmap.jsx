import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Button, Badge } from '../components/ui'
import { LoadingCard } from '../components/ui/Spinner'
import { careerApi } from '../services/featureApi'
import toast from 'react-hot-toast'
import { 
  Map, 
  Target, 
  CheckCircle, 
  Circle, 
  Lock,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Code2,
  Building2,
  Rocket,
  Star,
  ChevronRight,
  ArrowRight,
  Zap,
  Trophy,
  Flag,
  MapPin,
  X,
  PlayCircle,
  FileText,
  Link2,
  Video,
  ExternalLink,
  Clock,
  GraduationCap
} from 'lucide-react'

// Study Materials Modal Component
const StudyMaterialsModal = ({ isOpen, onClose, milestone, pathName }) => {
  if (!isOpen || !milestone) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8" />
            <div>
              <p className="text-purple-200 text-sm">{pathName}</p>
              <h2 className="text-2xl font-bold">{milestone.title}</h2>
            </div>
          </div>
          <p className="text-purple-100">{milestone.description}</p>
          
          {/* Skills covered */}
          <div className="flex flex-wrap gap-2 mt-4">
            {milestone.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            Study Materials
          </h3>

          <div className="space-y-4">
            {milestone.studyMaterials?.map((material, index) => (
              <a
                key={index}
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-100 hover:border-primary-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  material.type === 'video' 
                    ? 'bg-red-100 text-red-600'
                    : material.type === 'article'
                      ? 'bg-blue-100 text-blue-600'
                      : material.type === 'tutorial'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600'
                }`}>
                  {material.type === 'video' ? (
                    <Video className="w-6 h-6" />
                  ) : material.type === 'article' ? (
                    <FileText className="w-6 h-6" />
                  ) : material.type === 'tutorial' ? (
                    <PlayCircle className="w-6 h-6" />
                  ) : (
                    <Link2 className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {material.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{material.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      material.type === 'video' 
                        ? 'bg-red-100 text-red-700'
                        : material.type === 'article'
                          ? 'bg-blue-100 text-blue-700'
                          : material.type === 'tutorial'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                    }`}>
                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                    </span>
                    {material.duration && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {material.duration}
                      </span>
                    )}
                    {material.source && (
                      <span className="text-xs text-gray-500">{material.source}</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Practice Section */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Practice Exercises
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestone.exercises?.map((exercise, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200"
                >
                  <h4 className="font-semibold text-gray-900">{exercise.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exercise.difficulty === 'Easy' 
                        ? 'bg-green-200 text-green-800'
                        : exercise.difficulty === 'Medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button icon={ArrowRight}>Start Learning</Button>
        </div>
      </div>
    </div>
  )
}

const CareerRoadmap = () => {
  const [selectedPath, setSelectedPath] = useState(null)
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch career paths
  const { data: pathsData, isLoading: pathsLoading } = useQuery({
    queryKey: ['career', 'paths'],
    queryFn: async () => {
      try {
        const response = await careerApi.getPaths()
        return response.data.data.paths
      } catch (e) {
        return null
      }
    },
  })

  // Fetch user progress
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['career', 'progress'],
    queryFn: async () => {
      try {
        const response = await careerApi.getProgress()
        return response.data.data.progress
      } catch (e) {
        return []
      }
    },
  })

  // Start path mutation
  const startPathMutation = useMutation({
    mutationFn: (pathId) => careerApi.startPath({ pathId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['career'])
      toast.success('Career path started!')
    },
    onError: () => {
      toast.error('Failed to start path')
    }
  })

  // Complete milestone mutation
  const completeMilestoneMutation = useMutation({
    mutationFn: (data) => careerApi.completeMilestone(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['career'])
      toast.success('Milestone completed!')
    },
    onError: () => {
      toast.error('Failed to complete milestone')
    }
  })

  // Default career paths if none from API
  const defaultCareerPaths = [
    { _id: 'fullstack', name: 'Full Stack Developer', icon: 'Code2', color: 'from-blue-500 to-cyan-500' },
    { _id: 'frontend', name: 'Frontend Specialist', icon: 'Star', color: 'from-pink-500 to-rose-500' },
    { _id: 'backend', name: 'Backend Engineer', icon: 'Building2', color: 'from-emerald-500 to-teal-500' },
    { _id: 'devops', name: 'DevOps Engineer', icon: 'Rocket', color: 'from-purple-500 to-indigo-500' },
    { _id: 'data', name: 'Data Scientist', icon: 'TrendingUp', color: 'from-amber-500 to-orange-500' },
  ]

  const iconMap = { Code2, Star, Building2, Rocket, TrendingUp }

  const careerPaths = (pathsData || defaultCareerPaths).map((path, index) => ({
    ...path,
    id: path._id,
    icon: iconMap[path.icon] || [Code2, Star, Building2, Rocket, TrendingUp][index % 5],
    color: path.color || ['from-blue-500 to-cyan-500', 'from-pink-500 to-rose-500', 'from-emerald-500 to-teal-500', 'from-purple-500 to-indigo-500', 'from-amber-500 to-orange-500'][index % 5]
  }))

  // Set default selected path
  if (!selectedPath && careerPaths.length > 0) {
    setSelectedPath(careerPaths[0].id)
  }

  // Get current path data
  const currentPath = careerPaths.find(p => p.id === selectedPath)
  const currentProgress = progressData?.find(p => p.selectedPath?._id === selectedPath)

  const milestones = {
    fullstack: [
      {
        id: 1,
        title: 'Foundation',
        description: 'Master the basics',
        status: 'completed',
        skills: ['HTML/CSS', 'JavaScript Basics', 'Git Fundamentals'],
        interviews: 5,
        score: 85,
        studyMaterials: [
          { type: 'video', title: 'HTML & CSS Full Course', description: 'Complete beginner to advanced HTML and CSS tutorial', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc', duration: '6h 30m', source: 'freeCodeCamp' },
          { type: 'article', title: 'MDN Web Docs - HTML Basics', description: 'Official Mozilla documentation for HTML fundamentals', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', duration: '2h read', source: 'MDN' },
          { type: 'tutorial', title: 'JavaScript.info - The Modern JavaScript Tutorial', description: 'From basics to advanced topics with exercises', url: 'https://javascript.info/', duration: '40h', source: 'JavaScript.info' },
          { type: 'video', title: 'Git and GitHub for Beginners', description: 'Learn Git version control from scratch', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', duration: '1h', source: 'freeCodeCamp' },
        ],
        exercises: [
          { title: 'Build a Personal Portfolio', description: 'Create a responsive portfolio website using HTML and CSS', difficulty: 'Easy' },
          { title: 'JavaScript Calculator', description: 'Build a functional calculator with vanilla JavaScript', difficulty: 'Medium' },
        ]
      },
      {
        id: 2,
        title: 'Frontend Mastery',
        description: 'Build stunning UIs',
        status: 'completed',
        skills: ['React/Vue', 'State Management', 'CSS Frameworks'],
        interviews: 8,
        score: 78,
        studyMaterials: [
          { type: 'video', title: 'React Course - Beginner to Advanced', description: 'Complete React.js tutorial with projects', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: '12h', source: 'freeCodeCamp' },
          { type: 'article', title: 'React Official Documentation', description: 'Learn React from the official docs with interactive examples', url: 'https://react.dev/learn', duration: '10h read', source: 'React.dev' },
          { type: 'tutorial', title: 'Redux Toolkit Tutorial', description: 'Modern Redux state management made simple', url: 'https://redux-toolkit.js.org/tutorials/overview', duration: '4h', source: 'Redux' },
          { type: 'video', title: 'Tailwind CSS Full Course', description: 'Build modern UIs with utility-first CSS', url: 'https://www.youtube.com/watch?v=lCxcTsOHrjo', duration: '3h', source: 'Traversy Media' },
        ],
        exercises: [
          { title: 'Todo App with React', description: 'Build a full-featured todo application with CRUD operations', difficulty: 'Easy' },
          { title: 'E-commerce Product Page', description: 'Create a product listing with filters and cart functionality', difficulty: 'Medium' },
        ]
      },
      {
        id: 3,
        title: 'Backend Basics',
        description: 'Server-side development',
        status: 'current',
        skills: ['Node.js', 'Express', 'REST APIs'],
        interviews: 3,
        score: 72,
        studyMaterials: [
          { type: 'video', title: 'Node.js and Express.js Full Course', description: 'Build backend applications with Node.js', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', duration: '8h', source: 'freeCodeCamp' },
          { type: 'article', title: 'Express.js Guide', description: 'Official Express.js getting started guide', url: 'https://expressjs.com/en/guide/routing.html', duration: '3h read', source: 'Express.js' },
          { type: 'tutorial', title: 'REST API Design Best Practices', description: 'Learn to design scalable and maintainable APIs', url: 'https://restfulapi.net/', duration: '2h', source: 'RESTful API' },
          { type: 'video', title: 'Build a REST API with Node.js', description: 'Hands-on tutorial building a complete REST API', url: 'https://www.youtube.com/watch?v=pKd0Rpw7O48', duration: '2h 30m', source: 'Academind' },
        ],
        exercises: [
          { title: 'Build a REST API', description: 'Create a CRUD API for a blog application', difficulty: 'Medium' },
          { title: 'Authentication System', description: 'Implement JWT-based authentication', difficulty: 'Hard' },
        ]
      },
      {
        id: 4,
        title: 'Database Design',
        description: 'Data persistence',
        status: 'locked',
        skills: ['SQL', 'MongoDB', 'Redis'],
        interviews: 0,
        score: 0,
        studyMaterials: [
          { type: 'video', title: 'SQL Tutorial - Full Database Course', description: 'Learn SQL from basics to advanced queries', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: '4h', source: 'freeCodeCamp' },
          { type: 'tutorial', title: 'MongoDB University', description: 'Free courses from MongoDB official learning platform', url: 'https://learn.mongodb.com/', duration: '20h', source: 'MongoDB' },
          { type: 'article', title: 'Redis Documentation', description: 'Learn Redis caching and data structures', url: 'https://redis.io/docs/', duration: '5h read', source: 'Redis' },
        ],
        exercises: [
          { title: 'Design a Database Schema', description: 'Create normalized tables for an e-commerce platform', difficulty: 'Medium' },
          { title: 'MongoDB CRUD Operations', description: 'Build a data layer with Mongoose ODM', difficulty: 'Medium' },
        ]
      },
      {
        id: 5,
        title: 'System Design',
        description: 'Scalable architecture',
        status: 'locked',
        skills: ['Microservices', 'Caching', 'Load Balancing'],
        interviews: 0,
        score: 0,
        studyMaterials: [
          { type: 'video', title: 'System Design for Beginners', description: 'Introduction to distributed systems concepts', url: 'https://www.youtube.com/watch?v=MbjObHmDbZo', duration: '1h 30m', source: 'NeetCode' },
          { type: 'article', title: 'System Design Primer', description: 'Comprehensive guide to system design concepts', url: 'https://github.com/donnemartin/system-design-primer', duration: '30h', source: 'GitHub' },
          { type: 'tutorial', title: 'Microservices Architecture', description: 'Learn to build scalable microservices', url: 'https://microservices.io/', duration: '10h', source: 'Microservices.io' },
        ],
        exercises: [
          { title: 'Design URL Shortener', description: 'System design for a URL shortening service', difficulty: 'Hard' },
          { title: 'Design Chat Application', description: 'Architecture for a real-time messaging system', difficulty: 'Hard' },
        ]
      },
      {
        id: 6,
        title: 'Job Ready',
        description: 'Interview mastery',
        status: 'locked',
        skills: ['DSA', 'System Design', 'Behavioral'],
        interviews: 0,
        score: 0,
        studyMaterials: [
          { type: 'video', title: 'Data Structures Easy to Advanced', description: 'Complete DSA course with implementations', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', duration: '8h', source: 'freeCodeCamp' },
          { type: 'tutorial', title: 'LeetCode Patterns', description: 'Common coding interview patterns and solutions', url: 'https://leetcode.com/explore/', duration: '50h', source: 'LeetCode' },
          { type: 'article', title: 'Behavioral Interview Guide', description: 'STAR method and common behavioral questions', url: 'https://www.themuse.com/advice/star-interview-method', duration: '2h read', source: 'The Muse' },
        ],
        exercises: [
          { title: 'Solve 50 LeetCode Problems', description: 'Practice array, string, and tree problems', difficulty: 'Medium' },
          { title: 'Mock Interview Practice', description: 'Complete 5 mock technical interviews', difficulty: 'Hard' },
        ]
      },
    ],
    frontend: [
      {
        id: 1,
        title: 'Web Fundamentals',
        status: 'completed',
        description: 'Master core web technologies',
        skills: ['HTML5', 'CSS3', 'JavaScript ES6+'],
        interviews: 6,
        score: 88,
        studyMaterials: [
          { type: 'video', title: 'HTML5 and CSS3 Fundamentals', description: 'Modern HTML and CSS from scratch', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc', duration: '6h', source: 'freeCodeCamp' },
          { type: 'tutorial', title: 'CSS Grid & Flexbox', description: 'Master modern CSS layouts', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', duration: '3h', source: 'CSS-Tricks' },
          { type: 'article', title: 'ES6 Features', description: 'All ES6+ JavaScript features explained', url: 'https://www.w3schools.com/js/js_es6.asp', duration: '4h read', source: 'W3Schools' },
        ],
        exercises: [
          { title: 'Responsive Landing Page', description: 'Build a mobile-first responsive website', difficulty: 'Easy' },
          { title: 'CSS Animation Gallery', description: 'Create an animated image gallery', difficulty: 'Medium' },
        ]
      },
      {
        id: 2,
        title: 'React Mastery',
        status: 'current',
        description: 'Become a React expert',
        skills: ['React Hooks', 'Context API', 'Redux'],
        interviews: 4,
        score: 75,
        studyMaterials: [
          { type: 'video', title: 'React Hooks Complete Guide', description: 'All React hooks explained with examples', url: 'https://www.youtube.com/watch?v=LlvBzyy-558', duration: '2h', source: 'Codevolution' },
          { type: 'article', title: 'React Documentation', description: 'Official React learning resources', url: 'https://react.dev/learn', duration: '15h', source: 'React.dev' },
          { type: 'tutorial', title: 'Redux Toolkit Quick Start', description: 'Modern Redux with toolkit', url: 'https://redux-toolkit.js.org/tutorials/quick-start', duration: '3h', source: 'Redux' },
        ],
        exercises: [
          { title: 'Build a Weather App', description: 'React app with API integration and hooks', difficulty: 'Medium' },
          { title: 'Shopping Cart with Redux', description: 'E-commerce cart with Redux state management', difficulty: 'Hard' },
        ]
      },
      {
        id: 3,
        title: 'Advanced Styling',
        status: 'locked',
        description: 'Master modern CSS frameworks',
        skills: ['Tailwind', 'Animations', 'Responsive Design'],
        interviews: 0,
        score: 0,
        studyMaterials: [
          { type: 'video', title: 'Tailwind CSS Tutorial', description: 'Utility-first CSS framework', url: 'https://www.youtube.com/watch?v=dFgzHOX84xQ', duration: '3h 30m', source: 'Traversy Media' },
          { type: 'tutorial', title: 'Framer Motion Guide', description: 'Animation library for React', url: 'https://www.framer.com/motion/', duration: '4h', source: 'Framer' },
        ],
        exercises: [
          { title: 'Animated Dashboard', description: 'Build a dashboard with smooth transitions', difficulty: 'Medium' },
        ]
      },
      {
        id: 4,
        title: 'Performance',
        status: 'locked',
        description: 'Optimize for speed',
        skills: ['Web Vitals', 'Optimization', 'PWA'],
        interviews: 0,
        score: 0,
        studyMaterials: [
          { type: 'article', title: 'Web Vitals Guide', description: 'Core Web Vitals metrics explained', url: 'https://web.dev/vitals/', duration: '2h read', source: 'web.dev' },
          { type: 'video', title: 'React Performance Optimization', description: 'Make your React apps faster', url: 'https://www.youtube.com/watch?v=5fLW5Q5ODiE', duration: '1h 30m', source: 'Jack Herrington' },
        ],
        exercises: [
          { title: 'Lighthouse Audit Fix', description: 'Improve a website score to 90+', difficulty: 'Hard' },
        ]
      },
    ],
    backend: [
      {
        id: 1,
        title: 'Server Basics',
        status: 'completed',
        description: 'Build robust backend applications',
        skills: ['Node.js', 'Express', 'Python'],
        interviews: 5,
        score: 82,
        studyMaterials: [
          { type: 'video', title: 'Node.js Crash Course', description: 'Learn Node.js fundamentals', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', duration: '1h 30m', source: 'Traversy Media' },
          { type: 'tutorial', title: 'Express.js Basics', description: 'Build web servers with Express', url: 'https://expressjs.com/en/starter/hello-world.html', duration: '2h', source: 'Express.js' },
          { type: 'video', title: 'Python for Backend Development', description: 'Python Flask and Django basics', url: 'https://www.youtube.com/watch?v=Z1RJmh_OqeA', duration: '4h', source: 'freeCodeCamp' },
        ],
        exercises: [
          { title: 'Hello World Server', description: 'Create a basic HTTP server', difficulty: 'Easy' },
          { title: 'File Upload API', description: 'Build a file upload endpoint', difficulty: 'Medium' },
        ]
      },
      {
        id: 2,
        title: 'Database Expert',
        status: 'current',
        description: 'Master database technologies',
        skills: ['PostgreSQL', 'MongoDB', 'ORM'],
        interviews: 3,
        score: 70,
        studyMaterials: [
          { type: 'video', title: 'PostgreSQL Complete Tutorial', description: 'Learn PostgreSQL from scratch', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', duration: '4h', source: 'freeCodeCamp' },
          { type: 'tutorial', title: 'MongoDB Basics', description: 'NoSQL database fundamentals', url: 'https://www.mongodb.com/basics', duration: '3h', source: 'MongoDB' },
          { type: 'article', title: 'Prisma ORM Guide', description: 'Modern database toolkit for Node.js', url: 'https://www.prisma.io/docs/getting-started', duration: '5h', source: 'Prisma' },
        ],
        exercises: [
          { title: 'Database Schema Design', description: 'Design a normalized database', difficulty: 'Medium' },
          { title: 'Query Optimization', description: 'Optimize slow database queries', difficulty: 'Hard' },
        ]
      },
      {
        id: 3,
        title: 'API Design',
        status: 'locked',
        description: 'Create professional APIs',
        skills: ['REST', 'GraphQL', 'gRPC'],
        interviews: 0,
        score: 0,
        studyMaterials: [
          { type: 'video', title: 'REST API Design Best Practices', description: 'Build production-ready APIs', url: 'https://www.youtube.com/watch?v=7YcW25PHnAA', duration: '2h', source: 'Academind' },
          { type: 'tutorial', title: 'GraphQL Tutorial', description: 'Learn GraphQL from basics', url: 'https://graphql.org/learn/', duration: '4h', source: 'GraphQL.org' },
          { type: 'article', title: 'gRPC Introduction', description: 'High-performance RPC framework', url: 'https://grpc.io/docs/what-is-grpc/introduction/', duration: '2h', source: 'gRPC' },
        ],
        exercises: [
          { title: 'GraphQL API', description: 'Convert REST API to GraphQL', difficulty: 'Hard' },
        ]
      },
    ],
    devops: [
      {
        id: 1,
        title: 'Linux & Shell',
        status: 'completed',
        description: 'Command line mastery',
        skills: ['Bash', 'Linux', 'SSH'],
        interviews: 4,
        score: 79,
        studyMaterials: [
          { type: 'video', title: 'Linux for Beginners', description: 'Complete Linux administration course', url: 'https://www.youtube.com/watch?v=wBp0Rb-ZJak', duration: '4h', source: 'The Linux Foundation' },
          { type: 'tutorial', title: 'Bash Scripting Tutorial', description: 'Automate tasks with shell scripts', url: 'https://linuxconfig.org/bash-scripting-tutorial-for-beginners', duration: '3h', source: 'LinuxConfig' },
          { type: 'article', title: 'SSH Essential Guide', description: 'Secure shell connections explained', url: 'https://www.ssh.com/academy/ssh/command', duration: '1h', source: 'SSH.com' },
        ],
        exercises: [
          { title: 'Automate Backup Script', description: 'Create a backup automation script', difficulty: 'Easy' },
          { title: 'Server Setup', description: 'Configure a Linux web server', difficulty: 'Medium' },
        ]
      },
      {
        id: 2,
        title: 'Containers',
        status: 'current',
        description: 'Containerization technologies',
        skills: ['Docker', 'Kubernetes', 'Helm'],
        interviews: 2,
        score: 68,
        studyMaterials: [
          { type: 'video', title: 'Docker Tutorial for Beginners', description: 'Complete Docker guide', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', duration: '3h', source: 'freeCodeCamp' },
          { type: 'tutorial', title: 'Kubernetes Basics', description: 'Container orchestration fundamentals', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', duration: '6h', source: 'Kubernetes' },
          { type: 'video', title: 'Helm Charts Explained', description: 'Package manager for Kubernetes', url: 'https://www.youtube.com/watch?v=fy8SHvNZGeE', duration: '1h', source: 'TechWorld with Nana' },
        ],
        exercises: [
          { title: 'Dockerize an App', description: 'Containerize a Node.js application', difficulty: 'Medium' },
          { title: 'Kubernetes Deployment', description: 'Deploy app to K8s cluster', difficulty: 'Hard' },
        ]
      },
      {
        id: 3,
        title: 'CI/CD',
        status: 'locked',
        description: 'Continuous integration & deployment',
        skills: ['Jenkins', 'GitHub Actions', 'ArgoCD'],
        interviews: 0,
        score: 0,
        studyMaterials: [
          { type: 'video', title: 'GitHub Actions Tutorial', description: 'Automate your workflows', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', duration: '2h', source: 'TechWorld with Nana' },
          { type: 'tutorial', title: 'Jenkins Pipeline', description: 'Create CI/CD pipelines', url: 'https://www.jenkins.io/doc/tutorials/', duration: '4h', source: 'Jenkins' },
          { type: 'article', title: 'ArgoCD Getting Started', description: 'GitOps for Kubernetes', url: 'https://argo-cd.readthedocs.io/en/stable/getting_started/', duration: '2h', source: 'ArgoCD' },
        ],
        exercises: [
          { title: 'GitHub Actions Pipeline', description: 'Create a CI/CD workflow', difficulty: 'Medium' },
        ]
      },
    ],
    data: [
      {
        id: 1,
        title: 'Data Fundamentals',
        status: 'completed',
        description: 'Core data science skills',
        skills: ['SQL', 'Python', 'Statistics'],
        interviews: 5,
        score: 85,
        studyMaterials: [
          { type: 'video', title: 'SQL for Data Science', description: 'Master SQL for analytics', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: '4h', source: 'freeCodeCamp' },
          { type: 'tutorial', title: 'Python for Data Analysis', description: 'Pandas and NumPy basics', url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/', duration: '6h', source: 'Pandas' },
          { type: 'video', title: 'Statistics Fundamentals', description: 'Statistical concepts for data science', url: 'https://www.youtube.com/watch?v=xxpc-HPKN28', duration: '8h', source: 'StatQuest' },
        ],
        exercises: [
          { title: 'Exploratory Data Analysis', description: 'Analyze a real-world dataset', difficulty: 'Medium' },
          { title: 'Data Cleaning Project', description: 'Clean and prepare messy data', difficulty: 'Easy' },
        ]
      },
      {
        id: 2,
        title: 'Big Data',
        status: 'current',
        description: 'Handle large-scale data',
        skills: ['Spark', 'Hadoop', 'Kafka'],
        interviews: 2,
        score: 65,
        studyMaterials: [
          { type: 'video', title: 'Apache Spark Tutorial', description: 'Big data processing with Spark', url: 'https://www.youtube.com/watch?v=_C8kWso4ne4', duration: '3h', source: 'freeCodeCamp' },
          { type: 'tutorial', title: 'Hadoop Ecosystem', description: 'Introduction to Hadoop components', url: 'https://hadoop.apache.org/docs/stable/', duration: '5h', source: 'Apache' },
          { type: 'article', title: 'Apache Kafka Basics', description: 'Event streaming platform', url: 'https://kafka.apache.org/intro', duration: '2h', source: 'Apache Kafka' },
        ],
        exercises: [
          { title: 'Spark Data Pipeline', description: 'Build an ETL pipeline with Spark', difficulty: 'Hard' },
          { title: 'Real-time Streaming', description: 'Process streaming data with Kafka', difficulty: 'Hard' },
        ]
      },
    ],
  }

  const currentMilestones = milestones[selectedPath] || milestones.fullstack
  const completedCount = currentMilestones.filter(m => m.status === 'completed').length
  const progress = (completedCount / currentMilestones.length) * 100

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'current':
        return <Target className="w-6 h-6 text-primary-500 animate-pulse" />
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-300" />
      default:
        return <Circle className="w-6 h-6 text-gray-300" />
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
      case 'current':
        return 'bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200 shadow-lg shadow-primary-500/10'
      case 'locked':
        return 'bg-gray-50 border-gray-200 opacity-60'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        {/* Animated decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          {/* Floating path icons */}
          <div className="absolute top-10 right-40 opacity-20">
            <MapPin className="w-8 h-8 animate-float" />
          </div>
          <div className="absolute bottom-10 right-20 opacity-20">
            <Flag className="w-8 h-8 animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
            <Map className="w-4 h-4 mr-2" />
            Your Personalized Journey
          </div>
          <h1 className="text-4xl font-bold mb-3">Career Roadmap</h1>
          <p className="text-purple-100 text-lg max-w-2xl">
            Follow your personalized learning path and track your progress towards becoming a world-class developer.
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Career Path Selector */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
        <div className="flex flex-wrap gap-3">
          {careerPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${
                selectedPath === path.id
                  ? `bg-gradient-to-r ${path.color} text-white shadow-lg`
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <path.icon className={`w-5 h-5 ${selectedPath === path.id ? 'text-white' : 'text-gray-400'}`} />
              <span className="font-medium">{path.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Milestone Timeline */}
      <div className="relative">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary-500" />
          Your Learning Milestones
        </h2>

        <div className="space-y-6">
          {currentMilestones.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {/* Connecting Line */}
              {index < currentMilestones.length - 1 && (
                <div className={`absolute left-7 top-16 w-0.5 h-20 ${
                  milestone.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                }`} />
              )}

              <Card className={`${getStatusStyle(milestone.status)} border transition-all duration-300`}>
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    milestone.status === 'completed' 
                      ? 'bg-green-100' 
                      : milestone.status === 'current'
                        ? 'bg-primary-100'
                        : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(milestone.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
                      {milestone.status === 'current' && (
                        <Badge variant="primary" className="animate-pulse">
                          <Sparkles className="w-3 h-3 mr-1" />
                          In Progress
                        </Badge>
                      )}
                      {milestone.status === 'completed' && (
                        <Badge variant="success">Completed</Badge>
                      )}
                    </div>
                    {milestone.description && (
                      <p className="text-gray-500 mb-3">{milestone.description}</p>
                    )}

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {milestone.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`px-3 py-1 text-sm rounded-lg ${
                            milestone.status === 'locked'
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-white border border-gray-200 text-gray-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    {milestone.status !== 'locked' && (
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{milestone.interviews} interviews</span>
                        </div>
                        {milestone.score > 0 && (
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className={`font-medium ${
                              milestone.score >= 80 ? 'text-green-600' : milestone.score >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>{milestone.score}% avg score</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {milestone.status === 'current' ? (
                      <Button 
                        icon={ArrowRight}
                        onClick={() => {
                          setSelectedMilestone(milestone)
                          setIsModalOpen(true)
                        }}
                      >
                        Continue
                      </Button>
                    ) : milestone.status === 'completed' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedMilestone(milestone)
                          setIsModalOpen(true)
                        }}
                      >
                        Review
                      </Button>
                    ) : (
                      <Lock className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Banner */}
      <Card className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">You're making great progress!</h3>
              <p className="text-gray-600">Complete {currentMilestones.length - completedCount} more milestones to reach your goal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-amber-600">{completedCount}/{currentMilestones.length}</div>
            <div className="text-sm text-gray-500">Milestones</div>
          </div>
        </div>
      </Card>

      {/* Study Materials Modal */}
      <StudyMaterialsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedMilestone(null)
        }}
        milestone={selectedMilestone}
        pathName={currentPath?.name || 'Career Path'}
      />
    </div>
  )
}

export default CareerRoadmap
