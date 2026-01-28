/**
 * ===========================================
 * Feedback Section Component
 * ===========================================
 * 
 * Displays strengths and improvement suggestions
 * from the communication assessment.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Lightbulb, 
  ArrowUpRight,
  Sparkles,
  Target
} from 'lucide-react';

const FeedbackSection = ({ strengths = [], improvements = [], summary = '' }) => {
  return (
    <div className="space-y-6">
      {/* Summary Comment */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-100"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary-900 mb-1">Assessment Summary</h4>
              <p className="text-sm text-primary-700 leading-relaxed">{summary}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Strengths</h4>
          </div>
          
          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-green-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-green-800">{strength}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No specific strengths identified</p>
            )}
          </div>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Areas for Improvement</h4>
          </div>
          
          <div className="space-y-2">
            {improvements.length > 0 ? (
              improvements.map((improvement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="mt-0.5">
                    <ArrowUpRight className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-sm text-amber-800">{improvement}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No specific improvements suggested</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackSection;
