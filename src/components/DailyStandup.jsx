import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DailyStandup.css'

const DailyStandup = () => {
  const navigate = useNavigate()
  const [standups, setStandups] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('gmax_daily_standups')
    if (saved) setStandups(JSON.parse(saved))
  }, [])

  const saveStandup = (data) => {
    const newStandup = { ...data, id: Date.now(), date: new Date().toISOString() }
    const updated = [newStandup, ...standups]
    setStandups(updated)
    localStorage.setItem('gmax_daily_standups', JSON.stringify(updated))
    setShowModal(false)
  }

  return (
    <div className="standup-container">
      <div className="standup-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📝 Daily Standup</h1>
        <button className="add-standup-btn" onClick={() => setShowModal(true)}>+ New Standup</button>
      </div>

      <div className="standups-list">
        {standups.map(s => (
          <div key={s.id} className="standup-card">
            <div className="date">{new Date(s.date).toLocaleDateString()}</div>
            <div className="section"><strong>✅ Yesterday:</strong> {s.yesterday}</div>
            <div className="section"><strong>🎯 Today:</strong> {s.today}</div>
            <div className="section"><strong>🚧 Blockers:</strong> {s.blockers || 'None'}</div>
          </div>
        ))}
      </div>

      {showModal && <StandupModal onSave={saveStandup} onCancel={() => setShowModal(false)} />}
    </div>
  )
}

const StandupModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({ yesterday: '', today: '', blockers: '' })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Daily Standup</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(formData); }}>
          <div className="form-group">
            <label>What did you do yesterday? *</label>
            <textarea value={formData.yesterday} onChange={e => setFormData({...formData, yesterday: e.target.value})} required rows="3" />
          </div>
          <div className="form-group">
            <label>What will you do today? *</label>
            <textarea value={formData.today} onChange={e => setFormData({...formData, today: e.target.value})} required rows="3" />
          </div>
          <div className="form-group">
            <label>Any blockers?</label>
            <textarea value={formData.blockers} onChange={e => setFormData({...formData, blockers: e.target.value})} rows="2" />
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DailyStandup
