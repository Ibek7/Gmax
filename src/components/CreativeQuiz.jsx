import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeQuiz.css'

const CreativeQuiz = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)

  const quiz = [
    { q: 'I prefer working on:', a: ['Visual projects', 'Writing content', 'Building code', 'Music creation'] },
    { q: 'My ideal work time is:', a: ['Morning', 'Afternoon', 'Evening', 'Late night'] },
    { q: 'I get inspired by:', a: ['Nature', 'Technology', 'People', 'Art'] },
    { q: 'My work style is:', a: ['Structured', 'Flexible', 'Collaborative', 'Solo'] }
  ]

  const selectAnswer = (answer) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎯 Creative Personality Quiz</h1>
      </div>

      {!showResult ? (
        <div className="quiz-card">
          <div className="progress">Question {currentQuestion + 1} of {quiz.length}</div>
          <h2>{quiz[currentQuestion].q}</h2>
          <div className="answers">
            {quiz[currentQuestion].a.map((answer, i) => (
              <button key={i} className="answer-btn" onClick={() => selectAnswer(answer)}>
                {answer}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-card">
          <h2>🎨 You're a Visual Creator!</h2>
          <p>Based on your answers, you thrive in visual creative work with structured workflows.</p>
          <button onClick={() => { setCurrentQuestion(0); setAnswers([]); setShowResult(false); }}>
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  )
}

export default CreativeQuiz
