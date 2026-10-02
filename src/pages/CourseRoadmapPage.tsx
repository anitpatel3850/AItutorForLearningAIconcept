import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Map, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Award, 
  Swords, 
  Sparkles, 
  Trophy, 
  Clock, 
  Layers, 
  ChevronDown, 
  ChevronRight,
  Flame,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useCourses } from '../context/CourseContext';
import { getCourseById } from '../data/courses';
import { sound } from '../utils/audio';

type NodeStatus = 'COMPLETED' | 'IN_PROGRESS' | 'AVAILABLE' | 'LOCKED';

export const CourseRoadmapPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getCourseProgress } = useCourses();

  const course = getCourseById(courseId || '');

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white font-display">Course Not Found</h2>
        <Link to="/courses">
          <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  // Helper to determine node status
  const getModuleStatus = (index: number): { status: NodeStatus; completedLessonsCount: number; percentage: number } => {
    const mod = course.modules[index];
    const completedCount = mod.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    const percentage = mod.lessons.length > 0 ? Math.round((completedCount / mod.lessons.length) * 100) : 0;

    if (percentage === 100) {
      return { status: 'COMPLETED', completedLessonsCount: completedCount, percentage };
    }

    if (completedCount > 0) {
      return { status: 'IN_PROGRESS', completedLessonsCount: completedCount, percentage };
    }

    // If it's the first module, it's available
    if (index === 0) {
      return { status: 'AVAILABLE', completedLessonsCount: 0, percentage: 0 };
    }

    // Previous module is completed -> available
    const prevMod = course.modules[index - 1];
    const prevCompletedCount = prevMod.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    if (prevCompletedCount === prevMod.lessons.length && prevMod.lessons.length > 0) {
      return { status: 'AVAILABLE', completedLessonsCount: 0, percentage: 0 };
    }

    // Otherwise locked
    return { status: 'LOCKED', completedLessonsCount: 0, percentage: 0 };
  };

  const completedModulesCount = course.modules.filter((_, idx) => getModuleStatus(idx).status === 'COMPLETED').length;
  const isAllModulesComplete = completedModulesCount === course.modules.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to={`/courses/${course.id}`} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>COURSE OVERVIEW</span>
          </Link>
          <span>/</span>
          <span className="text-cyan-300 font-semibold">ROADMAP MAPPER</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/courses/${course.id}/syllabus`}>
            <Button variant="ghost" size="sm" icon={<BookOpen className="w-4 h-4 text-cyan-400" />}>
              Syllabus Doc
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#101633] via-[#0E122A] to-[#1F1338] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Map className="w-3.5 h-3.5 text-cyan-400" />
              <span>TACTICAL EXPEDITION // INTERACTIVE ROADMAP</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
              {course.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Roadmap</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Follow the connected neural pathway. Complete lessons to charge each node, unlock subsequent specialized doctrines, and conquer the final course boss.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center font-mono min-w-[90px]">
              <div className="text-xl font-black text-cyan-400">{completedModulesCount}/{course.modules.length}</div>
              <div className="text-[10px] text-slate-400 uppercase">Modules</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center font-mono min-w-[90px]">
              <div className="text-xl font-black text-purple-400">{progress.progressPercentage}%</div>
              <div className="text-[10px] text-slate-400 uppercase">Mastery</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center font-mono min-w-[90px]">
              <div className="text-xl font-black text-amber-400">{progress.xp}</div>
              <div className="text-[10px] text-slate-400 uppercase">XP Gained</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Progression Tree */}
      <div className="relative py-8">
        {/* Background Vertical Guide Track */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-500/40 via-purple-500/30 to-emerald-500/40 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.2)]" />

        <div className="space-y-12 relative z-10">
          {/* 1. START NODE */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black font-display text-xs border-4 border-[#070913] shadow-[0_0_25px_rgba(0,240,255,0.6)] animate-pulse">
              START
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold mt-2">
              INITIATION GATE
            </div>
          </div>

          {/* 2. MODULE NODES */}
          {course.modules.map((mod, index) => {
            const { status, completedLessonsCount, percentage } = getModuleStatus(index);
            const isLeft = index % 2 === 0;

            const nextLesson = mod.lessons.find((l) => !progress.completedLessons.includes(l.id)) || mod.lessons[0];

            return (
              <div 
                key={mod.id}
                className="relative flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                {/* Node Center Badge On Center Spine */}
                <div className="absolute left-6 sm:left-1/2 top-6 -translate-x-1/2 z-20">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-sm border-2 transition-all duration-300 shadow-xl ${
                    status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                      : status === 'IN_PROGRESS'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.5)] animate-bounce'
                      : status === 'AVAILABLE'
                      ? 'bg-slate-900 text-slate-200 border-white/40 shadow-md'
                      : 'bg-slate-950 text-slate-600 border-white/10'
                  }`}>
                    {status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : status === 'LOCKED' ? (
                      <Lock className="w-5 h-5 text-slate-600" />
                    ) : (
                      `0${mod.moduleNumber}`
                    )}
                  </div>
                </div>

                {/* Module Card - Alternates Left / Right on Desktop */}
                <div className={`w-full sm:w-[calc(50%-3rem)] pl-16 sm:pl-0 ${
                  isLeft ? 'sm:mr-auto sm:text-right' : 'sm:ml-auto sm:text-left'
                }`}>
                  <div className={`rounded-3xl p-5 sm:p-6 border backdrop-blur-2xl transition-all duration-300 relative group overflow-hidden ${
                    status === 'COMPLETED'
                      ? 'bg-[#0B1525]/90 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                      : status === 'IN_PROGRESS'
                      ? 'bg-[#0F1738]/90 border-cyan-500/50 shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                      : status === 'AVAILABLE'
                      ? 'bg-[#0C1022]/85 border-white/20 hover:border-cyan-500/40 shadow-lg'
                      : 'bg-[#080B17]/60 border-white/[0.05] opacity-65'
                  }`}>
                    {/* Top Status Tag */}
                    <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'sm:justify-end' : 'sm:justify-start'}`}>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md border ${
                        status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : status === 'IN_PROGRESS'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : status === 'AVAILABLE'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        {status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {mod.difficulty}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-lg sm:text-xl font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {mod.description}
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-white/10 text-left font-mono">
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="text-[10px] text-slate-400">LESSONS</div>
                        <div className="text-xs font-bold text-white">{completedLessonsCount}/{mod.lessons.length}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="text-[10px] text-slate-400">TIME</div>
                        <div className="text-xs font-bold text-slate-200">{mod.estimatedMinutes}m</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="text-[10px] text-slate-400">REWARD</div>
                        <div className="text-xs font-bold text-amber-300">+{mod.xpReward} XP</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Node Charge</span>
                        <span className={`font-bold ${status === 'COMPLETED' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            status === 'COMPLETED' 
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                              : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className={`flex items-center gap-2 ${isLeft ? 'sm:justify-end' : 'sm:justify-start'}`}>
                      {status === 'LOCKED' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-500 text-xs font-mono border border-white/5 cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Complete Module 0{index} to Unlock</span>
                        </div>
                      ) : (
                        <Button
                          variant={status === 'COMPLETED' ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => {
                            sound.click();
                            navigate(`/courses/${course.id}/lesson/${nextLesson?.id || ''}`);
                          }}
                          icon={<Play className="w-3.5 h-3.5 fill-current" />}
                        >
                          {status === 'COMPLETED' ? 'Review Module' : status === 'IN_PROGRESS' ? 'Resume Quest' : 'Enter Module'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 3. CAPSTONE PROJECT NODE */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute left-6 sm:left-1/2 top-6 -translate-x-1/2 z-20">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-sm border-2 transition-all duration-300 shadow-xl ${
                isAllModulesComplete
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                  : 'bg-slate-950 text-slate-600 border-white/10'
              }`}>
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
            </div>

            <div className="w-full sm:w-[calc(50%-3rem)] pl-16 sm:pl-0 sm:ml-auto sm:text-left">
              <div className="rounded-3xl p-5 sm:p-6 bg-[#120E2E]/80 border border-purple-500/30 backdrop-blur-2xl">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Capstone Project
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-2">
                  {course.title} Applied Capstone
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Synthesize all modules into a production-grade AI portfolio project with unit tests and benchmark reports.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-amber-300">+350 XP</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!isAllModulesComplete}
                    onClick={() => {
                      sound.click();
                      navigate(`/courses/${course.id}/syllabus`);
                    }}
                  >
                    {isAllModulesComplete ? 'View Project Spec' : 'Locked'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. BOSS BATTLE NODE */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute left-6 sm:left-1/2 top-6 -translate-x-1/2 z-20">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-sm border-2 transition-all duration-300 shadow-xl ${
                isAllModulesComplete
                  ? 'bg-red-500/20 text-red-300 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-slate-950 text-slate-600 border-white/10'
              }`}>
                <Swords className="w-5 h-5 text-red-400" />
              </div>
            </div>

            <div className="w-full sm:w-[calc(50%-3rem)] pl-16 sm:pl-0 sm:mr-auto sm:text-right">
              <div className="rounded-3xl p-5 sm:p-6 bg-[#210D18]/80 border border-red-500/30 backdrop-blur-2xl">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                  Raid Boss Battle
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-2">
                  Specialization Raid Sovereign
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Face the ultimate guardian in the arena. Defeat the boss using timed answers and algorithmic countermeasures.
                </p>
                <div className="mt-4 flex items-center justify-end gap-3">
                  <span className="text-xs font-mono font-bold text-amber-300">+500 XP</span>
                  <Link to="/boss/boss-ml">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-gradient-to-r from-red-600 to-pink-600 border-none shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    >
                      Enter Boss Arena
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 5. COURSE COMPLETE NODE */}
          <div className="flex flex-col items-center pt-4">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-display font-black text-sm border-4 transition-all duration-500 ${
              isAllModulesComplete
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-600 text-slate-950 border-white shadow-[0_0_35px_rgba(251,191,36,0.8)]'
                : 'bg-slate-950 text-slate-600 border-white/10 shadow-lg'
            }`}>
              <Trophy className="w-8 h-8" />
            </div>
            <div className="text-center mt-3 space-y-1">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                COURSE COMPLETE
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                {isAllModulesComplete 
                  ? 'Congratulations! You have completed all roadmap nodes and earned the Master Spec badge!'
                  : 'Clear all modules, project requirements, and boss battle to claim the course trophy.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
