import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MetricsDashboard.css'

const MetricsDashboard = () => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    totalGoals: 0,
    completedGoals: 0,
    totalHabits: 0,
    activeStreaks: 0,
    skillPoints: 0,
    achievements: 0,
    focusHours: 0,
    notesCreated: 0,
    bookmarks: 0
  })

  const [categoryStats, setCategoryStats] = useState([
    { name: 'Writing', icon: '✍️', count: 0, progress: 0, color: '#667eea' },
    { name: 'Art', icon: '🎨', count: 0, progress: 0, color: '#f093fb' },
    { name: 'Music', icon: '🎵', count: 0, progress: 0, color: '#4facfe' },
    { name: 'Code', icon: '💻', count: 0, progress: 0, color: '#43e97b' },
    { name: 'Games', icon: '🎮', count: 0, progress: 0, color: '#fa709a' }
  ])

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = () => {
    // Load from various localStorage keys
    const goals = JSON.parse(localStorage.getItem('gmax_daily_goals') || '[]')
    const habits = JSON.parse(localStorage.getItem('gmax_habits') || '[]')
    const skills = JSON.parse(localStorage.getItem('gmax_skill_tree') || '[]')
    const notes = JSON.parse(localStorage.getItem('gmax_quick_notes') || '[]')
    const bookmarks = JSON.parse(localStorage.getItem('gmax_bookmarks') || '[]')
    const focusSession = JSON.parse(localStorage.getItem('gmax_focus_sessions') || '[]')

    const completedGoals = goals.filter(g => g.isCompleted).length
    const activeStreaks = habits.filter(h => (h.currentStreak || 0) > 0).length
    const totalSkillPoints = skills.reduce((sum, s) => sum + (s.xp || 0), 0)
    const totalFocusMinutes = focusSession.reduce((sum, s) => sum + (s.duration || 0), 0)

    setMetrics({
      totalProjects: 12, // Placeholder
      totalGoals: goals.length,
      completedGoals: completedGoals,
      totalHabits: habits.length,
      activeStreaks: activeStreaks,
      skillPoints: totalSkillPoints,
      achievements: 8, // Placeholder
      focusHours: Math.floor(totalFocusMinutes / 60),
      notesCreated: notes.length,
      bookmarks: bookmarks.length
    })

    // Update category stats
    const updatedCategories = categoryStats.map(cat => ({
      ...cat,
      count: Math.floor(Math.random() * 20) + 5, // Placeholder
      progress: Math.floor(Math.random() * 100)
    }))
    setCategoryStats(updatedCategories)
  }

  const statCards = [
    { icon: '📁', label: 'Projects', value: metrics.totalProjects, color: '#667eea' },
    { icon: '🎯', label: 'Goals', value: `${metrics.completedGoals}/${metrics.totalGoals}`, color: '#f093fb' },
    { icon: '🔥', label: 'Streaks', value: metrics.activeStreaks, color: '#fa709a' },
    { icon: '⭐', label: 'XP Points', value: metrics.skillPoints, color: '#fee140' },
    { icon: '🏆', label: 'Achievements', value: metrics.achievements, color: '#43e97b' },
    { icon: '⏱️', label: 'Focus Hours', value: metrics.focusHours, color: '#4facfe' },
    { icon: '📝', label: 'Notes', value: metrics.notesCreated, color: '#30cfd0' },
    { icon: '📚', label: 'Bookmarks', value: metrics.bookmarks, color: '#a8edea' }
  ]

  const getCompletionPercentage = () => {
    if (metrics.totalGoals === 0) return 0
    return Math.round((metrics.completedGoals / metrics.totalGoals) * 100)
  }

  return (
    <div className="metrics-dashboard-container">
      <div className="dashboard-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>📊 Metrics Dashboard</h1>
        <button className="refresh-btn" onClick={loadMetrics}>
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ background: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>📈 Goal Completion</h3>
          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#667eea"
                strokeWidth="8"
                strokeDasharray={`${getCompletionPercentage() * 2.827} 282.7`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="progress-text">
              <span className="progress-percentage">{getCompletionPercentage()}%</span>
              <span className="progress-label">Complete</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>🎯 Category Progress</h3>
          <div className="category-bars">
            {categoryStats.map((cat, index) => (
              <div key={index} className="category-bar-item">
                <div className="category-bar-header">
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${cat.progress}%`,
                      background: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="insights-section">
        <div className="insight-card">
          <h3>🔥 Streak Champion</h3>
          <p>You have <strong>{metrics.activeStreaks}</strong> active habit streaks!</p>
          <p className="insight-detail">Keep up the momentum and maintain consistency.</p>
        </div>
        
        <div className="insight-card">
          <h3>⚡ Productivity Peak</h3>
          <p>Logged <strong>{metrics.focusHours}</strong> focus hours this month.</p>
          <p className="insight-detail">Your deep work sessions are improving!</p>
        </div>
        
        <div className="insight-card">
          <h3>📚 Knowledge Builder</h3>
          <p>Created <strong>{metrics.notesCreated}</strong> notes and saved <strong>{metrics.bookmarks}</strong> resources.</p>
          <p className="insight-detail">You're building a great knowledge base!</p>
        </div>
      </div>
    </div>
  )
}

export default MetricsDashboard
