export type AILevel = 'Complete Beginner' | 'Beginner' | 'Intermediate' | 'Advanced';

export type LearningGoal = 
  | 'AI Fundamentals'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Computer Vision'
  | 'NLP'
  | 'Generative AI';

export type MentorType = 'Professor' | 'Coach' | 'Friend';

export interface Mentor {
  id: MentorType;
  name: string;
  role: string;
  title: string;
  avatar: string;
  tagline: string;
  description: string;
  style: string;
  accentColor: string;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';

export interface MissionOption {
  id: string;
  label: string;
  text: string;
}

export interface ConceptStep {
  label: string;
  desc: string;
  iconName?: string;
}

export interface Mission {
  id: string;
  worldId: string;
  questId: string;
  number: string; // e.g. "MISSION 04"
  title: string; // e.g. "Teach the Machine"
  topic: string; // e.g. "Supervised Learning"
  difficulty: Difficulty;
  xpReward: number; // e.g. 100
  objective: string;
  explanation: {
    overview: string;
    keyTakeaway: string;
    steps?: ConceptStep[];
    analogy?: string;
  };
  challenge: {
    prompt: string;
    options: MissionOption[];
    correctOptionId: string;
    hint: string;
    detailedSolution: string;
  };
}

export interface Quest {
  id: string;
  worldId: string;
  title: string;
  description: string;
  xpReward: number;
  requiredLevel: number;
  missionIds: string[];
  bossId?: string;
  icon: string;
  progressPercent?: number;
}

export interface World {
  id: string;
  worldNumber: number;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  glowColor: string;
  requiredLevel: number;
  totalXp: number;
  quests: Quest[];
  bossId: string;
}

export interface BossQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  damage: number;
}

export interface Boss {
  id: string;
  worldId: string;
  name: string;
  title: string;
  description: string;
  maxHp: number;
  xpReward: number;
  difficulty: string;
  avatarVariant: 'overfitter' | 'neural_colossus' | 'singularity' | 'vision_matrix';
  questions: BossQuestion[];
  rewardBadge: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: 'quest' | 'streak' | 'combat' | 'mastery';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  badges: number;
  streak: number;
  title: string;
  tier: 'Grandmaster' | 'Diamond' | 'Platinum' | 'Gold';
  isCurrentUser?: boolean;
}

export interface UserState {
  id: string;
  username: string;
  avatar: string;
  title: string;
  aiLevel: AILevel;
  learningGoal: LearningGoal;
  mentor: MentorType;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedMissions: string[]; // Mission IDs
  completedQuests: string[]; // Quest IDs
  defeatedBosses: string[]; // Boss IDs
  unlockedAchievements: string[]; // Achievement IDs
  mastery: Record<LearningGoal, number>; // 0 to 100 percentage
  soundEnabled: boolean;
  hasOnboarded: boolean;
  fullName?: string;
  email?: string;
  isAuthenticated: boolean;
}

export interface AuthCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  fullName: string;
  username: string;
  email: string;
  password?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  followupSuggestions?: string[];
  conceptTags?: string[];
}

export interface EvaluationResult {
  conceptAccuracy: number;
  clarity: number;
  completeness: number;
  overallScore: number;
  feedback: string;
  detectedKeywords: string[];
  missingKeywords: string[];
  xpAwarded: number;
}
