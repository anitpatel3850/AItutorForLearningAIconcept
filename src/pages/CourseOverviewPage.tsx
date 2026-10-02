import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Map, 
  BookOpen, 
  Play, 
  Clock, 
  Layers, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Lock, 
  Unlock,
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Target, 
  Code,
  BrainCircuit,
  Cpu,
  Eye,
  MessageSquare,
  BarChart2,
  Compass,
  GitBranch,
  GraduationCap,
  Swords,
  Check
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useCourses } from '../context/CourseContext';
import { getCourseById } from '../data/courses';
import { sound } from '../utils/audio';

const resolveIcon = (name: string, className = "w-7 h-7") => {
  switch (name) {
    case 'Code': return <Code className={className} />;
    case 'BrainCircuit': return <BrainCircuit className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Eye': return <Eye className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'BarChart2': return <BarChart2 className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'GitBranch': return <GitBranch className={className} />;
    default: return <GraduationCap className={className} />;
  }
};

export const CourseOverviewPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getCourseProgress } = useCourses();

  const course = getCourseById(courseId || '');

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Course Not Found</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          The requested course specification could not be located in the neural registry.
        </p>
        <Link to="/courses">
          <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Course Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalModuleXp = course.modules.reduce((acc, m) => acc + m.xpReward, 0);
  const isStarted = progress.completedLessons.length > 0;
  const isComplete = progress.progressPercentage === 100;

  // Determine next lesson to continue
  const getContinueTarget = () => {
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        if (!progress.completedLessons.includes(les.id)) {
          return { moduleId: mod.id, lessonId: les.id };
        }
      }
    }
    // If all completed or none, return first lesson
    return {
      moduleId: course.modules[0]?.id || '',
      lessonId: course.modules[0]?.lessons[0]?.id || ''
    };
  };

  const nextTarget = getContinueTarget();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/courses" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>COURSES</span>
        </Link>
        <span>/</span>
        <span className="text-cyan-300 font-semibold">{course.title.toUpperCase()}</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#111736] via-[#0D122B] to-[#1A1230] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.12)] relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {course.badge}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-mono">
              {course.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
              course.level === 'Beginner'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : course.level === 'Intermediate'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {course.level} Level
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                {resolveIcon(course.iconName, "w-8 h-8")}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white">
                  {course.title}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono">Duration</div>
                <div className="text-base font-bold text-white font-mono">{course.estimatedHours} Hours</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono">Modules</div>
                <div className="text-base font-bold text-white font-mono">{course.modules.length} Nodes</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono">Lessons</div>
                <div className="text-base font-bold text-white font-mono">{totalLessons} Topics</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono">Rewards</div>
                <div className="text-base font-bold text-amber-300 font-mono">+{totalModuleXp} XP</div>
              </div>
            </div>
          </div>

          {/* Progress & CTAs */}
          <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">SYLLABUS PROGRESS</span>
                <span className="text-cyan-400 font-bold">{progress.progressPercentage}% COMPLETE</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                  style={{ width: `${progress.progressPercentage}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>{progress.completedLessons.length} of {totalLessons} lessons finished</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{progress.xp} XP earned</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isStarted ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    sound.click();
                    navigate(`/courses/${course.id}/lesson/${nextTarget.lessonId}`);
                  }}
                  icon={<Play className="w-4 h-4 fill-current" />}
                  className="shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  Continue Learning
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    sound.click();
                    navigate(`/courses/${course.id}/lesson/${nextTarget.lessonId}`);
                  }}
                  icon={<Play className="w-4 h-4 fill-current" />}
                  className="shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  Start Course
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={() => {
                  sound.click();
                  navigate(`/courses/${course.id}/roadmap`);
                }}
                icon={<Map className="w-4 h-4 text-purple-400" />}
              >
                Roadmap
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  sound.click();
                  navigate(`/courses/${course.id}/syllabus`);
                }}
                icon={<BookOpen className="w-4 h-4 text-cyan-400" />}
                className="border border-white/10"
              >
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Required Information Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. What You Will Learn */}
        <Card variant="glass" className="p-6 border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-300">
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-display text-white">What You Will Learn</h2>
          </div>
          <ul className="space-y-2.5">
            {course.whatYouWillLearn.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* 2. Skills You Will Gain */}
        <Card variant="glass" className="p-6 border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-purple-300">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold font-display text-white">Skills You Will Gain</h2>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {course.skillsYouWillGain.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-mono font-medium shadow-[0_0_10px_rgba(168,85,247,0.1)]"
              >
                +{skill}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            Mastering these core proficiencies unlocks advanced AI quest chains and prepares you for real-world production engineering challenges.
          </p>
        </Card>

        {/* 3. Prerequisites */}
        <Card variant="glass" className="p-6 border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-300">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-display text-white">Prerequisites</h2>
          </div>
          <ul className="space-y-2.5">
            {course.prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  !
                </span>
                <span>{prereq}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* 4. Course Completion Requirements */}
        <Card variant="glass" className="p-6 border-white/10 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-300">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold font-display text-white">Course Completion Requirements</h2>
          </div>
          <ul className="space-y-2.5">
            {course.completionRequirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ★
                </span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Curriculum Modules Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-white">Curriculum Modules</h2>
            <p className="text-xs text-slate-400">Step-by-step sequential syllabus architecture</p>
          </div>
          <Link to={`/courses/${course.id}/roadmap`}>
            <Button variant="ghost" size="sm" icon={<Map className="w-4 h-4 text-cyan-400" />}>
              Open Visual Map
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {course.modules.map((mod, index) => {
            const completedInModule = mod.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
            const isModComplete = completedInModule === mod.lessons.length && mod.lessons.length > 0;
            const isModInProgress = completedInModule > 0 && !isModComplete;

            return (
              <div 
                key={mod.id}
                className="rounded-2xl bg-[#0B0F24]/80 border border-white/[0.08] hover:border-cyan-500/30 transition-all p-5 backdrop-blur-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                      isModComplete
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : isModInProgress
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border-white/10'
                    }`}>
                      {isModComplete ? <Check className="w-5 h-5 text-emerald-400" /> : `0${mod.moduleNumber}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                          Module {mod.moduleNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">•</span>
                        <span className="text-[10px] font-mono text-slate-400">{mod.difficulty}</span>
                      </div>
                      <h3 className="text-base font-bold text-white font-display">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-xl mt-0.5">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right font-mono hidden md:block">
                      <div className="text-xs font-bold text-white">
                        {completedInModule} / {mod.lessons.length} Lessons
                      </div>
                      <div className="text-[10px] text-amber-400">
                        +{mod.xpReward} XP
                      </div>
                    </div>

                    <Link to={`/courses/${course.id}/lesson/${mod.lessons[0]?.id || ''}`}>
                      <Button variant="secondary" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
                        {isModComplete ? 'Review' : isModInProgress ? 'Resume' : 'Start'}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Lesson Pills List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-white/[0.05]">
                  {mod.lessons.map((lesson, lIdx) => {
                    const isLessonDone = progress.completedLessons.includes(lesson.id);
                    return (
                      <Link 
                        key={lesson.id}
                        to={`/courses/${course.id}/lesson/${lesson.id}`}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-all ${
                          isLessonDone
                            ? 'bg-emerald-500/5 text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40'
                            : 'bg-white/[0.02] text-slate-300 border-white/[0.05] hover:bg-white/[0.05] hover:border-cyan-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          {isLessonDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0 flex items-center justify-center text-[8px] font-mono text-slate-400">
                              {lIdx + 1}
                            </span>
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {lesson.estimatedMinutes}m
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
