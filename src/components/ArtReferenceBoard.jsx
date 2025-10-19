import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ArtReferenceBoard.css'

const ArtReferenceBoard = () => {
  const navigate = useNavigate()
  const [references, setReferences] = useState([])
  const [newRef, setNewRef] = useState({ title: '', url: '', category: 'character' })
  const [filter, setFilter] = useState('all')

  const categories = ['character', 'environment', 'color', 'pose', 'lighting', 'texture']

  useEffect(() => {
    loadReferences()
  }, [])

  const loadReferences = () => {
    const saved = localStorage.getItem('gmax_art_references')
    if (saved) {
      setReferences(JSON.parse(saved))
    } else {
      const mock = [
        { id: 1, title: 'Character Study', url: '🎨', category: 'character', date: new Date().toISOString() },
        { id: 2, title: 'Environment', url: '🏞️', category: 'environment', date: new Date().toISOString() }
      ]
      setReferences(mock)
      localStorage.setItem('gmax_art_references', JSON.stringify(mock))
    }
  }

  const addReference = () => {
    if (!newRef.title || !newRef.url) return
    const ref = { ...newRef, id: Date.now(), date: new Date().toISOString() }
    const updated = [ref, ...references]
    setReferences(updated)
    localStorage.setItem('gmax_art_references', JSON.stringify(updated))
    setNewRef({ title: '', url: '', category: 'character' })
  }

  const deleteRef = (id) => {
    const updated = references.filter(r => r.id !== id)
    setReferences(updated)
    localStorage.setItem('gmax_art_references', JSON.stringify(updated))
  }

  const filteredRefs = filter === 'all' ? references : references.filter(r => r.category === filter)

  return (
    <div className="art-reference-container">
      <div className="reference-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎨 Art Reference Board</h1>
      </div>

      <div className="add-reference-section">
        <input
          type="text"
          placeholder="Reference title"
          value={newRef.title}
          onChange={(e) => setNewRef({ ...newRef, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL or emoji"
          value={newRef.url}
          onChange={(e) => setNewRef({ ...newRef, url: e.target.value })}
        />
        <select value={newRef.category} onChange={(e) => setNewRef({ ...newRef, category: e.target.value })}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={addReference}>+ Add</button>
      </div>

      <div className="category-filter">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        {categories.map(cat => (
          <button
            key={cat}
            className={filter === cat ? 'active' : ''}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="references-grid">
        {filteredRefs.map(ref => (
          <div key={ref.id} className="reference-card">
            <div className="reference-image">{ref.url}</div>
            <div className="reference-info">
              <h3>{ref.title}</h3>
              <span className="category-tag">{ref.category}</span>
            </div>
            <button className="delete-btn" onClick={() => deleteRef(ref.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArtReferenceBoard
