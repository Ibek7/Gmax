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
  }
]

export const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export const getQuotesByCategory = (category) => {
  return quotes.filter(quote => quote.category === category)
}