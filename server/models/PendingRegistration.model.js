/**
 * ===========================================
 * Pending Registration Model - MongoDB Schema
 * ===========================================
 *
 * Stores temporary user registration details before email verification.
 * Automatically removed by MongoDB TTL index after 24 hours if unverified.
 */

const mongoose = require('mongoose');

const pendingRegistrationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    targetRole: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    verificationToken: {
      type: String,
      required: true,
    },
    verificationExpires: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // MongoDB TTL index: automatically deletes document after 24 hours (86400 seconds)
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup
pendingRegistrationSchema.index({ verificationToken: 1 });

module.exports = mongoose.model('PendingRegistration', pendingRegistrationSchema);
