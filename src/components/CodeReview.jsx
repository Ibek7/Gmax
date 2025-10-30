import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CodeReview.css'

const CodeReview = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([
    { id: 1, file: 'App.jsx', line: 45, comment: 'Consider extracting this logic into a custom hook', status: 'pending', author: 'Sarah' },
    { id: 2, file: 'utils.js', line: 12, comment: 'Add error handling here', status: 'resolved', author: 'John' }
  ])

  const pendingCount = reviews.filter(r => r.status === 'pending').length

  return (
    <div className="review-container">
      <div className="review-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔍 Code Review Helper</h1>
        <div className="stats">
          <span className="badge">{pendingCount} Pending</span>
          <span className="badge resolved">{reviews.length - pendingCount} Resolved</span>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className={`review-card ${review.status}`}>
            <div className="review-header-info">
              <div className="file-info">
                <span className="file-name">{review.file}</span>
                <span className="line-number">Line {review.line}</span>
              </div>
              <span className={`status-badge ${review.status}`}>{review.status}</span>
            </div>
            <p className="comment">{review.comment}</p>
            <div className="review-footer">
              <span className="author">By {review.author}</span>
              {review.status === 'pending' && (
                <button 
                  className="resolve-btn"
                  onClick={() => {
                    const updated = reviews.map(r => 
                      r.id === review.id ? {...r, status: 'resolved'} : r
                    )
                    setReviews(updated)
                  }}
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CodeReview
