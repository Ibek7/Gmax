import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/WordCounter.css'

const WordCounter = () => {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0
  })
  const [topWords, setTopWords] = useState([])

  useEffect(() => {
    calculateStats()
  }, [text])

  const calculateStats = () => {
    // Character count
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length

    // Word count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0

    // Sentence count
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0

    // Paragraph count
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200)

    // Speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(words / 150)

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    })

    // Word frequency
    if (text.trim()) {
      const wordArray = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3) // Only words longer than 3 chars

      const frequency = {}
      wordArray.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1
      })

      const sortedWords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))

      setTopWords(sortedWords)
    } else {
      setTopWords([])
    }
  }

  const clearText = () => {
    setText('')
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
    alert('Text copied to clipboard!')
  }

  const getSampleText = () => {
    const sample = `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the word counter. 

It analyzes your text and provides detailed statistics including character count, word count, sentence count, and paragraph count.

You can use this tool to check your writing progress, meet word count requirements, or analyze the frequency of words in your text. It's perfect for writers, students, and content creators.`
    setText(sample)
  }

  return (
    <div className="word-counter-container">
      <div className="word-counter-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📝 Word Counter</h1>
      </div>

      <div className="counter-main">
        <div className="text-input-section">
          <div className="input-header">
            <span className="input-title">Your Text</span>
            <div className="input-actions">
              <button onClick={getSampleText} className="sample-btn">
                📄 Sample
              </button>
              <button onClick={copyText} className="copy-btn" disabled={!text}>
                📋 Copy
              </button>
              <button onClick={clearText} className="clear-btn" disabled={!text}>
                🗑️ Clear
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="text-input"
          />
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">🔤</span>
              <span className="stat-value">{stats.characters}</span>
              <span className="stat-label">Characters</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">✏️</span>
              <span className="stat-value">{stats.charactersNoSpaces}</span>
              <span className="stat-label">Without Spaces</span>
            </div>

            <div className="stat-card highlight">
              <span className="stat-icon">📖</span>
              <span className="stat-value">{stats.words}</span>
              <span className="stat-label">Words</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">💬</span>
              <span className="stat-value">{stats.sentences}</span>
              <span className="stat-label">Sentences</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📄</span>
              <span className="stat-value">{stats.paragraphs}</span>
              <span className="stat-label">Paragraphs</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">👁️</span>
              <span className="stat-value">{stats.readingTime}m</span>
              <span className="stat-label">Reading Time</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🗣️</span>
              <span className="stat-value">{stats.speakingTime}m</span>
              <span className="stat-label">Speaking Time</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <span className="stat-value">
                {stats.words > 0 ? (stats.characters / stats.words).toFixed(1) : 0}
              </span>
              <span className="stat-label">Avg Word Length</span>
            </div>
          </div>

          {topWords.length > 0 && (
            <div className="frequency-card">
              <h3>🔝 Top 10 Words</h3>
              <div className="word-list">
                {topWords.map((item, index) => (
                  <div key={index} className="word-item">
                    <span className="word-rank">#{index + 1}</span>
                    <span className="word-text">{item.word}</span>
                    <span className="word-count">{item.count}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>ℹ️ How to Use</h3>
          <ul>
            <li>Type or paste your text in the input area</li>
            <li>View real-time statistics as you type</li>
            <li>See the most frequently used words</li>
            <li>Calculate reading and speaking time</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>📈 Statistics Explained</h3>
          <ul>
            <li><strong>Reading Time:</strong> Based on 200 words/minute</li>
            <li><strong>Speaking Time:</strong> Based on 150 words/minute</li>
            <li><strong>Top Words:</strong> Shows words longer than 3 characters</li>
            <li><strong>Avg Word Length:</strong> Average characters per word</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WordCounter
