import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'glass' | 'default';
  glow?: 'cyan' | 'purple' | 'pink' | 'green' | 'amber' | 'none';
  hoverEffect?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  glow = 'none',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const glowBorderStyles = {
    none: 'border-white/10',
    cyan: 'border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.15)]',
    purple: 'border-purple-500/30 shadow-[0_0_25px_rgba(157,78,221,0.15)]',
    pink: 'border-pink-500/30 shadow-[0_0_25px_rgba(255,0,122,0.15)]',
    green: 'border-emerald-500/30 shadow-[0_0_25px_rgba(0,255,157,0.15)]',
    amber: 'border-amber-500/30 shadow-[0_0_25px_rgba(255,184,0,0.15)]',
  }[glow];

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`relative rounded-2xl bg-[#0D1122]/80 backdrop-blur-xl border ${glowBorderStyles} p-5 text-slate-100 ${
        hoverEffect ? 'hover:border-cyan-500/40 hover:shadow-[0_12px_35px_-10px_rgba(0,240,255,0.2)] transition-colors' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
