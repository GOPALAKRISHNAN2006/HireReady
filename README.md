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
- 📋 **Interview Debrief**: Post-interview feedback with strengths, weaknesses, and personalized tips
- 📅 **Study Plan Tracker**: Personalized study plan with progress tracking and spaced repetition reminders
- 🧩 **Rich UI Components**: Code editor, tabs, progress bars, tooltips, accordions, and more

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
Hireready/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI pipeline (lint, test, build, E2E)
│   │   └── codeql.yml          # Security scanning
│   └── dependabot.yml          # Auto dependency updates
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── monitoring/          # Sentry integration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── e2e/                     # Playwright E2E tests
│   ├── tests/                   # Accessibility tests
│   └── package.json
├── server/                      # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── seeds/
│   ├── tests/
│   ├── openapi.yaml             # API documentation
│   ├── server.js
│   └── package.json
├── docs/
│   ├── postman_collection.json
│   └── schema.md
├── package.json                 # Root (Husky, Prettier, lint-staged)
├── .prettierrc
├── CHANGELOG.md
├── LICENSE
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
git clone https://github.com/YOUR_USERNAME/Interview-Portal-main.git
cd Interview-Portal-main
```

2. **Install root dependencies** (Husky, Prettier, lint-staged)
```bash
npm install
```

3. **Set up the backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the frontend**
```bash
cd ../client
npm install
cp .env.example .env
# Edit .env with your configuration
```

5. **Configure environment variables**

Important: do not commit real environment files (`.env`).
Only keep template files such as `.env.example` and `.env.prod.example` in git.

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-interview-portal
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SENTRY_DSN=           # Optional: for error monitoring
```

6. **Seed the database**
```bash
cd server
npm run seed
```

7. **Start the servers**

Backend:
```bash
cd server
npm run dev
```

Frontend (new terminal):
```bash
cd client
npm run dev
```

8. **Open in browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Default Credentials

After seeding:
- **Admin**: hireready007@gmail.com / Hireready@12345
- **Admin (secondary)**: admin@interviewportal.com / Admin@123456

## 📖 API Documentation

Live interactive API documentation (Swagger UI) is available when the backend is running at: [http://localhost:5000/api/docs](http://localhost:5000/api/docs).

Database schema and ERD: see [docs/schema.md](docs/schema.md).

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

<!-- Replace OWNER/REPO in the badge URL with your GitHub repo -->
[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)

## CI / Tests

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs server linting, server tests with coverage, client linting, accessibility checks, and the client build on push/PR to `main`.

Run the same checks locally:

```bash
# Server: install, lint, test with coverage
cd server
npm ci
npm run lint
npm run test:ci

# Client: install, lint, run accessibility tests, build
cd ../client
npm ci
npm run lint
npm run test:a11y || true
npm run build
```

Add a GitHub secret `NODE_AUTH_TOKEN` or configure package registries if you use private packages.

## 🚀 Deployment

### Production Checklist

1. **Environment variables** — copy `.env.example` to `.env` in both `server/` and `client/` and fill in production values.
2. **Secrets management** — store sensitive keys (JWT_SECRET, API keys) in a vault (e.g., Azure Key Vault, AWS Secrets Manager, HashiCorp Vault) and inject them at runtime.
3. **Database** — use a managed MongoDB Atlas cluster or self-hosted replica set with authentication enabled.
4. **HTTPS** — terminate TLS at a reverse proxy (nginx, Caddy) or load balancer.
5. **Build client** — run `npm run build` in `client/` and serve the `dist/` folder via a CDN or static host.
6. **Run server** — use a process manager (`pm2`, `systemd`) for the backend.

## 📈 Monitoring & Alerting

- **Logging** — use `morgan` (already included) and ship logs to a centralized service (ELK, Datadog, Loki).
- **APM** — integrate Application Performance Monitoring (New Relic, Datadog APM, or OpenTelemetry) for request tracing.
- **Health checks** — the backend exposes `GET /health` (add if missing) for load balancer probes.
- **Uptime** — configure uptime monitors (UptimeRobot, Pingdom) for public endpoints.
- **Alerts** — set up alerts on error rate spikes, latency, and resource usage in your monitoring tool.
- **Frontend monitoring** — optional Sentry integration included. Provide `VITE_SENTRY_DSN` (and sampling rates) in `client/.env` and view errors/performance data in your Sentry project. Wraps the React app in a Sentry error boundary by default.

## 🧪 End-to-End Tests

E2E tests use Playwright and live in `client/e2e/`. Run locally:

```bash
cd client
npx playwright install --with-deps   # first time only
npm run test:e2e
```

To open interactive UI mode:

```bash
npm run test:e2e:ui
```

## 🤖 AI API Configuration

HireReady supports both OpenAI and Google Gemini for AI-powered features.

### OpenAI Setup

1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys and create a new key
3. Add to `server/.env`:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-api-key-here
   OPENAI_MODEL=gpt-4
   ```

### Google Gemini Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `server/.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your-gemini-api-key
   GEMINI_MODEL=gemini-pro
   ```

### AI Features

- **Question Generation**: AI generates interview questions based on role and difficulty
- **Answer Evaluation**: AI evaluates responses for accuracy, completeness, and communication
- **Feedback Generation**: Detailed, actionable feedback with improvement suggestions
- **Chatbot Assistant**: 24/7 AI-powered help for interview preparation

## 💳 Payment Integration (Stripe)

### Setup

1. Create a [Stripe account](https://dashboard.stripe.com)
2. Get your API keys from the Dashboard
3. Create subscription products and price IDs
4. Add to `server/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_BASIC_MONTHLY=price_...
   ```

### Webhook Setup

1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/payments/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`

## 🖥️ Production Deployment with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### PM2 Commands

```bash
pm2 status          # Check status
pm2 logs            # View logs
pm2 reload all      # Zero-downtime reload
pm2 stop all        # Stop all processes
pm2 monit           # Real-time monitoring
```
