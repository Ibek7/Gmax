export const writingPrompts = {
  fantasy: [
    "A world where magic is powered by memories",
    "Dragons that collect stories instead of gold",
    "A library where books write themselves",
    "Magic that only works when no one is watching",
    "A kingdom where emotions control the weather",
    "Every lie you tell becomes a physical object",
    "A spell that lets you experience the last day of anyone who died",
    "Trees that grow from buried secrets",
    "A mirror that shows what you could have been",
    "Flowers that bloom only when someone tells the truth"
  ],
  scifi: [
    "First contact happens through dreams",
    "Time travel, but you can only go backwards one day",
    "AI that experiences emotions through music",
    "A planet where thoughts are visible as colors",
    "Teleportation exists, but you swap places with someone random",
    "Humans discover they're NPCs in an alien video game",
    "Memory can be extracted and sold as entertainment",
    "A virus that makes people unable to lie",
    "Gravity stops working for exactly 7 minutes every day",
    "You receive emails from parallel universe versions of yourself"
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
    "Characters who can only communicate through art",
    "A family reunion where everyone pretends nothing has changed",
    "Two strangers stuck in an elevator sharing their deepest secrets",
    "A parent discovers their child's diary from 20 years ago",
    "The day before retirement, everything you believed turns out to be false",
    "A wedding where the bride and groom have never met"
  ],
  horror: [
    "Your reflection starts acting independently",
    "A house that rearranges itself when you sleep",
    "Shadows that whisper secrets about the future",
    "A phone that receives calls from your past selves",
    "Mirrors that show who you could have become",
    "Every door in your house leads to a different time period",
    "You wake up to find everyone else has vanished, except the mannequins",
    "Your childhood imaginary friend returns as an adult",
    "A music box that plays a different tune each night, predicting tomorrow's tragedy",
    "Photographs in your album start changing when you're not looking"
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