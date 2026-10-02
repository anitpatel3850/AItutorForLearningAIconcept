import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Bot, 
  Swords, 
  BookOpenCheck, 
  Award, 
  Trophy, 
  User as UserIcon,
  Sparkles,
  ChevronRight,
  LogOut,
  GraduationCap,
  Bookmark
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ProfileAvatar } from '../common/ProfileAvatar';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/courses', label: 'Courses', icon: GraduationCap, badge: '9 Paths' },
  { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark, badge: null },
  { path: '/quest-map', label: 'Quest Map', icon: Map, badge: '6 Worlds' },
  { path: '/tutor', label: 'AI Mentor', icon: Bot, badge: 'Live' },
  { path: '/boss/boss-ml', label: 'Boss Battles', icon: Swords, badge: 'Raid' },
  { path: '/knowledge-transfer', label: 'Teach It Back', icon: BookOpenCheck, badge: '+XP' },
  { path: '/achievements', label: 'Achievements', icon: Award, badge: null },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy, badge: null },
  { path: '/profile', label: 'Profile', icon: UserIcon, badge: null },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useGame();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0A0E1E]/80 backdrop-blur-2xl border-r border-white/[0.07] shrink-0 min-h-[calc(100vh-4rem)] p-4 justify-between">
      {/* Navigation Links */}
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Mission Operations
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        item.badge === 'Raid'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : item.badge === 'Live'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    )}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Mini Card at bottom */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <Link to="/profile" className="shrink-0 group" title="View Profile">
              <ProfileAvatar
                size="md"
                statusIndicator="online"
                showGlow
                className="group-hover:scale-105 transition-transform"
              />
            </Link>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate font-display">
                {user.username}
              </div>
              <div className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Level {user.level}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out of Terminal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Active Mentor:</span>
          <span className="text-purple-300 font-bold">{user.mentor}</span>
        </div>
      </div>
    </aside>
  );
};
