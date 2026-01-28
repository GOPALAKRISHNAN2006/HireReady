/**
 * ===========================================
 * Communication Assessment Service
 * ===========================================
 * 
 * AI-powered service to analyze communication skills
 * from interview transcripts with comprehensive 6-dimension evaluation.
 */

const CommunicationAssessment = require('../models/CommunicationAssessment.model');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const aiConfig = require('../config/ai.config');

// Filler words to detect
const FILLER_WORDS = [
  'um', 'uh', 'uhh', 'umm', 'er', 'err', 'ah', 'ahh',
  'like', 'you know', 'basically', 'actually', 'literally',
  'so', 'well', 'i mean', 'kind of', 'sort of', 'right',
  'okay so', 'yeah so'
];

// Professional vocabulary indicators
const PROFESSIONAL_VOCABULARY = [
  'implemented', 'developed', 'collaborated', 'managed', 'optimized',
  'achieved', 'resolved', 'designed', 'analyzed', 'coordinated',
  'established', 'streamlined', 'enhanced', 'facilitated', 'executed',
  'demonstrated', 'leveraged', 'integrated', 'transformed', 'initiated'
];

// Structure indicators
const STRUCTURE_INDICATORS = [
  'firstly', 'secondly', 'thirdly', 'finally', 'in conclusion',
  'to begin with', 'moreover', 'furthermore', 'additionally',
  'for example', 'for instance', 'specifically', 'in particular',
  'on the other hand', 'however', 'therefore', 'consequently',
  'as a result', 'in summary', 'to summarize'
];

// Communication Assessment System Prompt
const COMMUNICATION_ASSESSMENT_PROMPT = `You are an expert communication skills evaluator for interview preparation. 
Your task is to assess the COMMUNICATION DELIVERY of a candidate's response, NOT the technical accuracy or correctness of the answer.

EVALUATION DIMENSIONS (Rate each 0-10):

1. FLUENCY & PACING (fluency)
   - Smooth speech flow without excessive pauses
   - Appropriate speaking pace (not too fast or slow)
   - Minimal filler words (um, uh, like, you know)
   - Natural rhythm and cadence

2. CLARITY & STRUCTURE (clarity_structure)
   - Organized thoughts with clear beginning, middle, end
   - Logical progression of ideas
   - Use of transitional phrases
   - Easy to follow and understand

3. GRAMMAR & VOCABULARY (grammar_vocabulary)
   - Correct grammar usage
   - Professional vocabulary appropriate for interviews
   - Varied sentence structure
   - Avoids repetitive words/phrases

4. PRONUNCIATION (pronunciation)
   - Clear articulation of words
   - Proper enunciation
   - Understandable speech
   - (Inferred from transcript clarity if audio unavailable)

5. TONE & CONFIDENCE (tone_confidence)
   - Professional and confident tone
   - Positive and engaging delivery
   - Appropriate assertiveness
   - Avoids hedging or uncertain language

6. QUESTION RELEVANCE (question_relevance)
   - Addresses the question asked
   - Stays on topic
   - Provides appropriate level of detail
   - Demonstrates active listening

IMPORTANT: Focus ONLY on HOW the answer is communicated, not WHAT the answer says technically.

Respond ONLY with valid JSON in this exact format:
{
  "overall_score": <number 0-10>,
  "subscores": {
    "fluency": <number 0-10>,
    "clarity_structure": <number 0-10>,
    "grammar_vocabulary": <number 0-10>,
    "pronunciation": <number 0-10>,
    "tone_confidence": <number 0-10>,
    "question_relevance": <number 0-10>
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "summary_comment": "<2-3 sentence overall assessment>"
}`;

class CommunicationAssessmentService {
  
  // Initialize AI clients
  static openai = null;
  static gemini = null;
  
