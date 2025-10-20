import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BudgetTracker.css'

const BudgetTracker = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const saved = localStorage.getItem('gmax_budget_projects')
    if (saved) {
      const loaded = JSON.parse(saved)
      setProjects(loaded)
      if (loaded.length > 0) setSelectedProject(loaded[0])
    }
  }

  const saveProjects = (updated) => {
    setProjects(updated)
    localStorage.setItem('gmax_budget_projects', JSON.stringify(updated))
  }

  const addProject = (project) => {
    const newProject = { ...project, id: Date.now(), expenses: [] }
    const updated = [...projects, newProject]
    saveProjects(updated)
    setSelectedProject(newProject)
    setShowProjectModal(false)
  }

  const addExpense = (expense) => {
    const updated = projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, expenses: [...p.expenses, { ...expense, id: Date.now(), date: new Date().toISOString() }] }
        : p
    )
    saveProjects(updated)
    setSelectedProject(updated.find(p => p.id === selectedProject.id))
    setShowExpenseModal(false)
  }

  const deleteExpense = (expenseId) => {
    const updated = projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, expenses: p.expenses.filter(e => e.id !== expenseId) }
        : p
    )
    saveProjects(updated)
    setSelectedProject(updated.find(p => p.id === selectedProject.id))
  }

  const getTotalSpent = () => {
    if (!selectedProject) return 0
    return selectedProject.expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
  }

  const getRemainingBudget = () => {
    if (!selectedProject) return 0
    return parseFloat(selectedProject.budget) - getTotalSpent()
  }

  const getPercentageUsed = () => {
    if (!selectedProject || selectedProject.budget === 0) return 0
    return Math.min((getTotalSpent() / parseFloat(selectedProject.budget)) * 100, 100)
  }

  const getExpensesByCategory = () => {
    if (!selectedProject) return {}
    const categories = {}
    selectedProject.expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0
      }
      categories[expense.category] += parseFloat(expense.amount)
    })
    return categories
  }

  return (
    <div className="budget-tracker-container">
      <div className="budget-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💰 Project Budget Tracker</h1>
        <button className="add-project-btn" onClick={() => setShowProjectModal(true)}>
          + New Project
        </button>
      </div>

      {projects.length > 0 && (
        <>
          <div className="project-tabs">
            {projects.map(project => (
              <button
                key={project.id}
                className={selectedProject?.id === project.id ? 'active' : ''}
                onClick={() => setSelectedProject(project)}
              >
                {project.name}
              </button>
            ))}
          </div>

          {selectedProject && (
            <>
              <div className="budget-overview">
                <div className="budget-card">
                  <div className="budget-label">Total Budget</div>
                  <div className="budget-value">${parseFloat(selectedProject.budget).toFixed(2)}</div>
                </div>
                <div className="budget-card">
                  <div className="budget-label">Total Spent</div>
                  <div className="budget-value spent">${getTotalSpent().toFixed(2)}</div>
                </div>
                <div className="budget-card">
                  <div className="budget-label">Remaining</div>
                  <div className="budget-value remaining" style={{ color: getRemainingBudget() < 0 ? '#e74c3c' : '#2ecc71' }}>
                    ${getRemainingBudget().toFixed(2)}
                  </div>
                </div>
                <div className="budget-card">
                  <div className="budget-label">Used</div>
                  <div className="budget-value">{getPercentageUsed().toFixed(1)}%</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${getPercentageUsed()}%`,
                        background: getPercentageUsed() > 90 ? '#e74c3c' : getPercentageUsed() > 70 ? '#f39c12' : '#2ecc71'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="expenses-section">
                <div className="section-header">
                  <h2>Expenses</h2>
                  <button className="add-expense-btn" onClick={() => setShowExpenseModal(true)}>
                    + Add Expense
                  </button>
                </div>

                {selectedProject.expenses.length === 0 ? (
                  <div className="empty-state">No expenses yet. Add your first expense!</div>
                ) : (
                  <>
                    <div className="expenses-list">
                      {selectedProject.expenses.slice().reverse().map(expense => (
                        <div key={expense.id} className="expense-item">
                          <div className="expense-info">
                            <div className="expense-name">{expense.description}</div>
                            <div className="expense-meta">
                              <span className="expense-category">{expense.category}</span>
                              <span className="expense-date">
                                {new Date(expense.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="expense-actions">
                            <div className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</div>
                            <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="category-breakdown">
                      <h3>Spending by Category</h3>
                      {Object.entries(getExpensesByCategory()).map(([category, amount]) => (
                        <div key={category} className="category-item">
                          <div className="category-info">
                            <span className="category-name">{category}</span>
                            <span className="category-amount">${amount.toFixed(2)}</span>
                          </div>
                          <div className="category-bar">
                            <div 
                              className="category-fill"
                              style={{ width: `${(amount / getTotalSpent()) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}

      {projects.length === 0 && (
        <div className="empty-state">
          <h2>No projects yet</h2>
          <p>Create your first project budget to start tracking expenses!</p>
        </div>
      )}

      {showProjectModal && (
        <ProjectModal onSave={addProject} onCancel={() => setShowProjectModal(false)} />
      )}

      {showExpenseModal && (
        <ExpenseModal onSave={addExpense} onCancel={() => setShowExpenseModal(false)} />
      )}
    </div>
  )
}

const ProjectModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', budget: '' })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create Budget Project</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Total Budget *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.budget}
              onChange={e => setFormData({...formData, budget: e.target.value})}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Create Project</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ExpenseModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'software' })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add Expense</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="services">Services</option>
              <option value="marketing">Marketing</option>
              <option value="hosting">Hosting</option>
              <option value="design">Design</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Add Expense</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetTracker
