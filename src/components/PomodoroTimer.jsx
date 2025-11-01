import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/PomodoroTimer.css'

const PomodoroTimer = () => {
  const navigate = useNavigate()
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('work') // work, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [customWork, setCustomWork] = useState(25)
  const [customShortBreak, setCustomShortBreak] = useState(5)
  const [customLongBreak, setCustomLongBreak] = useState(15)

  const modes = {
    work: { duration: customWork, label: '💼 Work', color: '#f44336' },
    shortBreak: { duration: customShortBreak, label: '☕ Short Break', color: '#4caf50' },
    longBreak: { duration: customLongBreak, label: '🏖️ Long Break', color: '#2196f3' }
  }

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, minutes, seconds])

  useEffect(() => {
    const savedSessions = localStorage.getItem('gmax_pomodoro_sessions')
    if (savedSessions) {
      setSessionsCompleted(parseInt(savedSessions))
    }
  }, [])

  const handleTimerComplete = () => {
    setIsActive(false)
    
    if (mode === 'work') {
      const newSessions = sessionsCompleted + 1
      setSessionsCompleted(newSessions)
      localStorage.setItem('gmax_pomodoro_sessions', newSessions.toString())
      
      if (newSessions % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }
    
    playNotificationSound()
  }

  const playNotificationSound = () => {
    // Simple notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to get back to work!',
        icon: '⏰'
      })
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setMinutes(modes[newMode].duration)
    setSeconds(0)
    setIsActive(false)
  }

  const toggleTimer = () => {
    if (!isActive && minutes === modes[mode].duration && seconds === 0) {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMinutes(modes[mode].duration)
    setSeconds(0)
  }

  const updateCustomTimes = () => {
    if (mode === 'work') setMinutes(customWork)
    else if (mode === 'shortBreak') setMinutes(customShortBreak)
    else setMinutes(customLongBreak)
    setSeconds(0)
    setIsActive(false)
  }

  const formatTime = (min, sec) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const totalSeconds = modes[mode].duration * 60
    const remainingSeconds = minutes * 60 + seconds
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100
  }

  return (
    <div className="pomodoro-container" style={{ background: `linear-gradient(135deg, ${modes[mode].color}dd 0%, ${modes[mode].color} 100%)` }}>
      <div className="pomodoro-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🍅 Pomodoro Timer</h1>
      </div>

      <div className="timer-card">
        <div className="mode-selector">
          <button
            className={mode === 'work' ? 'active' : ''}
            onClick={() => switchMode('work')}
            disabled={isActive}
          >
            💼 Work
          </button>
          <button
            className={mode === 'shortBreak' ? 'active' : ''}
            onClick={() => switchMode('shortBreak')}
            disabled={isActive}
          >
            ☕ Short Break
          </button>
          <button
            className={mode === 'longBreak' ? 'active' : ''}
            onClick={() => switchMode('longBreak')}
            disabled={isActive}
          >
            🏖️ Long Break
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
                strokeDashoffset: `${2 * Math.PI * 130 * (1 - getProgress() / 100)}`,
                stroke: modes[mode].color
              }}
            />
          </svg>
          <div className="timer-text">
            <span className="time">{formatTime(minutes, seconds)}</span>
            <span className="mode-label">{modes[mode].label}</span>
          </div>
        </div>

        <div className="timer-controls">
          <button onClick={toggleTimer} className="control-btn start">
            {isActive ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={resetTimer} className="control-btn reset">
            🔄 Reset
          </button>
        </div>

        <div className="sessions-counter">
          <span className="sessions-icon">✅</span>
          <span className="sessions-text">
            {sessionsCompleted} sessions completed today
          </span>
        </div>
      </div>

      <div className="settings-card">
        <h3>⚙️ Timer Settings</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Work Duration (minutes)</label>
            <input
              type="number"
              value={customWork}
              onChange={(e) => setCustomWork(parseInt(e.target.value) || 25)}
              min="1"
              max="60"
            />
          </div>
          <div className="setting-item">
            <label>Short Break (minutes)</label>
            <input
              type="number"
              value={customShortBreak}
              onChange={(e) => setCustomShortBreak(parseInt(e.target.value) || 5)}
              min="1"
              max="30"
            />
          </div>
          <div className="setting-item">
            <label>Long Break (minutes)</label>
            <input
              type="number"
              value={customLongBreak}
              onChange={(e) => setCustomLongBreak(parseInt(e.target.value) || 15)}
              min="1"
              max="60"
            />
          </div>
        </div>
        <button onClick={updateCustomTimes} className="apply-settings-btn">
          Apply Settings
        </button>
      </div>

      <div className="info-card">
        <h3>📚 Pomodoro Technique</h3>
        <ul>
          <li>Work for 25 minutes with full focus</li>
          <li>Take a 5-minute short break</li>
          <li>After 4 sessions, take a 15-minute long break</li>
          <li>Repeat to maintain productivity</li>
        </ul>
      </div>
    </div>
  )
}

export default PomodoroTimer
