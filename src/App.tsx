import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { CourseProvider } from './context/CourseContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Protected Gameplay Pages
import { DashboardPage } from './pages/DashboardPage';
import { QuestMapPage } from './pages/QuestMapPage';
import { QuestDetailPage } from './pages/QuestDetailPage';
import { MissionPage } from './pages/MissionPage';
import { AITutorPage } from './pages/AITutorPage';
import { BossBattlePage } from './pages/BossBattlePage';
import { KnowledgeTransferPage } from './pages/KnowledgeTransferPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

// Courses & Syllabus System Pages
import { CoursesPage } from './pages/CoursesPage';
import { CourseOverviewPage } from './pages/CourseOverviewPage';
import { CourseRoadmapPage } from './pages/CourseRoadmapPage';
import { SyllabusDocPage } from './pages/SyllabusDocPage';
import { LessonPage } from './pages/LessonPage';
import { BookmarksPage } from './pages/BookmarksPage';

export function App() {
  return (
    <GameProvider>
      <CourseProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Protected Routes (Requires Authentication) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:courseId" element={<CourseOverviewPage />} />
                <Route path="/courses/:courseId/roadmap" element={<CourseRoadmapPage />} />
                <Route path="/courses/:courseId/syllabus" element={<SyllabusDocPage />} />
                <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/quest-map" element={<QuestMapPage />} />
                <Route path="/quest/:id" element={<QuestDetailPage />} />
                <Route path="/mission/:id" element={<MissionPage />} />
                <Route path="/tutor" element={<AITutorPage />} />
                <Route path="/boss/:id" element={<BossBattlePage />} />
                <Route path="/knowledge-transfer" element={<KnowledgeTransferPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CourseProvider>
    </GameProvider>
  );
}

export default App;
