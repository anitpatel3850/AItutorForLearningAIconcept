import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import { World } from '../../types';

interface QuestNodeProps {
  world: World;
  isUnlocked: boolean;
  isCompleted: boolean;
  completionPercentage: number;
  userLevel: number;
  onSelect: () => void;
}

export const QuestNode: React.FC<QuestNodeProps> = ({
  world,
  isUnlocked,
  isCompleted,
  completionPercentage,
  userLevel,
  onSelect,
}) => {
  const missionCount = world.quests.reduce((acc, q) => acc + q.missionIds.length, 0);

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      onClick={isUnlocked ? onSelect : undefined}
      className={`relative w-full max-w-md rounded-2xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden ${
        isCompleted
          ? 'bg-gradient-to-br from-[#0e1f2f] to-[#0A1020] border-emerald-500/40 shadow-[0_0_30px_rgba(0,255,157,0.15)]'
          : isUnlocked
          ? 'bg-gradient-to-br from-[#151B38] to-[#0D1226] border-cyan-400/50 shadow-[0_0_35px_rgba(0,240,255,0.2)] hover:border-cyan-300'
          : 'bg-[#0A0D1A]/60 border-white/5 opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Background ambient glow */}
      {isUnlocked && (
        <div 
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
          style={{ backgroundColor: world.glowColor }}
        />
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md uppercase tracking-wider"
            style={{ 
              backgroundColor: isUnlocked ? `${world.accentColor}25` : 'rgba(255,255,255,0.05)',
              color: isUnlocked ? world.accentColor : '#64748b',
              border: `1px solid ${isUnlocked ? `${world.accentColor}50` : 'rgba(255,255,255,0.1)'}`
            }}
          >
            WORLD 0{world.worldNumber}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {world.subtitle}
          </span>
        </div>

        <div>
          {isCompleted ? (
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>COMPLETED</span>
            </div>
          ) : !isUnlocked ? (
            <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>REQ. LVL {world.requiredLevel}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-cyan-400 text-xs font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>AVAILABLE</span>
            </div>
          )}
        </div>
      </div>

      {/* Main World Title */}
      <h3 className="text-xl font-bold font-display text-white mb-1.5 flex items-center justify-between">
        <span>{world.name}</span>
        {isUnlocked && <ChevronRight className="w-5 h-5 text-cyan-400" />}
      </h3>

      <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
        {world.description}
      </p>

      {/* Stats bar: XP reward, Mission count, Completion % */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-xs mb-3">
        <div>
          <div className="text-[10px] text-slate-400">REWARD</div>
          <div className="text-cyan-400 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 fill-cyan-400" />
            +{world.totalXp} XP
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">MISSIONS</div>
          <div className="text-white font-bold flex items-center gap-1">
            <Target className="w-3 h-3 text-purple-400" />
            {missionCount} Quests
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">MASTERY</div>
          <div className={`font-bold ${completionPercentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {completionPercentage}%
          </div>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${
            completionPercentage === 100
              ? 'bg-emerald-400'
              : 'bg-gradient-to-r from-cyan-500 to-purple-500'
          }`}
        />
      </div>
    </motion.div>
  );
};
