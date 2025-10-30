import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/StudyTimer.css'

const StudyTimer = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState([])
  const [subject, setSubject] = useState('')

  const modes = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  }

  useEffect(() => {
    const saved = localStorage.getItem('gmax_study_sessions')
    if (saved) setSessions(JSON.parse(saved))
  }, [])

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSessionComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)
    if (mode === 'pomodoro' && subject.trim()) {
      const session = {
        id: Date.now(),
        subject,
        duration: modes[mode] / 60,
        completedAt: new Date().toISOString()
      }
      const updated = [...sessions, session]
      setSessions(updated)
      localStorage.setItem('gmax_study_sessions', JSON.stringify(updated))
    }
    // Auto switch modes
    if (mode === 'pomodoro') {
      const pomodoroCount = sessions.filter(s => 
        new Date(s.completedAt).toDateString() === new Date().toDateString()
      ).length
      setMode(pomodoroCount % 4 === 3 ? 'longBreak' : 'shortBreak')
    } else {
      setMode('pomodoro')
    }
  }

  const toggleTimer = () => {
    if (!isRunning && mode === 'pomodoro' && !subject.trim()) {
      alert('Please enter a subject before starting!')
      return
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(modes[mode])
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setTimeLeft(modes[newMode])
    setIsRunning(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const todaySessions = sessions.filter(s =>
    new Date(s.completedAt).toDateString() === new Date().toDateString()
  )

  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const todayStudyTime = todaySessions.reduce((sum, s) => sum + s.duration, 0)

  const progress = ((modes[mode] - timeLeft) / modes[mode]) * 100

  return (
    <div className="study-timer-container">
      <div className="study-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📚 Study Timer</h1>
      </div>

      <div className="study-stats">
        <div className="study-stat">
          <span className="stat-value">{todaySessions.length}</span>
          <span className="stat-label">Today's Sessions</span>
        </div>
        <div className="study-stat">
          <span className="stat-value">{todayStudyTime}</span>
          <span className="stat-label">Minutes Today</span>
        </div>
        <div className="study-stat">
          <span className="stat-value">{sessions.length}</span>
          <span className="stat-label">Total Sessions</span>
        </div>
      </div>

      <div className="timer-widget">
        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}
            onClick={() => switchMode('pomodoro')}
          >
            Pomodoro
          </button>
          <button
            className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
            onClick={() => switchMode('shortBreak')}
          >
            Short Break
          </button>
          <button
            className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
            onClick={() => switchMode('longBreak')}
          >
            Long Break
          </button>
        </div>

        <div className="timer-display">
          <svg className="progress-ring" width="300" height="300">
            <circle
              className="progress-ring-circle-bg"
              cx="150"
              cy="150"
              r="130"
            />
            <circle
              className="progress-ring-circle"
              cx="150"
              cy="150"
              r="130"
              style={{
                strokeDasharray: `${2 * Math.PI * 130}`,
                strokeDashoffset: `${2 * Math.PI * 130 * (1 - progress / 100)}`
              }}
            />
          </svg>
          <div className="timer-text">{formatTime(timeLeft)}</div>
        </div>

        {mode === 'pomodoro' && (
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="What are you studying?"
            className="subject-input"
            disabled={isRunning}
          />
        )}

        <div className="timer-controls">
          <button className="control-btn start" onClick={toggleTimer}>
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button className="control-btn reset" onClick={resetTimer}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="sessions-history">
        <h2>Study History</h2>
        <div className="sessions-list">
          {sessions.slice().reverse().slice(0, 10).map(session => (
            <div key={session.id} className="session-item">
              <div className="session-subject">{session.subject}</div>
              <div className="session-meta">
                <span className="session-duration">{session.duration} min</span>
                <span className="session-date">
                  {new Date(session.completedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sessions.length === 0 && (
        <div className="empty-sessions">
          <p>No study sessions yet. Start your first session!</p>
        </div>
      )}
    </div>
  )
}

export default StudyTimer