  static initializeAI() {
    if (aiConfig.openai?.apiKey && !this.openai) {
      this.openai = new OpenAI({ apiKey: aiConfig.openai.apiKey });
    }
    if (aiConfig.gemini?.apiKey && !this.gemini) {
      const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);
      this.gemini = genAI.getGenerativeModel({ model: aiConfig.gemini?.model || 'gemini-pro' });
    }
  }

  /**
   * Analyze transcript and generate communication assessment using AI
   */
  static async analyzeTranscript(data) {
    const {
      userId,
      interviewId,
      questionId,
      questionText,
      transcript,
      audioFeatures = null,
      assessmentType = 'interview'
    } = data;

    try {
      // Create initial assessment record
      const assessment = new CommunicationAssessment({
        user: userId,
        interview: interviewId,
        questionId,
        questionText,
        transcript,
        audioFeatures,
        assessmentType,
        status: 'processing'
      });

      // Try AI-powered assessment first
      let aiResult = null;
      try {
        aiResult = await this.performAIAssessment(questionText, transcript);
      } catch (aiError) {
        console.log('AI assessment unavailable, using rule-based fallback:', aiError.message);
      }

      let scores, feedback;
      
      if (aiResult) {
        // Use AI-generated scores and feedback
        scores = {
          overall: aiResult.overall_score,
          subscores: aiResult.subscores
        };
        feedback = {
          strengths: aiResult.strengths,
          improvements: aiResult.improvements,
          summary: aiResult.summary_comment
        };
      } else {
        // Fallback to rule-based analysis
        const analysis = this.performAnalysis(transcript, audioFeatures);
        scores = this.calculateScores(analysis);
        feedback = this.generateFeedback(analysis, scores);
      }

      // Update assessment with results
      assessment.overallScore = scores.overall;
      assessment.subscores = scores.subscores;
      assessment.strengths = feedback.strengths;
      assessment.improvements = feedback.improvements;
      assessment.summaryComment = feedback.summary;
      assessment.scoreLevel = CommunicationAssessment.getScoreLevel(scores.overall);
      assessment.status = 'completed';
      assessment.processedAt = new Date();

      await assessment.save();

      return assessment.getFormattedResult();

    } catch (error) {
      console.error('Communication assessment error:', error);
      throw error;
    }
  }

  /**
   * Perform AI-powered communication assessment
   */
  static async performAIAssessment(questionText, transcript) {
    this.initializeAI();
    
    const userPrompt = `Question asked: "${questionText}"

Candidate's response transcript:
"${transcript}"

Evaluate the communication quality of this response.`;

    let result = null;

    // Try OpenAI first
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: aiConfig.openai?.model || 'gpt-4',
          messages: [
            { role: 'system', content: COMMUNICATION_ASSESSMENT_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1000
        });
        
        const content = response.choices[0]?.message?.content;
        if (content) {
          // Extract JSON from response (handle markdown code blocks)
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (error) {
        console.log('OpenAI assessment error:', error.message);
      }
    }

    // Try Gemini as fallback
    if (!result && this.gemini) {
      try {
        const fullPrompt = `${COMMUNICATION_ASSESSMENT_PROMPT}\n\n${userPrompt}`;
        const response = await this.gemini.generateContent(fullPrompt);
        const content = response.response?.text();
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (error) {
        console.log('Gemini assessment error:', error.message);
      }
    }

    // Validate result structure
    if (result && this.validateAIResult(result)) {
      return result;
    }

    return null;
  }

  /**
   * Validate AI result has required structure
   */
  static validateAIResult(result) {
    return (
      typeof result.overall_score === 'number' &&
      result.subscores &&
      typeof result.subscores.fluency === 'number' &&
      typeof result.subscores.clarity_structure === 'number' &&
      typeof result.subscores.grammar_vocabulary === 'number' &&
      typeof result.subscores.pronunciation === 'number' &&
      typeof result.subscores.tone_confidence === 'number' &&
      Array.isArray(result.strengths) &&
      Array.isArray(result.improvements) &&
      typeof result.summary_comment === 'string'
    );
  }

  /**
   * Perform detailed analysis of the transcript (fallback)
   */
  static performAnalysis(transcript, audioFeatures) {
    const words = transcript.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Word and sentence metrics
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

    // Filler word analysis
    let fillerWordCount = 0;
    const fillerWordsFound = [];
    
    FILLER_WORDS.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = transcript.match(regex);
      if (matches) {
        fillerWordCount += matches.length;
        fillerWordsFound.push({ word: filler, count: matches.length });
      }
    });

    const fillerRatio = wordCount > 0 ? fillerWordCount / wordCount : 0;

    // Professional vocabulary usage
    let professionalWordCount = 0;
    PROFESSIONAL_VOCABULARY.forEach(word => {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      const matches = transcript.match(regex);
      if (matches) {
        professionalWordCount += matches.length;
      }
    });

    // Structure analysis
    let structureIndicatorCount = 0;
    STRUCTURE_INDICATORS.forEach(indicator => {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const matches = transcript.match(regex);
      if (matches) {
        structureIndicatorCount += matches.length;
      }
    });

    // Sentence variety (check for different sentence starters)
    const sentenceStarters = sentences.map(s => {
      const words = s.trim().split(/\s+/);
      return words[0]?.toLowerCase() || '';
    });
    const uniqueStarters = new Set(sentenceStarters);
    const sentenceVariety = sentenceCount > 0 ? uniqueStarters.size / sentenceCount : 0;

    // Check for concrete examples
    const exampleIndicators = ['for example', 'for instance', 'such as', 'like when', 'one time', 'specifically'];
    let hasConcreteExamples = false;
    exampleIndicators.forEach(indicator => {
      if (transcript.toLowerCase().includes(indicator)) {
        hasConcreteExamples = true;
      }
    });

    // Grammar indicators (basic checks)
    const grammarIssues = this.detectGrammarIssues(transcript);

    // Repetition detection
    const repetitionScore = this.detectRepetition(words);

    // Response length assessment
    const isResponseTooShort = wordCount < 30;
    const isResponseTooLong = wordCount > 500;
    const isResponseOptimalLength = wordCount >= 50 && wordCount <= 300;

    return {
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      fillerWordCount,
      fillerWordsFound,
      fillerRatio,
      professionalWordCount,
      structureIndicatorCount,
      sentenceVariety,
      hasConcreteExamples,
      grammarIssues,
      repetitionScore,
      isResponseTooShort,
      isResponseTooLong,
      isResponseOptimalLength,
      audioFeatures: audioFeatures || null
    };
  }

  /**
   * Detect basic grammar issues
   */
  static detectGrammarIssues(transcript) {
    const issues = [];
    
    // Check for common grammar patterns
    const patterns = [
      { pattern: /\bi\s+(?!am|was|have|had|will|would|could|should|can|may|might|do|did|'m|'ve|'d|'ll)/gi, issue: 'Possible missing verb after "I"' },
      { pattern: /\s{2,}/g, issue: 'Multiple spaces' },
      { pattern: /\bi\b/g, issue: 'Lowercase "I"', check: (match, text) => match === 'i' },
      { pattern: /\bdoesn't\s+\w+s\b/gi, issue: 'Double verb conjugation' },
      { pattern: /\bdon't\s+\w+s\b/gi, issue: 'Double verb conjugation' }
    ];

    patterns.forEach(({ pattern, issue }) => {
      const matches = transcript.match(pattern);
      if (matches && matches.length > 2) {
        issues.push(issue);
      }
    });

    return issues;
  }

  /**
   * Detect word/phrase repetition
   */
  static detectRepetition(words) {
    const wordFrequency = {};
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // Find overused words
    const totalWords = words.length;
    let repetitionIssues = 0;
    
    Object.entries(wordFrequency).forEach(([word, count]) => {
      const frequency = count / totalWords;
      if (frequency > 0.05 && count > 3) { // More than 5% and used more than 3 times
        repetitionIssues++;
      }
    });

    return Math.max(0, 10 - repetitionIssues * 2); // Score from 0-10
  }

  /**
   * Calculate scores based on analysis
   */
  static calculateScores(analysis) {
    // Fluency Score (0-10)
    let fluencyScore = 8; // Start with good base
    
    // Penalize for filler words
    if (analysis.fillerRatio > 0.1) fluencyScore -= 3;
    else if (analysis.fillerRatio > 0.05) fluencyScore -= 2;
    else if (analysis.fillerRatio > 0.02) fluencyScore -= 1;
    
    // Penalize for too short responses
    if (analysis.isResponseTooShort) fluencyScore -= 2;
    
    // Consider audio features if available
    if (analysis.audioFeatures) {
      const { speakingRate, pauseDuration } = analysis.audioFeatures;
      if (speakingRate && (speakingRate < 100 || speakingRate > 180)) {
        fluencyScore -= 1;
      }
      if (pauseDuration && pauseDuration > 2) {
        fluencyScore -= 1;
      }
    }

    fluencyScore = Math.max(1, Math.min(10, fluencyScore));

    // Clarity & Structure Score (0-10)
    let clarityScore = 6; // Start with average
    
    // Reward structure indicators
    if (analysis.structureIndicatorCount >= 3) clarityScore += 2;
    else if (analysis.structureIndicatorCount >= 1) clarityScore += 1;
    
    // Reward concrete examples
    if (analysis.hasConcreteExamples) clarityScore += 1;
    
    // Reward optimal sentence length
    if (analysis.avgWordsPerSentence >= 10 && analysis.avgWordsPerSentence <= 25) {
      clarityScore += 1;
    }
    
    // Penalize too long or short sentences
    if (analysis.avgWordsPerSentence < 5 || analysis.avgWordsPerSentence > 40) {
      clarityScore -= 1;
    }

    clarityScore = Math.max(1, Math.min(10, clarityScore));

    // Grammar & Vocabulary Score (0-10)
    let grammarScore = 7; // Start with good base
    
    // Reward professional vocabulary
    if (analysis.professionalWordCount >= 5) grammarScore += 2;
    else if (analysis.professionalWordCount >= 2) grammarScore += 1;
    
    // Reward sentence variety
    if (analysis.sentenceVariety > 0.7) grammarScore += 1;
    
    // Penalize grammar issues
    grammarScore -= analysis.grammarIssues.length;
    
    // Consider repetition
    if (analysis.repetitionScore < 5) grammarScore -= 1;

    grammarScore = Math.max(1, Math.min(10, grammarScore));

    // Pronunciation Score (0-10)
    // Note: This would ideally use audio analysis, using transcript proxies
    let pronunciationScore = 7; // Default good score
    
    // Can only assess from audio features if available
    if (analysis.audioFeatures?.speakingRate) {
      const rate = analysis.audioFeatures.speakingRate;
      if (rate >= 120 && rate <= 160) {
        pronunciationScore = 8; // Optimal speaking rate
      } else if (rate < 100 || rate > 180) {
        pronunciationScore = 6; // Too slow or fast
      }
    }

    pronunciationScore = Math.max(1, Math.min(10, pronunciationScore));

    // Tone & Confidence Score (0-10)
    let toneScore = 6; // Start with average
    
    // Reward professional vocabulary (indicates confidence)
    if (analysis.professionalWordCount >= 3) toneScore += 1;
    
    // Penalize excessive fillers (indicates lack of confidence)
    if (analysis.fillerRatio < 0.02) toneScore += 2;
    else if (analysis.fillerRatio > 0.08) toneScore -= 2;
    
    // Reward optimal response length
    if (analysis.isResponseOptimalLength) toneScore += 1;
    
    // Reward concrete examples (shows preparedness)
    if (analysis.hasConcreteExamples) toneScore += 1;

    toneScore = Math.max(1, Math.min(10, toneScore));

    // Question Relevance Score (0-10) - Based on response quality indicators
    let relevanceScore = 7; // Start with good base
    
    // Reward optimal response length (indicates engagement with question)
    if (analysis.isResponseOptimalLength) relevanceScore += 1;
    
    // Reward concrete examples (indicates relevant details)
    if (analysis.hasConcreteExamples) relevanceScore += 1;
    
    // Reward structure (indicates thoughtful response)
    if (analysis.structureIndicatorCount >= 2) relevanceScore += 1;
    
    // Penalize too short responses (may not fully address question)
    if (analysis.isResponseTooShort) relevanceScore -= 2;
    
    relevanceScore = Math.max(1, Math.min(10, relevanceScore));

    // Calculate overall score (weighted average with 6 dimensions)
    const weights = {
      fluency: 0.20,
      clarity: 0.20,
      grammar: 0.15,
      pronunciation: 0.15,
      tone: 0.15,
      relevance: 0.15
    };

    const overallScore = Math.round((
      fluencyScore * weights.fluency +
      clarityScore * weights.clarity +
      grammarScore * weights.grammar +
      pronunciationScore * weights.pronunciation +
      toneScore * weights.tone +
      relevanceScore * weights.relevance
    ) * 10) / 10;

    return {
      overall: Math.min(10, Math.max(1, overallScore)),
      subscores: {
        fluency: fluencyScore,
        clarity_structure: clarityScore,
        grammar_vocabulary: grammarScore,
        pronunciation: pronunciationScore,
        tone_confidence: toneScore,
        question_relevance: relevanceScore
      },
      analysis // Include raw analysis for feedback generation
    };
  }

  /**
   * Generate feedback based on analysis and scores
   */
  static generateFeedback(analysis, scores) {
    const strengths = [];
    const improvements = [];

    // Analyze fluency
    if (scores.subscores.fluency >= 7) {
      if (analysis.fillerRatio < 0.02) {
        strengths.push('Excellent fluency with minimal filler words');
      } else {
        strengths.push('Good pacing and smooth delivery');
      }
    } else {
      if (analysis.fillerRatio > 0.05) {
        improvements.push(`Reduce filler words (detected ${analysis.fillerWordCount} instances) - try pausing briefly instead of using "um" or "like"`);
      }
      if (analysis.isResponseTooShort) {
        improvements.push('Elaborate more on your answers with specific details and examples');
      }
    }

    // Analyze structure
    if (scores.subscores.clarity_structure >= 7) {
      if (analysis.structureIndicatorCount >= 2) {
        strengths.push('Well-organized response with clear logical flow');
      }
      if (analysis.hasConcreteExamples) {
        strengths.push('Good use of concrete examples to support points');
      }
    } else {
      if (analysis.structureIndicatorCount < 2) {
        improvements.push('Use transitional phrases (e.g., "firstly", "moreover", "in conclusion") to structure your response');
      }
      if (!analysis.hasConcreteExamples) {
        improvements.push('Include specific examples to illustrate your points');
      }
    }

    // Analyze vocabulary
    if (scores.subscores.grammar_vocabulary >= 7) {
      if (analysis.professionalWordCount >= 3) {
        strengths.push('Strong professional vocabulary usage');
      }
      if (analysis.sentenceVariety > 0.6) {
        strengths.push('Good variety in sentence structure');
      }
    } else {
      if (analysis.professionalWordCount < 2) {
        improvements.push('Incorporate more action verbs and professional terminology');
      }
      if (analysis.grammarIssues.length > 0) {
        improvements.push('Review basic grammar rules, particularly subject-verb agreement');
      }
    }

    // Analyze tone
    if (scores.subscores.tone_confidence >= 7) {
      strengths.push('Confident and professional tone');
    } else {
      improvements.push('Practice speaking with more confidence - slow down and speak clearly');
    }

    // Ensure we have 2-3 strengths and improvements
    if (strengths.length < 2) {
      if (analysis.wordCount >= 50) {
        strengths.push('Provided a substantive response with adequate detail');
      }
      if (strengths.length < 2) {
        strengths.push('Demonstrated willingness to engage with the question');
      }
    }

    if (improvements.length < 2) {
      improvements.push('Continue practicing to build confidence and natural delivery');
    }

    // Generate summary comment
    const summary = this.generateSummary(scores, analysis);

    return {
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3),
      summary
    };
  }

  /**
   * Generate a summary comment
   */
  static generateSummary(scores, analysis) {
    const overall = scores.overall;
    let summary = '';

    if (overall >= 9) {
      summary = `Excellent communication skills demonstrated. The response was well-structured, articulate, and delivered with confidence. `;
    } else if (overall >= 7) {
      summary = `Strong communication overall with clear expression of ideas. `;
    } else if (overall >= 5) {
      summary = `Average communication with room for improvement. `;
    } else {
      summary = `Communication skills need development. `;
    }

    // Add specific observations
    if (analysis.fillerRatio > 0.05) {
      summary += `Consider reducing filler words to improve fluency. `;
    }
    
    if (analysis.hasConcreteExamples) {
      summary += `Good use of examples to support points. `;
    } else if (overall < 7) {
      summary += `Adding specific examples would strengthen responses. `;
    }

    if (analysis.isResponseTooShort) {
      summary += `Responses would benefit from more detail and elaboration.`;
    } else if (analysis.isResponseOptimalLength) {
      summary += `Response length was appropriate for the question.`;
    }

    return summary.trim();
  }

  /**
   * Get assessment by ID
   */
  static async getAssessmentById(assessmentId) {
    return CommunicationAssessment.findById(assessmentId)
      .populate('user', 'name email')
      .populate('interview');
  }

  /**
   * Get user's assessment history
   */
  static async getUserAssessments(userId, options = {}) {
    const { limit = 20, skip = 0, assessmentType } = options;
    
    const query = { user: userId, status: 'completed' };
    if (assessmentType) {
      query.assessmentType = assessmentType;
    }

    return CommunicationAssessment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  /**
   * Get user's communication skill averages
   */
  static async getUserAverages(userId) {
    return CommunicationAssessment.getUserAverages(userId);
  }

  /**
   * Get improvement trends over time
   */
  static async getImprovementTrends(userId, days = 30) {
    return CommunicationAssessment.getImprovementTrends(userId, days);
  }
}

module.exports = CommunicationAssessmentService;
