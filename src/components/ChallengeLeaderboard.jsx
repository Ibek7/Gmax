import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ChallengeLeaderboard.css'

const ChallengeLeaderboard = () => {
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])
  const [userScore, setUserScore] = useState(0)
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Complete 5 projects', points: 100, completed: false },
    { id: 2, title: 'Write 10,000 words', points: 150, completed: false },
    { id: 3, title: 'Code for 20 hours', points: 200, completed: false },
    { id: 4, title: 'Create 10 artworks', points: 120, completed: false },
    { id: 5, title: '30-day streak', points: 300, completed: false }
  ])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('gmax_leaderboard')
    if (saved) {
      const data = JSON.parse(saved)
      setLeaderboard(data.leaderboard || [])
      setUserScore(data.userScore || 0)
    } else {
      const mockLeaderboard = [
        { id: 1, name: 'Creative Pro', score: 2500, avatar: '🏆' },
        { id: 2, name: 'Art Master', score: 2200, avatar: '🎨' },
        { id: 3, name: 'Code Ninja', score: 2000, avatar: '💻' },
        { id: 4, name: 'Writer Hero', score: 1800, avatar: '✍️' },
        { id: 5, name: 'Music Maker', score: 1600, avatar: '🎵' }
      ]
      setLeaderboard(mockLeaderboard)
    }
  }

  const completeChallenge = (id) => {
    const challenge = challenges.find(c => c.id === id)
    if (challenge && !challenge.completed) {
      const updated = challenges.map(c => 
        c.id === id ? { ...c, completed: true } : c
      )
      setChallenges(updated)
      const newScore = userScore + challenge.points
      setUserScore(newScore)
      localStorage.setItem('gmax_leaderboard', JSON.stringify({
        leaderboard,
        userScore: newScore
      }))
      alert(`🎉 Challenge completed! +${challenge.points} points!`)
    }
  }

  return (
    <div className="challenge-leaderboard-container">
      <div className="leaderboard-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🏆 Challenge Leaderboard</h1>
      </div>

      <div className="leaderboard-layout">
        <div className="challenges-section">
          <h2>Active Challenges</h2>
          <div className="user-score">
            <span>Your Score:</span>
            <strong>{userScore} points</strong>
          </div>
          <div className="challenges-list">
            {challenges.map(challenge => (
              <div key={challenge.id} className={`challenge-item ${challenge.completed ? 'completed' : ''}`}>
                <div className="challenge-info">
                  <h3>{challenge.title}</h3>
                  <span className="challenge-points">+{challenge.points} points</span>
                </div>
                {!challenge.completed ? (
                  <button onClick={() => completeChallenge(challenge.id)}>Complete</button>
                ) : (
                  <span className="completed-badge">✅ Done</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="leaderboard-section">
          <h2>Top Performers</h2>
          <div className="leaderboard-list">
            {leaderboard.map((user, index) => (
              <div key={user.id} className="leaderboard-item">
                <span className="rank">#{index + 1}</span>
                <span className="avatar">{user.avatar}</span>
                <span className="name">{user.name}</span>
                <span className="score">{user.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeLeaderboard
