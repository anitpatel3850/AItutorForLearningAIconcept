import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  RotateCcw, 
  Sparkles,
  Layers,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { useGame } from '../context/GameContext';
import { MISSIONS } from '../data/mockData';
import { sound } from '../utils/audio';

export const MissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeMission } = useGame();

  // Load mission from mock data (default to m-04 as requested)
  const mission = MISSIONS[id || 'm-04'] || MISSIONS['m-04'];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const isAlreadyCompleted = user.completedMissions.includes(mission.id);

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted && isCorrect) return; // Locked once solved
    sound.playClick();
    setSelectedOptionId(optionId);
    setHasSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId) return;

    setHasSubmitted(true);
    setAttempts((prev) => prev + 1);

    if (selectedOptionId === mission.challenge.correctOptionId) {
      setIsCorrect(true);
      completeMission(mission.id, mission.xpReward);
    } else {
      setIsCorrect(false);
      sound.playWrong();
      setShowHint(true);
    }
  };

  const handleRetry = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setIsCorrect(false);
  };

  // Find next mission id if available
  const allMissionIds = Object.keys(MISSIONS);
  const currentIndex = allMissionIds.indexOf(mission.id);
  const nextMissionId = currentIndex >= 0 && currentIndex < allMissionIds.length - 1 ? allMissionIds[currentIndex + 1] : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <div className="flex items-center gap-2">
          {isAlreadyCompleted && (
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>COMPLETED</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            +{mission.xpReward} XP
          </span>
        </div>
      </div>

      {/* Mission Header Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#111736] to-[#0D1226] border border-cyan-500/30 shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {mission.number}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {mission.difficulty}
            </span>
          </div>
          <span className="text-xs font-mono text-purple-300">
            Topic: {mission.topic}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-display text-white mb-2">
          {mission.title}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          {mission.objective}
        </p>
      </div>

      {/* Visual Concept Explanation Card */}
      <Card className="p-6 space-y-4 border-purple-500/30 bg-[#0E132B]/80">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
          <Layers className="w-4 h-4" />
          <span>CONCEPT BRIEFING</span>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed">
          {mission.explanation.overview}
        </p>

        {/* Visual Graphic Representation */}
        <div className="my-4 p-5 rounded-2xl bg-[#080B1A] border border-white/10 relative overflow-hidden">
          <div className="text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
            <span>DATA FLOW MODEL:</span>
            <span className="text-cyan-400">TRAINING PHASE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
              <div className="text-xs font-bold text-cyan-300 font-mono">1. INPUT DATA (X)</div>
              <div className="text-[11px] text-slate-300">Labeled Photos (Cats & Dogs)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
              <div className="text-xs font-bold text-purple-300 font-mono">2. MODEL f(X)</div>
              <div className="text-[11px] text-slate-300">Predicts Probabilities</div>
            </div>

            <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-1">
              <div className="text-xs font-bold text-pink-300 font-mono">3. ERROR CORRECTION</div>
              <div className="text-[11px] text-slate-300">Update Weights via Loss</div>
            </div>
          </div>

          {mission.explanation.analogy && (
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400 italic">
              💡 <span className="font-semibold text-slate-300">Mental Model:</span> {mission.explanation.analogy}
            </div>
          )}
        </div>
      </Card>

      {/* Interactive Challenge Section */}
      <Card glow="cyan" className="p-6 sm:p-8 space-y-6 bg-[#0D1226]/90 border-cyan-500/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>TACTICAL CHALLENGE</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-white leading-snug">
            {mission.challenge.prompt}
          </h2>
        </div>

        {/* Answer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {mission.challenge.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isAnswerSubmitted = hasSubmitted;
            const isOptionCorrect = option.id === mission.challenge.correctOptionId;

            let cardStyles = 'border-white/10 hover:border-cyan-500/40 bg-slate-900/60';
            if (isSelected) {
              if (isAnswerSubmitted && isCorrect) {
                cardStyles = 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_20px_rgba(0,255,157,0.2)]';
              } else if (isAnswerSubmitted && !isCorrect) {
                cardStyles = 'border-red-500 bg-red-950/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
              } else {
                cardStyles = 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]';
              }
            }

            return (
              <motion.div
                key={option.id}
                whileHover={!hasSubmitted || !isCorrect ? { scale: 1.01 } : {}}
                whileTap={!hasSubmitted || !isCorrect ? { scale: 0.99 } : {}}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${cardStyles}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  isSelected
                    ? isAnswerSubmitted && isCorrect
                      ? 'bg-emerald-400 text-slate-950'
                      : isAnswerSubmitted && !isCorrect
                      ? 'bg-red-400 text-slate-950'
                      : 'bg-cyan-400 text-slate-950'
                    : 'bg-white/5 text-slate-400'
                }`}>
                  {option.label}
                </div>

                <span className="text-sm font-medium text-slate-200">
                  {option.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Feedback States */}
        <AnimatePresence>
          {hasSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {isCorrect ? (
                /* Success Banner with ProfileAvatar */
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0D1926] to-[#0A1A2F] border border-emerald-500/40 space-y-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar size="md" showGlow statusIndicator="online" />
                      <div>
                        <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                          Mission Victor
                        </div>
                        <div className="text-sm font-bold text-white font-display">
                          {user.username} <span className="text-xs text-purple-300 font-mono font-normal">• Lvl {user.level}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>MISSION COMPLETE</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold">
                        +{mission.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {mission.challenge.detailedSolution}
                  </p>
                </div>
              ) : (
                /* Failure Banner with Hint */
                <div className="p-4 sm:p-5 rounded-2xl bg-red-950/60 border border-red-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-400 font-bold font-display text-base">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span>Not quite.</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Attempt {attempts}</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Your answer was not optimal for this objective.
                  </p>

                  {/* Helpful Hint */}
                  <div className="mt-2 p-3 rounded-xl bg-slate-950/60 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Mentor Hint: </span>
                      {mission.challenge.hint}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            {!hasSubmitted || !isCorrect ? (
              <Button
                size="md"
                glow
                disabled={!selectedOptionId}
                onClick={handleSubmitAnswer}
                icon={<Sparkles className="w-4 h-4" />}
                iconPosition="right"
              >
                CONFIRM ANSWER
              </Button>
            ) : (
              <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>EXPERIENCE REWARD CLAIMED</span>
              </div>
            )}

            {hasSubmitted && !isCorrect && (
              <Button
                variant="secondary"
                size="md"
                onClick={handleRetry}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                RETRY
              </Button>
            )}
          </div>

          {/* Next Mission Button */}
          {hasSubmitted && isCorrect && nextMissionId && (
            <Button
              size="md"
              variant="purple"
              glow
              onClick={() => {
                navigate(`/mission/${nextMissionId}`);
                setSelectedOptionId(null);
                setHasSubmitted(false);
                setIsCorrect(false);
              }}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              NEXT MISSION
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
