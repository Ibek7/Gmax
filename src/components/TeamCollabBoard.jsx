import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TeamCollabBoard.css'

const TeamCollabBoard = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])

  const defaultTasks = [
    { id: 1, title: 'Design homepage', assignee: 'Sarah', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Backend API', assignee: 'John', status: 'todo', priority: 'medium' },
    { id: 3, title: 'Testing', assignee: 'Alex', status: 'done', priority: 'low' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('gmax_collab_tasks')
    setTasks(saved ? JSON.parse(saved) : defaultTasks)
  }, [])

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status)

  return (
    <div className="collab-board-container">
      <div className="board-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>👥 Team Collaboration Board</h1>
      </div>

      <div className="kanban-board">
        {['todo', 'in-progress', 'done'].map(status => (
          <div key={status} className="kanban-column">
            <h3>{status.replace('-', ' ').toUpperCase()}</h3>
            <div className="task-list">
              {getTasksByStatus(status).map(task => (
                <div key={task.id} className={`task-card ${task.priority}`}>
                  <h4>{task.title}</h4>
                  <p>👤 {task.assignee}</p>
                  <span className="priority-badge">{task.priority}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamCollabBoard
