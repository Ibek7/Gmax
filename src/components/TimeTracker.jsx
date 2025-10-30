import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TimeTracker.css'

const TimeTracker = () => {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [isTracking, setIsTracking] = useState(false)
  const [currentTask, setCurrentTask] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('gmax_time_entries')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  useEffect(() => {
    let interval
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const startTracking = () => {
    if (currentTask.trim()) {
      setStartTime(Date.now())
      setIsTracking(true)
      setElapsed(0)
    }
  }

  const stopTracking = () => {
    if (startTime) {
      const newEntry = {
        id: Date.now(),
        task: currentTask,
        duration: elapsed,
        startedAt: new Date(startTime).toISOString(),
        endedAt: new Date().toISOString()
      }
      const updated = [newEntry, ...entries]
      setEntries(updated)
      localStorage.setItem('gmax_time_entries', JSON.stringify(updated))
      
      setIsTracking(false)
      setStartTime(null)
      setCurrentTask('')
      setElapsed(0)
    }
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const totalTime = entries.reduce((sum, e) => sum + e.duration, 0)

  return (
    <div className="time-tracker-container">
      <div className="tracker-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⏱️ Time Tracker</h1>
      </div>

      <div className="tracker-widget">
        <div className="timer-display">{formatTime(elapsed)}</div>
        <input
          type="text"
          value={currentTask}
          onChange={e => setCurrentTask(e.target.value)}
          placeholder="What are you working on?"
          disabled={isTracking}
          className="task-input"
        />
        <button 
          className={`track-btn ${isTracking ? 'stop' : 'start'}`}
          onClick={isTracking ? stopTracking : startTracking}
        >
          {isTracking ? '⏸ Stop' : '▶ Start'}
        </button>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <div className="value">{entries.length}</div>
          <div className="label">Tasks Tracked</div>
        </div>
        <div className="stat">
          <div className="value">{formatTime(totalTime)}</div>
          <div className="label">Total Time</div>
        </div>
        <div className="stat">
          <div className="value">{entries.length > 0 ? formatTime(Math.floor(totalTime / entries.length)) : '00:00:00'}</div>
          <div className="label">Average Time</div>
        </div>
      </div>

      <div className="entries-list">
        <h3>Recent Entries</h3>
        {entries.map(entry => (
          <div key={entry.id} className="entry-card">
            <div className="entry-header">
              <strong>{entry.task}</strong>
              <span className="duration">{formatTime(entry.duration)}</span>
            </div>
            <div className="entry-time">
              {new Date(entry.startedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimeTracker
