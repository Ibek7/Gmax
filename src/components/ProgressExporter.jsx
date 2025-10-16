import React, { useState } from 'react'
// Note: html2canvas would need to be installed: npm install html2canvas
// For now, we'll use a simpler canvas-based approach
import '../styles/ProgressExporter.css'

const ProgressExporter = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const getProgressData = () => {
    const analytics = JSON.parse(localStorage.getItem('gmaxAnalytics') || '{}')
    const achievements = JSON.parse(localStorage.getItem('gmaxAchievements') || '[]')
    
    return {
      totalMinutes: analytics.totalMinutes || 0,
      gamesPlayed: analytics.gamesPlayed || 0,
      currentStreak: analytics.currentStreak || 0,
      achievementsCount: achievements.filter(a => a.unlocked).length || 0,
      totalAchievements: achievements.length || 8
    }
  }

  const generateShareableCard = async () => {
    setIsExporting(true)
    
    const data = getProgressData()
    
    try {
      // Create canvas for the share card
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 800
      const ctx = canvas.getContext('2d')
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(1, '#764ba2')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Title
      ctx.fillStyle = 'white'
      ctx.font = 'bold 72px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('🏆 My Gmax Progress', canvas.width / 2, 120)
      
      // Stats boxes
      const stats = [
        { value: data.totalMinutes, label: 'Minutes Focused', x: 200, y: 300 },
        { value: data.gamesPlayed, label: 'Games Played', x: 700, y: 300 },
        { value: `${data.currentStreak}🔥`, label: 'Day Streak', x: 200, y: 550 },
        { value: `${data.achievementsCount}/${data.totalAchievements}`, label: 'Achievements', x: 700, y: 550 }
      ]
      
      stats.forEach(stat => {
        // Box background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.fillRect(stat.x - 150, stat.y - 80, 300, 160)
        
        // Value
        ctx.fillStyle = 'white'
        ctx.font = 'bold 56px -apple-system, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(String(stat.value), stat.x, stat.y)
        
        // Label
        ctx.font = '24px -apple-system, sans-serif'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.fillText(stat.label, stat.x, stat.y + 50)
      })
      
      // Footer
      ctx.font = '20px -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillText('Gmax Creative Studio • Track Your Creativity', canvas.width / 2, 720)
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `gmax-progress-${Date.now()}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        
        setExportSuccess(true)
        setTimeout(() => setExportSuccess(false), 3000)
      })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsJSON = () => {
    const data = {
      analytics: JSON.parse(localStorage.getItem('gmaxAnalytics') || '{}'),
      achievements: JSON.parse(localStorage.getItem('gmaxAchievements') || '[]'),
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `gmax-data-${Date.now()}.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  return (
    <div className="progress-exporter">
      <header className="exporter-header">
        <h1>📤 Export & Share</h1>
        <p>Share your creative journey with the world</p>
      </header>

      <div className="export-options">
        <div className="export-card">
          <div className="export-icon">🖼️</div>
          <h3>Share as Image</h3>
          <p>Generate a beautiful shareable card with your progress stats</p>
          <button 
            className="export-btn"
            onClick={generateShareableCard}
            disabled={isExporting}
          >
            {isExporting ? 'Generating...' : 'Create Share Card'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">📊</div>
          <h3>Export Data</h3>
          <p>Download all your progress data as JSON for backup or analysis</p>
          <button 
            className="export-btn"
            onClick={exportAsJSON}
          >
            Export JSON
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="export-success">
          ✓ Export completed successfully!
        </div>
      )}

      <div className="export-preview">
        <h2>Preview</h2>
        <div className="preview-card">
          <div className="preview-stats">
            {(() => {
              const data = getProgressData()
              return (
                <>
                  <div className="preview-stat">
                    <strong>{data.totalMinutes}</strong>
                    <span>min focused</span>
                  </div>
                  <div className="preview-stat">
                    <strong>{data.gamesPlayed}</strong>
                    <span>games</span>
                  </div>
                  <div className="preview-stat">
                    <strong>{data.currentStreak}🔥</strong>
                    <span>streak</span>
                  </div>
                  <div className="preview-stat">
                    <strong>{data.achievementsCount}/{data.totalAchievements}</strong>
                    <span>achievements</span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressExporter
