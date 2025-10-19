import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/QuickNotes.css'

const QuickNotes = () => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showEditor, setShowEditor] = useState(false)
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: '',
    content: '',
    tags: '',
    isFavorite: false,
    color: '#667eea',
    isPinned: false
  })

  const colors = [
    '#667eea', '#f093fb', '#4facfe', '#43e97b',
    '#fa709a', '#fee140', '#30cfd0', '#a8edea'
  ]

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    filterNotes()
  }, [notes, searchTerm, selectedFilter])

  const loadNotes = () => {
    const saved = localStorage.getItem('gmax_quick_notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }

  const saveNotes = (updatedNotes) => {
    localStorage.setItem('gmax_quick_notes', JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const filterNotes = () => {
    let filtered = [...notes]

    if (selectedFilter === 'favorites') {
      filtered = filtered.filter(n => n.isFavorite)
    } else if (selectedFilter === 'pinned') {
      filtered = filtered.filter(n => n.isPinned)
    }

    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.tags.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort: pinned first, then favorites, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return new Date(b.dateModified) - new Date(a.dateModified)
    })

    setFilteredNotes(filtered)
  }

  const createNewNote = () => {
    setCurrentNote({
      id: null,
      title: '',
      content: '',
      tags: '',
      isFavorite: false,
      color: '#667eea',
      isPinned: false
    })
    setShowEditor(true)
  }

  const editNote = (note) => {
    setCurrentNote(note)
    setShowEditor(true)
  }

  const saveNote = () => {
    if (!currentNote.title && !currentNote.content) {
      alert('Please add at least a title or content')
      return
    }

    const now = new Date().toISOString()
    
    if (currentNote.id) {
      // Update existing
      saveNotes(notes.map(n =>
        n.id === currentNote.id
          ? { ...currentNote, dateModified: now }
          : n
      ))
    } else {
      // Create new
      const newNote = {
        ...currentNote,
        id: Date.now(),
        dateCreated: now,
        dateModified: now
      }
      saveNotes([...notes, newNote])
    }

    setShowEditor(false)
  }

  const deleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      saveNotes(notes.filter(n => n.id !== id))
      if (currentNote.id === id) {
        setShowEditor(false)
      }
    }
  }

  const toggleFavorite = (id) => {
    saveNotes(notes.map(n =>
      n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
    ))
  }

  const togglePin = (id) => {
    saveNotes(notes.map(n =>
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ))
  }

  return (
    <div className="quick-notes-container">
      <div className="notes-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>📝 Quick Notes</h1>
        <button className="new-note-btn" onClick={createNewNote}>
          + New Note
        </button>
      </div>

      <div className="notes-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            📚 All Notes
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('favorites')}
          >
            ⭐ Favorites
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'pinned' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('pinned')}
          >
            📌 Pinned
          </button>
        </div>
      </div>

      <div className="notes-layout">
        <div className="notes-list">
          {filteredNotes.length === 0 ? (
            <div className="no-notes">
              <span className="no-notes-icon">📝</span>
              <p>No notes found</p>
              <p className="hint">Create your first quick note!</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className={`note-item ${currentNote.id === note.id && showEditor ? 'active' : ''}`}
                style={{ borderLeft: `4px solid ${note.color}` }}
                onClick={() => editNote(note)}
              >
                <div className="note-item-header">
                  <h3>{note.title || 'Untitled'}</h3>
                  <div className="note-badges">
                    {note.isPinned && <span className="badge">📌</span>}
                    {note.isFavorite && <span className="badge">⭐</span>}
                  </div>
                </div>
                <p className="note-preview">{note.content}</p>
                {note.tags && (
                  <div className="note-tags">
                    {note.tags.split(',').slice(0, 3).map((tag, i) => (
                      <span key={i} className="tag">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="note-date">
                  {new Date(note.dateModified).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {showEditor && (
          <div className="note-editor">
            <div className="editor-toolbar">
              <button
                className={`toolbar-btn ${currentNote.isPinned ? 'active' : ''}`}
                onClick={() => setCurrentNote({...currentNote, isPinned: !currentNote.isPinned})}
              >
                📌 Pin
              </button>
              <button
                className={`toolbar-btn ${currentNote.isFavorite ? 'active' : ''}`}
                onClick={() => setCurrentNote({...currentNote, isFavorite: !currentNote.isFavorite})}
              >
                ⭐ Favorite
              </button>
              <div className="color-picker">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${currentNote.color === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setCurrentNote({...currentNote, color})}
                  />
                ))}
              </div>
              <button className="toolbar-btn delete" onClick={() => deleteNote(currentNote.id)}>
                🗑️ Delete
              </button>
            </div>

            <input
              type="text"
              className="note-title-input"
              placeholder="Note title..."
              value={currentNote.title}
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
            />

            <textarea
              className="note-content-input"
              placeholder="Start typing..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
            />

            <input
              type="text"
              className="note-tags-input"
              placeholder="Tags (comma-separated)"
              value={currentNote.tags}
              onChange={(e) => setCurrentNote({...currentNote, tags: e.target.value})}
            />

            <div className="editor-actions">
              <button className="cancel-btn" onClick={() => setShowEditor(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveNote}>
                💾 Save Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickNotes
