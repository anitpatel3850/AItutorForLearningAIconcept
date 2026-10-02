import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Target, 
  Swords, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MissionCard } from '../components/game/MissionCard';
import { useGame } from '../context/GameContext';
import { WORLDS, MISSIONS } from '../data/mockData';

export const QuestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useGame();

  // Find quest across all worlds
  let foundQuest = null;
  let foundWorld = null;

  for (const world of WORLDS) {
    const q = world.quests.find((quest) => quest.id === id);
    if (q) {
      foundQuest = q;
      foundWorld = world;
      break;
    }
  }

  // Fallback to World 2 Quest 1 if not found
  const quest = foundQuest || WORLDS[1].quests[0];
  const world = foundWorld || WORLDS[1];

  const questMissions = quest.missionIds.map((mId) => MISSIONS[mId]).filter(Boolean);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <Link
        to="/quest-map"
        className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO QUEST MAP</span>
      </Link>

      {/* Quest Banner Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#141C38] via-[#0E1328] to-[#1A1335] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                WORLD 0{world.worldNumber} // {world.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                LVL {quest.requiredLevel}+ REQUIRED
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
              {quest.title}
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              {quest.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono pt-1">
              <span className="text-cyan-300 flex items-center gap-1 font-bold">
                <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                +{quest.xpReward} Quest Bonus XP
              </span>
              <span className="text-purple-300 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {questMissions.length} Interactive Missions
              </span>
            </div>
          </div>

          {/* Boss Portal Callout inside Quest */}
          {quest.bossId && (
            <div className="rounded-2xl bg-red-950/40 border border-red-500/40 p-4 shrink-0 text-center space-y-2 max-w-xs">
              <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs font-mono font-bold">
                <Swords className="w-4 h-4 animate-pulse" />
                <span>REALM BOSS ENCOUNTER</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Defeat the Overfitting Titan to claim the ML Apprentice badge!
              </p>
              <Link to={`/boss/${quest.bossId}`} className="block">
                <Button size="sm" variant="danger" className="w-full">
                  CHALLENGE BOSS
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Missions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Mission Directives</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {questMissions.filter(m => user.completedMissions.includes(m.id)).length} of {questMissions.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questMissions.map((mission) => {
            const isCompleted = user.completedMissions.includes(mission.id);
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                isCompleted={isCompleted}
                onStart={() => navigate(`/mission/${mission.id}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
