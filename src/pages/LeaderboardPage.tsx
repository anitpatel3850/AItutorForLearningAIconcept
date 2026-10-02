import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Award, Users, Globe, Shield, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { useGame } from '../context/GameContext';
import { LEADERBOARD_USERS } from '../data/mockData';
import { sound } from '../utils/audio';

export const LeaderboardPage: React.FC = () => {
  const { user } = useGame();
  const [tab, setTab] = useState<'global' | 'friends'>('global');

  // Update mock current-user row to reflect actual user state
  const updatedLeaderboard = LEADERBOARD_USERS.map((entry) => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        name: user.username,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        badges: user.unlockedAchievements.length,
      };
    }
    return entry;
  });

  // Filter for friends view: current user + a couple friends
  const displayList = tab === 'global'
    ? updatedLeaderboard
    : updatedLeaderboard.filter((u) => [1, 3, 5, 6].includes(u.rank));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>GLOBAL RANKINGS // SEASON 01</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
            Leaderboard
          </h1>
          <p className="text-sm text-slate-300">
            Compare synaptic output with neural explorers worldwide. Top rankers unlock exclusive raid tiers.
          </p>
        </div>

        {/* Global / Friends Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0D1226] border border-white/10">
          <button
            onClick={() => {
              sound.playClick();
              setTab('global');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              tab === 'global'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setTab('friends');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              tab === 'friends'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>FRIENDS</span>
          </button>
        </div>
      </div>

      {/* Podium Top 3 Cards for Global */}
      {tab === 'global' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 */}
          <Card className="order-2 md:order-1 p-5 text-center bg-[#0F142D]/80 border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-full bg-slate-400/20 text-slate-300 font-display font-black text-sm mx-auto flex items-center justify-center border border-slate-400/40">
              #2
            </div>
            <div className="flex justify-center">
              <ProfileAvatar
                src={updatedLeaderboard[1].isCurrentUser ? undefined : updatedLeaderboard[1].avatar}
                size="xl"
                className="shadow-lg"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">
                {updatedLeaderboard[1].name}
              </div>
              <div className="text-[11px] text-purple-300 font-mono">
                {updatedLeaderboard[1].title}
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400">
              {updatedLeaderboard[1].xp.toLocaleString()} XP
            </div>
          </Card>

          {/* Rank 1 */}
          <Card glow="amber" className="order-1 md:order-2 p-6 text-center bg-gradient-to-b from-[#1E1B15] to-[#111222] border-amber-500/50 space-y-3 md:-translate-y-2 shadow-[0_0_40px_rgba(255,184,0,0.2)]">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 font-display font-black text-base mx-auto flex items-center justify-center border border-amber-400 shadow-md shadow-amber-400/30">
              👑 #1
            </div>
            <div className="flex justify-center">
              <ProfileAvatar
                src={updatedLeaderboard[0].isCurrentUser ? undefined : updatedLeaderboard[0].avatar}
                size="2xl"
                showGlow
                className="shadow-xl"
              />
            </div>
            <div>
              <div className="text-base font-bold text-white font-display">
                {updatedLeaderboard[0].name}
              </div>
              <div className="text-xs text-amber-300 font-mono">
                {updatedLeaderboard[0].title}
              </div>
            </div>
            <div className="text-sm font-mono font-black text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>{updatedLeaderboard[0].xp.toLocaleString()} XP</span>
            </div>
          </Card>

          {/* Rank 3 */}
          <Card className="order-3 p-5 text-center bg-[#0F142D]/80 border-amber-700/40 space-y-3">
            <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 font-display font-black text-sm mx-auto flex items-center justify-center border border-amber-700/40">
              #3
            </div>
            <div className="flex justify-center">
              <ProfileAvatar
                src={updatedLeaderboard[2].isCurrentUser ? undefined : updatedLeaderboard[2].avatar}
                size="xl"
                className="shadow-lg"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">
                {updatedLeaderboard[2].name}
              </div>
              <div className="text-[11px] text-purple-300 font-mono">
                {updatedLeaderboard[2].title}
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400">
              {updatedLeaderboard[2].xp.toLocaleString()} XP
            </div>
          </Card>
        </div>
      )}

      {/* Leaderboard Table Card */}
      <Card className="p-0 overflow-hidden bg-[#0A0D1E]/90 border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">Rank</th>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4 text-center">Level</th>
                <th className="py-3.5 px-4 text-right">XP</th>
                <th className="py-3.5 px-4 text-center hidden sm:table-cell">Badges</th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell">Streak</th>
                <th className="py-3.5 px-4 text-right hidden lg:table-cell">League Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
              {displayList.map((entry) => {
                const isUser = entry.isCurrentUser;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-cyan-500/15 border-y-2 border-cyan-400/60 font-bold'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block font-display font-bold ${
                        entry.rank === 1 ? 'text-amber-400 text-sm' :
                        entry.rank === 2 ? 'text-slate-300 text-sm' :
                        entry.rank === 3 ? 'text-amber-600 text-sm' : 'text-slate-400'
                      }`}>
                        #{entry.rank}
                      </span>
                    </td>

                    {/* Player Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          src={isUser ? undefined : entry.avatar}
                          size="sm"
                          showGlow={isUser}
                          statusIndicator={isUser ? 'online' : 'none'}
                          className="shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white font-sans flex items-center gap-2">
                            <span>{entry.name}</span>
                            {isUser && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-black">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {entry.title}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300 font-bold">
                        LVL {entry.level}
                      </span>
                    </td>

                    {/* XP */}
                    <td className="py-3 px-4 text-right text-cyan-300 font-bold">
                      {entry.xp.toLocaleString()} XP
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4 text-center hidden sm:table-cell text-purple-300">
                      <span className="flex items-center justify-center gap-1">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        {entry.badges}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-4 text-center hidden md:table-cell text-amber-300">
                      <span className="flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {entry.streak}d
                      </span>
                    </td>

                    {/* League Tier */}
                    <td className="py-3 px-4 text-right hidden lg:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        entry.tier === 'Grandmaster' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        entry.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                        entry.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {entry.tier}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
