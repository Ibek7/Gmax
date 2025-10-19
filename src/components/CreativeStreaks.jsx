import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeStreaks.css'

const CreativeStreaks = () => {
  const navigate = useNavigate()
  const [streaks, setStreaks] = useState({ writing: 0, coding: 0, art: 0, music: 0 })
  const [calendar, setCalendar] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadStreaks()
  }, [])

  const loadStreaks = () => {
    const saved = localStorage.getItem('gmax_streaks')
    if (saved) {
      const data = JSON.parse(saved)
      setStreaks(data.streaks || streaks)
      setCalendar(data.calendar || {})
    }
  }

  const markToday = (activity) => {
    const today = new Date().toISOString().split('T')[0]
    const newCalendar = { ...calendar, [today]: [...(calendar[today] || []), activity] }
    const newStreaks = { ...streaks, [activity]: streaks[activity] + 1 }
    setCalendar(newCalendar)
    setStreaks(newStreaks)
    localStorage.setItem('gmax_streaks', JSON.stringify({ streaks: newStreaks, calendar: newCalendar }))
  }

  return (
    <div className="creative-streaks-container">
      <div className="streaks-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔥 Creative Streaks</h1>
      </div>

      <div className="streaks-grid">
        {Object.entries(streaks).map(([activity, count]) => (
          <div key={activity} className="streak-card">
            <h3>{activity}</h3>
            <div className="streak-count">{count} days</div>
            <button onClick={() => markToday(activity)}>✅ Mark Today</button>
          </div>
        ))}
      </div>

      <div className="calendar-view">
        <h2>Activity Calendar</h2>
        <div className="calendar-grid">
          {Object.keys(calendar).map(date => (
            <div key={date} className="calendar-day">
              <span>{date}</span>
              <div className="activities">
                {calendar[date].map((act, i) => (
                  <span key={i} className="activity-badge">{act}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreativeStreaks
