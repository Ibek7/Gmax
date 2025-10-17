import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ResourceLibrary.css'

function ResourceLibrary() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  
  const resources = [
    { id: 1, title: 'Creative Writing Guide', category: 'writing', type: 'Tutorial', link: '#' },
    { id: 2, title: 'Digital Art Basics', category: 'art', type: 'Course', link: '#' },
    { id: 3, title: 'Music Theory 101', category: 'music', type: 'Tutorial', link: '#' },
    { id: 4, title: 'JavaScript Mastery', category: 'code', type: 'Course', link: '#' },
    { id: 5, title: 'Game Design Patterns', category: 'games', type: 'eBook', link: '#' },
    { id: 6, title: 'Photography Tips', category: 'art', type: 'Tutorial', link: '#' }
  ]
  
  const filtered = category === 'all' ? resources : resources.filter(r => r.category === category)
  
  return (
    <div className="resource-library-container">
      <div className="library-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>📚 Resource Library</h1>
        <div style={{width: '100px'}}></div>
      </div>
      
      <div className="filter-tabs">
        {['all', 'writing', 'art', 'music', 'code', 'games'].map(cat => (
          <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="resources-list">
        {filtered.map(resource => (
          <div key={resource.id} className="resource-item">
            <div className="resource-icon">📄</div>
            <div className="resource-content">
              <h3>{resource.title}</h3>
              <span className="resource-type">{resource.type}</span>
            </div>
            <button className="access-btn">Access →</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResourceLibrary
