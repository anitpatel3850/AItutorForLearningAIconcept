import React from 'react';

export const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Cyber Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70" />

      {/* Subtle scanline sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff08_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
    </div>
  );
};
