import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ThemePresets.css'

const STORAGE_KEY = 'gmax_theme_presets'

const DEFAULT_PRESETS = [
  { id: 'default', name: 'Default', colors: { primary: '#667eea', secondary: '#764ba2', background: '#ffffff', text: '#333333' } },
  { id: 'ocean', name: 'Ocean Blue', colors: { primary: '#00b4db', secondary: '#0083b0', background: '#f0f9ff', text: '#1e3a8a' } },
  { id: 'sunset', name: 'Sunset', colors: { primary: '#ff6b6b', secondary: '#feca57', background: '#fff5f5', text: '#7c2d12' } },
  { id: 'forest', name: 'Forest', colors: { primary: '#38b000', secondary: '#2d8659', background: '#f0fdf4', text: '#14532d' } },
  { id: 'midnight', name: 'Midnight', colors: { primary: '#6366f1', secondary: '#8b5cf6', background: '#1e1b4b', text: '#e0e7ff' } }
]

export default function ThemePresets() {
  const navigate = useNavigate()
  const [presets, setPresets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_PRESETS
    } catch (e) {
      return DEFAULT_PRESETS
    }
  })
  const [activePreset, setActivePreset] = useState('default')
  const [editingPreset, setEditingPreset] = useState(null)
  const [newPresetName, setNewPresetName] = useState('')
  const [newColors, setNewColors] = useState({ primary: '#667eea', secondary: '#764ba2', background: '#ffffff', text: '#333333' })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
    } catch (e) {}
  }, [presets])

  const applyPreset = (preset) => {
    setActivePreset(preset.id)
    // Apply CSS variables to document root
    const root = document.documentElement
    Object.entries(preset.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
  }

  const saveNewPreset = () => {
    if (!newPresetName.trim()) return
    const newPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      colors: { ...newColors }
    }
    setPresets([...presets, newPreset])
    setNewPresetName('')
    setNewColors({ primary: '#667eea', secondary: '#764ba2', background: '#ffffff', text: '#333333' })
  }

  const deletePreset = (id) => {
    if (DEFAULT_PRESETS.find(p => p.id === id)) {
      alert('Cannot delete default presets')
      return
    }
    setPresets(presets.filter(p => p.id !== id))
  }

  const updatePreset = (id, updates) => {
    setPresets(presets.map(p => p.id === id ? { ...p, ...updates } : p))
    setEditingPreset(null)
  }

  return (
    <div className="theme-presets-container">
      <div className="theme-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎨 Theme Presets</h1>
      </div>

      <div className="theme-card">
        <div className="presets-grid">
          {presets.map(preset => (
            <div 
              key={preset.id} 
              className={`preset-item ${activePreset === preset.id ? 'active' : ''}`}
              onClick={() => applyPreset(preset)}
            >
              <div className="preset-colors">
                <div className="color-dot" style={{ background: preset.colors.primary }} />
                <div className="color-dot" style={{ background: preset.colors.secondary }} />
                <div className="color-dot" style={{ background: preset.colors.background }} />
                <div className="color-dot" style={{ background: preset.colors.text }} />
              </div>
              <div className="preset-name">{preset.name}</div>
              <div className="preset-actions">
                {!DEFAULT_PRESETS.find(p => p.id === preset.id) && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setEditingPreset(preset) }} className="edit-btn">✏️</button>
                    <button onClick={(e) => { e.stopPropagation(); deletePreset(preset.id) }} className="delete-btn">🗑️</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="new-preset-section">
          <h3>Create New Preset</h3>
          <input 
            type="text" 
            placeholder="Preset name" 
            value={newPresetName} 
            onChange={(e) => setNewPresetName(e.target.value)}
            className="preset-name-input"
          />
          <div className="color-pickers">
            <div className="color-input-group">
              <label>Primary</label>
              <input type="color" value={newColors.primary} onChange={(e) => setNewColors({...newColors, primary: e.target.value})} />
            </div>
            <div className="color-input-group">
              <label>Secondary</label>
              <input type="color" value={newColors.secondary} onChange={(e) => setNewColors({...newColors, secondary: e.target.value})} />
            </div>
            <div className="color-input-group">
              <label>Background</label>
              <input type="color" value={newColors.background} onChange={(e) => setNewColors({...newColors, background: e.target.value})} />
            </div>
            <div className="color-input-group">
              <label>Text</label>
              <input type="color" value={newColors.text} onChange={(e) => setNewColors({...newColors, text: e.target.value})} />
            </div>
          </div>
          <button onClick={saveNewPreset} className="save-preset-btn">💾 Save Preset</button>
        </div>

        {editingPreset && (
          <div className="edit-modal">
            <div className="edit-modal-content">
              <h3>Edit {editingPreset.name}</h3>
              <input 
                type="text" 
                value={editingPreset.name} 
                onChange={(e) => setEditingPreset({...editingPreset, name: e.target.value})}
                className="preset-name-input"
              />
              <div className="color-pickers">
                {Object.keys(editingPreset.colors).map(key => (
                  <div key={key} className="color-input-group">
                    <label>{key}</label>
                    <input 
                      type="color" 
                      value={editingPreset.colors[key]} 
                      onChange={(e) => setEditingPreset({
                        ...editingPreset, 
                        colors: {...editingPreset.colors, [key]: e.target.value}
                      })} 
                    />
                  </div>
                ))}
              </div>
              <div className="edit-actions">
                <button onClick={() => updatePreset(editingPreset.id, editingPreset)} className="save-btn">Save</button>
                <button onClick={() => setEditingPreset(null)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
