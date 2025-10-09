export const gameTemplates = {
  colorMemory: {
    name: 'Color Memory Game',
    description: 'Remember and repeat color sequences',
    difficulty: 'Easy',
    minScore: 0,
    maxScore: 100,
    timeLimit: 60,
    instructions: [
      'Watch the sequence of colors',
      'Click the colors in the same order',
      'Each round adds one more color',
      'Get as far as you can!'
    ]
  },
  
  wordChain: {
    name: 'Word Chain Challenge',
    description: 'Create chains of related words',
    difficulty: 'Medium',
    minScore: 0,
    maxScore: 200,
    timeLimit: 120,
    instructions: [
      'Start with the given word',
      'Each new word must relate to the previous',
      'Longer chains score more points',
      'Be creative with connections!'
    ]
  },
  
  patternPuzzle: {
    name: 'Pattern Recognition',
    description: 'Identify and complete geometric patterns',
    difficulty: 'Hard',
    minScore: 0,
    maxScore: 300,
    timeLimit: 180,
    instructions: [
      'Study the pattern carefully',
      'Identify the missing piece',
      'Patterns get more complex each level',
      'Think logically and creatively!'
    ]
  },
  
  rhythmTap: {
    name: 'Rhythm Tap Master',
    description: 'Follow beats and create music',
    difficulty: 'Medium',
    minScore: 0,
    maxScore: 150,
    timeLimit: 90,
    instructions: [
      'Listen to the rhythm pattern',
      'Tap the beat back accurately',
      'Timing is everything',
      'Feel the music!'
    ]
  }
}

export const achievements = [
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    requirement: 'Play 1 game',
    points: 10
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Score 50+ in Color Memory',
    icon: '🧠',
    requirement: 'Score 50+ in Color Memory',
    points: 25
  },
  {
    id: 'perfect_start',
    title: 'Perfect Start',
    description: 'Score 10+ on your first try',
    icon: '⭐',
    requirement: 'Score 10+ on first game',
    points: 20
  },
  {
    id: 'word_wizard',
    title: 'Word Wizard',
    description: 'Create a 10-word chain',
    icon: '✨',
    requirement: 'Create a 10-word chain',
    points: 30
  },
  {
    id: 'pattern_pro',
    title: 'Pattern Pro',
    description: 'Complete 5 pattern puzzles',
    icon: '🧩',
    requirement: 'Complete 5 pattern puzzles',
    points: 35
  },
  {
    id: 'rhythm_rock',
    title: 'Rhythm Rock',
    description: 'Perfect rhythm score',
    icon: '🎵',
    requirement: 'Get 100% accuracy in Rhythm Tap',
    points: 40
  },
  {
    id: 'daily_player',
    title: 'Daily Player',
    description: 'Play games 7 days in a row',
    icon: '📅',
    requirement: 'Play 7 consecutive days',
    points: 50
  },
  {
    id: 'high_achiever',
    title: 'High Achiever',
    description: 'Earn 100 total points',
    icon: '🏆',
    requirement: 'Accumulate 100 achievement points',
    points: 100
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a sequence in under 2 seconds',
    icon: '⚡',
    requirement: 'Fast Color Memory completion',
    points: 25
  },
  {
    id: 'persistent',
    title: 'Persistent',
    description: 'Play 25 games total',
    icon: '💪',
    requirement: 'Play 25 games across all categories',
    points: 30
  }
]

export const checkAchievements = (gameStats, dailyProgress) => {
  const unlockedAchievements = []
  const currentAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
  
  achievements.forEach(achievement => {
    // Skip if already unlocked
    if (currentAchievements.includes(achievement.id)) return
    
    let shouldUnlock = false
    
    switch (achievement.id) {
      case 'first_game':
        shouldUnlock = Object.values(gameStats).some(stats => stats.totalPlays >= 1)
        break
      case 'memory_master':
        shouldUnlock = gameStats['color-memory']?.highScore >= 50
        break
      case 'perfect_start':
        shouldUnlock = gameStats['color-memory']?.highScore >= 10 && gameStats['color-memory']?.totalPlays === 1
        break
      case 'daily_player':
        // Check if played games for 7 consecutive days
        const today = new Date()
        let consecutiveDays = 0
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() - i)
          const dateString = checkDate.toDateString()
          const dayProgress = JSON.parse(localStorage.getItem('dailyProgress') || '{}')[dateString]
          if (dayProgress?.gamesPlayed > 0) {
            consecutiveDays++
          } else {
            break
          }
        }
        shouldUnlock = consecutiveDays >= 7
        break
      case 'high_achiever':
        const totalPoints = currentAchievements.reduce((sum, achId) => {
          const ach = achievements.find(a => a.id === achId)
          return sum + (ach?.points || 0)
        }, 0)
        shouldUnlock = totalPoints >= 100
        break
      case 'persistent':
        const totalGames = Object.values(gameStats).reduce((sum, stats) => sum + stats.totalPlays, 0)
        shouldUnlock = totalGames >= 25
        break
      default:
        break
    }
    
    if (shouldUnlock) {
      unlockedAchievements.push(achievement)
      currentAchievements.push(achievement.id)
    }
  })
  
  // Save updated achievements
  if (unlockedAchievements.length > 0) {
    localStorage.setItem('unlockedAchievements', JSON.stringify(currentAchievements))
  }
  
  return unlockedAchievements
}

export const getUnlockedAchievements = () => {
  const unlockedIds = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
  return achievements.filter(achievement => unlockedIds.includes(achievement.id))
}

export const getTotalAchievementPoints = () => {
  const unlockedAchievements = getUnlockedAchievements()
  return unlockedAchievements.reduce((sum, achievement) => sum + achievement.points, 0)
}