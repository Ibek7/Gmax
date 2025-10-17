import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/HabitTracker.css'

function HabitTracker() {
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', icon: '⭐', color: '#667eea' })

  const iconOptions = ['⭐', '📚', '🎨', '💪', '🧘', '✍️', '🎵', '💻', '🏃', '💧', '🌱', '🎯']
  const colorOptions = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea']

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = () => {
    const saved = JSON.parse(localStorage.getItem('habits') || '[]')
    setHabits(saved)
  }

  const addHabit = () => {
    if (!newHabit.name.trim()) return

    const habit = {
      id: Date.now(),
      name: newHabit.name,
      icon: newHabit.icon,
      color: newHabit.color,
      createdAt: new Date().toISOString(),
      completions: {}
    }

    const updated = [...habits, habit]
    setHabits(updated)
    localStorage.setItem('habits', JSON.stringify(updated))
    setNewHabit({ name: '', icon: '⭐', color: '#667eea' })
    setShowAddHabit(false)
  }

  const toggleHabit = (habitId, date) => {
    const updated = habits.map(habit => {
      if (habit.id === habitId) {
        const completions = { ...habit.completions }
        if (completions[date]) {
          delete completions[date]
        } else {
          completions[date] = true
        }
        return { ...habit, completions }
      }
      return habit
    })
    setHabits(updated)
    localStorage.setItem('habits', JSON.stringify(updated))
  }

  const deleteHabit = (habitId) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    const updated = habits.filter(h => h.id !== habitId)
    setHabits(updated)
    localStorage.setItem('habits', JSON.stringify(updated))
  }

  const getDateString = (daysAgo = 0) => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().split('T')[0]
  }

  const getLast7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        label: i === 6 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })
      }
    })
  }

  const getStreak = (habit) => {
    let streak = 0
    let currentDate = new Date()
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      if (habit.completions[dateStr]) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const getTotalCompletions = (habit) => {
    return Object.keys(habit.completions).length
  }

  const days = getLast7Days()

  return (
    <div className="habit-tracker-container">
      <div className="habit-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🌱 Habit Tracker</h1>
        <button className="add-habit-btn" onClick={() => setShowAddHabit(true)}>
          + New Habit
        </button>
      </div>

      {showAddHabit && (
        <div className="add-habit-modal">
          <div className="modal-content">
            <h2>Create New Habit</h2>
            
            <div className="form-group">
              <label>Habit Name</label>
              <input
                type="text"
                placeholder="e.g., Morning meditation"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Choose Icon</label>
              <div className="icon-selector">
                {iconOptions.map(icon => (
                  <button
                    key={icon}
                    className={`icon-option ${newHabit.icon === icon ? 'selected' : ''}`}
                    onClick={() => setNewHabit({ ...newHabit, icon })}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Choose Color</label>
              <div className="color-selector">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    className={`color-option ${newHabit.color === color ? 'selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => setNewHabit({ ...newHabit, color })}
                  />
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddHabit(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={addHabit}>
                Create Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌟</div>
          <h2>No habits yet</h2>
          <p>Start building positive routines by creating your first habit!</p>
          <button className="create-first-btn" onClick={() => setShowAddHabit(true)}>
            Create Your First Habit
          </button>
        </div>
      ) : (
        <>
          <div className="habits-grid">
            {habits.map(habit => (
              <div key={habit.id} className="habit-card" style={{ borderColor: habit.color }}>
                <div className="habit-card-header">
                  <div className="habit-info">
                    <span className="habit-icon" style={{ background: habit.color }}>
                      {habit.icon}
                    </span>
                    <h3>{habit.name}</h3>
                  </div>
                  <button className="delete-habit-btn" onClick={() => deleteHabit(habit.id)}>
                    🗑️
                  </button>
                </div>

                <div className="habit-stats">
                  <div className="stat">
                    <div className="stat-value">{getStreak(habit)}</div>
                    <div className="stat-label">🔥 Day Streak</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{getTotalCompletions(habit)}</div>
                    <div className="stat-label">✅ Total</div>
                  </div>
                </div>

                <div className="habit-calendar">
                  {days.map(day => (
                    <button
                      key={day.date}
                      className={`day-cell ${habit.completions[day.date] ? 'completed' : ''}`}
                      onClick={() => toggleHabit(habit.id, day.date)}
                      style={habit.completions[day.date] ? { background: habit.color } : {}}
                    >
                      <div className="day-label">{day.label}</div>
                      <div className="day-check">{habit.completions[day.date] ? '✓' : ''}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="tips-section">
            <h3>💡 Building Better Habits</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <h4>Start Small</h4>
                <p>Begin with easy, achievable habits to build momentum</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">⏰</div>
                <h4>Be Consistent</h4>
                <p>Track daily to maintain your streak and see progress</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🎉</div>
                <h4>Celebrate Wins</h4>
                <p>Acknowledge every milestone, no matter how small</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default HabitTracker
