import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MeetingScheduler.css'

const MeetingScheduler = () => {
  const navigate = useNavigate()
  const [meetings, setMeetings] = useState([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(30)
  const [link, setLink] = useState('')
  const [viewMode, setViewMode] = useState('upcoming')

  useEffect(() => {
    const saved = localStorage.getItem('gmax_meetings')
    if (saved) {
      setMeetings(JSON.parse(saved))
    }
  }, [])

  const scheduleMeeting = (e) => {
    e.preventDefault()
    if (title.trim() && date && time) {
      const meeting = {
        id: Date.now(),
        title,
        date,
        time,
        duration: parseInt(duration),
        link: link || `https://meet.example.com/${Date.now()}`,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }
      const updated = [...meetings, meeting]
      setMeetings(updated)
      localStorage.setItem('gmax_meetings', JSON.stringify(updated))
      setTitle('')
      setDate('')
      setTime('')
      setDuration(30)
      setLink('')
    }
  }

  const updateStatus = (id, status) => {
    const updated = meetings.map(m =>
      m.id === id ? { ...m, status } : m
    )
    setMeetings(updated)
    localStorage.setItem('gmax_meetings', JSON.stringify(updated))
  }

  const deleteMeeting = (id) => {
    const updated = meetings.filter(m => m.id !== id)
    setMeetings(updated)
    localStorage.setItem('gmax_meetings', JSON.stringify(updated))
  }

  const isPastMeeting = (meeting) => {
    const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`)
    return meetingDateTime < new Date()
  }

  const filteredMeetings = meetings.filter(m => {
    if (viewMode === 'upcoming') return !isPastMeeting(m)
    if (viewMode === 'past') return isPastMeeting(m)
    if (viewMode === 'completed') return m.status === 'completed'
    return true
  }).sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA - dateB
  })

  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#2196f3',
      completed: '#4caf50',
      cancelled: '#f44336'
    }
    return colors[status] || '#666'
  }

  const todayMeetings = meetings.filter(m => {
    const today = new Date().toISOString().split('T')[0]
    return m.date === today && !isPastMeeting(m)
  })

  return (
    <div className="meeting-scheduler-container">
      <div className="scheduler-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📅 Meeting Scheduler</h1>
      </div>

      <div className="scheduler-stats">
        <div className="stat-box">
          <div className="stat-number">{meetings.length}</div>
          <div className="stat-text">Total Meetings</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{todayMeetings.length}</div>
          <div className="stat-text">Today</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{meetings.filter(m => !isPastMeeting(m)).length}</div>
          <div className="stat-text">Upcoming</div>
        </div>
      </div>

      <div className="schedule-form">
        <h2>Schedule New Meeting</h2>
        <form onSubmit={scheduleMeeting}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Meeting title..."
            required
          />
          <div className="form-grid">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
            <select value={duration} onChange={e => setDuration(e.target.value)}>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
          <input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="Meeting link (optional)"
          />
          <button type="submit">Schedule Meeting</button>
        </form>
      </div>

      <div className="view-modes">
        {['all', 'upcoming', 'past', 'completed'].map(mode => (
          <button
            key={mode}
            className={`mode-btn ${viewMode === mode ? 'active' : ''}`}
            onClick={() => setViewMode(mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div className="meetings-list">
        {filteredMeetings.map(meeting => (
          <div key={meeting.id} className="meeting-card">
            <div className="meeting-main">
              <div className="meeting-info">
                <h3>{meeting.title}</h3>
                <div className="meeting-details">
                  <span className="detail-item">📅 {new Date(meeting.date).toLocaleDateString()}</span>
                  <span className="detail-item">🕐 {meeting.time}</span>
                  <span className="detail-item">⏱️ {meeting.duration} min</span>
                </div>
                <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="meeting-link">
                  🔗 Join Meeting
                </a>
              </div>
              <div className="meeting-actions">
                <span
                  className="status-badge"
                  style={{ background: getStatusColor(meeting.status) }}
                >
                  {meeting.status}
                </span>
                <div className="action-buttons">
                  {meeting.status !== 'completed' && (
                    <button
                      className="complete-btn"
                      onClick={() => updateStatus(meeting.id, 'completed')}
                    >
                      ✓
                    </button>
                  )}
                  {meeting.status !== 'cancelled' && meeting.status !== 'completed' && (
                    <button
                      className="cancel-btn"
                      onClick={() => updateStatus(meeting.id, 'cancelled')}
                    >
                      ✕
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => deleteMeeting(meeting.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="empty-state">
          <p>No meetings found</p>
        </div>
      )}
    </div>
  )
}

export default MeetingScheduler
