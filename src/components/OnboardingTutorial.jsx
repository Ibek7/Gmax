import React, { useState, useEffect } from 'react'
import '../styles/OnboardingTutorial.css'

function OnboardingTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: '👋 Welcome to Gmax!',
      description: 'Your ultimate creative productivity platform. Let\'s take a quick tour to help you get started.',
      target: null,
      position: 'center'
    },
    {
      title: '📊 Dashboard',
      description: 'Your central hub for tracking progress, viewing stats, and staying motivated with daily inspiration.',
      target: 'dashboard',
      position: 'center'
    },
    {
      title: '🎨 Creative Spaces',
      description: 'Access all your creative tools: writing, art, music, code, and games from the navigation menu.',
      target: 'navigation',
      position: 'bottom'
    },
    {
      title: '🏆 Achievements',
      description: 'Track your accomplishments and unlock badges as you reach milestones in your creative journey.',
      target: 'achievements',
      position: 'center'
    },
    {
      title: '⚡ Quick Actions',
      description: 'Press Shift+Space to open the Quick Actions menu for fast navigation and common tasks.',
      target: 'quick-actions',
      position: 'center'
    },
    {
      title: '📈 Analytics',
      description: 'View detailed insights about your productivity patterns and creative output over time.',
      target: 'analytics',
      position: 'center'
    },
    {
      title: '🔔 Notifications',
      description: 'Stay updated with achievement alerts, reminders, and challenge notifications in the top right.',
      target: 'notifications',
      position: 'bottom-right'
    },
    {
      title: '⌨️ Keyboard Shortcuts',
      description: 'Press ? to view all available keyboard shortcuts and boost your productivity.',
      target: 'shortcuts',
      position: 'center'
    },
    {
      title: '🎯 You\'re All Set!',
      description: 'Start creating, track your progress, and unlock achievements. Have fun and stay productive!',
      target: null,
      position: 'center'
    }
  ]

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    completeTutorial()
  }

  const completeTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setShowTutorial(false)
    setCurrentStep(0)
  }

  const restartTutorial = () => {
    setCurrentStep(0)
    setShowTutorial(true)
  }

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  if (!showTutorial) {
    return (
      <button className="restart-tutorial-btn" onClick={restartTutorial} title="Restart Tutorial">
        ❓
      </button>
    )
  }

  return (
    <>
      <div className="tutorial-overlay" onClick={handleSkip} />
      <div className={`tutorial-tooltip tooltip-${currentStepData.position}`}>
        <button className="tutorial-close" onClick={handleSkip} title="Close Tutorial">
          ✕
        </button>
        
        <div className="tutorial-content">
          <div className="tutorial-step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <h2 className="tutorial-title">{currentStepData.title}</h2>
          <p className="tutorial-description">{currentStepData.description}</p>
          
          <div className="tutorial-dots">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`tutorial-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="tutorial-actions">
          {!isFirstStep && (
            <button className="tutorial-btn tutorial-btn-secondary" onClick={handlePrevious}>
              ← Previous
            </button>
          )}
          
          {!isLastStep && (
            <button className="tutorial-btn tutorial-btn-skip" onClick={handleSkip}>
              Skip
            </button>
          )}
          
          <button className="tutorial-btn tutorial-btn-primary" onClick={handleNext}>
            {isLastStep ? 'Get Started! 🚀' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  )
}

export default OnboardingTutorial
