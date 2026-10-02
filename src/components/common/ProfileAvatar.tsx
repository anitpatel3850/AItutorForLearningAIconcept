import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { DefaultAvatar } from './DefaultAvatar';
import { useGame } from '../../context/GameContext';

export interface ProfileAvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  showGlow?: boolean;
  statusIndicator?: 'online' | 'busy' | 'offline' | 'none';
  editable?: boolean;
  onEditClick?: () => void;
  className?: string;
  onClick?: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  alt = 'AI Explorer Avatar',
  size = 'md',
  showGlow = false,
  statusIndicator = 'none',
  editable = false,
  onEditClick,
  className = '',
  onClick,
}) => {
  const { user } = useGame();
  const [imageError, setImageError] = useState(false);

  // If src is explicitly provided, use it. Otherwise use user.avatar
  const avatarSrc = src !== undefined ? src : user?.avatar;

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2.5 h-2.5 ring-2',
    md: 'w-3 h-3 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-4 h-4 ring-2',
    '2xl': 'w-5 h-5 ring-4',
  };

  const sizeClass = typeof size === 'string' ? sizeClasses[size] || sizeClasses.md : '';
  const inlineSize = typeof size === 'number' ? { width: size, height: size } : undefined;

  const glowClass = showGlow
    ? 'shadow-[0_0_20px_rgba(0,240,255,0.4)] border-cyan-400'
    : 'border-cyan-500/40';

  const hasValidPhoto = Boolean(avatarSrc && avatarSrc.trim().length > 0 && !imageError);

  return (
    <div
      onClick={editable ? onEditClick : onClick}
      style={inlineSize}
      className={`relative inline-block rounded-full select-none shrink-0 ${sizeClass} ${
        editable || onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Outer Border Frame */}
      <div
        className={`w-full h-full rounded-full overflow-hidden border-2 p-[1px] bg-slate-950 transition-all duration-300 relative group ${glowClass} ${
          editable ? 'hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]' : ''
        }`}
      >
        {hasValidPhoto ? (
          <img
            src={avatarSrc!}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <DefaultAvatar className="w-full h-full" />
        )}

        {/* Hover Overlay with Camera Icon ("Change Photo") */}
        {editable && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-cyan-300 p-1 text-center">
            <Camera className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 animate-pulse text-cyan-400" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold leading-tight text-white hidden sm:block">
              Change Photo
            </span>
          </div>
        )}
      </div>

      {/* Online / Active Status Dot */}
      {statusIndicator !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-[#070913] ${
            typeof size === 'string' ? statusDotSizes[size] || statusDotSizes.md : 'w-3 h-3 ring-2'
          } ${
            statusIndicator === 'online'
              ? 'bg-emerald-400'
              : statusIndicator === 'busy'
              ? 'bg-amber-400'
              : 'bg-slate-500'
          }`}
        />
      )}
    </div>
  );
};
