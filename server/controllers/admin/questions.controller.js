/**
 * ===========================================
 * Admin Questions Controller
 * ===========================================
 * 
 * Handles all question management operations including:
 * - List questions with pagination and filtering
 * - CRUD operations
 * - Bulk import/export
 * - Approval workflow
 */

const Question = require('../../models/Question.model');

/**
 * Get all questions with filtering and pagination
 */
const getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = '',
      difficulty = '',
      type = '',
      isApproved = '',
      isActive = '',
      isAIGenerated = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { text: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) query.category = category;

    // Difficulty filter
    if (difficulty) query.difficulty = difficulty;

    // Type filter
    if (type) query.type = type;

    // Approval status filter
    if (isApproved !== '') query.isApproved = isApproved === 'true';

    // Active status filter
    if (isActive !== '') query.isActive = isActive === 'true';

    // AI generated filter
    if (isAIGenerated !== '') query.isAIGenerated = isAIGenerated === 'true';

    // Build sort object
    const sort = {};
    const validSortFields = ['createdAt', 'category', 'difficulty', 'timesAsked', 'averageScore'];
    sort[validSortFields.includes(sortBy) ? sortBy : 'createdAt'] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'firstName lastName email')
        .populate('approvedBy', 'firstName lastName'),
      Question.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        questions,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
};

/**
 * Get a single question by ID
 */
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { question }
    });
  } catch (error) {
    console.error('Get question by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question',
      error: error.message
    });
  }
};

/**
 * Create a new question
 */
const createQuestion = async (req, res) => {
  try {
    const adminUser = req.user;
    const {
      text,
      category,
      subcategory,
      difficulty,
      type,
      tags,
      targetRoles,
      expectedAnswer,
      keyPoints,
      hints,
      followUpQuestions,
      resources,
      recommendedTimeMinutes,
      company
    } = req.body;

    // Validate required fields
    if (!text || !category) {
      return res.status(400).json({
        success: false,
        message: 'Question text and category are required'
      });
    }

    const question = await Question.create({
      text,
      category,
      subcategory,
      difficulty: difficulty || 'medium',
      type: type || 'technical',
      tags: tags || [],
      targetRoles: targetRoles || [],
      expectedAnswer,
      keyPoints: keyPoints || [],
      hints: hints || [],
      followUpQuestions: followUpQuestions || [],
      resources: resources || [],
      recommendedTimeMinutes: recommendedTimeMinutes || 5,
      company,
      createdBy: adminUser._id,
      isApproved: true, // Admin-created questions are auto-approved
      approvedBy: adminUser._id,
      aiProvider: 'manual',
      isActive: true
    });

    console.log(`[AUDIT] Admin ${adminUser.email} created question: ${question._id}`);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: { question }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message
    });
  }
};

/**
 * Update a question
 */
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.user;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdBy;
    delete updateData.createdAt;

    const question = await Question.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    console.log(`[AUDIT] Admin ${adminUser.email} updated question: ${question._id}`);

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: { question }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message
    });
  }
};

/**
 * Delete a question (soft delete by default)
 */
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;
    const adminUser = req.user;

    if (permanent === 'true') {
      const question = await Question.findByIdAndDelete(id);
      
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      console.log(`[AUDIT] Admin ${adminUser.email} permanently deleted question: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Question permanently deleted'
      });
    } else {
      const question = await Question.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      console.log(`[AUDIT] Admin ${adminUser.email} soft-deleted question: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Question deactivated'
      });
    }
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message
    });
  }
};

/**
 * Approve a pending question
 */
const approveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.user;

    const question = await Question.findByIdAndUpdate(
      id,
      {
        isApproved: true,
        approvedBy: adminUser._id
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    console.log(`[AUDIT] Admin ${adminUser.email} approved question: ${question._id}`);

    res.status(200).json({
      success: true,
      message: 'Question approved',
      data: { question }
    });
  } catch (error) {
    console.error('Approve question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve question',
      error: error.message
    });
  }
};

/**
 * Reject a pending question
 */
const rejectQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminUser = req.user;

    const question = await Question.findByIdAndUpdate(
      id,
      {
        isActive: false,
        rejectionReason: reason
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    console.log(`[AUDIT] Admin ${adminUser.email} rejected question: ${question._id}, reason: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Question rejected',
      data: { question }
    });
  } catch (error) {
    console.error('Reject question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject question',
      error: error.message
    });
  }
};

/**
 * Get pending questions for approval
 */
const getPendingQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
      Question.find({ isApproved: false, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'firstName lastName email'),
      Question.countDocuments({ isApproved: false, isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        questions,
        count: questions.length,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get pending questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending questions',
      error: error.message
    });
  }
};

/**
 * Bulk import questions
 */
const bulkImportQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    const adminUser = req.user;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of questions'
      });
    }

    // Add creator and approval info to all questions
    const processedQuestions = questions.map(q => ({
      ...q,
      createdBy: adminUser._id,
      isApproved: true,
      approvedBy: adminUser._id,
      aiProvider: 'manual',
      isActive: true
    }));

    const inserted = await Question.insertMany(processedQuestions, { ordered: false });

    console.log(`[AUDIT] Admin ${adminUser.email} bulk imported ${inserted.length} questions`);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} questions`,
      data: { count: inserted.length }
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import questions',
      error: error.message,
      // Include partial success info if available
      insertedCount: error.insertedDocs?.length || 0
    });
  }
};

/**
 * Get question statistics
 */
const getQuestionStats = async (req, res) => {
  try {
    const [
      totalQuestions,
      activeQuestions,
      pendingQuestions,
      categoryStats,
      difficultyStats
    ] = await Promise.all([
      Question.countDocuments(),
      Question.countDocuments({ isActive: true, isApproved: true }),
      Question.countDocuments({ isApproved: false, isActive: true }),
      Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalQuestions,
        active: activeQuestions,
        pending: pendingQuestions,
        byCategory: categoryStats,
        byDifficulty: difficultyStats
      }
    });
  } catch (error) {
    console.error('Get question stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question statistics',
      error: error.message
    });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  approveQuestion,
  rejectQuestion,
  getPendingQuestions,
  bulkImportQuestions,
  getQuestionStats
};
