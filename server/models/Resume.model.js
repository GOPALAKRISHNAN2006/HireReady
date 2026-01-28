/**
 * Resume Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume'
  },
  template: {
    type: String,
    enum: ['modern', 'classic', 'minimal', 'professional', 'creative'],
    default: 'modern'
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String,
    summary: String
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    gpa: String,
    achievements: [String]
  }],
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
    achievements: [String]
  }],
  skills: [{
    category: String,
    items: [String]
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String,
    github: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    link: String
  }],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['basic', 'conversational', 'professional', 'native']
    }
  }],
  interests: [String],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

resumeSchema.index({ user: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
