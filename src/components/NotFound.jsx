import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          Oops! The creative page you're looking for seems to have wandered off into the digital void.
        </p>
        <div className="error-illustration">
          <span className="illustration-emoji">🎨</span>
          <span className="illustration-emoji">🎮</span>
          <span className="illustration-emoji">✍️</span>
          <span className="illustration-emoji">🎵</span>
        </div>
        <div className="error-actions">
          <Link to="/" className="home-btn">
            🏠 Back to Home
          </Link>
          <Link to="/games" className="games-btn">
            🎮 Explore Games
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound