import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, Button } from '../../components/ui';
import { LoadingCard } from '../../components/ui/Spinner';
import api from '../../services/api';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  MessageSquare,
  TrendingUp,
  BarChart3,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';

const CATEGORIES = {
  'general': 'General',
  'dsa': 'DSA',
  'web': 'Web Development',
  'web-development': 'Web Development',
  'ml': 'Machine Learning',
  'machine-learning': 'Machine Learning',
  'system-design': 'System Design',
  'behavioral': 'Behavioral',
  'database': 'Database',
  'devops': 'DevOps',
  'mobile': 'Mobile',
  'mixed': 'Mixed',
};

const STATUS_STYLES = {
  'completed': 'bg-green-100 text-green-600 border border-green-300',
  'in-progress': 'bg-yellow-100 text-yellow-600 border border-yellow-300',
  'pending': 'bg-blue-100 text-blue-600 border border-blue-300',
  'scheduled': 'bg-blue-100 text-blue-600 border border-blue-300',
  'cancelled': 'bg-red-100 text-red-600 border border-red-300',
};

const DIFFICULTY_STYLES = {
  'easy': 'bg-green-100 text-green-600',
  'medium': 'bg-yellow-100 text-yellow-600',
  'hard': 'bg-red-100 text-red-600',
};

export default function AdminInterviewDetails() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  // Fetch interview details
  const { data: interviewData, isLoading, error } = useQuery({
    queryKey: ['admin-interview-detail', interviewId],
    queryFn: async () => {
      const response = await api.get(`/admin/interviews/${interviewId}`);
      console.log('Interview API Response:', response.data);
      return response.data?.data?.interview || response.data?.interview || response.data;
    },
    enabled: !!interviewId,
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 70) return <ThumbsUp className="w-4 h-4 text-green-600" />;
    if (score >= 40) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <ThumbsDown className="w-4 h-4 text-red-600" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/interviews')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Button>
          <LoadingCard message="Loading interview details..." />
        </div>
      </div>
    );
  }

  if (error || !interviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/interviews')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Button>
          <Card className="bg-white shadow-md border border-slate-200">
            <div className="p-12 text-center">
              <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Interview Not Found</h2>
              <p className="text-slate-500">The interview you're looking for doesn't exist or has been deleted.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const interview = interviewData || {};
  const user = interview?.user || {};
  const responses = interview?.responses || [];
  const answeredQuestions = responses.filter(r => r?.answer).length;
  const avgScore = responses.length > 0
    ? Math.round(responses.reduce((acc, r) => acc + (r?.score || 0), 0) / responses.length)
    : 0;

  // Debug log
  console.log('Interview Data:', interview);
  console.log('User:', user);
  console.log('Responses:', responses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/interviews')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Button>
        </div>

        {/* Interview Title Card */}
        <Card className="bg-white shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {CATEGORIES[interview?.category] || interview?.category || 'Interview'} Interview
                  </h1>
                  <p className="text-white/80 mt-1">
                    {interview?.totalQuestions || 0} Questions • {interview?.difficulty || 'N/A'} difficulty
                  </p>
                </div>
              </div>
              <Badge className={STATUS_STYLES[interview?.status] || 'bg-slate-100 text-slate-600'}>
                {interview?.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                {interview?.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                {interview?.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                {interview?.status || 'Unknown'}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            <div className="p-6 text-center">
              <div className={`text-3xl font-bold ${getScoreColor(interview?.overallScore || 0)}`}>
                {Math.round(interview?.overallScore || 0)}%
              </div>
              <p className="text-slate-500 text-sm mt-1">Overall Score</p>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-800">
                {answeredQuestions}/{interview?.totalQuestions || 0}
              </div>
              <p className="text-slate-500 text-sm mt-1">Questions Answered</p>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-800">
                {formatDuration(interview?.startedAt, interview?.completedAt)}
              </div>
              <p className="text-slate-500 text-sm mt-1">Duration</p>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-800">{avgScore}%</div>
              <p className="text-slate-500 text-sm mt-1">Avg Question Score</p>
            </div>
          </div>
        </Card>

        {/* User Info & Interview Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <Card className="bg-white shadow-md border border-slate-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Candidate Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Interview Details */}
          <Card className="bg-white shadow-md border border-slate-200 lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Interview Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 text-sm">Category</p>
                  <p className="font-medium text-slate-900">
                    {CATEGORIES[interview?.category] || interview?.category || 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 text-sm">Difficulty</p>
                  <Badge className={DIFFICULTY_STYLES[interview?.difficulty] || 'bg-slate-100'}>
                    {interview?.difficulty || 'N/A'}
                  </Badge>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 text-sm">Status</p>
                  <Badge className={STATUS_STYLES[interview?.status] || 'bg-slate-100'}>
                    {interview?.status || 'N/A'}
                  </Badge>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 text-sm">Started At</p>
                  <p className="font-medium text-slate-900 text-sm">
                    {formatDate(interview?.startedAt || interview?.createdAt)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 text-sm">Completed At</p>
                  <p className="font-medium text-slate-900 text-sm">
                    {formatDate(interview?.completedAt)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-500 text-sm">Interview ID</p>
                  <p className="font-mono text-xs text-slate-600 truncate">
                    {interview?._id || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Questions & Responses */}
        <Card className="bg-white shadow-md border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Questions & Responses ({responses.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {responses.length > 0 ? (
              responses.map((response, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-600 text-xs">
                          {response.question?.category || 'General'}
                        </Badge>
                        {response.question?.difficulty && (
                          <Badge className={DIFFICULTY_STYLES[response.question.difficulty] || 'bg-slate-100 text-xs'}>
                            {response.question.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {response.score !== undefined && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBgColor(response.score)}`}>
                        {getScoreIcon(response.score)}
                        <span className={`font-bold ${getScoreColor(response.score)}`}>
                          {Math.round(response.score)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Question */}
                  <div className="mb-4">
                    <p className="text-slate-900 font-medium">
                      {response.question?.text || response.questionText || 'Question not available'}
                    </p>
                  </div>

                  {/* Answer */}
                  {response.answer ? (
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 text-sm font-medium">Candidate's Answer</span>
                      </div>
                      <p className="text-slate-800">{response.answer}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-4 mb-4 text-center">
                      <p className="text-slate-400 italic">No answer provided</p>
                    </div>
                  )}

                  {/* AI Feedback */}
                  {response.feedback && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-700 text-sm font-medium">AI Feedback</span>
                      </div>
                      <p className="text-slate-700 text-sm">{response.feedback}</p>
                    </div>
                  )}

                  {/* Time Taken */}
                  {response.timeTaken && (
                    <div className="mt-3 flex items-center gap-2 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Time taken: {Math.round(response.timeTaken / 1000)}s</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No responses recorded for this interview</p>
              </div>
            )}
          </div>
        </Card>

        {/* Performance Summary */}
        {interview?.overallFeedback && (
          <Card className="bg-white shadow-md border border-slate-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Overall Performance Feedback
              </h3>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                <p className="text-slate-700">{interview?.overallFeedback}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
