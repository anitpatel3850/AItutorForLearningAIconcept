import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  BrainCircuit, 
  Layers, 
  Eye, 
  MessageSquareCode, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MentorCard } from '../components/game/MentorCard';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { useGame } from '../context/GameContext';
import { AILevel, LearningGoal, MentorType } from '../types';
import { MENTORS } from '../data/mockData';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

const AI_LEVELS: { id: AILevel; label: string; desc: string }[] = [
  { id: 'Complete Beginner', label: 'Complete Beginner', desc: 'No coding or machine learning experience. Starting from absolute scratch.' },
  { id: 'Beginner', label: 'Beginner', desc: 'Some programming basics, but new to neural networks and data science.' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Familiar with Python and basic ML algorithms; ready for deep architectures.' },
  { id: 'Advanced', label: 'Advanced', desc: 'Experienced developer or researcher looking for boss battles and frontier concepts.' },
];

const LEARNING_GOALS: { id: LearningGoal; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'AI Fundamentals', label: 'AI Fundamentals', desc: 'The history, ethics, problem framing, and core building blocks.', icon: Compass },
  { id: 'Machine Learning', label: 'Machine Learning', desc: 'Supervised regression, classification, clustering, and overfitting defense.', icon: BrainCircuit },
  { id: 'Deep Learning', label: 'Deep Learning', desc: 'Multi-layer perceptrons, backpropagation, and loss optimization landscapes.', icon: Layers },
  { id: 'Computer Vision', label: 'Computer Vision', desc: 'Convolutions, image segmentation, object detection, and visual tensors.', icon: Eye },
  { id: 'NLP', label: 'NLP', desc: 'Tokenization, embeddings, vector semantics, and sequence modeling.', icon: MessageSquareCode },
  { id: 'Generative AI', label: 'Generative AI', desc: 'Transformer self-attention, foundation models, LLMs, and prompt engineering.', icon: Flame },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOnboardingData } = useGame();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLevel, setSelectedLevel] = useState<AILevel>('Beginner');
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal>('Machine Learning');
  const [selectedMentor, setSelectedMentor] = useState<MentorType>('Coach');

  const handleNextStep = () => {
    sound.playClick();
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    } else if (step === 3) {
      setStep(4);
      sound.playLevelUp();
      triggerConfetti();
    }
  };

  const handlePrevStep = () => {
    sound.playClick();
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleFinish = () => {
    sound.playCorrect();
    setOnboardingData(selectedLevel, selectedGoal, selectedMentor);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      <ParticleBackground />

      <div className="w-full max-w-3xl relative z-10 my-auto">
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between mb-8 max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-xs transition-all ${
                  step === s
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] ring-2 ring-cyan-300'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/5 text-slate-500 border border-white/10'
                }`}
              >
                {step > s ? <Check className="w-4 h-4 stroke-[3]" /> : `0${s}`}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 mx-2 transition-colors ${
                    step > s ? 'bg-emerald-400' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: AI Level */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  STEP 01 // CALIBRATION
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  What is your AI level?
                </h2>
                <p className="text-sm text-slate-300">
                  We customize the difficulty curve and mission challenges to match your baseline.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AI_LEVELS.map((item) => {
                  const isSelected = selectedLevel === item.id;
                  return (
                    <Card
                      key={item.id}
                      hoverEffect
                      onClick={() => {
                        sound.playClick();
                        setSelectedLevel(item.id);
                      }}
                      className={`cursor-pointer p-5 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-[#141C38] shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base font-bold font-display text-white">
                          {item.label}
                        </h4>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button size="lg" glow onClick={handleNextStep} icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  CONTINUE
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Learning Goal */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                  STEP 02 // SECTOR SELECTION
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  What do you want to learn?
                </h2>
                <p className="text-sm text-slate-300">
                  Select your primary focus area. You can explore all worlds anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {LEARNING_GOALS.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  const Icon = goal.icon;
                  return (
                    <Card
                      key={goal.id}
                      hoverEffect
                      onClick={() => {
                        sound.playClick();
                        setSelectedGoal(goal.id);
                      }}
                      className={`cursor-pointer p-4 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-400 bg-[#181638] shadow-[0_0_25px_rgba(157,78,221,0.25)]'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2.5 rounded-xl border ${
                            isSelected ? 'bg-purple-500/20 text-purple-300 border-purple-400' : 'bg-white/5 text-slate-400 border-white/10'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <h4 className="text-sm font-bold font-display text-white mb-1">
                          {goal.label}
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {goal.desc}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="secondary" onClick={handlePrevStep} icon={<ArrowLeft className="w-4 h-4" />}>
                  BACK
                </Button>
                <Button size="lg" variant="purple" glow onClick={handleNextStep} icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  CONTINUE
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Choose Mentor */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  STEP 03 // NEURAL ALLIANCE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                  Choose your mentor
                </h2>
                <p className="text-sm text-slate-300">
                  Select the AI persona that best aligns with how you love to learn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MENTORS.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    isSelected={selectedMentor === mentor.id}
                    onSelect={() => {
                      sound.playClick();
                      setSelectedMentor(mentor.id);
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="secondary" onClick={handlePrevStep} icon={<ArrowLeft className="w-4 h-4" />}>
                  BACK
                </Button>
                <Button size="lg" glow onClick={handleNextStep} icon={<Sparkles className="w-5 h-5" />} iconPosition="right">
                  INITIALIZE MATRIX
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Ready Confirmation Screen */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-1 mx-auto shadow-[0_0_50px_rgba(0,240,255,0.4)]">
                <div className="w-full h-full bg-[#070913] rounded-[22px] flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-cyan-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
                  Your AI Quest is ready.
                </h2>
                <p className="text-base text-slate-300 max-w-md mx-auto">
                  Neural pathways configured. Mentor initialized. Mission 01 is unlocked and ready for launch.
                </p>
              </div>

              {/* Summary Card */}
              <Card className="max-w-md mx-auto p-5 text-left font-mono text-xs space-y-2.5 bg-slate-950/80 border-cyan-500/30">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Baseline Level:</span>
                  <span className="text-white font-bold">{selectedLevel}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Initial Quest:</span>
                  <span className="text-cyan-400 font-bold">{selectedGoal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designated Mentor:</span>
                  <span className="text-purple-400 font-bold">{selectedMentor}</span>
                </div>
              </Card>

              <div className="pt-4">
                <Button size="lg" glow onClick={handleFinish} icon={<ArrowRight className="w-5 h-5" />} iconPosition="right" className="px-10">
                  ENTER THE QUEST
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
