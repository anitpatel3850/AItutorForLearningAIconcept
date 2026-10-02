import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, 
  ShieldAlert, 
  Sparkles, 
  Lightbulb, 
  Trophy, 
  Zap, 
  RotateCcw, 
  ArrowRight,
  Clock,
  Target,
  Award,
  Heart
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LevelBadge } from '../components/common/LevelBadge';
import { BossHealthBar } from '../components/game/BossHealthBar';
import { BossVisualizer } from '../components/game/BossVisualizer';
import { useGame } from '../context/GameContext';
import { BOSSES } from '../data/mockData';
import { sound } from '../utils/audio';
import { triggerBossVictoryConfetti } from '../utils/confetti';

export const BossBattlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, defeatBoss, addXp } = useGame();

  const boss = BOSSES[id || 'boss-ml'] || BOSSES['boss-ml'];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [playerHp, setPlayerHp] = useState(100);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);
  const [showTutorHint, setShowTutorHint] = useState(false);

  // Battle Metrics
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Elapsed timer
  useEffect(() => {
    if (isDefeated) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isDefeated, startTime]);

  const currentQ = boss.questions[currentQuestionIndex] || boss.questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted && bossHp <= 0) return;
    sound.playClick();
    setSelectedAnswerIndex(idx);
    setShowTutorHint(false);
    setIsAnswerSubmitted(false);
  };

  const handleAttack = () => {
    if (selectedAnswerIndex === null) return;

    setIsAnswerSubmitted(true);
    setTotalQuestionsAnswered((prev) => prev + 1);

    if (selectedAnswerIndex === currentQ.correctIndex) {
      // Hit the boss!
      sound.playBossHit();
      setIsTakingDamage(true);
      setCorrectAnswersCount((prev) => prev + 1);

      // Deduct Boss HP
      const damageAmount = currentQ.damage || 20;
      const newHp = Math.max(0, bossHp - damageAmount);
      setBossHp(newHp);

      // Award XP for correct battle question
      addXp(50);

      setTimeout(() => {
        setIsTakingDamage(false);

        if (newHp <= 0) {
          // Boss Defeated!
          setIsDefeated(true);
          defeatBoss(boss.id, boss.xpReward);
          triggerBossVictoryConfetti();
        } else {
          // Advance to next question
          if (currentQuestionIndex < boss.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswerIndex(null);
            setIsAnswerSubmitted(false);
          }
        }
      }, 700);
    } else {
      // Wrong answer - Boss counter-attacks player shield, tutor provides hint
      sound.playWrong();
      setPlayerHp((prev) => Math.max(20, prev - 15));
      setShowTutorHint(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Banner / Arena Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-400 mb-1">
            <Swords className="w-4 h-4 animate-pulse" />
            <span>RAID INSTANCE // {boss.difficulty}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            {boss.title}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Objective: Deplete the boss neural shield using accurate algorithmic deduction.
          </p>
        </div>

        {/* Player HUD Card (Level 14, 4850 XP as requested) */}
        <div className="flex items-center gap-3 bg-[#0D1226] border border-cyan-500/30 p-2.5 px-4 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <div className="relative">
            <img
              src={user.avatar}
              alt="Player"
              className="w-10 h-10 rounded-xl object-cover border border-cyan-400"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full ring-2 ring-[#0D1226]" />
          </div>
          <div className="font-mono text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span>{user.username}</span>
              <span className="text-[10px] text-cyan-400 font-normal">LVL {user.level}</span>
            </div>
            <div className="text-[11px] text-cyan-300 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-cyan-400" />
              <span>{user.xp.toLocaleString()} XP</span>
            </div>
            {/* Player Shield Bar */}
            <div className="w-24 h-1.5 bg-slate-900 rounded-full mt-1 overflow-hidden border border-white/10">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Boss Health Bar */}
      <BossHealthBar
        currentHp={bossHp}
        maxHp={boss.maxHp}
        bossName={boss.name}
        isTakingDamage={isTakingDamage}
      />

      {/* Futuristic Animated Boss Visualization */}
      <BossVisualizer
        isTakingDamage={isTakingDamage}
        isDefeated={isDefeated}
        healthPercent={Math.round((bossHp / boss.maxHp) * 100)}
      />

      {/* Interactive Combat Card (Question & Answers) */}
      {!isDefeated ? (
        <Card glow="pink" className="p-6 sm:p-8 space-y-6 bg-[#0E122A]/90 border-red-500/30 relative">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-red-400">
              PHASE {currentQuestionIndex + 1} OF {boss.questions.length} // STRIKE CALCULATION
            </span>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {formatTime(elapsedSeconds)}
              </span>
              <span className="text-amber-400 font-bold">
                -{currentQ.damage} HP per hit
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-sans text-white leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswerIndex === idx;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-red-400 bg-red-950/40 shadow-[0_0_20px_rgba(255,0,85,0.25)]'
                      : 'border-white/10 bg-slate-900/60 hover:border-red-500/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {option}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* AI Tutor Hint on Miss */}
          <AnimatePresence>
            {showTutorHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>AI Mentor Tactical Hint ({user.mentor}):</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentQ.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
            <span className="text-xs font-mono text-slate-400">
              Select algorithm to fire weapon
            </span>

            <Button
              size="lg"
              variant="danger"
              disabled={selectedAnswerIndex === null || isTakingDamage}
              onClick={handleAttack}
              icon={<Swords className="w-4 h-4" />}
              iconPosition="right"
            >
              EXECUTE ATTACK
            </Button>
          </div>
        </Card>
      ) : (
        /* BOSS DEFEATED VICTORY SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-[#162538] via-[#0E1528] to-[#1A1230] border-2 border-cyan-400/60 shadow-[0_0_60px_rgba(0,240,255,0.4)] text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-1 mx-auto shadow-2xl">
            <div className="w-full h-full bg-[#080B18] rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-cyan-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              VICTORY ACHIEVED // RAID CONQUERED
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-display text-white">
              BOSS DEFEATED
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You dismantled the Overfitting Titan's memorization manifold and secured complete generalization mastery.
            </p>
          </div>

          {/* Battle Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto py-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">XP EARNED</div>
              <div className="text-xl font-bold font-mono text-cyan-400 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-cyan-400" />
                +{boss.xpReward} XP
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">ACCURACY</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {totalQuestionsAnswered > 0 ? Math.round((correctAnswersCount / totalQuestionsAnswered) * 100) : 100}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">TIME</div>
              <div className="text-xl font-bold font-mono text-purple-300">
                {formatTime(elapsedSeconds)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">MASTERY</div>
              <div className="text-xl font-bold font-mono text-amber-400">
                100%
              </div>
            </div>
          </div>

          {/* Achievement Unlocked Badge */}
          <div className="inline-flex items-center gap-3 p-3 px-5 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-400/50 shadow-lg text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                ACHIEVEMENT UNLOCKED
              </div>
              <div className="text-sm font-bold text-white font-display">
                "{boss.rewardBadge}"
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to="/quest-map">
              <Button size="lg" glow icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                CONTINUE TO NEXT WORLD
              </Button>
            </Link>
            <Link to="/achievements">
              <Button size="lg" variant="secondary">
                VIEW ACHIEVEMENTS
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};
