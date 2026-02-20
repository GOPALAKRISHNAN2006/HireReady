import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, Eye, ChevronLeft, ChevronRight, User, Calendar, CheckCircle, XCircle, Clock, X, Award, MessageSquare, Filter } from 'lucide-react';
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
  'completed': 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
  'in-progress': 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
  'pending': 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
  'scheduled': 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
  'cancelled': 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30',
};

const DIFFICULTY_STYLES = {
  'easy': 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
  'medium': 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
  'hard': 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30',
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
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    if (score >= 40) return 'text-orange-500 dark:text-orange-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-900/20';
    if (score >= 40) return 'bg-orange-50 dark:bg-orange-900/20';
    return 'bg-rose-50 dark:bg-rose-900/20';
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
          className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={handleModalClick}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
                <Badge className={STATUS_STYLES[interviewDetail?.status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}>
                  {interviewDetail?.status || 'Unknown'}
                </Badge>
                <p className="text-xs text-white/70 mt-1">Status</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Badge className={DIFFICULTY_STYLES[interviewDetail?.difficulty] || 'bg-slate-100 dark:bg-slate-800'}>
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
                <XCircle className="w-16 h-16 text-rose-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Failed to load details</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Unable to fetch interview details. Using basic information.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Info & Interview Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Info */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Candidate Information
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {user?.firstName || 'Unknown'} {user?.lastName || 'User'}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email || 'No email'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interview Timing */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Interview Timing
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Started:</span>
                        <span className="text-slate-900 dark:text-white">{formatDate(interviewDetail?.startedAt || interviewDetail?.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Completed:</span>
                        <span className="text-slate-900 dark:text-white">{formatDate(interviewDetail?.completedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions & Responses */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Questions & Responses ({responses.length})
                  </h3>
                  
                  {responses.length > 0 ? (
                    <div className="space-y-4">
                      {responses.map((response, index) => (
                        <div key={response._id || index} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                          {/* Question Header */}
                          <div className="bg-slate-50 dark:bg-slate-800 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">{index + 1}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30 text-xs">
                                  {response.question?.category || 'General'}
                                </Badge>
                                {response.question?.difficulty && (
                                  <Badge className={`${DIFFICULTY_STYLES[response.question.difficulty] || 'bg-slate-100 dark:bg-slate-800'} text-xs`}>
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
                              <p className="text-slate-900 dark:text-white font-medium">
                                {response.question?.text || response.questionText || 'Question not available'}
                              </p>
                            </div>

                            {response.answer ? (
                              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Candidate&apos;s Answer:</p>
                                <p className="text-slate-800 dark:text-slate-200">{response.answer}</p>
                              </div>
                            ) : (
                              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                                <p className="text-slate-400 dark:text-slate-500 italic">No answer provided</p>
                              </div>
                            )}

                            {response.feedback && (
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                  <span className="text-indigo-700 dark:text-indigo-300 text-sm font-medium">AI Feedback</span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm">{response.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400">No responses recorded for this interview</p>
                    </div>
                  )}
                </div>

                {/* Overall Feedback */}
                {interviewDetail?.overallFeedback && (
                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Overall Performance Feedback
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">{interviewDetail.overallFeedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800 flex justify-end">
            <Button onClick={onClose} variant="outline" className="border-slate-300 dark:border-slate-600">
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
    if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-500 dark:text-amber-400';
    if (score >= 40) return 'text-orange-500 dark:text-orange-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Interview Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review all user interviews and their performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/30 rounded-2xl shadow-sm">
          <div className="p-6 text-center">
            <p className="text-rose-600 dark:text-rose-400 font-medium">Failed to load interviews</p>
            <p className="text-rose-500 dark:text-rose-400/70 text-sm mt-1">{error.message}</p>
          </div>
        </div>
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
              <div key={interview._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all p-5 group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {interview.user?.firstName} {interview.user?.lastName}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{interview.user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={`rounded-lg ${STATUS_STYLES[interview.status] || 'bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                        {interview.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {interview.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                        {interview.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                        {interview.status}
                      </Badge>
                      <Badge className="rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30">
                        {CATEGORIES[interview.category] || interview.category}
                      </Badge>
                      <Badge className={`rounded-lg ${DIFFICULTY_STYLES[interview.difficulty] || 'bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                        {interview.difficulty}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(interview.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500">Questions:</span>{' '}
                        <span className="text-slate-700 dark:text-slate-300">{interview.questionsAnswered || 0}/{interview.totalQuestions}</span>
                      </div>
                      {interview.overallScore !== undefined && (
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Score:</span>{' '}
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
                    className="border-indigo-500/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}

            {data?.interviews?.length === 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <div className="p-12 text-center">
                  <Target className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No interviews found</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center">
                Page {page} of {data.pagination.pages}
              </span>
              <Button
                onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
                variant="outline"
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </>
      )}

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
