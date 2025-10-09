export const writingPrompts = {
  fantasy: [
    "A world where magic is powered by memories",
    "Dragons that collect stories instead of gold",
    "A library where books write themselves",
    "Magic that only works when no one is watching",
    "A kingdom where emotions control the weather"
  ],
  scifi: [
    "First contact happens through dreams",
    "Time travel, but you can only go backwards one day",
    "AI that experiences emotions through music",
    "A planet where thoughts are visible as colors",
    "Teleportation exists, but you swap places with someone random"
  ],
  mystery: [
    "A detective who solves crimes by tasting objects",
    "Missing persons who return with no memory but new skills",
    "A murder weapon that doesn't exist yet",
    "Crime scenes that change when no one is looking",
    "A thief who steals abstract concepts"
  ],
  drama: [
    "A character who can hear everyone's inner monologue",
    "The last conversation before a life-changing decision",
    "Someone discovers their life is being broadcast as a TV show",
    "A person who ages backwards emotionally",
    "Characters who can only communicate through art"
  ],
  horror: [
    "Your reflection starts acting independently",
    "A house that rearranges itself when you sleep",
    "Shadows that whisper secrets about the future",
    "A phone that receives calls from your past selves",
    "Mirrors that show who you could have become"
  ]
}

export const getRandomPrompt = (genre = null) => {
  if (genre && writingPrompts[genre]) {
    const prompts = writingPrompts[genre]
    return prompts[Math.floor(Math.random() * prompts.length)]
  }
  
  const allPrompts = Object.values(writingPrompts).flat()
  return allPrompts[Math.floor(Math.random() * allPrompts.length)]
}

export const getPromptsCount = () => {
  return Object.values(writingPrompts).reduce((total, prompts) => total + prompts.length, 0)
}