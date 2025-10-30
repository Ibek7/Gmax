import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/SmartBookmarks.css'

const SmartBookmarks = () => {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('Work')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', 'Work', 'Personal', 'Learning', 'Tools', 'Entertainment']

  useEffect(() => {
    const saved = localStorage.getItem('gmax_smart_bookmarks')
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  const addBookmark = (e) => {
    e.preventDefault()
    if (title.trim() && url.trim()) {
      const bookmark = {
        id: Date.now(),
        title,
        url,
        category,
        visits: 0,
        createdAt: new Date().toISOString()
      }
      const updated = [...bookmarks, bookmark]
      setBookmarks(updated)
      localStorage.setItem('gmax_smart_bookmarks', JSON.stringify(updated))
      setTitle('')
      setUrl('')
      setCategory('Work')
    }
  }

  const visitBookmark = (id, url) => {
    const updated = bookmarks.map(b =>
      b.id === id ? { ...b, visits: b.visits + 1, lastVisit: new Date().toISOString() } : b
    )
    setBookmarks(updated)
    localStorage.setItem('gmax_smart_bookmarks', JSON.stringify(updated))
    window.open(url, '_blank')
  }

  const deleteBookmark = (id) => {
    const updated = bookmarks.filter(b => b.id !== id)
    setBookmarks(updated)
    localStorage.setItem('gmax_smart_bookmarks', JSON.stringify(updated))
  }

  const filteredBookmarks = bookmarks.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || b.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (cat) => {
    const colors = {
      Work: '#2196f3',
      Personal: '#4caf50',
      Learning: '#ff9800',
      Tools: '#9c27b0',
      Entertainment: '#f44336'
    }
    return colors[cat] || '#666'
  }

  const topBookmarks = [...bookmarks]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5)

  return (
    <div className="smart-bookmarks-container">
      <div className="bookmarks-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔖 Smart Bookmarks</h1>
      </div>

      <div className="bookmarks-stats">
        <div className="stat-item">
          <span className="stat-number">{bookmarks.length}</span>
          <span className="stat-label">Total Bookmarks</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{categories.length - 1}</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{bookmarks.reduce((sum, b) => sum + b.visits, 0)}</span>
          <span className="stat-label">Total Visits</span>
        </div>
      </div>

      <div className="add-bookmark-section">
        <h2>Add New Bookmark</h2>
        <form onSubmit={addBookmark}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Bookmark title..."
            required
          />
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
          <div className="form-row">
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="submit">Add Bookmark</button>
          </div>
        </form>
      </div>

      <div className="filter-section">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Search bookmarks..."
          className="search-input"
        />
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {topBookmarks.length > 0 && (
        <div className="top-bookmarks">
          <h2>🏆 Most Visited</h2>
          <div className="top-list">
            {topBookmarks.map(bookmark => (
              <div key={bookmark.id} className="top-bookmark-item">
                <span className="top-title">{bookmark.title}</span>
                <span className="top-visits">{bookmark.visits} visits</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bookmarks-grid">
        {filteredBookmarks.map(bookmark => (
          <div key={bookmark.id} className="bookmark-card">
            <div className="bookmark-header">
              <span
                className="category-badge"
                style={{ background: getCategoryColor(bookmark.category) }}
              >
                {bookmark.category}
              </span>
              <button className="delete-btn" onClick={() => deleteBookmark(bookmark.id)}>×</button>
            </div>
            <h3 onClick={() => visitBookmark(bookmark.id, bookmark.url)}>
              {bookmark.title}
            </h3>
            <p className="bookmark-url">{bookmark.url}</p>
            <div className="bookmark-footer">
              <span className="visits">👁️ {bookmark.visits} visits</span>
              {bookmark.lastVisit && (
                <span className="last-visit">
                  Last: {new Date(bookmark.lastVisit).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="empty-state">
          <p>No bookmarks found</p>
        </div>
      )}
    </div>
  )
}

export default SmartBookmarks
