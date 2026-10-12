/**
 * Resume Builder Templates, Sample Role Presets, and Action Verbs
 */

export const THEME_COLORS = [
  { id: 'indigo', name: 'Indigo Modern', hex: '#4f46e5' },
  { id: 'teal', name: 'Emerald Teal', hex: '#0d9488' },
  { id: 'blue', name: 'Royal Blue', hex: '#2563eb' },
  { id: 'rose', name: 'Ruby Crimson', hex: '#e11d48' },
  { id: 'violet', name: 'Purple Violet', hex: '#7c3aed' },
  { id: 'slate', name: 'Midnight Slate', hex: '#334155' },
  { id: 'amber', name: 'Warm Amber', hex: '#d97706' },
];

export const FONT_OPTIONS = [
  { id: 'sans', name: 'Modern Sans (Inter / System)' },
  { id: 'serif', name: 'Classic Serif (Merriweather)' },
  { id: 'mono', name: 'Tech Monospace (JetBrains)' },
];

export const RESUME_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Executive',
    description: 'Clean header bar, structured hierarchy, ideal for modern tech & corporate jobs.',
    badge: 'Popular',
  },
  {
    id: 'classic',
    name: 'Classic ATS Optimized',
    description: 'Traditional centered single-column layout with 100% ATS parser compatibility.',
    badge: 'ATS Best',
  },
  {
    id: 'creative',
    name: 'Two-Column Sidebar',
    description: 'Visual sidebar with skills and contact info; maximizes space on single page.',
    badge: 'Design',
  },
];

export const ACTION_VERBS = [
  {
    category: 'Development & Engineering',
    verbs: [
      'Architected',
      'Engineered',
      'Built',
      'Implemented',
      'Refactored',
      'Deployed',
      'Containerized',
      'Automated',
    ],
  },
  {
    category: 'Optimization & Scaling',
    verbs: [
      'Optimized',
      'Scaled',
      'Accelerated',
      'Reduced',
      'Enhanced',
      'Strengthened',
      'Streamlined',
      'Minimized',
    ],
  },
  {
    category: 'Leadership & Collaboration',
    verbs: [
      'Spearheaded',
      'Mentored',
      'Orchestrated',
      'Collaborated',
      'Guided',
      'Championed',
      'Established',
      'Delivered',
    ],
  },
  {
    category: 'Testing & Quality',
    verbs: [
      'Verified',
      'Audited',
      'Debugged',
      'Standardized',
      'Validated',
      'Benchmarked',
      'Monitored',
      'Secured',
    ],
  },
];

