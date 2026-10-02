import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserState, AILevel, LearningGoal, MentorType, AuthCredentials, SignUpData } from '../types';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface GameContextType {
  user: UserState;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfilePhoto: (photoDataUrl: string) => void;
  removeProfilePhoto: () => void;
  addXp: (amount: number, reason?: string) => void;
  completeMission: (missionId: string, xpReward: number) => boolean;
  defeatBoss: (bossId: string, xpReward: number) => void;
  unlockAchievement: (achievementId: string) => void;
  setMentor: (mentor: MentorType) => void;
  setOnboardingData: (aiLevel: AILevel, learningGoal: LearningGoal, mentor: MentorType) => void;
  toggleSound: () => void;
  resetProgress: () => void;
  levelProgressPercent: number;
  xpToNextLevel: number;
  currentLevelXp: number;
  recentXpGained: number | null;
}

const STORAGE_KEY = 'ai_quest_state_v3';
const AUTH_SESSION_KEY = 'ai_quest_auth_session';
const XP_PER_LEVEL = 350;

export const calculateLevel = (xp: number): number => {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
};

export const getXpForLevel = (level: number): number => {
  return (level - 1) * XP_PER_LEVEL;
};

// Rich Demo user state for returning explorers:
// Level 14, 4850 XP, 12 Day Streak, Master Machine Learning 65%
export const DEMO_USER_STATE: UserState = {
  id: 'usr-explorer-01',
  username: 'AI Explorer',
  fullName: 'Alex Mercer',
  email: 'explorer@aiquest.io',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  title: 'Deep Wanderer',
  aiLevel: 'Intermediate',
  learningGoal: 'Machine Learning',
  mentor: 'Coach',
  level: 14,
  xp: 4850,
  streak: 12,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedMissions: ['m-01', 'm-02', 'm-03'], // World 1 completed
  completedQuests: ['quest-fund-1'],
  defeatedBosses: [],
  unlockedAchievements: ['ach-first-quest', 'ach-ai-explorer', 'ach-streak-7', 'ach-python-warrior'],
  mastery: {
    'AI Fundamentals': 88,
    'Machine Learning': 65,
    'Deep Learning': 28,
    'Computer Vision': 15,
    'NLP': 10,
    'Generative AI': 12,
  },
  soundEnabled: true,
  hasOnboarded: true,
  isAuthenticated: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(() => {
    if (typeof window === 'undefined') return DEMO_USER_STATE;
    try {
      const authSession = localStorage.getItem(AUTH_SESSION_KEY);
      const savedUser = localStorage.getItem(STORAGE_KEY);

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const storedAvatar = localStorage.getItem(`ai_quest_avatar_${parsed.id}`);
        return {
          ...parsed,
          avatar: storedAvatar !== null ? storedAvatar : parsed.avatar,
          isAuthenticated: Boolean(authSession),
        };
      }

      // If user had logged in previously
      if (authSession) {
        const storedAvatar = localStorage.getItem(`ai_quest_avatar_${DEMO_USER_STATE.id}`);
        return {
          ...DEMO_USER_STATE,
          avatar: storedAvatar !== null ? storedAvatar : DEMO_USER_STATE.avatar,
          isAuthenticated: true,
        };
      }
    } catch (e) {
      console.error('Failed to load user state from localStorage', e);
    }
    return {
      ...DEMO_USER_STATE,
      isAuthenticated: false,
    };
  });

  const [recentXpGained, setRecentXpGained] = useState<number | null>(null);

  // Sync sound settings with audio manager
  useEffect(() => {
    sound.enabled = user.soundEnabled;
  }, [user.soundEnabled]);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [user]);

  // Auth Methods
  const login = async (credentials: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
    const email = credentials.email.trim();
    if (!email) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!credentials.password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Simulate latency
    await new Promise((r) => setTimeout(r, 600));

    // Save session in localStorage
    const sessionData = {
      email,
      timestamp: Date.now(),
      rememberMe: credentials.rememberMe || false,
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));

    const userId = email === 'explorer@aiquest.io'
      ? DEMO_USER_STATE.id
      : `usr-${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Load user-specific profile photo from localStorage
    const storedPhoto = localStorage.getItem(`ai_quest_avatar_${userId}`);

    setUser((prev) => {
      return {
        ...prev,
        id: userId,
        email,
        username: email === 'explorer@aiquest.io' ? (prev.username || 'AI Explorer') : email.split('@')[0],
        avatar: storedPhoto !== null ? storedPhoto : (email === 'explorer@aiquest.io' ? DEMO_USER_STATE.avatar : ''),
        isAuthenticated: true,
      };
    });

    sound.playCorrect();
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 700));

    const googleEmail = 'alex.mercer@gmail.com';
    const googleUserId = 'usr-alex_mercer_gmail_com';
    localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({ email: googleEmail, provider: 'google', timestamp: Date.now() })
    );

    const storedPhoto = localStorage.getItem(`ai_quest_avatar_${googleUserId}`);

    setUser((prev) => ({
      ...prev,
      id: googleUserId,
      fullName: 'Alex Mercer',
      email: googleEmail,
      avatar: storedPhoto !== null ? storedPhoto : '',
      isAuthenticated: true,
    }));

    sound.playLevelUp();
    return { success: true };
  };

  const signup = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    const fullName = data.fullName.trim();
    const username = data.username.trim();
    const email = data.email.trim();

    if (!fullName || !username || !email) {
      return { success: false, error: 'Please provide full name, username, and email.' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    await new Promise((r) => setTimeout(r, 700));

    const newUserId = `usr-${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const storedPhoto = localStorage.getItem(`ai_quest_avatar_${newUserId}`);

    localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({ email, username, timestamp: Date.now() })
    );

    // Create fresh first-time user profile for onboarding
    const newUser: UserState = {
      id: newUserId,
      username: username,
      fullName: fullName,
      email: email,
      avatar: storedPhoto !== null ? storedPhoto : '',
      title: 'Neural Novice',
      aiLevel: 'Beginner',
      learningGoal: 'Machine Learning',
      mentor: 'Coach',
      level: 1,
      xp: 0,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedMissions: [],
      completedQuests: [],
      defeatedBosses: [],
      unlockedAchievements: [],
      mastery: {
        'AI Fundamentals': 0,
        'Machine Learning': 0,
        'Deep Learning': 0,
        'Computer Vision': 0,
        'NLP': 0,
        'Generative AI': 0,
      },
      soundEnabled: true,
      hasOnboarded: false,
      isAuthenticated: true,
    };

    setUser(newUser);
    sound.playLevelUp();
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setUser((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
    sound.playClick();
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((r) => setTimeout(r, 800));
    return {
      success: true,
      message: 'Password reset instructions have been sent.',
    };
  };

  const updateProfilePhoto = (photoDataUrl: string) => {
    try {
      localStorage.setItem(`ai_quest_avatar_${user.id}`, photoDataUrl);
      localStorage.setItem('profilePhoto', photoDataUrl);
    } catch (e) {
      console.error('Failed to store avatar in localStorage', e);
    }

    setUser((prev) => ({
      ...prev,
      avatar: photoDataUrl,
    }));
    sound.playCorrect();
  };

  const removeProfilePhoto = () => {
    try {
      localStorage.setItem(`ai_quest_avatar_${user.id}`, '');
      localStorage.removeItem('profilePhoto');
    } catch (e) {
      console.error('Failed to remove avatar from localStorage', e);
    }

    setUser((prev) => ({
      ...prev,
      avatar: '', // Cleared avatar falls back to DefaultAvatar
    }));
    sound.playClick();
  };

  // Game XP / Level Calculations
  const currentLevel = user.level;
  const currentLevelBaseXp = getXpForLevel(currentLevel);
  const nextLevelBaseXp = getXpForLevel(currentLevel + 1);
  const currentLevelXp = user.xp - currentLevelBaseXp;
  const xpToNextLevel = Math.max(0, nextLevelBaseXp - user.xp);
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentLevelXp / XP_PER_LEVEL) * 100))
  );

  const addXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        sound.playLevelUp();
        triggerConfetti();
      } else {
        sound.playXp();
      }

      setRecentXpGained(amount);
      setTimeout(() => setRecentXpGained(null), 2500);

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  const completeMission = (missionId: string, xpReward: number): boolean => {
    if (user.completedMissions.includes(missionId)) {
      sound.playCorrect();
      return false;
    }

    setUser((prev) => {
      const newCompleted = [...prev.completedMissions, missionId];
      const newXp = prev.xp + xpReward;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        sound.playLevelUp();
        triggerConfetti();
      } else {
        sound.playCorrect();
      }

      const newMastery = { ...prev.mastery };
      newMastery['Machine Learning'] = Math.min(
        100,
        (newMastery['Machine Learning'] || 65) + 5
      );

      const newAchievements = [...prev.unlockedAchievements];
      if (!newAchievements.includes('ach-first-quest')) {
        newAchievements.push('ach-first-quest');
      }

      setRecentXpGained(xpReward);
      setTimeout(() => setRecentXpGained(null), 2500);

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedMissions: newCompleted,
        mastery: newMastery,
        unlockedAchievements: newAchievements,
      };
    });

    return true;
  };

  const defeatBoss = (bossId: string, xpReward: number) => {
    setUser((prev) => {
      const newDefeated = prev.defeatedBosses.includes(bossId)
        ? prev.defeatedBosses
        : [...prev.defeatedBosses, bossId];

      const newAchievements = [...prev.unlockedAchievements];
      if (!newAchievements.includes('ach-boss-defeated')) {
        newAchievements.push('ach-boss-defeated');
      }
      if (bossId === 'boss-ml' && !newAchievements.includes('ach-ml-apprentice')) {
        newAchievements.push('ach-ml-apprentice');
      }
      if (bossId === 'boss-dl' && !newAchievements.includes('ach-neural-slayer')) {
        newAchievements.push('ach-neural-slayer');
      }

      const newXp = prev.xp + xpReward;
      const newLevel = calculateLevel(newXp);

      sound.playLevelUp();

      const newMastery = { ...prev.mastery };
      newMastery['Machine Learning'] = 100;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        defeatedBosses: newDefeated,
        unlockedAchievements: newAchievements,
        mastery: newMastery,
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setUser((prev) => {
      if (prev.unlockedAchievements.includes(achievementId)) return prev;
      sound.playCorrect();
      triggerConfetti();
      return {
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, achievementId],
      };
    });
  };

  const setMentor = (mentor: MentorType) => {
    setUser((prev) => ({ ...prev, mentor }));
  };

  const setOnboardingData = (
    aiLevel: AILevel,
    learningGoal: LearningGoal,
    mentor: MentorType
  ) => {
    setUser((prev) => ({
      ...prev,
      aiLevel,
      learningGoal,
      mentor,
      hasOnboarded: true,
    }));
  };

  const toggleSound = () => {
    setUser((prev) => {
      const next = !prev.soundEnabled;
      sound.enabled = next;
      if (next) sound.playClick();
      return { ...prev, soundEnabled: next };
    });
  };

  const resetProgress = () => {
    setUser({
      ...DEMO_USER_STATE,
      isAuthenticated: true,
    });
    localStorage.removeItem(STORAGE_KEY);
    sound.playClick();
  };

  return (
    <GameContext.Provider
      value={{
        user,
        isAuthenticated: user.isAuthenticated,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        updateProfilePhoto,
        removeProfilePhoto,
        addXp,
        completeMission,
        defeatBoss,
        unlockAchievement,
        setMentor,
        setOnboardingData,
        toggleSound,
        resetProgress,
        levelProgressPercent,
        xpToNextLevel,
        currentLevelXp,
        recentXpGained,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const useAuth = useGame;
