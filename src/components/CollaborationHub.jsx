import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CollaborationHub.css'

const CollaborationHub = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [shareEmail, setShareEmail] = useState('')

  const mockProjects = [
    {
      id: 1,
      name: 'Fantasy Novel - Chapter 3',
      type: 'writing',
      owner: 'You',
      collaborators: ['Alice', 'Bob'],
      lastUpdated: Date.now() - 3600000,
      comments: [
        { id: 1, author: 'Alice', text: 'Love the character development in this section!', timestamp: Date.now() - 7200000 },
        { id: 2, author: 'You', text: 'Thanks! Working on the dialogue next.', timestamp: Date.now() - 5400000 }
      ],
      status: 'active'
    },
    {
      id: 2,
      name: 'Portfolio Website Design',
      type: 'code',
      owner: 'You',
      collaborators: ['Charlie'],
      lastUpdated: Date.now() - 7200000,
      comments: [
        { id: 1, author: 'Charlie', text: 'The color scheme looks great!', timestamp: Date.now() - 10800000 }
      ],
      status: 'active'
    },
    {
      id: 3,
      name: 'Digital Art Series',
      type: 'art',
      owner: 'Alice',
      collaborators: ['You', 'Diana'],
      lastUpdated: Date.now() - 14400000,
      comments: [],
      status: 'active'
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('gmax_collaboration_projects')
    if (saved) {
      setProjects(JSON.parse(saved))
    } else {
      setProjects(mockProjects)
      localStorage.setItem('gmax_collaboration_projects', JSON.stringify(mockProjects))
    }
  }, [])

  const addComment = () => {
    if (!newComment.trim() || !selectedProject) return

    const comment = {
      id: Date.now(),
      author: 'You',
      text: newComment,
      timestamp: Date.now()
    }

    const updated = projects.map(p =>
      p.id === selectedProject.id
        ? { ...p, comments: [...p.comments, comment], lastUpdated: Date.now() }
        : p
    )

    setProjects(updated)
    localStorage.setItem('gmax_collaboration_projects', JSON.stringify(updated))
    setSelectedProject({ ...selectedProject, comments: [...selectedProject.comments, comment] })
    setNewComment('')
  }

  const shareProject = () => {
    if (!shareEmail.trim()) return
    alert(`Invitation sent to ${shareEmail}! 📧`)
    setShareEmail('')
    setShowShareModal(false)
  }

  const getTypeIcon = (type) => {
    const icons = {
      writing: '✍️',
      code: '💻',
      art: '🎨',
      music: '🎵',
      games: '🎮'
    }
    return icons[type] || '📁'
  }

  const getRelativeTime = (timestamp) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="collaboration-hub-container">
      <div className="hub-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>👥 Collaboration Hub</h1>
        <button className="new-project-btn" onClick={() => alert('Create new collaborative project!')}>
          + New Project
        </button>
      </div>

      {showShareModal && (
        <div className="share-modal" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Share Project</h2>
            <div className="form-group">
              <label>Collaborator Email</label>
              <input
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="colleague@example.com"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowShareModal(false)}>
                Cancel
              </button>
              <button className="send-btn" onClick={shareProject}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hub-content">
        <div className="projects-list">
          <h3>Active Projects</h3>
          {projects.map(project => (
            <div
              key={project.id}
              className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-icon">{getTypeIcon(project.type)}</div>
              <div className="project-info">
                <h4>{project.name}</h4>
                <div className="project-meta">
                  <span className="owner">👤 {project.owner}</span>
                  <span className="collaborators">
                    👥 {project.collaborators.length} collaborators
                  </span>
                </div>
                <span className="last-updated">{getRelativeTime(project.lastUpdated)}</span>
              </div>
              {project.comments.length > 0 && (
                <span className="comment-badge">{project.comments.length}</span>
              )}
            </div>
          ))}
        </div>

        <div className="project-details">
          {selectedProject ? (
            <>
              <div className="details-header">
                <div>
                  <h2>{selectedProject.name}</h2>
                  <div className="project-tags">
                    <span className="type-tag">{getTypeIcon(selectedProject.type)} {selectedProject.type}</span>
                    <span className="status-tag">🟢 {selectedProject.status}</span>
                  </div>
                </div>
                <button className="share-btn" onClick={() => setShowShareModal(true)}>
                  📤 Share
                </button>
              </div>

              <div className="collaborators-section">
                <h3>Collaborators</h3>
                <div className="collaborators-list">
                  <div className="collaborator-chip owner">
                    👤 {selectedProject.owner} (Owner)
                  </div>
                  {selectedProject.collaborators.map((collab, i) => (
                    <div key={i} className="collaborator-chip">
                      👤 {collab}
                    </div>
                  ))}
                </div>
              </div>

              <div className="comments-section">
                <h3>Discussion ({selectedProject.comments.length})</h3>
                <div className="comments-list">
                  {selectedProject.comments.length === 0 ? (
                    <div className="no-comments">
                      <span>💬</span>
                      <p>No comments yet. Start the conversation!</p>
                    </div>
                  ) : (
                    selectedProject.comments.map(comment => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">👤 {comment.author}</span>
                          <span className="comment-time">{getRelativeTime(comment.timestamp)}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="comment-input">
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="3"
                  />
                  <button onClick={addComment} disabled={!newComment.trim()}>
                    💬 Comment
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <span className="no-selection-icon">👥</span>
              <p>Select a project to view details and collaborate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollaborationHub
