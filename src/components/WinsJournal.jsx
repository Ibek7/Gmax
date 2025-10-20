import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/WinsJournal.css'

const WinsJournal = () => {
  const navigate = useNavigate()
  const [wins, setWins] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'week', 'month'

  useEffect(() => {
    loadWins()
  }, [])

  const loadWins = () => {
    const saved = localStorage.getItem('gmax_wins_journal')
    if (saved) {
      setWins(JSON.parse(saved))
    }
  }

  const saveWins = (updated) => {
    setWins(updated)
    localStorage.setItem('gmax_wins_journal', JSON.stringify(updated))
  }

  const addWin = (win) => {
    const newWin = {
      ...win,
      id: Date.now(),
      date: new Date().toISOString(),
      celebrated: false
    }
    const updated = [newWin, ...wins]
    saveWins(updated)
    setShowAddModal(false)
  }

  const toggleCelebrate = (id) => {
    const updated = wins.map(w =>
      w.id === id ? { ...w, celebrated: !w.celebrated } : w
    )
    saveWins(updated)
  }

  const deleteWin = (id) => {
    const updated = wins.filter(w => w.id !== id)
    saveWins(updated)
  }

  const getFilteredWins = () => {
    const now = new Date()
    if (filter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return wins.filter(w => new Date(w.date) >= oneWeekAgo)
    }
    if (filter === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return wins.filter(w => new Date(w.date) >= oneMonthAgo)
    }
    return wins
  }

  const getSizeIcon = (size) => {
    const icons = { small: '✨', medium: '🎯', large: '🏆' }
    return icons[size] || '✨'
  }

  const getSizeLabel = (size) => {
    const labels = { small: 'Small Win', medium: 'Medium Win', large: 'Big Win' }
    return labels[size] || 'Win'
  }

  return (
    <div className="wins-journal-container">
      <div className="wins-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🏆 Creative Wins Journal</h1>
        <button className="add-win-btn" onClick={() => setShowAddModal(true)}>
          + Add Win
        </button>
      </div>

      <div className="wins-stats">
        <div className="stat-card">
          <div className="stat-value">{wins.length}</div>
          <div className="stat-label">Total Wins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getFilteredWins().filter(w => w.size === 'large').length}</div>
          <div className="stat-label">Big Wins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{wins.filter(w => w.celebrated).length}</div>
          <div className="stat-label">Celebrated</div>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All Time
        </button>
        <button className={filter === 'week' ? 'active' : ''} onClick={() => setFilter('week')}>
          This Week
        </button>
        <button className={filter === 'month' ? 'active' : ''} onClick={() => setFilter('month')}>
          This Month
        </button>
      </div>

      <div className="wins-grid">
        {getFilteredWins().length === 0 ? (
          <div className="empty-state">
            <h2>No wins yet!</h2>
            <p>Start celebrating your creative victories, big and small.</p>
          </div>
        ) : (
          getFilteredWins().map(win => (
            <div key={win.id} className={`win-card ${win.size}`}>
              <div className="win-header">
                <div className="win-icon">{getSizeIcon(win.size)}</div>
                <div className="win-size-label">{getSizeLabel(win.size)}</div>
                <button className="delete-win-btn" onClick={() => deleteWin(win.id)}>
                  🗑️
                </button>
              </div>
              <h3>{win.title}</h3>
              <p>{win.description}</p>
              <div className="win-footer">
                <span className="win-date">
                  {new Date(win.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <button
                  className={`celebrate-btn ${win.celebrated ? 'celebrated' : ''}`}
                  onClick={() => toggleCelebrate(win.id)}
                >
                  {win.celebrated ? '🎉 Celebrated!' : '🎉 Celebrate'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddWinModal onSave={addWin} onCancel={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

const AddWinModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    size: 'small'
  })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>🎉 Add a Win!</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
          <div className="form-group">
            <label>What did you accomplish? *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Launched my first app!"
              required
            />
          </div>
          <div className="form-group">
            <label>Tell us more about it</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Add details about this win..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Win Size</label>
            <select
              value={formData.size}
              onChange={e => setFormData({...formData, size: e.target.value})}
            >
              <option value="small">✨ Small Win</option>
              <option value="medium">🎯 Medium Win</option>
              <option value="large">🏆 Big Win</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Add Win</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WinsJournal
