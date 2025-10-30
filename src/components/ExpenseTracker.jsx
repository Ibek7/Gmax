import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ExpenseTracker.css'

const ExpenseTracker = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [budget, setBudget] = useState(0)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'health', 'other']

  useEffect(() => {
    const savedExpenses = localStorage.getItem('gmax_expenses')
    const savedBudget = localStorage.getItem('gmax_budget')
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
    if (savedBudget) setBudget(parseFloat(savedBudget))
  }, [])

  const addExpense = (e) => {
    e.preventDefault()
    if (description.trim() && amount) {
      const expense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString()
      }
      const updated = [...expenses, expense]
      setExpenses(updated)
      localStorage.setItem('gmax_expenses', JSON.stringify(updated))
      setDescription('')
      setAmount('')
      setCategory('food')
    }
  }

  const deleteExpense = (id) => {
    const updated = expenses.filter(e => e.id !== id)
    setExpenses(updated)
    localStorage.setItem('gmax_expenses', JSON.stringify(updated))
  }

  const updateBudget = (newBudget) => {
    setBudget(parseFloat(newBudget))
    localStorage.setItem('gmax_budget', newBudget)
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = budget - totalSpent
  const budgetPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0

  const filteredExpenses = filterCategory === 'all'
    ? expenses
    : expenses.filter(e => e.category === filterCategory)

  const categoryTotals = categories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.total > 0)

  const getCategoryIcon = (cat) => {
    const icons = {
      food: '🍔',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '💡',
      shopping: '🛍️',
      health: '💊',
      other: '📦'
    }
    return icons[cat] || '💰'
  }

  return (
    <div className="expense-tracker-container">
      <div className="expense-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💰 Expense Tracker</h1>
      </div>

      <div className="budget-section">
        <div className="budget-card">
          <h3>Monthly Budget</h3>
          <div className="budget-input-group">
            <span className="currency">$</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => updateBudget(e.target.value)}
              placeholder="Set your budget..."
            />
          </div>
          <div className="budget-bar">
            <div
              className="budget-bar-fill"
              style={{
                width: `${Math.min(budgetPercentage, 100)}%`,
                background: budgetPercentage > 90 ? '#f44336' : budgetPercentage > 70 ? '#ff9800' : '#4caf50'
              }}
            ></div>
          </div>
          <div className="budget-stats">
            <div className="budget-stat">
              <span className="label">Spent</span>
              <span className="value">${totalSpent.toFixed(2)}</span>
            </div>
            <div className="budget-stat">
              <span className="label">Remaining</span>
              <span className={`value ${remaining < 0 ? 'negative' : 'positive'}`}>
                ${remaining.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="add-expense-form">
        <h2>Add Expense</h2>
        <form onSubmit={addExpense}>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description..."
            required
          />
          <div className="form-row">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount"
              required
            />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>

      <div className="category-breakdown">
        <h2>Category Breakdown</h2>
        <div className="category-grid">
          {categoryTotals.map(cat => (
            <div key={cat.category} className="category-item">
              <span className="cat-icon">{getCategoryIcon(cat.category)}</span>
              <div className="cat-info">
                <span className="cat-name">{cat.category}</span>
                <span className="cat-amount">${cat.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="expense-filters">
        <button
          className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {getCategoryIcon(cat)} {cat}
          </button>
        ))}
      </div>

      <div className="expenses-list">
        <h2>Recent Expenses ({filteredExpenses.length})</h2>
        {filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => (
          <div key={expense.id} className="expense-item">
            <span className="expense-icon">{getCategoryIcon(expense.category)}</span>
            <div className="expense-details">
              <span className="expense-desc">{expense.description}</span>
              <span className="expense-date">{new Date(expense.date).toLocaleDateString()}</span>
            </div>
            <span className="expense-amount">${expense.amount.toFixed(2)}</span>
            <button className="delete-expense-btn" onClick={() => deleteExpense(expense.id)}>×</button>
          </div>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="empty-expenses">
          <p>No expenses yet</p>
        </div>
      )}
    </div>
  )
}

export default ExpenseTracker
