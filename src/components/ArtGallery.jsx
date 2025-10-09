import React, { useState } from 'react'

const ArtGallery = () => {
  const [selectedArt, setSelectedArt] = useState(null)
  
  const artPieces = [
    { id: 1, title: 'Digital Sunset', type: 'Digital Art', color: '#ff6b6b', description: 'A vibrant digital interpretation of sunset' },
    { id: 2, title: 'Geometric Dreams', type: 'Abstract', color: '#4ecdc4', description: 'Exploring geometric patterns and forms' },
    { id: 3, title: 'Code Poetry', type: 'Typography', color: '#45b7d1', description: 'When code becomes art' },
    { id: 4, title: 'Nature\'s Algorithm', type: 'Generative', color: '#96ceb4', description: 'AI-generated natural patterns' }
  ]
  
  return (
    <div className="art-gallery" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎨 Art Gallery</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Showcase of creative visual expressions</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        {artPieces.map(art => (
          <div 
            key={art.id} 
            style={{ 
              background: 'var(--surface-color)', 
              borderRadius: '1rem', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onClick={() => setSelectedArt(art)}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div 
              style={{ 
                height: '200px', 
                background: `linear-gradient(135deg, ${art.color}, ${art.color}80)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'white'
              }}
            >
              🎨
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{art.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{art.type}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{art.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedArt && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedArt(null)}
        >
          <div 
            style={{ 
              background: 'var(--surface-color)', 
              padding: '2rem', 
              borderRadius: '1rem', 
              maxWidth: '500px',
              margin: '2rem'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2>{selectedArt.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedArt.type}</p>
            <div 
              style={{ 
                height: '300px', 
                background: `linear-gradient(135deg, ${selectedArt.color}, ${selectedArt.color}80)`,
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}
            ></div>
            <p>{selectedArt.description}</p>
            <button 
              onClick={() => setSelectedArt(null)}
              style={{ 
                marginTop: '1rem', 
                background: 'var(--primary-color)', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem', 
                cursor: 'pointer' 
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtGallery