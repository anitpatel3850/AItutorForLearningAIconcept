import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Play, Zap, ArrowRight } from 'lucide-react';
import { Mission } from '../../types';

interface MissionCardProps {
  mission: Mission;
  isCompleted: boolean;
  onStart: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  isCompleted,
  onStart,
}) => {
  const difficultyBadge = {
    EASY: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    HARD: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    BOSS: 'bg-red-500/20 text-red-300 border-red-500/30',
  }[mission.difficulty];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        isCompleted
          ? 'bg-[#0E1528]/80 border-emerald-500/30 hover:border-emerald-500/50'
          : 'bg-[#121832]/80 border-white/10 hover:border-cyan-500/40 hover:shadow-[0_8px_30px_-5px_rgba(0,240,255,0.2)]'
      }`}
    >
      <div>
        {/* Top Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              {mission.number}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${difficultyBadge}`}>
              {mission.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-300">
            <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            +{mission.xpReward} XP
          </div>
        </div>

        {/* Title & Topic */}
        <h4 className="text-lg font-bold font-display text-white mb-1">
          {mission.title}
        </h4>
        <div className="text-xs text-purple-300 font-mono mb-2.5">
          Topic: {mission.topic}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {mission.objective}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
        {isCompleted ? (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>MISSION COMPLETE</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-mono">
            Ready for execution
          </span>
        )}

        <button
          onClick={onStart}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
            isCompleted
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
          }`}
        >
          {isCompleted ? (
            <>
              <span>REPLAY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START MISSION</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
