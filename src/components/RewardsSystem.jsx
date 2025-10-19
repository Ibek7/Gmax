import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/RewardsSystem.css'

const RewardsSystem = () => {
  const navigate = useNavigate()
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [rewards, setRewards] = useState([])
  const [unlockedRewards, setUnlockedRewards] = useState([])

  const rewardsList = [
    { id: 1, name: '🌟 Starter Badge', description: 'Complete your first task', pointsRequired: 50, tier: 'bronze' },
    { id: 2, name: '🔥 Streak Master', description: 'Maintain a 7-day streak', pointsRequired: 150, tier: 'bronze' },
    { id: 3, name: '✍️ Word Wizard', description: 'Write 10,000 words', pointsRequired: 250, tier: 'silver' },
    { id: 4, name: '🎨 Creative Genius', description: 'Complete 5 art projects', pointsRequired: 300, tier: 'silver' },
    { id: 5, name: '🎵 Music Maestro', description: 'Create 10 musical pieces', pointsRequired: 350, tier: 'silver' },
    { id: 6, name: '💻 Code Champion', description: 'Complete 20 coding sessions', pointsRequired: 400, tier: 'gold' },
    { id: 7, name: '🎮 Game Designer', description: 'Design 3 game concepts', pointsRequired: 450, tier: 'gold' },
    { id: 8, name: '🏆 Achievement Hunter', description: 'Unlock 15 achievements', pointsRequired: 500, tier: 'gold' },
    { id: 9, name: '⭐ Productivity King', description: 'Complete 100 tasks', pointsRequired: 750, tier: 'platinum' },
    { id: 10, name: '👑 Ultimate Creator', description: 'Master all creative domains', pointsRequired: 1000, tier: 'platinum' }
  ]

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = () => {
    const savedPoints = parseInt(localStorage.getItem('gmax_reward_points') || '0')
    const savedLevel = parseInt(localStorage.getItem('gmax_reward_level') || '1')
    const savedUnlocked = JSON.parse(localStorage.getItem('gmax_unlocked_rewards') || '[]')
    
    setPoints(savedPoints)
    setLevel(savedLevel)
    setUnlockedRewards(savedUnlocked)
    setRewards(rewardsList)
  }

  const earnPoints = (amount) => {
    const newPoints = points + amount
    setPoints(newPoints)
    localStorage.setItem('gmax_reward_points', newPoints.toString())
    
    const newLevel = Math.floor(newPoints / 100) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      localStorage.setItem('gmax_reward_level', newLevel.toString())
      alert(`🎉 Level Up! You're now level ${newLevel}!`)
    }

    checkUnlockedRewards(newPoints)
  }

  const checkUnlockedRewards = (currentPoints) => {
    rewardsList.forEach(reward => {
      if (currentPoints >= reward.pointsRequired && !unlockedRewards.includes(reward.id)) {
        const updated = [...unlockedRewards, reward.id]
        setUnlockedRewards(updated)
        localStorage.setItem('gmax_unlocked_rewards', JSON.stringify(updated))
        alert(`🎁 New Reward Unlocked: ${reward.name}!`)
      }
    })
  }

  const getTierColor = (tier) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2'
    }
    return colors[tier] || '#667eea'
  }

  const pointsToNextLevel = () => {
    return (level * 100) - points
  }

  return (
    <div className="rewards-system-container">
      <div className="rewards-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>🏆 Rewards System</h1>
      </div>

      <div className="progress-overview">
        <div className="level-card">
          <div className="level-badge">
            <span className="level-number">{level}</span>
            <span className="level-label">Level</span>
          </div>
          <div className="level-info">
            <p className="points-total">{points} Points</p>
            <p className="next-level">{pointsToNextLevel()} points to level {level + 1}</p>
          </div>
        </div>

        <div className="quick-actions">
          <button onClick={() => earnPoints(10)}>+10 Points (Demo)</button>
          <button onClick={() => earnPoints(50)}>+50 Points (Demo)</button>
          <button onClick={() => earnPoints(100)}>+100 Points (Demo)</button>
        </div>
      </div>

      <div className="rewards-grid">
        {rewards.map(reward => {
          const isUnlocked = unlockedRewards.includes(reward.id)
          const canUnlock = points >= reward.pointsRequired
          
          return (
            <div 
              key={reward.id} 
              className={`reward-card ${isUnlocked ? 'unlocked' : ''} ${canUnlock && !isUnlocked ? 'available' : ''}`}
              style={{ borderColor: getTierColor(reward.tier) }}
            >
              <div className="reward-icon">
                {isUnlocked ? reward.name.split(' ')[0] : '🔒'}
              </div>
              <h3 className="reward-name">
                {isUnlocked ? reward.name : '???'}
              </h3>
              <p className="reward-description">
                {isUnlocked ? reward.description : 'Keep earning points to unlock!'}
              </p>
              <div className="reward-footer">
                <span 
                  className="reward-tier"
                  style={{ background: getTierColor(reward.tier) }}
                >
                  {reward.tier.toUpperCase()}
                </span>
                <span className="reward-points">
                  {reward.pointsRequired} pts
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RewardsSystem
