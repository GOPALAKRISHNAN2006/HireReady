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
          <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-500">The user you're looking for doesn't exist or has been deleted.</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/users')} icon={ArrowLeft}>
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={user?.role === 'admin' ? 'primary' : 'default'} size="lg">
            {user?.role}
          </Badge>
          <Badge variant={user?.isActive ? 'success' : 'danger'} size="lg">
            {user?.isActive ? 'Active' : 'Banned'}
          </Badge>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-600" />
            User Information
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-medium text-gray-900">{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Performance Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Interviews</p>
              <p className="text-3xl font-bold mt-1">{analytics?.totalInterviews || 0}</p>
              <p className="text-blue-200 text-sm mt-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {analytics?.averageScore || 0}% avg score
              </p>
            </div>
            <Target className="w-12 h-12 text-blue-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Aptitude Tests</p>
              <p className="text-3xl font-bold mt-1">{analytics?.totalAptitudeTests || 0}</p>
              <p className="text-purple-200 text-sm mt-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {analytics?.averageAptitudeScore || 0}% avg score
              </p>
            </div>
            <Clock className="w-12 h-12 text-purple-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">GD Sessions</p>
              <p className="text-3xl font-bold mt-1">{analytics?.totalGDSessions || 0}</p>
              <p className="text-orange-200 text-sm mt-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {analytics?.averageGDScore || 0}% avg score
              </p>
            </div>
            <MessageSquare className="w-12 h-12 text-orange-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Resumes Created</p>
              <p className="text-3xl font-bold mt-1">{analytics?.totalResumes || 0}</p>
              <p className="text-teal-200 text-sm mt-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Documents
              </p>
            </div>
            <FileText className="w-12 h-12 text-teal-200" />
          </div>
        </Card>
      </div>

      {/* Interview History */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Interview History ({interviews.length})
          </Card.Title>
          <Card.Description>All mock interviews taken by this user</Card.Description>
        </Card.Header>
        <Card.Content>
          {interviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {interviews.map((interview) => (
                    <tr key={interview._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Badge variant="primary">{interview.category}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={interview.difficulty === 'easy' ? 'success' : interview.difficulty === 'hard' ? 'danger' : 'warning'}>
                          {interview.difficulty}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {interview.questionsAnswered || 0}/{interview.totalQuestions}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={interview.status === 'completed' ? 'success' : 'warning'}>
                          {interview.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {interview.overallScore > 0 ? (
                          <span className={`font-bold ${interview.overallScore >= 70 ? 'text-green-600' : interview.overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {interview.overallScore}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No interviews yet</p>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Aptitude Tests */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Aptitude Test Results ({aptitudeTests.length})
          </Card.Title>
          <Card.Description>All aptitude tests taken by this user</Card.Description>
        </Card.Header>
        <Card.Content>
          {aptitudeTests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correct</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {aptitudeTests.map((test) => (
                    <tr key={test._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Badge variant="purple">{test.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {test.totalQuestions}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {test.correctAnswers || 0}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={test.status === 'completed' ? 'success' : 'warning'}>
                          {test.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {test.percentage > 0 ? (
                          <span className={`font-bold ${test.percentage >= 70 ? 'text-green-600' : test.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {test.percentage}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No aptitude tests taken</p>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* GD Sessions */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
            Group Discussion Sessions ({gdSessions.length})
          </Card.Title>
          <Card.Description>All GD sessions participated in</Card.Description>
        </Card.Header>
        <Card.Content>
          {gdSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gdSessions.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900 truncate max-w-xs block">
                          {session.topicTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default">{session.mode}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {session.duration || '-'} min
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                          {session.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {session.feedback?.overallScore > 0 ? (
                          <span className={`font-bold ${session.feedback.overallScore >= 70 ? 'text-green-600' : session.feedback.overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {session.feedback.overallScore}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No GD sessions yet</p>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Resumes */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-teal-600" />
            Resumes ({resumes.length})
          </Card.Title>
          <Card.Description>All resumes created by this user</Card.Description>
        </Card.Header>
        <Card.Content>
          {resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <div key={resume._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{resume.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {resume.personalInfo?.fullName || 'No name set'}
                      </p>
                      <Badge variant="default" size="sm" className="mt-2">
                        {resume.template} template
                      </Badge>
                    </div>
                    <FileText className="w-8 h-8 text-teal-400" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">
                    <p>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No resumes created</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

export default AdminUserDetails
