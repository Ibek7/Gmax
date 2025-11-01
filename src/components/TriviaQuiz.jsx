import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TriviaQuiz.css'

const TriviaQuiz = () => {
  const navigate = useNavigate()
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [timer, setTimer] = useState(30)
  const [isAnswered, setIsAnswered] = useState(false)

  const categories = {
    general: {
      name: 'General Knowledge',
      icon: '🌍',
      questions: [
        {
          question: 'What is the capital of France?',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correct: 2
        },
        {
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          correct: 1
        },
        {
          question: 'Who painted the Mona Lisa?',
          options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
          correct: 2
        },
        {
          question: 'What is the largest ocean on Earth?',
          options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
          correct: 3
        },
        {
          question: 'In what year did World War II end?',
          options: ['1943', '1944', '1945', '1946'],
          correct: 2
        }
      ]
    },
    science: {
      name: 'Science',
      icon: '🔬',
      questions: [
        {
          question: 'What is the chemical symbol for gold?',
          options: ['Go', 'Au', 'Gd', 'Ag'],
          correct: 1
        },
        {
          question: 'How many bones are in the human body?',
          options: ['186', '206', '226', '246'],
          correct: 1
        },
        {
          question: 'What is the speed of light?',
          options: ['299,792 km/s', '199,792 km/s', '399,792 km/s', '499,792 km/s'],
          correct: 0
        },
        {
          question: 'What is the powerhouse of the cell?',
          options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
          correct: 2
        },
        {
          question: 'Which gas do plants absorb from the atmosphere?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
          correct: 2
        }
      ]
    },
    history: {
      name: 'History',
      icon: '📜',
      questions: [
        {
          question: 'Who was the first President of the United States?',
          options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
          correct: 1
        },
        {
          question: 'In which year did the Titanic sink?',
          options: ['1910', '1911', '1912', '1913'],
          correct: 2
        },
        {
          question: 'Who discovered America?',
          options: ['Amerigo Vespucci', 'Ferdinand Magellan', 'Christopher Columbus', 'Vasco da Gama'],
          correct: 2
        },
        {
          question: 'What ancient wonder was located in Alexandria?',
          options: ['Colossus', 'Lighthouse', 'Hanging Gardens', 'Statue of Zeus'],
          correct: 1
        },
        {
          question: 'Which empire built Machu Picchu?',
          options: ['Aztec', 'Maya', 'Inca', 'Olmec'],
          correct: 2
        }
      ]
    },
    geography: {
      name: 'Geography',
      icon: '🗺️',
      questions: [
        {
          question: 'What is the smallest country in the world?',
          options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
          correct: 1
        },
        {
          question: 'Which is the longest river in the world?',
          options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
          correct: 1
        },
        {
          question: 'Mount Everest is located in which mountain range?',
          options: ['Alps', 'Andes', 'Himalayas', 'Rockies'],
          correct: 2
        },
        {
          question: 'What is the capital of Australia?',
          options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
          correct: 2
        },
        {
          question: 'Which desert is the largest in the world?',
          options: ['Sahara', 'Arabian', 'Gobi', 'Antarctic'],
          correct: 3
        }
      ]
    }
  }

  const questions = categories[selectedCategory].questions

  useEffect(() => {
    let interval
    if (quizStarted && !isAnswered && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0 && !isAnswered) {
      handleTimeUp()
    }
    return () => clearInterval(interval)
  }, [quizStarted, isAnswered, timer])

  const startQuiz = (category) => {
    setSelectedCategory(category)
    setQuizStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setTimer(30)
    setIsAnswered(false)
  }

  const handleTimeUp = () => {
    setIsAnswered(true)
    setTimeout(() => {
      handleNextQuestion()
    }, 2000)
  }

  const handleAnswer = (answerIndex) => {
    if (isAnswered) return

    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      handleNextQuestion()
    }, 1500)
  }

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimer(30)
      setIsAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const restartQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimer(30)
    setIsAnswered(false)
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return '🏆 Perfect Score! Amazing!'
    if (percentage >= 80) return '🌟 Excellent! Great job!'
    if (percentage >= 60) return '👍 Good work! Keep it up!'
    if (percentage >= 40) return '📚 Not bad! Keep learning!'
    return '💪 Keep practicing!'
  }

  if (!quizStarted) {
    return (
      <div className="trivia-quiz-container">
        <div className="quiz-header">
          <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
          <h1>🎯 Trivia Quiz</h1>
        </div>

        <div className="category-selection">
          <h2>Choose a Category</h2>
          <div className="categories-grid">
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key} className="category-card" onClick={() => startQuiz(key)}>
                <span className="category-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.questions.length} Questions</p>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-info">
          <h3>ℹ️ How to Play</h3>
          <ul>
            <li>Choose a category to start the quiz</li>
            <li>You have 30 seconds to answer each question</li>
            <li>Select the correct answer from the options</li>
            <li>Your score will be shown at the end</li>
          </ul>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="trivia-quiz-container">
        <div className="quiz-header">
          <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
          <h1>🎯 Trivia Quiz</h1>
        </div>

        <div className="result-card">
          <h2>Quiz Complete!</h2>
          <div className="result-score">
            <span className="score-emoji">{getScoreMessage().split(' ')[0]}</span>
            <span className="score-text">{score} / {questions.length}</span>
            <span className="score-percentage">
              {Math.round((score / questions.length) * 100)}%
            </span>
          </div>
          <p className="result-message">{getScoreMessage()}</p>

          <div className="result-buttons">
            <button onClick={restartQuiz} className="restart-btn">
              🔄 Try Another Category
            </button>
            <button onClick={() => startQuiz(selectedCategory)} className="retry-btn">
              🎯 Retry Same Category
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="trivia-quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎯 Trivia Quiz</h1>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="quiz-card">
        <div className="quiz-timer">
          <span className="timer-icon">⏱️</span>
          <span className={`timer-value ${timer <= 10 ? 'urgent' : ''}`}>
            {timer}s
          </span>
        </div>

        <div className="question-section">
          <h2>{questions[currentQuestion].question}</h2>
        </div>

        <div className="options-grid">
          {questions[currentQuestion].options.map((option, index) => {
            let className = 'option-btn'
            if (isAnswered) {
              if (index === questions[currentQuestion].correct) {
                className += ' correct'
              } else if (index === selectedAnswer) {
                className += ' incorrect'
              }
            } else if (selectedAnswer === index) {
              className += ' selected'
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            )
          })}
        </div>

        <div className="quiz-score">
          Current Score: <strong>{score}</strong>
        </div>
      </div>
    </div>
  )
}

export default TriviaQuiz
