# Database Schema (ERD) - HireReady

This document describes the primary MongoDB collections and relationships.

Collections:

- users
  - _id
  - firstName, lastName, email, password (hashed), role (user|admin), avatar
  - preferences, stats, refreshToken, isActive

- questions
  - _id
  - title, body, type (coding|aptitude|behavioral), difficulty, tags, author
  - createdAt, updatedAt

- interviews
  - _id
  - userId -> references `users._id`
  - questions: [{ questionId -> `questions._id`, answer, score, timeTaken }]
  - status, startedAt, completedAt, duration, totalScore

- analytics
  - _id
  - userId -> references `users._id`
  - interviewsCount, averageScore, lastInterviewAt, trendData

- proctoring
  - _id
  - interviewId -> references `interviews._id`
  - events (face-detection, tab-switch, focus-loss) with timestamps

- savedQuestions
  - _id
  - userId -> references `users._id`
  - questionId -> references `questions._id`
  - notes, starred

Indexes & Scaling Notes:

- Index `users.email` (unique) for fast lookups and authentication.
- Index `interviews.userId` and `interviews.startedAt` for analytics queries.
- Consider compound indexes for frequent analytics queries (userId + createdAt).
- For large scale, consider MongoDB sharding and using read-replicas for analytics-heavy reads.

See [server/models](server/models) for Mongoose schema definitions.
