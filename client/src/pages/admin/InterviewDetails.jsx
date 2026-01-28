import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function InterviewDetails() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  // Fetch interview details
  const { data, isLoading, error } = useQuery({
    queryKey: ['interview-detail', interviewId],
    queryFn: async () => {
      const response = await api.get(`/admin/interviews/${interviewId}`);
      return response.data;
    },
    enabled: !!interviewId,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <Link to="/admin/interviews" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Interviews
        </Link>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading interview details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Link to="/admin/interviews" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Interviews
        </Link>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Interview</h2>
          <p className="text-gray-500">{error.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  // Extract interview data
  const interview = data?.data?.interview || data?.interview || data || {};
  const user = interview?.user || {};
  const responses = interview?.responses || [];

  // Helper functions
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

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    return styles[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin/interviews" className="text-blue-600 hover:underline flex items-center gap-2">
          <span>←</span> Back to Interviews
        </Link>
      </div>

      {/* Interview Header Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {interview?.category ? interview.category.charAt(0).toUpperCase() + interview.category.slice(1) : 'Interview'} Interview
            </h1>
            <p className="text-white/80">
              {interview?.totalQuestions || responses.length || 0} Questions • {interview?.difficulty || 'N/A'} difficulty
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(interview?.status)}`}>
            {interview?.status || 'Unknown'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold ${interview?.overallScore >= 60 ? 'text-green-300' : 'text-red-300'}`}>
              {Math.round(interview?.overallScore || 0)}%
            </div>
            <p className="text-sm text-white/70 mt-1">Overall Score</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">{responses.filter(r => r?.answer).length}/{interview?.totalQuestions || responses.length || 0}</div>
            <p className="text-sm text-white/70 mt-1">Questions Answered</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">{formatDate(interview?.startedAt || interview?.createdAt).split(',')[0]}</div>
            <p className="text-sm text-white/70 mt-1">Started</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">{interview?.completedAt ? formatDate(interview.completedAt).split(',')[0] : 'N/A'}</div>
            <p className="text-sm text-white/70 mt-1">Completed</p>
          </div>
        </div>
      </div>

      {/* User Info & Interview Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            👤 Candidate Information
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
              <p className="text-gray-500 text-sm">
                📧 {user?.email || 'No email'}
              </p>
            </div>
          </div>
        </div>

        {/* Interview Details */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Interview Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Category</p>
              <p className="font-medium text-gray-900">{interview?.category || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Difficulty</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyBadge(interview?.difficulty)}`}>
                {interview?.difficulty || 'N/A'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Status</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadge(interview?.status)}`}>
                {interview?.status || 'N/A'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Started At</p>
              <p className="font-medium text-gray-900 text-sm">{formatDate(interview?.startedAt || interview?.createdAt)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Completed At</p>
              <p className="font-medium text-gray-900 text-sm">{formatDate(interview?.completedAt)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Interview ID</p>
              <p className="font-mono text-xs text-gray-600 truncate">{interview?._id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions & Responses */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">💬 Questions & Responses ({responses.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {responses.length > 0 ? (
            responses.map((response, index) => (
              <div key={response._id || index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                        {response.question?.category || 'General'}
                      </span>
                      {response.question?.difficulty && (
                        <span className={`px-2 py-1 text-xs rounded ${getDifficultyBadge(response.question.difficulty)}`}>
                          {response.question.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                  {response.score !== undefined && (
                    <div className={`px-3 py-1 rounded-full ${response.score >= 70 ? 'bg-green-100' : response.score >= 40 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <span className={`font-bold ${getScoreColor(response.score)}`}>
                        {Math.round(response.score)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Question */}
                <div className="mb-4">
                  <p className="text-gray-900 font-medium">
                    {response.question?.text || response.questionText || 'Question not available'}
                  </p>
                </div>

                {/* Answer */}
                {response.answer ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-600 text-sm font-medium">👤 Candidate's Answer</span>
                    </div>
                    <p className="text-gray-800">{response.answer}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                    <p className="text-gray-400 italic">No answer provided</p>
                  </div>
                )}

                {/* AI Feedback */}
                {response.feedback && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-indigo-700 text-sm font-medium">🤖 AI Feedback</span>
                    </div>
                    <p className="text-gray-700 text-sm">{response.feedback}</p>
                  </div>
                )}

                {/* Time Taken */}
                {response.timeTaken && (
                  <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
                    <span>⏱️ Time taken: {Math.round(response.timeTaken / 1000)}s</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-500">No responses recorded for this interview</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      {interview?.overallFeedback && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Overall Performance Feedback</h3>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <p className="text-gray-700">{interview.overallFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}
