# HireReady - Frontend

A modern React application for AI-powered interview preparation with interactive mock interviews, real-time feedback, and comprehensive analytics.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with TailwindCSS
- **Authentication**: Complete login/signup flow with form validation
- **Dashboard**: Overview of progress, recent interviews, and quick actions
- **Interview Simulation**: Interactive mock interviews with timer and progress tracking
- **Analytics Dashboard**: Detailed performance charts using Recharts
- **Question Bank**: Browse and search interview questions
- **Saved Questions**: Bookmark and organize important questions
- **Notifications**: Stay updated with achievements and reminders
- **Group Discussions**: Practice GD sessions with AI moderation
- **Communication Assessment**: Improve verbal and non-verbal skills
- **Aptitude Tests**: Quantitative, logical, and verbal reasoning practice
- **Company Preparation**: Company-specific interview tips and questions
- **Career Roadmap**: Personalized career guidance and skill recommendations
- **AI Chatbot**: Get instant help with HireReady AI assistant
- **Admin Panel**: User and question management for administrators
- **Dark Mode Ready**: Theme toggle support

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **React Query (TanStack)** - Server state management
- **Recharts** - Charting library
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── index.js
│   │   ├── communication/   # Communication assessment components
│   │   ├── proctoring/      # Proctoring components
│   │   ├── AIChatbot.jsx    # AI assistant chatbot
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── pages/
│   │   ├── admin/           # Admin pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── InterviewSetup.jsx
│   │   ├── Interview.jsx
│   │   ├── InterviewResult.jsx
│   │   ├── Analytics.jsx
│   │   ├── Questions.jsx
│   │   ├── SavedQuestions.jsx
│   │   ├── Notifications.jsx
│   │   ├── Aptitude.jsx
│   │   ├── AptitudeTest.jsx
│   │   ├── GroupDiscussion.jsx
│   │   ├── GDSession.jsx
│   │   ├── CommunicationAssessment.jsx
│   │   ├── CommunicationTest.jsx
│   │   ├── CompanyPrep.jsx
│   │   ├── CareerRoadmap.jsx
│   │   ├── DailyChallenge.jsx
│   │   ├── CommunityHub.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Achievements.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js           # Axios instance with interceptors
│   ├── hooks/
│   │   └── useProctoring.js # Proctoring hook
│   ├── store/
│   │   ├── authStore.js     # Authentication state
│   │   └── interviewStore.js # Interview state
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app with routes
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 UI Components

### Button
```jsx
import { Button } from './components/ui'

<Button variant="primary" size="lg" icon={Play} isLoading={false}>
  Start Interview
</Button>
```

Variants: `primary`, `secondary`, `success`, `danger`, `warning`, `outline`, `ghost`
Sizes: `sm`, `md`, `lg`, `xl`

### Input
```jsx
import { Input } from './components/ui'

<Input
  label="Email"
  type="email"
  icon={Mail}
  error={errors.email}
  helperText="Enter your email"
/>
```

### Card
```jsx
import { Card } from './components/ui'

<Card hover padding="lg">
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content here</Card.Content>
  <Card.Footer>Footer actions</Card.Footer>
</Card>
```

### Modal
```jsx
import { Modal } from './components/ui'

<Modal isOpen={isOpen} onClose={onClose} title="Modal Title" size="lg">
  <p>Modal content</p>
  <Modal.Footer>
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

### Badge
```jsx
import { Badge } from './components/ui'

<Badge variant="success" size="md">Active</Badge>
```

Variants: `default`, `primary`, `success`, `warning`, `danger`, `info`, `purple`

## 📦 State Management

### Auth Store (Zustand)
```jsx
import { useAuthStore } from './store/authStore'

const { user, isAuthenticated, login, logout, register } = useAuthStore()

// Login
await login(email, password)

// Register
await register({ name, email, password })

// Logout
logout()
```

### Interview Store
```jsx
import { useInterviewStore } from './store/interviewStore'

const {
  currentInterview,
  currentQuestionIndex,
  responses,
  startInterview,
  submitAnswer,
  nextQuestion,
  getProgress,
} = useInterviewStore()
```

## 🔌 API Service

The API service includes:
- Automatic token attachment from auth store
- Response/error interceptors
- Toast notifications for errors
- Session expiry handling

```jsx
import api from './services/api'

// GET request
const response = await api.get('/users/me')

// POST request
const response = await api.post('/interviews', { category, difficulty })
```

## 🔐 Protected Routes

Routes are protected using wrapper components:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

<ProtectedRoute adminOnly>
  <AdminDashboard />
</ProtectedRoute>
```

## 📊 Charts with Recharts

The Analytics page uses Recharts for data visualization:
- Area charts for progress tracking
- Bar charts for category performance
- Pie charts for difficulty distribution
- Line charts for trends

## 🎯 Key Pages

### Home (`/`)
Landing page with features, testimonials, and CTA

### Login (`/login`)
Email/password authentication with form validation

### Dashboard (`/dashboard`)
- Welcome message
- Stats cards (interviews, score, time, questions)
- Recent interviews list
- Quick actions
- Achievements progress

### Interview Setup (`/interview/setup`)
- Category selection (DSA, System Design, Behavioral, etc.)
- Difficulty level (Easy, Medium, Hard, Expert)
- Question count
- Time limit options

### Active Interview (`/interview/:id`)
- Question navigation
- Timer (if enabled)
- Pause/resume functionality
- Answer submission
- Progress tracking
- Result modal with score and performance feedback

### Interview Result (`/interview/:id/result`)
- Overall score
- Performance breakdown
- Question-by-question review
- AI feedback for each answer

### Saved Questions (`/saved-questions`)
- Bookmarked questions organized by category
- Star important questions
- Add personal notes

### Notifications (`/notifications`)
- Achievement alerts
- Practice reminders
- System notifications

### Aptitude (`/aptitude`)
- Quantitative reasoning tests
- Logical reasoning tests
- Verbal ability tests

### Group Discussion (`/gd`)
- AI-moderated GD sessions
- Real-time participation tracking
- Performance evaluation

### Communication Assessment (`/communication`)
- Speech analysis
- Body language tips
- Presentation skills

### Company Prep (`/company-prep`)
- Company-specific interview questions
- Culture fit assessment
- Salary negotiation tips

### Career Roadmap (`/career`)
- Skill gap analysis
- Learning path recommendations
- Industry trends

### Analytics (`/analytics`)
- Performance charts
- Category scores
- Weekly/monthly trends
- Achievements gallery

### Admin Panel (`/admin/*`)
- Dashboard with platform stats
- User management
- Question management with AI generation

## 🌐 Environment Variables

Create a `.env` file if needed:
```env
VITE_API_URL=http://localhost:5000
```

## 📝 License

MIT License
