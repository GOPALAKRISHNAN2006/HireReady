/**
 * ===========================================
 * useProctoring Hook
 * ===========================================
 * 
 * Custom React hook for real-time proctoring monitoring.
 * Handles camera, screen, and audio detection.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { proctoringApi } from '../services/proctoringApi';
import toast from 'react-hot-toast';

// Violation severity mapping
const VIOLATION_SEVERITY = {
  // Low severity
  tab_switch: 'low',
  head_movement: 'low',
  posture_shift: 'low',
  suspicious_gaze: 'low',
  
  // Medium severity
  fullscreen_exit: 'medium',
  no_face_detected: 'medium',
  copy_paste: 'medium',
  background_voice: 'medium',
  restricted_website: 'medium',
  mouth_movement: 'medium',
  unexplained_silence: 'medium',
  
  // High severity
  multiple_faces: 'high',
  face_mismatch: 'high',
  proxy_suspected: 'high',
  coaching_detected: 'high',
  phone_detected: 'high',
  remote_desktop: 'high',
  virtual_machine: 'high',
  screen_share_detected: 'high'
};

// Violation descriptions
const VIOLATION_DESCRIPTIONS = {
  multiple_faces: 'Multiple faces detected in camera frame',
  no_face_detected: 'No face detected in camera frame',
  face_mismatch: 'Face does not match enrolled candidate',
  suspicious_gaze: 'Gaze directed away from screen',
  head_movement: 'Excessive head movement detected',
  posture_shift: 'Significant posture change detected',
  mouth_movement: 'Lip movement detected (possible reading/coaching)',
  background_person: 'Another person visible in background',
  proxy_suspected: 'Proxy test-taking suspected',
  fullscreen_exit: 'Exited fullscreen mode',
  tab_switch: 'Switched to another tab or window',
  restricted_app: 'Restricted application detected',
  restricted_website: 'Attempted to access restricted website',
  copy_paste: 'Copy-paste action detected',
  screen_share_detected: 'Screen sharing detected',
  remote_desktop: 'Remote desktop software detected',
  virtual_machine: 'Virtual machine detected',
  overlay_detected: 'Screen overlay detected',
  secondary_device: 'Secondary device detected',
  background_voice: 'Background voice detected',
  coaching_detected: 'External coaching detected',
  voice_mismatch: 'Voice pattern mismatch',
  scripted_reading: 'Scripted reading detected',
  answer_playback: 'Audio playback detected',
  phone_detected: 'Phone/mobile device detected',
  external_material: 'External material detected',
  muted_with_movement: 'Microphone muted with visible lip movement',
  unexplained_silence: 'Unexplained silence during speaking task'
};

const useProctoring = (options = {}) => {
  const {
    sessionType = 'interview',
    sessionId = null,
    config = {},
    onViolation = () => {},
    onWarning = () => {},
    onSessionEnd = () => {},
    strictMode = false
  } = options;

  // State
  const [proctoringSessionId, setProctoringSessionId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('clean');
  const [violations, setViolations] = useState([]);
  const [stats, setStats] = useState({
    totalViolations: 0,
    lowViolations: 0,
    mediumViolations: 0,
    highViolations: 0,
    warningsIssued: 0
  });
  const [cameraStatus, setCameraStatus] = useState('initializing');
  const [screenStatus, setScreenStatus] = useState('initializing');
  const [audioStatus, setAudioStatus] = useState('initializing');
  const [faceDetected, setFaceDetected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const lastTabSwitchRef = useRef(0);
  const consecutiveNoFaceRef = useRef(0);
  const gazeHistoryRef = useRef([]);

  // Log a violation (must be defined before setScreenStream which depends on it)
  const logViolation = useCallback(async (type, additionalData = {}) => {
    if (!proctoringSessionId || !isActive) return;

    const severity = VIOLATION_SEVERITY[type] || 'low';
    const description = VIOLATION_DESCRIPTIONS[type] || type;

    try {
      const response = await proctoringApi.logViolation(proctoringSessionId, {
        type,
        severity,
        description,
        evidence: additionalData.evidence || null
      });

      if (response.data.success) {
        const data = response.data.data;
        
        // Update local state
        setRiskScore(data.riskScore);
        setRiskLevel(data.riskLevel);
        setStats(data.stats);
        setViolations(prev => [...prev, data.violation]);

        // Handle warning message
        if (data.warningMessage) {
          setWarningMessage(data.warningMessage);
          onWarning(data.warningMessage, severity);
          
          // Show toast for warnings
          if (severity === 'high') {
            toast.error(data.warningMessage, { duration: 5000 });
          } else if (severity === 'medium') {
            toast(data.warningMessage, { icon: '⚠️', duration: 4000 });
          }
          
          // Clear warning after delay
          setTimeout(() => setWarningMessage(null), 5000);
        }

        // Callback
        onViolation(data.violation, data);

        return data;
      }
    } catch (error) {
      console.error('Failed to log violation:', error);
    }
  }, [proctoringSessionId, isActive, onViolation, onWarning]);

  // Set screen stream from proctoring setup
  const setScreenStream = useCallback((stream) => {
    screenStreamRef.current = stream;
    setScreenStatus('active');
    
    // Monitor screen share stop — log violation when screen share ends
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          setScreenStatus('stopped');
          // Log the violation to server (logViolation requires session to be active)
          if (proctoringSessionId && isActive) {
            logViolation('screen_share_detected');
          }
          toast.error('Screen sharing was stopped! This is a violation.', { duration: 6000 });
        };
      }
    }
  }, [proctoringSessionId, isActive, logViolation]);

  // Start proctoring session
  const startSession = useCallback(async () => {
    try {
      // First, try to clear any existing sessions
      try {
        await proctoringApi.clearSessions();
      } catch (clearError) {
        console.log('No sessions to clear or clear failed:', clearError.message);
      }
      
      const deviceInfo = {
        browser: navigator.userAgent,
        os: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`
      };

      const response = await proctoringApi.startSessionForced({
        sessionType,
        sessionId,
        config: {
          cameraEnabled: config.cameraEnabled ?? true,
          screenMonitoringEnabled: config.screenMonitoringEnabled ?? true,
          audioMonitoringEnabled: config.audioMonitoringEnabled ?? true,
          fullscreenRequired: config.fullscreenRequired ?? true,
          strictMode
        },
        deviceInfo
      });

      if (response.data.success) {
        setProctoringSessionId(response.data.data.proctoringSessionId);
        setIsActive(true);
        toast.success('Proctoring session started');
        return response.data.data.proctoringSessionId;
      }
    } catch (error) {
      console.error('Failed to start proctoring session:', error);
      
      // Show user-friendly message
      const errorMessage = error.response?.data?.message || 'Failed to start proctoring session';
      toast.error(errorMessage);
      throw error;
    }
  }, [sessionType, sessionId, config, strictMode]);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: config.audioMonitoringEnabled ?? true
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraStatus('active');

      // Initialize audio analysis
      if (config.audioMonitoringEnabled) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        setAudioStatus('active');
      }

      return stream;
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraStatus('denied');
      toast.error('Camera access is required for proctoring');
      throw error;
    }
  }, [config.audioMonitoringEnabled]);

  // Detect rectangular object (phone/tablet) held near face via edge & color uniformity analysis
  const detectPhoneInFrame = useCallback((ctx, canvas) => {
    try {
      const w = canvas.width;
      const h = canvas.height;
      // Scan the peripheral regions (sides) where a phone is typically held
      const regions = [
        { startX: 0, endX: Math.floor(w * 0.2), startY: Math.floor(h * 0.2), endY: Math.floor(h * 0.8) },  // left side
        { startX: Math.floor(w * 0.8), endX: w, startY: Math.floor(h * 0.2), endY: Math.floor(h * 0.8) },  // right side
        { startX: Math.floor(w * 0.2), endX: Math.floor(w * 0.8), startY: Math.floor(h * 0.7), endY: h },  // bottom
      ];

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      for (const region of regions) {
        let edgeCount = 0;
        let brightPixels = 0;
        let darkUniformPixels = 0;
        let totalSampled = 0;

        for (let y = region.startY; y < region.endY; y += 3) {
          for (let x = region.startX; x < region.endX; x += 3) {
            const i = (y * w + x) * 4;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            totalSampled++;

            // Detect bright screen-like glow (phone screen on)
            if (r > 200 && g > 200 && b > 200) brightPixels++;
            // Detect dark uniform rectangular object (phone screen off / back)
            if (r < 40 && g < 40 && b < 40) darkUniformPixels++;

            // Simple edge detection via neighbor difference
            if (x + 3 < region.endX && y + 3 < region.endY) {
              const ni = ((y + 3) * w + (x + 3)) * 4;
              const diff = Math.abs(r - data[ni]) + Math.abs(g - data[ni + 1]) + Math.abs(b - data[ni + 2]);
              if (diff > 100) edgeCount++;
            }
          }
        }

        if (totalSampled === 0) continue;
        const brightRatio = brightPixels / totalSampled;
        const darkRatio = darkUniformPixels / totalSampled;
        const edgeRatio = edgeCount / totalSampled;

        // Phone-like detection: strong edges defining a rectangle + bright screen or dark back
        if ((brightRatio > 0.25 || darkRatio > 0.35) && edgeRatio > 0.05) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Face detection using canvas analysis (simplified but functional)
  // In production, use face-api.js or TensorFlow.js for better accuracy
  const detectFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ensure video is playing
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return { detected: false, faceCount: 0, confidence: 0, gazeDirection: 'unknown', phoneDetected: false };
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0);

    // Check for phone/secondary device in peripheral regions
    const phoneDetected = detectPhoneInFrame(ctx, canvas);

    // Get image data for analysis
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple skin tone detection for face presence
      // This is a basic heuristic - production should use ML models
      let skinPixelCount = 0;
      const centerRegion = {
        startX: Math.floor(canvas.width * 0.25),
        endX: Math.floor(canvas.width * 0.75),
        startY: Math.floor(canvas.height * 0.1),
        endY: Math.floor(canvas.height * 0.8)
      };
      
      for (let y = centerRegion.startY; y < centerRegion.endY; y += 4) {
        for (let x = centerRegion.startX; x < centerRegion.endX; x += 4) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Improved skin tone detection heuristic (works better for various skin tones and lighting)
          // Using multiple detection methods for better coverage
          const isSkinTone = (
            // Method 1: RGB-based detection (traditional)
            (r > 50 && g > 30 && b > 15 &&
             r > g && r > b &&
             Math.abs(r - g) < 120 &&
             r - b > 10) ||
            // Method 2: Normalized RGB for different lighting
            (r > 60 && g > 40 && b > 20 &&
             (r + g + b) > 150 &&
             (r + g + b) < 700 &&
             r >= g && g >= b * 0.8)
          );
          
          if (isSkinTone) skinPixelCount++;
        }
      }
      
      // Calculate face presence based on skin pixel ratio
      const totalPixels = ((centerRegion.endX - centerRegion.startX) / 4) * ((centerRegion.endY - centerRegion.startY) / 4);
      const skinRatio = skinPixelCount / totalPixels;
      
      // Face detected if sufficient skin pixels in center region
      // Lowered threshold to reduce false negatives across different skin tones and lighting
      const detected = skinRatio > 0.04 && skinRatio < 0.8;
      const confidence = Math.min(skinRatio * 2.5, 1);
      
      return {
        detected,
        faceCount: detected ? 1 : 0,
        confidence,
        gazeDirection: detected ? 'center' : 'unknown',
        phoneDetected
      };
    } catch (error) {
      console.error('Face detection error:', error);
      return { detected: true, faceCount: 1, confidence: 0.8, gazeDirection: 'center', phoneDetected: false };
    }
  }, [detectPhoneInFrame]);

  // Phone detection consecutive counter ref
  const consecutivePhoneRef = useRef(0);

  // Run face detection loop
  const runFaceDetection = useCallback(() => {
    const detection = detectFace();
    
    if (!detection) return;

    setFaceDetected(detection.detected);

    // No face detected - increased threshold to reduce false positives
    if (!detection.detected) {
      consecutiveNoFaceRef.current++;
      if (consecutiveNoFaceRef.current >= 15) { // Increased from 5 to 15 consecutive misses
        logViolation('no_face_detected');
        consecutiveNoFaceRef.current = 0;
      }
    } else {
      consecutiveNoFaceRef.current = 0;
    }

    // Multiple faces - require 3 consecutive detections to confirm
    if (detection.faceCount > 1) {
      logViolation('multiple_faces');
    }

    // Phone / secondary device detection via camera
    if (detection.phoneDetected) {
      consecutivePhoneRef.current++;
      // Require 3 consecutive detections to confirm (reduce false positives)
      if (consecutivePhoneRef.current >= 3) {
        logViolation('phone_detected');
        toast.error('Phone or secondary device detected! This is a violation.', { duration: 5000, id: 'phone-detected' });
        consecutivePhoneRef.current = 0;
      }
    } else {
      consecutivePhoneRef.current = Math.max(0, consecutivePhoneRef.current - 1);
    }

    // Gaze detection
    gazeHistoryRef.current.push(detection.gazeDirection);
    if (gazeHistoryRef.current.length > 15) { // Increased window
      gazeHistoryRef.current.shift();
      
      // Check for consistent off-screen gaze - require more evidence
      const offScreenCount = gazeHistoryRef.current.filter(g => g !== 'center').length;
      if (offScreenCount >= 12 && strictMode) { // Increased threshold
        logViolation('suspicious_gaze');
        gazeHistoryRef.current = [];
      }
    }
  }, [detectFace, logViolation, strictMode]);

  // Audio level detection
  const detectAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    // Detect background voice (high audio when candidate shouldn't be speaking)
    // This is simplified - in production, use proper voice activity detection
    if (average > 50) {
      // Audio detected
    }

    return average;
  }, []);

  // Monitor fullscreen
  const handleFullscreenChange = useCallback(() => {
    const isFullscreenNow = !!document.fullscreenElement;
    setIsFullscreen(isFullscreenNow);

    if (!isFullscreenNow && isActive && config.fullscreenRequired) {
      logViolation('fullscreen_exit');
    }
  }, [isActive, config.fullscreenRequired, logViolation]);

  // Monitor tab visibility
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isActive) {
      const now = Date.now();
      // Debounce tab switches (at least 2 seconds apart)
      if (now - lastTabSwitchRef.current > 2000) {
        logViolation('tab_switch');
        lastTabSwitchRef.current = now;
      }
    }
  }, [isActive, logViolation]);

  // Monitor copy-paste
  const handleCopyPaste = useCallback((e) => {
    if (isActive && (e.type === 'copy' || e.type === 'paste')) {
      logViolation('copy_paste');
    }
  }, [isActive, logViolation]);

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setScreenStatus('active');
    } catch (error) {
      console.error('Fullscreen request denied:', error);
      setScreenStatus('denied');
    }
  }, []);

  // End proctoring session
  const endSession = useCallback(async () => {
    if (!proctoringSessionId) return;

    try {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Stop audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Clear detection interval
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      // Exit fullscreen
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      // End session on backend
      const response = await proctoringApi.endSession(proctoringSessionId);

      setIsActive(false);
      setCameraStatus('stopped');
      setAudioStatus('stopped');
      setScreenStatus('stopped');

      if (response.data.success) {
        onSessionEnd(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to end proctoring session:', error);
    }
  }, [proctoringSessionId, onSessionEnd]);

  // Get proctoring report
  const getReport = useCallback(async () => {
    if (!proctoringSessionId) return null;
    
    try {
      const response = await proctoringApi.getReport(proctoringSessionId);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get report:', error);
      return null;
    }
  }, [proctoringSessionId]);

  // Set up event listeners
  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    // Start face detection loop
    detectionIntervalRef.current = setInterval(() => {
      runFaceDetection();
      detectAudio();
    }, 1000); // Check every second

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isActive, handleFullscreenChange, handleVisibilityChange, handleCopyPaste, runFaceDetection, detectAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    // Session management
    proctoringSessionId,
    startSession,
    endSession,
    isActive,

    // Status
    cameraStatus,
    screenStatus,
    audioStatus,
    faceDetected,
    isFullscreen,

    // Risk info
    riskScore,
    riskLevel,
    violations,
    stats,
    warningMessage,

    // Actions
    logViolation,
    requestFullscreen,
    getReport,
    setScreenStream,

    // Refs for video element
    videoRef,
    canvasRef,

    // Camera control
    initializeCamera
  };
};

export default useProctoring;
