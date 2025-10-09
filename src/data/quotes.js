export const quotes = [
  {
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "creativity"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "motivation"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "innovation"
  },
  {
    text: "Imagination is more important than knowledge.",
    author: "Albert Einstein",
    category: "imagination"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion"
  },
  {
    text: "Creativity takes courage.",
    author: "Henri Matisse",
    category: "courage"
  },
  {
    text: "You can't use up creativity. The more you use, the more you have.",
    author: "Maya Angelou",
    category: "creativity"
  },
  {
    text: "Every artist was first an amateur.",
    author: "Ralph Waldo Emerson",
    category: "learning"
  },
  {
    text: "The secret to creativity is knowing how to hide your sources.",
    author: "Pablo Picasso",
    category: "creativity"
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
    category: "innovation"
  },
  {
    text: "Logic will get you from A to Z; imagination will get you everywhere.",
    author: "Albert Einstein",
    category: "imagination"
  },
  {
    text: "The artist is nothing without the gift, but the gift is nothing without work.",
    author: "Émile Zola",
    category: "dedication"
  },
  {
    text: "Inspiration exists, but it has to find you working.",
    author: "Pablo Picasso",
    category: "inspiration"
  },
  {
    text: "The worst enemy to creativity is self-doubt.",
    author: "Sylvia Plath",
    category: "confidence"
  },
  {
    text: "Art is not what you see, but what you make others see.",
    author: "Edgar Degas",
    category: "perspective"
  }
]

export const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export const getQuotesByCategory = (category) => {
  return quotes.filter(quote => quote.category === category)
}