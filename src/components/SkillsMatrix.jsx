import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/SkillsMatrix.css'

const SkillsMatrix = () => {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  
  const defaultSkills = [
    { name: 'JavaScript', category: 'coding', level: 4 },
    { name: 'React', category: 'coding', level: 4 },
    { name: 'UI Design', category: 'design', level: 3 },
    { name: 'Writing', category: 'content', level: 3 },
    { name: 'Photography', category: 'visual', level: 2 },
    { name: 'Video Editing', category: 'visual', level: 2 },
    { name: 'Music Production', category: 'audio', level: 1 },
    { name: 'Animation', category: 'visual', level: 1 }
  ]

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = () => {
    const saved = localStorage.getItem('gmax_skills_matrix')
    if (saved) {
      setSkills(JSON.parse(saved))
    } else {
      setSkills(defaultSkills)
      localStorage.setItem('gmax_skills_matrix', JSON.stringify(defaultSkills))
    }
  }

  const saveSkills = (updated) => {
    setSkills(updated)
    localStorage.setItem('gmax_skills_matrix', JSON.stringify(updated))
  }

  const addSkill = (skill) => {
    const updated = [...skills, { ...skill, level: 1 }]
    saveSkills(updated)
    setShowAddModal(false)
  }

  const updateSkillLevel = (index, newLevel) => {
    const updated = skills.map((s, i) => i === index ? { ...s, level: newLevel } : s)
    saveSkills(updated)
  }

  const deleteSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index)
    saveSkills(updated)
  }

  const getLevelColor = (level) => {
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#27ae60']
    return colors[level - 1] || '#95a5a6'
  }

  const getLevelLabel = (level) => {
    const labels = ['Beginner', 'Intermediate', 'Proficient', 'Advanced', 'Expert']
    return labels[level - 1] || 'Not Set'
  }

  const getSkillsByCategory = () => {
    const categories = {}
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = []
      }
      categories[skill.category].push(skill)
    })
    return categories
  }

  const getAverageLevel = (category) => {
    const categorySkills = skills.filter(s => s.category === category)
    if (categorySkills.length === 0) return 0
    const sum = categorySkills.reduce((acc, s) => acc + s.level, 0)
    return (sum / categorySkills.length).toFixed(1)
  }

  const categories = getSkillsByCategory()

  return (
    <div className="skills-matrix-container">
      <div className="skills-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎯 Creative Skills Matrix</h1>
        <button className="add-skill-btn" onClick={() => setShowAddModal(true)}>
          + Add Skill
        </button>
      </div>

      <div className="matrix-grid">
        {Object.entries(categories).map(([category, categorySkills]) => (
          <div key={category} className="category-section">
            <div className="category-header">
              <h2>{category}</h2>
              <span className="avg-level">Avg: {getAverageLevel(category)}/5</span>
            </div>
            <div className="skills-list">
              {categorySkills.map((skill, index) => {
                const globalIndex = skills.findIndex(s => s === skill)
                return (
                  <div key={globalIndex} className="skill-item">
                    <div className="skill-info">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-level-label" style={{ color: getLevelColor(skill.level) }}>
                        {getLevelLabel(skill.level)}
                      </div>
                    </div>
                    <div className="level-controls">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          className={`level-btn ${skill.level >= level ? 'active' : ''}`}
                          style={{ background: skill.level >= level ? getLevelColor(level) : '#e0e0e0' }}
                          onClick={() => updateSkillLevel(globalIndex, level)}
                        >
                          {level}
                        </button>
                      ))}
                      <button
                        className="delete-skill-btn"
                        onClick={() => deleteSkill(globalIndex)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddSkillModal
          onSave={addSkill}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

const AddSkillModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'coding'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add New Skill</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Skill Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              placeholder="e.g., Python, Illustration, Copywriting"
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="coding">Coding</option>
              <option value="design">Design</option>
              <option value="visual">Visual Arts</option>
              <option value="audio">Audio</option>
              <option value="content">Content Creation</option>
              <option value="marketing">Marketing</option>
              <option value="management">Management</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">Add Skill</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SkillsMatrix
