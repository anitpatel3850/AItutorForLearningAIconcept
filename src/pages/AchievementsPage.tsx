import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Zap, Shield, CheckCircle2, Lock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { AchievementCard } from '../components/game/AchievementCard';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/mockData';

export const AchievementsPage: React.FC = () => {
  const { user } = useGame();
  const [filter, setFilter] = useState<'all' | 'quest' | 'combat' | 'streak' | 'mastery'>('all');

  // Merge mock achievements with user's unlocked list
  const userAchievements = ACHIEVEMENTS.map((ach) => {
    const isUnlocked = user.unlockedAchievements.includes(ach.id);
    return {
      ...ach,
      isUnlocked,
      unlockedAt: isUnlocked ? ach.unlockedAt || 'Recently' : undefined,
      progress: isUnlocked ? ach.maxProgress : ach.progress,
    };
  });

  const filteredAchievements = userAchievements.filter((ach) => {
    if (filter === 'all') return true;
    return ach.category === filter;
  });

  const unlockedCount = userAchievements.filter((a) => a.isUnlocked).length;
  const totalXpClaimable = userAchievements
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span>HONOR ROLL // TROPHY VAULT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
            Achievements
          </h1>
          <p className="text-sm text-slate-300">
            Earn rare medals, titles, and XP boosts by accomplishing algorithmic feats.
          </p>
        </div>

        {/* Progress Summary Card */}
        <div className="flex items-center gap-4 bg-[#0E1328] border border-cyan-500/30 p-3 px-5 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <div className="text-center font-mono">
            <div className="text-xl font-bold text-cyan-300 font-display">
              {unlockedCount} / {userAchievements.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase">UNLOCKED</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="text-center font-mono">
            <div className="text-xl font-bold text-amber-400 font-display">
              +{totalXpClaimable}
            </div>
            <div className="text-[10px] text-slate-400 uppercase">ACHIEVEMENT XP</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Medals' },
          { id: 'combat', label: 'Boss Raids' },
          { id: 'quest', label: 'World Quests' },
          { id: 'streak', label: 'Streaks' },
          { id: 'mastery', label: 'Mastery' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              filter === tab.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={achievement.isUnlocked}
          />
        ))}
      </div>
    </div>
  );
};
