import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/WeeklyReview.css'

function WeeklyReview() {
  const navigate = useNavigate()
  const [currentWeek, setCurrentWeek] = useState(null)
  const [weeklyData, setWeeklyData] = useState(null)
  const [reflection, setReflection] = useState({ wins: '', challenges: '', nextWeek: '' })
  const [showReflection, setShowReflection] = useState(false)

  useEffect(() => {
    loadWeeklyData()
  }, [])

  const getWeekNumber = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = now - start
    const oneWeek = 1000 * 60 * 60 * 24 * 7
    return Math.floor(diff / oneWeek)
  }

  const getWeekRange = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    return {
      start: monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const loadWeeklyData = () => {
    const weekNum = getWeekNumber()
    setCurrentWeek(weekNum)

    // Gather data from various localStorage sources
    const goals = JSON.parse(localStorage.getItem('dailyGoals') || '{}')
    const goalsStats = JSON.parse(localStorage.getItem('goalsStats') || '{}')
    const focusSessions = parseInt(localStorage.getItem('focusSessions') || '0')
    const totalFocusTime = parseInt(localStorage.getItem('totalFocusTime') || '0')
    const habits = JSON.parse(localStorage.getItem('habits') || '[]')
    const challenges = JSON.parse(localStorage.getItem('challenges') || '[]')
    const moods = JSON.parse(localStorage.getItem('moodHistory') || '[]')
    
    // Calculate weekly metrics
    const weeklyReflections = JSON.parse(localStorage.getItem('weeklyReflections') || '{}')
    const savedReflection = weeklyReflections[weekNum] || { wins: '', challenges: '', nextWeek: '' }
    
    setReflection(savedReflection)
    setWeeklyData({
      goalsCompleted: goalsStats.total || 0,
      currentStreak: goalsStats.streak || 0,
      focusSessions,
      focusHours: Math.floor(totalFocusTime / 60),
      habitsTracked: habits.length,
      challengesCompleted: challenges.filter(c => c.completed).length,
      moodEntries: moods.length,
      productivity: calculateProductivityScore(goalsStats, focusSessions, habits)
    })
  }

  const calculateProductivityScore = (goals, sessions, habits) => {
    let score = 0
    score += Math.min(goals.streak * 5, 50) // Up to 50 points for streak
    score += Math.min(sessions * 2, 30) // Up to 30 points for focus sessions
    score += Math.min(habits.length * 4, 20) // Up to 20 points for habits
    return Math.min(score, 100)
  }

  const saveReflection = () => {
    const weeklyReflections = JSON.parse(localStorage.getItem('weeklyReflections') || '{}')
    weeklyReflections[currentWeek] = reflection
    localStorage.setItem('weeklyReflections', JSON.stringify(weeklyReflections))
    setShowReflection(false)
    alert('✅ Weekly reflection saved!')
  }

  const weekRange = getWeekRange()

  if (!weeklyData) {
    return <div className="loading">Loading weekly data...</div>
  }

  return (
    <div className="weekly-review-container">
      <div className="review-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-content">
          <h1>📊 Weekly Review</h1>
          <p className="week-range">Week {currentWeek} • {weekRange.start} - {weekRange.end}</p>
        </div>
        <button className="reflect-btn" onClick={() => setShowReflection(true)}>
          ✍️ Reflect
        </button>
      </div>

      {showReflection && (
        <div className="reflection-modal">
          <div className="modal-content">
            <h2>Weekly Reflection</h2>
            
            <div className="reflection-group">
              <label>🎉 Wins & Accomplishments</label>
              <textarea
                placeholder="What went well this week? What are you proud of?"
                value={reflection.wins}
                onChange={(e) => setReflection({ ...reflection, wins: e.target.value })}
                rows="4"
              />
            </div>

            <div className="reflection-group">
              <label>💪 Challenges & Learnings</label>
              <textarea
                placeholder="What challenges did you face? What did you learn?"
                value={reflection.challenges}
                onChange={(e) => setReflection({ ...reflection, challenges: e.target.value })}
                rows="4"
              />
            </div>

            <div className="reflection-group">
              <label>🎯 Focus for Next Week</label>
              <textarea
                placeholder="What will you prioritize next week?"
                value={reflection.nextWeek}
                onChange={(e) => setReflection({ ...reflection, nextWeek: e.target.value })}
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowReflection(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveReflection}>
                Save Reflection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="productivity-score-card">
        <div className="score-circle">
          <svg width="180" height="180">
            <circle cx="90" cy="90" r="75" fill="none" stroke="#e0e0e0" strokeWidth="15" />
            <circle
              cx="90"
              cy="90"
              r="75"
              fill="none"
              stroke="#667eea"
              strokeWidth="15"
              strokeDasharray={`${2 * Math.PI * 75}`}
              strokeDashoffset={`${2 * Math.PI * 75 * (1 - weeklyData.productivity / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
            />
          </svg>
          <div className="score-text">
            <div className="score-value">{weeklyData.productivity}</div>
            <div className="score-label">Productivity</div>
          </div>
        </div>
        <div className="score-description">
          <h3>This Week's Performance</h3>
          <p>
            {weeklyData.productivity >= 80 ? '🌟 Outstanding! You had an incredible week!' :
             weeklyData.productivity >= 60 ? '🎯 Great work! Keep up the momentum!' :
             weeklyData.productivity >= 40 ? '👍 Good effort! Room for improvement!' :
             '💪 Let\'s aim higher next week!'}
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{weeklyData.goalsCompleted}</div>
          <div className="metric-label">Goals Completed</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🔥</div>
          <div className="metric-value">{weeklyData.currentStreak}</div>
          <div className="metric-label">Current Streak</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-value">{weeklyData.focusSessions}</div>
          <div className="metric-label">Focus Sessions</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏰</div>
          <div className="metric-value">{weeklyData.focusHours}h</div>
          <div className="metric-label">Focus Time</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🌱</div>
          <div className="metric-value">{weeklyData.habitsTracked}</div>
          <div className="metric-label">Habits Tracked</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🏆</div>
          <div className="metric-value">{weeklyData.challengesCompleted}</div>
          <div className="metric-label">Challenges Done</div>
        </div>
      </div>

      {(reflection.wins || reflection.challenges || reflection.nextWeek) && (
        <div className="reflection-summary">
          <h3>📝 Your Reflections</h3>
          
          {reflection.wins && (
            <div className="reflection-section">
              <h4>🎉 Wins & Accomplishments</h4>
              <p>{reflection.wins}</p>
            </div>
          )}
          
          {reflection.challenges && (
            <div className="reflection-section">
              <h4>💪 Challenges & Learnings</h4>
              <p>{reflection.challenges}</p>
            </div>
          )}
          
          {reflection.nextWeek && (
            <div className="reflection-section">
              <h4>🎯 Focus for Next Week</h4>
              <p>{reflection.nextWeek}</p>
            </div>
          )}
        </div>
      )}

      <div className="insights-section">
        <h3>💡 Insights & Recommendations</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <h4>Keep It Up!</h4>
            <p>Your consistency is building great momentum. Maintain your streak!</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <h4>Set Clear Goals</h4>
            <p>Define specific, achievable goals for the upcoming week.</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🧘</div>
            <h4>Balance is Key</h4>
            <p>Remember to take breaks and practice self-care regularly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyReview
