import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/SprintBoard.css'

const SprintBoard = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState({
    todo: [{ id: 1, title: 'Design homepage', points: 5 }],
    inProgress: [{ id: 2, title: 'Build API', points: 8 }],
    done: [{ id: 3, title: 'Setup project', points: 3 }]
  })

  const totalPoints = Object.values(tasks).flat().reduce((sum, t) => sum + t.points, 0)
  const completedPoints = tasks.done.reduce((sum, t) => sum + t.points, 0)

  return (
    <div className="sprint-container">
      <div className="sprint-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🏃 Sprint Planning</h1>
      </div>

      <div className="sprint-stats">
        <div className="stat">Sprint Progress: {Math.round((completedPoints / totalPoints) * 100)}%</div>
        <div className="stat">Points: {completedPoints}/{totalPoints}</div>
      </div>

      <div className="board">
        {['todo', 'inProgress', 'done'].map(column => (
          <div key={column} className="column">
            <h3>{column === 'todo' ? '📋 To Do' : column === 'inProgress' ? '⚡ In Progress' : '✅ Done'}</h3>
            <div className="tasks">
              {tasks[column].map(task => (
                <div key={task.id} className="task-card">
                  <div>{task.title}</div>
                  <span className="points">{task.points}pts</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SprintBoard
