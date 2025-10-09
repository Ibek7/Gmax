import React, { useState } from 'react'

const SocialShare = () => {
  const [shareType, setShareType] = useState('achievement')
  const [selectedContent, setSelectedContent] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [shareStatus, setShareStatus] = useState('')

  const getAchievements = () => {
    try {
      const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
      return achievements.map(id => {
        // Get achievement details from your achievements data
        const achievementData = {
          'first_game': { title: 'First Steps', description: 'Played first game', icon: '🎮' },
          'memory_master': { title: 'Memory Master', description: 'Scored 50+ in Color Memory', icon: '🧠' },
          'perfect_start': { title: 'Perfect Start', description: 'Scored 10+ on first try', icon: '⭐' },
          'daily_player': { title: 'Daily Player', description: 'Played 7 days in a row', icon: '📅' },
          'high_achiever': { title: 'High Achiever', description: 'Earned 100 total points', icon: '🏆' },
          'speed_demon': { title: 'Speed Demon', description: 'Completed in under 2 seconds', icon: '⚡' },
          'persistent': { title: 'Persistent', description: 'Played 25 games total', icon: '💪' }
        }
        return { id, ...achievementData[id] }
      })
    } catch {
      return []
    }
  }

  const getWritingExcerpts = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('writingDrafts') || '[]')
      return drafts.map((draft, index) => ({
        id: index,
        title: `Writing Draft ${index + 1}`,
        content: draft.content.substring(0, 200) + '...',
        wordCount: draft.content.split(' ').length,
        genre: draft.genre || 'General'
      }))
    } catch {
      return []
    }
  }

  const getProgressStats = () => {
    try {
      const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}')
      const achievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
      const dailyProgress = JSON.parse(localStorage.getItem('dailyProgress') || '{}')
      
      const totalGames = Object.values(gameStats).reduce((sum, stats) => sum + (stats.totalPlays || 0), 0)
      const highScore = Math.max(...Object.values(gameStats).map(stats => stats.highScore || 0))
      const writingDays = Object.values(dailyProgress).filter(day => (day.wordsWritten || 0) > 0).length
      
      return {
        achievements: achievements.length,
        totalGames,
        highScore,
        writingDays
      }
    } catch {
      return { achievements: 0, totalGames: 0, highScore: 0, writingDays: 0 }
    }
  }

  const generateShareText = () => {
    let text = customMessage || ''
    
    switch (shareType) {
      case 'achievement':
        if (selectedContent) {
          const achievement = getAchievements().find(a => a.id === selectedContent)
          if (achievement) {
            text = `🎉 Just unlocked "${achievement.title}" in Gmax Creative Studio! ${achievement.icon} ${achievement.description}\n\n#CreativeStudio #Achievement #Creativity`
          }
        }
        break
        
      case 'writing':
        if (selectedContent) {
          const excerpt = getWritingExcerpts().find(w => w.id.toString() === selectedContent)
          if (excerpt) {
            text = `✍️ Working on a new ${excerpt.genre} piece in Gmax Creative Studio! ${excerpt.wordCount} words and counting...\n\n"${excerpt.content}"\n\n#Writing #Creativity #${excerpt.genre}`
          }
        }
        break
        
      case 'progress':
        const stats = getProgressStats()
        text = `📊 My Gmax Creative Studio Progress:\n🏆 ${stats.achievements} Achievements Unlocked\n🎮 ${stats.totalGames} Games Played\n✍️ ${stats.writingDays} Days of Writing\n🎯 High Score: ${stats.highScore}\n\n#CreativeProgress #Productivity #Creativity`
        break
        
      default:
        text = customMessage || 'Check out Gmax Creative Studio - the ultimate creative playground! 🎨✍️🎮 #CreativeStudio #Productivity'
    }
    
    return text
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(generateShareText())
    const url = `https://twitter.com/intent/tweet?text=${text}`
    window.open(url, '_blank', 'width=600,height=400')
    setShareStatus('✅ Opened Twitter share dialog!')
    setTimeout(() => setShareStatus(''), 3000)
  }

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(generateShareText())
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${text}`
    window.open(url, '_blank', 'width=600,height=400')
    setShareStatus('✅ Opened LinkedIn share dialog!')
    setTimeout(() => setShareStatus(''), 3000)
  }

  const shareToFacebook = () => {
    const text = encodeURIComponent(generateShareText())
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${text}`
    window.open(url, '_blank', 'width=600,height=400')
    setShareStatus('✅ Opened Facebook share dialog!')
    setTimeout(() => setShareStatus(''), 3000)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText())
      setShareStatus('✅ Copied to clipboard!')
    } catch {
      setShareStatus('❌ Failed to copy to clipboard')
    }
    setTimeout(() => setShareStatus(''), 3000)
  }

  const downloadAsImage = () => {
    // Create a simple text-based image for sharing
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = 800
    canvas.height = 600
    
    // Background
    ctx.fillStyle = '#6366f1'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#6366f1')
    gradient.addColorStop(1, '#8b5cf6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Title
    ctx.fillStyle = 'white'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Gmax Creative Studio', canvas.width / 2, 100)
    
    // Content
    ctx.font = '24px Arial'
    const text = generateShareText()
    const lines = text.split('\n')
    let y = 200
    
    lines.forEach(line => {
      if (line.trim() && y < canvas.height - 50) {
        ctx.fillText(line.substring(0, 50), canvas.width / 2, y)
        y += 40
      }
    })
    
    // Download
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'gmax-share.png'
      link.click()
      URL.revokeObjectURL(url)
      setShareStatus('✅ Downloaded share image!')
      setTimeout(() => setShareStatus(''), 3000)
    })
  }

  const achievements = getAchievements()
  const writings = getWritingExcerpts()

  return (
    <div className="social-share">
      <div className="share-header">
        <h1>Share Your Creativity</h1>
        <p>Share your achievements, writing, and progress with the world!</p>
      </div>

      <div className="share-content">
        <div className="share-type-selector">
          <h3>What would you like to share?</h3>
          <div className="type-buttons">
            <button 
              className={shareType === 'achievement' ? 'active' : ''}
              onClick={() => setShareType('achievement')}
            >
              🏆 Achievement
            </button>
            <button 
              className={shareType === 'writing' ? 'active' : ''}
              onClick={() => setShareType('writing')}
            >
              ✍️ Writing
            </button>
            <button 
              className={shareType === 'progress' ? 'active' : ''}
              onClick={() => setShareType('progress')}
            >
              📊 Progress
            </button>
            <button 
              className={shareType === 'custom' ? 'active' : ''}
              onClick={() => setShareType('custom')}
            >
              ✨ Custom
            </button>
          </div>
        </div>

        {shareType === 'achievement' && (
          <div className="content-selector">
            <h4>Select an Achievement</h4>
            {achievements.length > 0 ? (
              <div className="achievement-list">
                {achievements.map(achievement => (
                  <button
                    key={achievement.id}
                    className={`achievement-item ${selectedContent === achievement.id ? 'selected' : ''}`}
                    onClick={() => setSelectedContent(achievement.id)}
                  >
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-details">
                      <strong>{achievement.title}</strong>
                      <p>{achievement.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-content">No achievements unlocked yet. Keep playing to earn your first achievement!</p>
            )}
          </div>
        )}

        {shareType === 'writing' && (
          <div className="content-selector">
            <h4>Select a Writing Excerpt</h4>
            {writings.length > 0 ? (
              <div className="writing-list">
                {writings.map(writing => (
                  <button
                    key={writing.id}
                    className={`writing-item ${selectedContent === writing.id.toString() ? 'selected' : ''}`}
                    onClick={() => setSelectedContent(writing.id.toString())}
                  >
                    <div className="writing-meta">
                      <strong>{writing.genre}</strong>
                      <span>{writing.wordCount} words</span>
                    </div>
                    <p className="writing-excerpt">{writing.content}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-content">No writing drafts yet. Start writing to create shareable content!</p>
            )}
          </div>
        )}

        {shareType === 'progress' && (
          <div className="progress-preview">
            <h4>Your Progress Summary</h4>
            <div className="progress-stats">
              {(() => {
                const stats = getProgressStats()
                return (
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">{stats.achievements}</span>
                      <span className="stat-label">Achievements</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.totalGames}</span>
                      <span className="stat-label">Games Played</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.writingDays}</span>
                      <span className="stat-label">Writing Days</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.highScore}</span>
                      <span className="stat-label">High Score</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        <div className="custom-message">
          <h4>Customize Your Message</h4>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={shareType === 'custom' ? 'Write your custom message...' : 'Add a personal note (optional)...'}
            rows={4}
          />
        </div>

        <div className="share-preview">
          <h4>Preview</h4>
          <div className="preview-box">
            {generateShareText() || 'Your share message will appear here...'}
          </div>
        </div>

        <div className="share-actions">
          <h4>Share To</h4>
          <div className="platform-buttons">
            <button onClick={shareToTwitter} className="platform-btn twitter">
              🐦 Twitter
            </button>
            <button onClick={shareToLinkedIn} className="platform-btn linkedin">
              💼 LinkedIn
            </button>
            <button onClick={shareToFacebook} className="platform-btn facebook">
              📘 Facebook
            </button>
            <button onClick={copyToClipboard} className="platform-btn copy">
              📋 Copy Text
            </button>
            <button onClick={downloadAsImage} className="platform-btn download">
              📱 Download Image
            </button>
          </div>
        </div>

        {shareStatus && (
          <div className={`share-status ${shareStatus.includes('❌') ? 'error' : 'success'}`}>
            {shareStatus}
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialShare