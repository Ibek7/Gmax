import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProjectTemplates.css'

function ProjectTemplates() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const templates = [
    {
      id: 1,
      name: 'Short Story',
      category: 'writing',
      description: 'Classic narrative structure with beginning, middle, and end',
      icon: '📖',
      sections: ['Title', 'Opening Scene', 'Character Development', 'Conflict', 'Resolution'],
      color: '#667eea'
    },
    {
      id: 2,
      name: 'Poetry Collection',
      category: 'writing',
      description: 'Organize your poems with themes and reflections',
      icon: '✍️',
      sections: ['Collection Title', 'Theme', 'Poems', 'Author Notes'],
      color: '#764ba2'
    },
    {
      id: 3,
      name: 'Digital Art Project',
      category: 'art',
      description: 'Plan and execute digital artwork with mood boards',
      icon: '🎨',
      sections: ['Concept', 'Color Palette', 'References', 'Sketches', 'Final Piece'],
      color: '#f093fb'
    },
    {
      id: 4,
      name: 'Character Design',
      category: 'art',
      description: 'Comprehensive character sheet for artists',
      icon: '👤',
      sections: ['Appearance', 'Personality', 'Background', 'Variations', 'Expression Sheet'],
      color: '#f5576c'
    },
    {
      id: 5,
      name: 'Song Composition',
      category: 'music',
      description: 'Structure your music creation process',
      icon: '🎵',
      sections: ['Title', 'BPM & Key', 'Verse', 'Chorus', 'Bridge', 'Production Notes'],
      color: '#4facfe'
    },
    {
      id: 6,
      name: 'Album Planning',
      category: 'music',
      description: 'Organize a full album or EP project',
      icon: '💿',
      sections: ['Album Title', 'Concept', 'Track List', 'Themes', 'Release Plan'],
      color: '#00f2fe'
    },
    {
      id: 7,
      name: 'Web App Project',
      category: 'code',
      description: 'Full-stack application planning template',
      icon: '💻',
      sections: ['Overview', 'Features', 'Tech Stack', 'Database Schema', 'API Endpoints', 'UI Design'],
      color: '#43e97b'
    },
    {
      id: 8,
      name: 'Code Challenge',
      category: 'code',
      description: 'Problem-solving and algorithm practice',
      icon: '🧩',
      sections: ['Problem', 'Approach', 'Solution', 'Complexity Analysis', 'Tests'],
      color: '#38f9d7'
    },
    {
      id: 9,
      name: 'Game Design Doc',
      category: 'games',
      description: 'Complete game development blueprint',
      icon: '🎮',
      sections: ['Concept', 'Mechanics', 'Story', 'Art Style', 'Sound Design', 'Levels'],
      color: '#fa709a'
    },
    {
      id: 10,
      name: 'Screenplay',
      category: 'writing',
      description: 'Film or TV script template with acts',
      icon: '🎬',
      sections: ['Logline', 'Act 1', 'Act 2', 'Act 3', 'Character Arcs', 'Scene Breakdown'],
      color: '#fee140'
    },
    {
      id: 11,
      name: 'Portfolio Project',
      category: 'art',
      description: 'Showcase your best creative work',
      icon: '📁',
      sections: ['Introduction', 'Projects', 'Process', 'Skills', 'Contact'],
      color: '#30cfd0'
    },
    {
      id: 12,
      name: 'Music Playlist',
      category: 'music',
      description: 'Curated playlist with mood and flow',
      icon: '🎧',
      sections: ['Playlist Name', 'Theme', 'Tracks', 'Transitions', 'Cover Art'],
      color: '#a8edea'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'writing', name: 'Writing', icon: '✍️' },
    { id: 'art', name: 'Art', icon: '🎨' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'code', name: 'Code', icon: '💻' },
    { id: 'games', name: 'Games', icon: '🎮' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const useTemplate = (template) => {
    const project = {
      id: Date.now(),
      templateId: template.id,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      category: template.category,
      sections: template.sections.map(section => ({
        title: section,
        content: ''
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const projects = JSON.parse(localStorage.getItem('templateProjects') || '[]')
    projects.unshift(project)
    localStorage.setItem('templateProjects', JSON.stringify(projects))

    alert(`✅ Created new project from "${template.name}" template!`)
  }

  const viewMyProjects = () => {
    const projects = JSON.parse(localStorage.getItem('templateProjects') || '[]')
    if (projects.length === 0) {
      alert('No projects yet! Create one from a template.')
      return
    }
    // Navigate to a projects view (could be expanded)
    alert(`You have ${projects.length} project(s) created from templates!`)
  }

  return (
    <div className="project-templates-container">
      <div className="templates-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>📋 Project Templates</h1>
        <button className="my-projects-btn" onClick={viewMyProjects}>
          📁 My Projects
        </button>
      </div>

      <div className="templates-intro">
        <p>Jumpstart your creativity with pre-built templates. Choose a template below to get started!</p>
      </div>

      <div className="templates-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="no-templates">
          <div className="empty-icon">📭</div>
          <h3>No templates found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div key={template.id} className="template-card" style={{ borderColor: template.color }}>
              <div className="template-icon" style={{ background: template.color }}>
                {template.icon}
              </div>
              <h3>{template.name}</h3>
              <p className="template-description">{template.description}</p>
              
              <div className="template-sections">
                <h4>Includes:</h4>
                <ul>
                  {template.sections.slice(0, 3).map((section, index) => (
                    <li key={index}>{section}</li>
                  ))}
                  {template.sections.length > 3 && (
                    <li className="more-sections">+{template.sections.length - 3} more</li>
                  )}
                </ul>
              </div>

              <button 
                className="use-template-btn"
                onClick={() => useTemplate(template)}
                style={{ background: template.color }}
              >
                Use Template →
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="templates-footer">
        <div className="footer-card">
          <h3>💡 Pro Tip</h3>
          <p>Templates are fully customizable! Add, remove, or modify sections to fit your creative process.</p>
        </div>
        <div className="footer-card">
          <h3>🚀 Coming Soon</h3>
          <p>Create and save your own custom templates to reuse across projects.</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectTemplates
