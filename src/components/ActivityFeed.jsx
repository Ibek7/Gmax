import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ActivityFeed.css'

const ActivityFeed = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = () => {
    // Generate sample activities from various localStorage data
    const sampleActivities = [
      { id: 1, type: 'goal', icon: '🎯', title: 'Completed daily goal', description: 'Finished "Write 1000 words"', timestamp: Date.now() - 3600000, category: 'writing' },
      { id: 2, type: 'habit', icon: '🔥', title: 'Habit streak extended', description: '7-day streak for Morning Meditation', timestamp: Date.now() - 7200000, category: 'general' },
      { id: 3, type: 'project', icon: '📁', title: 'Project milestone reached', description: 'Completed Phase 1 of Portfolio Website', timestamp: Date.now() - 10800000, category: 'code' },
      { id: 4, type: 'skill', icon: '⭐', title: 'Skill level up', description: 'React Development reached Level 5', timestamp: Date.now() - 14400000, category: 'code' },
      { id: 5, type: 'note', icon: '📝', title: 'Created new note', description: 'UI Design Inspiration', timestamp: Date.now() - 18000000, category: 'art' },
      { id: 6, type: 'focus', icon: '⏱️', title: 'Focus session completed', description: '45 minutes of deep work', timestamp: Date.now() - 21600000, category: 'general' },
      { id: 7, type: 'reward', icon: '🏆', title: 'Badge unlocked', description: 'Earned "Streak Master" badge', timestamp: Date.now() - 25200000, category: 'general' },
      { id: 8, type: 'bookmark', icon: '📚', title: 'Added bookmark', description: 'Saved "Advanced React Patterns" tutorial', timestamp: Date.now() - 28800000, category: 'code' }
    ]
    
    setActivities(sampleActivities)
  }

  const getRelativeTime = (timestamp) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getCategoryColor = (category) => {
    const colors = {
      writing: '#667eea',
      art: '#f093fb',
      music: '#4facfe',
      code: '#43e97b',
      games: '#fa709a',
      general: '#fee140'
    }
    return colors[category] || '#667eea'
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.category === filter)

  return (
    <div className="activity-feed-container">
      <div className="feed-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>📊 Activity Feed</h1>
      </div>

      <div className="feed-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Activities
        </button>
        <button 
          className={`filter-btn ${filter === 'writing' ? 'active' : ''}`}
          onClick={() => setFilter('writing')}
        >
          ✍️ Writing
        </button>
        <button 
          className={`filter-btn ${filter === 'art' ? 'active' : ''}`}
          onClick={() => setFilter('art')}
        >
          🎨 Art
        </button>
        <button 
          className={`filter-btn ${filter === 'code' ? 'active' : ''}`}
          onClick={() => setFilter('code')}
        >
          💻 Code
        </button>
        <button 
          className={`filter-btn ${filter === 'general' ? 'active' : ''}`}
          onClick={() => setFilter('general')}
        >
          ⚡ General
        </button>
      </div>

      <div className="activity-timeline">
        {filteredActivities.length === 0 ? (
          <div className="no-activities">
            <span className="no-activities-icon">📊</span>
            <p>No activities yet</p>
            <p className="hint">Start creating, learning, and tracking to see your activity feed!</p>
          </div>
        ) : (
          filteredActivities.map((activity, index) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-line"></div>
              <div 
                className="activity-icon"
                style={{ background: getCategoryColor(activity.category) }}
              >
                {activity.icon}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <h3>{activity.title}</h3>
                  <span className="activity-time">{getRelativeTime(activity.timestamp)}</span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <span 
                  className="activity-category"
                  style={{ background: `${getCategoryColor(activity.category)}20`, color: getCategoryColor(activity.category) }}
                >
                  {activity.category}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ActivityFeed
