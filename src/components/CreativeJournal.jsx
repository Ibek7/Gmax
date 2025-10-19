import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeJournal.css'

const CreativeJournal = () => {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [currentEntry, setCurrentEntry] = useState('')
  const [mood, setMood] = useState('neutral')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const moods = [
    { value: 'excited', emoji: '🤩', color: '#FFD700' },
    { value: 'happy', emoji: '😊', color: '#4CAF50' },
    { value: 'neutral', emoji: '😐', color: '#9E9E9E' },
    { value: 'thoughtful', emoji: '🤔', color: '#2196F3' },
    { value: 'sad', emoji: '😢', color: '#607D8B' },
    { value: 'frustrated', emoji: '😤', color: '#FF5722' }
  ]

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = () => {
    const saved = localStorage.getItem('gmax_journal_entries')
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }

  const saveEntry = () => {
    if (!currentEntry.trim()) return
    
    const entry = {
      id: Date.now(),
      content: currentEntry,
      mood,
      tags: [...tags],
      date: new Date().toISOString(),
      wordCount: currentEntry.trim().split(/\s+/).length
    }
    
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('gmax_journal_entries', JSON.stringify(updated))
    
    setCurrentEntry('')
    setTags([])
    setMood('neutral')
  }

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('gmax_journal_entries', JSON.stringify(updated))
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag))
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesMood = filter === 'all' || entry.mood === filter
    return matchesSearch && matchesMood
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="creative-journal-container">
      <div className="journal-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📔 Creative Journal</h1>
      </div>

      <div className="journal-layout">
        <div className="journal-editor">
          <div className="mood-selector">
            <label>How are you feeling?</label>
            <div className="mood-options">
              {moods.map(m => (
                <button
                  key={m.value}
                  className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                  style={{ borderColor: mood === m.value ? m.color : '#e0e0e0' }}
                  onClick={() => setMood(m.value)}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-name">{m.value}</span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="journal-textarea"
            placeholder="Write your thoughts, ideas, reflections..."
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
          />

          <div className="tags-section">
            <div className="tags-input">
              <input
                type="text"
                placeholder="Add tags..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <button onClick={addTag}>+ Add</button>
            </div>
            <div className="tags-list">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <button 
            className="save-entry-btn" 
            onClick={saveEntry}
            disabled={!currentEntry.trim()}
          >
            💾 Save Entry
          </button>
        </div>

        <div className="journal-entries">
          <div className="entries-filter">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Moods</option>
              {moods.map(m => (
                <option key={m.value} value={m.value}>{m.emoji} {m.value}</option>
              ))}
            </select>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="no-entries">
              <p>No journal entries yet. Start writing! ✨</p>
            </div>
          ) : (
            <div className="entries-list">
              {filteredEntries.map(entry => {
                const entryMood = moods.find(m => m.value === entry.mood)
                return (
                  <div key={entry.id} className="entry-card">
                    <div className="entry-header">
                      <span className="entry-mood" style={{ color: entryMood?.color }}>
                        {entryMood?.emoji}
                      </span>
                      <span className="entry-date">{formatDate(entry.date)}</span>
                      <button className="delete-btn" onClick={() => deleteEntry(entry.id)}>🗑️</button>
                    </div>
                    <p className="entry-content">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="entry-tags">
                        {entry.tags.map(tag => (
                          <span key={tag} className="entry-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="entry-stats">
                      {entry.wordCount} words
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreativeJournal
