import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BookmarksManager.css'

const BookmarksManager = () => {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [filteredBookmarks, setFilteredBookmarks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    description: '',
    category: 'resource',
    tags: '',
    isFavorite: false
  })

  const categories = [
    { id: 'all', name: 'All Bookmarks', icon: '📚', color: '#667eea' },
    { id: 'resource', name: 'Resources', icon: '📖', color: '#f093fb' },
    { id: 'inspiration', name: 'Inspiration', icon: '✨', color: '#4facfe' },
    { id: 'tutorial', name: 'Tutorials', icon: '🎓', color: '#43e97b' },
    { id: 'tool', name: 'Tools', icon: '🛠️', color: '#fa709a' },
    { id: 'article', name: 'Articles', icon: '📄', color: '#fee140' },
    { id: 'video', name: 'Videos', icon: '🎥', color: '#30cfd0' }
  ]

  useEffect(() => {
    loadBookmarks()
  }, [])

  useEffect(() => {
    filterBookmarks()
  }, [bookmarks, searchTerm, selectedCategory])

  const loadBookmarks = () => {
    const saved = localStorage.getItem('gmax_bookmarks')
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }

  const saveBookmarks = (updatedBookmarks) => {
    localStorage.setItem('gmax_bookmarks', JSON.stringify(updatedBookmarks))
    setBookmarks(updatedBookmarks)
  }

  const filterBookmarks = () => {
    let filtered = [...bookmarks]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.url.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort: favorites first, then by date
    filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return new Date(b.dateAdded) - new Date(a.dateAdded)
    })

    setFilteredBookmarks(filtered)
  }

  const addBookmark = () => {
    if (!newBookmark.title || !newBookmark.url) {
      alert('Please provide at least a title and URL')
      return
    }

    const bookmark = {
      ...newBookmark,
      id: Date.now(),
      dateAdded: new Date().toISOString()
    }

    saveBookmarks([...bookmarks, bookmark])
    setShowModal(false)
    setNewBookmark({
      title: '',
      url: '',
      description: '',
      category: 'resource',
      tags: '',
      isFavorite: false
    })
  }

  const deleteBookmark = (id) => {
    if (window.confirm('Delete this bookmark?')) {
      saveBookmarks(bookmarks.filter(b => b.id !== id))
    }
  }

  const toggleFavorite = (id) => {
    saveBookmarks(bookmarks.map(b => 
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    ))
  }

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[1]
  }

  const openBookmark = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bookmarks-manager-container">
      <div className="bookmarks-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>📚 Bookmarks Manager</h1>
        <button className="add-bookmark-btn" onClick={() => setShowModal(true)}>
          + Add Bookmark
        </button>
      </div>

      {showModal && (
        <div className="bookmark-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Bookmark</h2>
            
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                placeholder="Bookmark title"
              />
            </div>

            <div className="form-group">
              <label>URL *</label>
              <input
                type="url"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                placeholder="What's this bookmark about?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newBookmark.category}
                onChange={(e) => setNewBookmark({...newBookmark, category: e.target.value})}
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={newBookmark.tags}
                onChange={(e) => setNewBookmark({...newBookmark, tags: e.target.value})}
                placeholder="design, tutorial, javascript"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={newBookmark.isFavorite}
                  onChange={(e) => setNewBookmark({...newBookmark, isFavorite: e.target.checked})}
                />
                <span>Add to favorites</span>
              </label>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={addBookmark}>
                Add Bookmark
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bookmarks-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                borderColor: selectedCategory === cat.id ? cat.color : 'transparent',
                background: selectedCategory === cat.id ? `${cat.color}20` : 'transparent'
              }}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bookmarks-grid">
        {filteredBookmarks.length === 0 ? (
          <div className="no-bookmarks">
            <span className="no-bookmarks-icon">📚</span>
            <p>No bookmarks found</p>
            <p className="hint">Add your first bookmark to get started!</p>
          </div>
        ) : (
          filteredBookmarks.map(bookmark => {
            const catInfo = getCategoryInfo(bookmark.category)
            return (
              <div key={bookmark.id} className="bookmark-card">
                <div className="bookmark-header">
                  <div 
                    className="category-badge"
                    style={{ background: catInfo.color }}
                  >
                    {catInfo.icon}
                  </div>
                  <button
                    className={`favorite-btn ${bookmark.isFavorite ? 'active' : ''}`}
                    onClick={() => toggleFavorite(bookmark.id)}
                  >
                    {bookmark.isFavorite ? '⭐' : '☆'}
                  </button>
                </div>

                <div className="bookmark-content" onClick={() => openBookmark(bookmark.url)}>
                  <h3>{bookmark.title}</h3>
                  {bookmark.description && (
                    <p className="bookmark-description">{bookmark.description}</p>
                  )}
                  <div className="bookmark-url">{bookmark.url}</div>
                  
                  {bookmark.tags && (
                    <div className="bookmark-tags">
                      {bookmark.tags.split(',').map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bookmark-footer">
                  <span className="date-added">
                    Added {new Date(bookmark.dateAdded).toLocaleDateString()}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteBookmark(bookmark.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default BookmarksManager
