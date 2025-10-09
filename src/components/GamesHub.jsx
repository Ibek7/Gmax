import React, { useState } from 'react'
import ColorMemoryGame from '../games/ColorMemoryGame'
import '../styles/GamesHub.css'

const GamesHub = () => {
  const [selectedGame, setSelectedGame] = useState(null)
  
  const games = [
    {
      id: 'color-memory',
      title: 'Color Memory',
      description: 'Test your memory with color sequences',
      icon: '🌈',
      difficulty: 'Easy',
      status: 'available'
    },
    {
      id: 'word-chain',
      title: 'Word Chain',
      description: 'Create word chains and build vocabulary',
      icon: '🔗',
      difficulty: 'Medium',
      status: 'available'
    },
    {
      id: 'pattern-puzzle',
      title: 'Pattern Puzzle',
      description: 'Solve geometric pattern challenges',
      icon: '🧩',
      difficulty: 'Hard',
      status: 'coming-soon'
    },
    {
      id: 'rhythm-tap',
      title: 'Rhythm Tap',
      description: 'Follow the beat and create music',
      icon: '🥁',
      difficulty: 'Medium',
      status: 'coming-soon'
    }
  ]
  
  const startGame = (gameId) => {
    setSelectedGame(gameId)
    // This will be expanded with actual game implementations
  }
  
  if (selectedGame === 'color-memory') {
    return <ColorMemoryGame onBack={() => setSelectedGame(null)} />
  }
  
  if (selectedGame) {
    return (
      <div className="game-container">
        <button 
          className="back-button"
          onClick={() => setSelectedGame(null)}
        >
          ← Back to Games
        </button>
        <div className="game-placeholder">
          <h2>Game: {games.find(g => g.id === selectedGame)?.title}</h2>
          <p>Game implementation coming soon!</p>
          <div className="game-preview">
            <div className="preview-box">Game Area</div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="games-hub">
      <header className="games-header">
        <h1 className="games-title">Mini Games Collection</h1>
        <p className="games-subtitle">Challenge your mind with creative mini-games</p>
      </header>
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className={`game-card ${game.status}`}>
            <div className="game-icon">{game.icon}</div>
            <h3 className="game-title">{game.title}</h3>
            <p className="game-description">{game.description}</p>
            <div className="game-meta">
              <span className="difficulty">{game.difficulty}</span>
              <span className={`status ${game.status}`}>
                {game.status === 'available' ? 'Play Now' : 'Coming Soon'}
              </span>
            </div>
            {game.status === 'available' && (
              <button 
                className="play-button"
                onClick={() => startGame(game.id)}
              >
                Start Game
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="games-stats">
        <h2 className="section-title">Your Gaming Stats</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Games Played</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">High Score</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Time Played</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamesHub