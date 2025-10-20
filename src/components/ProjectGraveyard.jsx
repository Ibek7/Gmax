import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProjectGraveyard.css'

const ProjectGraveyard = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [newProject, setNewProject] = useState({
    title: '',
    startDate: '',
    endDate: '',
    reason: '',
    lessonsLearned: '',
    revivalPotential: 'low'
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const saved = localStorage.getItem('gmax_project_graveyard')
    if (saved) {
      setProjects(JSON.parse(saved))
    } else {
      const mockProjects = [
        {
          id: 1,
          title: 'Untitled Novel Project',
          startDate: '2024-01-15',
          endDate: '2024-03-20',
          reason: 'Lost motivation after chapter 5',
          lessonsLearned: 'Need better outlining before starting. Plot holes caught up with me.',
          revivalPotential: 'medium',
          archived: new Date('2024-03-20').toISOString()
        },
        {
          id: 2,
          title: 'Mobile Game Prototype',
          startDate: '2023-11-01',
          endDate: '2024-01-10',
          reason: 'Scope was too ambitious for solo dev',
          lessonsLearned: 'Start smaller. Build MVPs first. Learned a lot about game engines.',
          revivalPotential: 'high',
          archived: new Date('2024-01-10').toISOString()
        }
      ]
      setProjects(mockProjects)
      localStorage.setItem('gmax_project_graveyard', JSON.stringify(mockProjects))
    }
  }

  const archiveProject = () => {
    if (!newProject.title || !newProject.reason) return

    const project = {
      ...newProject,
      id: Date.now(),
      archived: new Date().toISOString()
    }

    const updated = [project, ...projects]
    setProjects(updated)
    localStorage.setItem('gmax_project_graveyard', JSON.stringify(updated))
    setShowModal(false)
    setNewProject({
      title: '',
      startDate: '',
      endDate: '',
      reason: '',
      lessonsLearned: '',
      revivalPotential: 'low'
    })
  }

  const deleteProject = (id) => {
    if (!confirm('Permanently delete this project from the graveyard?')) return
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    localStorage.setItem('gmax_project_graveyard', JSON.stringify(updated))
  }

  const reviveProject = (project) => {
    alert(`💡 Revival idea logged! Consider starting "${project.title}" again with your new insights.`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getPotentialColor = (potential) => {
    const colors = {
      low: '#6c757d',
      medium: '#ffc107',
      high: '#28a745'
    }
    return colors[potential] || colors.low
  }

  return (
    <div className="project-graveyard-container">
      <div className="graveyard-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⚰️ Project Graveyard</h1>
        <button className="archive-btn" onClick={() => setShowModal(true)}>
          + Archive Project
        </button>
      </div>

      <div className="graveyard-intro">
        <p>Honor your abandoned projects. Learn from them. Maybe revive them someday.</p>
        <div className="stats-summary">
          <div className="stat">
            <span className="stat-value">{projects.length}</span>
            <span className="stat-label">Resting Projects</span>
          </div>
          <div className="stat">
            <span className="stat-value">{projects.filter(p => p.revivalPotential === 'high').length}</span>
            <span className="stat-label">Revival Candidates</span>
          </div>
        </div>
      </div>

      <div className="graveyard-grid">
        {projects.length === 0 ? (
          <div className="empty-graveyard">
            <p>No archived projects yet. (That's okay - maybe you finish everything!)</p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="tombstone">
              <div className="tombstone-header">
                <span className="rip">R.I.P.</span>
                <button className="delete-tomb-btn" onClick={() => deleteProject(project.id)}>×</button>
              </div>
              <h3 className="project-title">{project.title}</h3>
              <div className="project-dates">
                {formatDate(project.startDate)} — {formatDate(project.endDate)}
              </div>
              <div className="revival-badge" style={{ background: getPotentialColor(project.revivalPotential) }}>
                {project.revivalPotential.toUpperCase()} Revival Potential
              </div>
              <button 
                className="view-autopsy-btn"
                onClick={() => setSelectedProject(project)}
              >
                📋 View Autopsy
              </button>
              {project.revivalPotential === 'high' && (
                <button 
                  className="revive-btn"
                  onClick={() => reviveProject(project)}
                >
                  💡 Consider Revival
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Archive a Project</h2>
            <p className="modal-subtitle">Give your abandoned project a proper burial with lessons learned.</p>
            
            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="My ambitious project..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Started</label>
                <input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ended</label>
                <input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Why did it end?</label>
              <textarea
                value={newProject.reason}
                onChange={(e) => setNewProject({ ...newProject, reason: e.target.value })}
                placeholder="Lost motivation, too ambitious, priorities changed..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Lessons Learned</label>
              <textarea
                value={newProject.lessonsLearned}
                onChange={(e) => setNewProject({ ...newProject, lessonsLearned: e.target.value })}
                placeholder="What did you learn from this experience?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Revival Potential</label>
              <select
                value={newProject.revivalPotential}
                onChange={(e) => setNewProject({ ...newProject, revivalPotential: e.target.value })}
              >
                <option value="low">Low - Let it rest</option>
                <option value="medium">Medium - Maybe someday</option>
                <option value="high">High - Worth revisiting</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save-btn" onClick={archiveProject}>Archive Project</button>
            </div>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content autopsy-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Project Autopsy: {selectedProject.title}</h2>
            
            <div className="autopsy-section">
              <h3>📅 Timeline</h3>
              <p>{formatDate(selectedProject.startDate)} to {formatDate(selectedProject.endDate)}</p>
            </div>

            <div className="autopsy-section">
              <h3>💔 Cause of Death</h3>
              <p>{selectedProject.reason}</p>
            </div>

            <div className="autopsy-section">
              <h3>📚 Lessons Learned</h3>
              <p>{selectedProject.lessonsLearned || 'No lessons recorded.'}</p>
            </div>

            <div className="autopsy-section">
              <h3>🔮 Revival Potential</h3>
              <p style={{ color: getPotentialColor(selectedProject.revivalPotential), fontWeight: 'bold' }}>
                {selectedProject.revivalPotential.toUpperCase()}
              </p>
            </div>

            <button className="close-btn" onClick={() => setSelectedProject(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectGraveyard
