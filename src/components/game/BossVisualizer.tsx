import React from 'react';
import { motion } from 'framer-motion';

interface BossVisualizerProps {
  isTakingDamage: boolean;
  isDefeated: boolean;
  healthPercent: number;
}

export const BossVisualizer: React.FC<BossVisualizerProps> = ({
  isTakingDamage,
  isDefeated,
  healthPercent,
}) => {
  return (
    <div className="relative w-72 h-72 sm:w-88 sm:h-88 mx-auto flex items-center justify-center my-4">
      {/* Background Radial Glow */}
      <div 
        className={`absolute inset-0 rounded-full blur-[70px] transition-all duration-500 pointer-events-none ${
          isDefeated 
            ? 'bg-cyan-500/10'
            : isTakingDamage 
            ? 'bg-red-600/50 scale-125' 
            : 'bg-purple-600/25'
        }`} 
      />

      {/* Main Boss SVG Entity */}
      <motion.div
        animate={
          isDefeated
            ? { scale: [1, 0.9, 0], opacity: [1, 0.8, 0], filter: 'grayscale(100%)' }
            : isTakingDamage
            ? {
                x: [-12, 12, -8, 8, -4, 4, 0],
                y: [6, -6, 4, -4, 0],
                filter: 'brightness(1.8) drop-shadow(0 0 35px #ff0055)',
                transition: { duration: 0.45 },
              }
            : {
                y: [-6, 6, -6],
                rotate: [-1, 1, -1],
                transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
              }
        }
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(157,78,221,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Core Gradient */}
            <linearGradient id="bossCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isTakingDamage ? '#ff0055' : '#00F0FF'} />
              <stop offset="50%" stopColor={isTakingDamage ? '#990022' : '#9D4EDD'} />
              <stop offset="100%" stopColor="#0B0F24" />
            </linearGradient>

            {/* Shield Gradient */}
            <radialGradient id="shieldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="90%" stopColor={isTakingDamage ? 'rgba(255,0,85,0.4)' : 'rgba(0,240,255,0.3)'} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Outer Gyro Ring 1 */}
          <motion.circle
            cx="150"
            cy="150"
            r="135"
            stroke={isTakingDamage ? '#ff0055' : 'rgba(0,240,255,0.3)'}
            strokeWidth="1.5"
            strokeDasharray="16 12"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
            style={{ transformOrigin: '150px 150px' }}
          />

          {/* Outer Gyro Ring 2 */}
          <motion.circle
            cx="150"
            cy="150"
            r="120"
            stroke="rgba(157,78,221,0.4)"
            strokeWidth="2"
            strokeDasharray="40 20 10 20"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            style={{ transformOrigin: '150px 150px' }}
          />

          {/* Hexagonal Shield Geometry */}
          <polygon
            points="150,45 235,95 235,205 150,255 65,205 65,95"
            stroke={isTakingDamage ? '#ff0055' : 'rgba(0,240,255,0.4)'}
            strokeWidth="2"
            fill="url(#shieldGrad)"
          />

          {/* Inner Hexagon Core Housing */}
          <polygon
            points="150,65 218,105 218,195 150,235 82,195 82,105"
            fill="#090D1E"
            stroke="rgba(157,78,221,0.7)"
            strokeWidth="3"
          />

          {/* Cyber Circuit Lines radiating from center */}
          <line x1="150" y1="65" x2="150" y2="105" stroke="#00F0FF" strokeWidth="2" />
          <line x1="218" y1="105" x2="185" y2="125" stroke="#9D4EDD" strokeWidth="2" />
          <line x1="218" y1="195" x2="185" y2="175" stroke="#00F0FF" strokeWidth="2" />
          <line x1="150" y1="235" x2="150" y2="195" stroke="#9D4EDD" strokeWidth="2" />
          <line x1="82" y1="195" x2="115" y2="175" stroke="#00F0FF" strokeWidth="2" />
          <line x1="82" y1="105" x2="115" y2="125" stroke="#9D4EDD" strokeWidth="2" />

          {/* Central Reactor Core Sphere */}
          <circle
            cx="150"
            cy="150"
            r="44"
            fill="url(#bossCoreGrad)"
            stroke={isTakingDamage ? '#ffffff' : '#00F0FF'}
            strokeWidth="2"
          />

          {/* Menacing Boss Eye / Optical Scanner */}
          <motion.g
            animate={{
              x: [-4, 4, -4],
              transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            }}
          >
            {/* Eye Horizontal Slit */}
            <ellipse
              cx="150"
              cy="150"
              rx={isTakingDamage ? 26 : 22}
              ry={isTakingDamage ? 16 : 8}
              fill={isTakingDamage ? '#ff0033' : '#FF007A'}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            {/* Glowing pupil */}
            <circle
              cx="150"
              cy="150"
              r="4"
              fill="#ffffff"
              className="drop-shadow-[0_0_8px_#ffffff]"
            />
          </motion.g>

          {/* Floating Data Glyphs (Math concepts) */}
          <text x="145" y="38" fill="rgba(0,240,255,0.7)" fontSize="11" fontFamily="monospace">∇L</text>
          <text x="245" y="100" fill="rgba(157,78,221,0.7)" fontSize="11" fontFamily="monospace">W_T</text>
          <text x="245" y="210" fill="rgba(0,240,255,0.7)" fontSize="11" fontFamily="monospace">λ·Σ</text>
          <text x="145" y="275" fill="rgba(255,0,122,0.7)" fontSize="11" fontFamily="monospace">σ(z)</text>
          <text x="45" y="210" fill="rgba(157,78,221,0.7)" fontSize="11" fontFamily="monospace">e^-z</text>
          <text x="45" y="100" fill="rgba(0,240,255,0.7)" fontSize="11" fontFamily="monospace">f(x)</text>
        </svg>

        {/* Floating Health Ring indicator */}
        <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-cyan-300">
          SHIELD INTEGRITY: <span className="font-bold text-white">{healthPercent}%</span>
        </div>
      </motion.div>
    </div>
  );
};
