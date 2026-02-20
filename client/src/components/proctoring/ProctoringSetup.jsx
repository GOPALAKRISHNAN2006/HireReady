/**
 * ===========================================
 * Proctoring Setup Component
 * ===========================================
 * 
 * Displays permissions setup and system check
 * before starting a proctored session.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Monitor,
  Mic,
  CheckCircle2,
  XCircle,
  Loader2,
  Shield,
  AlertTriangle,
  Maximize,
  RefreshCw,
  ScreenShare
} from 'lucide-react';

const ProctoringSetup = ({ onReady, onCancel, config = {} }) => {
  const [step, setStep] = useState(0);
  const [cameraPermission, setCameraPermission] = useState('pending');
  const [micPermission, setMicPermission] = useState('pending');
  const [screenPermission, setScreenPermission] = useState('pending');
  const [fullscreenReady, setFullscreenReady] = useState('pending');
  const [faceEnrolled, setFaceEnrolled] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // System requirements
  const requirements = [
    {
      id: 'camera',
      title: 'Camera Access',
      description: 'Allow camera access for face verification',
      icon: Camera,
      status: cameraPermission,
      required: true
    },
    {
      id: 'microphone',
      title: 'Microphone Access',
      description: 'Allow microphone for audio monitoring',
      icon: Mic,
      status: micPermission,
      required: config.audioMonitoringEnabled ?? true
    },
    {
      id: 'screen',
      title: 'Screen Share',
      description: 'Share your screen for monitoring',
      icon: ScreenShare,
      status: screenPermission,
      required: config.screenMonitoringEnabled ?? true
    },
    {
      id: 'fullscreen',
      title: 'Fullscreen Mode',
      description: 'Session will run in fullscreen mode',
      icon: Maximize,
      status: fullscreenReady,
      required: config.fullscreenRequired ?? true
    }
  ];

  // Request camera and microphone
  const requestPermissions = async () => {
    try {
      setCameraPermission('loading');
      setMicPermission('loading');
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: config.audioMonitoringEnabled ?? true
      });

      streamRef.current = stream;
      setCameraPermission('granted');
      setMicPermission('granted');
      setCameraReady(true);
      
      // Move to screen sharing step if enabled
      if (config.screenMonitoringEnabled !== false) {
        setStep(1);
      } else {
        setScreenPermission('granted');
        setStep(2);
      }
    } catch (err) {
      console.error('Permission error:', err);
      setCameraPermission('denied');
      setMicPermission('denied');
      setError('Camera and microphone access is required for proctored sessions. Please allow access and try again.');
    }
  };

  // Request screen sharing
  const requestScreenShare = async () => {
    try {
      setScreenPermission('loading');
      setError(null);

      // Use minimal constraints for maximum browser compatibility
      const displayMediaOptions = {
        video: {
          cursor: 'always'
        },
        audio: false
      };

      // Add preferred constraints only if supported (Chrome 107+)
      try {
        if (navigator.mediaDevices.getDisplayMedia.length !== undefined) {
          displayMediaOptions.video.displaySurface = 'monitor';
          displayMediaOptions.preferCurrentTab = false;
          displayMediaOptions.selfBrowserSurface = 'exclude';
          displayMediaOptions.surfaceSwitching = 'include';
          displayMediaOptions.monitorTypeSurfaces = 'include';
        }
      } catch {
        // Optional constraints not supported, use basic only
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      screenStreamRef.current = screenStream;
      setScreenPermission('granted');
      
      // Handle screen share stop
      screenStream.getVideoTracks()[0].onended = () => {
        setScreenPermission('denied');
        setError('Screen sharing was stopped. Please share your screen to continue.');
      };
      
      setStep(2);
    } catch (err) {
      console.error('Screen share error:', err);
      setScreenPermission('denied');
      if (err.name === 'NotAllowedError') {
        setError('Screen sharing is required. Please share your entire screen to continue.');
      } else {
        setError('Failed to start screen sharing. Please try again.');
      }
    }
  };

  // Effect to attach stream to video element when ready
  useEffect(() => {
    if (streamRef.current && videoRef.current && cameraReady) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  }, [cameraReady, step]);

  // Test fullscreen capability
  const testFullscreen = async () => {
    try {
      setFullscreenReady('loading');
      await document.documentElement.requestFullscreen();
      await document.exitFullscreen();
      setFullscreenReady('granted');
      setStep(3);
    } catch (err) {
      console.error('Fullscreen error:', err);
      setFullscreenReady('denied');
      setError('Fullscreen mode is required. Please allow fullscreen access.');
    }
  };

  // Face enrollment (simulated)
  const enrollFace = async () => {
    setStep(4);
    // Simulate face enrollment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFaceEnrolled(true);
  };

  // Start countdown and begin session
  const startSession = () => {
    setCountdown(3);
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Clean up preview stream (actual monitoring will create new stream)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Keep screen stream for proctoring
      onReady({ screenStream: screenStreamRef.current });
    }
  }, [countdown, onReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Status icon component
  const StatusIcon = ({ status }) => {
    if (status === 'loading') {
      return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
    if (status === 'granted') {
      return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    }
    if (status === 'denied') {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <div className="w-5 h-5 rounded-full border-2 border-slate-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Proctoring Setup</h2>
              <p className="text-xs sm:text-sm text-white/80">
                Complete the following steps to start your proctored session
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Countdown overlay */}
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-8xl font-bold text-white mb-4"
              >
                {countdown || 'GO!'}
              </motion.div>
              <p className="text-slate-400">Starting proctored session...</p>
            </motion.div>
          )}

          {/* Step 0: Permissions */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {requirements.map(req => (
                  <div
                    key={req.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      req.status === 'granted' ? 'border-green-500/30 bg-green-500/5' :
                      req.status === 'denied' ? 'border-red-500/30 bg-red-500/5' :
                      'border-slate-700 bg-slate-800'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      req.status === 'granted' ? 'bg-green-500/20' :
                      req.status === 'denied' ? 'bg-red-500/20' :
                      'bg-slate-700'
                    }`}>
                      <req.icon className={`w-6 h-6 ${
                        req.status === 'granted' ? 'text-green-400' :
                        req.status === 'denied' ? 'text-red-400' :
                        'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{req.title}</h3>
                      <p className="text-sm text-slate-400">{req.description}</p>
                    </div>
                    <StatusIcon status={req.status} />
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={requestPermissions}
                disabled={cameraPermission === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-colors"
              >
                {cameraPermission === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Requesting Access...
                  </>
                ) : cameraPermission === 'denied' ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Allow Camera & Microphone
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 1: Screen Share */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                  <ScreenShare className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Share Your Screen
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Screen sharing is required to monitor your activity during the session. Please share your <strong className="text-white">entire screen</strong> (not just a window).
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Screen Sharing Tips:
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Select "Entire Screen" when prompted</li>
                  <li>• Close any sensitive applications before sharing</li>
                  <li>• Keep screen sharing active throughout the session</li>
                </ul>
              </div>

              <button
                onClick={requestScreenShare}
                disabled={screenPermission === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-colors"
              >
                {screenPermission === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Requesting Screen Access...
                  </>
                ) : screenPermission === 'denied' ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </>
                ) : (
                  <>
                    <ScreenShare className="w-5 h-5" />
                    Share Your Screen
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Fullscreen test */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                  <Maximize className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Enable Fullscreen Mode
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  This session requires fullscreen mode to prevent distraction and ensure exam integrity.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={testFullscreen}
                disabled={fullscreenReady === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-colors"
              >
                {fullscreenReady === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Testing Fullscreen...
                  </>
                ) : (
                  <>
                    <Maximize className="w-5 h-5" />
                    Test Fullscreen Mode
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Face enrollment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Face Enrollment
                </h3>
                <p className="text-slate-400">
                  Position your face in the center of the frame
                </p>
              </div>

              <div className="relative w-full max-w-md mx-auto aspect-video bg-slate-800 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {/* No camera fallback */}
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">Initializing camera...</p>
                    </div>
                  </div>
                )}
                
                {/* Face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-52 border-2 border-dashed border-blue-400 rounded-full opacity-70" />
                </div>
                
                {/* Camera active indicator */}
                {cameraReady && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-green-500/20 rounded-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">Camera Active</span>
                  </div>
                )}
              </div>

              <button
                onClick={enrollFace}
                disabled={!cameraReady}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                <Camera className="w-5 h-5" />
                Capture Face
              </button>
            </div>
          )}

          {/* Step 4: Ready */}
          {step === 4 && (
            <div className="space-y-6">
              {!faceEnrolled ? (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">Processing face enrollment...</p>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      All Set!
                    </h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      You're ready to begin your proctored session. Please ensure you remain visible throughout the session.
                    </p>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Guidelines:</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Keep your face visible in the camera at all times
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Do not switch tabs or leave fullscreen mode
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Ensure you're in a quiet, well-lit environment
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        No other people should be visible in the frame
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={startSession}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    Start Proctored Session
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {[0, 1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full ${
                    s < step ? 'bg-green-400' :
                    s === step ? 'bg-blue-400' :
                    'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProctoringSetup;
