import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark as BookmarkIcon, 
  Trash2, 
  Play, 
  BookOpen, 
  ArrowLeft, 
  GraduationCap, 
  Clock, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useCourses } from '../context/CourseContext';
import { sound } from '../utils/audio';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark } = useCourses();

  const handleRemove = (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    sound.click();
    removeBookmark(lessonId);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#121938] via-[#0E132A] to-[#1F1338] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <BookmarkIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>SAVED KNOWLEDGE ARCHIVES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Bookmarks</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Curated syllabus topics, algorithm blueprints, and conceptual guides saved for quick tactical reference and exam revision.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-center font-mono shrink-0">
            <div className="text-2xl font-black text-amber-400">{bookmarks.length}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Saved Topics</div>
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <Card variant="glass" className="p-12 text-center border-white/10 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <BookmarkIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold font-display text-white">No Bookmarks Saved Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse through any course lesson or documentation page and click the bookmark icon to save key topics here.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="primary" icon={<GraduationCap className="w-4 h-4" />}>
              Explore Course Catalog
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              onClick={() => {
                sound.click();
                navigate(`/courses/${bm.courseId}/lesson/${bm.lessonId}`);
              }}
              className="rounded-2xl p-5 bg-[#0C1126]/80 border border-white/[0.08] hover:border-amber-500/40 transition-all backdrop-blur-xl group cursor-pointer space-y-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    <span>{bm.courseTitle}</span>
                    <span>•</span>
                    <span className="text-slate-400 truncate">{bm.moduleTitle}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display group-hover:text-amber-300 transition-colors truncate">
                    {bm.lessonTitle}
                  </h3>
                </div>

                <button
                  onClick={(e) => handleRemove(e, bm.lessonId)}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs font-mono text-slate-400">
                <span className="text-[10px]">
                  Saved {new Date(bm.addedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.click();
                      navigate(`/courses/${bm.courseId}/syllabus?lesson=${bm.lessonId}`);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Open Documentation"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Lesson</span>
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
