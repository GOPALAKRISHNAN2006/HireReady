/**
 * ===========================================
 * Proctored Session Wrapper Component
 * ===========================================
 * 
 * HOC that wraps any session component with
 * proctoring functionality.
 */

import React, { useState, useCallback, useEffect } from 'react';
import ProctoringSetup from './ProctoringSetup';
import ProctoringOverlay from './ProctoringOverlay';
import ProctoringReport from './ProctoringReport';
import useProctoring from '../../hooks/useProctoring';
import toast from 'react-hot-toast';

const ProctoredSession = ({
  children,
  sessionType = 'interview',
  sessionId,
  enabled = true,
  config = {},
  onProctoringStart,
  onProctoringEnd,
  strictMode = false
}) => {
  const [setupComplete, setSetupComplete] = useState(!enabled);
  const [showSetup, setShowSetup] = useState(enabled);
  const [minimized, setMinimized] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [finalReport, setFinalReport] = useState(null);

  // Proctoring hook
  const proctoring = useProctoring({
    sessionType,
    sessionId,
    config: {
      cameraEnabled: config.cameraEnabled ?? true,
      screenMonitoringEnabled: config.screenMonitoringEnabled ?? true,
      audioMonitoringEnabled: config.audioMonitoringEnabled ?? true,
      fullscreenRequired: config.fullscreenRequired ?? true,
      ...config
    },
    strictMode,
    onViolation: (violation, data) => {
      console.log('Violation detected:', violation);
    },
    onWarning: (message, severity) => {
      console.log('Warning:', message, severity);
    },
    onSessionEnd: (data) => {
      setFinalReport(data.report);
      setShowReport(true);
      if (onProctoringEnd) {
        onProctoringEnd(data);
      }
    }
  });

  // Handle setup completion
  const handleSetupComplete = useCallback(async (setupData) => {
    try {
      // Initialize camera
      await proctoring.initializeCamera();
      
      // Start proctoring session with screen stream if available
      await proctoring.startSession();
      
      // Store screen stream reference for monitoring
      if (setupData?.screenStream) {
        proctoring.setScreenStream(setupData.screenStream);
      }
      
      // Request fullscreen
      if (config.fullscreenRequired !== false) {
        await proctoring.requestFullscreen();
      }
      
      setSetupComplete(true);
      setShowSetup(false);
      
      if (onProctoringStart) {
        onProctoringStart(proctoring.proctoringSessionId);
      }
      
      toast.success('Proctoring session started');
    } catch (error) {
      console.error('Failed to start proctoring:', error);
      toast.error('Failed to start proctoring session');
    }
  }, [proctoring, config.fullscreenRequired, onProctoringStart]);

  // Handle setup cancel
  const handleSetupCancel = useCallback(() => {
    setShowSetup(false);
    setSetupComplete(false);
    // Navigate back or show error
    toast.error('Proctoring is required for this session');
  }, []);

  // Handle session end
  const handleEndSession = useCallback(async () => {
    if (proctoring.isActive) {
      const report = await proctoring.endSession();
      if (report) {
        setFinalReport(report);
        setShowReport(true);
      }
    }
  }, [proctoring]);

  // Handle report close
  const handleReportClose = useCallback(() => {
    setShowReport(false);
  }, []);

  // Toggle minimized state
  const handleToggleMinimize = useCallback(() => {
    setMinimized(prev => !prev);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (proctoring.isActive) {
        proctoring.endSession();
      }
    };
  }, []);

  // If proctoring is disabled, just render children
  if (!enabled) {
    return <>{children}</>;
  }

  // Show setup screen
  if (showSetup && !setupComplete) {
    return (
      <ProctoringSetup
        onReady={handleSetupComplete}
        onCancel={handleSetupCancel}
        config={config}
      />
    );
  }

  // Waiting for setup to complete
  if (!setupComplete) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Proctoring setup required</p>
          <button
            onClick={() => setShowSetup(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Start Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main content */}
      {children}

      {/* Proctoring overlay */}
      <ProctoringOverlay
        isActive={proctoring.isActive}
        videoRef={proctoring.videoRef}
        cameraStatus={proctoring.cameraStatus}
        screenStatus={proctoring.screenStatus}
        audioStatus={proctoring.audioStatus}
        faceDetected={proctoring.faceDetected}
        isFullscreen={proctoring.isFullscreen}
        riskScore={proctoring.riskScore}
        riskLevel={proctoring.riskLevel}
        violations={proctoring.violations}
        stats={proctoring.stats}
        warningMessage={proctoring.warningMessage}
        onRequestFullscreen={proctoring.requestFullscreen}
        minimized={minimized}
        onToggleMinimize={handleToggleMinimize}
      />

      {/* Hidden canvas for face detection */}
      <canvas ref={proctoring.canvasRef} className="hidden" />

      {/* Proctoring report modal */}
      {showReport && finalReport && (
        <ProctoringReport
          report={finalReport}
          onClose={handleReportClose}
        />
      )}
    </>
  );
};

// Export a context for child components to access proctoring
export const ProctoringContext = React.createContext(null);

// Provider component
export const ProctoringProvider = ({
  children,
  sessionType,
  sessionId,
  enabled = true,
  config = {},
  strictMode = false
}) => {
  const proctoring = useProctoring({
    sessionType,
    sessionId,
    config,
    strictMode
  });

  return (
    <ProctoringContext.Provider value={proctoring}>
      {children}
    </ProctoringContext.Provider>
  );
};

export default ProctoredSession;
