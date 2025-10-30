import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FitnessPlanner.css'

const FitnessPlanner = () => {
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])
  const [workoutName, setWorkoutName] = useState('')
  const [workoutType, setWorkoutType] = useState('strength')
  const [duration, setDuration] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const workoutTypes = ['strength', 'cardio', 'flexibility', 'sports', 'yoga', 'hiit']

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('gmax_workouts')
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts))
  }, [])

  const addWorkout = (e) => {
    e.preventDefault()
    if (workoutName.trim() && duration) {
      const workout = {
        id: Date.now(),
        name: workoutName,
        type: workoutType,
        duration: parseInt(duration),
        caloriesBurned: parseInt(caloriesBurned) || 0,
        completed: false,
        date: new Date().toISOString()
      }
      const updated = [...workouts, workout]
      setWorkouts(updated)
      localStorage.setItem('gmax_workouts', JSON.stringify(updated))
      setWorkoutName('')
      setDuration('')
      setCaloriesBurned('')
      setWorkoutType('strength')
      setShowAddForm(false)
    }
  }

  const toggleComplete = (id) => {
    const updated = workouts.map(w =>
      w.id === id ? { ...w, completed: !w.completed } : w
    )
    setWorkouts(updated)
    localStorage.setItem('gmax_workouts', JSON.stringify(updated))
  }

  const deleteWorkout = (id) => {
    const updated = workouts.filter(w => w.id !== id)
    setWorkouts(updated)
    localStorage.setItem('gmax_workouts', JSON.stringify(updated))
  }

  const getTypeIcon = (type) => {
    const icons = {
      strength: '💪',
      cardio: '🏃',
      flexibility: '🧘',
      sports: '⚽',
      yoga: '🕉️',
      hiit: '⚡'
    }
    return icons[type] || '🏋️'
  }

  const totalWorkouts = workouts.length
  const completedWorkouts = workouts.filter(w => w.completed).length
  const totalCalories = workouts.filter(w => w.completed).reduce((sum, w) => sum + w.caloriesBurned, 0)
  const totalMinutes = workouts.filter(w => w.completed).reduce((sum, w) => sum + w.duration, 0)

  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date)
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return workoutDate >= weekAgo && w.completed
  })

  return (
    <div className="fitness-planner-container">
      <div className="fitness-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💪 Fitness Planner</h1>
        <button className="add-workout-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+ Add Workout'}
        </button>
      </div>

      <div className="fitness-stats">
        <div className="fitness-stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-content">
            <div className="stat-value">{totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>
        <div className="fitness-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completedWorkouts}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="fitness-stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{totalCalories}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
        </div>
        <div className="fitness-stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{totalMinutes}</div>
            <div className="stat-label">Minutes</div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="add-workout-form">
          <h2>Plan New Workout</h2>
          <form onSubmit={addWorkout}>
            <input
              type="text"
              value={workoutName}
              onChange={e => setWorkoutName(e.target.value)}
              placeholder="Workout name..."
              required
            />
            <div className="workout-form-grid">
              <select value={workoutType} onChange={e => setWorkoutType(e.target.value)}>
                {workoutTypes.map(type => (
                  <option key={type} value={type}>
                    {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="Duration (min)"
                required
              />
              <input
                type="number"
                value={caloriesBurned}
                onChange={e => setCaloriesBurned(e.target.value)}
                placeholder="Calories (est.)"
              />
            </div>
            <button type="submit">Plan Workout</button>
          </form>
        </div>
      )}

      <div className="week-summary">
        <h2>This Week</h2>
        <div className="week-stats">
          <div className="week-stat">
            <span className="week-label">Workouts</span>
            <span className="week-value">{thisWeekWorkouts.length}</span>
          </div>
          <div className="week-stat">
            <span className="week-label">Minutes</span>
            <span className="week-value">
              {thisWeekWorkouts.reduce((sum, w) => sum + w.duration, 0)}
            </span>
          </div>
          <div className="week-stat">
            <span className="week-label">Calories</span>
            <span className="week-value">
              {thisWeekWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="workouts-list">
        <h2>Workout Schedule</h2>
        <div className="workouts-grid">
          {workouts.sort((a, b) => new Date(b.date) - new Date(a.date)).map(workout => (
            <div key={workout.id} className={`workout-card ${workout.completed ? 'completed' : ''}`}>
              <div className="workout-card-header">
                <span className="workout-type-icon">{getTypeIcon(workout.type)}</span>
                <span className="workout-type-badge">{workout.type}</span>
                <button className="delete-workout-btn" onClick={() => deleteWorkout(workout.id)}>×</button>
              </div>
              <h3>{workout.name}</h3>
              <div className="workout-details">
                <div className="workout-detail">
                  <span className="detail-icon">⏱️</span>
                  <span>{workout.duration} min</span>
                </div>
                <div className="workout-detail">
                  <span className="detail-icon">🔥</span>
                  <span>{workout.caloriesBurned} cal</span>
                </div>
              </div>
              <div className="workout-date">
                {new Date(workout.date).toLocaleDateString()}
              </div>
              <button
                className={`complete-workout-btn ${workout.completed ? 'completed' : ''}`}
                onClick={() => toggleComplete(workout.id)}
              >
                {workout.completed ? '✓ Completed' : 'Mark Complete'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {workouts.length === 0 && (
        <div className="empty-workouts">
          <p>No workouts planned yet!</p>
        </div>
      )}
    </div>
  )
}

export default FitnessPlanner
