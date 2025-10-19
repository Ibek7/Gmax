import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProjectTimeline.css'

const ProjectTimeline = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [newProject, setNewProject] = useState({
    name: '',
    category: 'writing',
    startDate: '',
    endDate: '',
    status: 'planning',
    progress: 0,
    milestones: []
  })
  const [newMilestone, setNewMilestone] = useState('')

  const categories = [
    { id: 'writing', name: 'Writing', icon: '✍️', color: '#667eea' },
    { id: 'art', name: 'Art', icon: '🎨', color: '#f093fb' },
    { id: 'music', name: 'Music', icon: '🎵', color: '#4facfe' },
    { id: 'code', name: 'Code', icon: '💻', color: '#43e97b' },
    { id: 'games', name: 'Games', icon: '🎮', color: '#fa709a' }
  ]

  const statuses = [
    { id: 'planning', name: 'Planning', icon: '📋' },
    { id: 'in-progress', name: 'In Progress', icon: '🚀' },
    { id: 'paused', name: 'Paused', icon: '⏸️' },
    { id: 'completed', name: 'Completed', icon: '✅' }
  ]

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const saved = localStorage.getItem('gmax_project_timeline')
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }

  const saveProjects = (updatedProjects) => {
    localStorage.setItem('gmax_project_timeline', JSON.stringify(updatedProjects))
    setProjects(updatedProjects)
  }

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project.id)
      setNewProject(project)
    } else {
      setEditingProject(null)
      setNewProject({
        name: '',
        category: 'writing',
        startDate: '',
        endDate: '',
        status: 'planning',
        progress: 0,
        milestones: []
      })
    }
    setShowModal(true)
  }

  const saveProject = () => {
    if (!newProject.name || !newProject.startDate) {
      alert('Please provide at least a name and start date')
      return
    }

    if (editingProject) {
      saveProjects(projects.map(p => p.id === editingProject ? newProject : p))
    } else {
      const project = { ...newProject, id: Date.now() }
      saveProjects([...projects, project])
    }

    setShowModal(false)
  }

  const deleteProject = (id) => {
    if (window.confirm('Delete this project?')) {
      saveProjects(projects.filter(p => p.id !== id))
    }
  }

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setNewProject({
        ...newProject,
        milestones: [...newProject.milestones, { text: newMilestone, completed: false }]
      })
      setNewMilestone('')
    }
  }

  const toggleMilestone = (projectId, milestoneIndex) => {
    saveProjects(projects.map(p => {
      if (p.id === projectId) {
        const milestones = [...p.milestones]
        milestones[milestoneIndex] = {
          ...milestones[milestoneIndex],
          completed: !milestones[milestoneIndex].completed
        }
        return { ...p, milestones }
      }
      return p
    }))
  }

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0]
  }

  const getStatusInfo = (statusId) => {
    return statuses.find(s => s.id === statusId) || statuses[0]
  }

  const sortedProjects = [...projects].sort((a, b) => {
    const order = { 'in-progress': 0, 'planning': 1, 'paused': 2, 'completed': 3 }
    return (order[a.status] || 0) - (order[b.status] || 0)
  })

  return (
    <div className="project-timeline-container">
      <div className="timeline-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>📅 Project Timeline</h1>
        <button className="add-project-btn" onClick={() => openModal()}>
          + New Project
        </button>
      </div>

      {showModal && (
        <div className="project-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>

            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="My Awesome Project"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                >
                  {statuses.map(stat => (
                    <option key={stat.id} value={stat.id}>
                      {stat.icon} {stat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Progress: {newProject.progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newProject.progress}
                onChange={(e) => setNewProject({...newProject, progress: parseInt(e.target.value)})}
              />
            </div>

            <div className="form-group">
              <label>Milestones</label>
              <div className="milestone-input">
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Add a milestone..."
                  onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                />
                <button onClick={addMilestone}>+ Add</button>
              </div>
              <div className="milestones-list">
                {newProject.milestones.map((m, i) => (
                  <div key={i} className="milestone-item">
                    <span>{m.text}</span>
                    <button onClick={() => setNewProject({
                      ...newProject,
                      milestones: newProject.milestones.filter((_, idx) => idx !== i)
                    })}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveProject}>
                {editingProject ? 'Update' : 'Create'} Project
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="timeline-content">
        {sortedProjects.length === 0 ? (
          <div className="no-projects">
            <span className="no-projects-icon">📅</span>
            <p>No projects yet</p>
            <p className="hint">Create your first project to start tracking!</p>
          </div>
        ) : (
          <div className="timeline-grid">
            {sortedProjects.map(project => {
              const catInfo = getCategoryInfo(project.category)
              const statusInfo = getStatusInfo(project.status)
              
              return (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <div className="project-badges">
                      <span 
                        className="category-badge"
                        style={{ background: catInfo.color }}
                      >
                        {catInfo.icon} {catInfo.name}
                      </span>
                      <span className="status-badge">
                        {statusInfo.icon} {statusInfo.name}
                      </span>
                    </div>
                    <div className="project-actions">
                      <button onClick={() => openModal(project)}>✏️</button>
                      <button onClick={() => deleteProject(project.id)}>🗑️</button>
                    </div>
                  </div>

                  <h3 className="project-name">{project.name}</h3>

                  <div className="project-dates">
                    <span>📅 {new Date(project.startDate).toLocaleDateString()}</span>
                    {project.endDate && (
                      <span>→ {new Date(project.endDate).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className="progress-section">
                    <div className="progress-label">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${project.progress}%`,
                          background: catInfo.color
                        }}
                      />
                    </div>
                  </div>

                  {project.milestones && project.milestones.length > 0 && (
                    <div className="project-milestones">
                      <h4>Milestones</h4>
                      {project.milestones.map((milestone, index) => (
                        <div key={index} className="milestone-check">
                          <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={() => toggleMilestone(project.id, index)}
                          />
                          <span className={milestone.completed ? 'completed' : ''}>
                            {milestone.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectTimeline
