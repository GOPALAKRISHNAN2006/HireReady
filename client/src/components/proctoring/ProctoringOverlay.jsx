/**
 * ===========================================
 * Proctoring Overlay Component
 * ===========================================
 * 
 * Displays real-time proctoring status, camera feed,
 * risk indicators, and warning alerts during sessions.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  Mic,
  MicOff,
  AlertTriangle,
  AlertCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  Maximize,
  User,
  Users
} from 'lucide-react';

const ProctoringOverlay = ({
  isActive,
  videoRef,
  cameraStatus,
  screenStatus,
  audioStatus,
  faceDetected,
  isFullscreen,
  riskScore,
  riskLevel,
  violations,
  stats,
  warningMessage,
  onRequestFullscreen,
  minimized = false,
  onToggleMinimize
}) => {
  const [showViolations, setShowViolations] = useState(false);
  const [recentViolations, setRecentViolations] = useState([]);

  // Track recent violations for animation
  useEffect(() => {
    if (violations.length > 0) {
      const latest = violations[violations.length - 1];
      setRecentViolations(prev => [...prev, { ...latest, id: Date.now() }]);
      
      // Remove after 3 seconds
      setTimeout(() => {
        setRecentViolations(prev => prev.filter(v => v.id !== latest.id));
      }, 3000);
    }
  }, [violations.length]);

  // Get risk color
  const getRiskColor = () => {
    if (riskLevel === 'clean' || riskScore < 20) return 'text-green-500';
    if (riskLevel === 'review_recommended' || riskScore < 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBgColor = () => {
    if (riskLevel === 'clean' || riskScore < 20) return 'bg-green-500/10 border-green-500/30';
    if (riskLevel === 'review_recommended' || riskScore < 50) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const getShieldIcon = () => {
    if (riskLevel === 'clean' || riskScore < 20) {
      return <ShieldCheck className="w-5 h-5 text-green-500" />;
    }
    if (riskLevel === 'review_recommended' || riskScore < 50) {
      return <Shield className="w-5 h-5 text-yellow-500" />;
    }
    return <ShieldAlert className="w-5 h-5 text-red-500" />;
  };

  // Status indicator component
  const StatusIndicator = ({ active, icon: Icon, offIcon: OffIcon, label, status }) => {
    const isOk = status === 'active';
    const isDenied = status === 'denied';
    
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
        isOk ? 'bg-green-500/10 text-green-400' :
        isDenied ? 'bg-red-500/10 text-red-400' :
        'bg-slate-500/10 text-slate-400'
      }`}>
        {isOk ? <Icon className="w-3.5 h-3.5" /> : <OffIcon className="w-3.5 h-3.5" />}
        <span className="text-xs font-medium">{label}</span>
      </div>
    );
  };

  if (!isActive) return null;

  // Minimized view
  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={onToggleMinimize}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border ${getRiskBgColor()}`}
        >
          {getShieldIcon()}
          <span className={`text-sm font-medium ${getRiskColor()}`}>
            Proctoring Active
          </span>
          {riskScore > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor()} bg-current/10`}>
              Risk: {riskScore}
            </span>
          )}
          <Maximize className="w-4 h-4 text-slate-400" />
        </button>

        {/* Warning popup in minimized mode */}
        <AnimatePresence>
          {warningMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full right-0 mb-2 p-3 bg-red-500/90 text-white rounded-lg shadow-lg max-w-xs"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{warningMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Full view
  return (
    <>
      {/* Proctoring Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 right-4 z-40 w-72 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            {getShieldIcon()}
            <span className="text-sm font-medium text-white">Proctoring Active</span>
          </div>
          <button
            onClick={onToggleMinimize}
            className="p-1 hover:bg-slate-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Camera Feed */}
        <div className="p-3">
          <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Face detection indicator */}
            <div className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md ${
              faceDetected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {faceDetected ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
              <span className="text-xs">{faceDetected ? 'Face OK' : 'No Face'}</span>
            </div>

            {/* Recording indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400">REC</span>
            </div>

            {cameraStatus === 'denied' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80">
                <CameraOff className="w-8 h-8 text-red-400 mb-2" />
                <span className="text-xs text-red-400">Camera Access Denied</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            <StatusIndicator
              status={cameraStatus}
              icon={Camera}
              offIcon={CameraOff}
              label="Camera"
            />
            <StatusIndicator
              status={screenStatus}
              icon={Monitor}
              offIcon={MonitorOff}
              label="Screen"
            />
            <StatusIndicator
              status={audioStatus}
              icon={Mic}
              offIcon={MicOff}
              label="Audio"
            />
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
              isFullscreen ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {isFullscreen ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="text-xs font-medium">{isFullscreen ? 'Fullscreen' : 'Windowed'}</span>
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div className="px-3 pb-3">
          <div className={`p-3 rounded-lg border ${getRiskBgColor()}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Risk Score</span>
              <span className={`text-lg font-bold ${getRiskColor()}`}>{riskScore}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskScore}%` }}
                className={`h-full rounded-full ${
                  riskScore < 20 ? 'bg-green-500' :
                  riskScore < 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
            </div>
            <p className={`mt-2 text-xs ${getRiskColor()}`}>
              {riskLevel === 'clean' && 'Session integrity: Good'}
              {riskLevel === 'review_recommended' && 'Some concerns noted'}
              {riskLevel === 'high_suspicion' && 'High suspicion detected'}
            </p>
          </div>
        </div>

        {/* Violation Stats */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setShowViolations(!showViolations)}
            className="w-full flex items-center justify-between p-2 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
          >
            <span className="text-sm text-slate-300">Violations</span>
            <div className="flex items-center gap-2">
              {stats.highViolations > 0 && (
                <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
                  {stats.highViolations} High
                </span>
              )}
              {stats.mediumViolations > 0 && (
                <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                  {stats.mediumViolations} Med
                </span>
              )}
              <span className="text-xs text-slate-500">
                Total: {stats.totalViolations}
              </span>
            </div>
          </button>
          
          <AnimatePresence>
            {showViolations && violations.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 max-h-40 overflow-y-auto space-y-1"
              >
                {violations.slice(-5).map((v, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded text-xs ${
                      v.severity === 'high' ? 'bg-red-500/10 text-red-400' :
                      v.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span className="capitalize">{v.type.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fullscreen prompt */}
        {!isFullscreen && (
          <div className="p-3 border-t border-slate-700">
            <button
              onClick={onRequestFullscreen}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Maximize className="w-4 h-4" />
              <span className="text-sm">Enter Fullscreen</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Warning Alert Overlay */}
      <AnimatePresence>
        {warningMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg"
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              riskLevel === 'high_suspicion' ? 'bg-red-500' : 'bg-yellow-500'
            } text-white`}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{warningMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Violation Notifications */}
      <div className="fixed bottom-4 left-4 z-50 space-y-2">
        <AnimatePresence>
          {recentViolations.map(v => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg ${
                v.severity === 'high' ? 'bg-red-500/90' :
                v.severity === 'medium' ? 'bg-yellow-500/90' :
                'bg-slate-600/90'
              } text-white`}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm capitalize">{v.type.replace(/_/g, ' ')}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProctoringOverlay;
