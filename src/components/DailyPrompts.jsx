import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DailyPrompts.css'

const DailyPrompts = () => {
  const navigate = useNavigate()
  const [todayPrompt, setTodayPrompt] = useState(null)
  const [savedResponses, setSavedResponses] = useState([])
  const [currentResponse, setCurrentResponse] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const prompts = [
    { category: 'writing', icon: '✍️', prompt: 'Write about a childhood memory that still makes you smile.' },
    { category: 'writing', icon: '✍️', prompt: 'Describe a place you\'ve never been but dream of visiting.' },
    { category: 'art', icon: '🎨', prompt: 'Create a piece inspired by your current emotions.' },
    { category: 'art', icon: '🎨', prompt: 'Sketch something from nature in a unique style.' },
    { category: 'music', icon: '🎵', prompt: 'Compose a melody that represents your perfect day.' },
    { category: 'music', icon: '🎵', prompt: 'Create a rhythm inspired by a rainy afternoon.' },
    { category: 'code', icon: '💻', prompt: 'Build a mini-tool that solves a daily annoyance.' },
    { category: 'code', icon: '💻', prompt: 'Refactor an old project with a new technique you learned.' },
    { category: 'games', icon: '🎮', prompt: 'Design a simple game mechanic based on a real-life activity.' },
    { category: 'games', icon: '🎮', prompt: 'Sketch a character concept for a story-driven game.' },
    { category: 'general', icon: '✨', prompt: 'What would you create if you had unlimited time and resources?' },
    { category: 'general', icon: '✨', prompt: 'Describe your creative process in three words and expand on each.' },
    { category: 'general', icon: '🌟', prompt: 'Combine two unrelated concepts into something new.' },
    { category: 'general', icon: '💡', prompt: 'What skill would you master if you could learn instantly?' }
  ]

  useEffect(() => {
    loadTodayPrompt()
    loadResponses()
  }, [])

  const loadTodayPrompt = () => {
    const today = new Date().toDateString()
    const savedPrompt = localStorage.getItem('gmax_daily_prompt')
    const savedDate = localStorage.getItem('gmax_daily_prompt_date')

    if (savedDate === today && savedPrompt) {
      setTodayPrompt(JSON.parse(savedPrompt))
    } else {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
      setTodayPrompt(randomPrompt)
      localStorage.setItem('gmax_daily_prompt', JSON.stringify(randomPrompt))
      localStorage.setItem('gmax_daily_prompt_date', today)
    }
  }

  const loadResponses = () => {
    const saved = localStorage.getItem('gmax_prompt_responses')
    if (saved) {
      setSavedResponses(JSON.parse(saved))
    }
  }

  const saveResponse = () => {
    if (!currentResponse.trim()) {
      alert('Please write a response first')
      return
    }

    const response = {
      id: Date.now(),
      prompt: todayPrompt.prompt,
      category: todayPrompt.category,
      response: currentResponse,
      date: new Date().toISOString()
    }

    const updated = [response, ...savedResponses]
    localStorage.setItem('gmax_prompt_responses', JSON.stringify(updated))
    setSavedResponses(updated)
    setCurrentResponse('')
    alert('Response saved! 🎉')
  }

  const deleteResponse = (id) => {
    if (window.confirm('Delete this response?')) {
      const updated = savedResponses.filter(r => r.id !== id)
      localStorage.setItem('gmax_prompt_responses', JSON.stringify(updated))
      setSavedResponses(updated)
    }
  }

  const getNewPrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    setTodayPrompt(randomPrompt)
    const today = new Date().toDateString()
    localStorage.setItem('gmax_daily_prompt', JSON.stringify(randomPrompt))
    localStorage.setItem('gmax_daily_prompt_date', today)
  }

  const getCategoryColor = (category) => {
    const colors = {
      writing: '#667eea',
      art: '#f093fb',
      music: '#4facfe',
      code: '#43e97b',
      games: '#fa709a',
      general: '#fee140'
    }
    return colors[category] || '#667eea'
  }

  return (
    <div className="daily-prompts-container">
      <div className="prompts-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>💡 Daily Creative Prompts</h1>
        <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
          📚 {showHistory ? 'Today' : 'History'}
        </button>
      </div>

      {!showHistory ? (
        <div className="prompt-section">
          {todayPrompt && (
            <div className="prompt-card" style={{ borderColor: getCategoryColor(todayPrompt.category) }}>
              <div className="prompt-badge" style={{ background: getCategoryColor(todayPrompt.category) }}>
                <span className="prompt-icon">{todayPrompt.icon}</span>
                <span className="prompt-category">{todayPrompt.category}</span>
              </div>
              
              <h2 className="prompt-title">Today's Creative Prompt</h2>
              <p className="prompt-text">{todayPrompt.prompt}</p>
              
              <button className="shuffle-btn" onClick={getNewPrompt}>
                🔄 Get New Prompt
              </button>
            </div>
          )}

          <div className="response-section">
            <h3>Your Response</h3>
            <textarea
              className="response-textarea"
              placeholder="Start writing your creative response..."
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              rows="15"
            />
            <button className="save-response-btn" onClick={saveResponse}>
              💾 Save Response
            </button>
          </div>
        </div>
      ) : (
        <div className="history-section">
          <h2>Response History</h2>
          {savedResponses.length === 0 ? (
            <div className="no-history">
              <span className="no-history-icon">📝</span>
              <p>No saved responses yet</p>
              <p className="hint">Start responding to daily prompts to build your history!</p>
            </div>
          ) : (
            <div className="history-grid">
              {savedResponses.map(resp => (
                <div
                  key={resp.id}
                  className="history-card"
                  style={{ borderLeft: `4px solid ${getCategoryColor(resp.category)}` }}
                >
                  <div className="history-header">
                    <span className="history-date">
                      {new Date(resp.date).toLocaleDateString()}
                    </span>
                    <button
                      className="delete-history-btn"
                      onClick={() => deleteResponse(resp.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="history-prompt">{resp.prompt}</p>
                  <p className="history-response">{resp.response}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DailyPrompts
