import React, { useState } from 'react'
import '../styles/FeedbackModal.css'

const FeedbackModal = ({ open, onClose }) => {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, store feedback in localStorage
    const feedbacks = JSON.parse(localStorage.getItem('gmaxFeedbacks') || '[]')
    feedbacks.push({ feedback, date: new Date().toISOString() })
    localStorage.setItem('gmaxFeedbacks', JSON.stringify(feedbacks))
    setSubmitted(true)
    setFeedback('')
  }

  if (!open) return null

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Send Feedback</h2>
        {submitted ? (
          <div className="feedback-success">Thank you for your feedback!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Your suggestions or issues..."
              required
              rows={5}
            />
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default FeedbackModal
