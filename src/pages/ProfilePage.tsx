import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Flame, 
  Target, 
  Swords, 
  Award, 
  RotateCcw, 
  Zap, 
  CheckCircle2,
  BrainCircuit,
  Compass,
  Layers,
  Eye,
  MessageSquareCode,
  LogOut,
  Camera,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LevelBadge } from '../components/common/LevelBadge';
import { XPBar } from '../components/common/XPBar';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { ImageCropModal } from '../components/profile/ImageCropModal';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    levelProgressPercent, 
    currentLevelXp, 
    xpToNextLevel, 
    updateProfilePhoto,
    removeProfilePhoto,
    resetProgress,
    logout
  } = useGame();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setValidationError("Please select a JPG, PNG, or WEBP image under 5 MB.");
      sound.playWrong();
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (max 5 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError("Please select a JPG, PNG, or WEBP image under 5 MB.");
      sound.playWrong();
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read image as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
      setCropModalOpen(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setValidationError("Failed to load image file. Please try another image.");
      sound.playWrong();
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCrop = (croppedDataUrl: string) => {
    updateProfilePhoto(croppedDataUrl);
    setCropModalOpen(false);
    setSelectedImageSrc(null);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3500);
  };

  const handleRemovePhoto = () => {
    removeProfilePhoto();
    setValidationError(null);
    setShowSuccessToast(false);
  };

  // Format mastery data for Recharts
  const masteryData = [
    { subject: 'AI Fundamentals', mastery: user.mastery['AI Fundamentals'] || 88, fullMark: 100 },
    { subject: 'Machine Learning', mastery: user.mastery['Machine Learning'] || 65, fullMark: 100 },
    { subject: 'Deep Learning', mastery: user.mastery['Deep Learning'] || 28, fullMark: 100 },
    { subject: 'Computer Vision', mastery: user.mastery['Computer Vision'] || 15, fullMark: 100 },
    { subject: 'NLP', mastery: user.mastery['NLP'] || 10, fullMark: 100 },
    { subject: 'Generative AI', mastery: user.mastery['Generative AI'] || 12, fullMark: 100 },
  ];

  const handleResetClick = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 relative">
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        id="profile-photo-file-input"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0D142A]/95 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.45)] backdrop-blur-xl text-white font-mono text-sm"
          >
            <div className="p-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold font-display text-cyan-300">Profile photo updated!</p>
              <p className="text-[11px] text-slate-400 font-mono">Synced across all worlds & interfaces</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={selectedImageSrc}
        onClose={() => {
          setCropModalOpen(false);
          setSelectedImageSrc(null);
        }}
        onConfirm={handleConfirmCrop}
      />

      {/* Validation Error Banner */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-white/5"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header Hero Section */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#121938] via-[#0D1226] to-[#181132] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar & Photo Actions */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <ProfileAvatar
                  size="2xl"
                  showGlow
                  statusIndicator="online"
                  editable
                  onEditClick={() => {
                    sound.playClick();
                    fileInputRef.current?.click();
                  }}
                  className="shadow-2xl"
                />
              </div>

              {/* Action Buttons under Profile Photo */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    fileInputRef.current?.click();
                  }}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Profile Photo</span>
                </button>

                {Boolean(user.avatar && user.avatar.trim().length > 0) && (
                  <>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs font-mono text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="space-y-2 mt-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <LevelBadge level={user.level} size="sm" />
                <span className="text-xs font-mono text-purple-300 font-bold px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                  {user.title}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
                {user.username}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-slate-400">
                <span>Mentor: <strong className="text-cyan-300">{user.mentor}</strong></span>
                <span>•</span>
                <span>Tier: <strong className="text-emerald-300">{user.aiLevel}</strong></span>
                <span>•</span>
                <span>Goal: <strong className="text-purple-300">{user.learningGoal}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Stat Tiles: Level, XP, Streak */}
          <div className="flex items-center justify-center gap-3 self-center sm:self-auto">
            <div className="p-3.5 px-4 rounded-2xl bg-slate-950/70 border border-white/10 text-center font-mono">
              <div className="text-xl font-black text-purple-400">
                Lvl {user.level}
              </div>
              <div className="text-[10px] text-slate-400 uppercase">Rank Level</div>
            </div>

            <div className="p-3.5 px-4 rounded-2xl bg-slate-950/70 border border-white/10 text-center font-mono">
              <div className="text-xl font-black text-cyan-400">
                {user.xp.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 uppercase">Total XP</div>
            </div>

            <div className="p-3.5 px-4 rounded-2xl bg-slate-950/70 border border-white/10 text-center font-mono">
              <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                {user.streak}
              </div>
              <div className="text-[10px] text-slate-400 uppercase">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="mt-6 pt-6 border-t border-white/[0.08]">
          <XPBar
            currentLevelXp={currentLevelXp}
            xpToNextLevel={xpToNextLevel}
            progressPercent={levelProgressPercent}
            level={user.level}
            totalXp={user.xp}
          />
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center space-y-1">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {user.completedMissions.length}
          </div>
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            Missions Completed
          </div>
        </Card>

        <Card className="p-4 text-center space-y-1">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
            <Swords className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {user.defeatedBosses.length || (user.level >= 14 ? 1 : 0)}
          </div>
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            Bosses Defeated
          </div>
        </Card>

        <Card className="p-4 text-center space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {user.unlockedAchievements.length}
          </div>
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            Badges Earned
          </div>
        </Card>

        <Card className="p-4 text-center space-y-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {user.streak} Days
          </div>
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            Active Streak
          </div>
        </Card>
      </div>

      {/* Concept Mastery Recharts Visualizer */}
      <Card glow="purple" className="p-6 sm:p-8 space-y-6 bg-[#0B0F22]/90 border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>NEURAL SYNAPSE TOPOLOGY</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              AI Concept Mastery Chart
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Visualizes domain proficiency across all 6 core machine intelligence pillars.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setChartType('radar')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                chartType === 'radar'
                  ? 'bg-purple-500/30 text-purple-300 font-bold border border-purple-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar Map
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-purple-500/30 text-purple-300 font-bold border border-purple-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bar Breakdown
            </button>
          </div>
        </div>

        {/* Chart Rendering Container */}
        <div className="w-full h-80 sm:h-96 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'radar' ? (
              <RadarChart data={masteryData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 9 }} 
                />
                <Radar
                  name="Mastery %"
                  dataKey="mastery"
                  stroke="#00F0FF"
                  fill="#9D4EDD"
                  fillOpacity={0.45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1122',
                    borderColor: 'rgba(0, 240, 255, 0.4)',
                    borderRadius: '12px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </RadarChart>
            ) : (
              <BarChart data={masteryData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="subject" type="category" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1122',
                    borderColor: 'rgba(0, 240, 255, 0.4)',
                    borderRadius: '12px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="mastery" fill="#00F0FF" radius={[0, 8, 8, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Account / Demo Testing Tools */}
      <Card className="p-6 bg-slate-950/60 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold font-display text-white">
              Data & Persistence Controls
            </h4>
            <p className="text-xs text-slate-400">
              Your game state is continuously synced to local storage. Refreshing the browser preserves all progress.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            icon={<RotateCcw className="w-3.5 h-3.5 text-red-400" />}
            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            RESET PROGRESS
          </Button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-3 animate-in fade-in">
            <p className="text-xs text-red-200">
              Are you sure you want to reset your local progress back to initial calibration?
            </p>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="danger" onClick={handleResetClick}>
                CONFIRM RESET
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowResetConfirm(false)}>
                CANCEL
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Active Session & Logout Card */}
      <Card className="p-6 bg-slate-950/70 border-red-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-base font-bold font-display text-white">
                Active Terminal Session
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              Logged in as <span className="text-cyan-300 font-mono font-bold">{user.email || 'explorer@aiquest.io'}</span> ({user.username})
            </p>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            LOG OUT OF TERMINAL
          </Button>
        </div>
      </Card>
    </div>
  );
};
