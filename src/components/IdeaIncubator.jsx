import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/IdeaIncubator.css'

const IdeaIncubator = () => {
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState([])
  const [newIdea, setNewIdea] = useState('')
  const [stage, setStage] = useState('brainstorm')
  const [connections, setConnections] = useState([])

  const stages = ['brainstorm', 'developing', 'testing', 'ready', 'archived']

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = () => {
    const saved = localStorage.getItem('gmax_ideas')
    if (saved) {
      setIdeas(JSON.parse(saved))
    }
  }

  const addIdea = () => {
    if (!newIdea.trim()) return
    const idea = {
      id: Date.now(),
      content: newIdea,
      stage: 'brainstorm',
      date: new Date().toISOString(),
      notes: []
    }
    const updated = [idea, ...ideas]
    setIdeas(updated)
    localStorage.setItem('gmax_ideas', JSON.stringify(updated))
    setNewIdea('')
  }

  const updateStage = (id, newStage) => {
    const updated = ideas.map(i => i.id === id ? { ...i, stage: newStage } : i)
    setIdeas(updated)
    localStorage.setItem('gmax_ideas', JSON.stringify(updated))
  }

  const deleteIdea = (id) => {
    const updated = ideas.filter(i => i.id !== id)
    setIdeas(updated)
    localStorage.setItem('gmax_ideas', JSON.stringify(updated))
  }

  const filteredIdeas = ideas.filter(i => i.stage === stage)

  return (
    <div className="idea-incubator-container">
      <div className="incubator-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💡 Idea Incubator</h1>
      </div>

      <div className="add-idea-section">
        <input
          type="text"
          placeholder="What's your next big idea?"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addIdea()}
        />
        <button onClick={addIdea}>+ Add Idea</button>
      </div>

      <div className="stages-nav">
        {stages.map(s => (
          <button
            key={s}
            className={`stage-btn ${stage === s ? 'active' : ''}`}
            onClick={() => setStage(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="count">{ideas.filter(i => i.stage === s).length}</span>
          </button>
        ))}
      </div>

      <div className="ideas-board">
        {filteredIdeas.length === 0 ? (
          <p className="no-ideas">No ideas in this stage yet!</p>
        ) : (
          filteredIdeas.map(idea => (
            <div key={idea.id} className="idea-card">
              <p>{idea.content}</p>
              <div className="idea-actions">
                <select
                  value={idea.stage}
                  onChange={(e) => updateStage(idea.id, e.target.value)}
                >
                  {stages.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button onClick={() => deleteIdea(idea.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default IdeaIncubator
