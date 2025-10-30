import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ReadingTracker.css'

const ReadingTracker = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [pages, setPages] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [status, setStatus] = useState('reading')
  const [genre, setGenre] = useState('fiction')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const genres = ['fiction', 'non-fiction', 'biography', 'science', 'history', 'fantasy', 'mystery', 'self-help']
  const statuses = ['reading', 'completed', 'wishlist', 'paused']

  useEffect(() => {
    const saved = localStorage.getItem('gmax_books')
    if (saved) setBooks(JSON.parse(saved))
  }, [])

  const addBook = (e) => {
    e.preventDefault()
    if (title.trim() && author.trim() && pages) {
      const book = {
        id: Date.now(),
        title,
        author,
        pages: parseInt(pages),
        currentPage: parseInt(currentPage),
        status,
        genre,
        rating: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
        notes: ''
      }
      const updated = [...books, book]
      setBooks(updated)
      localStorage.setItem('gmax_books', JSON.stringify(updated))
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setPages('')
    setCurrentPage(0)
    setStatus('reading')
    setGenre('fiction')
    setShowAddForm(false)
  }

  const updateProgress = (id, newPage) => {
    const updated = books.map(b => {
      if (b.id === id) {
        const updatedBook = { ...b, currentPage: parseInt(newPage) }
        if (newPage >= b.pages && b.status !== 'completed') {
          updatedBook.status = 'completed'
          updatedBook.completedAt = new Date().toISOString()
        }
        return updatedBook
      }
      return b
    })
    setBooks(updated)
    localStorage.setItem('gmax_books', JSON.stringify(updated))
  }

  const rateBook = (id, rating) => {
    const updated = books.map(b => b.id === id ? { ...b, rating } : b)
    setBooks(updated)
    localStorage.setItem('gmax_books', JSON.stringify(updated))
  }

  const deleteBook = (id) => {
    const updated = books.filter(b => b.id !== id)
    setBooks(updated)
    localStorage.setItem('gmax_books', JSON.stringify(updated))
  }

  const getProgress = (book) => {
    return Math.min((book.currentPage / book.pages) * 100, 100)
  }

  const filteredBooks = filterStatus === 'all'
    ? books
    : books.filter(b => b.status === filterStatus)

  const readingCount = books.filter(b => b.status === 'reading').length
  const completedCount = books.filter(b => b.status === 'completed').length
  const totalPages = books.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.pages, 0)

  const getGenreIcon = (g) => {
    const icons = {
      fiction: '📚',
      'non-fiction': '📖',
      biography: '👤',
      science: '🔬',
      history: '🏛️',
      fantasy: '🐉',
      mystery: '🔍',
      'self-help': '💡'
    }
    return icons[g] || '📕'
  }

  return (
    <div className="reading-tracker-container">
      <div className="reading-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📚 Reading Tracker</h1>
        <button className="add-book-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+ Add Book'}
        </button>
      </div>

      <div className="reading-stats">
        <div className="reading-stat">
          <span className="stat-icon">📖</span>
          <div className="stat-info">
            <span className="stat-num">{readingCount}</span>
            <span className="stat-lbl">Currently Reading</span>
          </div>
        </div>
        <div className="reading-stat">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-num">{completedCount}</span>
            <span className="stat-lbl">Completed</span>
          </div>
        </div>
        <div className="reading-stat">
          <span className="stat-icon">📄</span>
          <div className="stat-info">
            <span className="stat-num">{totalPages}</span>
            <span className="stat-lbl">Pages Read</span>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="add-book-form">
          <h2>Add New Book</h2>
          <form onSubmit={addBook}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Book title..."
              required
            />
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Author..."
              required
            />
            <div className="book-form-grid">
              <select value={genre} onChange={e => setGenre(e.target.value)}>
                {genres.map(g => (
                  <option key={g} value={g}>{getGenreIcon(g)} {g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </select>
              <input
                type="number"
                value={pages}
                onChange={e => setPages(e.target.value)}
                placeholder="Total pages"
                required
              />
              <input
                type="number"
                value={currentPage}
                onChange={e => setCurrentPage(e.target.value)}
                placeholder="Current page"
              />
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {statuses.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
              <button type="submit" className="submit-btn">Add Book</button>
            </div>
          </form>
        </div>
      )}

      <div className="book-filters">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All Books
        </button>
        {statuses.map(s => (
          <button
            key={s}
            className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-card-header">
              <span className="genre-badge">{getGenreIcon(book.genre)} {book.genre}</span>
              <span className={`status-badge ${book.status}`}>{book.status}</span>
              <button className="delete-book-btn" onClick={() => deleteBook(book.id)}>×</button>
            </div>
            
            <h3>{book.title}</h3>
            <p className="book-author">by {book.author}</p>

            {book.status !== 'wishlist' && (
              <>
                <div className="progress-section">
                  <div className="progress-info">
                    <span>{book.currentPage} / {book.pages} pages</span>
                    <span>{getProgress(book).toFixed(0)}%</span>
                  </div>
                  <div className="book-progress-bar">
                    <div
                      className="book-progress-fill"
                      style={{ width: `${getProgress(book)}%` }}
                    ></div>
                  </div>
                  {book.status === 'reading' && (
                    <input
                      type="number"
                      value={book.currentPage}
                      onChange={e => updateProgress(book.id, e.target.value)}
                      max={book.pages}
                      min="0"
                      className="page-input"
                      placeholder="Update page..."
                    />
                  )}
                </div>

                {book.status === 'completed' && (
                  <div className="book-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={`star-btn ${book.rating >= star ? 'filled' : ''}`}
                        onClick={() => rateBook(book.id, star)}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="empty-books">
          <p>No books found</p>
        </div>
      )}
    </div>
  )
}

export default ReadingTracker
