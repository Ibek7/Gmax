import React, { useState, useEffect } from 'react'
import { getGameStats } from '../utils/helpers'

const ProductivityTracker = () => {
  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyStats, setMonthlyStats] = useState({})
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  useEffect(() => {
    loadProductivityData()
  }, [])

  const loadProductivityData = () => {
    // Generate weekly data for the last 7 days
    const today = new Date()
    const weekData = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toDateString()
      
      // Get stored daily progress
      const dailyProgress = JSON.parse(localStorage.getItem('dailyProgress') || '{}')
      const dayData = dailyProgress[dateString] || {
        wordsWritten: 0,
        gamesPlayed: 0,
        timeSpent: 0,
        tasksCompleted: 0
      }
      
      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        fullDate: dateString,
        ...dayData
      })
    }
    
    setWeeklyData(weekData)
    
    // Calculate streaks
    calculateStreaks(weekData)
    
    // Calculate monthly stats
    calculateMonthlyStats()
  }

  const calculateStreaks = (data) => {
    let current = 0
    let longest = 0
    let temp = 0
    
    // Calculate current streak (from today backwards)
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].tasksCompleted > 0 || data[i].gamesPlayed > 0 || data[i].wordsWritten > 0) {
        if (i === data.length - 1) current++
        temp++
      } else {
        if (i === data.length - 1) current = 0
        if (temp > longest) longest = temp
        temp = 0
      }
    }
    
    if (temp > longest) longest = temp
    
    setCurrentStreak(current)
    setLongestStreak(longest)
  }

  const calculateMonthlyStats = () => {
    const gameStats = getGameStats()
    const totalGames = Object.values(gameStats).reduce((sum, stat) => sum + stat.totalPlays, 0)
    
    // Get all daily progress for the month
    const dailyProgress = JSON.parse(localStorage.getItem('dailyProgress') || '{}')
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    
    let monthlyWords = 0
    let monthlyGames = 0
    let activeDays = 0
    
    Object.entries(dailyProgress).forEach(([dateString, data]) => {
      const date = new Date(dateString)
      if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
        monthlyWords += data.wordsWritten || 0
        monthlyGames += data.gamesPlayed || 0
        if ((data.wordsWritten || 0) + (data.gamesPlayed || 0) + (data.tasksCompleted || 0) > 0) {
          activeDays++
        }
      }
    })
    
    setMonthlyStats({
      totalWords: monthlyWords,
      totalGames: monthlyGames,
      activeDays,
      averageDaily: activeDays > 0 ? Math.round(monthlyWords / activeDays) : 0
    })
  }

  const getProgressLevel = (value, thresholds) => {
    if (value >= thresholds.high) return 'high'
    if (value >= thresholds.medium) return 'medium'
    if (value >= thresholds.low) return 'low'
    return 'none'
  }

  const ProgressBar = ({ value, max, label, color = 'var(--primary-color)' }) => {
    const percentage = Math.min((value / max) * 100, 100)
    
    return (
      <div className="progress-bar-container">
        <div className="progress-label">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color 
            }}
          />
        </div>
      </div>
    )
  }

  const MetricCard = ({ title, value, subtitle, icon, color }) => (
    <div className="metric-card" style={{ borderColor: color }}>
      <div className="metric-icon" style={{ color }}>
        {icon}
      </div>
      <div className="metric-content">
        <h3 className="metric-value">{value}</h3>
        <p className="metric-title">{title}</p>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
      </div>
    </div>
  )

  const ActivityChart = ({ data }) => (
    <div className="activity-chart">
      <h3>Weekly Activity</h3>
      <div className="chart-bars">
        {data.map((day, index) => {
          const totalActivity = (day.wordsWritten / 10) + (day.gamesPlayed * 2) + day.tasksCompleted
          const maxHeight = 100
          const height = Math.min((totalActivity / 20) * maxHeight, maxHeight)
          
          return (
            <div key={index} className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${height}px`,
                  backgroundColor: height > 50 ? 'var(--success-color)' : 
                                 height > 20 ? 'var(--warning-color)' : 
                                 'var(--text-secondary)'
                }}
                title={`${day.date}: ${Math.round(totalActivity)} activity points`}
              />
              <span className="chart-label">{day.date.split(' ')[0]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="productivity-tracker">
      <div className="tracker-header">
        <h1>Productivity Dashboard</h1>
        <div className="timeframe-selector">
          <button 
            className={selectedTimeframe === 'week' ? 'active' : ''}
            onClick={() => setSelectedTimeframe('week')}
          >
            This Week
          </button>
          <button 
            className={selectedTimeframe === 'month' ? 'active' : ''}
            onClick={() => setSelectedTimeframe('month')}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Current Streak"
          value={`${currentStreak} days`}
          subtitle="Keep it going!"
          icon="🔥"
          color="var(--error-color)"
        />
        <MetricCard
          title="Longest Streak"
          value={`${longestStreak} days`}
          subtitle="Personal best"
          icon="🏆"
          color="var(--warning-color)"
        />
        <MetricCard
          title="Words Written"
          value={monthlyStats.totalWords || 0}
          subtitle="This month"
          icon="✍️"
          color="var(--primary-color)"
        />
        <MetricCard
          title="Games Played"
          value={monthlyStats.totalGames || 0}
          subtitle="This month"
          icon="🎮"
          color="var(--accent-color)"
        />
      </div>

      {selectedTimeframe === 'week' && (
        <div className="weekly-section">
          <ActivityChart data={weeklyData} />
          
          <div className="daily-goals">
            <h3>Today's Progress</h3>
            {weeklyData.length > 0 && (
              <div className="goals-grid">
                <ProgressBar 
                  value={weeklyData[weeklyData.length - 1]?.wordsWritten || 0}
                  max={500}
                  label="Words Written"
                  color="var(--primary-color)"
                />
                <ProgressBar 
                  value={weeklyData[weeklyData.length - 1]?.gamesPlayed || 0}
                  max={5}
                  label="Games Played"
                  color="var(--accent-color)"
                />
                <ProgressBar 
                  value={weeklyData[weeklyData.length - 1]?.tasksCompleted || 0}
                  max={10}
                  label="Tasks Completed"
                  color="var(--success-color)"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTimeframe === 'month' && (
        <div className="monthly-section">
          <div className="monthly-stats">
            <h3>Monthly Overview</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Active Days</span>
                <span className="stat-value">{monthlyStats.activeDays || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average Words/Day</span>
                <span className="stat-value">{monthlyStats.averageDaily || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Sessions</span>
                <span className="stat-value">{(monthlyStats.totalGames || 0) + (monthlyStats.activeDays || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="insights-section">
        <h3>Insights & Tips</h3>
        <div className="insights-grid">
          {currentStreak >= 7 && (
            <div className="insight-card positive">
              <span className="insight-icon">🌟</span>
              <p>Amazing! You're on a week-long streak. Consistency is key to creative growth!</p>
            </div>
          )}
          {monthlyStats.averageDaily > 300 && (
            <div className="insight-card positive">
              <span className="insight-icon">📈</span>
              <p>You're averaging over 300 words per day - that's excellent progress!</p>
            </div>
          )}
          {currentStreak === 0 && (
            <div className="insight-card motivational">
              <span className="insight-icon">💪</span>
              <p>Every journey starts with a single step. Start your streak today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductivityTracker