import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DailyAffirmations.css'

const DailyAffirmations = () => {
  const navigate = useNavigate()
  const [currentAffirmation, setCurrentAffirmation] = useState('')
  const [customAffirmations, setCustomAffirmations] = useState([])
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [newAffirmation, setNewAffirmation] = useState('')

  const defaultAffirmations = [
    "I am a creative force of nature",
    "My ideas are valuable and worth sharing",
    "I trust my creative instincts",
    "Every project brings me closer to mastery",
    "I embrace imperfection as part of the creative process",
    "My creativity flows effortlessly",
    "I am worthy of creative success",
    "I give myself permission to create freely",
    "My unique perspective adds value to the world",
    "I am constantly growing as a creative",
    "I deserve time and space for my creative work",
    "My creative journey is exactly where it needs to be",
    "I release perfectionism and embrace progress",
    "I am open to new creative possibilities",
    "My creativity is limitless",
    "I celebrate small wins in my creative journey",
    "I am brave enough to share my work",
    "Creativity is my superpower",
    "I make time for what matters to me",
    "I trust the creative process",
  ]

  useEffect(() => {
    loadData()
    generateRandomAffirmation()
  }, [])

  const loadData = () => {
    const savedCustom = localStorage.getItem('gmax_custom_affirmations')
    const savedFavorites = localStorage.getItem('gmax_favorite_affirmations')
    const savedHistory = localStorage.getItem('gmax_affirmation_history')

    if (savedCustom) setCustomAffirmations(JSON.parse(savedCustom))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }

  const allAffirmations = [...defaultAffirmations, ...customAffirmations]

  const generateRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * allAffirmations.length)
    const affirmation = allAffirmations[randomIndex]
    setCurrentAffirmation(affirmation)
    
    // Add to history
    const newHistory = [{
      text: affirmation,
      date: new Date().toISOString()
    }, ...history].slice(0, 50)
    setHistory(newHistory)
    localStorage.setItem('gmax_affirmation_history', JSON.stringify(newHistory))
  }

  const toggleFavorite = (text) => {
    let updated
    if (favorites.includes(text)) {
      updated = favorites.filter(f => f !== text)
    } else {
      updated = [...favorites, text]
    }
    setFavorites(updated)
    localStorage.setItem('gmax_favorite_affirmations', JSON.stringify(updated))
  }

  const addCustomAffirmation = () => {
    if (!newAffirmation.trim()) return
    
    const updated = [...customAffirmations, newAffirmation]
    setCustomAffirmations(updated)
    localStorage.setItem('gmax_custom_affirmations', JSON.stringify(updated))
    setNewAffirmation('')
    setShowCustomModal(false)
  }

  const deleteCustomAffirmation = (text) => {
    const updated = customAffirmations.filter(a => a !== text)
    setCustomAffirmations(updated)
    localStorage.setItem('gmax_custom_affirmations', JSON.stringify(updated))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="daily-affirmations-container">
      <div className="affirmations-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💖 Daily Affirmations</h1>
      </div>

      <div className="affirmations-layout">
        <div className="main-affirmation-section">
          <div className="affirmation-card">
            <div className="affirmation-icon">✨</div>
            <div className="affirmation-text">{currentAffirmation}</div>
            <div className="affirmation-actions">
              <button 
                className={`favorite-btn ${favorites.includes(currentAffirmation) ? 'active' : ''}`}
                onClick={() => toggleFavorite(currentAffirmation)}
              >
                {favorites.includes(currentAffirmation) ? '💖' : '🤍'} Favorite
              </button>
              <button className="new-affirmation-btn" onClick={generateRandomAffirmation}>
                🔄 New Affirmation
              </button>
            </div>
          </div>

          <button className="add-custom-btn" onClick={() => setShowCustomModal(true)}>
            ➕ Create Custom Affirmation
          </button>

          {customAffirmations.length > 0 && (
            <div className="custom-affirmations-section">
              <h3>Your Custom Affirmations</h3>
              <div className="custom-list">
                {customAffirmations.map((affirmation, index) => (
                  <div key={index} className="custom-item">
                    <span onClick={() => setCurrentAffirmation(affirmation)} style={{ cursor: 'pointer', flex: 1 }}>
                      {affirmation}
                    </span>
                    <button onClick={() => deleteCustomAffirmation(affirmation)}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          {favorites.length > 0 && (
            <div className="favorites-section">
              <h3>💖 Favorites</h3>
              <div className="favorites-list">
                {favorites.map((fav, index) => (
                  <div 
                    key={index} 
                    className="favorite-item"
                    onClick={() => setCurrentAffirmation(fav)}
                  >
                    {fav}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="history-section">
            <h3>📜 Recent</h3>
            <div className="history-list">
              {history.slice(0, 10).map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-text">{item.text}</div>
                  <div className="history-date">{formatDate(item.date)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCustomModal && (
        <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Custom Affirmation</h2>
            <p className="modal-description">
              Write a positive affirmation that resonates with you and your creative journey.
            </p>
            <textarea
              placeholder="I am..."
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              rows="4"
              autoFocus
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowCustomModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={addCustomAffirmation}>
                Add Affirmation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyAffirmations
