import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  CheckCircle2, 
  Flag, 
  Compass, 
  Flame, 
  Swords, 
  Zap, 
  Terminal, 
  BookOpen, 
  Trophy 
} from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flag,
  Compass,
  Flame,
  Swords,
  Zap,
  Terminal,
  BookOpen,
  Trophy,
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isUnlocked,
}) => {
  const IconComponent = ICON_MAP[achievement.icon] || Trophy;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isUnlocked
          ? 'bg-gradient-to-b from-[#161F3D] to-[#0D1326] border-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.15)]'
          : 'bg-[#090C18]/60 border-white/5 opacity-60'
      }`}
    >
      {/* Background ambient glow for unlocked badge */}
      {isUnlocked && (
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none" />
      )}

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 border ${
            isUnlocked
              ? 'bg-gradient-to-tr from-cyan-500/20 to-purple-500/30 border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)] text-cyan-300'
              : 'bg-white/[0.03] border-white/10 text-slate-500'
          }`}>
            {isUnlocked ? (
              <IconComponent className="w-6 h-6" />
            ) : (
              <Lock className="w-5 h-5 text-slate-500" />
            )}
          </div>

          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300">
            +{achievement.xpReward} XP
          </span>
        </div>

        <h4 className="text-base font-bold font-display text-white mb-1">
          {achievement.title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {achievement.description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
        {isUnlocked ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>UNLOCKED</span>
          </div>
        ) : (
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Progress</span>
              <span>{achievement.progress} / {achievement.maxProgress}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-cyan-500/60"
                style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {isUnlocked && achievement.unlockedAt && (
          <span className="text-[11px] text-slate-400">
            {achievement.unlockedAt}
          </span>
        )}
      </div>
    </motion.div>
  );
};
