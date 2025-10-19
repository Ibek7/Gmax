import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/WritingSprintTimer.css'

const WritingSprintTimer = () => {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes default
  const [wordCount, setWordCount] = useState(0)
  const [wordGoal, setWordGoal] = useState(500)
  const [sprintDuration, setSprintDuration] = useState(15)
  const [writingText, setWritingText] = useState('')
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      completeSprint()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  useEffect(() => {
    const words = writingText.trim().split(/\s+/).filter(w => w.length > 0).length
    setWordCount(words)
  }, [writingText])

  const loadSessions = () => {
    const saved = localStorage.getItem('gmax_writing_sprints')
    if (saved) {
      setSessions(JSON.parse(saved))
    }
  }

  const startSprint = () => {
    setTimeLeft(sprintDuration * 60)
    setIsActive(true)
    setWritingText('')
    setWordCount(0)
  }

  const completeSprint = () => {
    setIsActive(false)
    const session = {
      id: Date.now(),
      words: wordCount,
      goal: wordGoal,
      duration: sprintDuration,
      date: new Date().toISOString(),
      achieved: wordCount >= wordGoal
    }
    const updated = [session, ...sessions]
    setSessions(updated)
    localStorage.setItem('gmax_writing_sprints', JSON.stringify(updated))
    alert(`Sprint Complete! You wrote ${wordCount} words! 🎉`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="writing-sprint-container">
      <div className="sprint-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>✍️ Writing Sprint Timer</h1>
      </div>

      {!isActive ? (
        <div className="sprint-setup">
          <div className="setup-card">
            <h2>Start a Writing Sprint</h2>
            <div className="setup-controls">
              <div className="control-group">
                <label>Sprint Duration</label>
                <select value={sprintDuration} onChange={(e) => setSprintDuration(Number(e.target.value))}>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
              <div className="control-group">
                <label>Word Goal</label>
                <input
                  type="number"
                  value={wordGoal}
                  onChange={(e) => setWordGoal(Number(e.target.value))}
                  min="50"
                  step="50"
                />
              </div>
            </div>
            <button className="start-sprint-btn" onClick={startSprint}>
              🚀 Start Sprint
            </button>
          </div>

          <div className="history-card">
            <h3>Recent Sprints</h3>
            {sessions.length === 0 ? (
              <p className="no-sessions">No sprint sessions yet. Start your first sprint!</p>
            ) : (
              <div className="sessions-list">
                {sessions.slice(0, 5).map(session => (
                  <div key={session.id} className="session-item">
                    <div className="session-info">
                      <span className="session-words">{session.words} words</span>
                      <span className="session-time">{session.duration}m</span>
                    </div>
                    <span className={`session-badge ${session.achieved ? 'success' : 'partial'}`}>
                      {session.achieved ? '✅ Goal Met' : '📝 Partial'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="sprint-active">
          <div className="sprint-stats">
            <div className="stat-box">
              <div className="stat-value">{formatTime(timeLeft)}</div>
              <div className="stat-label">Time Left</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{wordCount}</div>
              <div className="stat-label">Words Written</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{wordGoal}</div>
              <div className="stat-label">Goal</div>
            </div>
          </div>

          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#667eea"
                strokeWidth="8"
                strokeDasharray={`${(wordCount / wordGoal) * 282.7} 282.7`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="progress-text">{Math.min(100, Math.round((wordCount / wordGoal) * 100))}%</div>
          </div>

          <textarea
            className="writing-area"
            placeholder="Start writing... Focus on your words, not perfection!"
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

export default WritingSprintTimer
