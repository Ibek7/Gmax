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
    requirement: 'Play 1 game'
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    description: 'Score 50+ in Color Memory',
    icon: '🧠',
    requirement: 'Score 50+ in Color Memory'
  },
  {
    id: 'word_wizard',
    title: 'Word Wizard',
    description: 'Create a 10-word chain',
    icon: '✨',
    requirement: 'Create a 10-word chain'
  },
  {
    id: 'pattern_pro',
    title: 'Pattern Pro',
    description: 'Complete 5 pattern puzzles',
    icon: '🧩',
    requirement: 'Complete 5 pattern puzzles'
  },
  {
    id: 'rhythm_rock',
    title: 'Rhythm Rock',
    description: 'Perfect rhythm score',
    icon: '🎵',
    requirement: 'Get 100% accuracy in Rhythm Tap'
  },
  {
    id: 'daily_player',
    title: 'Daily Player',
    description: 'Play games 7 days in a row',
    icon: '📅',
    requirement: 'Play 7 consecutive days'
  }
]

export const checkAchievements = (gameStats) => {
  const unlockedAchievements = []
  
  achievements.forEach(achievement => {
    // Achievement checking logic would go here
    // This is a placeholder for the actual implementation
  })
  
  return unlockedAchievements
}