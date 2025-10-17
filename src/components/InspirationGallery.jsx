import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/InspirationGallery.css'

function InspirationGallery() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const items = [
    { id: 1, title: 'Creative Mindset', category: 'art', image: '🎨', quote: 'Creativity is intelligence having fun' },
    { id: 2, title: 'Write Daily', category: 'writing', image: '✍️', quote: 'Write what should not be forgotten' },
    { id: 3, title: 'Music Flow', category: 'music', image: '🎵', quote: 'Music is the shorthand of emotion' },
    { id: 4, title: 'Code Zen', category: 'code', image: '💻', quote: 'Code is poetry in logic' },
    { id: 5, title: 'Game Innovation', category: 'games', image: '🎮', quote: 'Games are art in motion' },
    { id: 6, title: 'Visual Storytelling', category: 'art', image: '🖼️', quote: 'Every picture tells a story' }
  ]
  
  const filtered = selectedCategory === 'all' ? items : items.filter(i => i.category === selectedCategory)
  
  return (
    <div className="inspiration-gallery-container">
      <div className="gallery-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>✨ Inspiration Gallery</h1>
        <div style={{width: '100px'}}></div>
      </div>
      
      <div className="category-tabs">
        {['all', 'art', 'writing', 'music', 'code', 'games'].map(cat => (
          <button key={cat} className={selectedCategory === cat ? 'active' : ''} onClick={() => setSelectedCategory(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="gallery-grid">
        {filtered.map(item => (
          <div key={item.id} className="gallery-card">
            <div className="card-image">{item.image}</div>
            <h3>{item.title}</h3>
            <p>{item.quote}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InspirationGallery
