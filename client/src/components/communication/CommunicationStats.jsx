/**
 * ===========================================
 * Communication Stats Component
 * ===========================================
 * 
 * Dashboard widget showing communication statistics
 * and improvement trends over time.
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Mic,
  MessageSquare,
  Volume2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import communicationApi from '../../services/communicationApi';
import { CommunicationScoreCard } from './';

const subscoreIcons = {
  fluency: Volume2,
  clarity: MessageSquare,
  grammar: BookOpen,
  pronunciation: Mic,
  tone: Sparkles
};

const subscoreLabels = {
  fluency: 'Fluency & Pacing',
  clarity: 'Clarity & Structure',
  grammar: 'Grammar & Vocabulary',
  pronunciation: 'Pronunciation',
  tone: 'Tone & Confidence'
};

const CommunicationStats = ({ className = '' }) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['communication', 'stats'],
    queryFn: communicationApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500 py-8">
          <Mic className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No Communication Data</p>
          <p className="text-sm">Complete interviews to see your stats</p>
        </div>
      </div>
    );
  }

  const { averages, trends, totalAssessments, recentScores, improvementAreas, strengthAreas } = stats;

  const getScoreLevel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Strong';
    if (score >= 4) return 'Average';
    return 'Needs Improvement';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0.2) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < -0.2) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Communication Skills</h3>
          </div>
          <span className="text-xs text-gray-500">
            {totalAssessments} assessments
          </span>
        </div>
      </div>

      {/* Main Score */}
      <div className="p-5 flex flex-col items-center bg-gradient-to-b from-purple-50/50 to-white">
        <CommunicationScoreCard 
          score={averages?.overall || 0}
          scoreLevel={getScoreLevel(averages?.overall || 0)}
          size="medium"
          showAnimation={true}
        />
        <p className="text-sm text-gray-500 mt-2">Average Score</p>
      </div>

      {/* Subscore Breakdown with Trends */}
      <div className="p-5 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-4">
          Skills Breakdown & Trends
        </h4>
        <div className="space-y-3">
          {Object.entries(subscoreLabels).map(([key, label]) => {
            const Icon = subscoreIcons[key];
            const score = averages?.[key] || 0;
            const trend = trends?.[key] || 0;
            
            return (
              <div key={key} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 truncate">{label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-gray-900">
                        {score.toFixed(1)}
                      </span>
                      {getTrendIcon(trend)}
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 10) * 100}%` }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className={`h-full rounded-full ${
                        score >= 7 ? 'bg-green-500' :
                        score >= 4 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Areas */}
      {improvementAreas?.length > 0 && (
        <div className="p-5 border-t border-gray-100 bg-amber-50/50">
          <h4 className="text-sm font-medium text-amber-700 mb-2">
            Focus Areas
          </h4>
          <ul className="space-y-1">
            {improvementAreas.slice(0, 2).map((area, index) => (
              <li key={index} className="text-xs text-amber-600 flex items-start gap-1.5">
                <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strength Areas */}
      {strengthAreas?.length > 0 && (
        <div className="p-5 border-t border-gray-100 bg-green-50/50">
          <h4 className="text-sm font-medium text-green-700 mb-2">
            Your Strengths
          </h4>
          <ul className="space-y-1">
            {strengthAreas.slice(0, 2).map((area, index) => (
              <li key={index} className="text-xs text-green-600 flex items-start gap-1.5">
                <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default CommunicationStats;
