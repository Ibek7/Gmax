import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CollaborationInvites.css'

const CollaborationInvites = () => {
  const navigate = useNavigate()
  const [invites, setInvites] = useState([])
  const [showSendModal, setShowSendModal] = useState(false)

  useEffect(() => {
    loadInvites()
  }, [])

  const loadInvites = () => {
    const saved = localStorage.getItem('gmax_collaboration_invites')
    if (saved) {
      setInvites(JSON.parse(saved))
    }
  }

  const saveInvites = (updated) => {
    setInvites(updated)
    localStorage.setItem('gmax_collaboration_invites', JSON.stringify(updated))
  }

  const sendInvite = (inviteData) => {
    const newInvite = {
      ...inviteData,
      id: Date.now(),
      status: 'pending',
      sentAt: new Date().toISOString()
    }
    const updated = [newInvite, ...invites]
    saveInvites(updated)
    setShowSendModal(false)
  }

  const updateStatus = (id, status) => {
    const updated = invites.map(invite =>
      invite.id === id ? { ...invite, status } : invite
    )
    saveInvites(updated)
  }

  const deleteInvite = (id) => {
    const updated = invites.filter(invite => invite.id !== id)
    saveInvites(updated)
  }

  const getInvitesByStatus = (status) => invites.filter(i => i.status === status)

  return (
    <div className="collab-container">
      <div className="collab-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>👥 Collaboration Invites</h1>
        <button className="send-invite-btn" onClick={() => setShowSendModal(true)}>
          + Send Invite
        </button>
      </div>

      <div className="stats-bar">
        <div className="stat">Pending: {getInvitesByStatus('pending').length}</div>
        <div className="stat">Accepted: {getInvitesByStatus('accepted').length}</div>
        <div className="stat">Declined: {getInvitesByStatus('declined').length}</div>
      </div>

      {invites.length === 0 ? (
        <div className="empty-state">
          <h2>No invites yet</h2>
          <p>Send your first collaboration invite!</p>
        </div>
      ) : (
        <div className="invites-list">
          {invites.map(invite => (
            <div key={invite.id} className={`invite-card ${invite.status}`}>
              <div className="invite-header">
                <h3>{invite.collaboratorName}</h3>
                <span className={`status-badge ${invite.status}`}>{invite.status}</span>
              </div>
              <p><strong>Project:</strong> {invite.projectName}</p>
              <p><strong>Role:</strong> {invite.role}</p>
              <p className="message">{invite.message}</p>
              <div className="invite-actions">
                {invite.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(invite.id, 'accepted')}>Accept</button>
                    <button onClick={() => updateStatus(invite.id, 'declined')}>Decline</button>
                  </>
                )}
                <button onClick={() => deleteInvite(invite.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSendModal && (
        <SendInviteModal onSend={sendInvite} onCancel={() => setShowSendModal(false)} />
      )}
    </div>
  )
}

const SendInviteModal = ({ onSend, onCancel }) => {
  const [formData, setFormData] = useState({
    collaboratorName: '',
    projectName: '',
    role: '',
    message: ''
  })

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Send Collaboration Invite</h2>
        <form onSubmit={e => { e.preventDefault(); onSend(formData); }}>
          <div className="form-group">
            <label>Collaborator Name *</label>
            <input
              type="text"
              value={formData.collaboratorName}
              onChange={e => setFormData({...formData, collaboratorName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={e => setFormData({...formData, projectName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              required
              placeholder="e.g., Developer, Designer"
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              rows="4"
              placeholder="Invitation message..."
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="send-btn">Send</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CollaborationInvites
