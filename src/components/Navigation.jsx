import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Navigation.css'

const Navigation = ({ currentTheme, setCurrentTheme }) => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/games', label: 'Games', icon: '🎮' },
    { path: '/writing', label: 'Writing', icon: '✍️' },
    { path: '/art', label: 'Art', icon: '🎨' },
    { path: '/music', label: 'Music', icon: '🎵' },
    { path: '/code', label: 'Code', icon: '💻' },
    { path: '/achievements', label: 'Achievements', icon: '🏆' }
  ]
  
  const themes = [
    { value: 'default', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'neon', label: 'Neon', icon: '⚡' },
    { value: 'sunset', label: 'Sunset', icon: '🌅' },
    { value: 'ocean', label: 'Ocean', icon: '🌊' }
  ]
  
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">✨</span>
            <span className="brand-text">Gmax Studio</span>
          </Link>
        </div>
        
        <div className="nav-items">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="theme-selector">
          {themes.map(theme => (
            <button
              key={theme.value}
              onClick={() => setCurrentTheme(theme.value)}
              className={`theme-btn ${currentTheme === theme.value ? 'active' : ''}`}
              title={`Switch to ${theme.label} theme`}
            >
              {theme.icon}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation