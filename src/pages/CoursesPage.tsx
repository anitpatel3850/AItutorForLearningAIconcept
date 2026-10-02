import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Clock, 
  Layers, 
  FileText, 
  Map, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  GraduationCap,
  Code,
  BrainCircuit,
  Cpu,
  Eye,
  MessageSquare,
  BarChart2,
  Compass,
  GitBranch,
  Filter
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useCourses } from '../context/CourseContext';
import { Course, CourseLevel } from '../data/courses/types';
import { sound } from '../utils/audio';

// Dynamic icon resolver
const resolveCourseIcon = (iconName: string, className = "w-6 h-6") => {
  switch (iconName) {
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

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, getCourseProgress } = useCourses();
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((course) => {
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#121938] via-[#0E132A] to-[#1B1135] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACADEMY CURRICULUM // 9 SPECIALIZATIONS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white">
              AI Quest <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">Courses</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore industry-standard learning roadmaps from foundational Python syntax to state-of-the-art Generative AI agents. Learn topic-by-topic, practice with interactive quizzes, and conquer legendary raid bosses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-center font-mono">
              <div className="text-2xl font-black text-cyan-400">9</div>
              <div className="text-[10px] text-slate-400 uppercase">Core Paths</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-center font-mono">
              <div className="text-2xl font-black text-purple-400">65+</div>
              <div className="text-[10px] text-slate-400 uppercase">Total Modules</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-center font-mono">
              <div className="text-2xl font-black text-amber-400">12,000+</div>
              <div className="text-[10px] text-slate-400 uppercase">XP Rewards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0D1226] border border-white/10 overflow-x-auto">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => {
            const isSelected = selectedLevel === level;
            return (
              <button
                key={level}
                onClick={() => {
                  sound.playClick();
                  setSelectedLevel(level);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {level === 'All' ? 'ALL LEVELS' : level.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0D1226] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, idx) => {
          const prog = getCourseProgress(course.id);
          const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
          const isCompleted = prog.progressPercentage >= 100;
          const isStarted = prog.completedLessons.length > 0;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="h-full"
            >
              <Card
                glow={course.accentColor === 'cyan' ? 'cyan' : course.accentColor === 'purple' ? 'purple' : 'none'}
                className="h-full flex flex-col justify-between p-6 bg-[#0B0F22]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon, Level Badge, and Completion Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 group-hover:border-cyan-300 transition-all shadow-md shadow-cyan-500/10">
                      {resolveCourseIcon(course.iconName)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        course.level === 'Beginner'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : course.level === 'Intermediate'
                          ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                          : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                      }`}>
                        {course.level}
                      </span>

                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                          <CheckCircle2 className="w-3 h-3 text-amber-400" />
                          <span>MASTERED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Title & Short Description */}
                  <div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {course.shortDescription}
                    </p>
                  </div>

                  {/* Course Metadata Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.08] text-center font-mono">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                        <Layers className="w-3 h-3 text-cyan-400" />
                        <span>{course.modules.length}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">Modules</div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                        <FileText className="w-3 h-3 text-purple-400" />
                        <span>{totalLessons}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">Lessons</div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{course.estimatedHours}h</span>
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">Est. Time</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">
                        {isStarted ? `${prog.completedLessons.length} / ${totalLessons} Lessons` : 'Not Started'}
                      </span>
                      <span className="text-cyan-400 font-bold">{prog.progressPercentage}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prog.progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-5 mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      sound.playClick();
                      navigate(`/courses/${course.id}/roadmap`);
                    }}
                    icon={<Map className="w-3.5 h-3.5 text-cyan-400" />}
                    className="w-full text-xs font-mono"
                  >
                    Roadmap
                  </Button>

                  <Button
                    size="sm"
                    glow={isStarted && !isCompleted}
                    onClick={() => {
                      sound.playClick();
                      navigate(`/courses/${course.id}`);
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    iconPosition="right"
                    className="w-full text-xs font-mono text-slate-950 font-bold"
                  >
                    {isStarted ? 'Continue' : 'Overview'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
