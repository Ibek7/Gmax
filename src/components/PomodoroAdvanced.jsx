import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/PomodoroAdvanced.css'

const PomodoroAdvanced = () => {
  const navigate = useNavigate()
  const [time, setTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    let interval
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000)
    } else if (time === 0) {
      setIsRunning(false)
      if (mode === 'work') {
        setSessions(s => s + 1)
        setMode('break')
        setTime(5 * 60)
      } else {
        setMode('work')
        setTime(25 * 60)
      }
    }
    return () => clearInterval(interval)
  }, [isRunning, time, mode])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="pomodoro-advanced-container">
      <div className="pomodoro-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⏱️ Advanced Pomodoro</h1>
      </div>

      <div className="pomodoro-card">
        <div className="mode-badge">{mode === 'work' ? '🎯 Work Time' : '☕ Break Time'}</div>
        <div className="timer-display">{formatTime(time)}</div>
        <div className="sessions-count">Sessions completed: {sessions}</div>
        <div className="controls">
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => { setTime(mode === 'work' ? 25 * 60 : 5 * 60); setIsRunning(false); }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default PomodoroAdvanced
