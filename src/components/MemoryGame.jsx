import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MemoryGame.css'

const MemoryGame = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [bestScores, setBestScores] = useState({ easy: null, medium: null, hard: null })

  const cardEmojis = {
    easy: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'],
    medium: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒'],
    hard: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐']
  }

  const gridSizes = {
    easy: 12,
    medium: 16,
    hard: 20
  }

  useEffect(() => {
    const savedScores = localStorage.getItem('gmax_memory_scores')
    if (savedScores) setBestScores(JSON.parse(savedScores))
    initializeGame()
  }, [difficulty])

  useEffect(() => {
    let interval
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTime(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameWon])

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      setMoves(m => m + 1)

      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second])
        setFlipped([])

        if (matched.length + 2 === cards.length) {
          setGameWon(true)
          setIsPlaying(false)
          saveScore()
        }
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }, [flipped])

  const initializeGame = () => {
    const emojis = cardEmojis[difficulty]
    const pairs = emojis.slice(0, gridSizes[difficulty] / 2)
    const shuffled = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }))

    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTime(0)
    setIsPlaying(false)
    setGameWon(false)
  }

  const handleCardClick = (index) => {
    if (!isPlaying) setIsPlaying(true)
    if (flipped.length === 2) return
    if (flipped.includes(index)) return
    if (matched.includes(index)) return

    setFlipped([...flipped, index])
  }

  const saveScore = () => {
    const currentScore = bestScores[difficulty]
    const newScore = { moves, time, date: new Date().toLocaleDateString() }

    if (!currentScore || moves < currentScore.moves || (moves === currentScore.moves && time < currentScore.time)) {
      const updated = { ...bestScores, [difficulty]: newScore }
      setBestScores(updated)
      localStorage.setItem('gmax_memory_scores', JSON.stringify(updated))
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStars = () => {
    const pairs = cards.length / 2
    const perfectMoves = pairs
    const goodMoves = pairs * 1.5

    if (moves <= perfectMoves) return 3
    if (moves <= goodMoves) return 2
    return 1
  }

  return (
    <div className="memory-game-container">
      <div className="memory-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🧠 Memory Game</h1>
      </div>

      <div className="game-controls">
        <div className="difficulty-selector">
          <button
            className={difficulty === 'easy' ? 'active' : ''}
            onClick={() => { setDifficulty('easy'); initializeGame() }}
          >
            Easy (3x4)
          </button>
          <button
            className={difficulty === 'medium' ? 'active' : ''}
            onClick={() => { setDifficulty('medium'); initializeGame() }}
          >
            Medium (4x4)
          </button>
          <button
            className={difficulty === 'hard' ? 'active' : ''}
            onClick={() => { setDifficulty('hard'); initializeGame() }}
          >
            Hard (4x5)
          </button>
        </div>

        <div className="game-stats">
          <div className="stat-box">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
        </div>

        <button className="reset-btn" onClick={initializeGame}>
          🔄 New Game
        </button>
      </div>

      <div className={`cards-grid cards-grid-${difficulty}`}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index)
          return (
            <div
              key={card.id}
              className={`memory-card ${isFlipped ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{card.emoji}</div>
              </div>
            </div>
          )
        })}
      </div>

      {gameWon && (
        <div className="win-modal">
          <div className="win-content">
            <h2>🎉 You Won!</h2>
            <div className="win-stars">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={i < getStars() ? 'star-filled' : 'star-empty'}>
                  ⭐
                </span>
              ))}
            </div>
            <div className="win-stats">
              <p>Moves: <strong>{moves}</strong></p>
              <p>Time: <strong>{formatTime(time)}</strong></p>
            </div>
            <button onClick={initializeGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}

      {bestScores[difficulty] && (
        <div className="best-score-card">
          <h3>🏆 Best Score ({difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})</h3>
          <div className="score-details">
            <div className="score-item">
              <span className="score-label">Moves:</span>
              <span className="score-value">{bestScores[difficulty].moves}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Time:</span>
              <span className="score-value">{formatTime(bestScores[difficulty].time)}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Date:</span>
              <span className="score-value">{bestScores[difficulty].date}</span>
            </div>
          </div>
        </div>
      )}

      <div className="how-to-play">
        <h3>📖 How to Play</h3>
        <ul>
          <li>Click on cards to reveal them</li>
          <li>Match pairs of identical emojis</li>
          <li>Try to complete the game in the fewest moves</li>
          <li>Beat your best score for each difficulty level</li>
          <li>Earn 3 stars for perfect games!</li>
        </ul>
      </div>
    </div>
  )
}

export default MemoryGame
