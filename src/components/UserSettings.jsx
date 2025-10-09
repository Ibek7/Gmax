import React, { useState, useEffect } from 'react'

const UserSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'default',
    dailyWritingGoal: 500,
    dailyGameGoal: 3,
    enableNotifications: true,
    autoSave: true,
    displayName: '',
    preferredGenre: 'fantasy',
    difficultySetting: 'medium',
    soundEffects: true,
    animationSpeed: 'normal',
    compactMode: false,
    showTips: true,
    timeFormat: '12h',
    startPage: 'dashboard'
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prevSettings => ({ ...prevSettings, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings))
      setHasChanges(false)
      setSaveStatus('Settings saved successfully!')
      
      // Apply theme change immediately
      if (settings.theme) {
        const app = document.querySelector('.app')
        if (app) {
          app.className = `app theme-${settings.theme}`
        }
      }
      
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('Error saving settings')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings = {
        theme: 'default',
        dailyWritingGoal: 500,
        dailyGameGoal: 3,
        enableNotifications: true,
        autoSave: true,
        displayName: '',
        preferredGenre: 'fantasy',
        difficultySetting: 'medium',
        soundEffects: true,
        animationSpeed: 'normal',
        compactMode: false,
        showTips: true,
        timeFormat: '12h',
        startPage: 'dashboard'
      }
      setSettings(defaultSettings)
      setHasChanges(true)
    }
  }

  const exportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'gmax-settings.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting settings:', error)
    }
  }

  const importSettings = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result)
        setSettings(prev => ({ ...prev, ...importedSettings }))
        setHasChanges(true)
        setSaveStatus('Settings imported successfully!')
        setTimeout(() => setSaveStatus(''), 3000)
      } catch (error) {
        console.error('Error importing settings:', error)
        setSaveStatus('Error importing settings - invalid file format')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset file input
  }

  const SettingGroup = ({ title, children }) => (
    <div className="setting-group">
      <h3 className="setting-group-title">{title}</h3>
      <div className="setting-group-content">
        {children}
      </div>
    </div>
  )

  const SettingItem = ({ label, description, children }) => (
    <div className="setting-item">
      <div className="setting-info">
        <label className="setting-label">{label}</label>
        {description && <p className="setting-description">{description}</p>}
      </div>
      <div className="setting-control">
        {children}
      </div>
    </div>
  )

  const themes = [
    { value: 'default', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'neon', label: 'Neon', icon: '⚡' },
    { value: 'sunset', label: 'Sunset', icon: '🌅' },
    { value: 'ocean', label: 'Ocean', icon: '🌊' }
  ]

  return (
    <div className="user-settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <div className="settings-actions">
          {hasChanges && (
            <button onClick={saveSettings} className="save-btn">
              Save Changes
            </button>
          )}
          <button onClick={exportSettings} className="export-btn">
            Export
          </button>
          <label className="import-btn">
            Import
            <input 
              type="file" 
              accept=".json" 
              onChange={importSettings}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {saveStatus && (
        <div className={`save-status ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
          {saveStatus}
        </div>
      )}

      <div className="settings-content">
        <SettingGroup title="Appearance">
          <SettingItem 
            label="Theme" 
            description="Choose your preferred visual theme"
          >
            <div className="theme-grid">
              {themes.map(theme => (
                <button
                  key={theme.value}
                  onClick={() => handleSettingChange('theme', theme.value)}
                  className={`theme-option ${settings.theme === theme.value ? 'active' : ''}`}
                >
                  <span className="theme-icon">{theme.icon}</span>
                  <span className="theme-label">{theme.label}</span>
                </button>
              ))}
            </div>
          </SettingItem>

          <SettingItem 
            label="Animation Speed" 
            description="Control the speed of UI animations"
          >
            <select 
              value={settings.animationSpeed}
              onChange={(e) => handleSettingChange('animationSpeed', e.target.value)}
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
              <option value="none">Disabled</option>
            </select>
          </SettingItem>

          <SettingItem 
            label="Compact Mode" 
            description="Use more compact spacing throughout the interface"
          >
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </SettingItem>
        </SettingGroup>

        <SettingGroup title="Goals & Productivity">
          <SettingItem 
            label="Daily Writing Goal" 
            description="Target number of words to write each day"
          >
            <input
              type="number"
              value={settings.dailyWritingGoal}
              onChange={(e) => handleSettingChange('dailyWritingGoal', parseInt(e.target.value) || 0)}
              min="0"
              max="5000"
              step="50"
            />
          </SettingItem>

          <SettingItem 
            label="Daily Game Goal" 
            description="Target number of games to play each day"
          >
            <input
              type="number"
              value={settings.dailyGameGoal}
              onChange={(e) => handleSettingChange('dailyGameGoal', parseInt(e.target.value) || 0)}
              min="0"
              max="20"
            />
          </SettingItem>

          <SettingItem 
            label="Preferred Writing Genre" 
            description="Default genre for writing prompts"
          >
            <select 
              value={settings.preferredGenre}
              onChange={(e) => handleSettingChange('preferredGenre', e.target.value)}
            >
              <option value="fantasy">Fantasy</option>
              <option value="scifi">Science Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="drama">Drama</option>
              <option value="horror">Horror</option>
            </select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup title="Gaming">
          <SettingItem 
            label="Difficulty Setting" 
            description="Default difficulty level for games"
          >
            <select 
              value={settings.difficultySetting}
              onChange={(e) => handleSettingChange('difficultySetting', e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </SettingItem>

          <SettingItem 
            label="Sound Effects" 
            description="Enable audio feedback for games and interactions"
          >
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </SettingItem>
        </SettingGroup>

        <SettingGroup title="General">
          <SettingItem 
            label="Display Name" 
            description="Name displayed in the interface (optional)"
          >
            <input
              type="text"
              value={settings.displayName}
              onChange={(e) => handleSettingChange('displayName', e.target.value)}
              placeholder="Your name"
              maxLength="50"
            />
          </SettingItem>

          <SettingItem 
            label="Start Page" 
            description="Page to show when opening the app"
          >
            <select 
              value={settings.startPage}
              onChange={(e) => handleSettingChange('startPage', e.target.value)}
            >
              <option value="dashboard">Dashboard</option>
              <option value="writing">Creative Writing</option>
              <option value="games">Games Hub</option>
              <option value="productivity">Analytics</option>
            </select>
          </SettingItem>

          <SettingItem 
            label="Time Format" 
            description="Display time in 12-hour or 24-hour format"
          >
            <select 
              value={settings.timeFormat}
              onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </SettingItem>

          <SettingItem 
            label="Auto-Save" 
            description="Automatically save your progress"
          >
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </SettingItem>

          <SettingItem 
            label="Show Tips" 
            description="Display helpful tips and hints"
          >
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showTips}
                onChange={(e) => handleSettingChange('showTips', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </SettingItem>
        </SettingGroup>

        <SettingGroup title="Data Management">
          <div className="data-actions">
            <button onClick={resetSettings} className="reset-btn">
              Reset to Defaults
            </button>
            <div className="data-info">
              <p>Reset all settings to their default values. This action cannot be undone.</p>
            </div>
          </div>
        </SettingGroup>
      </div>
    </div>
  )
}

export default UserSettings