import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  MessageSquare,
  GraduationCap,
  Layers,
  ChevronRight,
  Award,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { useGame } from '../context/GameContext';
import { useCourses } from '../context/CourseContext';
import { MentorType, ChatMessage } from '../types';
import { MENTORS } from '../data/mockData';
import { 
  generateTutorResponse, 
  evaluateStudentAnswer, 
  AgentTutorResponse,
  AgentEvaluationResponse
} from '../services/tutorService';
import { sound } from '../utils/audio';

// Requirement 13: Learning Actions
const LEARNING_ACTIONS = [
  { label: 'Explain More Simply', icon: BookOpen, type: 'explain_simply' as const },
  { label: 'Give Me an Example', icon: Sparkles, type: 'example' as const },
  { label: 'Test My Understanding', icon: Flame, type: 'test_understanding' as const },
  { label: 'Give Me a Hint', icon: Lightbulb, type: 'hint' as const },
  { label: 'Give Me a Practice Question', icon: HelpCircle, type: 'quiz' as const },
  { label: 'Ask Again', icon: RotateCcw, type: 'ask' as const },
];

export const AITutorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, setMentor, addXp } = useGame();
  const { courses, getCourseProgress } = useCourses();

  // Selected Course and Lesson Context
  const initialCourseId = searchParams.get('course') || 'machine-learning';
  const initialLessonId = searchParams.get('lesson') || 'ml-l5-classification';

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedLessonId, setSelectedLessonId] = useState(initialLessonId);
  const [currentDifficulty, setCurrentDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [lastSuggestedAction, setLastSuggestedAction] = useState<string>('continue');
  const [conversationId, setConversationId] = useState<string>(() => `conv-${Date.now()}`);
  const [lastPosedQuestion, setLastPosedQuestion] = useState<string | null>("What is classification?");
  const [isEvaluationMode, setIsEvaluationMode] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('Classification');
  const [hasError, setHasError] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string>('');

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const allLessonsInCourse = activeCourse ? activeCourse.modules.flatMap(m => m.lessons) : [];
  const activeLesson = allLessonsInCourse.find(l => l.id === selectedLessonId) || allLessonsInCourse[0];
  const courseProgress = activeCourse ? getCourseProgress(activeCourse.id) : null;

  const [messages, setMessages] = useState<AgentTutorResponse[]>([
    {
      id: 'msg-init-1',
      sender: 'user',
      text: 'What is classification?',
      timestamp: '10:42 AM',
    },
    {
      id: 'msg-init-2',
      sender: 'tutor',
      text: `Think of classification like sorting mail into different boxes!\n\nInstead of predicting a continuous number (like tomorrow's temperature), classification predicts a **category**—like whether an email is 'Spam' or 'Inbox', or whether a photo is a 'Muffin' or a 'Chihuahua'.\n\nThe AI examines the features and decides which bucket the item belongs in.\n\nDoes that click, or would you like a simple example?`,
      timestamp: '10:42 AM',
      followupSuggestions: [
        "I still don't understand",
        "Give Me an Example",
        "Test My Understanding",
        "What's the difference between classification and regression?"
      ],
      conceptTags: ['Classification', 'Supervised Learning', 'Decision Boundary'],
      difficulty: 'beginner',
      suggestedAction: 'test_understanding',
      topic: 'Classification'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentMentorInfo = MENTORS.find((m) => m.id === user.mentor) || MENTORS[1];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Sync lesson if course changes
  const handleCourseChange = (newCourseId: string) => {
    setSelectedCourseId(newCourseId);
    const targetCourse = courses.find(c => c.id === newCourseId);
    if (targetCourse && targetCourse.modules.length > 0 && targetCourse.modules[0].lessons.length > 0) {
      setSelectedLessonId(targetCourse.modules[0].lessons[0].id);
    }
  };

  const handleSendMessage = async (
    textToSend?: string,
    actionType?: 'ask' | 'explain_simply' | 'example' | 'hint' | 'quiz' | 'test_understanding'
  ) => {
    const text = (textToSend !== undefined ? textToSend : inputQuery).trim();
    if (!text && !actionType) return;

    sound.playClick();
    setHasError(false);

    // Detect if this input is a new question inquiry rather than answering a quiz
    const isNewQuestion = /^(what|how|why|explain|tell|can you|describe|who|when|where|which|give me|is there|difference between)\b/i.test(text) || text.endsWith('?');
    
    // Resolve active topic from the message if asking about a specific concept
    let currentTopic = activeTopic;
    const lowerText = text.toLowerCase();
    if (lowerText.includes('overfit')) currentTopic = 'Overfitting';
    else if (lowerText.includes('underfit')) currentTopic = 'Underfitting';
    else if (lowerText.includes('precision') || lowerText.includes('recall')) currentTopic = 'Precision and Recall';
    else if (lowerText.includes('decision tree') || lowerText.includes('decision trees')) currentTopic = 'Decision Trees';
    else if (lowerText.includes('gradient')) currentTopic = 'Gradient Descent';
    else if (lowerText.includes('logistic regression')) currentTopic = 'Logistic Regression';
    else if (lowerText.includes('classification')) currentTopic = 'Classification';

    setActiveTopic(currentTopic);

    let displayPrompt = text;
    if (!displayPrompt && actionType) {
      const match = LEARNING_ACTIONS.find(a => a.type === actionType);
      displayPrompt = match ? match.label : actionType;
    }

    const userMsg: AgentTutorResponse = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: displayPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      // Check if this is an answer submission to a previously posed question (must NOT be a new question)
      const isAnsweringCheck = isEvaluationMode && lastPosedQuestion && text.length > 2 && !isNewQuestion && !actionType;

      if (isAnsweringCheck) {
        // Run answer evaluation endpoint
        const evalResult: AgentEvaluationResponse = await evaluateStudentAnswer({
          userId: user.id || 'student_explorer',
          courseId: selectedCourseId,
          lessonId: selectedLessonId,
          question: lastPosedQuestion,
          userAnswer: text,
          currentDifficulty: currentDifficulty
        });

        if (evalResult.correct) {
          sound.playCorrect();
          addXp(evalResult.xpAwarded);
        } else {
          sound.playWrong();
          addXp(evalResult.xpAwarded);
        }

        setCurrentDifficulty(evalResult.difficulty as any);
        setIsEvaluationMode(false);

        const tutorEvalMsg: AgentTutorResponse = {
          id: `eval-${Date.now()}`,
          sender: 'tutor',
          text: `${evalResult.correct ? '🎉 **Correct Assessment!**' : '💡 **Helpful Correction:**'}\n\n${evalResult.feedback}\n\n${evalResult.explanation}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followupSuggestions: evalResult.correct 
            ? ["Give me a harder question", "Give Me an Example", "Advance to Next Topic"]
            : ["Give Me a Hint", "Explain More Simply", "Try another question"],
          conceptTags: [currentTopic, 'Answer Evaluation', 'Adaptive Learning'],
          difficulty: evalResult.difficulty,
          suggestedAction: evalResult.nextAction,
          xpAwarded: evalResult.xpAwarded,
          topic: currentTopic
        };

        setMessages((prev) => [...prev, tutorEvalMsg]);
        return;
      }

      // Exit evaluation mode if user asked a new question or clicked an action
      if (isEvaluationMode && (isNewQuestion || actionType)) {
        setIsEvaluationMode(false);
      }

      // Format payload message for action requests to preserve topic context
      let payloadMessage = text;
      if (!payloadMessage && actionType) {
        if (actionType === 'example') payloadMessage = `Give me a real-world example of ${currentTopic}`;
        else if (actionType === 'explain_simply') payloadMessage = `Explain ${currentTopic} more simply with an analogy`;
        else if (actionType === 'test_understanding' || actionType === 'quiz') payloadMessage = `Test my understanding of ${currentTopic}`;
        else if (actionType === 'hint') payloadMessage = `Give me a tactical hint on ${currentTopic}`;
        else payloadMessage = `Tell me about ${currentTopic}`;
      }

      // Normal Agent Tutor turn
      const response = await generateTutorResponse({
        mentor: user.mentor,
        userMessage: payloadMessage || displayPrompt,
        history: messages,
        actionType: actionType || 'ask',
        courseId: selectedCourseId,
        moduleId: activeLesson?.id,
        lessonId: selectedLessonId,
        currentDifficulty: currentDifficulty,
        progressPercent: courseProgress?.progressPercentage || 0,
        userId: user.id || 'student_explorer',
        studentName: user.username || 'AI Explorer',
        conversationId: conversationId,
        topic: currentTopic
      });

      if (response.difficulty) {
        setCurrentDifficulty(response.difficulty as any);
      }
      if (response.suggestedAction) {
        setLastSuggestedAction(response.suggestedAction);
      }
      if (response.topic) {
        setActiveTopic(response.topic);
      }
      if (actionType === 'test_understanding' || actionType === 'quiz') {
        setIsEvaluationMode(true);
        setLastPosedQuestion(response.text);
      }

      setMessages((prev) => [...prev, response]);
      sound.playXp();
    } catch (e) {
      console.error(e);
      setHasError(true);
      setLastFailedMessage(text || displayPrompt);
      const errMsg: AgentTutorResponse = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: 'AI Tutor encountered a brief connectivity glitch. Please click Retry below to query the agent again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followupSuggestions: ['Ask Again', 'Explain More Simply']
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMentorChange = (mType: MentorType) => {
    sound.playClick();
    setMentor(mType);

    const targetMentor = MENTORS.find((m) => m.id === mType) || MENTORS[0];
    const greetingMsg: AgentTutorResponse = {
      id: `tutor-${Date.now()}`,
      sender: 'tutor',
      text: `Switched mentor link to ${targetMentor.name} (${mType}). ${targetMentor.tagline} Ready to explore ${activeLesson?.title || 'AI'} together!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followupSuggestions: ['What is classification?', 'Test My Understanding', 'Explain More Simply']
    };
    setMessages((prev) => [...prev, greetingMsg]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header & Mentor Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
            <Bot className="w-4 h-4" />
            <span>ADAPTIVE AI TUTOR AGENT // OPENAI AGENTS SDK</span>
          </div>
          <h1 className="text-3xl font-black font-display text-white">
            AI Mentor & Tutor Agent
          </h1>
          <p className="text-sm text-slate-300">
            Real-time interactive AI dialogue grounded in your active course syllabus, module objectives, and adaptive difficulty.
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

      {/* Course Context HUD & Difficulty Bar */}
      <div className="rounded-2xl p-4 bg-[#0B0F20]/80 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 uppercase">Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="bg-slate-900 border border-white/15 text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-cyan-400 font-sans"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 uppercase">Lesson:</span>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="bg-slate-900 border border-white/15 text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-cyan-400 font-sans max-w-[220px] truncate"
            >
              {allLessonsInCourse.map(l => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Difficulty:</span>
            <span className={`px-2.5 py-0.5 rounded-full uppercase font-bold text-[10px] border ${
              currentDifficulty === 'beginner'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : currentDifficulty === 'intermediate'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {currentDifficulty}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agent Active</span>
          </div>
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
                <span>{currentMentorInfo.name} is synthesizing adaptive response...</span>
              </div>
            </motion.div>
          )}

          {/* Error & Retry Banner */}
          {hasError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>AI Tutor request failed. Check network or retry.</span>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleSendMessage(lastFailedMessage)}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Retry
              </Button>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Requirement 13: Learning Actions Bar */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-slate-950/50 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 font-bold">
            Actions:
          </span>
          {LEARNING_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => handleSendMessage('', action.type)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 font-mono transition-colors shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
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
              placeholder={isEvaluationMode ? "Type your answer to submit for tutor evaluation..." : `Ask ${currentMentorInfo.name} about ${activeLesson?.title || 'AI concepts'}...`}
              className={`flex-1 bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors ${
                isEvaluationMode ? 'border-amber-400/50 focus:border-amber-400' : 'border-white/15 focus:border-cyan-400'
              }`}
            />
            <Button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              {isEvaluationMode ? "SUBMIT ANSWER" : "ASK AI"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
