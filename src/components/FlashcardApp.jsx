import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FlashcardApp.css'

const FlashcardApp = () => {
  const navigate = useNavigate()
  const [decks, setDecks] = useState([])
  const [currentDeck, setCurrentDeck] = useState(null)
  const [studyMode, setStudyMode] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAddDeck, setShowAddDeck] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  
  const [deckName, setDeckName] = useState('')
  const [deckCategory, setDeckCategory] = useState('general')
  const [cardFront, setCardFront] = useState('')
  const [cardBack, setCardBack] = useState('')

  const categories = ['general', 'language', 'science', 'history', 'math', 'programming', 'other']

  useEffect(() => {
    const savedDecks = localStorage.getItem('gmax_flashcard_decks')
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks))
    } else {
      const sampleDecks = [
        {
          id: 1,
          name: 'Spanish Basics',
          category: 'language',
          cards: [
            { id: 1, front: 'Hello', back: 'Hola', mastery: 0 },
            { id: 2, front: 'Goodbye', back: 'Adiós', mastery: 0 },
            { id: 3, front: 'Thank you', back: 'Gracias', mastery: 0 }
          ],
          createdAt: new Date().toISOString()
        }
      ]
      setDecks(sampleDecks)
      localStorage.setItem('gmax_flashcard_decks', JSON.stringify(sampleDecks))
    }
  }, [])

  const saveDecks = (updatedDecks) => {
    setDecks(updatedDecks)
    localStorage.setItem('gmax_flashcard_decks', JSON.stringify(updatedDecks))
  }

  const addDeck = (e) => {
    e.preventDefault()
    const deck = {
      id: Date.now(),
      name: deckName,
      category: deckCategory,
      cards: [],
      createdAt: new Date().toISOString()
    }
    saveDecks([...decks, deck])
    setDeckName('')
    setDeckCategory('general')
    setShowAddDeck(false)
  }

  const deleteDeck = (id) => {
    saveDecks(decks.filter(d => d.id !== id))
    if (currentDeck?.id === id) {
      setCurrentDeck(null)
      setStudyMode(false)
    }
  }

  const addCard = (e) => {
    e.preventDefault()
    const card = {
      id: Date.now(),
      front: cardFront,
      back: cardBack,
      mastery: 0
    }
    
    const updatedDecks = decks.map(d =>
      d.id === currentDeck.id
        ? { ...d, cards: [...d.cards, card] }
        : d
    )
    
    saveDecks(updatedDecks)
    setCurrentDeck(updatedDecks.find(d => d.id === currentDeck.id))
    setCardFront('')
    setCardBack('')
    setShowAddCard(false)
  }

  const deleteCard = (cardId) => {
    const updatedDecks = decks.map(d =>
      d.id === currentDeck.id
        ? { ...d, cards: d.cards.filter(c => c.id !== cardId) }
        : d
    )
    
    saveDecks(updatedDecks)
    setCurrentDeck(updatedDecks.find(d => d.id === currentDeck.id))
  }

  const startStudy = (deck) => {
    setCurrentDeck(deck)
    setStudyMode(true)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const markMastery = (level) => {
    const updatedDecks = decks.map(d =>
      d.id === currentDeck.id
        ? {
            ...d,
            cards: d.cards.map((c, i) =>
              i === currentCardIndex ? { ...c, mastery: level } : c
            )
          }
        : d
    )
    
    saveDecks(updatedDecks)
    setCurrentDeck(updatedDecks.find(d => d.id === currentDeck.id))
    nextCard()
  }

  const nextCard = () => {
    if (currentCardIndex < currentDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setStudyMode(false)
      setCurrentCardIndex(0)
    }
  }

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const getMasteryStats = (deck) => {
    if (deck.cards.length === 0) return { mastered: 0, learning: 0, new: 0 }
    const mastered = deck.cards.filter(c => c.mastery >= 3).length
    const learning = deck.cards.filter(c => c.mastery > 0 && c.mastery < 3).length
    const newCards = deck.cards.filter(c => c.mastery === 0).length
    return { mastered, learning, new: newCards }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      general: '📚',
      language: '🗣️',
      science: '🔬',
      history: '📜',
      math: '🔢',
      programming: '💻',
      other: '📝'
    }
    return icons[category] || '📚'
  }

  if (studyMode && currentDeck && currentDeck.cards.length > 0) {
    const currentCard = currentDeck.cards[currentCardIndex]
    
    return (
      <div className="flashcard-app-container">
        <div className="study-header">
          <button className="back-btn" onClick={() => setStudyMode(false)}>← Exit Study</button>
          <h2>{currentDeck.name}</h2>
          <div className="card-progress">
            {currentCardIndex + 1} / {currentDeck.cards.length}
          </div>
        </div>

        <div className="study-area">
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <span className="card-label">Question</span>
                <p>{currentCard.front}</p>
                <span className="flip-hint">Click to flip</span>
              </div>
              <div className="flashcard-back">
                <span className="card-label">Answer</span>
                <p>{currentCard.back}</p>
                <span className="flip-hint">Click to flip back</span>
              </div>
            </div>
          </div>

          <div className="mastery-buttons">
            <button onClick={() => markMastery(1)} className="mastery-btn hard">
              😰 Hard
            </button>
            <button onClick={() => markMastery(2)} className="mastery-btn medium">
              🤔 Medium
            </button>
            <button onClick={() => markMastery(3)} className="mastery-btn easy">
              😊 Easy
            </button>
          </div>

          <div className="navigation-buttons">
            <button 
              onClick={previousCard} 
              disabled={currentCardIndex === 0}
              className="nav-btn"
            >
              ← Previous
            </button>
            <button 
              onClick={nextCard}
              className="nav-btn"
            >
              {currentCardIndex === currentDeck.cards.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentDeck) {
    const stats = getMasteryStats(currentDeck)
    
    return (
      <div className="flashcard-app-container">
        <div className="flashcard-header">
          <button className="back-btn" onClick={() => setCurrentDeck(null)}>← Back to Decks</button>
          <h1>{currentDeck.name}</h1>
        </div>

        <div className="deck-stats">
          <div className="stat-box mastered">
            <span className="stat-value">{stats.mastered}</span>
            <span className="stat-label">Mastered</span>
          </div>
          <div className="stat-box learning">
            <span className="stat-value">{stats.learning}</span>
            <span className="stat-label">Learning</span>
          </div>
          <div className="stat-box new">
            <span className="stat-value">{stats.new}</span>
            <span className="stat-label">New</span>
          </div>
        </div>

        <div className="deck-actions">
          <button 
            className="study-deck-btn"
            onClick={() => startStudy(currentDeck)}
            disabled={currentDeck.cards.length === 0}
          >
            📖 Study Deck
          </button>
          <button className="add-card-btn" onClick={() => setShowAddCard(!showAddCard)}>
            {showAddCard ? '✕ Cancel' : '+ Add Card'}
          </button>
          <button className="delete-deck-btn" onClick={() => deleteDeck(currentDeck.id)}>
            🗑️ Delete Deck
          </button>
        </div>

        {showAddCard && (
          <div className="add-card-form">
            <h3>Add New Card</h3>
            <form onSubmit={addCard}>
              <textarea
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                placeholder="Front (Question)"
                rows="4"
                required
              />
              <textarea
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                placeholder="Back (Answer)"
                rows="4"
                required
              />
              <button type="submit" className="submit-card-btn">Add Card</button>
            </form>
          </div>
        )}

        <div className="cards-list">
          <h3>Cards ({currentDeck.cards.length})</h3>
          {currentDeck.cards.map((card, index) => (
            <div key={card.id} className="card-item">
              <div className="card-number">{index + 1}</div>
              <div className="card-content">
                <div className="card-side">
                  <strong>Q:</strong> {card.front}
                </div>
                <div className="card-side">
                  <strong>A:</strong> {card.back}
                </div>
              </div>
              <div className="card-mastery">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={i < card.mastery ? 'star-filled' : 'star-empty'}>
                    ⭐
                  </span>
                ))}
              </div>
              <button onClick={() => deleteCard(card.id)} className="delete-card-btn">
                ×
              </button>
            </div>
          ))}
        </div>

        {currentDeck.cards.length === 0 && (
          <div className="empty-cards">
            <p>No cards in this deck yet. Add your first card!</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flashcard-app-container">
      <div className="flashcard-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎴 Flashcard Study</h1>
      </div>

      <div className="deck-controls">
        <button className="add-deck-btn" onClick={() => setShowAddDeck(!showAddDeck)}>
          {showAddDeck ? '✕ Cancel' : '+ Create Deck'}
        </button>
      </div>

      {showAddDeck && (
        <div className="add-deck-form">
          <h2>Create New Deck</h2>
          <form onSubmit={addDeck}>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Deck name..."
              required
            />
            <select value={deckCategory} onChange={(e) => setDeckCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryIcon(cat)} {cat}
                </option>
              ))}
            </select>
            <button type="submit" className="submit-deck-btn">Create Deck</button>
          </form>
        </div>
      )}

      <div className="decks-grid">
        {decks.map(deck => {
          const stats = getMasteryStats(deck)
          return (
            <div key={deck.id} className="deck-card" onClick={() => setCurrentDeck(deck)}>
              <div className="deck-icon">{getCategoryIcon(deck.category)}</div>
              <h3>{deck.name}</h3>
              <div className="deck-category">{deck.category}</div>
              <div className="deck-info">
                <span>{deck.cards.length} cards</span>
              </div>
              <div className="deck-mini-stats">
                <span className="mini-stat mastered">{stats.mastered} mastered</span>
                <span className="mini-stat learning">{stats.learning} learning</span>
              </div>
            </div>
          )
        })}
      </div>

      {decks.length === 0 && !showAddDeck && (
        <div className="empty-decks">
          <p>No decks yet. Create your first deck to start studying!</p>
        </div>
      )}
    </div>
  )
}

export default FlashcardApp
