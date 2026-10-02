import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ParticleBackground } from '../common/ParticleBackground';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      <ParticleBackground />
      <Navbar />

      <div className="flex-1 flex max-w-[1700px] w-full mx-auto relative z-10">
        <Sidebar />
        <main className="flex-1 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 pt-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
};
