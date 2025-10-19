import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/PortfolioShowcase.css'

const PortfolioShowcase = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'art',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    featured: false
  })

  const categories = ['art', 'code', 'writing', 'music', 'games', 'design']

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const saved = localStorage.getItem('gmax_portfolio_projects')
    if (saved) {
      setProjects(JSON.parse(saved))
    } else {
      const mockProjects = [
        {
          id: 1,
          title: 'Digital Landscape',
          description: 'A vibrant digital painting exploring nature themes',
          category: 'art',
          imageUrl: '🎨',
          featured: true,
          date: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          title: 'Task Manager App',
          description: 'Full-stack productivity app with React and Node.js',
          category: 'code',
          imageUrl: '💻',
          githubUrl: 'https://github.com/example/task-manager',
          featured: true,
          date: new Date('2024-02-01').toISOString()
        },
        {
          id: 3,
          title: 'Short Story Collection',
          description: 'A series of interconnected short stories',
          category: 'writing',
          imageUrl: '📚',
          featured: false,
          date: new Date('2024-01-20').toISOString()
        }
      ]
      setProjects(mockProjects)
      localStorage.setItem('gmax_portfolio_projects', JSON.stringify(mockProjects))
    }
  }

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project)
      setFormData(project)
    } else {
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        category: 'art',
        imageUrl: '',
        demoUrl: '',
        githubUrl: '',
        featured: false
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProject(null)
  }

  const saveProject = () => {
    if (!formData.title || !formData.description) return

    let updated
    if (editingProject) {
      updated = projects.map(p => p.id === editingProject.id ? { ...formData, id: p.id, date: p.date } : p)
    } else {
      const newProject = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString()
      }
      updated = [newProject, ...projects]
    }

    setProjects(updated)
    localStorage.setItem('gmax_portfolio_projects', JSON.stringify(updated))
    closeModal()
  }

  const deleteProject = (id) => {
    if (!confirm('Delete this project?')) return
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    localStorage.setItem('gmax_portfolio_projects', JSON.stringify(updated))
  }

  const featuredProjects = projects.filter(p => p.featured)
  const regularProjects = projects.filter(p => !p.featured)

  return (
    <div className="portfolio-showcase-container">
      <div className="portfolio-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎭 Portfolio Showcase</h1>
        <button className="add-project-btn" onClick={() => openModal()}>+ Add Project</button>
      </div>

      {featuredProjects.length > 0 && (
        <section className="featured-section">
          <h2>⭐ Featured Projects</h2>
          <div className="featured-grid">
            {featuredProjects.map(project => (
              <div key={project.id} className="project-card featured">
                <div className="project-icon">{project.imageUrl || '📁'}</div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span className="category-badge">{project.category}</span>
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">🔗 GitHub</a>}
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">🚀 Demo</a>}
                  </div>
                </div>
                <div className="project-actions">
                  <button onClick={() => openModal(project)}>✏️</button>
                  <button onClick={() => deleteProject(project.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="all-projects-section">
        <h2>All Projects</h2>
        <div className="projects-grid">
          {regularProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-icon">{project.imageUrl || '📁'}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span className="category-badge">{project.category}</span>
              </div>
              <div className="project-actions">
                <button onClick={() => openModal(project)}>✏️</button>
                <button onClick={() => deleteProject(project.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Icon/Emoji</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="🎨"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Demo URL (optional)</label>
              <input
                type="text"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>GitHub URL (optional)</label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Feature this project
              </label>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={saveProject}>
                {editingProject ? 'Update' : 'Add'} Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioShowcase
