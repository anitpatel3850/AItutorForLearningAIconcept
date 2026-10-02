import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPBarProps {
  currentLevelXp: number;
  xpToNextLevel: number;
  progressPercent: number;
  level: number;
  totalXp: number;
  showDetails?: boolean;
  className?: string;
  recentXp?: number | null;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentLevelXp,
  xpToNextLevel,
  progressPercent,
  level,
  totalXp,
  showDetails = true,
  className = '',
  recentXp,
}) => {
  return (
    <div className={`relative ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span className="font-bold tracking-wider font-mono">
              {totalXp.toLocaleString()} XP
            </span>
          </div>
          <div className="text-slate-400 font-mono">
            <span className="text-white font-bold">{progressPercent}%</span> to Level {level + 1}
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div className="relative h-2.5 w-full bg-slate-900/90 rounded-full overflow-hidden border border-white/10 p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(2, progressPercent))}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 relative"
        >
          {/* Glowing pulse tip */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
        </motion.div>
      </div>

      {/* Floating XP Gain Badge */}
      <AnimatePresence>
        {recentXp && recentXp > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -22, scale: 1 }}
            exit={{ opacity: 0, y: -35, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute right-0 -top-3 pointer-events-none bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg shadow-cyan-500/40 border border-white/40 flex items-center gap-1"
          >
            <Zap className="w-3 h-3 fill-slate-950" />
            +{recentXp} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
