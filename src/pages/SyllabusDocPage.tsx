import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Map, 
  CheckCircle2, 
  Circle, 
  Bookmark as BookmarkIcon, 
  BookmarkCheck, 
  Clock, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  Copy, 
  Check, 
  Play, 
  ExternalLink, 
  Code2, 
  ListTree, 
  Layers, 
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useCourses } from '../context/CourseContext';
import { getCourseById } from '../data/courses';
import { CourseLesson, CourseModule } from '../data/courses/types';
import { sound } from '../utils/audio';

export const SyllabusDocPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCourseProgress, isBookmarked, toggleBookmark } = useCourses();

  const course = getCourseById(courseId || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Compute lesson lookup
  const allLessonsWithModule: { lesson: CourseLesson; module: CourseModule }[] = [];
  if (course) {
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        allLessonsWithModule.push({ lesson: les, module: mod });
      }
    }
  }

  // Active lesson determination
  const progress = course ? getCourseProgress(course.id) : null;
  const initialLessonId = searchParams.get('lesson') || allLessonsWithModule[0]?.lesson.id || '';
  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);

  useEffect(() => {
    const paramLesson = searchParams.get('lesson');
    if (paramLesson && paramLesson !== activeLessonId) {
      setActiveLessonId(paramLesson);
    }
  }, [searchParams]);

  if (!course || allLessonsWithModule.length === 0) {
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

  const currentItemIndex = allLessonsWithModule.findIndex((item) => item.lesson.id === activeLessonId);
  const currentItem = currentItemIndex !== -1 ? allLessonsWithModule[currentItemIndex] : allLessonsWithModule[0];
  const { lesson, module } = currentItem;

  const prevItem = currentItemIndex > 0 ? allLessonsWithModule[currentItemIndex - 1] : null;
  const nextItem = currentItemIndex < allLessonsWithModule.length - 1 ? allLessonsWithModule[currentItemIndex + 1] : null;

  const isCompleted = progress?.completedLessons.includes(lesson.id) || false;
  const bookmarked = isBookmarked(lesson.id);

  // Module completed count
  const moduleLessons = module.lessons;
  const moduleCompletedCount = moduleLessons.filter((l) => progress?.completedLessons.includes(l.id)).length;
  const moduleProgressPercent = Math.round((moduleCompletedCount / moduleLessons.length) * 100);

  const handleSelectLesson = (lessonId: string) => {
    sound.click();
    setActiveLessonId(lessonId);
    setSearchParams({ lesson: lessonId });
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    sound.click();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleBookmarkToggle = () => {
    sound.click();
    toggleBookmark({
      courseId: course.id,
      courseTitle: course.title,
      moduleId: module.id,
      moduleTitle: module.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Mobile Menu Toggle */}
      <div className="flex items-center justify-between py-3 mb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 overflow-hidden">
          <Link to={`/courses/${course.id}`} className="hover:text-cyan-400 transition-colors flex items-center gap-1 shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OVERVIEW</span>
          </Link>
          <span>/</span>
          <Link to={`/courses/${course.id}/roadmap`} className="hover:text-cyan-400 transition-colors shrink-0">
            ROADMAP
          </Link>
          <span>/</span>
          <span className="text-cyan-300 font-semibold truncate">
            DOC: {lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Table of Contents button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span>Curriculum</span>
          </button>

          <Link to={`/courses/${course.id}/lesson/${lesson.id}`}>
            <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5 fill-current" />}>
              Interactive Mode
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: Course Contents, Modules, Lessons (Collapsible on Mobile) */}
        <aside className={`
          lg:col-span-3 bg-[#0B0F22]/90 lg:bg-[#0B0F22]/60 border border-white/[0.08] rounded-2xl p-4 backdrop-blur-2xl
          ${mobileMenuOpen ? 'fixed inset-x-4 top-20 z-50 max-h-[80vh] overflow-y-auto shadow-2xl' : 'hidden lg:block'}
        `}>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ListTree className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                Syllabus Modules
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              {allLessonsWithModule.length} Topics
            </span>
          </div>

          <div className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 text-xs">
            {course.modules.map((mod) => (
              <div key={mod.id} className="space-y-1.5">
                <div className="px-2 py-1 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Mod 0{mod.moduleNumber}: {mod.title}</span>
                </div>

                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isActive = les.id === activeLessonId;
                    const isDone = progress?.completedLessons.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        onClick={() => handleSelectLesson(les.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-cyan-300 font-semibold border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                            : isDone
                            ? 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className={`w-3 h-3 shrink-0 ${isActive ? 'text-cyan-400 fill-cyan-400/30' : 'text-slate-600'}`} />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {les.estimatedMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT: Topic title, Explanation, Concepts, Examples, Key Points, Code, Practice, Mission */}
        <main className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl bg-[#0D122B]/85 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-8">
            {/* Header / Meta */}
            <div className="space-y-3 pb-6 border-b border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Module {module.moduleNumber}: {module.title}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmarkToggle}
                    className={`p-2 rounded-xl border transition-all ${
                      bookmarked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/10'
                    }`}
                    title={bookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
                  >
                    {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
                  </button>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
                {lesson.title}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                {lesson.description}
              </p>
            </div>

            {/* 1. Learning Objective */}
            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Primary Learning Objective</span>
              </div>
              <p className="text-xs text-cyan-100 leading-relaxed">
                {lesson.learningObjective}
              </p>
            </div>

            {/* 2. Concept Explanation */}
            <section id="explanation" className="space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Concept Explanation
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-white/[0.01] p-4 rounded-2xl border border-white/[0.04]">
                {lesson.explanation}
              </div>
            </section>

            {/* 3. Important Concepts */}
            <section id="concepts" className="space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Important Concepts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.importantConcepts.map((concept, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-xs text-slate-200 leading-relaxed">{concept}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Code Example (if applicable) */}
            {lesson.codeExample && (
              <section id="code" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-cyan-400" />
                    Code Syntax & Implementation
                  </h2>
                  <button
                    onClick={() => handleCopyCode(lesson.codeExample!.code)}
                    className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#070914] shadow-2xl font-mono">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-cyan-300 uppercase tracking-widest text-[10px]">
                      {lesson.codeExample.language}
                    </span>
                    <span className="text-[10px]">Executable Architecture</span>
                  </div>
                  <pre className="p-4 text-xs text-cyan-100 overflow-x-auto leading-relaxed">
                    <code>{lesson.codeExample.code}</code>
                  </pre>
                  {lesson.codeExample.output && (
                    <div className="p-3 bg-black/60 border-t border-white/10 text-xs font-mono">
                      <span className="text-slate-500 text-[10px] block uppercase">Standard Output:</span>
                      <span className="text-emerald-400">{lesson.codeExample.output}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  {lesson.codeExample.explanation}
                </p>
              </section>
            )}

            {/* 5. Practical Example */}
            <section id="practical" className="space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Practical Industry Example
              </h2>
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <h3 className="text-sm font-bold text-emerald-300 font-display">
                  {lesson.practicalExample.title}
                </h3>
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Scenario: </strong>
                  {lesson.practicalExample.scenario}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-emerald-500/20">
                  <strong className="text-emerald-400">Solution Blueprint: </strong>
                  {lesson.practicalExample.solution}
                </div>
              </div>
            </section>

            {/* 6. Key Points Summary */}
            <section id="key-points" className="space-y-3">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Key Points Summary
              </h2>
              <ul className="space-y-2">
                {lesson.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. Practice Section & Related Mission */}
            <section id="practice" className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm font-display">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Hands-on Mission & Practice</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">+{lesson.xpReward} XP</span>
              </div>

              <div className="text-xs text-slate-300">
                <strong className="text-white block mb-1">Challenge Prompt:</strong>
                {lesson.practiceChallenge.prompt}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link to={`/courses/${course.id}/lesson/${lesson.id}`}>
                  <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5 fill-current" />}>
                    Open Interactive Quiz & Challenge
                  </Button>
                </Link>

                {lesson.relatedMissionId && (
                  <Link to={`/mission/${lesson.relatedMissionId}`}>
                    <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Go to Associated Quest Mission
                    </Button>
                  </Link>
                )}
              </div>
            </section>

            {/* Bottom Prev / Next Topic Navigation */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              {prevItem ? (
                <button
                  onClick={() => handleSelectLesson(prevItem.lesson.id)}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition-all text-xs max-w-[45%]"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Previous Topic</span>
                    <span className="font-semibold text-slate-200 truncate block">{prevItem.lesson.title}</span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextItem ? (
                <button
                  onClick={() => handleSelectLesson(nextItem.lesson.id)}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-right transition-all text-xs max-w-[45%] ml-auto"
                >
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-cyan-400 block uppercase">Next Topic</span>
                    <span className="font-semibold text-white truncate block">{nextItem.lesson.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: Course progress, Module progress, XP, Reading time, Table of Contents */}
        <aside className="lg:col-span-3 space-y-5 hidden lg:block sticky top-20">
          {/* Progress Card */}
          <div className="rounded-2xl bg-[#0B0F22]/80 border border-white/[0.08] p-5 backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/10">
              <span>METRICS HUD</span>
              <span className="text-cyan-400 font-bold">STATUS ACTIVE</span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Course Progress</span>
                  <span className="text-cyan-400 font-bold">{progress?.progressPercentage || 0}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-cyan-400" 
                    style={{ width: `${progress?.progressPercentage || 0}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Module Progress</span>
                  <span className="text-purple-400 font-bold">{moduleProgressPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-purple-400" 
                    style={{ width: `${moduleProgressPercent}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center font-mono">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] text-slate-400">READ TIME</div>
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{lesson.estimatedMinutes} min</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] text-slate-400">TOPIC REWARD</div>
                <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>+{lesson.xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="rounded-2xl bg-[#0B0F22]/80 border border-white/[0.08] p-5 backdrop-blur-2xl space-y-3">
            <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              On This Page
            </div>
            <nav className="space-y-2 text-xs text-slate-400">
              <a href="#explanation" className="block hover:text-cyan-300 transition-colors">
                • Concept Explanation
              </a>
              <a href="#concepts" className="block hover:text-cyan-300 transition-colors">
                • Important Concepts
              </a>
              {lesson.codeExample && (
                <a href="#code" className="block hover:text-cyan-300 transition-colors">
                  • Code Syntax & Example
                </a>
              )}
              <a href="#practical" className="block hover:text-cyan-300 transition-colors">
                • Practical Scenario
              </a>
              <a href="#key-points" className="block hover:text-cyan-300 transition-colors">
                • Key Points Summary
              </a>
              <a href="#practice" className="block hover:text-cyan-300 transition-colors">
                • Hands-on Mission
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};
