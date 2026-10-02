import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Swords, 
  BrainCircuit, 
  Target, 
  Bot, 
  Trophy, 
  Zap, 
  Layers, 
  Compass,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { WORLDS } from '../data/mockData';
import { useAuth } from '../context/GameContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const ctaDestination = isAuthenticated ? '/dashboard' : '/signup';
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>THE NEXT-GEN GAMIFIED AI LEARNING MATRIX</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-white"
          >
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">QUEST</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <p className="text-2xl sm:text-3xl font-bold font-sans text-cyan-100">
              "Learn AI by Playing."
            </p>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Turn complex AI concepts into quests, challenges and boss battles. Master machine learning, neural networks, and generative models through interactive gameplay.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link to={ctaDestination}>
              <Button size="lg" glow icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                START YOUR QUEST
              </Button>
            </Link>
            <Link to="/quest-map">
              <Button size="lg" variant="secondary" icon={<Compass className="w-5 h-5 text-cyan-400" />}>
                EXPLORE AI WORLDS
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Futuristic AI World Vector Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-14 max-w-5xl mx-auto relative rounded-3xl p-1 bg-gradient-to-b from-cyan-500/40 via-purple-500/20 to-transparent shadow-[0_0_50px_rgba(0,240,255,0.2)]"
        >
          <div className="rounded-[22px] bg-[#0A0E22]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 relative overflow-hidden">
            {/* Ambient cyber lights */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Lore Preview */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  REALM 02 // PREDICTIVE CORE
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  The Overfitting Titan Awaits
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Embark across 6 expansive AI realms. Level up your synaptic rank from Complete Beginner to Grandmaster, unlocking neural nodes and claiming legendary battle badges.
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs font-mono text-cyan-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>6 Worlds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>50+ Missions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Raid Bosses</span>
                  </div>
                </div>
              </div>

              {/* Right Interactive SVG World Map preview */}
              <div className="lg:col-span-7 relative flex items-center justify-center">
                <svg
                  viewBox="0 0 520 320"
                  className="w-full h-auto drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Glowing Connection Paths */}
                  <path
                    d="M 60 160 C 130 80, 180 80, 240 160 C 300 240, 360 240, 460 160"
                    stroke="url(#pathGrad)"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00F0FF" />
                      <stop offset="50%" stopColor="#9D4EDD" />
                      <stop offset="100%" stopColor="#FF007A" />
                    </linearGradient>
                  </defs>

                  {/* World Node 1 */}
                  <g transform="translate(60, 160)">
                    <circle r="26" fill="#0D1126" stroke="#00F0FF" strokeWidth="2.5" />
                    <circle r="16" fill="#00F0FF" fillOpacity="0.3" />
                    <text textAnchor="middle" y="4" fill="#00F0FF" fontSize="12" fontWeight="bold" fontFamily="monospace">W1</text>
                    <text textAnchor="middle" y="42" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Fundamentals</text>
                  </g>

                  {/* World Node 2 (Active Current Quest) */}
                  <g transform="translate(180, 100)">
                    <circle r="34" fill="#151A38" stroke="#9D4EDD" strokeWidth="3" />
                    <circle r="22" fill="#9D4EDD" fillOpacity="0.4" />
                    <circle r="40" stroke="#9D4EDD" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: '0px 0px' }} />
                    <text textAnchor="middle" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">W2</text>
                    <text textAnchor="middle" y="52" fill="#00F0FF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Machine Learning</text>
                  </g>

                  {/* World Node 3 */}
                  <g transform="translate(300, 220)">
                    <circle r="28" fill="#0D1126" stroke="#FF007A" strokeWidth="2.5" />
                    <circle r="18" fill="#FF007A" fillOpacity="0.3" />
                    <text textAnchor="middle" y="4" fill="#FF007A" fontSize="12" fontWeight="bold" fontFamily="monospace">W3</text>
                    <text textAnchor="middle" y="44" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Deep Learning</text>
                  </g>

                  {/* World Node 4 / Boss Gate */}
                  <g transform="translate(450, 160)">
                    <polygon points="0,-30 26,15 -26,15" fill="#1A0D28" stroke="#FFB800" strokeWidth="2.5" />
                    <circle r="10" fill="#FFB800" fillOpacity="0.5" className="animate-ping" />
                    <text textAnchor="middle" y="3" fill="#FFB800" fontSize="10" fontWeight="bold" fontFamily="monospace">BOSS</text>
                    <text textAnchor="middle" y="38" fill="#FFB800" fontSize="11" fontWeight="bold" fontFamily="sans-serif">The Singularity</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Game Mechanics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2">
            How It Works
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            A battle-tested 4-step loop designed to replace passive videos with active synaptic mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Choose Your Path',
              desc: 'Select your AI knowledge tier and pair up with a specialized AI mentor: Professor, Coach, or Friend.',
              icon: Compass,
              accent: 'border-cyan-500/30 text-cyan-400',
            },
            {
              step: '02',
              title: 'Complete Missions',
              desc: 'Solve interactive challenges with instant feedback, visual diagrams, and tactical hints. Earn +100 XP per mission.',
              icon: Target,
              accent: 'border-purple-500/30 text-purple-400',
            },
            {
              step: '03',
              title: 'Battle AI Bosses',
              desc: 'Test your instincts in raid arenas against boss titans like the Overfitting Titan. Deduct HP with correct answers.',
              icon: Swords,
              accent: 'border-pink-500/30 text-pink-400',
            },
            {
              step: '04',
              title: 'Master Concepts',
              desc: 'Synthesize knowledge through the Feynman "Teach It Back" challenge, unlock achievements, and climb the leaderboard.',
              icon: Trophy,
              accent: 'border-amber-500/30 text-amber-400',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} hoverEffect className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-display text-white/20">
                    {item.step}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-white/5 border ${item.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold font-display text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            Key Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2">
            Engineered for Deep Retention
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect glow="cyan" className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit border border-cyan-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Adaptive AI Tutor</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Choose your mentor persona. Dr. Vance provides rigorous mathematical breakdown, Commander Jax gives Kaggle instincts, and Aria offers friendly everyday analogies.
            </p>
          </Card>

          <Card hoverEffect glow="purple" className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Quest-Based Learning</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore 6 interconnected worlds from tabular classification to multi-head self-attention. Every concept is mapped as an interactive node on the glowing quest canvas.
            </p>
          </Card>

          <Card hoverEffect glow="pink" className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 w-fit border border-pink-500/30">
              <Swords className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Boss Battles</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              End each world with high-stakes raid encounters. Answer progressive multi-tier questions to drain boss HP, trigger critical combos, and claim rare badges.
            </p>
          </Card>

          <Card hoverEffect glow="amber" className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">XP & Rewards System</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gain XP for every challenge solved. Watch your level rise from Lv. 1 to Lv. 25+, maintain daily learning streaks, and celebrate level-ups with procedural audio.
            </p>
          </Card>

          <Card hoverEffect glow="green" className="p-6 space-y-3 md:col-span-2">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/30">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Personalized Learning & Teach It Back</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ground your understanding with Feynman-technique knowledge transfers. Explain concepts in your own words, and receive an instant AI evaluation of accuracy, clarity, and completeness.
            </p>
          </Card>
        </div>
      </section>

      {/* World Previews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            The Metaverse
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2">
            6 Legendary AI Worlds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORLDS.map((world) => (
            <Card key={world.id} hoverEffect className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-cyan-400 font-bold">WORLD 0{world.worldNumber}</span>
                  <span className="text-slate-400">+{world.totalXp} XP</span>
                </div>
                <h4 className="text-lg font-bold font-display text-white mb-1">
                  {world.name}
                </h4>
                <p className="text-xs text-purple-300 font-mono mb-2">{world.subtitle}</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {world.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{world.quests.length} Quests</span>
                <Link to="/quest-map" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold">
                  <span>Enter</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative z-10">
        <div className="rounded-3xl p-10 bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
            Ready to Begin Your AI Odyssey?
          </h2>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Choose your mentor, solve your first mission, and conquer machine learning through pure gameplay.
          </p>
          <div className="pt-2">
            <Link to={ctaDestination}>
              <Button size="lg" glow icon={<Sparkles className="w-5 h-5" />} iconPosition="right">
                START YOUR QUEST NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
