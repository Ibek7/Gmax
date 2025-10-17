import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DailyGoals.css'

function DailyGoals() {
  const navigate = useNavigate()
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [streak, setStreak] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [showAddGoal, setShowAddGoal] = useState(false)

  useEffect(() => {
    loadTodaysGoals()
    loadStats()
  }, [])

  const loadTodaysGoals = () => {
    const today = new Date().toDateString()
    const savedGoals = JSON.parse(localStorage.getItem('dailyGoals') || '{}')
    
    if (savedGoals.date === today) {
      setGoals(savedGoals.goals || [])
    } else {
      // New day - check if yesterday was completed for streak
      checkStreak(savedGoals)
      setGoals([])
      localStorage.setItem('dailyGoals', JSON.stringify({ date: today, goals: [] }))
    }
  }

  const checkStreak = (previousDay) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    if (previousDay.date === yesterdayStr) {
      const allCompleted = previousDay.goals?.every(g => g.completed)
      if (allCompleted && previousDay.goals?.length > 0) {
        // Streak continues
        return
      }
    }
    // Streak broken - reset will happen in loadStats
  }

  const loadStats = () => {
    const stats = JSON.parse(localStorage.getItem('goalsStats') || '{"streak": 0, "total": 0, "lastCompletedDate": ""}')
    setStreak(stats.streak || 0)
    setTotalCompleted(stats.total || 0)
  }

  const addGoal = () => {
    if (!newGoal.trim()) return

    const goal = {
      id: Date.now(),
      text: newGoal,
      completed: false,
      createdAt: new Date().toISOString()
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    setNewGoal('')
    setShowAddGoal(false)
  }

  const toggleGoal = (id) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    )
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    
    // Check if all goals completed
    const allCompleted = updatedGoals.every(g => g.completed)
    if (allCompleted && updatedGoals.length > 0) {
      updateStreakAndTotal()
    }
  }

  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id)
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
  }

  const saveGoals = (updatedGoals) => {
    const today = new Date().toDateString()
    localStorage.setItem('dailyGoals', JSON.stringify({ date: today, goals: updatedGoals }))
  }

  const updateStreakAndTotal = () => {
    const today = new Date().toDateString()
    const stats = JSON.parse(localStorage.getItem('goalsStats') || '{"streak": 0, "total": 0, "lastCompletedDate": ""}')
    
    if (stats.lastCompletedDate !== today) {
      const newTotal = stats.total + 1
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      let newStreak = stats.streak
      if (stats.lastCompletedDate === yesterday.toDateString()) {
        newStreak += 1
      } else if (stats.lastCompletedDate !== today) {
        newStreak = 1
      }
      
      const newStats = {
        streak: newStreak,
        total: newTotal,
        lastCompletedDate: today
      }
      
      setStreak(newStreak)
      setTotalCompleted(newTotal)
      localStorage.setItem('goalsStats', JSON.stringify(newStats))
      
      // Show celebration
      if (newStreak % 7 === 0) {
        alert(`🎉 Amazing! ${newStreak} day streak! You're on fire! 🔥`)
      }
    }
  }

  const completedCount = goals.filter(g => g.completed).length
  const progressPercentage = goals.length > 0 ? (completedCount / goals.length) * 100 : 0

  return (
    <div className="daily-goals-container">
      <div className="goals-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🎯 Daily Goals</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Days Completed</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{completedCount}/{goals.length}</div>
            <div className="stat-label">Today's Goals</div>
          </div>
        </div>
      </div>

      {goals.length > 0 && (
        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="progress-text">{Math.round(progressPercentage)}% Complete</p>
        </div>
      )}

      <div className="goals-content">
        <div className="goals-list">
          {goals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No goals for today</h3>
              <p>Add your first goal to get started!</p>
            </div>
          ) : (
            goals.map(goal => (
              <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                <button
                  className="goal-checkbox"
                  onClick={() => toggleGoal(goal.id)}
                >
                  {goal.completed && '✓'}
                </button>
                <span className="goal-text">{goal.text}</span>
                <button
                  className="delete-goal-btn"
                  onClick={() => deleteGoal(goal.id)}
                  title="Delete goal"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {showAddGoal ? (
          <div className="add-goal-form">
            <input
              type="text"
              placeholder="What do you want to accomplish today?"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              autoFocus
            />
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => { setShowAddGoal(false); setNewGoal(''); }}>
                Cancel
              </button>
              <button className="add-btn" onClick={addGoal}>
                Add Goal
              </button>
            </div>
          </div>
        ) : (
          <button className="new-goal-btn" onClick={() => setShowAddGoal(true)}>
            + Add New Goal
          </button>
        )}
      </div>

      <div className="motivation-section">
        <h3>💪 Stay Motivated</h3>
        <div className="motivation-cards">
          <div className="motivation-card">
            <div className="card-icon">🌟</div>
            <p>Complete all goals to maintain your streak!</p>
          </div>
          <div className="motivation-card">
            <div className="card-icon">🏆</div>
            <p>Every 7-day streak unlocks special achievements</p>
          </div>
          <div className="motivation-card">
            <div className="card-icon">📈</div>
            <p>Small daily wins lead to massive progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyGoals
