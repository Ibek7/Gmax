import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/EnergyTracker.css'

const EnergyTracker = () => {
  const navigate = useNavigate()
  const [energyLogs, setEnergyLogs] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [todayLog, setTodayLog] = useState(null)

  useEffect(() => {
    loadLogs()
  }, [])

  useEffect(() => {
    const log = energyLogs.find(l => l.date === selectedDate)
    setTodayLog(log || null)
  }, [selectedDate, energyLogs])

  const loadLogs = () => {
    const saved = localStorage.getItem('gmax_energy_logs')
    if (saved) {
      setEnergyLogs(JSON.parse(saved))
    }
  }

  const saveLogs = (updated) => {
    setEnergyLogs(updated)
    localStorage.setItem('gmax_energy_logs', JSON.stringify(updated))
  }

  const logEnergy = (hour, level) => {
    const existing = energyLogs.find(l => l.date === selectedDate)
    let updated

    if (existing) {
      updated = energyLogs.map(l =>
        l.date === selectedDate
          ? { ...l, hours: { ...l.hours, [hour]: level } }
          : l
      )
    } else {
      updated = [...energyLogs, { date: selectedDate, hours: { [hour]: level } }]
    }

    saveLogs(updated)
  }

  const getEnergyColor = (level) => {
    const colors = {
      1: '#e74c3c',
      2: '#e67e22',
      3: '#f39c12',
      4: '#2ecc71',
      5: '#27ae60'
    }
    return colors[level] || '#e0e0e0'
  }

  const getAverageEnergy = () => {
    if (!todayLog) return 0
    const levels = Object.values(todayLog.hours)
    if (levels.length === 0) return 0
    return (levels.reduce((sum, l) => sum + l, 0) / levels.length).toFixed(1)
  }

  const getPeakHours = () => {
    if (!todayLog) return []
    const hours = Object.entries(todayLog.hours)
    const maxLevel = Math.max(...Object.values(todayLog.hours))
    return hours.filter(([_, level]) => level === maxLevel).map(([hour]) => hour)
  }

  const getWeeklyAverage = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const weekLogs = energyLogs.filter(l => new Date(l.date) >= oneWeekAgo)
    if (weekLogs.length === 0) return 0
    
    let totalEnergy = 0
    let totalEntries = 0
    
    weekLogs.forEach(log => {
      const levels = Object.values(log.hours)
      totalEnergy += levels.reduce((sum, l) => sum + l, 0)
      totalEntries += levels.length
    })
    
    return totalEntries > 0 ? (totalEnergy / totalEntries).toFixed(1) : 0
  }

  const hours = Array.from({ length: 16 }, (_, i) => 6 + i) // 6 AM to 9 PM

  return (
    <div className="energy-tracker-container">
      <div className="energy-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⚡ Creative Energy Tracker</h1>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-label">Today's Average</div>
          <div className="stat-value">{getAverageEnergy()}/5</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Weekly Average</div>
          <div className="stat-value">{getWeeklyAverage()}/5</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Peak Hours</div>
          <div className="stat-value">
            {getPeakHours().length > 0 ? getPeakHours().map(h => `${h}:00`).join(', ') : 'N/A'}
          </div>
        </div>
      </div>

      <div className="date-selector">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="energy-grid">
        <h2>Log Your Energy Levels</h2>
        <p className="grid-hint">Click a level for each hour to track your energy throughout the day</p>
        
        <div className="hourly-grid">
          {hours.map(hour => {
            const currentLevel = todayLog?.hours?.[hour] || 0
            return (
              <div key={hour} className="hour-row">
                <div className="hour-label">{hour}:00</div>
                <div className="level-buttons">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      className={`level-btn ${currentLevel === level ? 'active' : ''}`}
                      style={{
                        background: currentLevel === level ? getEnergyColor(level) : '#e0e0e0'
                      }}
                      onClick={() => logEnergy(hour, level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="energy-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#e74c3c' }} />
            <span>1 - Very Low</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#e67e22' }} />
            <span>2 - Low</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f39c12' }} />
            <span>3 - Moderate</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#2ecc71' }} />
            <span>4 - High</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#27ae60' }} />
            <span>5 - Very High</span>
          </div>
        </div>
      </div>

      {energyLogs.length > 7 && (
        <div className="insights-section">
          <h2>📊 Energy Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">🌅</div>
              <div className="insight-text">
                Morning energy tends to be {getWeeklyAverage() > 3.5 ? 'high' : 'moderate'} - great for deep work!
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <div className="insight-text">
                You've tracked energy for {energyLogs.length} days. Keep it up!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnergyTracker
