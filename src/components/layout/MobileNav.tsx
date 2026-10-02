import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Bot, 
  Swords, 
  Trophy, 
  User,
  GraduationCap
} from 'lucide-react';
import { ProfileAvatar } from '../common/ProfileAvatar';

const MOBILE_NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/courses', label: 'Courses', icon: GraduationCap },
  { path: '/quest-map', label: 'Map', icon: Map },
  { path: '/tutor', label: 'Mentor', icon: Bot },
  { path: '/boss/boss-ml', label: 'Boss', icon: Swords },
  { path: '/profile', label: 'Profile', icon: User },
];

export const MobileNav: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070913]/90 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-2">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.path === '/profile' ? (
                    <div className={`p-0.5 rounded-full ${isActive ? 'ring-2 ring-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]' : ''}`}>
                      <ProfileAvatar size="xs" />
                    </div>
                  ) : (
                    <div className={`p-1 rounded-lg ${isActive ? 'bg-cyan-500/15' : ''}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
