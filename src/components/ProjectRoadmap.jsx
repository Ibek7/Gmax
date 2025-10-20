import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProjectRoadmap.css'

const ProjectRoadmap = () => {
  const navigate = useNavigate()
  const [roadmaps, setRoadmaps] = useState([])
  const [selectedRoadmap, setSelectedRoadmap] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [viewMode, setViewMode] = useState('timeline') // 'timeline' or 'list'

  useEffect(() => {
    loadRoadmaps()
  }, [])

  const loadRoadmaps = () => {
    const saved = localStorage.getItem('gmax_project_roadmaps')
    if (saved) {
      const loaded = JSON.parse(saved)
      setRoadmaps(loaded)
      if (loaded.length > 0) {
        setSelectedRoadmap(loaded[0])
      }
    } else {
      // Add sample roadmap
      const sample = {
        id: Date.now(),
        name: 'Launch Creative App',
        description: 'Build and launch a creative productivity app',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        milestones: [
          {
            id: 1,
            title: 'Research & Planning',
            description: 'Define features and user needs',
            startDate: '2025-01-01',
            endDate: '2025-02-15',
            status: 'completed',
            progress: 100
          },
          {
            id: 2,
            title: 'Design Phase',
            description: 'Create wireframes and mockups',
            startDate: '2025-02-16',
            endDate: '2025-04-30',
            status: 'in-progress',
            progress: 60
          },
          {
            id: 3,
            title: 'Development',
            description: 'Build core features',
            startDate: '2025-05-01',
            endDate: '2025-09-30',
            status: 'pending',
            progress: 0
          },
          {
            id: 4,
            title: 'Testing & QA',
            description: 'Quality assurance and bug fixes',
            startDate: '2025-10-01',
            endDate: '2025-11-15',
            status: 'pending',
            progress: 0
          },
          {
            id: 5,
            title: 'Launch',
            description: 'Public release and marketing',
            startDate: '2025-11-16',
            endDate: '2025-12-31',
            status: 'pending',
            progress: 0
          }
        ]
      }
      setRoadmaps([sample])
      setSelectedRoadmap(sample)
      localStorage.setItem('gmax_project_roadmaps', JSON.stringify([sample]))
    }
  }

  const saveRoadmaps = (updated) => {
    setRoadmaps(updated)
    localStorage.setItem('gmax_project_roadmaps', JSON.stringify(updated))
  }

  const addRoadmap = (roadmap) => {
    const newRoadmap = {
      ...roadmap,
      id: Date.now(),
      milestones: []
    }
    const updated = [...roadmaps, newRoadmap]
    saveRoadmaps(updated)
    setSelectedRoadmap(newRoadmap)
    setShowAddModal(false)
  }

  const addMilestone = (milestone) => {
    const newMilestone = {
      ...milestone,
      id: Date.now(),
      status: 'pending',
      progress: 0
    }
    
    const updated = roadmaps.map(r => 
      r.id === selectedRoadmap.id 
        ? { ...r, milestones: [...r.milestones, newMilestone] }
        : r
    )
    
    saveRoadmaps(updated)
    setSelectedRoadmap(updated.find(r => r.id === selectedRoadmap.id))
    setShowMilestoneModal(false)
  }

  const updateMilestoneProgress = (milestoneId, progress) => {
    const updated = roadmaps.map(r => 
      r.id === selectedRoadmap.id 
        ? {
            ...r,
            milestones: r.milestones.map(m =>
              m.id === milestoneId
                ? { 
                    ...m, 
                    progress,
                    status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending'
                  }
                : m
            )
          }
        : r
    )
    
    saveRoadmaps(updated)
    setSelectedRoadmap(updated.find(r => r.id === selectedRoadmap.id))
  }

  const deleteMilestone = (milestoneId) => {
    const updated = roadmaps.map(r =>
      r.id === selectedRoadmap.id
        ? { ...r, milestones: r.milestones.filter(m => m.id !== milestoneId) }
        : r
    )
    
    saveRoadmaps(updated)
    setSelectedRoadmap(updated.find(r => r.id === selectedRoadmap.id))
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#2ecc71'
      case 'in-progress': return '#f39c12'
      case 'pending': return '#95a5a6'
      default: return '#95a5a6'
    }
  }

  const calculateOverallProgress = () => {
    if (!selectedRoadmap || selectedRoadmap.milestones.length === 0) return 0
    const total = selectedRoadmap.milestones.reduce((sum, m) => sum + m.progress, 0)
    return Math.round(total / selectedRoadmap.milestones.length)
  }

  const getTimelinePercentage = (milestone) => {
    if (!selectedRoadmap) return { left: 0, width: 0 }
    
    const roadmapStart = new Date(selectedRoadmap.startDate).getTime()
    const roadmapEnd = new Date(selectedRoadmap.endDate).getTime()
    const milestoneStart = new Date(milestone.startDate).getTime()
    const milestoneEnd = new Date(milestone.endDate).getTime()
    
    const totalDuration = roadmapEnd - roadmapStart
    const left = ((milestoneStart - roadmapStart) / totalDuration) * 100
    const width = ((milestoneEnd - milestoneStart) / totalDuration) * 100
    
    return { left: Math.max(0, left), width: Math.max(5, width) }
  }

  return (
    <div className="project-roadmap-container">
      <div className="roadmap-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🗺️ Project Roadmap Planner</h1>
        <button className="add-roadmap-btn" onClick={() => setShowAddModal(true)}>
          + New Roadmap
        </button>
      </div>

      {roadmaps.length > 0 && (
        <>
          {/* Roadmap Selector */}
          <div className="roadmap-selector">
            {roadmaps.map(roadmap => (
              <button
                key={roadmap.id}
                className={selectedRoadmap?.id === roadmap.id ? 'active' : ''}
                onClick={() => setSelectedRoadmap(roadmap)}
              >
                {roadmap.name}
              </button>
            ))}
          </div>

          {selectedRoadmap && (
            <>
              {/* Roadmap Info */}
              <div className="roadmap-info">
                <div className="info-header">
                  <div>
                    <h2>{selectedRoadmap.name}</h2>
                    <p>{selectedRoadmap.description}</p>
                    <div className="date-range">
                      {new Date(selectedRoadmap.startDate).toLocaleDateString()} - {new Date(selectedRoadmap.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="overall-progress">
                    <div className="progress-circle">
                      <svg width="120" height="120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="#667eea"
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 50}
                          strokeDashoffset={2 * Math.PI * 50 * (1 - calculateOverallProgress() / 100)}
                          transform="rotate(-90 60 60)"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="progress-text">{calculateOverallProgress()}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="view-controls">
                <button
                  className={viewMode === 'timeline' ? 'active' : ''}
                  onClick={() => setViewMode('timeline')}
                >
                  📊 Timeline View
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  📋 List View
                </button>
                <button className="add-milestone-btn" onClick={() => setShowMilestoneModal(true)}>
                  + Add Milestone
                </button>
              </div>

              {/* Timeline View */}
              {viewMode === 'timeline' && selectedRoadmap.milestones.length > 0 && (
                <div className="timeline-view">
                  <div className="timeline-container">
                    {selectedRoadmap.milestones.map(milestone => {
                      const pos = getTimelinePercentage(milestone)
                      return (
                        <div
                          key={milestone.id}
                          className="timeline-milestone"
                          style={{
                            left: `${pos.left}%`,
                            width: `${pos.width}%`,
                            background: getStatusColor(milestone.status)
                          }}
                        >
                          <div className="milestone-label">{milestone.title}</div>
                          <div className="milestone-progress-bar">
                            <div 
                              className="milestone-progress-fill"
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="milestones-list">
                  {selectedRoadmap.milestones.length === 0 ? (
                    <div className="empty-state">
                      <p>No milestones yet. Add your first milestone to get started!</p>
                    </div>
                  ) : (
                    selectedRoadmap.milestones.map(milestone => (
                      <div key={milestone.id} className="milestone-card">
                        <div className="milestone-header">
                          <div className="milestone-title-section">
                            <h3>{milestone.title}</h3>
                            <span 
                              className="status-badge"
                              style={{ background: getStatusColor(milestone.status) }}
                            >
                              {milestone.status}
                            </span>
                          </div>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteMilestone(milestone.id)}
                          >
                            🗑️
                          </button>
                        </div>
                        <p className="milestone-description">{milestone.description}</p>
                        <div className="milestone-dates">
                          📅 {new Date(milestone.startDate).toLocaleDateString()} - {new Date(milestone.endDate).toLocaleDateString()}
                        </div>
                        <div className="progress-section">
                          <div className="progress-header">
                            <span>Progress</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={milestone.progress}
                            onChange={(e) => updateMilestoneProgress(milestone.id, parseInt(e.target.value))}
                            className="progress-slider"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {roadmaps.length === 0 && (
        <div className="empty-state">
          <h2>No roadmaps yet</h2>
          <p>Create your first project roadmap to start planning!</p>
        </div>
      )}

      {/* Add Roadmap Modal */}
      {showAddModal && (
        <RoadmapModal
          onSave={addRoadmap}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Add Milestone Modal */}
      {showMilestoneModal && (
        <MilestoneModal
          onSave={addMilestone}
          onCancel={() => setShowMilestoneModal(false)}
          roadmapDates={{
            start: selectedRoadmap.startDate,
            end: selectedRoadmap.endDate
          }}
        />
      )}
    </div>
  )
}

const RoadmapModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create New Roadmap</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Create Roadmap</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const MilestoneModal = ({ onSave, onCancel, roadmapDates }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: roadmapDates.start,
    endDate: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add Milestone</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Milestone Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows="2"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                min={roadmapDates.start}
                max={roadmapDates.end}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
                min={roadmapDates.start}
                max={roadmapDates.end}
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Add Milestone</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectRoadmap
