import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/WorkspaceThemes.css'

const WorkspaceThemes = () => {
  const navigate = useNavigate()
  const [currentTheme, setCurrentTheme] = useState('default')
  const [customThemes, setCustomThemes] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const presetThemes = [
    {
      id: 'default',
      name: 'Default',
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#ffffff',
      text: '#333333',
      isPreset: true
    },
    {
      id: 'ocean',
      name: 'Ocean Breeze',
      primary: '#00c6ff',
      secondary: '#0072ff',
      accent: '#4ecdc4',
      background: '#f7f9fc',
      text: '#2c3e50',
      isPreset: true
    },
    {
      id: 'sunset',
      name: 'Sunset Glow',
      primary: '#ff6b6b',
      secondary: '#ee5a6f',
      accent: '#feca57',
      background: '#fff5f5',
      text: '#4a4a4a',
      isPreset: true
    },
    {
      id: 'forest',
      name: 'Forest Green',
      primary: '#2ecc71',
      secondary: '#27ae60',
      accent: '#48c9b0',
      background: '#f0f9f4',
      text: '#2c5530',
      isPreset: true
    },
    {
      id: 'midnight',
      name: 'Midnight Dark',
      primary: '#9b59b6',
      secondary: '#8e44ad',
      accent: '#e74c3c',
      background: '#1a1a2e',
      text: '#eaeaea',
      isPreset: true
    },
    {
      id: 'royal',
      name: 'Royal Purple',
      primary: '#8e44ad',
      secondary: '#9b59b6',
      accent: '#f39c12',
      background: '#faf5ff',
      text: '#4a148c',
      isPreset: true
    }
  ]

  useEffect(() => {
    loadTheme()
    loadCustomThemes()
  }, [])

  const loadTheme = () => {
    const saved = localStorage.getItem('gmax_current_theme')
    if (saved) {
      setCurrentTheme(saved)
      applyTheme(saved)
    }
  }

  const loadCustomThemes = () => {
    const saved = localStorage.getItem('gmax_custom_themes')
    if (saved) {
      setCustomThemes(JSON.parse(saved))
    }
  }

  const applyTheme = (themeId) => {
    const allThemes = [...presetThemes, ...customThemes]
    const theme = allThemes.find(t => t.id === themeId)
    
    if (theme) {
      document.documentElement.style.setProperty('--theme-primary', theme.primary)
      document.documentElement.style.setProperty('--theme-secondary', theme.secondary)
      document.documentElement.style.setProperty('--theme-accent', theme.accent)
      document.documentElement.style.setProperty('--theme-background', theme.background)
      document.documentElement.style.setProperty('--theme-text', theme.text)
      
      setCurrentTheme(themeId)
      localStorage.setItem('gmax_current_theme', themeId)
    }
  }

  const createCustomTheme = (themeData) => {
    const newTheme = {
      ...themeData,
      id: `custom-${Date.now()}`,
      isPreset: false
    }
    const updated = [...customThemes, newTheme]
    setCustomThemes(updated)
    localStorage.setItem('gmax_custom_themes', JSON.stringify(updated))
    setShowCreateModal(false)
  }

  const deleteCustomTheme = (id) => {
    const updated = customThemes.filter(t => t.id !== id)
    setCustomThemes(updated)
    localStorage.setItem('gmax_custom_themes', JSON.stringify(updated))
    
    if (currentTheme === id) {
      applyTheme('default')
    }
  }

  const allThemes = [...presetThemes, ...customThemes]

  return (
    <div className="themes-container">
      <div className="themes-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎨 Workspace Themes</h1>
        <button className="create-theme-btn" onClick={() => setShowCreateModal(true)}>
          + Create Theme
        </button>
      </div>

      <div className="current-theme-preview">
        <h2>Current Theme: {allThemes.find(t => t.id === currentTheme)?.name || 'Default'}</h2>
        <div className="theme-colors-preview">
          <div className="color-swatch" style={{ background: allThemes.find(t => t.id === currentTheme)?.primary }}>
            <span>Primary</span>
          </div>
          <div className="color-swatch" style={{ background: allThemes.find(t => t.id === currentTheme)?.secondary }}>
            <span>Secondary</span>
          </div>
          <div className="color-swatch" style={{ background: allThemes.find(t => t.id === currentTheme)?.accent }}>
            <span>Accent</span>
          </div>
          <div className="color-swatch" style={{ background: allThemes.find(t => t.id === currentTheme)?.background, border: '2px solid #ddd' }}>
            <span style={{ color: allThemes.find(t => t.id === currentTheme)?.text }}>Background</span>
          </div>
        </div>
      </div>

      <div className="themes-section">
        <h3>Preset Themes</h3>
        <div className="themes-grid">
          {presetThemes.map(theme => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={currentTheme === theme.id}
              onApply={() => applyTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {customThemes.length > 0 && (
        <div className="themes-section">
          <h3>Custom Themes</h3>
          <div className="themes-grid">
            {customThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={currentTheme === theme.id}
                onApply={() => applyTheme(theme.id)}
                onDelete={() => deleteCustomTheme(theme.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateThemeModal
          onSave={createCustomTheme}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

const ThemeCard = ({ theme, isActive, onApply, onDelete }) => {
  return (
    <div className={`theme-card ${isActive ? 'active' : ''}`}>
      <h4>{theme.name}</h4>
      <div className="theme-preview">
        <div className="preview-bar" style={{ background: theme.primary }}></div>
        <div className="preview-bar" style={{ background: theme.secondary }}></div>
        <div className="preview-bar" style={{ background: theme.accent }}></div>
        <div className="preview-bar" style={{ background: theme.background, border: '1px solid #ddd' }}></div>
      </div>
      <div className="theme-card-actions">
        <button className="apply-btn" onClick={onApply}>
          {isActive ? '✓ Active' : 'Apply'}
        </button>
        {!theme.isPreset && onDelete && (
          <button className="delete-theme-btn" onClick={onDelete}>🗑️</button>
        )}
      </div>
    </div>
  )
}

const CreateThemeModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    background: '#ffffff',
    text: '#333333'
  })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create Custom Theme</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
          <div className="form-group">
            <label>Theme Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              placeholder="e.g., My Creative Theme"
            />
          </div>
          <div className="color-inputs">
            <div className="form-group">
              <label>Primary Color</label>
              <input
                type="color"
                value={formData.primary}
                onChange={e => setFormData({...formData, primary: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <input
                type="color"
                value={formData.secondary}
                onChange={e => setFormData({...formData, secondary: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Accent Color</label>
              <input
                type="color"
                value={formData.accent}
                onChange={e => setFormData({...formData, accent: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={formData.background}
                onChange={e => setFormData({...formData, background: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={formData.text}
                onChange={e => setFormData({...formData, text: e.target.value})}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Create Theme</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WorkspaceThemes
