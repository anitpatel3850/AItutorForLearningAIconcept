import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, CourseProgress, Bookmark, CourseModule, CourseLesson } from '../data/courses/types';
import { ALL_COURSES, getCourseById, getLessonById } from '../data/courses';
import { useGame } from './GameContext';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface CourseContextType {
  courses: Course[];
  progress: Record<string, CourseProgress>;
  bookmarks: Bookmark[];
  getCourseProgress: (courseId: string) => CourseProgress;
  completeLesson: (courseId: string, moduleId: string, lessonId: string, xpReward?: number) => { isModuleCompleted: boolean; isCourseCompleted: boolean };
  completeQuiz: (courseId: string, lessonId: string, xpReward?: number) => void;
  toggleBookmark: (bookmark: Omit<Bookmark, 'id' | 'addedAt'>) => boolean;
  isBookmarked: (lessonId: string) => boolean;
  removeBookmark: (lessonId: string) => void;
  lastActiveItem: {
    course: Course;
    module: CourseModule;
    lesson: CourseLesson;
    progress: CourseProgress;
  } | null;
  enrolledCourses: Course[];
  recommendedCourses: Course[];
  completedCourses: Course[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Initial mock progress for demo user so UI looks rich and realistic immediately
const DEFAULT_INITIAL_PROGRESS: Record<string, CourseProgress> = {
  'machine-learning': {
    courseId: 'machine-learning',
    completedLessons: ['ml-l1-paradigms', 'ml-l2-loss-optimization', 'ml-l3-imputation'],
    completedModules: ['ml-m1'],
    xp: 350,
    progressPercentage: 35,
    currentLessonId: 'ml-l4-regression',
    currentModuleId: 'ml-m3',
    lastAccessedDate: new Date().toISOString()
  },
  'python-for-ai': {
    courseId: 'python-for-ai',
    completedLessons: ['py-l1-variables', 'py-l2-operators', 'py-l3-loops', 'py-l4-functions'],
    completedModules: ['py-m1'],
    xp: 280,
    progressPercentage: 45,
    currentLessonId: 'py-l5-lists-tuples',
    currentModuleId: 'py-m2',
    lastAccessedDate: new Date(Date.now() - 86400000).toISOString()
  }
};

const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    courseId: 'machine-learning',
    courseTitle: 'Machine Learning',
    moduleId: 'ml-m1',
    moduleTitle: 'ML Foundations & Core Paradigms',
    lessonId: 'ml-l2-loss-optimization',
    lessonTitle: 'Cost Functions & Gradient Descent',
    addedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'bm-2',
    courseId: 'python-for-ai',
    courseTitle: 'Python for AI',
    moduleId: 'py-m1',
    moduleTitle: 'Python Foundations',
    lessonId: 'py-l4-functions',
    lessonTitle: 'Functions & Lambda Expressions',
    addedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addXp, unlockAchievement } = useGame();

  const progressKey = `ai_quest_courses_progress_${user?.id || 'default'}`;
  const bookmarksKey = `ai_quest_bookmarks_${user?.id || 'default'}`;

  const [progress, setProgress] = useState<Record<string, CourseProgress>>(() => {
    if (typeof window === 'undefined') return DEFAULT_INITIAL_PROGRESS;
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load course progress', e);
    }
    return DEFAULT_INITIAL_PROGRESS;
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_BOOKMARKS;
    try {
      const saved = localStorage.getItem(bookmarksKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
    return DEFAULT_BOOKMARKS;
  });

  // Sync with user change or localStorage
  useEffect(() => {
    try {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to persist course progress', e);
    }
  }, [progress, progressKey]);

  useEffect(() => {
    try {
      localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to persist bookmarks', e);
    }
  }, [bookmarks, bookmarksKey]);

  const getCourseProgress = (courseId: string): CourseProgress => {
    if (progress[courseId]) {
      return progress[courseId];
    }
    return {
      courseId,
      completedLessons: [],
      completedModules: [],
      xp: 0,
      progressPercentage: 0,
      lastAccessedDate: new Date().toISOString()
    };
  };

  const completeLesson = (
    courseId: string,
    moduleId: string,
    lessonId: string,
    xpReward = 20
  ) => {
    const course = getCourseById(courseId);
    if (!course) return { isModuleCompleted: false, isCourseCompleted: false };

    const targetModule = course.modules.find((m) => m.id === moduleId);
    const currentProgress = getCourseProgress(courseId);

    const alreadyDone = currentProgress.completedLessons.includes(lessonId);
    let newCompletedLessons = currentProgress.completedLessons;

    if (!alreadyDone) {
      newCompletedLessons = [...currentProgress.completedLessons, lessonId];
      addXp(xpReward, `Completed Lesson: ${lessonId}`);
      unlockAchievement('ach-first-lesson');
      if (newCompletedLessons.length >= 5) {
        unlockAchievement('ach-knowledge-seeker');
      }
    }

    // Check if module is complete
    let isModuleCompleted = false;
    let newCompletedModules = [...currentProgress.completedModules];

    if (targetModule) {
      const allModuleLessonsDone = targetModule.lessons.every((l) =>
        newCompletedLessons.includes(l.id)
      );

      if (allModuleLessonsDone && !newCompletedModules.includes(moduleId)) {
        isModuleCompleted = true;
        newCompletedModules.push(moduleId);
        addXp(200, `Completed Module: ${targetModule.title}`);
        unlockAchievement('ach-first-module');
        if (newCompletedModules.length >= 3) {
          unlockAchievement('ach-module-master');
        }
        triggerConfetti();
        sound.playLevelUp();
      }
    }

    // Check if whole course is complete
    const totalLessonsInCourse = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const progressPercentage = Math.min(
      100,
      Math.round((newCompletedLessons.length / Math.max(1, totalLessonsInCourse)) * 100)
    );

    const isCourseCompleted = progressPercentage >= 100;
    if (isCourseCompleted && currentProgress.progressPercentage < 100) {
      addXp(500, `Completed Course: ${course.title}`);
      unlockAchievement('ach-course-champion');
      triggerConfetti();
      sound.playLevelUp();
    }

    // Determine next lesson id if any
    let nextLessonId: string | undefined = undefined;
    let nextModuleId: string | undefined = undefined;

    const allLessonsFlattened = course.modules.flatMap((m) =>
      m.lessons.map((l) => ({ lessonId: l.id, moduleId: m.id }))
    );
    const currentIndex = allLessonsFlattened.findIndex((item) => item.lessonId === lessonId);
    if (currentIndex >= 0 && currentIndex < allLessonsFlattened.length - 1) {
      nextLessonId = allLessonsFlattened[currentIndex + 1].lessonId;
      nextModuleId = allLessonsFlattened[currentIndex + 1].moduleId;
    }

    const updated: CourseProgress = {
      ...currentProgress,
      completedLessons: newCompletedLessons,
      completedModules: newCompletedModules,
      xp: currentProgress.xp + (alreadyDone ? 0 : xpReward) + (isModuleCompleted ? 200 : 0),
      progressPercentage,
      currentLessonId: nextLessonId || lessonId,
      currentModuleId: nextModuleId || moduleId,
      lastAccessedDate: new Date().toISOString()
    };

    setProgress((prev) => ({
      ...prev,
      [courseId]: updated
    }));

    if (!alreadyDone) {
      sound.playCorrect();
    }

    return { isModuleCompleted, isCourseCompleted };
  };

  const completeQuiz = (courseId: string, lessonId: string, xpReward = 30) => {
    addXp(xpReward, `Quiz Mastered in ${lessonId}`);
    sound.playXp();
  };

  const toggleBookmark = (item: Omit<Bookmark, 'id' | 'addedAt'>): boolean => {
    const existingIndex = bookmarks.findIndex((b) => b.lessonId === item.lessonId);
    sound.playClick();

    if (existingIndex >= 0) {
      // Remove
      setBookmarks((prev) => prev.filter((b) => b.lessonId !== item.lessonId));
      return false;
    } else {
      // Add
      const newBm: Bookmark = {
        ...item,
        id: `bm-${Date.now()}`,
        addedAt: new Date().toISOString()
      };
      setBookmarks((prev) => [newBm, ...prev]);
      return true;
    }
  };

  const removeBookmark = (lessonId: string) => {
    sound.playClick();
    setBookmarks((prev) => prev.filter((b) => b.lessonId !== lessonId));
  };

  const isBookmarked = (lessonId: string): boolean => {
    return bookmarks.some((b) => b.lessonId === lessonId);
  };

  // Derive last active course for the "CONTINUE LEARNING" dashboard hero
  const activeCourseEntries = Object.values(progress).sort(
    (a, b) => new Date(b.lastAccessedDate).getTime() - new Date(a.lastAccessedDate).getTime()
  );

  let lastActiveItem: CourseContextType['lastActiveItem'] = null;

  if (activeCourseEntries.length > 0) {
    const topEntry = activeCourseEntries[0];
    const course = getCourseById(topEntry.courseId);
    if (course) {
      const lessonResult = topEntry.currentLessonId
        ? getLessonById(course.id, topEntry.currentLessonId)
        : null;

      const fallbackModule = course.modules[0];
      const fallbackLesson = fallbackModule?.lessons[0];

      if (lessonResult) {
        lastActiveItem = {
          course,
          module: lessonResult.module,
          lesson: lessonResult.lesson,
          progress: topEntry
        };
      } else if (fallbackModule && fallbackLesson) {
        lastActiveItem = {
          course,
          module: fallbackModule,
          lesson: fallbackLesson,
          progress: topEntry
        };
      }
    }
  }

  // If no progress at all, default to Machine Learning Course & first lesson
  if (!lastActiveItem) {
    const defaultCourse = ALL_COURSES[2]; // Machine Learning
    const defaultModule = defaultCourse.modules[0];
    const defaultLesson = defaultModule.lessons[0];
    lastActiveItem = {
      course: defaultCourse,
      module: defaultModule,
      lesson: defaultLesson,
      progress: getCourseProgress(defaultCourse.id)
    };
  }

  // Categorize courses for Dashboard
  const enrolledCourses = ALL_COURSES.filter(
    (c) => (progress[c.id]?.completedLessons.length || 0) > 0 && (progress[c.id]?.progressPercentage || 0) < 100
  );

  const completedCourses = ALL_COURSES.filter(
    (c) => (progress[c.id]?.progressPercentage || 0) >= 100
  );

  const recommendedCourses = ALL_COURSES.filter(
    (c) => !enrolledCourses.some((e) => e.id === c.id) && !completedCourses.some((comp) => comp.id === c.id)
  );

  return (
    <CourseContext.Provider
      value={{
        courses: ALL_COURSES,
        progress,
        bookmarks,
        getCourseProgress,
        completeLesson,
        completeQuiz,
        toggleBookmark,
        isBookmarked,
        removeBookmark,
        lastActiveItem,
        enrolledCourses: enrolledCourses.length > 0 ? enrolledCourses : [ALL_COURSES[2], ALL_COURSES[0]],
        recommendedCourses,
        completedCourses
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
