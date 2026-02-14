/**
 * ===========================================
 * Admin Proctoring Dashboard Page
 * ===========================================
 * 
 * Displays all proctoring sessions, alerts,
 * and allows admin to review suspicious sessions.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Clock,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Camera,
  Monitor,
  Mic,
  RefreshCw,
  ChevronDown,
  FileText
} from 'lucide-react';
import { Card, Button, Badge, Modal, Spinner } from '../../components/ui';
import { proctoringApi } from '../../services/proctoringApi';
import toast from 'react-hot-toast';

const ProctoringDashboard = () => {
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewDecision, setReviewDecision] = useState('valid');

  // Fetch sessions for review
  const { data: reviewSessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['proctoring-review', filterStatus],
    queryFn: async () => {
      const params = {};
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const response = await proctoringApi.getSessionsForReview(params);
      return response.data?.data?.sessions || response.data?.data || [];
    }
  });

  // Fetch unacknowledged alerts
  const { data: alerts, isLoading: loadingAlerts } = useQuery({
    queryKey: ['proctoring-alerts'],
    queryFn: async () => {
      const response = await proctoringApi.getAlerts();
      return response.data?.data?.alerts || response.data?.data || [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Acknowledge alert mutation
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async ({ alertId, action }) => {
      return proctoringApi.acknowledgeAlert(alertId, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['proctoring-alerts']);
      toast.success('Alert acknowledged');
    },
    onError: (error) => {
      toast.error('Failed to acknowledge alert');
    }
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ sessionId, decision, notes }) => {
      return proctoringApi.submitReview(sessionId, {
        decision,
        reviewerNotes: notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['proctoring-review']);
      setShowReviewModal(false);
      setSelectedSession(null);
      setReviewNotes('');
      toast.success('Review submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit review');
    }
  });

  // Handle acknowledge
  const handleAcknowledge = (alertId, action) => {
    acknowledgeAlertMutation.mutate({ alertId, action });
  };

  // Handle review submit
  const handleSubmitReview = () => {
    if (!selectedSession) return;
    submitReviewMutation.mutate({
      sessionId: selectedSession._id,
      decision: reviewDecision,
      notes: reviewNotes
    });
  };

  // Get integrity badge
  const getIntegrityBadge = (status) => {
    if (status === 'clean') {
      return <Badge variant="success"><ShieldCheck className="w-3 h-3 mr-1" /> Clean</Badge>;
    }
    if (status === 'review_recommended') {
      return <Badge variant="warning"><ShieldAlert className="w-3 h-3 mr-1" /> Review</Badge>;
    }
    return <Badge variant="danger"><ShieldX className="w-3 h-3 mr-1" /> High Risk</Badge>;
  };

  // Get severity badge
  const getSeverityBadge = (severity) => {
    if (severity === 'high') {
      return <Badge variant="danger">High</Badge>;
    }
    if (severity === 'medium') {
      return <Badge variant="warning">Medium</Badge>;
    }
    return <Badge variant="default">Low</Badge>;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // Calculate stats
  const stats = {
    totalSessions: reviewSessions?.length || 0,
    cleanSessions: reviewSessions?.filter(s => s.integrityStatus === 'clean').length || 0,
    reviewNeeded: reviewSessions?.filter(s => s.integrityStatus === 'review_recommended').length || 0,
    highRisk: reviewSessions?.filter(s => s.integrityStatus === 'high_suspicion').length || 0,
    unresolvedAlerts: alerts?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proctoring Dashboard</h1>
          <p className="text-slate-600 mt-1">Monitor and review proctored sessions</p>
        </div>
        <Button
          onClick={() => queryClient.invalidateQueries(['proctoring-review', 'proctoring-alerts'])}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Sessions</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Clean</p>
              <p className="text-xl font-bold text-green-600">{stats.cleanSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Review Needed</p>
              <p className="text-xl font-bold text-yellow-600">{stats.reviewNeeded}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">High Risk</p>
              <p className="text-xl font-bold text-red-600">{stats.highRisk}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Alerts</p>
              <p className="text-xl font-bold text-purple-600">{stats.unresolvedAlerts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Alerts */}
      {alerts && alerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Alerts
              <Badge variant="danger">{alerts.length}</Badge>
            </h2>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  alert.alertType === 'critical' ? 'bg-red-50 border-red-200' :
                  alert.alertType === 'alert' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <AlertCircle className={`w-5 h-5 ${
                    alert.alertType === 'critical' ? 'text-red-500' :
                    alert.alertType === 'alert' ? 'text-yellow-500' :
                    'text-slate-500'
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900">
                      {alert.candidate?.firstName} {alert.candidate?.lastName}
                    </p>
                    <p className="text-sm text-red-600 font-medium">{alert.message}</p>
                    <p className="text-xs text-slate-500">
                      {alert.violation?.type?.replace(/_/g, ' ')} • {formatDate(alert.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(alert.violation?.severity || 'low')}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAcknowledge(alert._id, 'acknowledged')}
                  >
                    Acknowledge
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Sessions for Review */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-500" />
            Sessions for Review
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending_review">Pending Review</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>

        {loadingSessions ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : reviewSessions && reviewSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Session Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Risk Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Violations</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviewSessions.map((session) => (
                  <tr key={session._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">
                            {session.candidate?.firstName} {session.candidate?.lastName}
                          </span>
                          <p className="text-xs text-slate-500">{session.candidate?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="capitalize">
                        {session.sessionType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {getIntegrityBadge(session.integrityStatus)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-bold ${
                          session.riskScore < 20 ? 'text-green-600' :
                          session.riskScore < 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {session.riskScore}/100
                        </div>
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              session.riskScore < 20 ? 'bg-green-500' :
                              session.riskScore < 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${session.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-900">{session.stats?.totalViolations || 0}</span>
                        {session.stats?.highViolations > 0 && (
                          <Badge variant="danger" size="sm">{session.stats.highViolations} high</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {formatDate(session.startTime)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedSession(session);
                            setShowReviewModal(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Sessions to Review</h3>
            <p className="text-slate-500">All proctored sessions are clean or have been reviewed.</p>
          </div>
        )}
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedSession(null);
        }}
        title="Review Proctoring Session"
        size="lg"
      >
        {selectedSession && (
          <div className="space-y-6">
            {/* Session Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">User</p>
                <p className="font-medium text-slate-900">{selectedSession.candidate?.firstName} {selectedSession.candidate?.lastName}</p>
                <p className="text-xs text-slate-500">{selectedSession.candidate?.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Session Type</p>
                <p className="font-medium text-slate-900 capitalize">{selectedSession.sessionType}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Risk Score</p>
                <p className={`font-bold ${
                  selectedSession.riskScore < 20 ? 'text-green-600' :
                  selectedSession.riskScore < 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{selectedSession.riskScore}/100</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                {getIntegrityBadge(selectedSession.integrityStatus)}
              </div>
            </div>

            {/* Violations */}
            {selectedSession.violations && selectedSession.violations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2">Violations ({selectedSession.violations.length})</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {selectedSession.violations.map((v, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2 rounded ${
                        v.severity === 'high' ? 'bg-red-50' :
                        v.severity === 'medium' ? 'bg-yellow-50' :
                        'bg-slate-50'
                      }`}
                    >
                      <span className="text-sm capitalize">{v.type.replace(/_/g, ' ')}</span>
                      {getSeverityBadge(v.severity)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Decision */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Decision</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewDecision('valid')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    reviewDecision === 'valid'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Valid Session
                </button>
                <button
                  onClick={() => setReviewDecision('invalid')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    reviewDecision === 'invalid'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  Invalid Session
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Review Notes</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add notes about your decision..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={submitReviewMutation.isPending}
              >
                {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProctoringDashboard;
