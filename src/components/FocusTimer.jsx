import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FocusTimer.css'

function FocusTimer() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('focus') // focus, short-break, long-break
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  })
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const savedSessions = localStorage.getItem('focusSessions')
    const savedTotalTime = localStorage.getItem('totalFocusTime')
    const savedSettings = localStorage.getItem('focusSettings')
    
    if (savedSessions) setSessions(parseInt(savedSessions))
    if (savedTotalTime) setTotalFocusTime(parseInt(savedTotalTime))
    if (savedSettings) setSettings(JSON.parse(savedSettings))
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    playSound()
    
    if (mode === 'focus') {
      const newSessions = sessions + 1
      setSessions(newSessions)
      setTotalFocusTime(totalFocusTime + settings.focusTime)
      localStorage.setItem('focusSessions', newSessions.toString())
      localStorage.setItem('totalFocusTime', (totalFocusTime + settings.focusTime).toString())
      
      // Auto-switch to break
      if (newSessions % settings.sessionsUntilLongBreak === 0) {
        switchMode('long-break')
      } else {
        switchMode('short-break')
      }
    } else {
      switchMode('focus')
    }
  }

  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZURE')
    audio.play().catch(() => {})
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsRunning(false)
    
    if (newMode === 'focus') {
      setTimeLeft(settings.focusTime * 60)
    } else if (newMode === 'short-break') {
      setTimeLeft(settings.shortBreak * 60)
    } else {
      setTimeLeft(settings.longBreak * 60)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'focus') {
      setTimeLeft(settings.focusTime * 60)
    } else if (mode === 'short-break') {
      setTimeLeft(settings.shortBreak * 60)
    } else {
      setTimeLeft(settings.longBreak * 60)
    }
  }

  const updateSettings = (key, value) => {
    const newSettings = { ...settings, [key]: parseInt(value) }
    setSettings(newSettings)
    localStorage.setItem('focusSettings', JSON.stringify(newSettings))
    
    // Update current timer if not running
    if (!isRunning) {
      if (mode === 'focus') {
        setTimeLeft(newSettings.focusTime * 60)
      } else if (mode === 'short-break') {
        setTimeLeft(newSettings.shortBreak * 60)
      } else {
        setTimeLeft(newSettings.longBreak * 60)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const total = mode === 'focus' ? settings.focusTime * 60 : 
                  mode === 'short-break' ? settings.shortBreak * 60 : 
                  settings.longBreak * 60
    return ((total - timeLeft) / total) * 100
  }

  return (
    <div className={`focus-timer-container mode-${mode}`}>
      <div className="focus-timer-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🎯 Focus Mode</h1>
        <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h3>Timer Settings</h3>
          <div className="setting-group">
            <label>Focus Time (minutes)</label>
            <input
              type="number"
              value={settings.focusTime}
              onChange={(e) => updateSettings('focusTime', e.target.value)}
              min="1"
              max="60"
            />
          </div>
          <div className="setting-group">
            <label>Short Break (minutes)</label>
            <input
              type="number"
              value={settings.shortBreak}
              onChange={(e) => updateSettings('shortBreak', e.target.value)}
              min="1"
              max="30"
            />
          </div>
          <div className="setting-group">
            <label>Long Break (minutes)</label>
            <input
              type="number"
              value={settings.longBreak}
              onChange={(e) => updateSettings('longBreak', e.target.value)}
              min="1"
              max="60"
            />
          </div>
          <div className="setting-group">
            <label>Sessions Until Long Break</label>
            <input
              type="number"
              value={settings.sessionsUntilLongBreak}
              onChange={(e) => updateSettings('sessionsUntilLongBreak', e.target.value)}
              min="2"
              max="10"
            />
          </div>
        </div>
      )}

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => switchMode('focus')}
        >
          Focus
        </button>
        <button
          className={`mode-btn ${mode === 'short-break' ? 'active' : ''}`}
          onClick={() => switchMode('short-break')}
        >
          Short Break
        </button>
        <button
          className={`mode-btn ${mode === 'long-break' ? 'active' : ''}`}
          onClick={() => switchMode('long-break')}
        >
          Long Break
        </button>
      </div>

      <div className="timer-display">
        <svg className="progress-ring" width="300" height="300">
          <circle
            className="progress-ring-bg"
            cx="150"
            cy="150"
            r="130"
          />
          <circle
            className="progress-ring-fill"
            cx="150"
            cy="150"
            r="130"
            style={{
              strokeDasharray: `${2 * Math.PI * 130}`,
              strokeDashoffset: `${2 * Math.PI * 130 * (1 - getProgress() / 100)}`
            }}
          />
        </svg>
        <div className="timer-text">
          <h2>{formatTime(timeLeft)}</h2>
          <p className="mode-label">
            {mode === 'focus' ? '🎯 Focus Time' : 
             mode === 'short-break' ? '☕ Short Break' : 
             '🌟 Long Break'}
          </p>
        </div>
      </div>

      <div className="timer-controls">
        <button className="control-btn primary" onClick={toggleTimer}>
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="control-btn secondary" onClick={resetTimer}>
          ↻ Reset
        </button>
      </div>

      <div className="focus-stats">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h4>{sessions}</h4>
            <p>Sessions Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱</div>
          <div className="stat-content">
            <h4>{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</h4>
            <p>Total Focus Time</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h4>{sessions % settings.sessionsUntilLongBreak}/{settings.sessionsUntilLongBreak}</h4>
            <p>Until Long Break</p>
          </div>
        </div>
      </div>

      <div className="focus-tips">
        <h3>💡 Focus Tips</h3>
        <ul>
          <li>Eliminate distractions before starting</li>
          <li>Have a clear goal for each session</li>
          <li>Take breaks seriously - they're essential</li>
          <li>Stay hydrated and maintain good posture</li>
        </ul>
      </div>
    </div>
  )
}

export default FocusTimer
