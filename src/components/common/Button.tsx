import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { sound } from '../../utils/audio';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'purple' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  glow = false,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      sound.playClick();
      if (onClick) onClick(e);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-bold font-sans tracking-wide rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none relative overflow-hidden group';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20 active:translate-y-0.5',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/60 backdrop-blur-md active:translate-y-0.5',
    outline: 'bg-transparent hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 active:translate-y-0.5',
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 active:translate-y-0.5',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 active:translate-y-0.5',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white',
  }[variant];

  const glowStyle = glow
    ? variant === 'primary'
      ? 'shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)]'
      : 'shadow-[0_0_25px_rgba(157,78,221,0.4)] hover:shadow-[0_0_35px_rgba(157,78,221,0.6)]'
    : '';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${glowStyle} ${className}`}
      {...props}
    >
      {/* Light sheen hover animation */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </motion.button>
  );
};
