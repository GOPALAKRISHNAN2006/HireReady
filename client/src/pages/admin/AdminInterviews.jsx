import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, Eye, ChevronLeft, ChevronRight, User, Calendar, CheckCircle, XCircle, Clock, X, Award, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import { Card, Button, Spinner, Badge } from '../../components/ui';

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

// Interview Details Modal Component
function InterviewDetailsModal({ interview, onClose }) {
  const { data: detailData, isLoading, error } = useQuery({
    queryKey: ['interview-detail', interview?._id],
    queryFn: async () => {
      const response = await api.get(`/admin/interviews/${interview._id}`);
      return response.data?.data?.interview || response.data?.interview || response.data;
    },
    enabled: !!interview?._id,
    retry: false,
    refetchOnWindowFocus: false,
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const interviewDetail = detailData || interview;
  const user = interviewDetail?.user || {};
  const responses = interviewDetail?.responses || [];

  // Prevent closing on modal content click
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={handleModalClick}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {CATEGORIES[interviewDetail?.category] || interviewDetail?.category || 'Interview'} Interview
                  </h2>
                  <p className="text-white/80 mt-1">
                    {interviewDetail?.totalQuestions || responses.length || 0} Questions • {interviewDetail?.difficulty || 'N/A'} difficulty
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">
                  {Math.round(interviewDetail?.overallScore || 0)}%
                </div>
                <p className="text-xs text-white/70">Overall Score</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">
                  {responses.filter(r => r?.answer).length}/{interviewDetail?.totalQuestions || responses.length || 0}
                </div>
                <p className="text-xs text-white/70">Answered</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Badge className={STATUS_STYLES[interviewDetail?.status] || 'bg-gray-100 text-gray-600'}>
                  {interviewDetail?.status || 'Unknown'}
                </Badge>
                <p className="text-xs text-white/70 mt-1">Status</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Badge className={DIFFICULTY_STYLES[interviewDetail?.difficulty] || 'bg-gray-100'}>
                  {interviewDetail?.difficulty || 'N/A'}
                </Badge>
                <p className="text-xs text-white/70 mt-1">Difficulty</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <XCircle className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to load details</h3>
                <p className="text-gray-500 text-sm">Unable to fetch interview details. Using basic information.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Info & Interview Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Candidate Information
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.firstName || 'Unknown'} {user?.lastName || 'User'}
                        </p>
                        <p className="text-gray-500 text-sm">{user?.email || 'No email'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interview Timing */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Interview Timing
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Started:</span>
                        <span className="text-gray-900">{formatDate(interviewDetail?.startedAt || interviewDetail?.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Completed:</span>
                        <span className="text-gray-900">{formatDate(interviewDetail?.completedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions & Responses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Questions & Responses ({responses.length})
                  </h3>
                  
                  {responses.length > 0 ? (
                    <div className="space-y-4">
                      {responses.map((response, index) => (
                        <div key={response._id || index} className="border border-gray-200 rounded-xl overflow-hidden">
                          {/* Question Header */}
                          <div className="bg-gray-50 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-100 text-blue-600 text-xs">
                                  {response.question?.category || 'General'}
                                </Badge>
                                {response.question?.difficulty && (
                                  <Badge className={`${DIFFICULTY_STYLES[response.question.difficulty] || 'bg-gray-100'} text-xs`}>
                                    {response.question.difficulty}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {response.score !== undefined && (
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBg(response.score)}`}>
                                <span className={`font-bold ${getScoreColor(response.score)}`}>
                                  {Math.round(response.score)}%
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Question & Answer */}
                          <div className="p-4 space-y-4">
                            <div>
                              <p className="text-gray-900 font-medium">
                                {response.question?.text || response.questionText || 'Question not available'}
                              </p>
                            </div>

                            {response.answer ? (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 mb-2 font-medium">Candidate's Answer:</p>
                                <p className="text-gray-800">{response.answer}</p>
                              </div>
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-gray-400 italic">No answer provided</p>
                              </div>
                            )}

                            {response.feedback && (
                              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="w-4 h-4 text-indigo-600" />
                                  <span className="text-indigo-700 text-sm font-medium">AI Feedback</span>
                                </div>
                                <p className="text-gray-700 text-sm">{response.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No responses recorded for this interview</p>
                    </div>
                  )}
                </div>

                {/* Overall Feedback */}
                {interviewDetail?.overallFeedback && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      Overall Performance Feedback
                    </h3>
                    <p className="text-gray-700">{interviewDetail.overallFeedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
            <Button onClick={onClose} variant="outline" className="border-gray-300">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminInterviews() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Fetch all interviews
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-interviews', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      const response = await api.get(`/admin/interviews?${params}`);
      return response.data.data;
    },
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Interview Reviews</h1>
            <p className="text-gray-500">Review all user interviews and their performance</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-md border border-gray-200 mb-6">
          <div className="p-4 flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="completed" className="bg-white">Completed</option>
              <option value="in-progress" className="bg-white">In Progress</option>
              <option value="pending" className="bg-white">Pending</option>
              <option value="cancelled" className="bg-white">Cancelled</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORIES).map(([value, label]) => (
                <option key={value} value={value} className="bg-white">{label}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 border border-red-200 shadow-md">
            <div className="p-6 text-center">
              <p className="text-red-600 font-medium">Failed to load interviews</p>
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            </div>
          </Card>
        )}

        {/* Interviews List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !error && (
          <>
            <div className="space-y-4">
              {data?.interviews?.map((interview) => (
                <Card key={interview._id} className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-gray-800 font-medium">
                                {interview.user?.firstName} {interview.user?.lastName}
                              </p>
                              <p className="text-gray-500 text-sm">{interview.user?.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <Badge className={STATUS_STYLES[interview.status] || 'bg-gray-100 text-gray-600 border border-gray-300'}>
                            {interview.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {interview.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                            {interview.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                            {interview.status}
                          </Badge>
                          <Badge className="bg-indigo-100 text-indigo-600 border border-indigo-300">
                            {CATEGORIES[interview.category] || interview.category}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-600 border border-blue-300">
                            {interview.difficulty}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(interview.createdAt)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Questions:</span>{' '}
                            <span className="text-gray-700">{interview.questionsAnswered || 0}/{interview.totalQuestions}</span>
                          </div>
                          {interview.overallScore !== undefined && (
                            <div>
                              <span className="text-gray-500">Score:</span>{' '}
                              <span className={`font-bold ${getScoreColor(interview.overallScore)}`}>
                                {Math.round(interview.overallScore)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedInterview(interview)}
                        variant="outline"
                        className="border-blue-500/50 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {data?.interviews?.length === 0 && (
                <Card className="bg-white shadow-md border border-gray-200">
                  <div className="p-12 text-center">
                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No interviews found</p>
                  </div>
                </Card>
              )}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-gray-700 flex items-center">
                  Page {page} of {data.pagination.pages}
                </span>
                <Button
                  onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={page === data.pagination.pages}
                  variant="outline"
                  className="border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interview Details Modal */}
      {selectedInterview && (
        <InterviewDetailsModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
        />
      )}
    </div>
  );
}