export const SAMPLE_RESUMES = {
  software_engineer: {
    title: 'Full Stack Software Engineer',
    template: 'modern',
    themeColor: '#4f46e5',
    fontFamily: 'sans',
    personalInfo: {
      fullName: 'Alex Rivera',
      jobTitle: 'Senior Full Stack Software Engineer',
      email: 'alex.rivera.dev@gmail.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA (Open to Remote)',
      linkedin: 'https://linkedin.com/in/alexrivera-dev',
      github: 'https://github.com/alexrivera',
      portfolio: 'https://alexrivera.dev',
      summary:
        'Results-driven Full Stack Engineer with 4+ years of experience designing and scaling distributed web applications. Expert in React, TypeScript, Node.js, and cloud architectures. Proven track record of improving application throughput by 40% and leading high-velocity sprint deliveries.',
    },
    experience: [
      {
        company: 'CloudScale Technologies',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2023-01-01',
        endDate: '',
        current: true,
        description:
          '• Architected and deployed microservices backend using Node.js, Express, and Redis, serving over 2M daily active requests with 99.98% uptime.\n• Spearheaded frontend migration to React 18 and Next.js, slashing initial page load time from 3.4s to 0.9s (73% improvement).\n• Automated CI/CD pipelines with GitHub Actions and Docker, reducing release cycle deployment time from 45 minutes to 8 minutes.\n• Mentored 4 junior engineers on clean code practices, TypeScript type safety, and automated test coverage.',
      },
      {
        company: 'Apex Data Systems',
        position: 'Full Stack Developer',
        location: 'Austin, TX',
        startDate: '2021-06-01',
        endDate: '2022-12-31',
        current: false,
        description:
          '• Developed customer-facing dashboard with React, Redux Toolkit, and Tailwind CSS, increasing user engagement by 28%.\n• Designed relational schema and complex queries in PostgreSQL, optimizing query execution times by 35% across high-volume tables.\n• Integrated Stripe billing API and webhook event handlers with zero transaction discrepancies.',
      },
    ],
    education: [
      {
        institution: 'University of Texas at Austin',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2017-08-01',
        endDate: '2021-05-01',
        current: false,
        gpa: '3.85 / 4.0',
      },
    ],
    skills: [
      {
        category: 'Languages & Core',
        items: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'SQL', 'HTML5/CSS3'],
      },
      {
        category: 'Frameworks & Libraries',
        items: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Redux / Zustand'],
      },
      {
        category: 'Databases & Cloud',
        items: [
          'PostgreSQL',
          'MongoDB',
          'Redis',
          'AWS (S3, EC2, Lambda)',
          'Docker',
          'Git / GitHub CI',
        ],
      },
    ],
    projects: [
      {
        name: 'TaskStream - Real-time Collaborative Board',
        technologies: ['React', 'Node.js', 'Socket.IO', 'Tailwind CSS', 'PostgreSQL'],
        link: 'https://taskstream-demo.app',
        description:
          'Built a real-time Kanban project management tool with live multi-user cursor tracking, optimistic UI updates, and drag-and-drop state syncing with sub-50ms latency.',
      },
      {
        name: 'DevMetrics - GitHub PR Analytics Dashboard',
        technologies: ['Next.js', 'TypeScript', 'GraphQL', 'Tailwind CSS', 'Recharts'],
        link: 'https://devmetrics.io',
        description:
          'Open-source productivity analyzer querying GitHub GraphQL API to visualize code review turnarounds, PR cycle velocity, and team throughput metrics.',
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        date: '2023-04-01',
        link: '',
      },
    ],
  },
  frontend_developer: {
    title: 'Frontend Developer',
    template: 'creative',
    themeColor: '#0d9488',
    fontFamily: 'sans',
    personalInfo: {
      fullName: 'Sarah Chen',
      jobTitle: 'Frontend & UI/UX Engineer',
      email: 'sarah.chen.ui@gmail.com',
      phone: '+1 (555) 876-5432',
      location: 'New York, NY',
      linkedin: 'https://linkedin.com/in/sarahchen-ui',
      github: 'https://github.com/sarahchen',
      portfolio: 'https://sarahchen.design',
      summary:
        'Frontend engineer passionate about accessible, performant, and delightful web interfaces. Specialized in React, modern CSS, web performance optimization, and interactive design systems.',
    },
    experience: [
      {
        company: 'Veloce Interactive',
        position: 'Lead Frontend Developer',
        location: 'New York, NY',
        startDate: '2022-03-01',
        endDate: '',
        current: true,
        description:
          '• Engineered comprehensive internal design system used by 25+ developers, achieving 100% WCAG 2.1 AA accessibility compliance.\n• Reduced bundle size by 42% through code splitting, dynamic imports, and tree-shaking optimizations.\n• Built reactive component library in Storybook with unit and visual regression tests.',
      },
    ],
    education: [
      {
        institution: 'New York University (NYU)',
        degree: 'Bachelor of Science',
        field: 'Information Systems',
        startDate: '2018-09-01',
        endDate: '2022-05-01',
        current: false,
        gpa: '3.9 / 4.0',
      },
    ],
    skills: [
      {
        category: 'Frontend Core',
        items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion'],
      },
      {
        category: 'Tooling & Testing',
        items: ['Vite', 'Webpack', 'Jest', 'Cypress', 'Storybook', 'Figma'],
      },
    ],
    projects: [
      {
        name: 'MotionUI - Micro-interactions Library',
        technologies: ['React', 'Framer Motion', 'Tailwind CSS'],
        link: 'https://motion-ui-docs.vercel.app',
        description:
          'Lightweight collection of drop-in animated components and gestural hooks with 1,200+ stars on GitHub.',
      },
    ],
    certifications: [
      {
        name: 'Meta Certified Frontend Developer Professional',
        issuer: 'Meta / Coursera',
        date: '2022-08-01',
        link: '',
      },
    ],
  },
};
