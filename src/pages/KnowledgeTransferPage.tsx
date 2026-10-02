import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpenCheck, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  Zap, 
  RotateCcw,
  Send,
  Award
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useGame } from '../context/GameContext';
import { KNOWLEDGE_TOPICS } from '../data/mockData';
import { evaluateExplanation } from '../services/evaluationService';
import { EvaluationResult } from '../types';
import { sound } from '../utils/audio';

export const KnowledgeTransferPage: React.FC = () => {
  const { addXp, unlockAchievement } = useGame();

  const [selectedTopicId, setSelectedTopicId] = useState(KNOWLEDGE_TOPICS[0].id);
  const [userText, setUserText] = useState(
    'Gradient descent is an optimization algorithm used to train machine learning models by minimizing the loss function. Imagine being in a foggy valley: you calculate the slope (derivative) of the terrain under your feet and take steps in the direction of steepest descent. The learning rate controls how big each step is.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const activeTopic = KNOWLEDGE_TOPICS.find(t => t.id === selectedTopicId) || KNOWLEDGE_TOPICS[0];

  const handleEvaluate = async () => {
    if (!userText.trim() || isEvaluating) return;

    sound.playClick();
    setIsEvaluating(true);

    try {
      const result = await evaluateExplanation(selectedTopicId, userText);
      setEvaluation(result);
      addXp(result.xpAwarded);

      if (result.overallScore >= 90) {
        unlockAchievement('ach-concept-master');
      }
      sound.playCorrect();
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setEvaluation(null);
    setUserText('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
          <BookOpenCheck className="w-4 h-4" />
          <span>FEYNMAN SYNAPSE PROTOCOL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
          TEACH IT BACK
        </h1>
        <p className="text-sm text-slate-300">
          If you cannot explain a concept in simple terms, you have not truly mastered it. Teach the concept back to receive immediate evaluation.
        </p>
      </div>

      {/* Topic Switcher Tabs */}
      <div className="flex flex-wrap gap-2">
        {KNOWLEDGE_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => {
              sound.playClick();
              setSelectedTopicId(topic.id);
              setEvaluation(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              selectedTopicId === topic.id
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400 font-bold shadow-lg shadow-emerald-500/10'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Main Prompt Card */}
      <Card glow="green" className="p-6 sm:p-8 space-y-6 bg-[#0B1124]/90 border-emerald-500/30">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            TEACHING PROMPT
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
            "{activeTopic.prompt}"
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activeTopic.contextHint}
          </p>
        </div>

        {/* Large Text Area */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={7}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Type your explanation here using simple analogies, clear terminology, and intuitive steps..."
              className="w-full bg-slate-950/80 border border-white/15 focus:border-emerald-400 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-slate-100 placeholder:text-slate-600 outline-none leading-relaxed transition-colors resize-y font-sans"
            />

            <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/5">
              {userText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Multi-Vector Evaluation</span>
          </div>

          <div className="flex items-center gap-2">
            {evaluation && (
              <Button variant="secondary" onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
                REWRITE
              </Button>
            )}

            <Button
              size="lg"
              variant="primary"
              glow
              disabled={userText.trim().length < 15 || isEvaluating}
              onClick={handleEvaluate}
              icon={isEvaluating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              iconPosition="right"
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20"
            >
              {isEvaluating ? 'ANALYZING SYNAPSES...' : 'EVALUATE MY EXPLANATION'}
            </Button>
          </div>
        </div>
      </Card>

      {/* AI Evaluation Results Breakdown */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0F1B2E] to-[#0A101F] border border-emerald-500/40 shadow-[0_0_40px_rgba(0,255,157,0.2)] space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  EVALUATION REPORT // FEYNMAN SYNAPSE
                </span>
                <h3 className="text-2xl font-bold font-display text-white">
                  Score: {evaluation.overallScore}% Mastery
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-sm font-bold">
                <Zap className="w-4 h-4 fill-cyan-400" />
                <span>+{evaluation.xpAwarded} XP Earned</span>
              </div>
            </div>

            {/* Triple Metric Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Concept Accuracy</span>
                  <span className="text-emerald-400 font-bold">{evaluation.conceptAccuracy}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${evaluation.conceptAccuracy}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Clarity</span>
                  <span className="text-cyan-400 font-bold">{evaluation.clarity}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${evaluation.clarity}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-cyan-400 rounded-full"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Completeness</span>
                  <span className="text-purple-400 font-bold">{evaluation.completeness}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${evaluation.completeness}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-purple-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Critique Quote */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                AI Pedagogy Assessment:
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans italic">
                "{evaluation.feedback}"
              </p>
            </div>

            {/* Keywords Analyzed */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400">
                Key Neural Anchor Terms Identified:
              </span>
              <div className="flex flex-wrap gap-2">
                {evaluation.detectedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{kw}</span>
                  </span>
                ))}
                {evaluation.missingKeywords.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-mono flex items-center gap-1"
                  >
                    <span>+ Missing: {kw}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
