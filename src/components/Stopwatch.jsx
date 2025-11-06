import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Stopwatch.css'

const STORAGE_KEY = 'gmax_stopwatch_history'

export default function Stopwatch() {
  const navigate = useNavigate()
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 10)
      }, 10)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (e) {}
  }, [history])

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)

  const reset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }

  const recordLap = () => {
    if (time === 0) return
    const lapTime = laps.length > 0 ? time - laps[laps.length - 1].totalTime : time
    setLaps([...laps, {
      number: laps.length + 1,
      lapTime,
      totalTime: time
    }])
  }

  const saveToHistory = () => {
    if (time === 0) return
    const session = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      totalTime: time,
      laps: laps.length,
      lapTimes: [...laps]
    }
    setHistory([session, ...history])
    reset()
  }

  const exportToCSV = (session) => {
    const headers = ['Lap', 'Lap Time', 'Total Time']
    const rows = session.lapTimes.map(lap => [
      lap.number,
      formatTime(lap.lapTime),
      formatTime(lap.totalTime)
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stopwatch_${session.date.replace(/[/:]/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteSession = (id) => {
    setHistory(history.filter(s => s.id !== id))
  }

  const clearHistory = () => {
    if (window.confirm('Clear all history?')) {
      setHistory([])
    }
  }

  const getBestLap = () => {
    if (laps.length === 0) return null
    return laps.reduce((best, lap) => lap.lapTime < best.lapTime ? lap : best)
  }

  const getWorstLap = () => {
    if (laps.length === 0) return null
    return laps.reduce((worst, lap) => lap.lapTime > worst.lapTime ? lap : worst)
  }

  const bestLap = getBestLap()
  const worstLap = getWorstLap()

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⏱️ Stopwatch & Lap Timer</h1>
      </div>

      <div className="stopwatch-card">
        <div className="timer-display">{formatTime(time)}</div>

        <div className="controls">
          {!isRunning ? (
            <button className="start-btn" onClick={start}>▶️ Start</button>
          ) : (
            <button className="pause-btn" onClick={pause}>⏸️ Pause</button>
          )}
          <button className="lap-btn" onClick={recordLap} disabled={time === 0}>
            🏁 Lap
          </button>
          <button className="reset-btn" onClick={reset} disabled={time === 0 && laps.length === 0}>
            🔄 Reset
          </button>
          <button className="save-btn" onClick={saveToHistory} disabled={time === 0}>
            💾 Save
          </button>
        </div>

        {laps.length > 0 && (
          <div className="laps-section">
            <div className="laps-header">
              <h3>Laps ({laps.length})</h3>
              {bestLap && (
                <div className="lap-stats">
                  <span className="best-lap">🏆 Best: {formatTime(bestLap.lapTime)}</span>
                  <span className="worst-lap">🐌 Worst: {formatTime(worstLap.lapTime)}</span>
                </div>
              )}
            </div>
            <div className="laps-list">
              {[...laps].reverse().map(lap => (
                <div 
                  key={lap.number} 
                  className={`lap-item ${lap.number === bestLap?.number ? 'best' : ''} ${lap.number === worstLap?.number ? 'worst' : ''}`}
                >
                  <span className="lap-number">Lap {lap.number}</span>
                  <span className="lap-time">{formatTime(lap.lapTime)}</span>
                  <span className="total-time">{formatTime(lap.totalTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>History</h3>
              <button className="clear-history-btn" onClick={clearHistory}>
                🗑️ Clear
              </button>
            </div>
            <div className="history-list">
              {history.map(session => (
                <div key={session.id} className="history-item">
                  <div className="history-info">
                    <div className="history-date">{session.date}</div>
                    <div className="history-details">
                      Time: {formatTime(session.totalTime)} • {session.laps} laps
                    </div>
                  </div>
                  <div className="history-actions">
                    <button 
                      className="export-btn"
                      onClick={() => exportToCSV(session)}
                    >
                      📥 CSV
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteSession(session.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
