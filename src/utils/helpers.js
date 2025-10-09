// Utility functions for date and time
export const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Color utilities
export const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 60%)`
}

export const getColorPalette = (baseColor) => {
  // Generate complementary colors based on a base color
  const palettes = {
    warm: ['#ff6b6b', '#ffa726', '#ffcc02', '#ff8a65'],
    cool: ['#4ecdc4', '#45b7d1', '#96ceb4', '#85c1e9'],
    neon: ['#00ff88', '#ff0080', '#0080ff', '#ffff00'],
    pastel: ['#ffd1dc', '#e6e6fa', '#b0e0e6', '#f0fff0']
  }
  
  return palettes[baseColor] || palettes.cool
}

// Animation utilities
export const easeInOut = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min
}

// Local storage utilities
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
    return false
  }
}

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return defaultValue
  }
}

// Progress tracking utilities
export const calculateProgress = (completed, total) => {
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

export const getDailyGoalProgress = () => {
  const today = new Date().toDateString()
  const dailyData = loadFromStorage('dailyProgress', {})
  
  if (!dailyData[today]) {
    dailyData[today] = {
      tasksCompleted: 0,
      creativityScore: 0,
      timeSpent: 0,
      gamesPlayed: 0,
      wordsWritten: 0
    }
  }
  
  return dailyData[today]
}

export const updateDailyProgress = (updates) => {
  const today = new Date().toDateString()
  const dailyData = loadFromStorage('dailyProgress', {})
  
  if (!dailyData[today]) {
    dailyData[today] = {
      tasksCompleted: 0,
      creativityScore: 0,
      timeSpent: 0,
      gamesPlayed: 0,
      wordsWritten: 0
    }
  }
  
  dailyData[today] = { ...dailyData[today], ...updates }
  saveToStorage('dailyProgress', dailyData)
  
  return dailyData[today]
}

// Game statistics utilities
export const saveGameScore = (gameId, score) => {
  const gameStats = loadFromStorage('gameStats', {})
  
  if (!gameStats[gameId]) {
    gameStats[gameId] = {
      highScore: 0,
      totalPlays: 0,
      totalScore: 0
    }
  }
  
  gameStats[gameId].totalPlays += 1
  gameStats[gameId].totalScore += score
  gameStats[gameId].highScore = Math.max(gameStats[gameId].highScore, score)
  
  saveToStorage('gameStats', gameStats)
  
  // Update daily progress
  updateDailyProgress({ gamesPlayed: getDailyGoalProgress().gamesPlayed + 1 })
  
  return gameStats[gameId]
}

export const getGameStats = (gameId) => {
  const gameStats = loadFromStorage('gameStats', {})
  return gameStats[gameId] || { highScore: 0, totalPlays: 0, totalScore: 0 }
}