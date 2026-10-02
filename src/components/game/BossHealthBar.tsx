import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, HeartPulse } from 'lucide-react';

interface BossHealthBarProps {
  currentHp: number;
  maxHp: number;
  bossName: string;
  isTakingDamage?: boolean;
}

export const BossHealthBar: React.FC<BossHealthBarProps> = ({
  currentHp,
  maxHp,
  bossName,
  isTakingDamage = false,
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-red-400 font-bold tracking-wider">
          <ShieldAlert className="w-4 h-4 animate-pulse text-red-500" />
          <span className="text-white text-sm font-display">{bossName}</span>
          <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[10px] text-red-300">
            HOSTILE CORE
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <HeartPulse className="w-3.5 h-3.5 text-red-400" />
          <span className="text-white font-bold">{currentHp}</span> / {maxHp} HP
          <span className="text-cyan-400 font-black">({percentage}%)</span>
        </div>
      </div>

      {/* Health Bar Track */}
      <div className={`relative h-6 w-full rounded-xl bg-slate-950/90 border border-white/15 p-1 overflow-hidden shadow-2xl transition-all duration-300 ${
        isTakingDamage ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''
      }`}>
        {/* Ghost bar behind for damage decay effect */}
        <motion.div
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="absolute inset-y-1 left-1 rounded-lg bg-red-500/40"
        />

        {/* Primary Health Gradient */}
        <motion.div
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`h-full rounded-lg relative overflow-hidden transition-colors ${
            percentage > 50
              ? 'bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500'
              : percentage > 25
              ? 'bg-gradient-to-r from-red-600 via-amber-600 to-orange-500'
              : 'bg-gradient-to-r from-red-700 to-red-500 animate-pulse'
          }`}
        >
          {/* Internal diagonal stripes */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:16px_16px]" />
        </motion.div>

        {/* Phase markers at 75%, 50%, 25% */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-4">
          <div className="h-full w-[1px] bg-white/20" />
          <div className="h-full w-[1px] bg-white/20" />
          <div className="h-full w-[1px] bg-white/20" />
        </div>
      </div>
    </div>
  );
};
