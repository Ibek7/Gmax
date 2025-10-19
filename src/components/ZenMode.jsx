import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ZenMode.css'

const ZenMode = () => {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [selectedSound, setSelectedSound] = useState('rain')
  const [timer, setTimer] = useState(25)

  const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️', description: 'Gentle rainfall' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', description: 'Calming ocean sounds' },
    { id: 'forest', name: 'Forest', icon: '🌲', description: 'Birds and nature' },
    { id: 'cafe', name: 'Coffee Shop', icon: '☕', description: 'Ambient café chatter' },
    { id: 'fire', name: 'Fireplace', icon: '🔥', description: 'Crackling fire' },
    { id: 'wind', name: 'Wind', icon: '💨', description: 'Gentle breeze' }
  ]

  const quotes = [
    "Focus on the journey, not the destination",
    "Creativity takes courage",
    "Every artist was first an amateur",
    "The only way to do great work is to love what you do",
    "Progress, not perfection",
    "Your limitation—it's only your imagination"
  ]

  const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)])

  const toggleZenMode = () => {
    setIsActive(!isActive)
  }

  return (
    <div className={`zen-mode-container ${isActive ? 'active' : ''}`}>
      {!isActive ? (
        <div className="zen-setup">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          
          <div className="zen-content">
            <h1>🧘 Zen Mode</h1>
            <p className="zen-subtitle">Enter a distraction-free creative space</p>

            <div className="zen-settings">
              <div className="setting-group">
                <h3>🎵 Ambient Sound</h3>
                <div className="sounds-grid">
                  {sounds.map(sound => (
                    <button
                      key={sound.id}
                      className={`sound-btn ${selectedSound === sound.id ? 'active' : ''}`}
                      onClick={() => setSelectedSound(sound.id)}
                    >
                      <span className="sound-icon">{sound.icon}</span>
                      <span className="sound-name">{sound.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <h3>⏱️ Session Duration</h3>
                <div className="timer-controls">
                  <button onClick={() => setTimer(Math.max(5, timer - 5))}>-5</button>
                  <span className="timer-display">{timer} minutes</span>
                  <button onClick={() => setTimer(Math.min(120, timer + 5))}>+5</button>
                </div>
              </div>
            </div>

            <button className="enter-zen-btn" onClick={toggleZenMode}>
              🧘 Enter Zen Mode
            </button>
          </div>
        </div>
      ) : (
        <div className="zen-active">
          <div className="zen-minimal-controls">
            <button className="exit-zen-btn" onClick={toggleZenMode}>
              Exit Zen Mode
            </button>
          </div>

          <div className="zen-center">
            <div className="zen-timer-display">
              {timer}:00
            </div>
            <p className="zen-quote">"{currentQuote}"</p>
            <div className="zen-sound-indicator">
              {sounds.find(s => s.id === selectedSound)?.icon} {sounds.find(s => s.id === selectedSound)?.name}
            </div>
          </div>

          <div className="zen-breathing-circle">
            <div className="breathing-animation"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ZenMode
