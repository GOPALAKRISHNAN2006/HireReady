/**
 * ===========================================
 * Proctoring Report Component
 * ===========================================
 * 
 * Displays comprehensive proctoring report
 * after a session ends.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Camera,
  Monitor,
  Mic,
  TrendingUp,
  FileText,
  Download,
  X
} from 'lucide-react';

const ProctoringReport = ({ report, onClose }) => {
  if (!report) return null;

  const {
    riskScore = 0,
    integrityStatus = 'clean',
    sessionDuration = 0,
    stats = {},
    violations = [],
    summary = {}
  } = report;

  // Get integrity color and icon
  const getIntegrityInfo = () => {
    if (integrityStatus === 'clean') {
      return {
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        icon: ShieldCheck,
        label: 'Clean Session',
        description: 'No significant integrity concerns detected'
      };
    }
    if (integrityStatus === 'review_recommended') {
      return {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        icon: ShieldAlert,
        label: 'Review Recommended',
        description: 'Some concerns noted - manual review suggested'
      };
    }
    return {
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: ShieldX,
      label: 'High Suspicion',
      description: 'Multiple integrity concerns detected'
    };
  };

  const integrityInfo = getIntegrityInfo();
  const IntegrityIcon = integrityInfo.icon;

  // Format duration
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (severity === 'medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  };

  // Get violation icon
  const getViolationIcon = (category) => {
    if (category === 'camera') return Camera;
    if (category === 'screen') return Monitor;
    if (category === 'audio') return Mic;
    return AlertCircle;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden my-4"
      >
        {/* Header */}
        <div className={`p-6 ${integrityInfo.bgColor} border-b ${integrityInfo.borderColor}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${integrityInfo.bgColor}`}>
                <IntegrityIcon className={`w-8 h-8 ${integrityInfo.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Proctoring Report</h2>
                <p className={`text-sm ${integrityInfo.color}`}>
                  {integrityInfo.label}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-4 h-4 ${integrityInfo.color}`} />
                <span className="text-xs text-gray-400">Risk Score</span>
              </div>
              <p className={`text-2xl font-bold ${integrityInfo.color}`}>
                {riskScore}/100
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Duration</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatDuration(sessionDuration)}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Violations</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.totalViolations || 0}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Warnings</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.warningsIssued || 0}
              </p>
            </div>
          </div>

          {/* Integrity Status */}
          <div className={`p-4 rounded-xl border ${integrityInfo.bgColor} ${integrityInfo.borderColor}`}>
            <div className="flex items-start gap-3">
              <IntegrityIcon className={`w-5 h-5 ${integrityInfo.color} flex-shrink-0 mt-0.5`} />
              <div>
                <h3 className={`font-medium ${integrityInfo.color}`}>
                  {integrityInfo.label}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {integrityInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Violation Breakdown */}
          {stats.totalViolations > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                Violation Summary
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{stats.highViolations || 0}</p>
                  <p className="text-xs text-gray-400">High Severity</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{stats.mediumViolations || 0}</p>
                  <p className="text-xs text-gray-400">Medium Severity</p>
                </div>
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-400">{stats.lowViolations || 0}</p>
                  <p className="text-xs text-gray-400">Low Severity</p>
                </div>
              </div>

              {/* Violations List */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {violations.length > 0 ? (
                    violations.map((violation, index) => {
                      const ViolationIcon = getViolationIcon(violation.category);
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 border-b border-gray-700 last:border-b-0 ${getSeverityColor(violation.severity)}`}
                        >
                          <ViolationIcon className="w-4 h-4 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium capitalize">
                              {violation.type.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(violation.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded capitalize ${getSeverityColor(violation.severity)}`}>
                            {violation.severity}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-gray-400">No violations recorded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No Violations Message */}
          {stats.totalViolations === 0 && (
            <div className="text-center py-8 bg-gray-800 rounded-xl border border-gray-700">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Clean Session!
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                No integrity violations were detected during this session. Great job maintaining proper exam conduct!
              </p>
            </div>
          )}

          {/* Summary */}
          {summary && Object.keys(summary).length > 0 && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Session Summary
              </h3>
              <div className="space-y-2 text-sm">
                {summary.recommendedActions && (
                  <div>
                    <p className="text-gray-400 mb-1">Recommended Actions:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {summary.recommendedActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {summary.notes && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Notes: </span>
                    {summary.notes}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Report generated at {new Date().toLocaleString()}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProctoringReport;
