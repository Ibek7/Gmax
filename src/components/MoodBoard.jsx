import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MoodBoard.css'

const MoodBoard = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([
    { id: 1, type: 'image', content: '🌅', x: 20, y: 20 },
    { id: 2, type: 'text', content: 'Dream Big', x: 200, y: 50 },
    { id: 3, type: 'image', content: '✨', x: 400, y: 100 }
  ])

  return (
    <div className="moodboard-container">
      <div className="moodboard-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎨 Creative Mood Board</h1>
        <div className="tools">
          <button>+ Text</button>
          <button>+ Image</button>
          <button>+ Color</button>
        </div>
      </div>

      <div className="canvas">
        {items.map(item => (
          <div 
            key={item.id} 
            className="board-item"
            style={{ left: item.x, top: item.y }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MoodBoard
