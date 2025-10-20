import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BreakSuggestions.css'

const BreakSuggestions = () => {
  const navigate = useNavigate()
  const [workDuration, setWorkDuration] = useState(0)
  const [currentSuggestion, setCurrentSuggestion] = useState(null)

  const suggestions = [
    { id: 1, type: 'physical', activity: '5-minute walk', duration: 5, icon: '🚶' },
    { id: 2, type: 'mental', activity: 'Meditation', duration: 10, icon: '🧘' },
    { id: 3, type: 'creative', activity: 'Doodle something', duration: 5, icon: '✏️' },
    { id: 4, type: 'physical', activity: 'Stretch exercises', duration: 7, icon: '🤸' },
    { id: 5, type: 'rest', activity: 'Close eyes and breathe', duration: 3, icon: '😌' },
    { id: 6, type: 'social', activity: 'Quick chat with friend', duration: 10, icon: '💬' },
    { id: 7, type: 'creative', activity: 'Read a chapter', duration: 15, icon: '📖' },
    { id: 8, type: 'physical', activity: 'Quick workout', duration: 10, icon: '💪' }
  ]

  const getSuggestion = () => {
    const random = suggestions[Math.floor(Math.random() * suggestions.length)]
    setCurrentSuggestion(random)
  }

  return (
    <div className="break-container">
      <div className="break-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>☕ Break Suggestions</h1>
      </div>

      <div className="suggestion-card">
        {currentSuggestion ? (
          <>
            <div className="suggestion-icon">{currentSuggestion.icon}</div>
            <h2>{currentSuggestion.activity}</h2>
            <p className="duration">{currentSuggestion.duration} minutes</p>
            <span className="type-badge">{currentSuggestion.type}</span>
          </>
        ) : (
          <p>Click "Get Suggestion" to receive a break activity!</p>
        )}
      </div>

      <button className="get-suggestion-btn" onClick={getSuggestion}>
        Get Suggestion
      </button>

      <div className="all-suggestions">
        <h3>All Break Activities</h3>
        <div className="suggestions-grid">
          {suggestions.map(s => (
            <div key={s.id} className="suggestion-item">
              <span className="icon">{s.icon}</span>
              <strong>{s.activity}</strong>
              <span>{s.duration} min</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BreakSuggestions
