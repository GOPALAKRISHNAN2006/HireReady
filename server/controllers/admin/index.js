/**
 * ===========================================
 * Admin Controllers Index
 * ===========================================
 * 
 * Exports all admin controllers for centralized access.
 * Provides clean separation of concerns for admin functionality.
 */

const dashboardController = require('./dashboard.controller');
const usersController = require('./users.controller');
const questionsController = require('./questions.controller');
const interviewsController = require('./interviews.controller');

module.exports = {
  dashboardController,
  usersController,
  questionsController,
  interviewsController
};
