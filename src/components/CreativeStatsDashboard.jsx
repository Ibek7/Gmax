import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeStatsDashboard.css'

const CreativeStatsDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    totalHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: 0,
    creativeDays: 0
  })

  const [activityData, setActivityData] = useState([])
  const [categoryBreakdown, setCategoryBreakdown] = useState({
    writing: 0,
    coding: 0,
    art: 0,
    music: 0,
    games: 0
  })

  useEffect(() => {
    loadStats()
    generateMockData()
  }, [])

  const loadStats = () => {
    // Aggregate stats from various localStorage sources
    const allKeys = Object.keys(localStorage)
    
    // Count projects
    const projectKeys = allKeys.filter(key => key.includes('gmax_') && key.includes('project'))
    
    // Generate mock stats for demonstration
    setStats({
      totalProjects: 47,
      completedProjects: 32,
      activeProjects: 15,
      totalHours: 342,
      currentStreak: 12,
      longestStreak: 28,
      achievements: 24,
      creativeDays: 156
    })

    setCategoryBreakdown({
      writing: 35,
      coding: 40,
      art: 15,
      music: 5,
      games: 5
    })
  }

  const generateMockData = () => {
    // Generate last 30 days activity
    const data = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hours: Math.random() * 8
      })
    }
    setActivityData(data)
  }

  const calculateCompletionRate = () => {
    if (stats.totalProjects === 0) return 0
    return Math.round((stats.completedProjects / stats.totalProjects) * 100)
  }

  return (
    <div className="creative-stats-container">
      <div className="stats-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📊 Creative Stats Dashboard</h1>
      </div>

      <div className="stats-grid">
        {/* Key Metrics */}
        <div className="stat-card highlight">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{stats.totalProjects}</div>
          <div className="stat-label">Total Projects</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completedProjects}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-value">{stats.activeProjects}</div>
          <div className="stat-label">Active Projects</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{stats.totalHours}h</div>
          <div className="stat-label">Total Hours</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{stats.longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎖️</div>
          <div className="stat-value">{stats.achievements}</div>
          <div className="stat-label">Achievements</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.creativeDays}</div>
          <div className="stat-label">Creative Days</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="completion-section">
        <h2>Completion Rate</h2>
        <div className="completion-bar-container">
          <div className="completion-bar" style={{ width: `${calculateCompletionRate()}%` }}>
            <span className="completion-text">{calculateCompletionRate()}%</span>
          </div>
        </div>
        <p className="completion-label">
          You complete {calculateCompletionRate()}% of the projects you start!
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="category-section">
        <h2>Creative Output by Category</h2>
        <div className="category-bars">
          {Object.entries(categoryBreakdown).map(([category, percentage]) => (
            <div key={category} className="category-item">
              <div className="category-header">
                <span className="category-name">{category}</span>
                <span className="category-percentage">{percentage}%</span>
              </div>
              <div className="category-bar-container">
                <div 
                  className="category-bar" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="activity-section">
        <h2>Activity Over Last 30 Days</h2>
        <div className="activity-chart">
          {activityData.map((day, index) => (
            <div key={index} className="activity-bar-wrapper">
              <div 
                className="activity-bar"
                style={{ height: `${(day.hours / 8) * 100}%` }}
                title={`${day.date}: ${day.hours.toFixed(1)}h`}
              />
              {index % 5 === 0 && <div className="activity-label">{day.date}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h2>📈 Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">💪</div>
            <div className="insight-text">
              You're on a {stats.currentStreak}-day streak! Keep it going!
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🎨</div>
            <div className="insight-text">
              Most productive in coding projects (40% of output)
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🌟</div>
            <div className="insight-text">
              You've spent {stats.totalHours} hours creating amazing things!
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🚀</div>
            <div className="insight-text">
              {stats.activeProjects} projects are waiting for your attention
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreativeStatsDashboard
