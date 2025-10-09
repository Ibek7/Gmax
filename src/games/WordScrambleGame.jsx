import React, { useState, useEffect } from 'react'
import { saveGameScore } from '../utils/helpers'

const WordScrambleGame = ({ onGameComplete }) => {
  const [gameState, setGameState] = useState('menu') // menu, playing, completed
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [userGuess, setUserGuess] = useState('')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [streak, setStreak] = useState(0)
  const [hint, setHint] = useState('')
  const [showHint, setShowHint] = useState(false)

  const wordDatabase = {
    1: [
      { word: 'CREATIVE', hint: 'Having original ideas' },
      { word: 'INSPIRE', hint: 'To motivate or encourage' },
      { word: 'DESIGN', hint: 'To plan and create' },
      { word: 'ARTIST', hint: 'Someone who creates art' },
      { word: 'WRITING', hint: 'The act of putting words on paper' }
    ],
    2: [
      { word: 'IMAGINATION', hint: 'The ability to form mental images' },
      { word: 'BRILLIANT', hint: 'Exceptionally clever or talented' },
      { word: 'MASTERPIECE', hint: 'A work of outstanding artistry' },
      { word: 'INNOVATION', hint: 'A new method or idea' },
      { word: 'EXPRESSION', hint: 'The process of making feelings known' }
    ],
    3: [
      { word: 'EXTRAORDINARY', hint: 'Very unusual or remarkable' },
      { word: 'SOPHISTICATED', hint: 'Having complexity and refinement' },
      { word: 'REVOLUTIONARY', hint: 'Involving complete change' },
      { word: 'TRANSFORMATION', hint: 'A thorough change in form' },
      { word: 'ACCOMPLISHMENT', hint: 'Something that has been achieved' }
    ]
  }

  useEffect(() => {
    let timer
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  const scrambleWord = (word) => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    return letters.join('')
  }

  const getRandomWord = () => {
    const words = wordDatabase[level] || wordDatabase[1]
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setStreak(0)
    setLevel(1)
    setTimeLeft(60)
    generateNewWord()
  }

  const generateNewWord = () => {
    const wordData = getRandomWord()
    let scrambled = scrambleWord(wordData.word)
    
    // Ensure the scrambled word is different from the original
    while (scrambled === wordData.word && wordData.word.length > 3) {
      scrambled = scrambleWord(wordData.word)
    }
    
    setCurrentWord(wordData.word)
    setScrambledWord(scrambled)
    setHint(wordData.hint)
    setUserGuess('')
    setShowHint(false)
  }

  const handleGuess = () => {
    if (userGuess.toUpperCase() === currentWord) {
      // Correct guess
      const points = currentWord.length * level * (showHint ? 5 : 10)
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      
      // Level up every 5 correct answers
      if ((streak + 1) % 5 === 0 && level < 3) {
        setLevel(prev => prev + 1)
        setTimeLeft(prev => prev + 15) // Bonus time for leveling up
      } else {
        setTimeLeft(prev => prev + 5) // Small time bonus
      }
      
      generateNewWord()
      
      // Celebration effect
      if (points >= 50) {
        celebrateSuccess()
      }
    } else {
      // Wrong guess
      setStreak(0)
      setTimeLeft(prev => Math.max(0, prev - 3)) // Time penalty
      setUserGuess('')
    }
  }

  const celebrateSuccess = () => {
    // Create confetti effect
    const confetti = document.createElement('div')
    confetti.textContent = '🎉'
    confetti.style.position = 'fixed'
    confetti.style.left = '50%'
    confetti.style.top = '50%'
    confetti.style.fontSize = '2rem'
    confetti.style.transform = 'translate(-50%, -50%)'
    confetti.style.pointerEvents = 'none'
    confetti.style.zIndex = '1000'
    confetti.style.animation = 'bounce-in 0.6s ease-out'
    
    document.body.appendChild(confetti)
    setTimeout(() => document.body.removeChild(confetti), 600)
  }

  const useHint = () => {
    if (!showHint) {
      setShowHint(true)
      setTimeLeft(prev => Math.max(0, prev - 10)) // Time penalty for hint
    }
  }

  const endGame = () => {
    setGameState('completed')
    saveGameScore('word-scramble', score)
    if (onGameComplete) {
      onGameComplete({ score, level, streak })
    }
  }

  const restartGame = () => {
    startGame()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userGuess.trim()) {
      handleGuess()
    }
  }

  if (gameState === 'menu') {
    return (
      <div className="word-scramble-game">
        <div className="game-menu">
          <h2>Word Scramble Challenge</h2>
          <div className="game-description">
            <p>Unscramble the letters to form words!</p>
            <div className="game-rules">
              <h3>How to Play:</h3>
              <ul>
                <li>Look at the scrambled letters</li>
                <li>Type the correct word</li>
                <li>Earn points based on word length and level</li>
                <li>Level up every 5 correct answers</li>
                <li>Race against time to maximize your score!</li>
              </ul>
              <div className="scoring-info">
                <h4>Scoring:</h4>
                <p>Points = Word Length × Level × (Hint used? 5 : 10)</p>
              </div>
            </div>
          </div>
          <button onClick={startGame} className="start-game-btn">
            Start Game
          </button>
        </div>
      </div>
    )
  }

  if (gameState === 'completed') {
    return (
      <div className="word-scramble-game">
        <div className="game-results">
          <h2>Game Complete!</h2>
          <div className="final-stats">
            <div className="stat-item">
              <span className="stat-value">{score}</span>
              <span className="stat-label">Final Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{level}</span>
              <span className="stat-label">Level Reached</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{streak}</span>
              <span className="stat-label">Best Streak</span>
            </div>
          </div>
          <div className="game-actions">
            <button onClick={restartGame} className="play-again-btn">
              Play Again
            </button>
            <button onClick={() => setGameState('menu')} className="menu-btn">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="word-scramble-game playing">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{streak}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className={`stat-value ${timeLeft <= 10 ? 'urgent' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="word-display">
          <h3>Unscramble this word:</h3>
          <div className="scrambled-word">
            {scrambledWord.split('').map((letter, index) => (
              <span key={index} className="letter-tile">
                {letter}
              </span>
            ))}
          </div>
          <div className="word-length">
            ({currentWord.length} letters)
          </div>
        </div>

        {showHint && (
          <div className="hint-display">
            <strong>Hint:</strong> {hint}
          </div>
        )}

        <div className="guess-input">
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Type your guess..."
            maxLength={currentWord.length}
            autoFocus
          />
          <button 
            onClick={handleGuess} 
            disabled={!userGuess.trim()}
            className="submit-btn"
          >
            Submit
          </button>
        </div>

        <div className="game-actions">
          <button onClick={useHint} disabled={showHint} className="hint-btn">
            {showHint ? 'Hint Used' : 'Use Hint (-10s)'}
          </button>
          <button onClick={generateNewWord} className="skip-btn">
            Skip Word (-5s)
          </button>
          <button onClick={endGame} className="end-game-btn">
            End Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default WordScrambleGame