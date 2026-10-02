import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Sparkles, Swords, Compass } from 'lucide-react';
import { QuestNode } from '../components/game/QuestNode';
import { useGame } from '../context/GameContext';
import { WORLDS } from '../data/mockData';

export const QuestMapPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGame();

  const handleSelectWorld = (worldId: string) => {
    const world = WORLDS.find(w => w.id === worldId);
    if (world && world.quests.length > 0) {
      navigate(`/quest/${world.quests[0].id}`);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
            <Map className="w-3.5 h-3.5" />
            <span>NEURAL ATLAS // 6 REALMS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
            AI Quest Map
          </h1>
          <p className="text-sm text-slate-300">
            Traverse interconnected AI realms. Complete quest nodes, unlock raid gates, and conquer the neural landscape.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#0D1224] border border-cyan-500/30 text-xs font-mono">
            <span className="text-slate-400">Current Level: </span>
            <span className="text-cyan-300 font-bold">LVL {user.level}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#0D1224] border border-purple-500/30 text-xs font-mono">
            <span className="text-slate-400">Total Mastery: </span>
            <span className="text-purple-300 font-bold">
              {Math.round(Object.values(user.mastery).reduce((a, b) => a + b, 0) / 6)}%
            </span>
          </div>
        </div>
      </div>

      {/* Visual Map Layout */}
      <div className="relative py-8">
        {/* Glowing Connected Bezier SVG Backbone */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mapNeonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#9D4EDD" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#FF007A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFB800" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Path connecting W1 -> W2 -> W3 -> W4 -> W5 -> W6 */}
            <path
              d="M 280 120 C 450 180, 650 180, 780 280 S 450 480, 280 620 S 650 780, 780 920 S 450 1120, 280 1260 S 650 1420, 780 1560"
              fill="none"
              stroke="url(#mapNeonGrad)"
              strokeWidth="4"
              strokeDasharray="10 8"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Nodes Grid / Zig-Zag flow */}
        <div className="relative z-10 space-y-12">
          {WORLDS.map((world, index) => {
            const isUnlocked = user.level >= world.requiredLevel;
            const isCompleted = index === 0; // World 1 is marked completed for explorer
            const completionPercentage = index === 0 ? 100 : index === 1 ? 65 : 0;

            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col lg:flex-row items-center ${
                  isEven ? 'lg:justify-start' : 'lg:justify-end'
                }`}
              >
                <div className="w-full max-w-lg">
                  <QuestNode
                    world={world}
                    isUnlocked={isUnlocked}
                    isCompleted={isCompleted}
                    completionPercentage={completionPercentage}
                    userLevel={user.level}
                    onSelect={() => handleSelectWorld(world.id)}
                  />

                  {/* Connected Boss Raid gate alert if active world */}
                  {isUnlocked && world.bossId && (
                    <div className="mt-2.5 px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-red-300">
                        <Swords className="w-4 h-4 text-red-400" />
                        <span>Arena Gate: {world.name} Boss</span>
                      </div>
                      <button
                        onClick={() => navigate(`/boss/${world.bossId}`)}
                        className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                      >
                        Challenge Boss →
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
