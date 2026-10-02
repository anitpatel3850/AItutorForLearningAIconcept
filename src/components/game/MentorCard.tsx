import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Mentor } from '../../types';

interface MentorCardProps {
  mentor: Mentor;
  isSelected: boolean;
  onSelect: () => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  isSelected,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'bg-gradient-to-b from-[#161D3B] to-[#0E1328] border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.25)]'
          : 'bg-[#0D1122]/70 border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-400/40">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className={`w-14 h-14 rounded-2xl object-cover border-2 ${
                isSelected ? 'border-cyan-400' : 'border-white/15'
              }`}
            />
            <div 
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D1122]"
              style={{ backgroundColor: mentor.accentColor }}
            />
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {mentor.id}
            </div>
            <h4 className="text-base font-bold text-white font-display">
              {mentor.name}
            </h4>
            <p className="text-xs text-slate-400">{mentor.role}</p>
          </div>
        </div>

        <div className="mb-3">
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            {mentor.title}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {mentor.description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/[0.08] text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Teaching Style:</span>
        <span className="text-white font-medium truncate max-w-[130px]">{mentor.style}</span>
      </div>
    </motion.div>
  );
};
