/**
 * Resume Routes
 */

const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume.model');
const AIService = require('../services/ai.service');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all resumes for user
router.get('/', protect, asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .lean();

  res.json({
    success: true,
    data: resumes
  });
}));

// Get single resume
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ 
    _id: req.params.id,
    user: req.user._id 
  });

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }

  res.json({
    success: true,
    data: resume
  });
}));

// Create resume
router.post('/', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.create({
    user: req.user._id,
    ...req.body,
    personalInfo: {
      fullName: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      ...req.body.personalInfo
    }
  });

  res.status(201).json({
    success: true,
    message: 'Resume created successfully',
    data: resume
  });
}));

// Update resume
router.put('/:id', protect, asyncHandler(async (req, res) => {
  let resume = await Resume.findOne({ 
    _id: req.params.id,
    user: req.user._id 
  });

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }

  resume = await Resume.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Resume updated successfully',
    data: resume
  });
}));

// Delete resume
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ 
    _id: req.params.id,
    user: req.user._id 
  });

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }

  res.json({
    success: true,
    message: 'Resume deleted successfully'
  });
}));

// Duplicate resume
router.post('/:id/duplicate', protect, asyncHandler(async (req, res) => {
  const original = await Resume.findOne({ 
    _id: req.params.id,
    user: req.user._id 
  });

  if (!original) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }

  const duplicate = await Resume.create({
    ...original.toObject(),
    _id: undefined,
    title: `${original.title} (Copy)`,
    createdAt: undefined,
    updatedAt: undefined
  });

  res.status(201).json({
    success: true,
    message: 'Resume duplicated successfully',
    data: duplicate
  });
}));

// Analyze resume with AI
router.post('/:id/analyze', protect, asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ 
    _id: req.params.id,
    user: req.user._id 
  });

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    });
  }

  // Build resume text from structured data
  const sections = [];
  if (resume.personalInfo) {
    sections.push(`Name: ${resume.personalInfo.fullName || ''}`);
    if (resume.personalInfo.summary) sections.push(`Summary: ${resume.personalInfo.summary}`);
  }
  if (resume.experience?.length) {
    sections.push('Experience: ' + resume.experience.map(e => 
      `${e.title || ''} at ${e.company || ''} - ${e.description || ''}`
    ).join('; '));
  }
  if (resume.education?.length) {
    sections.push('Education: ' + resume.education.map(e => 
      `${e.degree || ''} at ${e.institution || ''}`
    ).join('; '));
  }
  if (resume.skills?.length) {
    sections.push('Skills: ' + resume.skills.join(', '));
  }

  const resumeText = sections.join('\n');
  const targetRole = req.body.targetRole || 'software engineering';

  try {
    const analysis = await AIService.analyzeResume({
      resumeText,
      targetRole
    });

    // Save analysis to resume
    resume.aiAnalysis = analysis;
    resume.lastAnalyzedAt = new Date();
    await resume.save();

    res.json({
      success: true,
      message: 'Resume analyzed successfully',
      data: analysis
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume. Please try again.'
    });
  }
}));

module.exports = router;
