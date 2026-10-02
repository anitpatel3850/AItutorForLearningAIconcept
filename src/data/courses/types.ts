export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeSnippet {
  language: string;
  code: string;
  explanation: string;
  output?: string;
}

export interface PracticalExample {
  title: string;
  scenario: string;
  solution: string;
}

export interface MiniQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeChallenge {
  prompt: string;
  starterCode?: string;
  solutionHint: string;
  solutionCode?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  xpReward: number;
  learningObjective: string;
  explanation: string;
  importantConcepts: string[];
  keyPoints: string[];
  codeExample?: CodeSnippet;
  practicalExample: PracticalExample;
  quiz: MiniQuiz;
  practiceChallenge: PracticeChallenge;
  relatedMissionId?: string;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  difficulty: CourseLevel;
  estimatedMinutes: number;
  xpReward: number;
  lessons: CourseLesson[];
  project?: {
    title: string;
    description: string;
    xpReward: number;
  };
  bossBattle?: {
    bossId: string;
    bossName: string;
    xpReward: number;
  };
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  iconName: string; // Lucide icon identifier e.g. 'Terminal', 'Brain', 'Cpu', 'Layers', 'Eye', 'Sparkles'
  level: CourseLevel;
  category: string;
  estimatedHours: number;
  badge: string;
  accentColor: string; // Tailwind gradient / border accent e.g. 'cyan' | 'purple' | 'emerald' | 'amber' | 'pink'
  whatYouWillLearn: string[];
  prerequisites: string[];
  skillsYouWillGain: string[];
  completionRequirements: string[];
  modules: CourseModule[];
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  xp: number;
  progressPercentage: number;
  currentLessonId?: string;
  currentModuleId?: string;
  lastAccessedDate: string;
}

export interface Bookmark {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  addedAt: string;
}

export interface SearchResultItem {
  type: 'course' | 'module' | 'lesson';
  courseId: string;
  courseTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  snippet: string;
}
