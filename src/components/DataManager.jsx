import React, { useState } from 'react'

const DataManager = () => {
  const [exportStatus, setExportStatus] = useState('')
  const [importStatus, setImportStatus] = useState('')
  const [selectedDataTypes, setSelectedDataTypes] = useState({
    settings: true,
    writingDrafts: true,
    gameStats: true,
    achievements: true,
    dailyProgress: true,
    quotes: false,
    prompts: false
  })

  const clearStatus = (type) => {
    setTimeout(() => {
      if (type === 'export') setExportStatus('')
      if (type === 'import') setImportStatus('')
    }, 3000)
  }

  const gatherExportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      data: {}
    }

    try {
      if (selectedDataTypes.settings) {
        const settings = localStorage.getItem('userSettings')
        if (settings) exportData.data.settings = JSON.parse(settings)
      }

      if (selectedDataTypes.writingDrafts) {
        const drafts = localStorage.getItem('writingDrafts')
        if (drafts) exportData.data.writingDrafts = JSON.parse(drafts)
      }

      if (selectedDataTypes.gameStats) {
        const gameStats = localStorage.getItem('gameStats')
        if (gameStats) exportData.data.gameStats = JSON.parse(gameStats)
      }

      if (selectedDataTypes.achievements) {
        const achievements = localStorage.getItem('unlockedAchievements')
        if (achievements) exportData.data.achievements = JSON.parse(achievements)
      }

      if (selectedDataTypes.dailyProgress) {
        const dailyProgress = localStorage.getItem('dailyProgress')
        if (dailyProgress) exportData.data.dailyProgress = JSON.parse(dailyProgress)
      }

      if (selectedDataTypes.quotes) {
        const customQuotes = localStorage.getItem('customQuotes')
        if (customQuotes) exportData.data.customQuotes = JSON.parse(customQuotes)
      }

      if (selectedDataTypes.prompts) {
        const customPrompts = localStorage.getItem('customPrompts')
        if (customPrompts) exportData.data.customPrompts = JSON.parse(customPrompts)
      }

      return exportData
    } catch (error) {
      console.error('Error gathering export data:', error)
      throw new Error('Failed to gather export data')
    }
  }

  const exportData = () => {
    try {
      const data = gatherExportData()
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `gmax-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      URL.revokeObjectURL(url)
      setExportStatus('✅ Data exported successfully!')
      clearStatus('export')
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('❌ Export failed: ' + error.message)
      clearStatus('export')
    }
  }

  const exportWritingDrafts = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('writingDrafts') || '[]')
      if (drafts.length === 0) {
        setExportStatus('⚠️ No writing drafts to export')
        clearStatus('export')
        return
      }

      // Create a text file with all drafts
      let content = 'Gmax Creative Studio - Writing Drafts Export\n'
      content += '=' .repeat(50) + '\n\n'
      
      drafts.forEach((draft, index) => {
        content += `Draft ${index + 1}\n`
        content += `Created: ${new Date(draft.timestamp).toLocaleString()}\n`
        content += `Genre: ${draft.genre || 'General'}\n`
        content += `Word Count: ${draft.content.split(' ').length}\n`
        content += '-'.repeat(30) + '\n'
        content += draft.content + '\n\n'
      })

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `gmax-writing-drafts-${new Date().toISOString().split('T')[0]}.txt`
      link.click()
      
      URL.revokeObjectURL(url)
      setExportStatus(`✅ Exported ${drafts.length} writing drafts!`)
      clearStatus('export')
    } catch (error) {
      console.error('Writing export error:', error)
      setExportStatus('❌ Failed to export writing drafts')
      clearStatus('export')
    }
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        
        if (!importedData.data || !importedData.version) {
          throw new Error('Invalid backup file format')
        }

        let importCount = 0
        const data = importedData.data

        // Import each data type
        if (selectedDataTypes.settings && data.settings) {
          localStorage.setItem('userSettings', JSON.stringify(data.settings))
          importCount++
        }

        if (selectedDataTypes.writingDrafts && data.writingDrafts) {
          // Merge with existing drafts
          const existingDrafts = JSON.parse(localStorage.getItem('writingDrafts') || '[]')
          const mergedDrafts = [...existingDrafts, ...data.writingDrafts]
          localStorage.setItem('writingDrafts', JSON.stringify(mergedDrafts))
          importCount++
        }

        if (selectedDataTypes.gameStats && data.gameStats) {
          // Merge game statistics
          const existingStats = JSON.parse(localStorage.getItem('gameStats') || '{}')
          const mergedStats = { ...existingStats, ...data.gameStats }
          localStorage.setItem('gameStats', JSON.stringify(mergedStats))
          importCount++
        }

        if (selectedDataTypes.achievements && data.achievements) {
          // Merge achievements
          const existingAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
          const mergedAchievements = [...new Set([...existingAchievements, ...data.achievements])]
          localStorage.setItem('unlockedAchievements', JSON.stringify(mergedAchievements))
          importCount++
        }

        if (selectedDataTypes.dailyProgress && data.dailyProgress) {
          // Merge daily progress
          const existingProgress = JSON.parse(localStorage.getItem('dailyProgress') || '{}')
          const mergedProgress = { ...existingProgress, ...data.dailyProgress }
          localStorage.setItem('dailyProgress', JSON.stringify(mergedProgress))
          importCount++
        }

        if (selectedDataTypes.quotes && data.customQuotes) {
          localStorage.setItem('customQuotes', JSON.stringify(data.customQuotes))
          importCount++
        }

        if (selectedDataTypes.prompts && data.customPrompts) {
          localStorage.setItem('customPrompts', JSON.stringify(data.customPrompts))
          importCount++
        }

        setImportStatus(`✅ Successfully imported ${importCount} data categories!`)
        clearStatus('import')
      } catch (error) {
        console.error('Import error:', error)
        setImportStatus('❌ Import failed: ' + error.message)
        clearStatus('import')
      }
    }
    
    reader.readAsText(file)
    event.target.value = '' // Reset file input
  }

  const clearAllData = () => {
    if (window.confirm('⚠️ This will permanently delete ALL your data. Are you absolutely sure?')) {
      if (window.confirm('🚨 Last chance! This action cannot be undone. Continue?')) {
        try {
          // Clear all application data
          const keysToRemove = [
            'userSettings', 'writingDrafts', 'gameStats', 
            'unlockedAchievements', 'dailyProgress', 
            'customQuotes', 'customPrompts'
          ]
          
          keysToRemove.forEach(key => localStorage.removeItem(key))
          
          setImportStatus('✅ All data cleared successfully')
          clearStatus('import')
        } catch (error) {
          setImportStatus('❌ Failed to clear data')
          clearStatus('import')
        }
      }
    }
  }

  const getDataSize = () => {
    try {
      const data = gatherExportData()
      const size = new Blob([JSON.stringify(data)]).size
      return (size / 1024).toFixed(2) + ' KB'
    } catch {
      return 'N/A'
    }
  }

  const handleDataTypeChange = (type) => {
    setSelectedDataTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  return (
    <div className="data-manager">
      <div className="manager-header">
        <h1>Data Management</h1>
        <p>Export, import, and manage your Gmax Creative Studio data</p>
      </div>

      <div className="data-selection">
        <h3>Select Data to Export/Import</h3>
        <div className="data-types-grid">
          {Object.entries(selectedDataTypes).map(([type, selected]) => (
            <label key={type} className="data-type-checkbox">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => handleDataTypeChange(type)}
              />
              <span className="checkbox-label">
                {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="data-sections">
        <div className="section export-section">
          <h2>📤 Export Data</h2>
          <p>Download your data as backup files</p>
          
          <div className="export-options">
            <div className="export-option">
              <h4>Complete Backup</h4>
              <p>Export all selected data types in JSON format</p>
              <div className="export-info">
                <span>Estimated size: {getDataSize()}</span>
              </div>
              <button onClick={exportData} className="export-btn">
                Export Complete Backup
              </button>
            </div>
            
            <div className="export-option">
              <h4>Writing Drafts Only</h4>
              <p>Export writing drafts as readable text file</p>
              <button onClick={exportWritingDrafts} className="export-btn secondary">
                Export Writing Drafts
              </button>
            </div>
          </div>
          
          {exportStatus && (
            <div className={`status-message ${exportStatus.includes('❌') ? 'error' : 'success'}`}>
              {exportStatus}
            </div>
          )}
        </div>

        <div className="section import-section">
          <h2>📥 Import Data</h2>
          <p>Restore data from backup files</p>
          
          <div className="import-controls">
            <label className="import-btn">
              Choose Backup File
              <input 
                type="file" 
                accept=".json" 
                onChange={importData}
                style={{ display: 'none' }}
              />
            </label>
            <p className="import-note">
              Select a JSON backup file exported from Gmax Creative Studio
            </p>
          </div>
          
          {importStatus && (
            <div className={`status-message ${importStatus.includes('❌') ? 'error' : 'success'}`}>
              {importStatus}
            </div>
          )}
        </div>

        <div className="section danger-section">
          <h2>🗑️ Data Management</h2>
          <p>Permanently delete all application data</p>
          
          <div className="danger-controls">
            <button onClick={clearAllData} className="danger-btn">
              Clear All Data
            </button>
            <p className="danger-warning">
              ⚠️ This action cannot be undone. Make sure to export your data first!
            </p>
          </div>
        </div>
      </div>

      <div className="data-info">
        <h3>💡 Data Management Tips</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>Regular Backups</h4>
            <p>Export your data weekly to avoid losing progress</p>
          </div>
          <div className="tip">
            <h4>Selective Import</h4>
            <p>Choose specific data types when importing to avoid conflicts</p>
          </div>
          <div className="tip">
            <h4>File Format</h4>
            <p>Backup files are in JSON format and can be edited manually if needed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataManager