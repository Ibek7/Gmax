import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/QuickActionsMenu.css'

const QuickActionsMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const quickActions = [
    { icon: '🎮', label: 'Games', path: '/games', color: '#6366f1' },
    { icon: '✍️', label: 'Write', path: '/writing', color: '#ec4899' },
    { icon: '🏆', label: 'Achievements', path: '/achievement-system', color: '#f59e0b' },
    { icon: '📊', label: 'Analytics', path: '/analytics', color: '#10b981' },
    { icon: '⏱️', label: 'Timer', action: 'timer', color: '#8b5cf6' },
    { icon: '🎨', label: 'Art', path: '/art', color: '#ef4444' },
  ]

  const handleAction = (action) => {
    if (action.path) {
      navigate(action.path)
    } else if (action.action === 'timer') {
      // Scroll to timer or trigger timer action
      window.scrollTo({ top: 0, behavior: 'smooth' })
      navigate('/')
    }
    setIsOpen(false)
  }

  return (
    <>
      <button 
        className={`quick-actions-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Actions"
      >
        {isOpen ? '✕' : '⚡'}
      </button>

      {isOpen && (
        <div className="quick-actions-overlay" onClick={() => setIsOpen(false)}>
          <div className="quick-actions-menu" onClick={(e) => e.stopPropagation()}>
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="action-button"
                  style={{ '--action-color': action.color }}
                  onClick={() => handleAction(action)}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QuickActionsMenu
