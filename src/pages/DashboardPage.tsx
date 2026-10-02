import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Swords, 
  Bot, 
  Map, 
  Target, 
  CheckCircle2, 
  BookOpenCheck,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Award,
  GraduationCap,
  Play,
  Clock,
  Layers,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { XPBar } from '../components/common/XPBar';
import { LevelBadge } from '../components/common/LevelBadge';
import { useGame } from '../context/GameContext';
import { useCourses } from '../context/CourseContext';
import { WORLDS, MISSIONS } from '../data/mockData';
import { sound } from '../utils/audio';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, levelProgressPercent, currentLevelXp, xpToNextLevel, recentXpGained } = useGame();
  const { lastActiveItem, enrolledCourses, recommendedCourses, completedCourses, getCourseProgress } = useCourses();

  const currentQuest = WORLDS[1].quests[0]; // "Master Machine Learning"
  const currentMission = MISSIONS['m-04']; // "Teach the Machine"

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#121938] via-[#0E132A] to-[#181132] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.15)] relative overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>COMMAND CENTER ACTIVE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{user.username}</span>.
            </h1>

            <p className="text-sm text-slate-300 max-w-xl">
              You are currently ranked in the top 10% of neural explorers this week. Your mentor <span className="text-purple-300 font-bold">{user.mentor}</span> has prepared training modules for your next breakthrough.
            </p>

            {/* Quick Stats Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <LevelBadge level={user.level} size="md" />

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 font-mono text-sm font-bold shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{user.xp.toLocaleString()} XP</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.15)]">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{user.streak} Day Streak</span>
              </div>
            </div>
          </div>

          {/* XP Progress Card */}
          <div className="w-full lg:w-96 rounded-2xl bg-slate-950/70 border border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">LEVEL PROGRESS</span>
              <span className="text-cyan-300 font-bold">LVL {user.level} → LVL {user.level + 1}</span>
            </div>

            <XPBar
              currentLevelXp={currentLevelXp}
              xpToNextLevel={xpToNextLevel}
              progressPercent={levelProgressPercent}
              level={user.level}
              totalXp={user.xp}
              recentXp={recentXpGained}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>{xpToNextLevel} XP needed for Level {user.level + 1}</span>
              <span className="text-emerald-400 font-bold">+100 XP / mission</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 10. CONTINUE LEARNING (Course Spotlight) */}
      {lastActiveItem && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0C152F] via-[#0E1B38] to-[#171333] border border-cyan-500/40 relative overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.15)]">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CONTINUE LEARNING</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {lastActiveItem.course.title} // Module 0{lastActiveItem.module.moduleNumber}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                    {lastActiveItem.lesson.title}
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 line-clamp-1 max-w-xl">
                    {lastActiveItem.lesson.description}
                  </p>
                </div>

                {/* Progress bar & XP */}
                <div className="space-y-1.5 max-w-md pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Course Syllabus Progress</span>
                    <span className="text-cyan-300 font-bold">{lastActiveItem.progress.progressPercentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${lastActiveItem.progress.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{lastActiveItem.progress.completedLessons.length} lessons mastered</span>
                    <span className="text-amber-400 font-bold">+{lastActiveItem.progress.xp} Course XP</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                <Link to={`/courses/${lastActiveItem.course.id}/roadmap`}>
                  <Button size="md" variant="secondary" icon={<Map className="w-4 h-4 text-purple-400" />}>
                    Roadmap
                  </Button>
                </Link>

                <Button
                  size="lg"
                  glow
                  onClick={() => {
                    sound.click();
                    navigate(`/courses/${lastActiveItem.course.id}/lesson/${lastActiveItem.lesson.id}`);
                  }}
                  icon={<Play className="w-4 h-4 fill-current" />}
                  className="shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  Continue Learning
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Focus: CURRENT QUEST Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card hoverEffect glow="purple" className="p-6 sm:p-8 bg-gradient-to-r from-[#171A38] to-[#10142A] border-purple-500/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold tracking-wider">
                  CURRENT QUEST
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  World 02 // Realm of Prediction
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                {currentQuest.title}
              </h2>

              <p className="text-sm text-slate-300 max-w-xl">
                {currentQuest.description} Next challenge: <span className="text-cyan-300 font-semibold">{currentMission.number}: {currentMission.title}</span>.
              </p>

              {/* Quest Progress Bar */}
              <div className="space-y-1.5 max-w-md">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Quest Completion</span>
                  <span className="text-purple-300 font-bold">{currentQuest.progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentQuest.progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Quest Action Button */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <Link to="/quest/quest-ml-1">
                <Button size="lg" glow variant="purple" icon={<ChevronRight className="w-5 h-5" />} iconPosition="right">
                  VIEW QUEST DETAILS
                </Button>
              </Link>
              <Link to="/mission/m-04">
                <Button size="lg" glow icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  CONTINUE QUEST
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* MY COURSES & RECOMMENDED COURSES SECTION */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span>My Enrolled Courses</span>
            </h3>
            <p className="text-xs text-slate-400">Active learning roadmaps currently in progress</p>
          </div>

          <Link to="/courses" className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>VIEW ALL 9 COURSES</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map((c) => {
            const prog = getCourseProgress(c.id);
            const totalLes = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);

            return (
              <Card
                key={c.id}
                hoverEffect
                className="p-5 border-cyan-500/20 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-cyan-400 font-bold">{c.level}</span>
                    <span className="text-amber-400 font-semibold">{prog.xp} XP</span>
                  </div>
                  <h4 className="text-lg font-bold font-display text-white mb-1">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {c.shortDescription}
                  </p>

                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-cyan-300 font-bold">{prog.progressPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="h-full bg-cyan-400 rounded-full" 
                        style={{ width: `${prog.progressPercentage}%` }} 
                      />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {prog.completedLessons.length} / {totalLes} Lessons Complete
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <Link to={`/courses/${c.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Overview
                    </Button>
                  </Link>
                  <Link to={`/courses/${c.id}/roadmap`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      Roadmap
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* RECOMMENDED COURSES */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Recommended Courses for You</span>
            </h3>
            <p className="text-xs text-slate-400">Hand-picked paths based on your level and specializations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedCourses.map((c) => (
            <Card
              key={c.id}
              hoverEffect
              className="p-5 border-purple-500/20 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                    {c.level}
                  </span>
                  <span className="text-slate-400">{c.estimatedHours} Hours</span>
                </div>
                <h4 className="text-base font-bold font-display text-white mb-1">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {c.shortDescription}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-purple-300">{c.modules.length} Modules</span>
                <Link to={`/courses/${c.id}`}>
                  <Button variant="ghost" size="sm" className="text-cyan-300 hover:text-white" icon={<ChevronRight className="w-3.5 h-3.5" />} iconPosition="right">
                    Explore
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* RECENTLY COMPLETED SECTION */}
      <div className="space-y-4 pt-2">
        <div>
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Recently Completed Modules</span>
          </h3>
          <p className="text-xs text-slate-400">Milestones achieved along your neural mastery expedition</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">Python for AI</span>
              <h4 className="text-sm font-bold text-white font-display">Python Foundations</h4>
              <p className="text-xs text-slate-400 mt-0.5">Mastered loops, functions & lambdas (+200 XP)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">Machine Learning</span>
              <h4 className="text-sm font-bold text-white font-display">ML Foundations & Paradigms</h4>
              <p className="text-xs text-slate-400 mt-0.5">Mastered supervised, unsupervised & cost functions (+200 XP)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase">Specialization Badge</span>
              <h4 className="text-sm font-bold text-white font-display">Algorithm Scout</h4>
              <p className="text-xs text-slate-400 mt-0.5">Completed 5 interactive algorithmic challenges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Interactive Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {/* Card 1: AI Mentor Live Portal */}
        <Card hoverEffect glow="cyan" className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ONLINE
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-1">
              AI Mentor Hotline
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Consult with your mentor ({user.mentor}). Ask for code hints, intuitive analogies, or deep mathematical formalisms on any ML concept.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 text-xs text-slate-300 italic font-sans">
              "Ready to conquer binary classification? Ask me how the sigmoid function prevents gradient explosion."
            </div>
          </div>

          <Link to="/tutor" className="pt-2">
            <Button variant="secondary" className="w-full text-cyan-300" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
              OPEN AI MENTOR CHAT
            </Button>
          </Link>
        </Card>

        {/* Card 2: Boss Arena Callout */}
        <Card hoverEffect glow="pink" className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
                <Swords className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                RAID GATE OPEN
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-1">
              Overfitting Titan Arena
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Test your knowledge under fire. Answer 5 progressive tactical questions to drain the Titan's HP shield and claim the "ML Apprentice" badge.
            </p>

            <div className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded-xl bg-slate-950/70 border border-white/5">
              <span className="text-slate-400">Raid Reward:</span>
              <span className="text-cyan-400 font-bold">+500 XP + Rare Badge</span>
            </div>
          </div>

          <Link to="/boss/boss-ml" className="pt-2">
            <Button variant="danger" className="w-full" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
              ENTER BOSS RAID
            </Button>
          </Link>
        </Card>

        {/* Card 3: Teach It Back (Feynman Technique) */}
        <Card hoverEffect glow="green" className="p-6 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SYNAPSE RETENTION
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-1">
              Teach It Back (Feynman)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              The ultimate test of intelligence: explain gradient descent as if teaching a peer. Our AI evaluates clarity, accuracy, and completeness.
            </p>

            <div className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded-xl bg-slate-950/70 border border-white/5">
              <span className="text-slate-400">Evaluation Score Target:</span>
              <span className="text-emerald-400 font-bold">90%+ for Concept Master</span>
            </div>
          </div>

          <Link to="/knowledge-transfer" className="pt-2">
            <Button variant="secondary" className="w-full text-emerald-300" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
              SUBMIT EXPLANATION
            </Button>
          </Link>
        </Card>
      </div>

      {/* World Map Teaser Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold font-display text-white">
              AI Learning Worlds
            </h3>
            <p className="text-xs text-slate-400">
              6 interconnected realms spanning basic heuristics to foundation LLMs.
            </p>
          </div>

          <Link to="/quest-map" className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>VIEW COMPLETE MAP</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORLDS.slice(0, 3).map((world) => {
            const isUnlocked = user.level >= world.requiredLevel;
            return (
              <Card
                key={world.id}
                hoverEffect
                onClick={() => navigate('/quest-map')}
                className={`cursor-pointer p-4 transition-all ${
                  isUnlocked ? 'border-cyan-500/20 hover:border-cyan-500/40' : 'opacity-60 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-cyan-400 font-bold">WORLD 0{world.worldNumber}</span>
                  <span className="text-slate-400">+{world.totalXp} XP</span>
                </div>
                <h4 className="text-base font-bold font-display text-white mb-1">
                  {world.name}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                  {world.description}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5">
                  <span className="text-purple-300">{world.quests.length} Quest Chains</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <span>EXPLORE</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
