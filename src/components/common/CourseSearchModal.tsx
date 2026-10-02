import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Layers, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { searchCoursesAndDocs, SearchResultItem } from '../../data/courses';
import { sound } from '../../utils/audio';

interface CourseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseSearchModal: React.FC<CourseSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 1) {
      const searchResults = searchCoursesAndDocs(val);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const handleSelectResult = (item: SearchResultItem) => {
    sound.playClick();
    onClose();
    if (item.type === 'lesson' && item.lessonId) {
      navigate(`/courses/${item.courseId}/lesson/${item.lessonId}`);
    } else if (item.type === 'module') {
      navigate(`/courses/${item.courseId}/roadmap`);
    } else {
      navigate(`/courses/${item.courseId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-[#0C1024] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-950/60">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search courses, modules, lessons, or topics (e.g. 'neural network', 'gradient', 'pandas')..."
              className="flex-1 bg-transparent text-white text-sm font-sans placeholder-slate-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {query.trim().length > 1 && results.length === 0 && (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-display text-slate-300">No matching topics found for "{query}"</p>
                <p className="text-xs font-mono text-slate-500">Try searching for concepts like "attention", "regression", or "numpy"</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  {results.length} Search Result{results.length > 1 ? 's' : ''}
                </div>
                {results.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.courseId}-${item.lessonId || item.moduleId || idx}`}
                    onClick={() => handleSelectResult(item)}
                    className="w-full flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 text-left transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/10 shrink-0 text-cyan-400 group-hover:border-cyan-400 transition-colors">
                      {item.type === 'course' && <BookOpen className="w-4 h-4 text-purple-400" />}
                      {item.type === 'module' && <Layers className="w-4 h-4 text-cyan-400" />}
                      {item.type === 'lesson' && <FileText className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {item.courseTitle}
                        </span>
                        {item.moduleTitle && (
                          <>
                            <span className="text-slate-600">/</span>
                            <span className="text-xs font-mono text-slate-400 truncate">
                              {item.moduleTitle}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="text-sm font-bold text-white font-display mt-0.5 truncate group-hover:text-cyan-200">
                        {item.type === 'lesson' ? item.lessonTitle : item.type === 'module' ? item.moduleTitle : item.courseTitle}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-sans">
                        {item.snippet}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
                  </button>
                ))}
              </div>
            )}

            {!query && (
              <div className="p-4 space-y-4">
                <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Popular Search Topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Neural Networks', 'Gradient Descent', 'YOLO', 'Transformers', 'Prompt Engineering', 'K-Means', 'NumPy', 'A* Search'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        setResults(searchCoursesAndDocs(tag));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/20 text-xs font-mono text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
