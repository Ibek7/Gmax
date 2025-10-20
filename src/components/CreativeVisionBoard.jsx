import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeVisionBoard.css'

const CreativeVisionBoard = () => {
  const navigate = useNavigate()
  const [visionItems, setVisionItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newItem, setNewItem] = useState({
    type: 'goal',
    content: '',
    icon: '🎯',
    color: '#667eea'
  })

  const itemTypes = [
    { value: 'goal', label: 'Goal', icon: '🎯' },
    { value: 'quote', label: 'Quote', icon: '💭' },
    { value: 'aspiration', label: 'Aspiration', icon: '✨' },
    { value: 'milestone', label: 'Milestone', icon: '🏆' },
    { value: 'dream', label: 'Dream', icon: '🌟' },
    { value: 'value', label: 'Core Value', icon: '💎' }
  ]

  const colorOptions = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', 
    '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'
  ]

  useEffect(() => {
    loadVisionBoard()
  }, [])

  const loadVisionBoard = () => {
    const saved = localStorage.getItem('gmax_vision_board')
    if (saved) {
      setVisionItems(JSON.parse(saved))
    } else {
      const mockItems = [
        {
          id: 1,
          type: 'goal',
          content: 'Launch my first indie game',
          icon: '🎯',
          color: '#667eea',
          position: { x: 20, y: 20 }
        },
        {
          id: 2,
          type: 'quote',
          content: '"Creativity takes courage" - Henri Matisse',
          icon: '💭',
          color: '#f093fb',
          position: { x: 320, y: 20 }
        },
        {
          id: 3,
          type: 'dream',
          content: 'Build a creative studio',
          icon: '🌟',
          color: '#43e97b',
          position: { x: 20, y: 200 }
        }
      ]
      setVisionItems(mockItems)
      localStorage.setItem('gmax_vision_board', JSON.stringify(mockItems))
    }
  }

  const addVisionItem = () => {
    if (!newItem.content.trim()) return

    const item = {
      ...newItem,
      id: Date.now(),
      position: { x: Math.random() * 200, y: Math.random() * 200 }
    }

    const updated = [...visionItems, item]
    setVisionItems(updated)
    localStorage.setItem('gmax_vision_board', JSON.stringify(updated))
    setShowModal(false)
    setNewItem({ type: 'goal', content: '', icon: '🎯', color: '#667eea' })
  }

  const deleteItem = (id) => {
    const updated = visionItems.filter(item => item.id !== id)
    setVisionItems(updated)
    localStorage.setItem('gmax_vision_board', JSON.stringify(updated))
  }

  const updateItemType = (value) => {
    const type = itemTypes.find(t => t.value === value)
    setNewItem({ ...newItem, type: value, icon: type.icon })
  }

  return (
    <div className="vision-board-container">
      <div className="vision-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🌈 Creative Vision Board</h1>
        <button className="add-vision-btn" onClick={() => setShowModal(true)}>
          + Add Vision Item
        </button>
      </div>

      <div className="vision-board">
        {visionItems.length === 0 ? (
          <div className="empty-board">
            <h2>Your Vision Board is Empty</h2>
            <p>Add your goals, dreams, quotes, and aspirations to create your creative vision!</p>
            <button onClick={() => setShowModal(true)}>Get Started</button>
          </div>
        ) : (
          <div className="vision-items-grid">
            {visionItems.map(item => (
              <div
                key={item.id}
                className="vision-item"
                style={{ 
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  gridColumn: 'span 1',
                  gridRow: 'span 1'
                }}
              >
                <button className="delete-item-btn" onClick={() => deleteItem(item.id)}>
                  ×
                </button>
                <div className="item-icon">{item.icon}</div>
                <div className="item-type">{item.type}</div>
                <div className="item-content">{item.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Vision Item</h2>
            
            <div className="form-group">
              <label>Type</label>
              <div className="type-selector">
                {itemTypes.map(type => (
                  <button
                    key={type.value}
                    className={`type-btn ${newItem.type === type.value ? 'active' : ''}`}
                    onClick={() => updateItemType(type.value)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                placeholder="Describe your goal, quote, or aspiration..."
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <div className="color-selector">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${newItem.color === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setNewItem({ ...newItem, color })}
                  />
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={addVisionItem}>
                Add to Vision Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreativeVisionBoard
