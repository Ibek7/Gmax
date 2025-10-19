import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeCalendar.css'

function CreativeCalendar() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'writing',
    type: 'deadline'
  })

  const categories = {
    writing: { color: '#667eea', icon: '✍️' },
    art: { color: '#f093fb', icon: '🎨' },
    music: { color: '#4facfe', icon: '🎵' },
    code: { color: '#43e97b', icon: '💻' },
    games: { color: '#fa709a', icon: '🎮' }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    const saved = JSON.parse(localStorage.getItem('calendarEvents') || '[]')
    setEvents(saved)
  }

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return alert('Please fill all fields!')
    
    const event = {
      id: Date.now(),
      ...newEvent,
      createdAt: new Date().toISOString()
    }
    
    const updated = [...events, event]
    setEvents(updated)
    localStorage.setItem('calendarEvents', JSON.stringify(updated))
    setNewEvent({ title: '', date: '', category: 'writing', type: 'deadline' })
    setShowAddEvent(false)
  }

  const deleteEvent = (id) => {
    const updated = events.filter(e => e.id !== id)
    setEvents(updated)
    localStorage.setItem('calendarEvents', JSON.stringify(updated))
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getEventsForDay = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0]
    return events.filter(e => e.date === dateStr)
  }

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="creative-calendar-container">
      <div className="calendar-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>📅 Creative Calendar</h1>
        <button className="add-event-btn" onClick={() => setShowAddEvent(true)}>
          + Add Event
        </button>
      </div>

      {showAddEvent && (
        <div className="event-modal">
          <div className="modal-content">
            <h2>Add New Event</h2>
            
            <div className="form-group">
              <label>Event Title</label>
              <input
                type="text"
                placeholder="e.g., Finish Chapter 3"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
              >
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>
                    {categories[cat].icon} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              >
                <option value="deadline">⏰ Deadline</option>
                <option value="milestone">🎯 Milestone</option>
                <option value="event">📌 Event</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddEvent(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={addEvent}>
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="calendar-navigation">
        <button onClick={() => changeMonth(-1)}>← Previous</button>
        <h2>{monthNames[month]} {year}</h2>
        <button onClick={() => changeMonth(1)}>Next →</button>
      </div>

      <div className="calendar-grid">
        <div className="day-names">
          {dayNames.map(day => (
            <div key={day} className="day-name">{day}</div>
          ))}
        </div>
        
        <div className="days-grid">
          {[...Array(startingDayOfWeek)].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            const isToday = new Date().toDateString() === 
              new Date(year, month, day).toDateString()
            
            return (
              <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <div className="day-number">{day}</div>
                <div className="day-events">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="day-event"
                      style={{ background: categories[event.category].color }}
                      title={event.title}
                    >
                      <span>{categories[event.category].icon}</span>
                      <span className="event-title">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="more-events">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="upcoming-events">
        <h3>📋 Upcoming Events</h3>
        <div className="events-list">
          {events
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="event-item">
                <div className="event-icon" style={{ background: categories[event.category].color }}>
                  {categories[event.category].icon}
                </div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'short', month: 'short', day: 'numeric' 
                  })}</p>
                </div>
                <button className="delete-event-btn" onClick={() => deleteEvent(event.id)}>
                  🗑️
                </button>
              </div>
            ))}
          {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
            <p className="no-events">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreativeCalendar
