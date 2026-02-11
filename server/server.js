/**
 * ===========================================
 * HireReady - Main Server Entry Point
 * ===========================================
 * 
 * This is the main entry point for the Node.js/Express backend server.
 * It initializes the Express app, connects to MongoDB, and starts the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
require('dotenv').config();

// Validate important environment variables
const { validateEnv } = require('./config/env');
validateEnv();

// Import database connection
const connectDB = require('./config/database');

// Import route handlers
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const questionRoutes = require('./routes/question.routes');
const interviewRoutes = require('./routes/interview.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');
const adminRoutesV2 = require('./routes/admin.routes.v2');
const aiRoutes = require('./routes/ai.routes');
const resumeRoutes = require('./routes/resume.routes');
const aptitudeRoutes = require('./routes/aptitude.routes');
const gdRoutes = require('./routes/gd.routes');

// New feature routes
const challengeRoutes = require('./routes/challenge.routes');
const communityRoutes = require('./routes/community.routes');
const careerRoutes = require('./routes/career.routes');
const skillRoutes = require('./routes/skill.routes');
const tipRoutes = require('./routes/tip.routes');
const proctoringRoutes = require('./routes/proctoring.routes');
const communicationRoutes = require('./routes/communication.routes');

// Swagger/OpenAPI (optional — gracefully skip if not installed)
let swaggerUi, swaggerDocument;
try {
  swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');
  swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
} catch {
  console.warn('⚠️ swagger-ui-express or yamljs not installed – /api/docs will be unavailable');
}

// Import error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io for real-time features
const io = socketIo(server, {
  cors: {
    origin: (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(u => u.trim()),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// ===========================================
// Middleware Configuration
// ===========================================

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Rate limits for auth routes (allow enough for signup + verification + retries)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { success: false, message: 'Too many authentication attempts, please try later.' }
});
app.use('/api/auth', authLimiter);

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many admin requests, slow down.' }
});
app.use('/api/admin', adminLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (for uploaded content)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===========================================
// API Routes
// ===========================================

// Health check endpoint (basic)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HireReady API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Health check endpoint (detailed - for monitoring)
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const health = {
    status: dbState === 1 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: require('./package.json').version,
    database: {
      status: dbStatus[dbState] || 'unknown',
      name: mongoose.connection.name || 'N/A'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  };
  
  res.status(dbState === 1 ? 200 : 503).json(health);
});

// Serve API docs (Swagger UI)
if (swaggerUi && swaggerDocument) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/v2', adminRoutesV2);
app.use('/api/ai', aiRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/gd', gdRoutes);

// New feature routes
app.use('/api/challenges', challengeRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/proctoring', proctoringRoutes);
app.use('/api/communication', communicationRoutes);

// ===========================================
// Socket.io Event Handlers
// ===========================================

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join a specific interview room
  socket.on('joinInterview', (interviewId) => {
    socket.join(`interview_${interviewId}`);
    console.log(`Socket ${socket.id} joined interview room: ${interviewId}`);
  });

  // Handle real-time answer submission
  socket.on('submitAnswer', async (data) => {
    // Process answer and emit feedback
    io.to(`interview_${data.interviewId}`).emit('answerReceived', {
      questionId: data.questionId,
      timestamp: new Date().toISOString()
    });
  });

  // Handle interview completion
  socket.on('completeInterview', (interviewId) => {
    io.to(`interview_${interviewId}`).emit('interviewCompleted', {
      interviewId,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ===========================================
// Error Handling
// ===========================================

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// ===========================================
// Database Connection & Server Start
// ===========================================

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 HireReady Server Started`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.io enabled for real-time features`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Start the server only when this file is run directly (not when required in tests)
if (require.main === module) {
  startServer();
}

module.exports = { app, server, io };
