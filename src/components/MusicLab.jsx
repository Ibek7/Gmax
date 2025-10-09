import React, { useState } from 'react'

const MusicLab = () => {
  const [currentInstrument, setCurrentInstrument] = useState('piano')
  const [isPlaying, setIsPlaying] = useState(false)
  
  const instruments = [
    { id: 'piano', name: 'Piano', icon: '🎹', color: '#4ecdc4' },
    { id: 'drums', name: 'Drums', icon: '🥁', color: '#ff6b6b' },
    { id: 'guitar', name: 'Guitar', icon: '🎸', color: '#ffa726' },
    { id: 'synth', name: 'Synthesizer', icon: '🎛️', color: '#ab47bc' }
  ]
  
  const soundEffects = [
    'Reverb', 'Echo', 'Distortion', 'Chorus', 'Flanger', 'Delay'
  ]
  
  return (
    <div className="music-lab" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎵 Music Lab</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Experiment with sounds and create music</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {instruments.map(instrument => (
          <button
            key={instrument.id}
            onClick={() => setCurrentInstrument(instrument.id)}
            style={{
              background: currentInstrument === instrument.id ? instrument.color : 'var(--surface-color)',
              color: currentInstrument === instrument.id ? 'white' : 'var(--text-primary)',
              border: `2px solid ${instrument.color}`,
              padding: '1rem',
              borderRadius: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>{instrument.icon}</span>
            <span style={{ fontWeight: '600' }}>{instrument.name}</span>
          </button>
        ))}
      </div>
      
      <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Virtual {instruments.find(i => i.id === currentInstrument)?.name}</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(8, 1fr)', 
          gap: '0.5rem', 
          marginBottom: '2rem' 
        }}>
          {Array.from({ length: 8 }, (_, i) => (
            <button
              key={i}
              style={{
                height: '80px',
                background: `linear-gradient(135deg, ${instruments.find(i => i.id === currentInstrument)?.color}, ${instruments.find(i => i.id === currentInstrument)?.color}80)`,
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
                fontSize: '0.8rem'
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'][i]}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? 'var(--error-color)' : 'var(--success-color)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {isPlaying ? '⏹️ Stop' : '▶️ Play'}
          </button>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isPlaying ? 'Recording...' : 'Ready to record'}
          </span>
        </div>
      </div>
      
      <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Sound Effects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
          {soundEffects.map(effect => (
            <button
              key={effect}
              style={{
                background: 'var(--background-color)',
                border: '1px solid var(--border-color)',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--background-color)'}
            >
              {effect}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MusicLab