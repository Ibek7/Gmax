import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import GamesHub from './components/GamesHub'
import CreativeWriting from './components/CreativeWriting'
import ArtGallery from './components/ArtGallery'
import MusicLab from './components/MusicLab'
import CodeShowcase from './components/CodeShowcase'
import AchievementShowcase from './components/AchievementShowcase'
import ProductivityTracker from './components/ProductivityTracker'
import UserSettings from './components/UserSettings'
import DataManager from './components/DataManager'
import SocialShare from './components/SocialShare'
import AchievementSystem from './components/AchievementSystem'
import ProgressAnalytics from './components/ProgressAnalytics'
import QuickActionsMenu from './components/QuickActionsMenu'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import ProgressExporter from './components/ProgressExporter'
import CreativeChallenges from './components/CreativeChallenges'
import VoiceNotes from './components/VoiceNotes'
import MoodTracker from './components/MoodTracker'
import NotificationsCenter from './components/NotificationsCenter'
import OnboardingTutorial from './components/OnboardingTutorial'
import FocusTimer from './components/FocusTimer'
import ProjectTemplates from './components/ProjectTemplates'
import DailyGoals from './components/DailyGoals'
import HabitTracker from './components/HabitTracker'
import WeeklyReview from './components/WeeklyReview'
import SkillTree from './components/SkillTree'
import InspirationGallery from './components/InspirationGallery'
import ResourceLibrary from './components/ResourceLibrary'
import TimeCapsule from './components/TimeCapsule'
import CreativeCalendar from './components/CreativeCalendar'
import BookmarksManager from './components/BookmarksManager'
import QuickNotes from './components/QuickNotes'
import MetricsDashboard from './components/MetricsDashboard'
import DailyPrompts from './components/DailyPrompts'
import ProjectTimeline from './components/ProjectTimeline'
import RewardsSystem from './components/RewardsSystem'
import NotFound from './components/NotFound'
import './styles/App.css'

function App() {
  const [currentTheme, setCurrentTheme] = useState('default')

  return (
    <Router>
      <div className={`app theme-${currentTheme}`}>
        <Navigation currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        <QuickActionsMenu />
        <KeyboardShortcuts />
        <NotificationsCenter />
        <OnboardingTutorial />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<GamesHub />} />
            <Route path="/writing" element={<CreativeWriting />} />
            <Route path="/art" element={<ArtGallery />} />
            <Route path="/music" element={<MusicLab />} />
            <Route path="/code" element={<CodeShowcase />} />
            <Route path="/achievements" element={<AchievementShowcase />} />
            <Route path="/achievement-system" element={<AchievementSystem />} />
            <Route path="/analytics" element={<ProgressAnalytics />} />
            <Route path="/export" element={<ProgressExporter />} />
            <Route path="/challenges" element={<CreativeChallenges />} />
            <Route path="/voice-notes" element={<VoiceNotes />} />
            <Route path="/mood-tracker" element={<MoodTracker />} />
            <Route path="/focus-timer" element={<FocusTimer />} />
            <Route path="/templates" element={<ProjectTemplates />} />
            <Route path="/daily-goals" element={<DailyGoals />} />
            <Route path="/habit-tracker" element={<HabitTracker />} />
            <Route path="/weekly-review" element={<WeeklyReview />} />
            <Route path="/skill-tree" element={<SkillTree />} />
            <Route path="/inspiration" element={<InspirationGallery />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/time-capsule" element={<TimeCapsule />} />
            <Route path="/calendar" element={<CreativeCalendar />} />
            <Route path="/bookmarks" element={<BookmarksManager />} />
            <Route path="/quick-notes" element={<QuickNotes />} />
            <Route path="/metrics" element={<MetricsDashboard />} />
            <Route path="/daily-prompts" element={<DailyPrompts />} />
            <Route path="/project-timeline" element={<ProjectTimeline />} />
            <Route path="/rewards" element={<RewardsSystem />} />
            <Route path="/productivity" element={<ProductivityTracker />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/data" element={<DataManager />} />
            <Route path="/share" element={<SocialShare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App