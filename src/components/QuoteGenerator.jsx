import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/QuoteGenerator.css'

const QuoteGenerator = () => {
  const navigate = useNavigate()
  const [currentQuote, setCurrentQuote] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFavorites, setShowFavorites] = useState(false)

  const quotes = {
    motivational: [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
    ],
    wisdom: [
      { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
      { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
      { text: "The mind is everything. What you think you become.", author: "Buddha" },
      { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" }
    ],
    success: [
      { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
      { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
      { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
      { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" }
    ],
    happiness: [
      { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
      { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
      { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
      { text: "Be happy for this moment. This moment is your life.", author: "Omar Khayyam" }
    ],
    life: [
      { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
      { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
      { text: "May you live every day of your life.", author: "Jonathan Swift" }
    ]
  }

  const categories = ['all', 'motivational', 'wisdom', 'success', 'happiness', 'life']

  useEffect(() => {
    const savedFavorites = localStorage.getItem('gmax_favorite_quotes')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    generateRandomQuote()
  }, [])

  const generateRandomQuote = () => {
    let categoryQuotes = []
    
    if (selectedCategory === 'all') {
      categoryQuotes = Object.values(quotes).flat()
    } else {
      categoryQuotes = quotes[selectedCategory] || []
    }

    if (categoryQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryQuotes.length)
      setCurrentQuote({
        ...categoryQuotes[randomIndex],
        category: selectedCategory === 'all' 
          ? Object.keys(quotes).find(key => quotes[key].includes(categoryQuotes[randomIndex]))
          : selectedCategory,
        id: Date.now()
      })
    }
  }

  const toggleFavorite = (quote) => {
    const isFavorite = favorites.some(f => f.text === quote.text)
    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = favorites.filter(f => f.text !== quote.text)
    } else {
      updatedFavorites = [...favorites, { ...quote, savedAt: new Date().toISOString() }]
    }

    setFavorites(updatedFavorites)
    localStorage.setItem('gmax_favorite_quotes', JSON.stringify(updatedFavorites))
  }

  const removeFavorite = (quote) => {
    const updatedFavorites = favorites.filter(f => f.text !== quote.text)
    setFavorites(updatedFavorites)
    localStorage.setItem('gmax_favorite_quotes', JSON.stringify(updatedFavorites))
  }

  const isFavorite = (quote) => {
    return favorites.some(f => f.text === quote.text)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const shareQuote = (quote) => {
    const text = `"${quote.text}" - ${quote.author}`
    if (navigator.share) {
      navigator.share({ text })
    } else {
      copyToClipboard(text)
      alert('Quote copied to clipboard!')
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      motivational: '💪',
      wisdom: '🧠',
      success: '🏆',
      happiness: '😊',
      life: '🌟',
      all: '✨'
    }
    return icons[category] || '💬'
  }

  const getCategoryColor = (category) => {
    const colors = {
      motivational: '#ff9800',
      wisdom: '#9c27b0',
      success: '#4caf50',
      happiness: '#ffeb3b',
      life: '#2196f3',
      all: '#e91e63'
    }
    return colors[category] || '#666'
  }

  if (showFavorites) {
    return (
      <div className="quote-generator-container">
        <div className="quote-header">
          <button className="back-btn" onClick={() => setShowFavorites(false)}>← Back</button>
          <h1>❤️ Favorite Quotes</h1>
        </div>

        <div className="favorites-grid">
          {favorites.map((quote, index) => (
            <div 
              key={index} 
              className="favorite-card"
              style={{ borderLeftColor: getCategoryColor(quote.category) }}
            >
              <div className="favorite-category">
                {getCategoryIcon(quote.category)} {quote.category}
              </div>
              <p className="favorite-text">"{quote.text}"</p>
              <div className="favorite-author">— {quote.author}</div>
              <div className="favorite-actions">
                <button onClick={() => shareQuote(quote)} className="action-btn">
                  📤 Share
                </button>
                <button onClick={() => removeFavorite(quote)} className="action-btn remove">
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {favorites.length === 0 && (
          <div className="empty-favorites">
            <p>No favorite quotes yet. Start adding some!</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="quote-generator-container">
      <div className="quote-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💭 Quote Generator</h1>
      </div>

      <div className="category-selector">
        {categories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            style={{ 
              background: selectedCategory === category ? getCategoryColor(category) : ''
            }}
            onClick={() => {
              setSelectedCategory(category)
              setTimeout(generateRandomQuote, 100)
            }}
          >
            {getCategoryIcon(category)} {category}
          </button>
        ))}
      </div>

      {currentQuote && (
        <div className="quote-display">
          <div 
            className="quote-card"
            style={{ borderColor: getCategoryColor(currentQuote.category) }}
          >
            <div className="quote-category-badge" style={{ background: getCategoryColor(currentQuote.category) }}>
              {getCategoryIcon(currentQuote.category)} {currentQuote.category}
            </div>
            <div className="quote-icon">❝</div>
            <p className="quote-text">{currentQuote.text}</p>
            <div className="quote-author">— {currentQuote.author}</div>
            
            <div className="quote-actions">
              <button 
                onClick={() => toggleFavorite(currentQuote)} 
                className={`favorite-btn ${isFavorite(currentQuote) ? 'active' : ''}`}
              >
                {isFavorite(currentQuote) ? '❤️ Favorited' : '🤍 Favorite'}
              </button>
              <button onClick={() => copyToClipboard(`"${currentQuote.text}" - ${currentQuote.author}`)} className="copy-btn">
                📋 Copy
              </button>
              <button onClick={() => shareQuote(currentQuote)} className="share-btn">
                📤 Share
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="generator-controls">
        <button onClick={generateRandomQuote} className="generate-btn">
          🎲 New Quote
        </button>
        <button onClick={() => setShowFavorites(true)} className="view-favorites-btn">
          ❤️ View Favorites ({favorites.length})
        </button>
      </div>

      <div className="quote-stats">
        <div className="stat-item">
          <span className="stat-value">{Object.values(quotes).flat().length}</span>
          <span className="stat-label">Total Quotes</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{favorites.length}</span>
          <span className="stat-label">Favorites</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{categories.length - 1}</span>
          <span className="stat-label">Categories</span>
        </div>
      </div>
    </div>
  )
}

export default QuoteGenerator
