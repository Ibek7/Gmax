import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MentorMatching.css'

const MentorMatching = () => {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [filter, setFilter] = useState('all')

  const defaultProfiles = [
    { id: 1, name: 'Sarah Chen', role: 'mentor', skill: 'React Development', experience: '8 years', bio: 'Passionate about teaching modern web dev' },
    { id: 2, name: 'John Doe', role: 'mentee', skill: 'UI/UX Design', experience: '1 year', bio: 'Looking to improve design skills' },
    { id: 3, name: 'Alex Rivera', role: 'mentor', skill: 'Python Backend', experience: '5 years', bio: 'Backend architecture specialist' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('gmax_mentor_profiles')
    setProfiles(saved ? JSON.parse(saved) : defaultProfiles)
  }, [])

  return (
    <div className="mentor-container">
      <div className="mentor-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎓 Mentor Matching</h1>
      </div>

      <div className="filter-bar">
        {['all', 'mentor', 'mentee'].map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}s
          </button>
        ))}
      </div>

      <div className="profiles-grid">
        {profiles.filter(p => filter === 'all' || p.role === filter).map(profile => (
          <div key={profile.id} className={`profile-card ${profile.role}`}>
            <div className="profile-avatar">{profile.name.charAt(0)}</div>
            <h3>{profile.name}</h3>
            <span className="role-badge">{profile.role}</span>
            <p><strong>{profile.skill}</strong></p>
            <p>{profile.experience} experience</p>
            <p className="bio">{profile.bio}</p>
            <button className="connect-btn">Connect</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MentorMatching
