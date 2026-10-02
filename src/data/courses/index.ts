import { Course, SearchResultItem } from './types';
import { pythonCourse } from './python';
import { machineLearningCourse } from './machineLearning';
import { deepLearningCourse } from './deepLearning';
import { computerVisionCourse } from './computerVision';
import { nlpCourse } from './nlp';
import { generativeAICourse } from './generativeAI';
import { dataScienceCourse } from './dataScience';
import { artificialIntelligenceCourse } from './artificialIntelligence';
import { algorithmsCourse } from './algorithms';

export * from './types';

export const ALL_COURSES: Course[] = [
  pythonCourse,
  artificialIntelligenceCourse,
  machineLearningCourse,
  deepLearningCourse,
  computerVisionCourse,
  nlpCourse,
  generativeAICourse,
  dataScienceCourse,
  algorithmsCourse
];

export const getCourseById = (id: string): Course | undefined => {
  return ALL_COURSES.find((c) => c.id === id);
};

export const getModuleById = (courseId: string, moduleId: string) => {
  const course = getCourseById(courseId);
  return course?.modules.find((m) => m.id === moduleId);
};

export const getLessonById = (courseId: string, lessonId: string) => {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  for (const module of course.modules) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      return { lesson, module, course };
    }
  }
  return undefined;
};

// Global documentation search across courses, modules, lessons, and topics
export const searchCoursesAndDocs = (query: string): SearchResultItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  for (const course of ALL_COURSES) {
    // Check course title and description
    if (course.title.toLowerCase().includes(q) || course.shortDescription.toLowerCase().includes(q)) {
      results.push({
        type: 'course',
        courseId: course.id,
        courseTitle: course.title,
        snippet: course.shortDescription
      });
    }

    for (const module of course.modules) {
      // Check module title and description
      if (module.title.toLowerCase().includes(q) || module.description.toLowerCase().includes(q)) {
        results.push({
          type: 'module',
          courseId: course.id,
          courseTitle: course.title,
          moduleId: module.id,
          moduleTitle: module.title,
          snippet: module.description
        });
      }

      for (const lesson of module.lessons) {
        // Check lesson title, description, and keywords
        const matchesTitle = lesson.title.toLowerCase().includes(q);
        const matchesDesc = lesson.description.toLowerCase().includes(q);
        const matchesExpl = lesson.explanation.toLowerCase().includes(q);
        const matchesConcepts = lesson.importantConcepts.some(c => c.toLowerCase().includes(q));

        if (matchesTitle || matchesDesc || matchesExpl || matchesConcepts) {
          results.push({
            type: 'lesson',
            courseId: course.id,
            courseTitle: course.title,
            moduleId: module.id,
            moduleTitle: module.title,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            snippet: matchesTitle ? lesson.description : (matchesConcepts ? lesson.importantConcepts.find(c => c.toLowerCase().includes(q)) || lesson.description : lesson.description)
          });
        }
      }
    }
  }

  return results.slice(0, 25); // cap at top 25 matches
};
