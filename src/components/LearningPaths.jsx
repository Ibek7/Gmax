import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LearningPaths.css'

const LearningPaths = () => {
  const navigate = useNavigate()
  const [paths, setPaths] = useState([])
  const [selectedPath, setSelectedPath] = useState(null)

  const learningPaths = [
    {
      id: 1,
      title: 'Creative Writing Mastery',
      icon: '✍️',
      color: '#667eea',
      description: 'From beginner to published author',
      progress: 0,
      modules: [
        { id: 1, title: 'Fundamentals of Storytelling', duration: '2 weeks', completed: false },
        { id: 2, title: 'Character Development', duration: '3 weeks', completed: false },
        { id: 3, title: 'Plot Structure & Pacing', duration: '2 weeks', completed: false },
        { id: 4, title: 'Dialogue Writing', duration: '2 weeks', completed: false },
        { id: 5, title: 'Editing & Revision', duration: '3 weeks', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Digital Art Fundamentals',
      icon: '🎨',
      color: '#f093fb',
      description: 'Master digital painting and illustration',
      progress: 0,
      modules: [
        { id: 1, title: 'Drawing Basics', duration: '4 weeks', completed: false },
        { id: 2, title: 'Color Theory', duration: '2 weeks', completed: false },
        { id: 3, title: 'Digital Tools Mastery', duration: '3 weeks', completed: false },
        { id: 4, title: 'Character Design', duration: '4 weeks', completed: false },
        { id: 5, title: 'Portfolio Development', duration: '2 weeks', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Music Production',
      icon: '🎵',
      color: '#4facfe',
      description: 'Create and produce professional music',
      progress: 0,
      modules: [
        { id: 1, title: 'Music Theory Basics', duration: '3 weeks', completed: false },
        { id: 2, title: 'DAW Fundamentals', duration: '2 weeks', completed: false },
        { id: 3, title: 'Sound Design', duration: '3 weeks', completed: false },
        { id: 4, title: 'Mixing & Mastering', duration: '4 weeks', completed: false },
        { id: 5, title: 'Releasing Your Music', duration: '1 week', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Full-Stack Development',
      icon: '💻',
      color: '#43e97b',
      description: 'Build modern web applications',
      progress: 0,
      modules: [
        { id: 1, title: 'HTML, CSS, JavaScript', duration: '4 weeks', completed: false },
        { id: 2, title: 'React & Modern Frontend', duration: '5 weeks', completed: false },
        { id: 3, title: 'Backend with Node.js', duration: '4 weeks', completed: false },
        { id: 4, title: 'Databases & APIs', duration: '3 weeks', completed: false },
        { id: 5, title: 'Deployment & DevOps', duration: '2 weeks', completed: false }
      ]
    },
    {
      id: 5,
      title: 'Game Design Principles',
      icon: '🎮',
      color: '#fa709a',
      description: 'Design engaging game experiences',
      progress: 0,
      modules: [
        { id: 1, title: 'Game Mechanics', duration: '3 weeks', completed: false },
        { id: 2, title: 'Level Design', duration: '4 weeks', completed: false },
        { id: 3, title: 'Player Psychology', duration: '2 weeks', completed: false },
        { id: 4, title: 'Prototyping', duration: '3 weeks', completed: false },
        { id: 5, title: 'Playtesting & Iteration', duration: '2 weeks', completed: false }
      ]
    }
  ]

  useEffect(() => {
    loadPaths()
  }, [])

  const loadPaths = () => {
    const saved = localStorage.getItem('gmax_learning_paths')
    if (saved) {
      setPaths(JSON.parse(saved))
    } else {
      setPaths(learningPaths)
      localStorage.setItem('gmax_learning_paths', JSON.stringify(learningPaths))
    }
  }

  const toggleModule = (pathId, moduleId) => {
    const updated = paths.map(path => {
      if (path.id === pathId) {
        const modules = path.modules.map(m =>
          m.id === moduleId ? { ...m, completed: !m.completed } : m
        )
        const completedCount = modules.filter(m => m.completed).length
        const progress = Math.round((completedCount / modules.length) * 100)
        return { ...path, modules, progress }
      }
      return path
    })
    setPaths(updated)
    localStorage.setItem('gmax_learning_paths', JSON.stringify(updated))
  }

  return (
    <div className="learning-paths-container">
      <div className="paths-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>🎓 Learning Paths</h1>
      </div>

      {!selectedPath ? (
        <div className="paths-grid">
          {paths.map(path => (
            <div
              key={path.id}
              className="path-card"
              style={{ borderTop: `4px solid ${path.color}` }}
              onClick={() => setSelectedPath(path)}
            >
              <div className="path-icon" style={{ background: `${path.color}20` }}>
                {path.icon}
              </div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <div className="path-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${path.progress}%`, background: path.color }}
                  />
                </div>
                <span className="progress-text">{path.progress}% Complete</span>
              </div>
              <div className="path-stats">
                <span>{path.modules.length} modules</span>
                <span>{path.modules.filter(m => m.completed).length} completed</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="path-details">
          <button className="back-to-paths-btn" onClick={() => setSelectedPath(null)}>
            ← All Paths
          </button>
          
          <div className="path-header-detail" style={{ borderLeft: `5px solid ${selectedPath.color}` }}>
            <div className="path-icon-large" style={{ background: `${selectedPath.color}20` }}>
              {selectedPath.icon}
            </div>
            <div>
              <h2>{selectedPath.title}</h2>
              <p>{selectedPath.description}</p>
              <div className="progress-indicator">
                <div className="progress-bar-large">
                  <div
                    className="progress-fill"
                    style={{ width: `${selectedPath.progress}%`, background: selectedPath.color }}
                  />
                </div>
                <span>{selectedPath.progress}% Complete</span>
              </div>
            </div>
          </div>

          <div className="modules-list">
            {selectedPath.modules.map((module, index) => (
              <div
                key={module.id}
                className={`module-item ${module.completed ? 'completed' : ''}`}
              >
                <div className="module-number">{index + 1}</div>
                <div className="module-content">
                  <h4>{module.title}</h4>
                  <p>{module.duration}</p>
                </div>
                <input
                  type="checkbox"
                  checked={module.completed}
                  onChange={() => toggleModule(selectedPath.id, module.id)}
                  className="module-checkbox"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningPaths
