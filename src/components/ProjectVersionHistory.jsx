import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProjectVersionHistory.css'

const ProjectVersionHistory = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  const defaultProjects = [
    {
      id: 1,
      name: 'Creative App',
      versions: [
        { id: 1, version: 'v1.0', date: '2025-01-15', changes: 'Initial release with core features', snapshot: {} },
        { id: 2, version: 'v1.1', date: '2025-01-20', changes: 'Added user authentication', snapshot: {} },
        { id: 3, version: 'v2.0', date: '2025-01-25', changes: 'Complete UI redesign', snapshot: {} }
      ]
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('gmax_project_versions')
    const data = saved ? JSON.parse(saved) : defaultProjects
    setProjects(data)
    if (data.length > 0) setSelectedProject(data[0].id)
  }, [])

  const currentProject = projects.find(p => p.id === selectedProject)

  return (
    <div className="versions-container">
      <div className="versions-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📚 Version History</h1>
      </div>

      <div className="project-selector">
        {projects.map(p => (
          <button
            key={p.id}
            className={selectedProject === p.id ? 'active' : ''}
            onClick={() => setSelectedProject(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      {currentProject && (
        <div className="timeline">
          {currentProject.versions.map((v, i) => (
            <div key={v.id} className="version-item">
              <div className="version-marker">{i + 1}</div>
              <div className="version-content">
                <h3>{v.version}</h3>
                <p className="date">{new Date(v.date).toLocaleDateString()}</p>
                <p>{v.changes}</p>
                <button className="restore-btn">Restore</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectVersionHistory
