import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeGoalsTracker.css'

const CreativeGoalsTracker = () => {
  const navigate = useNavigate()
  const [goals, setGoals] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('gmax_creative_goals')
    setGoals(saved ? JSON.parse(saved) : [])
  }, [])

  const saveGoals = (updated) => {
    setGoals(updated)
    localStorage.setItem('gmax_creative_goals', JSON.stringify(updated))
  }

  const addGoal = (goal) => {
    const newGoal = { ...goal, id: Date.now(), progress: 0, completed: false }
    saveGoals([newGoal, ...goals])
    setShowAddModal(false)
  }

  const updateProgress = (id, progress) => {
    const updated = goals.map(g => 
      g.id === id ? { ...g, progress, completed: progress >= 100 } : g
    )
    saveGoals(updated)
  }

  return (
    <div className="goals-tracker-container">
      <div className="goals-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎯 Creative Goals Tracker</h1>
        <button className="add-goal-btn" onClick={() => setShowAddModal(true)}>+ Add Goal</button>
      </div>

      <div className="goals-grid">
        {goals.map(goal => (
          <div key={goal.id} className={`goal-card ${goal.completed ? 'completed' : ''}`}>
            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
            <div className="progress-section">
              <div className="progress-bar">
                <div className="fill" style={{ width: `${goal.progress}%` }}></div>
              </div>
              <span>{goal.progress}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={goal.progress}
              onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddGoalModal onSave={addGoal} onCancel={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

const AddGoalModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', description: '' })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add New Goal</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
          <div className="form-group">
            <label>Goal Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Add Goal</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreativeGoalsTracker
