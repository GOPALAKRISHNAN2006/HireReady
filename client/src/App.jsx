import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import SEO from './components/SEO';

// Page Loader spinner component for dynamic chunks
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8">
    <div className="relative w-16 h-16">
      {/* Outer spinning ring */}
      <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 border-t-primary-600 animate-spin" />
      {/* Inner glowing pulse */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500/30 to-indigo-500/30 animate-pulse backdrop-blur-sm" />
    </div>
    <div className="text-center space-y-1">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 animate-pulse">
        Loading page...
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500">Optimizing experience</p>
    </div>
  </div>
);

// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const InterviewSetup = lazy(() => import('./pages/InterviewSetup'));
const Interview = lazy(() => import('./pages/Interview'));
const InterviewResult = lazy(() => import('./pages/InterviewResult'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Questions = lazy(() => import('./pages/Questions'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminUserDetails = lazy(() => import('./pages/admin/AdminUserDetails'));
const AdminQuestions = lazy(() => import('./pages/admin/AdminQuestions'));
const AdminAptitude = lazy(() => import('./pages/admin/AdminAptitude'));
const AdminGDTopics = lazy(() => import('./pages/admin/AdminGDTopics'));
const AdminInterviews = lazy(() => import('./pages/admin/AdminInterviews'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// New Feature Pages
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const ResumeEditor = lazy(() => import('./pages/ResumeEditor'));
const Aptitude = lazy(() => import('./pages/Aptitude'));
const AptitudeTest = lazy(() => import('./pages/AptitudeTest'));
const AptitudeResult = lazy(() => import('./pages/AptitudeResult'));
const AptitudeHistory = lazy(() => import('./pages/AptitudeHistory'));
const GroupDiscussion = lazy(() => import('./pages/GroupDiscussion'));
const GDSession = lazy(() => import('./pages/GDSession'));
const GDResult = lazy(() => import('./pages/GDResult'));

// Additional Feature Pages
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Settings = lazy(() => import('./pages/Settings'));
const PracticeHistory = lazy(() => import('./pages/PracticeHistory'));
const Help = lazy(() => import('./pages/Help'));
const Notifications = lazy(() => import('./pages/Notifications'));
const SavedQuestions = lazy(() => import('./pages/SavedQuestions'));
const CompanyPrep = lazy(() => import('./pages/CompanyPrep'));
const StudyMaterials = lazy(() => import('./pages/StudyMaterials'));

// New Unique Pages
const CareerRoadmap = lazy(() => import('./pages/CareerRoadmap'));
const SkillRadar = lazy(() => import('./pages/SkillRadar'));
const InterviewTips = lazy(() => import('./pages/InterviewTips'));
const CommunityHub = lazy(() => import('./pages/CommunityHub'));
const DailyChallenge = lazy(() => import('./pages/DailyChallenge'));
const ChallengeSolve = lazy(() => import('./pages/ChallengeSolve'));
const CommunicationAssessment = lazy(() => import('./pages/CommunicationAssessment'));
const CommunicationTest = lazy(() => import('./pages/CommunicationTest'));
const MaterialContent = lazy(() => import('./pages/MaterialContent'));
const ProctoringDashboard = lazy(() => import('./pages/admin/ProctoringDashboard'));
const CompanyDetail = lazy(() => import('./pages/CompanyDetail'));
const InterviewFeedback = lazy(() => import('./pages/InterviewFeedback'));
const StudyPlan = lazy(() => import('./pages/StudyPlan'));
const MockInterviewLab = lazy(() => import('./pages/MockInterviewLab'));
const AIChatPage = lazy(() => import('./pages/AIChatPage'));
const InterviewNotes = lazy(() => import('./pages/InterviewNotes'));
const ProgressReport = lazy(() => import('./pages/ProgressReport'));
const Flashcards = lazy(() => import('./pages/Flashcards'));

// Legal / Info Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Contact = lazy(() => import('./pages/Contact'));

// Public Interview Question SEO Pages
const PublicQuestionsDirectory = lazy(() => import('./pages/public/PublicQuestionsDirectory'));
const PublicQuestionCategory = lazy(() => import('./pages/public/PublicQuestionCategory'));

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <SEO robots="noindex, nofollow" />
      {children}
    </>
  );
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // If user is admin and admin-specific redirect requested, send to admin
    if (redirectTo === '/admin' && user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();
  const { initializeSettings } = useSettingsStore();

  // Check auth status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Initialize settings (theme, font size, etc.) on app load
  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/interview-questions" element={<PublicQuestionsDirectory />} />
        <Route path="/interview-questions/:category" element={<PublicQuestionCategory />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/admin/login"
            element={
              <PublicRoute redirectTo="/admin">
                <AdminLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route path="/verify-email/:token?" element={<VerifyEmail />} />
        </Route>

        {/* Full Screen Interview Route - No Layout Wrapper */}
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/setup"
            element={
              <ProtectedRoute>
                <InterviewSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:id/result"
            element={
              <ProtectedRoute>
                <InterviewResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <ProtectedRoute>
                <Questions />
              </ProtectedRoute>
            }
          />

          {/* Resume Builder Routes */}
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/new"
            element={
              <ProtectedRoute>
                <ResumeEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/:id"
            element={
              <ProtectedRoute>
                <ResumeEditor />
              </ProtectedRoute>
            }
          />

          {/* Aptitude Test Routes */}
          <Route
            path="/aptitude"
            element={
              <ProtectedRoute>
                <Aptitude />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aptitude/test/:testId"
            element={
              <ProtectedRoute>
                <AptitudeTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aptitude/result/:testId"
            element={
              <ProtectedRoute>
                <AptitudeResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aptitude/result"
            element={
              <ProtectedRoute>
                <AptitudeResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aptitude/history"
            element={
              <ProtectedRoute>
                <AptitudeHistory />
              </ProtectedRoute>
            }
          />

          {/* Group Discussion Routes */}
          <Route
            path="/gd"
            element={
              <ProtectedRoute>
                <GroupDiscussion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gd/session/:sessionId"
            element={
              <ProtectedRoute>
                <GDSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gd/result/:sessionId"
            element={
              <ProtectedRoute>
                <GDResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gd/result"
            element={
              <ProtectedRoute>
                <GDResult />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          {/* Achievements */}
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Practice History */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <PracticeHistory />
              </ProtectedRoute>
            }
          />

          {/* Help */}
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Saved Questions */}
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedQuestions />
              </ProtectedRoute>
            }
          />

          {/* Company Preparation */}
          <Route
            path="/company-prep"
            element={
              <ProtectedRoute>
                <CompanyPrep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/:companyId"
            element={
              <ProtectedRoute>
                <CompanyDetail />
              </ProtectedRoute>
            }
          />

          {/* Study Materials */}
          <Route
            path="/study-materials"
            element={
              <ProtectedRoute>
                <StudyMaterials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-materials/:id"
            element={
              <ProtectedRoute>
                <MaterialContent />
              </ProtectedRoute>
            }
          />

          {/* New Unique Feature Routes */}
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <CareerRoadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillRadar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tips"
            element={
              <ProtectedRoute>
                <InterviewTips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-challenge"
            element={
              <ProtectedRoute>
                <DailyChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-challenge/solve/:id"
            element={
              <ProtectedRoute>
                <ChallengeSolve />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <CommunicationAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communication/test"
            element={
              <ProtectedRoute>
                <CommunicationTest />
              </ProtectedRoute>
            }
          />

          {/* Interview Feedback / Debrief */}
          <Route
            path="/interview/:id/feedback"
            element={
              <ProtectedRoute>
                <InterviewFeedback />
              </ProtectedRoute>
            }
          />

          {/* Study Plan */}
          <Route
            path="/study-plan"
            element={
              <ProtectedRoute>
                <StudyPlan />
              </ProtectedRoute>
            }
          />

          {/* Mock Interview Lab */}
          <Route
            path="/mock-lab"
            element={
              <ProtectedRoute>
                <MockInterviewLab />
              </ProtectedRoute>
            }
          />

          {/* AI Chat Page */}
          <Route
            path="/ai-chat"
            element={
              <ProtectedRoute>
                <AIChatPage />
              </ProtectedRoute>
            }
          />

          {/* Interview Notes */}
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <InterviewNotes />
              </ProtectedRoute>
            }
          />

          {/* Progress Report */}
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressReport />
              </ProtectedRoute>
            }
          />

          {/* Flashcards */}
          <Route
            path="/flashcards"
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute adminOnly>
                <AdminUserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute adminOnly>
                <AdminQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/aptitude"
            element={
              <ProtectedRoute adminOnly>
                <AdminAptitude />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gd-topics"
            element={
              <ProtectedRoute adminOnly>
                <AdminGDTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/interviews"
            element={
              <ProtectedRoute adminOnly>
                <AdminInterviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proctoring"
            element={
              <ProtectedRoute adminOnly>
                <ProctoringDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
