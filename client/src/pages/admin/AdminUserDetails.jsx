import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Badge, Button } from '../../components/ui'
import { LoadingCard } from '../../components/ui/Spinner'
import api from '../../services/api'
import { 
  ArrowLeft,
  Users, 
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react'

const AdminUserDetails = () => {
  const { userId } = useParams()
  const navigate = useNavigate()

  // Fetch user details
  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: async () => {
      const response = await api.get(`/admin/users/${userId}`)
      return response.data?.data || response.data
    },
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/users')} icon={ArrowLeft}>
          Back to Users
        </Button>
        <LoadingCard message="Loading user details..." />
      </div>
    )
  }

  if (error || !userDetails) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/users')} icon={ArrowLeft}>
          Back to Users
        </Button>
        <Card className="text-center py-12">
          <XCircle className="w-16 h-16 mx-auto text-rose-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400">The user you're looking for doesn't exist or has been deleted.</p>
        </Card>
      </div>
    )
  }

  const user = userDetails?.user
  const analytics = userDetails?.analytics
  const interviews = userDetails?.interviews || []
  const aptitudeTests = userDetails?.aptitudeTests || []
  const gdSessions = userDetails?.gdSessions || []
  const resumes = userDetails?.resumes || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/users')} icon={ArrowLeft}>
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            user?.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            {user?.role}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            user?.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30'
          }`}>
            {user?.isActive ? 'Active' : 'Banned'}
          </span>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6">
        <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white mb-5">
          <Users className="w-5 h-5 mr-2 text-indigo-600" />
          User Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Full Name</p>
              <p className="font-medium text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
              <p className="font-medium text-slate-900 dark:text-white">{user?.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Joined</p>
              <p className="font-medium text-slate-900 dark:text-white">{new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Total Interviews</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{analytics?.totalInterviews || 0}</p>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 font-medium">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {analytics?.averageScore || 0}% avg score
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Aptitude Tests</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{analytics?.totalAptitudeTests || 0}</p>
              <p className="text-violet-600 dark:text-violet-400 text-sm mt-2 font-medium">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {analytics?.averageAptitudeScore || 0}% avg score
              </p>
            </div>
            <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">GD Sessions</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{analytics?.totalGDSessions || 0}</p>
              <p className="text-amber-600 dark:text-amber-400 text-sm mt-2 font-medium">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {analytics?.averageGDScore || 0}% avg score
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Resumes Created</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{analytics?.totalResumes || 0}</p>
              <p className="text-teal-600 dark:text-teal-400 text-sm mt-2 font-medium">
                <FileText className="w-4 h-4 inline mr-1" />
                Documents
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Interview History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
          <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
            <Target className="w-5 h-5 mr-2 text-emerald-600" />
            Interview History ({interviews.length})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All mock interviews taken by this user</p>
        </div>
        <div className="p-6">
          {interviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {interviews.map((interview) => (
                    <tr key={interview._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30">{interview.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          interview.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' :
                          interview.difficulty === 'hard' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30' :
                          'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'
                        }`}>{interview.difficulty}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {interview.questionsAnswered || 0}/{interview.totalQuestions}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          interview.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'
                        }`}>{interview.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {interview.overallScore > 0 ? (
                          <span className={`font-bold ${interview.overallScore >= 70 ? 'text-emerald-600 dark:text-emerald-400' : interview.overallScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {interview.overallScore}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No interviews yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Aptitude Tests */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
          <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
            <Clock className="w-5 h-5 mr-2 text-violet-600" />
            Aptitude Test Results ({aptitudeTests.length})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All aptitude tests taken by this user</p>
        </div>
        <div className="p-6">
          {aptitudeTests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Correct</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {aptitudeTests.map((test) => (
                    <tr key={test._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800/30">{test.category}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {test.totalQuestions}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {test.correctAnswers || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          test.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'
                        }`}>{test.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {test.percentage > 0 ? (
                          <span className={`font-bold ${test.percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : test.percentage >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {test.percentage}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No aptitude tests taken</p>
            </div>
          )}
        </div>
      </div>

      {/* GD Sessions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
          <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
            <MessageSquare className="w-5 h-5 mr-2 text-amber-600" />
            Group Discussion Sessions ({gdSessions.length})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All GD sessions participated in</p>
        </div>
        <div className="p-6">
          {gdSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mode</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {gdSessions.map((session) => (
                    <tr key={session._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900 dark:text-white truncate max-w-xs block">
                          {session.topicTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">{session.mode}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {session.duration || '-'} min
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'
                        }`}>{session.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {session.feedback?.overallScore > 0 ? (
                          <span className={`font-bold ${session.feedback.overallScore >= 70 ? 'text-emerald-600 dark:text-emerald-400' : session.feedback.overallScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {session.feedback.overallScore}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No GD sessions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Resumes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
          <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
            <FileText className="w-5 h-5 mr-2 text-teal-600" />
            Resumes ({resumes.length})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All resumes created by this user</p>
        </div>
        <div className="p-6">
          {resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <div key={resume._id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{resume.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {resume.personalInfo?.fullName || 'No name set'}
                      </p>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800/30 mt-2">
                        {resume.template} template
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
                    <p>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No resumes created</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUserDetails
