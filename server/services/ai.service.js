/**
 * ===========================================
 * AI Service - OpenAI & Gemini Integration
 * ===========================================
 * 
 * Provides AI-powered features including:
 * - Question generation
 * - Answer evaluation with NLP
 * - Interview insights generation
 * - Resume analysis
 */

const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const natural = require('natural');
const aiConfig = require('../config/ai.config');

class AIService {
  constructor() {
    this.provider = aiConfig.defaultProvider;
    this.openai = null;
    this.gemini = null;

    // Initialize OpenAI if configured
    if (aiConfig.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: aiConfig.openai.apiKey
      });
    }

    // Initialize Gemini if configured
    if (aiConfig.gemini.apiKey) {
      const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);
      this.gemini = genAI.getGenerativeModel({ model: aiConfig.gemini.model });
    }

    // Initialize NLP tools for fallback analysis
    this.tokenizer = new natural.WordTokenizer();
    this.TfIdf = natural.TfIdf;
    this.stemmer = natural.PorterStemmer;
    this.sentiment = new natural.SentimentAnalyzer('English', this.stemmer, 'afinn');
  }

  /**
   * Get current AI provider
   * @returns {string} - Provider name
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Check if AI service is configured
   * @returns {Object} - Status object
   */
  async checkStatus() {
    return {
      isConfigured: !!(this.openai || this.gemini),
      openai: !!this.openai,
      gemini: !!this.gemini,
      activeProvider: this.provider
    };
  }

  /**
   * Generate interview questions using AI
   * @param {Object} params - Generation parameters
   * @returns {Promise<Array>} - Generated questions
   */
  async generateQuestions(params) {
    const { category, difficulty, count, targetRole, topics, style } = params;

    const prompt = this._buildQuestionGenerationPrompt({
      category,
      difficulty,
      count,
      targetRole,
      topics,
      style
    });

    try {
      let response;

      if (this.provider === 'openai' && this.openai) {
        response = await this._generateWithOpenAI(prompt);
      } else if (this.provider === 'gemini' && this.gemini) {
        response = await this._generateWithGemini(prompt);
      } else {
        // Fallback to mock questions if no AI configured
        return this._generateMockQuestions(params);
      }

      return this._parseQuestionsResponse(response);

    } catch (error) {
      console.error('AI Question Generation Error:', error);
      // Fallback to mock questions
      return this._generateMockQuestions(params);
    }
  }

  /**
   * Evaluate user's answer
   * @param {Object} params - Evaluation parameters
   * @returns {Promise<Object>} - Evaluation results
   */
  async evaluateAnswer(params) {
    const { question, expectedAnswer, userAnswer, category, keyPoints } = params;

    // If no answer provided
    if (!userAnswer || userAnswer.trim().length === 0) {
      return this._getEmptyAnswerEvaluation();
    }

    const prompt = this._buildEvaluationPrompt({
      question,
      expectedAnswer,
      userAnswer,
      category,
      keyPoints
    });

    try {
      let response;

      if (this.provider === 'openai' && this.openai) {
        response = await this._generateWithOpenAI(prompt);
      } else if (this.provider === 'gemini' && this.gemini) {
        response = await this._generateWithGemini(prompt);
      } else {
        // Fallback to NLP-based evaluation
        return this._evaluateWithNLP(params);
      }

      return this._parseEvaluationResponse(response, keyPoints);

    } catch (error) {
      console.error('AI Evaluation Error:', error);
      // Fallback to NLP-based evaluation
      return this._evaluateWithNLP(params);
    }
  }

  /**
   * Generate interview insights
   * @param {Object} params - Interview data
   * @returns {Promise<Object>} - Insights
   */
  async generateInterviewInsights(params) {
    const { category, difficulty, responses, overallScore, categoryScores } = params;

    const prompt = this._buildInsightsPrompt({
      category,
      difficulty,
      responses,
      overallScore,
      categoryScores
    });

    try {
      let response;

      if (this.provider === 'openai' && this.openai) {
        response = await this._generateWithOpenAI(prompt);
      } else if (this.provider === 'gemini' && this.gemini) {
        response = await this._generateWithGemini(prompt);
      } else {
        return this._generateBasicInsights(params);
      }

      return this._parseInsightsResponse(response, overallScore);

    } catch (error) {
      console.error('AI Insights Error:', error);
      return this._generateBasicInsights(params);
    }
  }

  /**
   * Analyze resume
   * @param {Object} params - Resume data
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeResume(params) {
    const { resumeText, targetRole } = params;

    const prompt = `Analyze the following resume for a ${targetRole || 'software engineering'} position.
    
Resume:
${resumeText}

Provide analysis in JSON format with:
- skills: Array of identified skills
- experience_level: junior/mid/senior
- strengths: Array of key strengths
- gaps: Array of potential skill gaps
- recommended_topics: Array of topics to focus on for interview preparation
- overall_readiness: Score from 1-100`;

    try {
      let response;

      if (this.provider === 'openai' && this.openai) {
        response = await this._generateWithOpenAI(prompt);
      } else if (this.provider === 'gemini' && this.gemini) {
        response = await this._generateWithGemini(prompt);
      } else {
        return this._analyzeResumeBasic(resumeText);
      }

      return JSON.parse(response);

    } catch (error) {
      console.error('Resume Analysis Error:', error);
      return this._analyzeResumeBasic(resumeText);
    }
  }

  /**
   * Suggest answer improvements
   * @param {Object} params - Answer data
   * @returns {Promise<Object>} - Improvement suggestions
   */
  async suggestImprovements(params) {
    const { question, userAnswer, category } = params;

    const prompt = `Given this ${category} interview question and the candidate's answer, provide specific suggestions for improvement.

Question: ${question}
Answer: ${userAnswer}

Provide response in JSON format with:
- improvedAnswer: A better version of the answer
- suggestions: Array of specific improvement suggestions
- missingPoints: Key points that should be included
- structureAdvice: How to better structure the answer`;

    try {
      let response;

      if (this.provider === 'openai' && this.openai) {
        response = await this._generateWithOpenAI(prompt);
      } else if (this.provider === 'gemini' && this.gemini) {
        response = await this._generateWithGemini(prompt);
      } else {
        return {
          suggestions: ['Consider adding more technical details', 'Use specific examples'],
          missingPoints: ['Could mention time/space complexity', 'Consider edge cases'],
          structureAdvice: 'Start with the approach, then implementation, then complexity analysis'
        };
      }

      return JSON.parse(response);

    } catch (error) {
      console.error('Improvement Suggestion Error:', error);
      return {
        suggestions: ['Add more specific details', 'Include examples from experience'],
        missingPoints: [],
        structureAdvice: 'Structure your answer with a clear beginning, middle, and end'
      };
    }
  }

  // ===========================================
  // Private Methods - AI Providers
  // ===========================================

  async _generateWithOpenAI(prompt) {
    const completion = await this.openai.chat.completions.create({
      model: aiConfig.openai.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer and career coach. Always respond with valid JSON when asked for structured data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: aiConfig.openai.maxTokens,
      temperature: aiConfig.openai.temperature
    });

    return completion.choices[0].message.content;
  }

  async _generateWithGemini(prompt) {
    const result = await this.gemini.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  // ===========================================
  // Private Methods - Prompt Builders
  // ===========================================

  _buildQuestionGenerationPrompt({ category, difficulty, count, targetRole, topics, style }) {
    const categoryDescriptions = {
      dsa: 'Data Structures and Algorithms',
      web: 'Web Development (frontend and backend)',
      ml: 'Machine Learning and AI',
      'system-design': 'System Design and Architecture',
      behavioral: 'Behavioral and HR',
      database: 'Database Management and SQL',
      devops: 'DevOps and Cloud Infrastructure',
      mobile: 'Mobile App Development'
    };

    return `Generate ${count} ${difficulty} level ${categoryDescriptions[category]} interview questions${targetRole ? ` for a ${targetRole} position` : ''}.

${topics ? `Focus on these topics: ${topics.join(', ')}` : ''}

Style: ${style === 'behavioral' ? 'Behavioral/situational questions' : 'Technical questions'}

For each question, provide a JSON array with objects containing:
- text: The question text
- type: technical/behavioral/situational/coding/conceptual
- expectedAnswer: A comprehensive expected answer
- keyPoints: Array of key points the answer should cover
- hints: Array of hints to help the candidate
- followUpQuestions: Array of potential follow-up questions
- tags: Relevant tags
- recommendedTimeMinutes: Suggested time to answer (1-10 minutes)

Respond ONLY with the JSON array, no additional text.`;
  }

  _buildEvaluationPrompt({ question, expectedAnswer, userAnswer, category, keyPoints }) {
    return `Evaluate this ${category} interview response.

Question: ${question}

${expectedAnswer ? `Expected Answer Reference: ${expectedAnswer}` : ''}
${keyPoints?.length ? `Key Points to Cover: ${keyPoints.join(', ')}` : ''}

Candidate's Answer: ${userAnswer}

Evaluate and provide a JSON response with:
- overallScore: Number 0-100
- relevanceScore: How relevant the answer is (0-100)
- completenessScore: How complete the answer is (0-100)
- clarityScore: How clear the explanation is (0-100)
- technicalAccuracyScore: Technical correctness (0-100)
- communicationScore: Quality of communication (0-100)
- confidenceScore: Perceived confidence level (0-100)
- strengths: Array of what was done well
- improvements: Array of areas for improvement
- suggestions: Array of specific suggestions
- detailedFeedback: A paragraph of detailed feedback
- keyPointsCovered: Array of {point: string, covered: boolean}

Respond ONLY with the JSON object.`;
  }

  _buildInsightsPrompt({ category, difficulty, responses, overallScore, categoryScores }) {
    const responseSummary = responses
      .filter(r => r.isEvaluated)
      .map((r, i) => `Q${i + 1}: Score ${r.evaluation?.overallScore || 0}/100`)
      .join('\n');

    return `Based on this ${category} interview performance at ${difficulty} level:

Overall Score: ${overallScore}/100
Category Breakdown:
- Relevance: ${categoryScores?.relevance || 0}
- Completeness: ${categoryScores?.completeness || 0}
- Clarity: ${categoryScores?.clarity || 0}
- Technical Accuracy: ${categoryScores?.technicalAccuracy || 0}
- Communication: ${categoryScores?.communication || 0}

Question Performance:
${responseSummary}

Generate comprehensive interview insights as JSON:
- overallFeedback: A detailed paragraph summarizing performance
- topStrengths: Array of 3-5 key strengths demonstrated
- areasToImprove: Array of 3-5 areas needing improvement
- recommendations: Array of 3-5 specific study/practice recommendations
- performanceLevel: excellent/good/average/needs-improvement/poor

Respond ONLY with the JSON object.`;
  }

  // ===========================================
  // Private Methods - Response Parsers
  // ===========================================

  _parseQuestionsResponse(response) {
    try {
      // Clean the response and parse JSON
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse questions response:', error);
      return [];
    }
  }

  _parseEvaluationResponse(response, keyPoints) {
    try {
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const evaluation = JSON.parse(cleanedResponse);

      // Ensure all required fields exist
      return {
        overallScore: evaluation.overallScore || 0,
        relevanceScore: evaluation.relevanceScore || 0,
        completenessScore: evaluation.completenessScore || 0,
        clarityScore: evaluation.clarityScore || 0,
        technicalAccuracyScore: evaluation.technicalAccuracyScore || 0,
        communicationScore: evaluation.communicationScore || 0,
        confidenceScore: evaluation.confidenceScore || 0,
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
        suggestions: evaluation.suggestions || [],
        detailedFeedback: evaluation.detailedFeedback || '',
        keyPointsCovered: evaluation.keyPointsCovered || keyPoints?.map(p => ({ point: p, covered: false })) || []
      };
    } catch (error) {
      console.error('Failed to parse evaluation response:', error);
      return this._getDefaultEvaluation();
    }
  }

  _parseInsightsResponse(response, overallScore) {
    try {
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const insights = JSON.parse(cleanedResponse);

      return {
        overallFeedback: insights.overallFeedback || 'No feedback available.',
        topStrengths: insights.topStrengths || [],
        areasToImprove: insights.areasToImprove || [],
        recommendations: insights.recommendations || [],
        performanceLevel: insights.performanceLevel || this._getPerformanceLevel(overallScore)
      };
    } catch (error) {
      console.error('Failed to parse insights response:', error);
      return this._generateBasicInsights({ overallScore });
    }
  }

  // ===========================================
  // Private Methods - Fallbacks & NLP
  // ===========================================

  _evaluateWithNLP(params) {
    const { question, expectedAnswer, userAnswer, keyPoints } = params;

    if (!userAnswer || userAnswer.trim().length < 10) {
      return this._getEmptyAnswerEvaluation();
    }

    // Tokenize answers
    const userTokens = this.tokenizer.tokenize(userAnswer.toLowerCase());
    const expectedTokens = expectedAnswer ? this.tokenizer.tokenize(expectedAnswer.toLowerCase()) : [];

    // Calculate similarity using TF-IDF
    const tfidf = new this.TfIdf();
    tfidf.addDocument(userAnswer);
    if (expectedAnswer) {
      tfidf.addDocument(expectedAnswer);
    }

    // Calculate basic scores
    const wordCount = userTokens.length;
    const lengthScore = Math.min(100, (wordCount / 50) * 100); // Optimal around 50+ words

    // Check key points coverage
    const keyPointsCovered = keyPoints?.map(point => {
      const pointTokens = this.tokenizer.tokenize(point.toLowerCase());
      const covered = pointTokens.some(token => userTokens.includes(token));
      return { point, covered };
    }) || [];

    const keyPointsScore = keyPoints?.length 
      ? (keyPointsCovered.filter(k => k.covered).length / keyPoints.length) * 100 
      : 50;

    // Sentiment analysis for confidence
    const sentimentScore = this.sentiment.getSentiment(userTokens);
    const confidenceScore = Math.max(0, Math.min(100, 50 + sentimentScore * 10));

    // Calculate relevance (if expected answer provided)
    let relevanceScore = 50;
    if (expectedAnswer) {
      const commonTokens = userTokens.filter(t => expectedTokens.includes(t)).length;
      relevanceScore = Math.min(100, (commonTokens / Math.max(expectedTokens.length, 1)) * 150);
    }

    // Calculate overall score
    const overallScore = Math.round(
      (relevanceScore * 0.3) +
      (lengthScore * 0.2) +
      (keyPointsScore * 0.3) +
      (confidenceScore * 0.2)
    );

    return {
      overallScore,
      relevanceScore: Math.round(relevanceScore),
      completenessScore: Math.round(lengthScore),
      clarityScore: Math.round(lengthScore * 0.9),
      technicalAccuracyScore: Math.round(keyPointsScore),
      communicationScore: Math.round((lengthScore + confidenceScore) / 2),
      confidenceScore: Math.round(confidenceScore),
      strengths: this._generateStrengths(overallScore, wordCount),
      improvements: this._generateImprovements(overallScore, wordCount, keyPointsCovered),
      suggestions: ['Try to include more specific examples', 'Consider mentioning edge cases'],
      detailedFeedback: this._generateBasicFeedback(overallScore),
      keyPointsCovered
    };
  }

  _generateMockQuestions(params) {
    const { category, difficulty, count } = params;

    const mockQuestions = {
      dsa: [
        { text: 'Explain the difference between a Stack and a Queue.', type: 'conceptual' },
        { text: 'How would you implement a binary search algorithm?', type: 'coding' },
        { text: 'What is the time complexity of quicksort?', type: 'technical' },
        { text: 'Explain how a hash table works.', type: 'conceptual' },
        { text: 'How would you detect a cycle in a linked list?', type: 'coding' },
        { text: 'What is the difference between DFS and BFS?', type: 'conceptual' },
        { text: 'Explain dynamic programming with an example.', type: 'technical' },
        { text: 'How would you reverse a linked list?', type: 'coding' },
        { text: 'What is a binary search tree and its properties?', type: 'conceptual' },
        { text: 'Explain the concept of memoization.', type: 'technical' }
      ],
      web: [
        { text: 'Explain the difference between REST and GraphQL.', type: 'conceptual' },
        { text: 'What is the virtual DOM in React?', type: 'technical' },
        { text: 'How does CORS work?', type: 'technical' },
        { text: 'Explain the difference between cookies and localStorage.', type: 'conceptual' },
        { text: 'What are Web Components?', type: 'technical' },
        { text: 'Explain the event loop in JavaScript.', type: 'conceptual' },
        { text: 'What is the difference between SSR and CSR?', type: 'technical' },
        { text: 'How does authentication work with JWT?', type: 'technical' },
        { text: 'Explain CSS flexbox and grid differences.', type: 'conceptual' },
        { text: 'What are React hooks and why are they useful?', type: 'technical' }
      ],
      'web-development': [
        { text: 'Explain the difference between REST and GraphQL.', type: 'conceptual' },
        { text: 'What is the virtual DOM in React?', type: 'technical' },
        { text: 'How does CORS work?', type: 'technical' },
        { text: 'Explain the difference between cookies and localStorage.', type: 'conceptual' },
        { text: 'What are Web Components?', type: 'technical' },
        { text: 'Explain the event loop in JavaScript.', type: 'conceptual' },
        { text: 'What is the difference between SSR and CSR?', type: 'technical' },
        { text: 'How does authentication work with JWT?', type: 'technical' },
        { text: 'Explain CSS flexbox and grid differences.', type: 'conceptual' },
        { text: 'What are React hooks and why are they useful?', type: 'technical' }
      ],
      behavioral: [
        { text: 'Tell me about a challenging project you worked on.', type: 'behavioral' },
        { text: 'How do you handle disagreements with team members?', type: 'situational' },
        { text: 'Describe a time when you had to learn something quickly.', type: 'behavioral' },
        { text: 'How do you prioritize multiple tasks?', type: 'situational' },
        { text: 'Tell me about a time you failed and what you learned.', type: 'behavioral' },
        { text: 'How do you handle pressure and tight deadlines?', type: 'situational' },
        { text: 'Describe your ideal work environment.', type: 'behavioral' },
        { text: 'How do you stay updated with new technologies?', type: 'behavioral' },
        { text: 'Tell me about a time you mentored someone.', type: 'behavioral' },
        { text: 'How do you approach code reviews?', type: 'situational' }
      ],
      ml: [
        { text: 'Explain the difference between supervised and unsupervised learning.', type: 'conceptual' },
        { text: 'What is overfitting and how do you prevent it?', type: 'technical' },
        { text: 'Explain the bias-variance tradeoff.', type: 'conceptual' },
        { text: 'What are common evaluation metrics for classification?', type: 'technical' },
        { text: 'Explain how a neural network learns.', type: 'conceptual' },
        { text: 'What is the difference between CNN and RNN?', type: 'technical' },
        { text: 'Explain gradient descent and its variants.', type: 'conceptual' },
        { text: 'What is regularization and why is it used?', type: 'technical' },
        { text: 'Explain the attention mechanism in transformers.', type: 'conceptual' },
        { text: 'How do you handle imbalanced datasets?', type: 'technical' }
      ],
      'machine-learning': [
        { text: 'Explain the difference between supervised and unsupervised learning.', type: 'conceptual' },
        { text: 'What is overfitting and how do you prevent it?', type: 'technical' },
        { text: 'Explain the bias-variance tradeoff.', type: 'conceptual' },
        { text: 'What are common evaluation metrics for classification?', type: 'technical' },
        { text: 'Explain how a neural network learns.', type: 'conceptual' },
        { text: 'What is the difference between CNN and RNN?', type: 'technical' },
        { text: 'Explain gradient descent and its variants.', type: 'conceptual' },
        { text: 'What is regularization and why is it used?', type: 'technical' },
        { text: 'Explain the attention mechanism in transformers.', type: 'conceptual' },
        { text: 'How do you handle imbalanced datasets?', type: 'technical' }
      ],
      'system-design': [
        { text: 'How would you design a URL shortening service?', type: 'technical' },
        { text: 'Explain CAP theorem and its implications.', type: 'conceptual' },
        { text: 'How would you design a chat application?', type: 'technical' },
        { text: 'What is database sharding and when would you use it?', type: 'conceptual' },
        { text: 'How would you design a rate limiter?', type: 'technical' },
        { text: 'Explain microservices vs monolithic architecture.', type: 'conceptual' },
        { text: 'How would you design a notification system?', type: 'technical' },
        { text: 'What are different caching strategies?', type: 'conceptual' },
        { text: 'How would you design a distributed file storage system?', type: 'technical' },
        { text: 'Explain load balancing strategies.', type: 'conceptual' }
      ],
      database: [
        { text: 'Explain the difference between SQL and NoSQL databases.', type: 'conceptual' },
        { text: 'What are ACID properties in databases?', type: 'technical' },
        { text: 'Explain database indexing and its benefits.', type: 'conceptual' },
        { text: 'What is database normalization?', type: 'technical' },
        { text: 'Explain the difference between joins in SQL.', type: 'conceptual' },
        { text: 'What are stored procedures and when to use them?', type: 'technical' },
        { text: 'Explain database transactions and isolation levels.', type: 'conceptual' },
        { text: 'What is the difference between clustered and non-clustered indexes?', type: 'technical' },
        { text: 'How would you optimize a slow SQL query?', type: 'coding' },
        { text: 'Explain eventual consistency in distributed databases.', type: 'conceptual' }
      ],
      devops: [
        { text: 'Explain CI/CD and its benefits.', type: 'conceptual' },
        { text: 'What is containerization and how does Docker work?', type: 'technical' },
        { text: 'Explain Kubernetes and its core components.', type: 'conceptual' },
        { text: 'What is Infrastructure as Code?', type: 'technical' },
        { text: 'Explain the differences between containers and VMs.', type: 'conceptual' },
        { text: 'What is a service mesh?', type: 'technical' },
        { text: 'How would you implement blue-green deployment?', type: 'technical' },
        { text: 'Explain monitoring and observability best practices.', type: 'conceptual' },
        { text: 'What is GitOps?', type: 'technical' },
        { text: 'How do you manage secrets in a cloud environment?', type: 'technical' }
      ],
      mobile: [
        { text: 'Explain the difference between native and cross-platform development.', type: 'conceptual' },
        { text: 'What is the Android activity lifecycle?', type: 'technical' },
        { text: 'Explain how React Native works.', type: 'conceptual' },
        { text: 'What are the key differences between iOS and Android development?', type: 'technical' },
        { text: 'How would you handle offline functionality in a mobile app?', type: 'technical' },
        { text: 'Explain mobile app performance optimization techniques.', type: 'conceptual' },
        { text: 'What is Flutter and how does it work?', type: 'technical' },
        { text: 'How do you handle push notifications?', type: 'technical' },
        { text: 'Explain responsive design in mobile apps.', type: 'conceptual' },
        { text: 'What are common security considerations for mobile apps?', type: 'technical' }
      ],
      general: [
        { text: 'Tell me about yourself and your experience.', type: 'behavioral' },
        { text: 'Why are you interested in this position?', type: 'behavioral' },
        { text: 'What are your strengths and weaknesses?', type: 'behavioral' },
        { text: 'Where do you see yourself in 5 years?', type: 'behavioral' },
        { text: 'Describe a project you are most proud of.', type: 'behavioral' },
        { text: 'How do you approach problem-solving?', type: 'situational' },
        { text: 'What motivates you in your work?', type: 'behavioral' },
        { text: 'How do you handle feedback and criticism?', type: 'situational' },
        { text: 'What do you know about our company?', type: 'behavioral' },
        { text: 'Do you have any questions for us?', type: 'behavioral' }
      ],
      mixed: [
        { text: 'Explain the difference between a Stack and a Queue.', type: 'conceptual' },
        { text: 'What is the virtual DOM in React?', type: 'technical' },
        { text: 'How do you handle disagreements with team members?', type: 'situational' },
        { text: 'Explain database indexing and its benefits.', type: 'conceptual' },
        { text: 'How would you design a URL shortening service?', type: 'technical' },
        { text: 'Explain CI/CD and its benefits.', type: 'conceptual' },
        { text: 'Tell me about a challenging project you worked on.', type: 'behavioral' },
        { text: 'What is overfitting in machine learning?', type: 'technical' },
        { text: 'How do you prioritize multiple tasks?', type: 'situational' },
        { text: 'Explain the event loop in JavaScript.', type: 'conceptual' }
      ]
    };

    const questions = mockQuestions[category] || mockQuestions.general;
    // Shuffle and pick random questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(q => ({
      ...q,
      expectedAnswer: 'Sample expected answer for this question.',
      keyPoints: ['Key point 1', 'Key point 2', 'Key point 3'],
      hints: ['Consider the trade-offs', 'Think about edge cases'],
      followUpQuestions: ['Can you elaborate on that?'],
      tags: [category, difficulty],
      recommendedTimeMinutes: 5
    }));
  }

  _getEmptyAnswerEvaluation() {
    return {
      overallScore: 0,
      relevanceScore: 0,
      completenessScore: 0,
      clarityScore: 0,
      technicalAccuracyScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      strengths: [],
      improvements: ['Please provide an answer to the question'],
      suggestions: ['Take your time to think through the problem before responding'],
      detailedFeedback: 'No answer was provided for this question.',
      keyPointsCovered: []
    };
  }

  _getDefaultEvaluation() {
    return {
      overallScore: 50,
      relevanceScore: 50,
      completenessScore: 50,
      clarityScore: 50,
      technicalAccuracyScore: 50,
      communicationScore: 50,
      confidenceScore: 50,
      strengths: ['Attempted to answer the question'],
      improvements: ['Consider adding more detail'],
      suggestions: ['Practice explaining concepts clearly'],
      detailedFeedback: 'Your answer shows understanding but could be improved with more detail.',
      keyPointsCovered: []
    };
  }

  _generateBasicInsights(params) {
    const { overallScore = 50 } = params;
    const level = this._getPerformanceLevel(overallScore);

    return {
      overallFeedback: `Your overall performance score is ${overallScore}/100, which is ${level}. Continue practicing to improve your interview skills.`,
      topStrengths: overallScore >= 50 
        ? ['Demonstrated understanding of core concepts', 'Provided structured responses']
        : ['Attempted all questions'],
      areasToImprove: overallScore < 70
        ? ['Deepen technical knowledge', 'Practice explaining concepts clearly', 'Include more examples']
        : ['Consider edge cases', 'Optimize solutions'],
      recommendations: [
        'Practice mock interviews regularly',
        'Review fundamental concepts',
        'Work on communication skills'
      ],
      performanceLevel: level
    };
  }

  _getPerformanceLevel(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    if (score >= 30) return 'needs-improvement';
    return 'poor';
  }

  _generateStrengths(score, wordCount) {
    const strengths = [];
    if (wordCount >= 30) strengths.push('Provided a detailed response');
    if (score >= 60) strengths.push('Demonstrated understanding of the topic');
    if (score >= 80) strengths.push('Excellent clarity and structure');
    return strengths.length ? strengths : ['Attempted to answer the question'];
  }

  _generateImprovements(score, wordCount, keyPointsCovered) {
    const improvements = [];
    if (wordCount < 30) improvements.push('Provide more detailed explanations');
    if (score < 60) improvements.push('Review the core concepts');
    
    const missedPoints = keyPointsCovered?.filter(k => !k.covered) || [];
    if (missedPoints.length > 0) {
      improvements.push(`Cover key points: ${missedPoints.slice(0, 2).map(p => p.point).join(', ')}`);
    }
    
    return improvements.length ? improvements : ['Continue practicing'];
  }

  _generateBasicFeedback(score) {
    if (score >= 80) return 'Excellent response! You demonstrated strong understanding and clear communication.';
    if (score >= 60) return 'Good response with room for improvement. Consider adding more specific details and examples.';
    if (score >= 40) return 'Your answer shows some understanding but needs more depth. Focus on covering key points and providing clear explanations.';
    return 'Your response needs significant improvement. Review the fundamental concepts and practice articulating your thoughts clearly.';
  }

  _analyzeResumeBasic(resumeText) {
    const tokens = this.tokenizer.tokenize(resumeText.toLowerCase());
    
    const techSkills = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'git'];
    const foundSkills = techSkills.filter(skill => tokens.includes(skill));

    return {
      skills: foundSkills,
      experience_level: 'mid',
      strengths: ['Technical background detected'],
      gaps: ['Consider highlighting more specific achievements'],
      recommended_topics: ['System Design', 'Data Structures'],
      overall_readiness: 60
    };
  }
}

// Export singleton instance
module.exports = new AIService();
