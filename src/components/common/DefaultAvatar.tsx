import React from 'react';

interface DefaultAvatarProps {
  className?: string;
  size?: number | string;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({
  className = '',
  size = '100%',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`rounded-full overflow-hidden select-none ${className}`}
      style={{ width: size, height: size }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Background Radial Gradient */}
        <radialGradient id="defaultAvatarBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1945" />
          <stop offset="60%" stopColor="#0F1532" />
          <stop offset="100%" stopColor="#080B18" />
        </radialGradient>

        {/* Cyber Neon Gradient */}
        <linearGradient id="cyberNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#9D4EDD" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>

        {/* Glow Core Gradient */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#9D4EDD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Background Circle */}
      <circle cx="50" cy="50" r="50" fill="url(#defaultAvatarBg)" />

      {/* Cyber Grid Lines */}
      <circle cx="50" cy="50" r="46" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="38" stroke="rgba(157, 78, 221, 0.25)" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="28" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1" strokeDasharray="6 4" />

      {/* Central Glow Field */}
      <circle cx="50" cy="50" r="20" fill="url(#coreGlow)" />

      {/* Synaptic Hexagon Core */}
      <polygon
        points="50,22 74,36 74,64 50,78 26,64 26,36"
        stroke="url(#cyberNeonGrad)"
        strokeWidth="1.8"
        fill="rgba(13, 17, 34, 0.7)"
      />

      {/* Inner Neural Network Nodes & Links */}
      <line x1="50" y1="22" x2="50" y2="40" stroke="#00F0FF" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="74" y1="36" x2="58" y2="46" stroke="#9D4EDD" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="74" y1="64" x2="58" y2="54" stroke="#FF007A" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="50" y1="78" x2="50" y2="60" stroke="#00F0FF" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="26" y1="64" x2="42" y2="54" stroke="#9D4EDD" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="26" y1="36" x2="42" y2="46" stroke="#FF007A" strokeWidth="1.2" strokeOpacity="0.7" />

      {/* Geometric Neural Nodes */}
      <circle cx="50" cy="22" r="2.5" fill="#00F0FF" />
      <circle cx="74" cy="36" r="2.5" fill="#9D4EDD" />
      <circle cx="74" cy="64" r="2.5" fill="#FF007A" />
      <circle cx="50" cy="78" r="2.5" fill="#00F0FF" />
      <circle cx="26" cy="64" r="2.5" fill="#9D4EDD" />
      <circle cx="26" cy="36" r="2.5" fill="#FF007A" />

      {/* Center Quantum AI Glyph (Diamond & Core) */}
      <polygon points="50,42 58,50 50,58 42,50" fill="url(#cyberNeonGrad)" />
      <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />

      {/* Subtle Outer Glowing Border */}
      <circle cx="50" cy="50" r="49" stroke="url(#cyberNeonGrad)" strokeWidth="1.5" />
    </svg>
  );
};
