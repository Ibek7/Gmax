import React, { useState, useEffect } from 'react'
import '../styles/MoodTracker.css'

const MOOD_DATA_KEY = 'gmaxMoodData'

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(null)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [moodHistory, setMoodHistory] = useState([])
  const [note, setNote] = useState('')

  const moods = [
    { id: 'excited', emoji: '🤩', label: 'Excited', color: '#f59e0b' },
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#10b981' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: '#6366f1' },
    { id: 'focused', emoji: '🎯', label: 'Focused', color: '#8b5cf6' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: '#6b7280' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: '#ef4444' },
    { id: 'creative', emoji: '✨', label: 'Creative', color: '#ec4899' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#9ca3af' }
  ]

  useEffect(() => {
    const stored = localStorage.getItem(MOOD_DATA_KEY)
    if (stored) {
      setMoodHistory(JSON.parse(stored))
    }
  }, [])

  const logMood = () => {
    if (!currentMood) return

    const entry = {
      id: Date.now(),
      mood: currentMood,
      energy: energyLevel,
      note: note.trim(),
      timestamp: new Date().toISOString()
    }

    const updatedHistory = [entry, ...moodHistory]
    setMoodHistory(updatedHistory)
    localStorage.setItem(MOOD_DATA_KEY, JSON.stringify(updatedHistory))
    
    // Reset form
    setCurrentMood(null)
    setEnergyLevel(5)
    setNote('')
  }

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null

    const moodCounts = {}
    let totalEnergy = 0

    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
      totalEnergy += entry.energy
    })

    const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    )

    return {
      mostCommon,
      avgEnergy: (totalEnergy / moodHistory.length).toFixed(1),
      totalEntries: moodHistory.length
    }
  }

  const stats = getMoodStats()
  const getMoodInfo = (id) => moods.find(m => m.id === id)

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="mood-tracker">
      <header className="mood-tracker-header">
        <h1>🌈 Mood & Energy Tracker</h1>
        <p>Track your emotional patterns and creative energy levels</p>
      </header>

      {stats && (
        <div className="mood-stats">
          <div className="stat-card">
            <div className="stat-emoji">{getMoodInfo(stats.mostCommon)?.emoji}</div>
            <div>
              <strong>Most Common</strong>
              <p>{getMoodInfo(stats.mostCommon)?.label}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">⚡</div>
            <div>
              <strong>Avg Energy</strong>
              <p>{stats.avgEnergy}/10</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-emoji">📊</div>
            <div>
              <strong>Total Logs</strong>
              <p>{stats.totalEntries}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mood-logger">
        <h2>How are you feeling right now?</h2>
        
        <div className="mood-selector">
          {moods.map((mood) => (
            <button
              key={mood.id}
              className={`mood-option ${currentMood === mood.id ? 'selected' : ''}`}
              style={{ '--mood-color': mood.color }}
              onClick={() => setCurrentMood(mood.id)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        <div className="energy-selector">
          <label>
            <strong>Energy Level:</strong> {energyLevel}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="energy-slider"
          />
          <div className="energy-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <textarea
          placeholder="Add a note about your mood (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mood-note"
        />

        <button 
          className="log-mood-btn"
          onClick={logMood}
          disabled={!currentMood}
        >
          Log Mood
        </button>
      </div>

      <div className="mood-history">
        <h2>📅 Mood History</h2>
        
        {moodHistory.length === 0 ? (
          <div className="empty-history">
            <p>No mood entries yet. Start tracking your emotional patterns!</p>
          </div>
        ) : (
          <div className="history-list">
            {moodHistory.slice(0, 10).map((entry) => {
              const moodInfo = getMoodInfo(entry.mood)
              return (
                <div key={entry.id} className="history-entry">
                  <div className="entry-mood" style={{ color: moodInfo?.color }}>
                    <span className="entry-emoji">{moodInfo?.emoji}</span>
                    <span className="entry-label">{moodInfo?.label}</span>
                  </div>
                  <div className="entry-energy">
                    <span>⚡ {entry.energy}/10</span>
                  </div>
                  {entry.note && <p className="entry-note">{entry.note}</p>}
                  <span className="entry-time">{formatDate(entry.timestamp)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MoodTracker
