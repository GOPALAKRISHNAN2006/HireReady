# HireReady - AI-Powered Interview Preparation Portal 🎯

A comprehensive MERN stack application designed to revolutionize interview preparation through AI-powered mock interviews, intelligent feedback, and detailed analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18%2B-green.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-7.0-green.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**HireReady** addresses the challenge of inadequate interview preparation by providing an intelligent, adaptive platform that simulates real interview scenarios. Using advanced AI technologies (OpenAI GPT-4 and Google Gemini), the system generates contextually relevant questions, evaluates responses using NLP, and provides actionable feedback.

### Key Objectives

1. **AI-Driven Question Generation**: Dynamically generate interview questions based on job role, skill level, and category
2. **Intelligent Response Evaluation**: Analyze answers for technical accuracy, communication skills, and completeness
3. **Personalized Learning**: Track progress and provide tailored recommendations
4. **Comprehensive Analytics**: Visualize performance trends and identify improvement areas
5. **Admin Management**: Full control over users, questions, and platform settings

## ✨ Features

### For Users
- 📝 **Mock Interviews**: Practice with AI-generated questions across multiple categories
- 🎯 **Real-time Feedback**: Get instant, detailed feedback on your answers
- 📊 **Analytics Dashboard**: Track your progress with interactive charts
- 🏆 **Achievements**: Earn badges and track your interview preparation journey
- 📚 **Question Bank**: Browse and practice from a curated question library
- ⏱️ **Timed Sessions**: Simulate real interview pressure with optional timers
- 💬 **Group Discussions**: Practice GD sessions with AI moderators
- 🎤 **Communication Assessment**: Improve your verbal and non-verbal skills
- 🧠 **Aptitude Tests**: Practice quantitative, logical, and verbal reasoning
- 🏢 **Company Preparation**: Get company-specific interview tips and questions
- 🗺️ **Career Roadmap**: Personalized career guidance and skill recommendations
- 🔔 **Notifications**: Stay updated with achievements and reminders
- 📌 **Saved Questions**: Bookmark and star important questions
- 🤖 **AI Chatbot**: Get instant help with HireReady AI assistant

### For Administrators
- 👥 **User Management**: View, edit, and manage user accounts
- ❓ **Question Management**: Create, edit, and approve questions
- 🤖 **AI Question Generation**: Generate questions using AI with one click
- 📈 **Platform Analytics**: Monitor overall platform usage and trends

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Socket.io | Real-time communication |
| OpenAI API | AI question generation |
| Google Gemini | Alternative AI provider |
| natural.js | NLP fallback |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool |
| TailwindCSS | Styling |
| Zustand | State management |
| React Query | Server state |
| Recharts | Data visualization |
| React Router v6 | Routing |
| Axios | HTTP client |

## 📁 Project Structure

```
ai-interview-portal/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.config.js
│   │   └── ai.config.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Question.model.js
│   │   ├── Interview.model.js
│   │   ├── Feedback.model.js
│   │   └── Analytics.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── question.routes.js
│   │   ├── interview.routes.js
│   │   ├── analytics.routes.js
│   │   ├── admin.routes.js
│   │   └── ai.routes.js
│   ├── services/
│   │   └── ai.service.js
│   ├── seeds/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 7.0+
- npm or yarn
- OpenAI API key (optional)
- Google Gemini API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-interview-portal.git
cd ai-interview-portal
```

2. **Set up the backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up the frontend**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai_interview_portal
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
```

5. **Seed the database**
```bash
cd backend
npm run seed
```

6. **Start the servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (new terminal):
```bash
cd frontend
npm run dev
```

7. **Open in browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Default Credentials

After seeding:
- **Admin**: admin@hireready.com / Admin@123
- **Test User**: Register a new account

## 📖 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh token |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update profile |
| PUT | `/api/users/change-password` | Change password |

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | List questions |
| GET | `/api/questions/:id` | Get question |
| POST | `/api/questions` | Create question (admin) |
| PUT | `/api/questions/:id` | Update question (admin) |
| DELETE | `/api/questions/:id` | Delete question (admin) |

### Interviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews` | Create interview |
| GET | `/api/interviews` | List user interviews |
| GET | `/api/interviews/:id` | Get interview |
| POST | `/api/interviews/:id/submit-answer` | Submit answer |
| POST | `/api/interviews/:id/complete` | Complete interview |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/stats` | Get user stats |
| GET | `/api/analytics/progress` | Get progress data |
| GET | `/api/analytics/leaderboard` | Get leaderboard |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-question` | Generate AI question |
| POST | `/api/ai/evaluate-answer` | Evaluate answer |
| POST | `/api/ai/generate-feedback` | Generate feedback |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get platform stats |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

## 🖼️ Screenshots

### Home Page
Modern landing page with feature highlights and testimonials

### Dashboard
Clean dashboard with progress overview and quick actions

### Interview Session
Interactive interview interface with timer and navigation

### Analytics
Comprehensive charts showing performance trends

### Admin Panel
Full administrative control over platform

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Google for Gemini API
- The React and Node.js communities
- All contributors to this project

---

**HireReady** - Made with ❤️ for better interview preparation
