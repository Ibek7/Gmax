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
import ZenMode from './components/ZenMode'
import ActivityFeed from './components/ActivityFeed'
import LearningPaths from './components/LearningPaths'
import CollaborationHub from './components/CollaborationHub'
import WritingSprintTimer from './components/WritingSprintTimer'
import CreativeJournal from './components/CreativeJournal'
import PortfolioShowcase from './components/PortfolioShowcase'
import IdeaIncubator from './components/IdeaIncubator'
import CreativeStreaks from './components/CreativeStreaks'
import MusicPlaylistCreator from './components/MusicPlaylistCreator'
import CodeSnippetsLibrary from './components/CodeSnippetsLibrary'
import ArtReferenceBoard from './components/ArtReferenceBoard'
import ChallengeLeaderboard from './components/ChallengeLeaderboard'
import CreativeVisionBoard from './components/CreativeVisionBoard'
import DailyAffirmations from './components/DailyAffirmations'
import CreativeToolbox from './components/CreativeToolbox'
import ProjectGraveyard from './components/ProjectGraveyard'
import CreativeStatsDashboard from './components/CreativeStatsDashboard'
import FocusSessionTimer from './components/FocusSessionTimer'
import ProjectRoadmap from './components/ProjectRoadmap'
import SkillsMatrix from './components/SkillsMatrix'
import BudgetTracker from './components/BudgetTracker'
import EnergyTracker from './components/EnergyTracker'
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
            <Route path="/zen-mode" element={<ZenMode />} />
            <Route path="/activity-feed" element={<ActivityFeed />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/collaboration" element={<CollaborationHub />} />
            <Route path="/writing-sprint" element={<WritingSprintTimer />} />
            <Route path="/creative-journal" element={<CreativeJournal />} />
            <Route path="/portfolio" element={<PortfolioShowcase />} />
            <Route path="/idea-incubator" element={<IdeaIncubator />} />
            <Route path="/creative-streaks" element={<CreativeStreaks />} />
            <Route path="/music-playlist" element={<MusicPlaylistCreator />} />
            <Route path="/code-snippets" element={<CodeSnippetsLibrary />} />
            <Route path="/art-references" element={<ArtReferenceBoard />} />
            <Route path="/leaderboard" element={<ChallengeLeaderboard />} />
            <Route path="/vision-board" element={<CreativeVisionBoard />} />
            <Route path="/affirmations" element={<DailyAffirmations />} />
            <Route path="/toolbox" element={<CreativeToolbox />} />
            <Route path="/project-graveyard" element={<ProjectGraveyard />} />
            <Route path="/stats" element={<CreativeStatsDashboard />} />
            <Route path="/focus-timer" element={<FocusSessionTimer />} />
            <Route path="/roadmap" element={<ProjectRoadmap />} />
            <Route path="/skills-matrix" element={<SkillsMatrix />} />
            <Route path="/budget-tracker" element={<BudgetTracker />} />
            <Route path="/energy-tracker" element={<EnergyTracker />} />
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