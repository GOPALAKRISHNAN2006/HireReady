/**
 * ===========================================
 * Models Index - Export All Models
 * ===========================================
 */

const User = require('./User.model');
const Question = require('./Question.model');
const Interview = require('./Interview.model');
const Feedback = require('./Feedback.model');
const Analytics = require('./Analytics.model');
const { DailyChallenge, UserChallenge, UserStreak } = require('./DailyChallenge.model');
const { CommunityPost, Discussion, Mentor } = require('./Community.model');
const { CareerPath, UserCareerProgress } = require('./Career.model');
const { SkillCategory, UserSkill } = require('./Skill.model');
const { InterviewTip, UserTipInteraction } = require('./Tip.model');

module.exports = {
  User,
  Question,
  Interview,
  Feedback,
  Analytics,
  DailyChallenge,
  UserChallenge,
  UserStreak,
  CommunityPost,
  Discussion,
  Mentor,
  CareerPath,
  UserCareerProgress,
  SkillCategory,
  UserSkill,
  InterviewTip,
  UserTipInteraction
};
