import React, { useState, useEffect } from 'react'
import '../styles/CreativeChallenges.css'

const CHALLENGES_KEY = 'gmaxChallenges'

const CreativeChallenges = () => {
  const [activeChallenges, setActiveChallenges] = useState([])
  const [userSubmissions, setUserSubmissions] = useState({})
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [submission, setSubmission] = useState('')

  const dailyChallenges = [
    {
      id: 'daily_1',
      title: 'Sketch Your Morning',
      description: 'Draw or sketch the first thing you saw this morning',
      type: 'daily',
      category: 'art',
      icon: '🎨',
      points: 10,
      deadline: 'Today, 11:59 PM'
    },
    {
      id: 'daily_2',
      title: 'Three Word Story',
      description: 'Write a complete story using exactly three words',
      type: 'daily',
      category: 'writing',
      icon: '✍️',
      points: 10,
      deadline: 'Today, 11:59 PM'
    },
    {
      id: 'weekly_1',
      title: 'Music Mashup',
      description: 'Create a 30-second melody combining two different genres',
      type: 'weekly',
      category: 'music',
      icon: '🎵',
      points: 50,
      deadline: 'Sunday, 11:59 PM'
    },
    {
      id: 'weekly_2',
      title: 'Code Art Challenge',
      description: 'Generate visual art using only code (any language)',
      type: 'weekly',
      category: 'code',
      icon: '💻',
      points: 50,
      deadline: 'Sunday, 11:59 PM'
    }
  ]

  useEffect(() => {
    setActiveChallenges(dailyChallenges)
    const stored = localStorage.getItem(CHALLENGES_KEY)
    if (stored) {
      setUserSubmissions(JSON.parse(stored))
    }
  }, [])

  const handleSubmit = (challengeId) => {
    if (!submission.trim()) return

    const newSubmissions = {
      ...userSubmissions,
      [challengeId]: {
        content: submission,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      }
    }
    
    setUserSubmissions(newSubmissions)
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(newSubmissions))
    setSubmission('')
    setSelectedChallenge(null)
  }

  const getCompletionStats = () => {
    const completed = Object.keys(userSubmissions).length
    const total = activeChallenges.length
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const stats = getCompletionStats()

  return (
    <div className="creative-challenges">
      <header className="challenges-header">
        <h1>🎯 Creative Challenges</h1>
        <p>Push your boundaries with daily and weekly creative tasks</p>
      </header>

      <div className="challenges-stats">
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <div>
            <strong>{stats.completed}/{stats.total}</strong>
            <span>Completed</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💯</span>
          <div>
            <strong>{stats.percentage}%</strong>
            <span>Completion Rate</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⭐</span>
          <div>
            <strong>{Object.values(userSubmissions).reduce((acc, sub) => acc + (activeChallenges.find(c => userSubmissions[c.id])?.points || 0), 0)}</strong>
            <span>Points Earned</span>
          </div>
        </div>
      </div>

      <div className="challenges-grid">
        {activeChallenges.map((challenge) => {
          const isCompleted = userSubmissions[challenge.id]
          
          return (
            <div 
              key={challenge.id} 
              className={`challenge-card ${isCompleted ? 'completed' : ''} ${challenge.type}`}
            >
              <div className="challenge-badge">{challenge.icon}</div>
              <div className="challenge-type-badge">{challenge.type}</div>
              
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              
              <div className="challenge-meta">
                <span className="challenge-category">
                  {challenge.category}
                </span>
                <span className="challenge-points">
                  {challenge.points} pts
                </span>
              </div>
              
              <div className="challenge-deadline">
                ⏰ {challenge.deadline}
              </div>

              {isCompleted ? (
                <div className="challenge-completed-badge">
                  ✓ Submitted
                </div>
              ) : (
                <button 
                  className="participate-btn"
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  Participate
                </button>
              )}
            </div>
          )
        })}
      </div>

      {selectedChallenge && (
        <div className="submission-modal-overlay" onClick={() => setSelectedChallenge(null)}>
          <div className="submission-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedChallenge(null)}>✕</button>
            
            <h2>{selectedChallenge.icon} {selectedChallenge.title}</h2>
            <p className="modal-description">{selectedChallenge.description}</p>
            
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Share your creative work, ideas, or a link to your submission..."
              rows={6}
            />
            
            <button 
              className="submit-btn"
              onClick={() => handleSubmit(selectedChallenge.id)}
              disabled={!submission.trim()}
            >
              Submit Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreativeChallenges
