import React, { useState, useEffect } from 'react'
import '../styles/SessionTimer.css'

const SessionTimer = () => {
  const [seconds, setSeconds] = useState(25 * 60) // 25 minutes default
  const [isActive, setIsActive] = useState(false)
  const [sessionType, setSessionType] = useState('work') // work or break

  useEffect(() => {
    let interval = null
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
      // Auto-switch session type when timer ends
      if (sessionType === 'work') {
        setSessionType('break')
        setSeconds(5 * 60) // 5 min break
      } else {
        setSessionType('work')
        setSeconds(25 * 60)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, seconds, sessionType])

  const toggle = () => setIsActive(!isActive)
  
  const reset = () => {
    setIsActive(false)
    setSeconds(sessionType === 'work' ? 25 * 60 : 5 * 60)
  }

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="session-timer">
      <h3>{sessionType === 'work' ? '🎯 Work Session' : '☕ Break Time'}</h3>
      <div className="timer-display">{formatTime(seconds)}</div>
      <div className="timer-controls">
        <button onClick={toggle} className="control-btn">
          {isActive ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button onClick={reset} className="control-btn">
          🔄 Reset
        </button>
      </div>
    </div>
  )
}

export default SessionTimer
