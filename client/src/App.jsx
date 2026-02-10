import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useSettingsStore } from './store/settingsStore'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Pricing from './pages/Pricing'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import InterviewSetup from './pages/InterviewSetup'
import Interview from './pages/Interview'
import InterviewResult from './pages/InterviewResult'
import Analytics from './pages/Analytics'
import Questions from './pages/Questions'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserDetails from './pages/admin/AdminUserDetails'
import AdminQuestions from './pages/admin/AdminQuestions'
import AdminAptitude from './pages/admin/AdminAptitude'
import AdminGDTopics from './pages/admin/AdminGDTopics'
import AdminInterviews from './pages/admin/AdminInterviews'
import AdminSettings from './pages/admin/AdminSettings'
import NotFound from './pages/NotFound'

// New Feature Pages
import ResumeBuilder from './pages/ResumeBuilder'
import ResumeEditor from './pages/ResumeEditor'
import Aptitude from './pages/Aptitude'
import AptitudeTest from './pages/AptitudeTest'
import AptitudeResult from './pages/AptitudeResult'
import AptitudeHistory from './pages/AptitudeHistory'
import GroupDiscussion from './pages/GroupDiscussion'
import GDSession from './pages/GDSession'
import GDResult from './pages/GDResult'

// Additional Feature Pages
import Leaderboard from './pages/Leaderboard'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'
import PracticeHistory from './pages/PracticeHistory'
import Help from './pages/Help'
import Notifications from './pages/Notifications'
import SavedQuestions from './pages/SavedQuestions'
import CompanyPrep from './pages/CompanyPrep'
import StudyMaterials from './pages/StudyMaterials'

// New Unique Pages
import CareerRoadmap from './pages/CareerRoadmap'
import SkillRadar from './pages/SkillRadar'
import InterviewTips from './pages/InterviewTips'
import CommunityHub from './pages/CommunityHub'
import DailyChallenge from './pages/DailyChallenge'
import ChallengeSolve from './pages/ChallengeSolve'
import CommunicationAssessment from './pages/CommunicationAssessment'
import CommunicationTest from './pages/CommunicationTest'
import MaterialContent from './pages/MaterialContent'
import ProctoringDashboard from './pages/admin/ProctoringDashboard'
import CompanyDetail from './pages/CompanyDetail'
import InterviewFeedback from './pages/InterviewFeedback'
import StudyPlan from './pages/StudyPlan'
import MockInterviewLab from './pages/MockInterviewLab'
import Premium from './pages/Premium'
import PaymentSuccess from './pages/PaymentSuccess'

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Public Route (redirect if authenticated)
const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    // If user is admin and admin-specific redirect requested, send to admin
    if (redirectTo === '/admin' && user?.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  const { checkAuth } = useAuthStore()
  const { initializeSettings } = useSettingsStore()
  
  // Check auth status on app load
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  // Initialize settings (theme, font size, etc.) on app load
  useEffect(() => {
    initializeSettings()
  }, [initializeSettings])
  
  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
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
        <Route 
          path="/verify-email/:token?" 
          element={<VerifyEmail />} 
        />
      </Route>
      
      {/* Public Pricing Page */}
      <Route path="/pricing" element={<Pricing />} />
      
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

        {/* Premium & Payment */}
        <Route 
          path="/premium" 
          element={
            <ProtectedRoute>
              <Premium />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment-success" 
          element={
            <ProtectedRoute>
              <PaymentSuccess />
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
    

    </>
  )
}

export default App
