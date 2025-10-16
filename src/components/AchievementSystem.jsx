import React, { useState, useEffect } from 'react'
import '../styles/AchievementSystem.css'

const ACHIEVEMENTS_KEY = 'gmaxAchievements'

const achievementsList = [
  { id: 'first_visit', title: 'Welcome!', description: 'Visited Gmax for the first time', icon: '👋', unlocked: false },
  { id: 'daily_streak_3', title: '3-Day Streak', description: 'Logged in for 3 consecutive days', icon: '🔥', unlocked: false },
  { id: 'daily_streak_7', title: 'Week Warrior', description: '7-day login streak', icon: '⚡', unlocked: false },
  { id: 'games_master', title: 'Games Master', description: 'Played all mini-games', icon: '🎮', unlocked: false },
  { id: 'creative_mind', title: 'Creative Mind', description: 'Completed 10 creative challenges', icon: '🧠', unlocked: false },
  { id: 'time_manager', title: 'Time Manager', description: 'Used the timer for 5 sessions', icon: '⏱️', unlocked: false },
  { id: 'feedback_hero', title: 'Feedback Hero', description: 'Submitted feedback', icon: '💬', unlocked: false },
  { id: 'theme_explorer', title: 'Theme Explorer', description: 'Switched themes', icon: '🎨', unlocked: false },
]

const AchievementSystem = () => {
  const [achievements, setAchievements] = useState(achievementsList)
  const [showNotification, setShowNotification] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
    if (stored) {
      setAchievements(JSON.parse(stored))
    } else {
      // Unlock first visit achievement
      unlockAchievement('first_visit')
    }
  }, [])

  const unlockAchievement = (id) => {
    const updated = achievements.map(ach => 
      ach.id === id ? { ...ach, unlocked: true } : ach
    )
    setAchievements(updated)
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated))
    
    const achievement = updated.find(ach => ach.id === id)
    setShowNotification(achievement)
    setTimeout(() => setShowNotification(null), 3000)
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="achievement-system">
      <div className="achievement-header">
        <h2>🏆 Achievements</h2>
        <p className="achievement-progress">{unlockedCount} / {totalCount} Unlocked</p>
      </div>
      
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            {achievement.unlocked && <span className="unlocked-badge">✓ Unlocked</span>}
          </div>
        ))}
      </div>

      {showNotification && (
        <div className="achievement-notification">
          <span className="notif-icon">{showNotification.icon}</span>
          <div>
            <strong>Achievement Unlocked!</strong>
            <p>{showNotification.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AchievementSystem
