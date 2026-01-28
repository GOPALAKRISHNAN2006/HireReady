/**
 * ===========================================
 * Communication Assessment API Service
 * ===========================================
 * 
 * Frontend service for communication skills assessment.
 */

import api from './api';

export const communicationApi = {
  /**
   * Submit a single transcript for assessment
   */
  assessTranscript: async (data) => {
    return api.post('/communication/assess', data);
  },

  /**
   * Submit multiple transcripts for batch assessment
   * Useful for assessing an entire interview at once
   */
  batchAssess: async (data) => {
    return api.post('/communication/batch-assess', data);
  },

  /**
   * Get a specific assessment by ID
   */
  getAssessment: async (assessmentId) => {
    return api.get(`/communication/assessment/${assessmentId}`);
  },

  /**
   * Get user's assessment history
   */
  getHistory: async (params = {}) => {
    return api.get('/communication/history', { params });
  },

  /**
   * Get user's communication stats and averages
   */
  getStats: async () => {
    return api.get('/communication/stats');
  },

  /**
   * Get all assessments for a specific interview
   */
  getInterviewAssessments: async (interviewId) => {
    return api.get(`/communication/interview/${interviewId}`);
  }
};

export default communicationApi;
