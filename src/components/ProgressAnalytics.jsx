import React, { useState, useEffect } from 'react'
import '../styles/ProgressAnalytics.css'

const ProgressAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    gamesPlayed: 0,
    achievementsUnlocked: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0]
  })

  useEffect(() => {
    // Load analytics from localStorage
    const stored = localStorage.getItem('gmaxAnalytics')
    if (stored) {
      setAnalytics(JSON.parse(stored))
    }
  }, [])

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const maxActivity = Math.max(...analytics.weeklyActivity, 1)

  return (
    <div className="progress-analytics">
      <header className="analytics-header">
        <h1>📊 Progress Analytics</h1>
        <p>Track your creative journey and productivity patterns</p>
      </header>

      <div className="stats-overview">
        <div className="stat-box">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>{analytics.totalMinutes} min</h3>
            <p>Total Focus Time</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <h3>{analytics.gamesPlayed}</h3>
            <p>Games Played</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>{analytics.achievementsUnlocked}</h3>
            <p>Achievements</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>{analytics.currentStreak} days</h3>
            <p>Current Streak</p>
          </div>
        </div>
      </div>

      <div className="weekly-chart">
        <h2>Weekly Activity</h2>
        <div className="chart-container">
          {analytics.weeklyActivity.map((activity, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ height: `${(activity / maxActivity) * 100}%` }}
              >
                <span className="bar-value">{activity}</span>
              </div>
              <span className="bar-label">{weekDays[index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section">
        <h2>📈 Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Most Active Day</h3>
            <p>{weekDays[analytics.weeklyActivity.indexOf(Math.max(...analytics.weeklyActivity))]}</p>
          </div>
          <div className="insight-card">
            <h3>Longest Streak</h3>
            <p>{analytics.longestStreak} days</p>
          </div>
          <div className="insight-card">
            <h3>Average Daily Sessions</h3>
            <p>{(analytics.totalSessions / 7).toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressAnalytics
