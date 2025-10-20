import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/InspirationFeed.css'

const InspirationFeed = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const defaultItems = [
    { id: 1, title: 'The Power of Constraints', category: 'article', url: '#', bookmarked: false, notes: 'Limitations can boost creativity' },
    { id: 2, title: 'Creative Color Palettes 2025', category: 'design', url: '#', bookmarked: true, notes: '' },
    { id: 3, title: 'Building in Public', category: 'video', url: '#', bookmarked: false, notes: 'Share your creative journey' },
    { id: 4, title: 'Daily UI Challenge', category: 'challenge', url: '#', bookmarked: true, notes: 'Practice design daily' },
    { id: 5, title: 'Lo-Fi Coding Music', category: 'music', url: '#', bookmarked: false, notes: 'Focus music for deep work' }
  ]

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    const saved = localStorage.getItem('gmax_inspiration_feed')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(defaultItems)
      localStorage.setItem('gmax_inspiration_feed', JSON.stringify(defaultItems))
    }
  }

  const saveItems = (updated) => {
    setItems(updated)
    localStorage.setItem('gmax_inspiration_feed', JSON.stringify(updated))
  }

  const addItem = (item) => {
    const newItem = { ...item, id: Date.now(), bookmarked: false }
    const updated = [newItem, ...items]
    saveItems(updated)
    setShowAddModal(false)
  }

  const toggleBookmark = (id) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
    )
    saveItems(updated)
  }

  const deleteItem = (id) => {
    const updated = items.filter(item => item.id !== id)
    saveItems(updated)
  }

  const getFilteredItems = () => {
    if (filter === 'bookmarked') {
      return items.filter(item => item.bookmarked)
    }
    if (filter === 'all') {
      return items
    }
    return items.filter(item => item.category === filter)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      article: '📄',
      design: '🎨',
      video: '🎥',
      challenge: '🎯',
      music: '🎵',
      code: '💻',
      other: '⭐'
    }
    return icons[category] || '⭐'
  }

  const categories = ['all', 'bookmarked', 'article', 'design', 'video', 'challenge', 'music', 'code', 'other']

  return (
    <div className="inspiration-feed-container">
      <div className="feed-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💡 Inspiration Feed</h1>
        <button className="add-item-btn" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
      </div>

      <div className="filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={filter === cat ? 'active' : ''}
            onClick={() => setFilter(cat)}
          >
            {cat === 'bookmarked' ? '⭐' : cat === 'all' ? 'All' : getCategoryIcon(cat)} 
            {' '}
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="inspiration-grid">
        {getFilteredItems().length === 0 ? (
          <div className="empty-state">
            <h2>No inspiration items yet</h2>
            <p>Start building your inspiration collection!</p>
          </div>
        ) : (
          getFilteredItems().map(item => (
            <div key={item.id} className="inspiration-card">
              <div className="card-header">
                <span className="category-badge">
                  {getCategoryIcon(item.category)} {item.category}
                </span>
                <div className="card-actions">
                  <button
                    className={`bookmark-btn ${item.bookmarked ? 'bookmarked' : ''}`}
                    onClick={() => toggleBookmark(item.id)}
                  >
                    {item.bookmarked ? '⭐' : '☆'}
                  </button>
                  <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <h3>{item.title}</h3>
              {item.notes && <p className="item-notes">{item.notes}</p>}
              {item.url && item.url !== '#' && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="item-link">
                  Visit Link →
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddItemModal onSave={addItem} onCancel={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

const AddItemModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'article',
    url: '',
    notes: ''
  })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add Inspiration</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
              placeholder="e.g., Amazing design tutorial"
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="article">📄 Article</option>
              <option value="design">🎨 Design</option>
              <option value="video">🎥 Video</option>
              <option value="challenge">🎯 Challenge</option>
              <option value="music">🎵 Music</option>
              <option value="code">💻 Code</option>
              <option value="other">⭐ Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Add notes about why this inspires you..."
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Add to Feed</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InspirationFeed
