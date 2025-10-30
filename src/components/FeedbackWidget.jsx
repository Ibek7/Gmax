import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FeedbackWidget.css'

const FeedbackWidget = () => {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const submitFeedback = () => {
    if (comment.trim()) {
      const newFeedback = { id: Date.now(), rating, comment, date: new Date().toISOString() }
      setFeedback([newFeedback, ...feedback])
      localStorage.setItem('gmax_feedback', JSON.stringify([newFeedback, ...feedback]))
      setComment('')
      setRating(5)
    }
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💬 Quick Feedback</h1>
      </div>

      <div className="feedback-form">
        <h3>Share your feedback</h3>
        <div className="rating-selector">
          {[1, 2, 3, 4, 5].map(n => (
            <button 
              key={n} 
              className={rating >= n ? 'active' : ''}
              onClick={() => setRating(n)}
            >
              ⭐
            </button>
          ))}
        </div>
        <textarea 
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Tell us what you think..."
          rows="4"
        />
        <button className="submit-btn" onClick={submitFeedback}>Submit Feedback</button>
      </div>

      <div className="feedback-list">
        <h3>Previous Feedback</h3>
        {feedback.map(f => (
          <div key={f.id} className="feedback-item">
            <div className="stars">{'⭐'.repeat(f.rating)}</div>
            <p>{f.comment}</p>
            <span className="date">{new Date(f.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeedbackWidget
