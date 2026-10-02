import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Play, 
  HelpCircle, 
  Code2, 
  Sparkles, 
  Award, 
  BookOpen, 
  Target, 
  Clock, 
  Check, 
  Copy, 
  ChevronRight, 
  Bookmark as BookmarkIcon, 
  BookmarkCheck, 
  ExternalLink,
  Flame,
  Lightbulb,
  Eye,
  CheckCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useCourses } from '../context/CourseContext';
import { getCourseById, getLessonById } from '../data/courses';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

export const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { 
    getCourseProgress, 
    completeLesson, 
    completeQuiz, 
    isBookmarked, 
    toggleBookmark 
  } = useCourses();

  const course = getCourseById(courseId || '');
  const lessonData = getLessonById(courseId || '', lessonId || '');

  // Quiz interactive state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showChallengeHint, setShowChallengeHint] = useState(false);
  const [showChallengeSolution, setShowChallengeSolution] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [lessonFinishedModal, setLessonFinishedModal] = useState(false);

  if (!course || !lessonData) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white font-display">Lesson Not Found</h2>
        <p className="text-slate-400 text-sm">Could not find lesson specification {lessonId}.</p>
        <Link to="/courses">
          <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const { lesson, module } = lessonData;
  const progress = getCourseProgress(course.id);
  const isLessonCompleted = progress.completedLessons.includes(lesson.id);
  const bookmarked = isBookmarked(lesson.id);

  // Find next lesson
  let nextLessonInCourse: { lessonId: string; title: string } | null = null;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
    nextLessonInCourse = {
      lessonId: allLessons[currentIndex + 1].id,
      title: allLessons[currentIndex + 1].title
    };
  }

  // Quiz submission handler
  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === lesson.quiz.correctIndex) {
      sound.success();
      completeQuiz(course.id, lesson.id, 30);
    } else {
      sound.error();
    }
  };

  // Lesson complete handler
  const handleCompleteLesson = () => {
    sound.levelUp();
    triggerConfetti();
    const result = completeLesson(course.id, module.id, lesson.id, lesson.xpReward);
    setLessonFinishedModal(true);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    sound.click();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 overflow-hidden">
          <Link to={`/courses/${course.id}`} className="hover:text-cyan-400 transition-colors flex items-center gap-1 shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{course.title.toUpperCase()}</span>
          </Link>
          <span>/</span>
          <span className="text-slate-500 shrink-0">MOD 0{module.moduleNumber}</span>
          <span>/</span>
          <span className="text-cyan-300 font-semibold truncate">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.click();
              toggleBookmark({
                courseId: course.id,
                courseTitle: course.title,
                moduleId: module.id,
                moduleTitle: module.title,
                lessonId: lesson.id,
                lessonTitle: lesson.title
              });
            }}
            className={`p-2 rounded-xl border transition-all ${
              bookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/10'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
          </button>

          <Link to={`/courses/${course.id}/syllabus?lesson=${lesson.id}`}>
            <Button variant="ghost" size="sm" icon={<BookOpen className="w-4 h-4 text-cyan-400" />}>
              Documentation
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Lesson Card Container */}
      <div className="rounded-3xl bg-[#0C1126]/90 border border-white/[0.08] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-10 relative overflow-hidden">
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                Module {module.moduleNumber}: {module.title}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lesson.estimatedMinutes} min
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                +{lesson.xpReward} XP
              </span>
              {isLessonCompleted && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
            {lesson.title}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* 1. Learning Objective */}
        <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2 shadow-[0_0_15px_rgba(0,240,255,0.08)]">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>1. Learning Objective</span>
          </div>
          <p className="text-sm text-cyan-100 font-medium leading-relaxed">
            {lesson.learningObjective}
          </p>
        </div>

        {/* 2. Concept Explanation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            <h2>2. Concept Explanation</h2>
          </div>
          <div className="text-sm sm:text-base text-slate-300 leading-relaxed bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05] whitespace-pre-line">
            {lesson.explanation}
          </div>
        </section>

        {/* 3. Example / Syntax Code */}
        {lesson.codeExample && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                <Code2 className="w-5 h-5 text-purple-400" />
                <h2>3. Code Example & Implementation</h2>
              </div>
              <button
                onClick={() => handleCopyCode(lesson.codeExample!.code)}
                className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#060913] shadow-2xl font-mono">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-cyan-400 uppercase tracking-widest text-[11px]">
                  {lesson.codeExample.language}
                </span>
                <span className="text-[10px] text-slate-500">Interactive Snippet</span>
              </div>
              <pre className="p-5 text-xs sm:text-sm text-cyan-100 overflow-x-auto leading-relaxed">
                <code>{lesson.codeExample.code}</code>
              </pre>
              {lesson.codeExample.output && (
                <div className="p-4 bg-black/70 border-t border-white/10 text-xs font-mono">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-widest">
                    Standard Output / Result:
                  </span>
                  <span className="text-emerald-400 font-bold block mt-1">{lesson.codeExample.output}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 italic">
              {lesson.codeExample.explanation}
            </p>
          </section>
        )}

        {/* 4. Important Points */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <h2>4. Important Points & Best Practices</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.keyPoints.map((point, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Practical Example */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <h2>5. Practical Real-World Scenario</h2>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-[#0C1523] to-[#0A101D] border border-emerald-500/30 space-y-3">
            <h3 className="text-base font-bold text-emerald-300 font-display">
              {lesson.practicalExample.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-slate-100">Industry Context: </strong>
              {lesson.practicalExample.scenario}
            </p>
            <div className="pt-3 border-t border-emerald-500/20 text-xs sm:text-sm text-emerald-100 leading-relaxed">
              <strong className="text-emerald-400">Engineering Solution: </strong>
              {lesson.practicalExample.solution}
            </div>
          </div>
        </section>

        {/* 6. Mini Quiz (Interactive with XP!) */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <h2>6. Concept Check Mini Quiz</h2>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">+30 XP</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#090D1E] border border-cyan-500/30 space-y-5">
            <div className="text-sm font-semibold text-white">
              {lesson.quiz.question}
            </div>

            <div className="space-y-2.5">
              {lesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === lesson.quiz.correctIndex;

                let buttonStyle = 'bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06] hover:border-cyan-500/30';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-semibold';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-semibold';
                  } else {
                    buttonStyle = 'opacity-50 border-white/5';
                  }
                } else if (isSelected) {
                  buttonStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => {
                      sound.click();
                      setSelectedOption(idx);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs sm:text-sm text-left border transition-all ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {!isAnswerSubmitted ? (
              <Button
                variant="primary"
                size="sm"
                disabled={selectedOption === null}
                onClick={handleQuizSubmit}
                className="mt-2"
              >
                Submit Answer
              </Button>
            ) : (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                <span className={`font-bold block ${selectedOption === lesson.quiz.correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedOption === lesson.quiz.correctIndex ? '✓ Correct! +30 XP Awarded' : '✗ Incorrect choice'}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {lesson.quiz.explanation}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 7. Practice Challenge */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2>7. Practice Challenge</h2>
          </div>
          <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/20 space-y-4">
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {lesson.practiceChallenge.prompt}
            </div>

            {lesson.practiceChallenge.starterCode && (
              <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-purple-200 border border-purple-500/20">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Starter Template:</span>
                <code>{lesson.practiceChallenge.starterCode}</code>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChallengeHint(!showChallengeHint)}
                icon={<Lightbulb className="w-4 h-4 text-amber-400" />}
                className="border border-white/10"
              >
                {showChallengeHint ? 'Hide Hint' : 'Show Solution Hint'}
              </Button>

              {lesson.practiceChallenge.solutionCode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChallengeSolution(!showChallengeSolution)}
                  icon={<Eye className="w-4 h-4 text-cyan-400" />}
                  className="border border-white/10"
                >
                  {showChallengeSolution ? 'Hide Solution' : 'Reveal Solution Code'}
                </Button>
              )}
            </div>

            {showChallengeHint && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 animate-in fade-in">
                <strong>Hint: </strong>{lesson.practiceChallenge.solutionHint}
              </div>
            )}

            {showChallengeSolution && lesson.practiceChallenge.solutionCode && (
              <div className="p-4 rounded-xl bg-[#070914] border border-cyan-500/30 font-mono text-xs text-cyan-200 animate-in fade-in">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">Target Solution:</span>
                <pre className="overflow-x-auto">
                  <code>{lesson.practiceChallenge.solutionCode}</code>
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* 8. Related Mission (if any) */}
        {lesson.relatedMissionId && (
          <section className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-purple-600/15 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                8. Related Gamified Quest Mission
              </span>
              <h4 className="text-sm font-bold text-white font-display">
                Apply this knowledge in the live Quest Arena!
              </h4>
              <p className="text-xs text-slate-300">
                Complete the dedicated interactive sandbox mission to test your skills under simulation conditions.
              </p>
            </div>
            <Link to={`/mission/${lesson.relatedMissionId}`}>
              <Button variant="primary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                Launch Mission
              </Button>
            </Link>
          </section>
        )}

        {/* 9. Mark As Completed Action Button */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono text-center sm:text-left">
            <span>Progress automatically synced to local quest log.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant={isLessonCompleted ? "secondary" : "primary"}
              onClick={handleCompleteLesson}
              icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}
              className={`w-full sm:w-auto ${!isLessonCompleted ? 'shadow-[0_0_20px_rgba(0,240,255,0.4)]' : ''}`}
            >
              {isLessonCompleted ? "Marked as Completed" : "Mark as Completed (+20 XP)"}
            </Button>

            {nextLessonInCourse && (
              <Button
                variant="primary"
                onClick={() => {
                  sound.click();
                  navigate(`/courses/${course.id}/lesson/${nextLessonInCourse!.lessonId}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                icon={<ChevronRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Next Lesson
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal / Celebration Overlay */}
      <AnimatePresence>
        {lessonFinishedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full rounded-3xl bg-[#0F142D] border border-cyan-500/40 p-6 sm:p-8 text-center space-y-6 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-3xl mx-auto bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-[0_0_30px_rgba(0,240,255,0.6)]">
                <Award className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  TOPIC MASTERED
                </span>
                <h3 className="text-2xl font-bold font-display text-white">
                  Lesson Completed!
                </h3>
                <p className="text-xs text-slate-300">
                  You successfully acquired the knowledge for <strong className="text-white">{lesson.title}</strong> and earned XP.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-around font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">XP Awarded</div>
                  <div className="text-lg font-bold text-amber-400">+{lesson.xpReward} XP</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Course Mastery</div>
                  <div className="text-lg font-bold text-cyan-400">{progress.progressPercentage}%</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {nextLessonInCourse ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setLessonFinishedModal(false);
                      navigate(`/courses/${course.id}/lesson/${nextLessonInCourse!.lessonId}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    icon={<Play className="w-4 h-4 fill-current" />}
                  >
                    Proceed to Next Lesson
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setLessonFinishedModal(false);
                      navigate(`/courses/${course.id}/roadmap`);
                    }}
                    icon={<Play className="w-4 h-4 fill-current" />}
                  >
                    Return to Roadmap
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={() => setLessonFinishedModal(false)}
                >
                  Stay on this Page
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
