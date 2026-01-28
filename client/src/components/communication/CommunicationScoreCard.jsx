/**
 * ===========================================
 * Communication Score Card Component
 * ===========================================
 * 
 * Displays the overall score with a radial gauge
 * and score level badge.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Award,
  Target
} from 'lucide-react';

const CommunicationScoreCard = ({ 
  score, 
  scoreLevel,
  showAnimation = true,
  size = 'large' // 'small', 'medium', 'large'
}) => {
  // Get score color based on level
  const getScoreColor = () => {
    if (score >= 9) return { primary: '#10B981', secondary: '#D1FAE5', text: 'text-emerald-500' };
    if (score >= 7) return { primary: '#3B82F6', secondary: '#DBEAFE', text: 'text-blue-500' };
    if (score >= 4) return { primary: '#F59E0B', secondary: '#FEF3C7', text: 'text-amber-500' };
    return { primary: '#EF4444', secondary: '#FEE2E2', text: 'text-red-500' };
  };

  const colors = getScoreColor();

  // Get level label
  const getLevelLabel = () => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Strong';
    if (score >= 4) return 'Average';
    return 'Needs Improvement';
  };

  // Get icon based on score
  const getLevelIcon = () => {
    if (score >= 9) return Trophy;
    if (score >= 7) return Star;
    if (score >= 4) return TrendingUp;
    return Target;
  };

  const LevelIcon = getLevelIcon();
  const percentage = (score / 10) * 100;

  // Size configurations
  const sizeConfig = {
    small: { radius: 40, stroke: 6, textSize: 'text-xl', iconSize: 'w-4 h-4' },
    medium: { radius: 60, stroke: 8, textSize: 'text-3xl', iconSize: 'w-5 h-5' },
    large: { radius: 80, stroke: 10, textSize: 'text-4xl', iconSize: 'w-6 h-6' }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Radial Progress */}
      <div className="relative" style={{ width: config.radius * 2 + 20, height: config.radius * 2 + 20 }}>
        <svg 
          className="transform -rotate-90"
          width={config.radius * 2 + 20}
          height={config.radius * 2 + 20}
        >
          {/* Background circle */}
          <circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            fill="none"
            stroke={colors.secondary}
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.radius + 10}
            cy={config.radius + 10}
            r={config.radius}
            fill="none"
            stroke={colors.primary}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: showAnimation ? strokeDashoffset : strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`${config.textSize} font-bold ${colors.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-500">/10</span>
        </div>
      </div>

      {/* Level badge */}
      <motion.div 
        className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ backgroundColor: colors.secondary }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <LevelIcon className={`${config.iconSize}`} style={{ color: colors.primary }} />
        <span className="text-sm font-semibold" style={{ color: colors.primary }}>
          {getLevelLabel()}
        </span>
      </motion.div>
    </div>
  );
};

export default CommunicationScoreCard;
