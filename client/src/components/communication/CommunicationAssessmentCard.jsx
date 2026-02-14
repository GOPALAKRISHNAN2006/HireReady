/**
 * ===========================================
 * Communication Assessment Card Component
 * ===========================================
 * 
 * Full assessment display card combining score,
 * subscores, and feedback.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  BarChart3,
  Clock
} from 'lucide-react';
import CommunicationScoreCard from './CommunicationScoreCard';
import SubscoresBreakdown from './SubscoresBreakdown';
import FeedbackSection from './FeedbackSection';

const CommunicationAssessmentCard = ({ 
  assessment, 
  questionText = null,
  showQuestion = true,
  expandable = true,
  defaultExpanded = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!assessment) return null;

  const {
    overall_score = 0,
    subscores = {},
    strengths = [],
    improvements = [],
    summary_comment = '',
    score_level = 'average'
  } = assessment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div 
        className={`p-5 ${expandable ? 'cursor-pointer hover:bg-slate-50' : ''}`}
        onClick={() => expandable && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Compact Score Display */}
            <CommunicationScoreCard 
              score={overall_score} 
              scoreLevel={score_level}
              size="small"
              showAnimation={!isExpanded}
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Communication Assessment</h3>
              </div>
              {showQuestion && questionText && (
                <p className="text-sm text-slate-500 line-clamp-1">{questionText}</p>
              )}
            </div>
          </div>
          
          {expandable && (
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
          )}
        </div>

        {/* Quick stats when collapsed */}
        {!isExpanded && subscores && Object.keys(subscores).length > 0 && (
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            {Object.entries(subscores).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 capitalize">
                  {key.replace('_', ' ')}:
                </span>
                <span className={`text-xs font-semibold ${
                  value >= 7 ? 'text-green-600' : 
                  value >= 4 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {value}/10
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {(isExpanded || !expandable) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-6">
              {/* Score and Subscores */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Main Score */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl">
                  <CommunicationScoreCard 
                    score={overall_score} 
                    scoreLevel={score_level}
                    size="large"
                    showAnimation={true}
                  />
                </div>

                {/* Subscores */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <h4 className="font-medium text-slate-700">Detailed Breakdown</h4>
                  </div>
                  <SubscoresBreakdown subscores={subscores} />
                </div>
              </div>

              {/* Feedback */}
              <FeedbackSection 
                strengths={strengths}
                improvements={improvements}
                summary={summary_comment}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommunicationAssessmentCard;
