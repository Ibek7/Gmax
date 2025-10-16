import React, { useState, useEffect } from 'react'
import '../styles/NotificationsCenter.css'

const NOTIFICATIONS_KEY = 'gmaxNotifications'

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const sampleNotifications = [
    {
      id: 1,
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You\'ve completed your first creative challenge',
      icon: '🏆',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Time to Create',
      message: 'Your daily creative session is ready to start',
      icon: '⏰',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 3,
      type: 'challenge',
      title: 'New Weekly Challenge',
      message: 'Music Mashup challenge is now available!',
      icon: '🎵',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true
    }
  ]

  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } else {
      setNotifications(sampleNotifications)
      setUnreadCount(sampleNotifications.filter(n => !n.read).length)
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(sampleNotifications))
    }
  }, [])

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadCount(updated.filter(n => !n.read).length)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    setUnreadCount(0)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
  }

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    setUnreadCount(updated.filter(n => !n.read).length)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getTypeColor = (type) => {
    const colors = {
      achievement: '#10b981',
      reminder: '#f59e0b',
      challenge: '#8b5cf6',
      system: '#6366f1'
    }
    return colors[type] || colors.system
  }

  return (
    <>
      <button 
        className="notifications-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <div className="empty-icon">🔕</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div 
                    className="notification-icon"
                    style={{ background: getTypeColor(notification.type) }}
                  >
                    {notification.icon}
                  </div>
                  
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>

                  <button
                    className="delete-notification-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="notifications-footer">
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="notifications-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default NotificationsCenter
