import React from 'react';
import { Shield } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      box: 'px-2 py-0.5 text-xs',
      icon: 'w-3 h-3',
      num: 'text-xs',
    },
    md: {
      box: 'px-3 py-1 text-sm',
      icon: 'w-4 h-4',
      num: 'text-sm font-black',
    },
    lg: {
      box: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      num: 'text-lg font-black',
    },
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono shadow-[0_0_15px_rgba(0,240,255,0.15)] ${sizeStyles.box} ${className}`}
    >
      <Shield className={`${sizeStyles.icon} text-cyan-400 fill-cyan-400/20`} />
      {showLabel && <span className="text-slate-400 font-sans uppercase text-[10px] tracking-wider">LVL</span>}
      <span className={`${sizeStyles.num} text-white font-display`}>{level}</span>
    </div>
  );
};
