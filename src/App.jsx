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
import WinsJournal from './components/WinsJournal'
import InspirationFeed from './components/InspirationFeed'
import AchievementBadges from './components/AchievementBadges'
import ProjectTemplates from './components/ProjectTemplates'
import WorkspaceThemes from './components/WorkspaceThemes'
import CollaborationInvites from './components/CollaborationInvites'
import MentorMatching from './components/MentorMatching'
import ProjectVersionHistory from './components/ProjectVersionHistory'
import BreakSuggestions from './components/BreakSuggestions'
import CreativeQuiz from './components/CreativeQuiz'
import PomodoroAdvanced from './components/PomodoroAdvanced'
import CreativeGoalsTracker from './components/CreativeGoalsTracker'
import TeamCollabBoard from './components/TeamCollabBoard'
import DailyStandup from './components/DailyStandup'
import SprintBoard from './components/SprintBoard'
import MoodBoard from './components/MoodBoard'
import FeedbackWidget from './components/FeedbackWidget'
import KnowledgeHub from './components/KnowledgeHub'
import CodeReview from './components/CodeReview'
import TimeTracker from './components/TimeTracker'
import TeamChat from './components/TeamChat'
import ProgressDashboard from './components/ProgressDashboard'
import SmartBookmarks from './components/SmartBookmarks'
import MeetingScheduler from './components/MeetingScheduler'
import FileManager from './components/FileManager'
import AnalyticsHub from './components/AnalyticsHub'
import ExpenseTracker from './components/ExpenseTracker'
import RecipeManager from './components/RecipeManager'
import FitnessPlanner from './components/FitnessPlanner'
import StudyTimer from './components/StudyTimer'
import ReadingTracker from './components/ReadingTracker'
import WeatherDashboard from './components/WeatherDashboard'
import PasswordGenerator from './components/PasswordGenerator'
import MarkdownEditor from './components/MarkdownEditor'
import CurrencyConverter from './components/CurrencyConverter'
import MusicPlayer from './components/MusicPlayer'
import ImageGallery from './components/ImageGallery'
import CodeSnippetManager from './components/CodeSnippetManager'
import TypingSpeedTest from './components/TypingSpeedTest'
import BudgetCalculator from './components/BudgetCalculator'
import MemoryGame from './components/MemoryGame'
import RecipeBook from './components/RecipeBook'
import FlashcardApp from './components/FlashcardApp'
import ExpenseSplitter from './components/ExpenseSplitter'
import QuoteGenerator from './components/QuoteGenerator'
import PomodoroTimer from './components/PomodoroTimer'
import BMICalculator from './components/BMICalculator'
import WordCounter from './components/WordCounter'
import DrawingCanvas from './components/DrawingCanvas'
import TriviaQuiz from './components/TriviaQuiz'
import UnitConverter from './components/UnitConverter'
import PasswordGenerator from './components/PasswordGenerator'
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
            <Route path="/wins-journal" element={<WinsJournal />} />
          <Route path="/inspiration-feed" element={<InspirationFeed />} />
          <Route path="/achievement-badges" element={<AchievementBadges />} />
          <Route path="/project-templates" element={<ProjectTemplates />} />
          <Route path="/workspace-themes" element={<WorkspaceThemes />} />
          <Route path="/collaboration-invites" element={<CollaborationInvites />} />
          <Route path="/mentor-matching" element={<MentorMatching />} />
          <Route path="/version-history" element={<ProjectVersionHistory />} />
          <Route path="/break-suggestions" element={<BreakSuggestions />} />
          <Route path="/creative-quiz" element={<CreativeQuiz />} />
          <Route path="/pomodoro-advanced" element={<PomodoroAdvanced />} />
          <Route path="/goals-tracker" element={<CreativeGoalsTracker />} />
          <Route path="/team-collab" element={<TeamCollabBoard />} />
          <Route path="/daily-standup" element={<DailyStandup />} />
          <Route path="/sprint-board" element={<SprintBoard />} />
          <Route path="/mood-board" element={<MoodBoard />} />
          <Route path="/feedback" element={<FeedbackWidget />} />
          <Route path="/knowledge-hub" element={<KnowledgeHub />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/time-tracker" element={<TimeTracker />} />
          <Route path="/team-chat" element={<TeamChat />} />
          <Route path="/progress-dashboard" element={<ProgressDashboard />} />
          <Route path="/smart-bookmarks" element={<SmartBookmarks />} />
          <Route path="/meeting-scheduler" element={<MeetingScheduler />} />
          <Route path="/file-manager" element={<FileManager />} />
          <Route path="/analytics-hub" element={<AnalyticsHub />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/recipe-manager" element={<RecipeManager />} />
          <Route path="/fitness-planner" element={<FitnessPlanner />} />
          <Route path="/study-timer" element={<StudyTimer />} />
          <Route path="/reading-tracker" element={<ReadingTracker />} />
          <Route path="/weather-dashboard" element={<WeatherDashboard />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/markdown-editor" element={<MarkdownEditor />} />
          <Route path="/currency-converter" element={<CurrencyConverter />} />
          <Route path="/music-player" element={<MusicPlayer />} />
          <Route path="/image-gallery" element={<ImageGallery />} />
          <Route path="/code-snippet-manager" element={<CodeSnippetManager />} />
          <Route path="/typing-speed-test" element={<TypingSpeedTest />} />
          <Route path="/budget-calculator" element={<BudgetCalculator />} />
          <Route path="/memory-game" element={<MemoryGame />} />
          <Route path="/recipe-book" element={<RecipeBook />} />
          <Route path="/flashcard-app" element={<FlashcardApp />} />
          <Route path="/expense-splitter" element={<ExpenseSplitter />} />
          <Route path="/quote-generator" element={<QuoteGenerator />} />
                    <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/word-counter" element={<WordCounter />} />
          <Route path="/drawing-canvas" element={<DrawingCanvas />} />
          <Route path="/trivia-quiz" element={<TriviaQuiz />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
        </Routes>
      </div>
    </Router>
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