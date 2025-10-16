import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/KeyboardShortcuts.css'

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false)
  const navigate = useNavigate()

  const shortcuts = [
    { key: '/', description: 'Open Quick Actions', icon: '⚡' },
    { key: 'H', description: 'Go to Home/Dashboard', icon: '🏠' },
    { key: 'G', description: 'Open Games Hub', icon: '🎮' },
    { key: 'W', description: 'Open Writing Prompts', icon: '✍️' },
    { key: 'A', description: 'View Achievements', icon: '🏆' },
    { key: 'S', description: 'Open Settings', icon: '⚙️' },
    { key: 'T', description: 'Toggle Theme', icon: '🎨' },
    { key: '?', description: 'Show Shortcuts Help', icon: '❓' },
  ]

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }

      switch (e.key.toLowerCase()) {
        case '/':
          e.preventDefault()
          // Trigger quick actions menu
          document.querySelector('.quick-actions-fab')?.click()
          break
        case 'h':
          navigate('/')
          break
        case 'g':
          navigate('/games')
          break
        case 'w':
          navigate('/writing')
          break
        case 'a':
          navigate('/achievement-system')
          break
        case 's':
          navigate('/settings')
          break
        case 't':
          // Toggle theme
          const themeSwitcher = document.querySelector('.theme-switcher')
          themeSwitcher?.click()
          break
        case '?':
          setShowHelp(!showHelp)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [navigate, showHelp])

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
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="shortcut-item">
                  <span className="shortcut-icon">{shortcut.icon}</span>
                  <span className="shortcut-description">{shortcut.description}</span>
                  <kbd className="shortcut-key">{shortcut.key}</kbd>
                </div>
              ))}
            </div>
            
            <div className="shortcuts-footer">
              <p>💡 Tip: Press <kbd>?</kbd> anytime to see this help</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default KeyboardShortcuts
