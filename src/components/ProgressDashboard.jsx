import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProgressDashboard.css'

const ProgressDashboard = () => {
  const navigate = useNavigate()
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [target, setTarget] = useState(100)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('gmax_progress_goals')
    if (saved) {
      setGoals(JSON.parse(saved))
    }
  }, [])

  const addGoal = (e) => {
    e.preventDefault()
    if (newGoal.trim() && target > 0) {
      const goal = {
        id: Date.now(),
        title: newGoal,
        target: parseInt(target),
        current: parseInt(current),
        createdAt: new Date().toISOString()
      }
      const updated = [...goals, goal]
      setGoals(updated)
      localStorage.setItem('gmax_progress_goals', JSON.stringify(updated))
      setNewGoal('')
      setTarget(100)
      setCurrent(0)
    }
  }

  const updateProgress = (id, newCurrent) => {
    const updated = goals.map(goal =>
      goal.id === id ? { ...goal, current: parseInt(newCurrent) } : goal
    )
    setGoals(updated)
    localStorage.setItem('gmax_progress_goals', JSON.stringify(updated))
  }

  const deleteGoal = (id) => {
    const updated = goals.filter(goal => goal.id !== id)
    setGoals(updated)
    localStorage.setItem('gmax_progress_goals', JSON.stringify(updated))
  }

  const getProgress = (goal) => {
    return Math.min((goal.current / goal.target) * 100, 100)
  }

  const getProgressColor = (percent) => {
    if (percent >= 100) return '#4caf50'
    if (percent >= 75) return '#2196f3'
    if (percent >= 50) return '#ff9800'
    return '#f44336'
  }

  const overallProgress = goals.length > 0
    ? goals.reduce((sum, goal) => sum + getProgress(goal), 0) / goals.length
    : 0

  return (
    <div className="progress-dashboard-container">
      <div className="progress-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📊 Progress Dashboard</h1>
      </div>

      <div className="overall-stats">
        <div className="overall-card">
          <h3>Overall Progress</h3>
          <div className="overall-percent">{overallProgress.toFixed(1)}%</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${overallProgress}%`,
                background: getProgressColor(overallProgress)
              }}
            ></div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{goals.length}</div>
            <div className="stat-label">Total Goals</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{goals.filter(g => getProgress(g) >= 100).length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{goals.filter(g => getProgress(g) < 100).length}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
      </div>

      <div className="add-goal-form">
        <h2>Add New Goal</h2>
        <form onSubmit={addGoal}>
          <input
            type="text"
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            placeholder="Goal title..."
            required
          />
          <div className="form-row">
            <input
              type="number"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder="Current"
              min="0"
            />
            <span className="separator">/</span>
            <input
              type="number"
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder="Target"
              min="1"
              required
            />
            <button type="submit">Add Goal</button>
          </div>
        </form>
      </div>

      <div className="goals-list">
        {goals.map(goal => {
          const progress = getProgress(goal)
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <h3>{goal.title}</h3>
                <button className="delete-btn" onClick={() => deleteGoal(goal.id)}>×</button>
              </div>
              <div className="goal-stats">
                <span className="goal-numbers">
                  {goal.current} / {goal.target}
                </span>
                <span className="goal-percent" style={{ color: getProgressColor(progress) }}>
                  {progress.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    background: getProgressColor(progress)
                  }}
                ></div>
              </div>
              <div className="update-controls">
                <input
                  type="number"
                  value={goal.current}
                  onChange={e => updateProgress(goal.id, e.target.value)}
                  min="0"
                  max={goal.target}
                />
                <span>Update progress</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressDashboard
