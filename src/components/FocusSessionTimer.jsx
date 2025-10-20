import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FocusSessionTimer.css'

const FocusSessionTimer = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
  })
  
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus', 'shortBreak', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [sessionHistory, setSessionHistory] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }
    
    return () => clearInterval(intervalRef.current)
  }, [isActive, timeLeft])

  const loadHistory = () => {
    const saved = localStorage.getItem('gmax_focus_sessions')
    if (saved) {
      setSessionHistory(JSON.parse(saved))
    }
  }

  const saveSession = (sessionData) => {
    const history = [...sessionHistory, sessionData]
    setSessionHistory(history)
    localStorage.setItem('gmax_focus_sessions', JSON.stringify(history))
  }

  const handleTimerComplete = () => {
    setIsActive(false)
    playSound()
    
    if (mode === 'focus') {
      const newCount = sessionsCompleted + 1
      setSessionsCompleted(newCount)
      
      saveSession({
        date: new Date().toISOString(),
        duration: settings.focusDuration,
        type: 'focus',
        completed: true
      })

      // Determine next mode
      if (newCount % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak')
        setTimeLeft(settings.longBreakDuration * 60)
      } else {
        setMode('shortBreak')
        setTimeLeft(settings.shortBreakDuration * 60)
      }
    } else {
      setMode('focus')
      setTimeLeft(settings.focusDuration * 60)
    }
  }

  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0NVKzn77BdGAc+ltryxnMpBSuAy/LaizsIGGS57OihUgwMUqri8LViFAg2kNXzzn0vBSh+yO/glEILEl+16+qnWBELRZze8sFsIwU')
    audio.play().catch(() => {}) // Ignore errors if audio doesn't play
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === 'focus' ? settings.focusDuration * 60 : 
                mode === 'shortBreak' ? settings.shortBreakDuration * 60 :
                settings.longBreakDuration * 60)
  }

  const skipSession = () => {
    setIsActive(false)
    handleTimerComplete()
  }

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    setShowSettings(false)
    if (!isActive) {
      setTimeLeft(newSettings.focusDuration * 60)
      setMode('focus')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTodaySessions = () => {
    const today = new Date().toDateString()
    return sessionHistory.filter(session => 
      new Date(session.date).toDateString() === today
    )
  }

  const getWeeklySessions = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return sessionHistory.filter(session => 
      new Date(session.date) >= oneWeekAgo
    )
  }

  const getModeColor = () => {
    switch(mode) {
      case 'focus': return '#e74c3c'
      case 'shortBreak': return '#3498db'
      case 'longBreak': return '#2ecc71'
      default: return '#e74c3c'
    }
  }

  return (
    <div className="focus-session-container" style={{ '--mode-color': getModeColor() }}>
      <div className="focus-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⏱️ Focus Session Timer</h1>
        <button className="settings-btn" onClick={() => setShowSettings(true)}>⚙️</button>
      </div>

      <div className="timer-main">
        <div className="mode-selector">
          <button 
            className={mode === 'focus' ? 'active' : ''}
            onClick={() => !isActive && (setMode('focus'), setTimeLeft(settings.focusDuration * 60))}
          >
            Focus
          </button>
          <button 
            className={mode === 'shortBreak' ? 'active' : ''}
            onClick={() => !isActive && (setMode('shortBreak'), setTimeLeft(settings.shortBreakDuration * 60))}
          >
            Short Break
          </button>
          <button 
            className={mode === 'longBreak' ? 'active' : ''}
            onClick={() => !isActive && (setMode('longBreak'), setTimeLeft(settings.longBreakDuration * 60))}
          >
            Long Break
          </button>
        </div>

        <div className="timer-display">
          <div className="time">{formatTime(timeLeft)}</div>
          <div className="progress-ring">
            <svg width="300" height="300">
              <circle
                cx="150"
                cy="150"
                r="140"
                fill="none"
                stroke="#ffffff20"
                strokeWidth="8"
              />
              <circle
                cx="150"
                cy="150"
                r="140"
                fill="none"
                stroke={getModeColor()}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 140}
                strokeDashoffset={2 * Math.PI * 140 * (1 - (timeLeft / (
                  mode === 'focus' ? settings.focusDuration * 60 :
                  mode === 'shortBreak' ? settings.shortBreakDuration * 60 :
                  settings.longBreakDuration * 60
                )))}
                strokeLinecap="round"
                transform="rotate(-90 150 150)"
              />
            </svg>
          </div>
        </div>

        <div className="timer-controls">
          <button onClick={toggleTimer} className="control-btn primary">
            {isActive ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={resetTimer} className="control-btn">
            🔄 Reset
          </button>
          <button onClick={skipSession} className="control-btn">
            ⏭️ Skip
          </button>
        </div>

        <div className="session-counter">
          Sessions completed: {sessionsCompleted}
          <div className="session-dots">
            {[...Array(settings.sessionsBeforeLongBreak)].map((_, i) => (
              <div 
                key={i} 
                className={`dot ${i < sessionsCompleted % settings.sessionsBeforeLongBreak ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-value">{getTodaySessions().length}</div>
          <div className="stat-label">Today's Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getWeeklySessions().length}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sessionHistory.length}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <h2>Timer Settings</h2>
            <div className="setting-group">
              <label>Focus Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.focusDuration}
                onChange={e => setSettings({...settings, focusDuration: parseInt(e.target.value)})}
              />
            </div>
            <div className="setting-group">
              <label>Short Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={e => setSettings({...settings, shortBreakDuration: parseInt(e.target.value)})}
              />
            </div>
            <div className="setting-group">
              <label>Long Break (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={e => setSettings({...settings, longBreakDuration: parseInt(e.target.value)})}
              />
            </div>
            <div className="setting-group">
              <label>Sessions Before Long Break</label>
              <input
                type="number"
                min="2"
                max="10"
                value={settings.sessionsBeforeLongBreak}
                onChange={e => setSettings({...settings, sessionsBeforeLongBreak: parseInt(e.target.value)})}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => updateSettings(settings)} className="save-btn">
                Save Settings
              </button>
              <button onClick={() => setShowSettings(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FocusSessionTimer
