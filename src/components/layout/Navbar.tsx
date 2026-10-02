import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Bell, 
  Sparkles,
  CheckCircle2,
  Trophy,
  LogOut,
  Search
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { LevelBadge } from '../common/LevelBadge';
import { XPBar } from '../common/XPBar';
import { ProfileAvatar } from '../common/ProfileAvatar';
import { CourseSearchModal } from '../common/CourseSearchModal';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, toggleSound, levelProgressPercent, currentLevelXp, xpToNextLevel, recentXpGained, logout } = useGame();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isPublicLanding = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070913]/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to={user.hasOnboarded ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 flex items-center gap-1.5">
              AI QUEST
            </div>
            <div className="text-[10px] text-cyan-400/80 font-mono tracking-widest hidden sm:block -mt-1">
              LEARN AI BY PLAYING
            </div>
          </div>
        </Link>

        {/* Center XP & Stats (Hidden on landing page or tiny screens) */}
        {!isPublicLanding && (
          <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-4">
            <div className="w-full">
              <XPBar
                currentLevelXp={currentLevelXp}
                xpToNextLevel={xpToNextLevel}
                progressPercent={levelProgressPercent}
                level={user.level}
                totalXp={user.xp}
                recentXp={recentXpGained}
              />
            </div>
          </div>
        )}

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {!isPublicLanding && (
            <>
              {/* Level Badge */}
              <LevelBadge level={user.level} size="sm" />

              {/* Streak Badge */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs shadow-[0_0_15px_rgba(255,184,0,0.15)]"
                title={`${user.streak} Day Learning Streak`}
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
                <span className="font-bold font-display">{user.streak}</span>
                <span className="text-[10px] text-amber-400/70 hidden sm:inline">DAYS</span>
              </div>
            </>
          )}

          {/* Global Documentation & Course Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-cyan-300 transition-all text-xs font-mono"
            title="Search Courses & Syllabus (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-slate-900 border border-white/10 rounded text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            title={user.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {user.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {!isPublicLanding && (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#070913] animate-pulse" />
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0D1122]/95 border border-cyan-500/20 backdrop-blur-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        Mission Alerts
                      </span>
                      <span className="text-[10px] text-slate-400">3 Unread</span>
                    </div>
                    <div className="space-y-3 mt-3">
                      <div className="flex gap-2.5 items-start p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-200">Daily Quest Available</p>
                          <p className="text-[11px] text-slate-400">Complete Mission 04 to earn +100 XP bonus!</p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-200">Overfitting Titan Arena</p>
                          <p className="text-[11px] text-slate-400">Boss battle unlocked in Machine Learning Realm.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <Link to="/profile" className="flex items-center gap-2 pl-1 group" title="View Profile">
                <ProfileAvatar
                  size="sm"
                  statusIndicator="online"
                  showGlow
                  className="group-hover:scale-105 transition-transform"
                />
              </Link>

              {/* Quick Logout Button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}

          {!user.isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold font-mono px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
              >
                LOG IN
              </Link>
              <Link
                to="/signup"
                className="text-xs font-bold font-mono px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Global Course & Syllabus Documentation Search Modal */}
      <CourseSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};
