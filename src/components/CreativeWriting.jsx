import React, { useState } from 'react'
import { getRandomPrompt, writingPrompts } from '../data/writingPrompts'
import '../styles/CreativeWriting.css'

const CreativeWriting = () => {
  const [currentPrompt, setCurrentPrompt] = useState(getRandomPrompt())
  const [userStory, setUserStory] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  
  const genres = Object.keys(writingPrompts)
  
  const generatePrompt = () => {
    const newPrompt = selectedGenre === 'all' 
      ? getRandomPrompt() 
      : getRandomPrompt(selectedGenre)
    setCurrentPrompt(newPrompt)
  }
  
  const wordCount = userStory.split(' ').filter(word => word.length > 0).length
  
  return (
    <div className="creative-writing">
      <header className="writing-header">
        <h1 className="writing-title">✍️ Creative Writing Studio</h1>
        <p className="writing-subtitle">Transform prompts into stories, poems, and prose</p>
      </header>
      
      <div className="prompt-section">
        <div className="prompt-controls">
          <div className="genre-selector">
            <label htmlFor="genre">Genre:</label>
            <select 
              id="genre"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button onClick={generatePrompt} className="new-prompt-btn">
            🎲 New Prompt
          </button>
        </div>
        
        <div className="current-prompt">
          <h2>Writing Prompt</h2>
          <blockquote className="prompt-text">
            "{currentPrompt}"
          </blockquote>
        </div>
      </div>
      
      <div className="writing-area">
        <div className="writing-controls">
          <h2>Your Story</h2>
          <div className="writing-stats">
            <span className="word-count">Words: {wordCount}</span>
            <span className="char-count">Characters: {userStory.length}</span>
          </div>
        </div>
        
        <textarea
          value={userStory}
          onChange={(e) => setUserStory(e.target.value)}
          placeholder="Let your creativity flow... Start writing your response to the prompt above."
          className="writing-textarea"
        />
      </div>
      
      <div className="writing-tools">
        <h3>Writing Tools</h3>
        <div className="tools-grid">
          <button className="tool-btn">💾 Save Draft</button>
          <button className="tool-btn">📝 Export</button>
          <button className="tool-btn">🎯 Set Goal</button>
          <button className="tool-btn">⏱️ Timer</button>
        </div>
      </div>
    </div>
  )
}

export default CreativeWriting