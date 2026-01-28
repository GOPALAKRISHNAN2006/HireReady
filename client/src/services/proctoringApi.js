/**
 * ===========================================
 * Proctoring API Service
 * ===========================================
 * 
 * Frontend API service for proctoring endpoints.
 */

import api from './api';

export const proctoringApi = {
  // Session management
  startSession: (data) => api.post('/proctoring/session/start', data),
  startSessionForced: (data) => api.post('/proctoring/session/start', { ...data, forceNew: true }),
  endSession: (id) => api.post(`/proctoring/session/${id}/end`),
  clearSessions: () => api.post('/proctoring/session/clear'),
  getSession: (id) => api.get(`/proctoring/session/${id}`),
  getMySessions: (params) => api.get('/proctoring/my-sessions', { params }),
  
  // Violations
  logViolation: (sessionId, data) => api.post(`/proctoring/session/${sessionId}/violation`, data),
  
  // Face enrollment
  enrollFace: (sessionId, data) => api.post(`/proctoring/session/${sessionId}/face-enrollment`, data),
  
  // Reports
  getReport: (sessionId) => api.get(`/proctoring/session/${sessionId}/report`),
  
  // Admin/Proctor endpoints
  getAlerts: (params) => api.get('/proctoring/alerts', { params }),
  acknowledgeAlert: (alertId) => api.post(`/proctoring/alerts/${alertId}/acknowledge`),
  getSessionsForReview: (params) => api.get('/proctoring/review', { params }),
  submitReview: (sessionId, data) => api.post(`/proctoring/session/${sessionId}/review`, data),
};

export default proctoringApi;
