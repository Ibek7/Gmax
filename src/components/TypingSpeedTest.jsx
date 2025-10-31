import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TypingSpeedTest.css'

const TypingSpeedTest = () => {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [inputText, setInputText] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [results, setResults] = useState([])
  const [difficulty, setDifficulty] = useState('medium')

  const sampleTexts = {
    easy: [
      'The quick brown fox jumps over the lazy dog.',
      'Pack my box with five dozen liquor jugs.',
      'How razorback jumping frogs can level six piqued gymnasts.',
      'Sphinx of black quartz judge my vow.'
    ],
    medium: [
      'The five boxing wizards jump quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.',
      'Amazingly few discotheques provide jukeboxes. Crazy Frederick bought many very exquisite opal jewels.',
      'Sixty zippers were quickly picked from the woven jute bag. A quick movement of the enemy will jeopardize six gunboats.'
    ],
    hard: [
      'In the heart of a bustling metropolis, where skyscrapers pierce the clouds and millions of souls navigate the concrete jungle, there exists a delicate balance between chaos and order.',
      'The technological revolution has fundamentally transformed how we communicate, learn, and perceive reality itself, creating unprecedented opportunities while simultaneously presenting complex ethical dilemmas.'
    ]
  }

  useEffect(() => {
    generateNewText()
  }, [difficulty])

  useEffect(() => {
    const saved = localStorage.getItem('gmax_typing_results')
    if (saved) setResults(JSON.parse(saved))
  }, [])

  useEffect(() => {
    let interval
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setTimeElapsed(elapsed)
        calculateWPM(elapsed)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRunning, startTime, inputText])

  const generateNewText = () => {
    const texts = sampleTexts[difficulty]
    const randomText = texts[Math.floor(Math.random() * texts.length)]
    setText(randomText)
    resetTest()
  }

  const resetTest = () => {
    setInputText('')
    setStartTime(null)
    setIsRunning(false)
    setTimeElapsed(0)
    setWpm(0)
    setAccuracy(100)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    
    if (!isRunning && value.length === 1) {
      setStartTime(Date.now())
      setIsRunning(true)
    }

    setInputText(value)
    calculateAccuracy(value)

    if (value === text) {
      finishTest()
    }
  }

  const calculateWPM = (elapsed) => {
    if (elapsed === 0) return
    const words = inputText.trim().split(/\s+/).length
    const minutes = elapsed / 60
    const calculatedWPM = Math.round(words / minutes)
    setWpm(calculatedWPM)
  }

  const calculateAccuracy = (input) => {
    if (input.length === 0) {
      setAccuracy(100)
      return
    }

    let correct = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correct++
    }
    const accuracyPercent = Math.round((correct / input.length) * 100)
    setAccuracy(accuracyPercent)
  }

  const finishTest = () => {
    setIsRunning(false)
    const result = {
      wpm,
      accuracy,
      time: timeElapsed,
      difficulty,
      timestamp: new Date().toISOString()
    }
    const updated = [result, ...results.slice(0, 9)]
    setResults(updated)
    localStorage.setItem('gmax_typing_results', JSON.stringify(updated))
  }

  const getCharClass = (index) => {
    if (index >= inputText.length) return ''
    if (inputText[index] === text[index]) return 'correct'
    return 'incorrect'
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clearResults = () => {
    setResults([])
    localStorage.removeItem('gmax_typing_results')
  }

  return (
    <div className="typing-test-container">
      <div className="typing-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⌨️ Typing Speed Test</h1>
      </div>

      <div className="typing-card">
        <div className="difficulty-selector">
          <button
            className={`diff-btn ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => { setDifficulty('easy'); }}
          >
            Easy
          </button>
          <button
            className={`diff-btn ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => { setDifficulty('medium'); }}
          >
            Medium
          </button>
          <button
            className={`diff-btn ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => { setDifficulty('hard'); }}
          >
            Hard
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(timeElapsed)}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">WPM</span>
            <span className="stat-value" style={{ color: '#4caf50' }}>{wpm}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value" style={{ color: accuracy >= 90 ? '#4caf50' : '#ff9800' }}>
              {accuracy}%
            </span>
          </div>
        </div>

        <div className="text-display">
          {text.split('').map((char, index) => (
            <span key={index} className={`char ${getCharClass(index)}`}>
              {char}
            </span>
          ))}
        </div>

        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          className="typing-input"
          disabled={inputText === text}
        />

        <div className="test-actions">
          <button onClick={generateNewText} className="new-test-btn">
            🔄 New Text
          </button>
          <button onClick={resetTest} className="reset-btn">
            ↺ Reset
          </button>
        </div>

        {inputText === text && (
          <div className="completion-message">
            🎉 Test Complete! WPM: {wpm} | Accuracy: {accuracy}%
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>📊 Test History</h2>
            <button className="clear-results-btn" onClick={clearResults}>
              Clear History
            </button>
          </div>
          <div className="results-grid">
            {results.map((result, idx) => (
              <div key={idx} className="result-card">
                <div className="result-main">
                  <span className="result-wpm">{result.wpm} WPM</span>
                  <span className="result-accuracy">{result.accuracy}% accuracy</span>
                </div>
                <div className="result-meta">
                  <span className="result-difficulty">
                    {result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)}
                  </span>
                  <span className="result-time">{formatTime(result.time)}</span>
                  <span className="result-date">
                    {new Date(result.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TypingSpeedTest
