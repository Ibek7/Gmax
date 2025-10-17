import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/SkillTree.css'

function SkillTree() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState({})
  const [totalXP, setTotalXP] = useState(0)

  const skillCategories = {
    writing: { name: 'Writing', icon: '✍️', color: '#667eea' },
    art: { name: 'Art', icon: '🎨', color: '#f093fb' },
    music: { name: 'Music', icon: '🎵', color: '#4facfe' },
    code: { name: 'Coding', icon: '💻', color: '#43e97b' },
    games: { name: 'Gaming', icon: '🎮', color: '#fa709a' }
  }

  const levels = [
    { level: 1, xp: 0, title: 'Novice' },
    { level: 2, xp: 100, title: 'Apprentice' },
    { level: 3, xp: 250, title: 'Practitioner' },
    { level: 4, xp: 500, title: 'Expert' },
    { level: 5, xp: 1000, title: 'Master' },
    { level: 6, xp: 2000, title: 'Grandmaster' }
  ]

  useEffect(() => {
    loadSkillData()
  }, [])

  const loadSkillData = () => {
    const saved = JSON.parse(localStorage.getItem('skillTree') || '{}')
    const defaultSkills = {}
    
    Object.keys(skillCategories).forEach(key => {
      defaultSkills[key] = saved[key] || { xp: 0, level: 1 }
    })
    
    setSkills(defaultSkills)
    
    const total = Object.values(defaultSkills).reduce((sum, skill) => sum + skill.xp, 0)
    setTotalXP(total)
  }

  const addXP = (category, amount) => {
    const updated = { ...skills }
    updated[category].xp += amount
    
    // Level up check
    const nextLevel = levels.find(l => l.level === updated[category].level + 1)
    if (nextLevel && updated[category].xp >= nextLevel.xp) {
      updated[category].level = nextLevel.level
      alert(`🎉 Level Up! You're now a ${nextLevel.title} in ${skillCategories[category].name}!`)
    }
    
    setSkills(updated)
    localStorage.setItem('skillTree', JSON.stringify(updated))
    
    const total = Object.values(updated).reduce((sum, skill) => sum + skill.xp, 0)
    setTotalXP(total)
  }

  const getCurrentLevelInfo = (skill) => {
    const currentLevel = levels.find(l => l.level === skill.level) || levels[0]
    const nextLevel = levels.find(l => l.level === skill.level + 1)
    return { currentLevel, nextLevel }
  }

  const getProgressPercent = (skill) => {
    const { currentLevel, nextLevel } = getCurrentLevelInfo(skill)
    if (!nextLevel) return 100
    
    const xpInCurrentLevel = skill.xp - currentLevel.xp
    const xpNeededForNext = nextLevel.xp - currentLevel.xp
    return Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100)
  }

  const getOverallLevel = () => {
    const avgLevel = Object.values(skills).reduce((sum, s) => sum + s.level, 0) / Object.keys(skills).length
    return Math.floor(avgLevel)
  }

  return (
    <div className="skill-tree-container">
      <div className="skill-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🌳 Skill Tree</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="overall-stats">
        <div className="stat-item">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">Level {getOverallLevel()}</div>
            <div className="stat-label">Overall</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <div className="stat-value">{totalXP}</div>
            <div className="stat-label">Total XP</div>
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {Object.entries(skillCategories).map(([key, category]) => {
          const skill = skills[key] || { xp: 0, level: 1 }
          const { currentLevel, nextLevel } = getCurrentLevelInfo(skill)
          const progress = getProgressPercent(skill)

          return (
            <div key={key} className="skill-card" style={{ borderColor: category.color }}>
              <div className="skill-card-header">
                <div className="skill-icon" style={{ background: category.color }}>
                  {category.icon}
                </div>
                <div className="skill-info">
                  <h3>{category.name}</h3>
                  <p className="skill-title">{currentLevel.title}</p>
                </div>
                <div className="skill-level">
                  Lv. {skill.level}
                </div>
              </div>

              <div className="skill-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%`, background: category.color }}
                  />
                </div>
                <div className="progress-text">
                  {nextLevel 
                    ? `${skill.xp - currentLevel.xp} / ${nextLevel.xp - currentLevel.xp} XP to next level`
                    : 'Max Level Reached! 🏆'}
                </div>
              </div>

              <div className="xp-buttons">
                <button 
                  className="xp-btn" 
                  onClick={() => addXP(key, 10)}
                  style={{ borderColor: category.color, color: category.color }}
                >
                  +10 XP
                </button>
                <button 
                  className="xp-btn" 
                  onClick={() => addXP(key, 50)}
                  style={{ background: category.color, color: 'white' }}
                >
                  +50 XP
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="milestones-section">
        <h3>🏆 Level Milestones</h3>
        <div className="milestones-grid">
          {levels.map((level, index) => (
            <div key={level.level} className="milestone-card">
              <div className="milestone-number">{level.level}</div>
              <div className="milestone-content">
                <h4>{level.title}</h4>
                <p>{level.xp} XP required</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tips-section">
        <h3>💡 How to Earn XP</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">📝</span>
            <span>Complete creative projects and challenges</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <span>Achieve daily goals and maintain streaks</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🏆</span>
            <span>Unlock achievements and badges</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏱️</span>
            <span>Complete focus sessions and practice regularly</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillTree
