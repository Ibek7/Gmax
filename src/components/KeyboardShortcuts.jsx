import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/KeyboardShortcuts.css'

const STORAGE_KEY = 'gmax_keyboard_shortcuts'

const DEFAULT_SHORTCUTS = [
  { id: 'dashboard', key: 'h', label: 'Go to Dashboard', icon: '🏠', customizable: false },
  { id: 'search', key: '/', label: 'Focus Search', icon: '🔍', customizable: true },
  { id: 'ambient', key: 'a', label: 'Ambient Noise', icon: '�️', customizable: true },
  { id: 'markdown', key: 'm', label: 'Markdown Editor', icon: '📝', customizable: true },
  { id: 'theme', key: 't', label: 'Theme Presets', icon: '�', customizable: true },
  { id: 'help', key: '?', label: 'Show Help', icon: '❓', customizable: false }
]

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false)
  const navigate = useNavigate()
  const [shortcuts, setShortcuts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS
    } catch (e) {
      return DEFAULT_SHORTCUTS
    }
  })
  const [editingShortcut, setEditingShortcut] = useState(null)
  const [capturing, setCapturing] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts))
    } catch (e) {}
  }, [shortcuts])

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }

      // Capture new shortcut key if in edit mode
      if (capturing && editingShortcut) {
        e.preventDefault()
        const newKey = e.key
        setShortcuts(shortcuts.map(s => 
          s.id === editingShortcut.id ? { ...s, key: newKey } : s
        ))
        setCapturing(false)
        setEditingShortcut(null)
        return
      }

      // Handle shortcuts
      const shortcut = shortcuts.find(s => s.key === e.key.toLowerCase())
      if (shortcut && !showHelp) {
        e.preventDefault()
        executeShortcut(shortcut.id)
      }

      // Toggle help with ?
      if (e.key === '?') {
        e.preventDefault()
        setShowHelp(!showHelp)
      }

      // Close help with Escape
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false)
        setEditingShortcut(null)
        setCapturing(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [shortcuts, showHelp, capturing, editingShortcut])

  const executeShortcut = (id) => {
    switch (id) {
      case 'dashboard':
        navigate('/')
        break
      case 'search':
        const searchInput = document.querySelector('input[type="search"]')
        if (searchInput) searchInput.focus()
        break
      case 'ambient':
        navigate('/ambient-noise')
        break
      case 'markdown':
        navigate('/markdown-editor')
        break
      case 'theme':
        navigate('/theme-presets')
        break
      default:
        break
    }
  }

  const startCapture = (shortcut) => {
    if (!shortcut.customizable) return
    setEditingShortcut(shortcut)
    setCapturing(true)
  }

  const resetShortcuts = () => {
    setShortcuts(DEFAULT_SHORTCUTS)
    setEditingShortcut(null)
    setCapturing(false)
  }

  return (
    <>
      <button 
        className="shortcuts-help-btn"
        onClick={() => setShowHelp(true)}
        title="Keyboard Shortcuts (Press ?)"
      >
        ⌨️
      </button>

      {showHelp && (
        <div className="shortcuts-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowHelp(false)}>
              ✕
            </button>
            <h2>⌨️ Keyboard Shortcuts</h2>
            <p className="shortcuts-subtitle">Speed up your workflow with these shortcuts</p>
            
            <div className="shortcuts-list">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.id} className="shortcut-item">
                  <span className="shortcut-icon">{shortcut.icon}</span>
                  <span className="shortcut-label">{shortcut.label}</span>
                  <div className="shortcut-key-container">
                    <kbd className={capturing && editingShortcut?.id === shortcut.id ? 'capturing' : ''}>
                      {capturing && editingShortcut?.id === shortcut.id ? 'Press any key...' : shortcut.key}
                    </kbd>
                    {shortcut.customizable && (
                      <button 
                        className="edit-shortcut-btn"
                        onClick={() => startCapture(shortcut)}
                        disabled={capturing}
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="shortcuts-footer">
              <button onClick={resetShortcuts} className="reset-btn">
                Reset to Defaults
              </button>
              <p>💡 Tip: Press <kbd>?</kbd> anytime to see this help</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default KeyboardShortcuts
