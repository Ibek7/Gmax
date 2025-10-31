import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BudgetCalculator.css'

const BudgetCalculator = () => {
  const navigate = useNavigate()
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [expenses, setExpenses] = useState([])
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('housing')
  const [showAddForm, setShowAddForm] = useState(false)

  const categories = {
    housing: { name: 'Housing', icon: '🏠', color: '#2196f3' },
    transportation: { name: 'Transportation', icon: '🚗', color: '#ff9800' },
    food: { name: 'Food', icon: '🍽️', color: '#4caf50' },
    utilities: { name: 'Utilities', icon: '💡', color: '#9c27b0' },
    entertainment: { name: 'Entertainment', icon: '🎬', color: '#e91e63' },
    healthcare: { name: 'Healthcare', icon: '🏥', color: '#00bcd4' },
    savings: { name: 'Savings', icon: '💰', color: '#8bc34a' },
    other: { name: 'Other', icon: '📝', color: '#607d8b' }
  }

  useEffect(() => {
    const savedIncome = localStorage.getItem('gmax_monthly_income')
    const savedExpenses = localStorage.getItem('gmax_monthly_expenses')
    
    if (savedIncome) setMonthlyIncome(parseFloat(savedIncome))
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
  }, [])

  const saveIncome = (value) => {
    setMonthlyIncome(value)
    localStorage.setItem('gmax_monthly_income', value.toString())
  }

  const addExpense = (e) => {
    e.preventDefault()
    if (expenseName.trim() && expenseAmount) {
      const expense = {
        id: Date.now(),
        name: expenseName,
        amount: parseFloat(expenseAmount),
        category: expenseCategory
      }
      const updated = [...expenses, expense]
      setExpenses(updated)
      localStorage.setItem('gmax_monthly_expenses', JSON.stringify(updated))
      
      setExpenseName('')
      setExpenseAmount('')
      setExpenseCategory('housing')
      setShowAddForm(false)
    }
  }

  const deleteExpense = (id) => {
    const updated = expenses.filter(e => e.id !== id)
    setExpenses(updated)
    localStorage.setItem('gmax_monthly_expenses', JSON.stringify(updated))
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const remaining = monthlyIncome - totalExpenses
  const savingsRate = monthlyIncome > 0 ? ((remaining / monthlyIncome) * 100).toFixed(1) : 0

  const categoryTotals = Object.keys(categories).map(cat => ({
    category: cat,
    ...categories[cat],
    total: expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
  })).filter(ct => ct.total > 0)

  const getHealthColor = () => {
    if (remaining < 0) return '#f44336'
    if (savingsRate >= 20) return '#4caf50'
    if (savingsRate >= 10) return '#ff9800'
    return '#ffc107'
  }

  return (
    <div className="budget-calculator-container">
      <div className="budget-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💵 Budget Calculator</h1>
      </div>

      <div className="income-card">
        <h2>Monthly Income</h2>
        <div className="income-input-group">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            value={monthlyIncome || ''}
            onChange={e => saveIncome(parseFloat(e.target.value) || 0)}
            placeholder="Enter your monthly income"
            className="income-input"
          />
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card income-summary">
          <span className="summary-icon">💰</span>
          <div className="summary-info">
            <span className="summary-label">Total Income</span>
            <span className="summary-value">${monthlyIncome.toFixed(2)}</span>
          </div>
        </div>

        <div className="summary-card expenses-summary">
          <span className="summary-icon">💸</span>
          <div className="summary-info">
            <span className="summary-label">Total Expenses</span>
            <span className="summary-value">${totalExpenses.toFixed(2)}</span>
          </div>
        </div>

        <div className="summary-card remaining-summary" style={{ borderColor: getHealthColor() }}>
          <span className="summary-icon">{remaining >= 0 ? '✅' : '⚠️'}</span>
          <div className="summary-info">
            <span className="summary-label">Remaining</span>
            <span className="summary-value" style={{ color: getHealthColor() }}>
              ${remaining.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="summary-card savings-summary">
          <span className="summary-icon">📊</span>
          <div className="summary-info">
            <span className="summary-label">Savings Rate</span>
            <span className="summary-value">{savingsRate}%</span>
          </div>
        </div>
      </div>

      {categoryTotals.length > 0 && (
        <div className="category-breakdown">
          <h2>📊 Spending by Category</h2>
          <div className="category-grid">
            {categoryTotals.map(ct => {
              const percentage = ((ct.total / totalExpenses) * 100).toFixed(1)
              return (
                <div key={ct.category} className="category-card">
                  <div className="category-header">
                    <span className="category-icon">{ct.icon}</span>
                    <span className="category-name">{ct.name}</span>
                  </div>
                  <div className="category-amount">${ct.total.toFixed(2)}</div>
                  <div className="category-bar-bg">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        background: ct.color
                      }}
                    ></div>
                  </div>
                  <span className="category-percentage">{percentage}% of total</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="expenses-section">
        <div className="expenses-header">
          <h2>📝 Expenses</h2>
          <button className="add-expense-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕ Cancel' : '+ Add Expense'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-expense-form">
            <form onSubmit={addExpense}>
              <input
                type="text"
                value={expenseName}
                onChange={e => setExpenseName(e.target.value)}
                placeholder="Expense name..."
                required
              />
              <input
                type="number"
                value={expenseAmount}
                onChange={e => setExpenseAmount(e.target.value)}
                placeholder="Amount..."
                step="0.01"
                required
              />
              <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)}>
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="submit-expense-btn">Add Expense</button>
            </form>
          </div>
        )}

        <div className="expenses-list">
          {expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <span className="expense-icon">{categories[expense.category].icon}</span>
              <div className="expense-details">
                <span className="expense-name">{expense.name}</span>
                <span className="expense-category">{categories[expense.category].name}</span>
              </div>
              <span className="expense-amount">${expense.amount.toFixed(2)}</span>
              <button onClick={() => deleteExpense(expense.id)} className="delete-expense-btn">
                ×
              </button>
            </div>
          ))}
        </div>

        {expenses.length === 0 && !showAddForm && (
          <div className="empty-expenses">
            <p>No expenses added yet</p>
          </div>
        )}
      </div>

      <div className="tips-section">
        <h3>💡 Budget Tips</h3>
        <ul>
          <li>Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
          <li>Track all expenses to identify spending patterns</li>
          <li>Build an emergency fund covering 3-6 months of expenses</li>
          <li>Review and adjust your budget monthly</li>
          <li>Aim to save at least 20% of your income</li>
        </ul>
      </div>
    </div>
  )
}

export default BudgetCalculator
