import React, { useState, useEffect } from 'react'
import { getUnlockedAchievements, getTotalAchievementPoints, achievements } from '../data/games'

const AchievementShowcase = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [selectedTab, setSelectedTab] = useState('unlocked')

  useEffect(() => {
    setUnlockedAchievements(getUnlockedAchievements())
    setTotalPoints(getTotalAchievementPoints())
  }, [])

  const lockedAchievements = achievements.filter(
    achievement => !unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
  )

  const AchievementCard = ({ achievement, isLocked = false }) => (
    <div className={`achievement-card ${isLocked ? 'locked' : 'unlocked'}`}>
      <div className="achievement-icon">
        {isLocked ? '🔒' : achievement.icon}
      </div>
      <div className="achievement-info">
        <h3 className="achievement-title">
          {isLocked ? '???' : achievement.name}
        </h3>
        <p className="achievement-description">
          {isLocked ? 'Complete challenges to unlock this achievement' : achievement.description}
        </p>
        <div className="achievement-points">
          {isLocked ? '? pts' : `${achievement.points} pts`}
        </div>
      </div>
    </div>
  )

  return (
    <div className="achievement-showcase">
      <div className="showcase-header">
        <h1>Achievement Showcase</h1>
        <div className="points-summary">
          <span className="total-points">🏆 {totalPoints} Total Points</span>
          <span className="progress">
            {unlockedAchievements.length}/{achievements.length} Unlocked
          </span>
        </div>
      </div>

      <div className="achievement-tabs">
        <button 
          className={`tab ${selectedTab === 'unlocked' ? 'active' : ''}`}
          onClick={() => setSelectedTab('unlocked')}
        >
          Unlocked ({unlockedAchievements.length})
        </button>
        <button 
          className={`tab ${selectedTab === 'locked' ? 'active' : ''}`}
          onClick={() => setSelectedTab('locked')}
        >
          Locked ({lockedAchievements.length})
        </button>
        <button 
          className={`tab ${selectedTab === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          All Achievements
        </button>
      </div>

      <div className="achievements-grid">
        {selectedTab === 'unlocked' && unlockedAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
        
        {selectedTab === 'locked' && lockedAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} isLocked={true} />
        ))}
        
        {selectedTab === 'all' && achievements.map(achievement => {
          const isUnlocked = unlockedAchievements.some(unlocked => unlocked.id === achievement.id)
          return (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              isLocked={!isUnlocked} 
            />
          )
        })}
      </div>

      {unlockedAchievements.length === 0 && selectedTab === 'unlocked' && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No Achievements Yet</h3>
          <p>Start playing games and completing challenges to unlock achievements!</p>
        </div>
      )}
    </div>
  )
}

export default AchievementShowcase