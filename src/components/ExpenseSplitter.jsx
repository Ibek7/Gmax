import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ExpenseSplitter.css'

const ExpenseSplitter = () => {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [currentGroup, setCurrentGroup] = useState(null)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  
  const [groupName, setGroupName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [members, setMembers] = useState([])
  
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitAmong, setSplitAmong] = useState([])

  useEffect(() => {
    const savedGroups = localStorage.getItem('gmax_expense_groups')
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    }
  }, [])

  const saveGroups = (updatedGroups) => {
    setGroups(updatedGroups)
    localStorage.setItem('gmax_expense_groups', JSON.stringify(updatedGroups))
  }

  const addMember = () => {
    if (memberName.trim() && !members.includes(memberName.trim())) {
      setMembers([...members, memberName.trim()])
      setMemberName('')
    }
  }

  const removeMember = (member) => {
    setMembers(members.filter(m => m !== member))
  }

  const createGroup = (e) => {
    e.preventDefault()
    if (members.length < 2) {
      alert('Add at least 2 members to create a group')
      return
    }
    
    const group = {
      id: Date.now(),
      name: groupName,
      members: members,
      expenses: [],
      createdAt: new Date().toISOString()
    }
    
    saveGroups([...groups, group])
    setGroupName('')
    setMembers([])
    setShowAddGroup(false)
  }

  const deleteGroup = (id) => {
    saveGroups(groups.filter(g => g.id !== id))
    if (currentGroup?.id === id) {
      setCurrentGroup(null)
    }
  }

  const addExpense = (e) => {
    e.preventDefault()
    if (splitAmong.length === 0) {
      alert('Select at least one member to split with')
      return
    }

    const expense = {
      id: Date.now(),
      description: expenseDescription,
      amount: parseFloat(expenseAmount),
      paidBy: paidBy,
      splitAmong: splitAmong,
      date: new Date().toISOString()
    }

    const updatedGroups = groups.map(g =>
      g.id === currentGroup.id
        ? { ...g, expenses: [...g.expenses, expense] }
        : g
    )

    saveGroups(updatedGroups)
    setCurrentGroup(updatedGroups.find(g => g.id === currentGroup.id))
    
    setExpenseDescription('')
    setExpenseAmount('')
    setPaidBy('')
    setSplitAmong([])
    setShowAddExpense(false)
  }

  const deleteExpense = (expenseId) => {
    const updatedGroups = groups.map(g =>
      g.id === currentGroup.id
        ? { ...g, expenses: g.expenses.filter(e => e.id !== expenseId) }
        : g
    )
    
    saveGroups(updatedGroups)
    setCurrentGroup(updatedGroups.find(g => g.id === currentGroup.id))
  }

  const toggleSplitMember = (member) => {
    if (splitAmong.includes(member)) {
      setSplitAmong(splitAmong.filter(m => m !== member))
    } else {
      setSplitAmong([...splitAmong, member])
    }
  }

  const calculateBalances = (group) => {
    const balances = {}
    group.members.forEach(member => {
      balances[member] = 0
    })

    group.expenses.forEach(expense => {
      const shareAmount = expense.amount / expense.splitAmong.length
      
      balances[expense.paidBy] += expense.amount
      
      expense.splitAmong.forEach(member => {
        balances[member] -= shareAmount
      })
    })

    return balances
  }

  const getSettlements = (balances) => {
    const settlements = []
    const creditors = []
    const debtors = []

    Object.entries(balances).forEach(([person, balance]) => {
      if (balance > 0.01) {
        creditors.push({ person, amount: balance })
      } else if (balance < -0.01) {
        debtors.push({ person, amount: Math.abs(balance) })
      }
    })

    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    let i = 0, j = 0
    while (i < creditors.length && j < debtors.length) {
      const amount = Math.min(creditors[i].amount, debtors[j].amount)
      settlements.push({
        from: debtors[j].person,
        to: creditors[i].person,
        amount: amount
      })

      creditors[i].amount -= amount
      debtors[j].amount -= amount

      if (creditors[i].amount < 0.01) i++
      if (debtors[j].amount < 0.01) j++
    }

    return settlements
  }

  if (currentGroup) {
    const balances = calculateBalances(currentGroup)
    const settlements = getSettlements(balances)
    const totalExpenses = currentGroup.expenses.reduce((sum, e) => sum + e.amount, 0)

    return (
      <div className="expense-splitter-container">
        <div className="expense-header">
          <button className="back-btn" onClick={() => setCurrentGroup(null)}>← Back to Groups</button>
          <h1>{currentGroup.name}</h1>
        </div>

        <div className="group-summary">
          <div className="summary-box">
            <span className="summary-icon">💰</span>
            <div className="summary-info">
              <span className="summary-label">Total Expenses</span>
              <span className="summary-value">${totalExpenses.toFixed(2)}</span>
            </div>
          </div>
          <div className="summary-box">
            <span className="summary-icon">👥</span>
            <div className="summary-info">
              <span className="summary-label">Members</span>
              <span className="summary-value">{currentGroup.members.length}</span>
            </div>
          </div>
          <div className="summary-box">
            <span className="summary-icon">📝</span>
            <div className="summary-info">
              <span className="summary-label">Expenses</span>
              <span className="summary-value">{currentGroup.expenses.length}</span>
            </div>
          </div>
        </div>

        <div className="group-actions">
          <button className="add-expense-btn" onClick={() => setShowAddExpense(!showAddExpense)}>
            {showAddExpense ? '✕ Cancel' : '+ Add Expense'}
          </button>
          <button className="delete-group-btn" onClick={() => deleteGroup(currentGroup.id)}>
            🗑️ Delete Group
          </button>
        </div>

        {showAddExpense && (
          <div className="add-expense-form">
            <h3>Add New Expense</h3>
            <form onSubmit={addExpense}>
              <input
                type="text"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="Description (e.g., Dinner, Movie tickets)"
                required
              />
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Amount"
                step="0.01"
                required
              />
              <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} required>
                <option value="">Who paid?</option>
                {currentGroup.members.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
              
              <div className="split-selector">
                <label>Split among:</label>
                <div className="member-checkboxes">
                  {currentGroup.members.map(member => (
                    <label key={member} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={splitAmong.includes(member)}
                        onChange={() => toggleSplitMember(member)}
                      />
                      {member}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="submit-expense-btn">Add Expense</button>
            </form>
          </div>
        )}

        {settlements.length > 0 && (
          <div className="settlements-section">
            <h2>💸 Settlements</h2>
            <div className="settlements-list">
              {settlements.map((settlement, index) => (
                <div key={index} className="settlement-item">
                  <span className="settlement-from">{settlement.from}</span>
                  <span className="settlement-arrow">→</span>
                  <span className="settlement-to">{settlement.to}</span>
                  <span className="settlement-amount">${settlement.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="balances-section">
          <h2>📊 Balances</h2>
          <div className="balances-grid">
            {Object.entries(balances).map(([person, balance]) => (
              <div key={person} className={`balance-card ${balance > 0.01 ? 'positive' : balance < -0.01 ? 'negative' : 'neutral'}`}>
                <span className="balance-person">{person}</span>
                <span className="balance-amount">
                  {balance > 0.01 ? `+$${balance.toFixed(2)}` : balance < -0.01 ? `-$${Math.abs(balance).toFixed(2)}` : '$0.00'}
                </span>
                <span className="balance-status">
                  {balance > 0.01 ? 'Gets back' : balance < -0.01 ? 'Owes' : 'Settled up'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="expenses-history">
          <h2>📝 Expense History</h2>
          {currentGroup.expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <div className="expense-desc">{expense.description}</div>
                <div className="expense-details">
                  Paid by <strong>{expense.paidBy}</strong> • Split among {expense.splitAmong.join(', ')}
                </div>
                <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
              </div>
              <div className="expense-amount">${expense.amount.toFixed(2)}</div>
              <button onClick={() => deleteExpense(expense.id)} className="delete-expense-btn">×</button>
            </div>
          ))}
          {currentGroup.expenses.length === 0 && (
            <div className="empty-expenses">No expenses yet</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="expense-splitter-container">
      <div className="expense-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💵 Expense Splitter</h1>
      </div>

      <div className="controls">
        <button className="add-group-btn" onClick={() => setShowAddGroup(!showAddGroup)}>
          {showAddGroup ? '✕ Cancel' : '+ Create Group'}
        </button>
      </div>

      {showAddGroup && (
        <div className="add-group-form">
          <h2>Create New Group</h2>
          <form onSubmit={createGroup}>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name (e.g., Weekend Trip)"
              required
            />
            
            <div className="member-input">
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Member name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
              />
              <button type="button" onClick={addMember} className="add-member-btn">
                + Add
              </button>
            </div>

            <div className="members-list">
              {members.map(member => (
                <div key={member} className="member-chip">
                  {member}
                  <button type="button" onClick={() => removeMember(member)}>×</button>
                </div>
              ))}
            </div>

            <button type="submit" className="submit-group-btn">Create Group</button>
          </form>
        </div>
      )}

      <div className="groups-grid">
        {groups.map(group => {
          const total = group.expenses.reduce((sum, e) => sum + e.amount, 0)
          return (
            <div key={group.id} className="group-card" onClick={() => setCurrentGroup(group)}>
              <h3>{group.name}</h3>
              <div className="group-info">
                <span>👥 {group.members.length} members</span>
                <span>📝 {group.expenses.length} expenses</span>
              </div>
              <div className="group-total">Total: ${total.toFixed(2)}</div>
            </div>
          )
        })}
      </div>

      {groups.length === 0 && !showAddGroup && (
        <div className="empty-groups">
          <p>No groups yet. Create your first group to split expenses!</p>
        </div>
      )}
    </div>
  )
}

export default ExpenseSplitter
