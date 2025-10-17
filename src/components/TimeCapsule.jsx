import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TimeCapsule.css'

function TimeCapsule() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [openDate, setOpenDate] = useState('')
  const [capsules, setCapsules] = useState(JSON.parse(localStorage.getItem('timeCapsules') || '[]'))
  
  const createCapsule = () => {
    if (!message || !openDate) return alert('Please fill in all fields!')
    
    const capsule = {
      id: Date.now(),
      message,
      openDate,
      createdAt: new Date().toISOString()
    }
    
    const updated = [...capsules, capsule]
    setCapsules(updated)
    localStorage.setItem('timeCapsules', JSON.stringify(updated))
    setMessage('')
    setOpenDate('')
    alert('🎉 Time capsule created!')
  }
  
  const canOpen = (capsule) => {
    return new Date(capsule.openDate) <= new Date()
  }
  
  return (
    <div className="time-capsule-container">
      <div className="capsule-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>⏰ Time Capsule</h1>
        <div style={{width: '100px'}}></div>
      </div>
      
      <div className="create-capsule">
        <h2>Create a Time Capsule</h2>
        <textarea
          placeholder="Write a message to your future self..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
        />
        <input
          type="date"
          value={openDate}
          onChange={(e) => setOpenDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
        <button onClick={createCapsule}>🔒 Seal Capsule</button>
      </div>
      
      <div className="capsules-list">
        <h2>Your Time Capsules</h2>
        {capsules.length === 0 ? (
          <p className="empty-message">No time capsules yet. Create your first one!</p>
        ) : (
          capsules.map(capsule => (
            <div key={capsule.id} className={`capsule-item ${canOpen(capsule) ? 'unlocked' : 'locked'}`}>
              <div className="capsule-icon">{canOpen(capsule) ? '🔓' : '🔒'}</div>
              <div className="capsule-info">
                <div className="capsule-date">Opens: {new Date(capsule.openDate).toLocaleDateString()}</div>
                {canOpen(capsule) ? (
                  <div className="capsule-message">{capsule.message}</div>
                ) : (
                  <div className="capsule-locked">Locked until {new Date(capsule.openDate).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TimeCapsule
