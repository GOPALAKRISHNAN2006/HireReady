# HireReady - Backend

This is the backend API for HireReady - AI-Powered Interview Preparation & Mock Interview Portal.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI GPT-4 / Google Gemini
- **Real-time**: Socket.io
- **NLP**: natural.js

## Getting Started

### Prerequisites

- Node.js v18+ installed
- MongoDB running locally or MongoDB Atlas account
- OpenAI or Gemini API key (optional, for AI features)

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Seed initial data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/avatar` - Upload avatar
- `PUT /api/users/preferences` - Update preferences

### Questions
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/random` - Get random questions
- `GET /api/questions/categories` - Get categories with stats
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create question (admin)
- `PUT /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)

### Interviews
- `POST /api/interviews` - Create new interview
- `GET /api/interviews` - Get user's interviews
- `GET /api/interviews/:id` - Get interview details
- `PUT /api/interviews/:id/start` - Start interview
- `POST /api/interviews/:id/submit-answer` - Submit answer
- `PUT /api/interviews/:id/complete` - Complete interview
- `GET /api/interviews/:id/report` - Get detailed report

### Analytics
- `GET /api/analytics` - Get full analytics
- `GET /api/analytics/summary` - Get dashboard summary
- `GET /api/analytics/progress` - Get progress over time
- `GET /api/analytics/leaderboard` - Get leaderboard

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/questions/pending` - Get pending questions
- `PUT /api/admin/questions/:id/approve` - Approve question

### AI
- `POST /api/ai/generate-questions` - Generate questions (admin)
- `POST /api/ai/evaluate-answer` - Evaluate answer
- `POST /api/ai/generate-feedback` - Generate feedback
- `POST /api/ai/analyze-resume` - Analyze resume

## Project Structure

```
backend/
├── config/           # Configuration files
├── middleware/       # Express middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── services/         # Business logic services
├── seeds/            # Database seeders
├── uploads/          # Uploaded files
└── server.js         # Entry point
```

## Default Admin Credentials

After running seed data:
- Email: admin@aiportal.com
- Password: Admin@123

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed initial data
- `npm test` - Run tests
