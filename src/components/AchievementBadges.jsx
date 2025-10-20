import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AchievementBadges.css'

const AchievementBadges = () => {
  const navigate = useNavigate()
  const [badges, setBadges] = useState([])
  const [filter, setFilter] = useState('all')

  const badgeDefinitions = [
    { id: 1, name: 'First Project', icon: '🚀', description: 'Create your first project', requirement: 'projects', threshold: 1, tier: 'bronze' },
    { id: 2, name: 'Project Explorer', icon: '🗺️', description: 'Create 5 projects', requirement: 'projects', threshold: 5, tier: 'silver' },
    { id: 3, name: 'Project Master', icon: '👑', description: 'Create 20 projects', requirement: 'projects', threshold: 20, tier: 'gold' },
    { id: 4, name: 'Early Bird', icon: '🌅', description: 'Complete a task before 8 AM', requirement: 'early_task', threshold: 1, tier: 'bronze' },
    { id: 5, name: 'Night Owl', icon: '🦉', description: 'Complete a task after 10 PM', requirement: 'night_task', threshold: 1, tier: 'bronze' },
    { id: 6, name: 'Streak Starter', icon: '🔥', description: 'Maintain a 7-day streak', requirement: 'streak', threshold: 7, tier: 'silver' },
    { id: 7, name: 'Streak Legend', icon: '⚡', description: 'Maintain a 30-day streak', requirement: 'streak', threshold: 30, tier: 'gold' },
    { id: 8, name: 'Focus Champion', icon: '🎯', description: 'Complete 10 focus sessions', requirement: 'focus', threshold: 10, tier: 'bronze' },
    { id: 9, name: 'Focus Master', icon: '🧘', description: 'Complete 50 focus sessions', requirement: 'focus', threshold: 50, tier: 'gold' },
    { id: 10, name: 'Skill Learner', icon: '📚', description: 'Track 5 different skills', requirement: 'skills', threshold: 5, tier: 'silver' },
    { id: 11, name: 'Budget Conscious', icon: '💰', description: 'Track expenses for 3 projects', requirement: 'budgets', threshold: 3, tier: 'bronze' },
    { id: 12, name: 'Energy Tracker', icon: '⚡', description: 'Log energy levels for 14 days', requirement: 'energy', threshold: 14, tier: 'silver' },
    { id: 13, name: 'Celebration King', icon: '🎉', description: 'Celebrate 25 wins', requirement: 'wins', threshold: 25, tier: 'gold' },
    { id: 14, name: 'Inspiration Collector', icon: '💡', description: 'Save 20 inspiration items', requirement: 'inspiration', threshold: 20, tier: 'silver' },
    { id: 15, name: 'Goal Achiever', icon: '✅', description: 'Complete 100 goals', requirement: 'goals', threshold: 100, tier: 'gold' },
    { id: 16, name: 'Time Capsule', icon: '⏰', description: 'Create your first time capsule', requirement: 'capsules', threshold: 1, tier: 'bronze' },
    { id: 17, name: 'Resource Hoarder', icon: '📦', description: 'Save 30 resources', requirement: 'resources', threshold: 30, tier: 'silver' },
    { id: 18, name: 'Habit Builder', icon: '🔄', description: 'Track 5 habits consistently', requirement: 'habits', threshold: 5, tier: 'bronze' }
  ]

  useEffect(() => {
    calculateProgress()
  }, [])

  const calculateProgress = () => {
    const progress = {
      projects: getStorageCount('gmax_projects'),
      focus: getStorageCount('gmax_focus_sessions'),
      skills: getStorageCount('gmax_skills_matrix'),
      budgets: getStorageCount('gmax_budget_projects'),
      energy: getStorageCount('gmax_energy_logs'),
      wins: getStorageCount('gmax_wins_journal'),
      inspiration: getStorageCount('gmax_inspiration_feed'),
      goals: getStorageCount('gmax_daily_goals'),
      capsules: getStorageCount('gmax_time_capsules'),
      resources: getStorageCount('gmax_resources'),
      habits: getStorageCount('gmax_habits'),
      streak: 0, // Would need real streak tracking
      early_task: 0, // Would need task completion timestamps
      night_task: 0 // Would need task completion timestamps
    }

    const updatedBadges = badgeDefinitions.map(badge => {
      const current = progress[badge.requirement] || 0
      const isUnlocked = current >= badge.threshold
      const percentage = Math.min((current / badge.threshold) * 100, 100)
      
      return {
        ...badge,
        unlocked: isUnlocked,
        progress: current,
        percentage: Math.round(percentage),
        unlockedAt: isUnlocked ? new Date().toISOString() : null
      }
    })

    setBadges(updatedBadges)
  }

  const getStorageCount = (key) => {
    try {
      const data = localStorage.getItem(key)
      if (!data) return 0
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length
    } catch {
      return 0
    }
  }

  const getFilteredBadges = () => {
    if (filter === 'unlocked') return badges.filter(b => b.unlocked)
    if (filter === 'locked') return badges.filter(b => !b.unlocked)
    if (filter === 'all') return badges
    return badges.filter(b => b.tier === filter)
  }

  const stats = {
    total: badges.length,
    unlocked: badges.filter(b => b.unlocked).length,
    bronze: badges.filter(b => b.unlocked && b.tier === 'bronze').length,
    silver: badges.filter(b => b.unlocked && b.tier === 'silver').length,
    gold: badges.filter(b => b.unlocked && b.tier === 'gold').length
  }

  return (
    <div className="badges-container">
      <div className="badges-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🏆 Achievement Badges</h1>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{stats.unlocked}/{stats.total}</div>
          <div className="stat-label">Badges Unlocked</div>
        </div>
        <div className="stat-card bronze">
          <div className="stat-value">{stats.bronze}</div>
          <div className="stat-label">🥉 Bronze</div>
        </div>
        <div className="stat-card silver">
          <div className="stat-value">{stats.silver}</div>
          <div className="stat-label">🥈 Silver</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-value">{stats.gold}</div>
          <div className="stat-label">🥇 Gold</div>
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'unlocked', 'locked', 'bronze', 'silver', 'gold'].map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="badges-grid">
        {getFilteredBadges().map(badge => (
          <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'} ${badge.tier}`}>
            <div className="badge-icon">{badge.icon}</div>
            <h3>{badge.name}</h3>
            <p className="badge-description">{badge.description}</p>
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${badge.percentage}%` }}></div>
              </div>
              <div className="progress-text">
                {badge.progress} / {badge.threshold} ({badge.percentage}%)
              </div>
            </div>
            {badge.unlocked && (
              <div className="unlocked-badge">✓ Unlocked!</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AchievementBadges
