import React, { useState, useEffect } from 'react'
import '../styles/ColorMemoryGame.css'

const ColorMemoryGame = ({ onBack }) => {
  const [sequence, setSequence] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [activeColor, setActiveColor] = useState(null)
  
  const colors = [
    { id: 0, name: 'red', color: '#ff6b6b' },
    { id: 1, name: 'blue', color: '#4ecdc4' },
    { id: 2, name: 'green', color: '#95e1d3' },
    { id: 3, name: 'yellow', color: '#fce38a' }
  ]
  
  const startGame = () => {
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
    nextRound([])
  }
  
  const nextRound = (currentSequence) => {
    const newColor = Math.floor(Math.random() * colors.length)
    const newSequence = [...currentSequence, newColor]
    setSequence(newSequence)
    setPlayerSequence([])
    setIsPlayerTurn(false)
    playSequence(newSequence)
  }
  
  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setActiveColor(seq[i])
      await new Promise(resolve => setTimeout(resolve, 400))
      setActiveColor(null)
    }
    setIsPlayerTurn(true)
  }
  
  const handleColorClick = (colorId) => {
    if (!isPlayerTurn || gameOver) return
    
    const newPlayerSequence = [...playerSequence, colorId]
    setPlayerSequence(newPlayerSequence)
    
    // Check if player clicked wrong color
    if (colorId !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true)
      setIsPlaying(false)
      setIsPlayerTurn(false)
      return
    }
    
    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1)
      setTimeout(() => {
        nextRound(sequence)
      }, 1000)
    }
  }
  
  return (
    <div className="color-memory-game">
      <div className="game-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>🌈 Color Memory</h1>
        <div className="score">Score: {score}</div>
      </div>
      
      {!isPlaying && !gameOver && (
        <div className="game-start">
          <h2>Test Your Memory!</h2>
          <p>Watch the sequence of colors, then repeat it back.</p>
          <button onClick={startGame} className="start-btn">Start Game</button>
        </div>
      )}
      
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={startGame} className="play-again-btn">Play Again</button>
        </div>
      )}
      
      {isPlaying && (
        <div className="game-status">
          {isPlayerTurn ? (
            <p>Your turn! Click the colors in order.</p>
          ) : (
            <p>Watch the sequence...</p>
          )}
        </div>
      )}
      
      <div className="color-grid">
        {colors.map(color => (
          <button
            key={color.id}
            className={`color-button ${activeColor === color.id ? 'active' : ''}`}
            style={{ backgroundColor: color.color }}
            onClick={() => handleColorClick(color.id)}
            disabled={!isPlayerTurn}
          />
        ))}
      </div>
    </div>
  )
}

export default ColorMemoryGame