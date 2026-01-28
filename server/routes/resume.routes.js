/**
 * Resume Routes
 */

const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume.model');
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

module.exports = router;
