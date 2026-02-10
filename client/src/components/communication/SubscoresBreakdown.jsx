/**
 * ===========================================
 * Subscores Breakdown Component
 * ===========================================
 * 
 * Displays detailed breakdown of communication subscores
 * with horizontal progress bars.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Waves, 
  Layers, 
  BookOpen, 
  Mic, 
  Sparkles 
} from 'lucide-react';

const SubscoresBreakdown = ({ subscores = {}, animated = true }) => {
  // Define subscores with metadata
  const subscoreConfig = [
    { 
      key: 'fluency', 
      label: 'Fluency & Pacing',
      description: 'Speaking rate, smoothness, and flow',
      icon: Waves 
    },
    { 
      key: 'clarity_structure', 
      label: 'Clarity & Structure',
      description: 'Logical organization of ideas',
      icon: Layers 
    },
    { 
      key: 'grammar_vocabulary', 
      label: 'Grammar & Vocabulary',
      description: 'Language accuracy and word choice',
      icon: BookOpen 
    },
    { 
      key: 'pronunciation', 
      label: 'Pronunciation',
      description: 'Speech clarity and understandability',
      icon: Mic 
    },
    { 
      key: 'tone_confidence', 
      label: 'Tone & Confidence',
      description: 'Professionalism and delivery confidence',
      icon: Sparkles 
    }
  ];

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 9) return { bar: 'bg-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-600' };
    if (score >= 7) return { bar: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' };
    if (score >= 4) return { bar: 'bg-amber-500', bg: 'bg-amber-100', text: 'text-amber-600' };
    return { bar: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-600' };
  };

  return (
    <div className="space-y-4">
      {subscoreConfig.map((config, index) => {
        const score = (subscores && subscores[config.key]) || 0;
        const colors = getScoreColor(score);
        const IconComponent = config.icon;
        const percentage = (score / 10) * 100;

        return (
          <motion.div
            key={config.key}
            initial={animated ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                  <IconComponent className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{config.label}</span>
                  <p className="text-xs text-gray-500 hidden group-hover:block">
                    {config.description}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-bold ${colors.text}`}>
                {score}/10
              </span>
            </div>
            
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${colors.bar}`}
                initial={animated ? { width: 0 } : { width: `${percentage}%` }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SubscoresBreakdown;
