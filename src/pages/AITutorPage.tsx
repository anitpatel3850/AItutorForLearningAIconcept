import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Flame, 
  RotateCcw,
  Zap,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { useGame } from '../context/GameContext';
import { MentorType, ChatMessage } from '../types';
import { MENTORS } from '../data/mockData';
import { generateTutorResponse } from '../services/tutorService';
import { sound } from '../utils/audio';

const QUICK_ACTIONS = [
  { label: 'Explain Simply', icon: BookOpen, type: 'explain_simply' as const },
  { label: 'Give Example', icon: Sparkles, type: 'example' as const },
  { label: 'Give Hint', icon: Lightbulb, type: 'hint' as const },
  { label: 'Quiz Me', icon: Flame, type: 'quiz' as const },
];

export const AITutorPage: React.FC = () => {
  const { user, setMentor } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'user',
      text: 'What is supervised learning?',
      timestamp: '10:42 AM',
    },
    {
      id: 'msg-init-2',
      sender: 'tutor',
      text: `Imagine teaching a child using flashcards with pictures of fruits on the front and the name written on the back. Every time they guess, you confirm if they're right or correct them until they recognize apples and oranges on their own.\n\nThat's exactly what supervised learning is: feeding a model labeled examples so it learns to predict the answer on new, unseen examples!\n\nCan you give me an example of supervised learning you might use in an app?`,
      timestamp: '10:42 AM',
      followupSuggestions: ['Spam email detection', 'House price estimation', 'Face unlock on phones', 'How is it different from unsupervised?'],
      conceptTags: ['Supervised Learning', 'Labeled Data', 'Classification']
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentMentorInfo = MENTORS.find((m) => m.id === user.mentor) || MENTORS[1];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string, actionType?: 'ask' | 'explain_simply' | 'example' | 'hint' | 'quiz') => {
    const text = textToSend || inputQuery.trim();
    if (!text && !actionType) return;

    sound.playClick();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text || (actionType === 'explain_simply' ? 'Explain Simply' : actionType === 'example' ? 'Give Example' : actionType === 'hint' ? 'Give Hint' : 'Quiz Me'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await generateTutorResponse({
        mentor: user.mentor,
        userMessage: text,
        history: messages,
        actionType: actionType || 'ask',
      });

      setMessages((prev) => [...prev, response]);
      sound.playXp();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMentorChange = (mType: MentorType) => {
    sound.playClick();
    setMentor(mType);

    // Add greeting from switched mentor
    const targetMentor = MENTORS.find((m) => m.id === mType) || MENTORS[0];
    const greetingMsg: ChatMessage = {
      id: `tutor-${Date.now()}`,
      sender: 'tutor',
      text: `Switched mentor link to ${targetMentor.name} (${mType}). ${targetMentor.tagline} What AI concept shall we explore together?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followupSuggestions: ['What is gradient descent?', 'Explain transformers', 'What is overfitting?']
    };
    setMessages((prev) => [...prev, greetingMsg]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header & Mentor Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
            <Bot className="w-4 h-4" />
            <span>NEURAL REASONING CO-PILOT</span>
          </div>
          <h1 className="text-3xl font-black font-display text-white">
            AI Mentor
          </h1>
          <p className="text-sm text-slate-300">
            Real-time interactive AI dialogue with custom pedagogy models.
          </p>
        </div>

        {/* Mentor Selector Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0D1226] border border-white/10 self-start md:self-auto">
          {MENTORS.map((m) => {
            const isSelected = user.mentor === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMentorChange(m.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{m.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="rounded-3xl bg-[#0B0F20]/90 border border-white/10 backdrop-blur-2xl flex flex-col h-[650px] shadow-2xl relative overflow-hidden">
        {/* Mentor Status Bar */}
        <div className="px-6 py-3 border-b border-white/[0.06] bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentMentorInfo.avatar}
                alt={currentMentorInfo.name}
                className="w-8 h-8 rounded-xl object-cover border border-cyan-400/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0B0F20]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-display">
                {currentMentorInfo.name} ({currentMentorInfo.id})
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">
                {currentMentorInfo.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Pedagogy: <span className="text-purple-300">{currentMentorInfo.style}</span>
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <ProfileAvatar size="xs" statusIndicator="online" />
              <span className="text-xs font-mono font-bold text-cyan-300 hidden md:inline">{user.username}</span>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <img
                    src={currentMentorInfo.avatar}
                    alt="Tutor"
                    className="w-8 h-8 rounded-xl object-cover border border-cyan-400/40 shrink-0 mt-1"
                  />
                )}

                <div className={`max-w-[85%] sm:max-w-xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-50 rounded-br-none font-medium'
                        : 'bg-[#131934] border border-white/10 text-slate-200 rounded-bl-none shadow-lg'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">
                      {msg.text}
                    </div>

                    {msg.conceptTags && msg.conceptTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-white/[0.08]">
                        {msg.conceptTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Followup suggestion pills */}
                  {msg.followupSuggestions && msg.followupSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.followupSuggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs font-mono px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-500/40 transition-all text-left"
                        >
                          → {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] font-mono text-slate-500 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <ProfileAvatar size="sm" showGlow className="shrink-0 mt-1" />
                )}
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <img
                src={currentMentorInfo.avatar}
                alt="Tutor"
                className="w-8 h-8 rounded-xl object-cover border border-cyan-400/40"
              />
              <div className="p-3.5 rounded-2xl bg-[#131934] border border-white/10 text-slate-400 text-xs font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{currentMentorInfo.name} is synthesizing response...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">
            Quick Prompts:
          </span>
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => handleSendMessage('', action.type)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 font-mono transition-colors shrink-0"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0A0D1D]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask ${currentMentorInfo.name} anything about AI, ML, or boss strategies...`}
              className="flex-1 bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
            />
            <Button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              ASK AI
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
