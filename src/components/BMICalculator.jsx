import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BMICalculator.css'

const BMICalculator = () => {
  const navigate = useNavigate()
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit] = useState('metric') // metric or imperial
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState('')
  const [idealWeight, setIdealWeight] = useState(null)

  const calculateBMI = (e) => {
    e.preventDefault()
    
    let weightKg = parseFloat(weight)
    let heightM = parseFloat(height)

    if (unit === 'imperial') {
      weightKg = weightKg * 0.453592 // lbs to kg
      heightM = heightM * 0.0254 // inches to meters
    } else {
      heightM = heightM / 100 // cm to meters
    }

    const bmiValue = weightKg / (heightM * heightM)
    setBmi(bmiValue.toFixed(1))

    // Determine category
    if (bmiValue < 18.5) {
      setCategory('Underweight')
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setCategory('Normal weight')
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setCategory('Overweight')
    } else {
      setCategory('Obese')
    }

    // Calculate ideal weight range (BMI 18.5-25)
    const minIdeal = (18.5 * heightM * heightM).toFixed(1)
    const maxIdeal = (25 * heightM * heightM).toFixed(1)
    
    if (unit === 'imperial') {
      setIdealWeight({
        min: (minIdeal / 0.453592).toFixed(1),
        max: (maxIdeal / 0.453592).toFixed(1)
      })
    } else {
      setIdealWeight({ min: minIdeal, max: maxIdeal })
    }
  }

  const resetCalculator = () => {
    setWeight('')
    setHeight('')
    setBmi(null)
    setCategory('')
    setIdealWeight(null)
  }

  const getCategoryColor = () => {
    if (category === 'Underweight') return '#2196f3'
    if (category === 'Normal weight') return '#4caf50'
    if (category === 'Overweight') return '#ff9800'
    if (category === 'Obese') return '#f44336'
    return '#999'
  }

  const getCategoryEmoji = () => {
    if (category === 'Underweight') return '📉'
    if (category === 'Normal weight') return '✅'
    if (category === 'Overweight') return '⚠️'
    if (category === 'Obese') return '🔴'
    return '📊'
  }

  const getHealthTips = () => {
    if (category === 'Underweight') {
      return [
        'Increase calorie intake with nutritious foods',
        'Add protein-rich meals to your diet',
        'Consult a healthcare professional',
        'Consider strength training exercises'
      ]
    } else if (category === 'Normal weight') {
      return [
        'Maintain a balanced diet',
        'Regular exercise (150 min/week)',
        'Stay hydrated',
        'Get adequate sleep (7-9 hours)'
      ]
    } else if (category === 'Overweight') {
      return [
        'Create a calorie deficit with healthy eating',
        'Increase physical activity',
        'Focus on whole foods',
        'Track your progress regularly'
      ]
    } else if (category === 'Obese') {
      return [
        'Consult with a healthcare professional',
        'Start with small, sustainable changes',
        'Consider working with a nutritionist',
        'Set realistic weight loss goals'
      ]
    }
    return []
  }

  return (
    <div className="bmi-calculator-container">
      <div className="bmi-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>⚖️ BMI Calculator</h1>
      </div>

      <div className="calculator-card">
        <div className="unit-toggle">
          <button
            className={unit === 'metric' ? 'active' : ''}
            onClick={() => setUnit('metric')}
          >
            Metric (kg, cm)
          </button>
          <button
            className={unit === 'imperial' ? 'active' : ''}
            onClick={() => setUnit('imperial')}
          >
            Imperial (lbs, in)
          </button>
        </div>

        <form onSubmit={calculateBMI}>
          <div className="input-group">
            <label>Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? '70' : '154'}
              step="0.1"
              required
            />
          </div>

          <div className="input-group">
            <label>Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === 'metric' ? '170' : '67'}
              step="0.1"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="calculate-btn">
              Calculate BMI
            </button>
            <button type="button" onClick={resetCalculator} className="reset-btn">
              🔄 Reset
            </button>
          </div>
        </form>
      </div>

      {bmi && (
        <div className="results-section">
          <div className="bmi-result-card" style={{ borderColor: getCategoryColor() }}>
            <div className="result-main">
              <span className="result-emoji">{getCategoryEmoji()}</span>
              <div className="result-value-section">
                <span className="result-label">Your BMI</span>
                <span className="result-value" style={{ color: getCategoryColor() }}>
                  {bmi}
                </span>
              </div>
            </div>
            <div 
              className="result-category" 
              style={{ background: getCategoryColor() }}
            >
              {category}
            </div>
          </div>

          {idealWeight && (
            <div className="ideal-weight-card">
              <h3>🎯 Ideal Weight Range</h3>
              <p className="ideal-range">
                {idealWeight.min} - {idealWeight.max} {unit === 'metric' ? 'kg' : 'lbs'}
              </p>
              <p className="ideal-note">Based on a BMI of 18.5 - 25</p>
            </div>
          )}

          <div className="bmi-chart">
            <h3>📊 BMI Categories</h3>
            <div className="chart-bars">
              <div className="chart-bar underweight">
                <span className="bar-label">Underweight</span>
                <span className="bar-range">&lt; 18.5</span>
              </div>
              <div className="chart-bar normal">
                <span className="bar-label">Normal</span>
                <span className="bar-range">18.5 - 24.9</span>
              </div>
              <div className="chart-bar overweight">
                <span className="bar-label">Overweight</span>
                <span className="bar-range">25 - 29.9</span>
              </div>
              <div className="chart-bar obese">
                <span className="bar-label">Obese</span>
                <span className="bar-range">≥ 30</span>
              </div>
            </div>
          </div>

          <div className="health-tips-card">
            <h3>💡 Health Tips</h3>
            <ul>
              {getHealthTips().map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="info-card">
        <h3>ℹ️ About BMI</h3>
        <p>
          Body Mass Index (BMI) is a measure of body fat based on height and weight. 
          While it's a useful screening tool, it doesn't directly measure body fat percentage 
          and may not be accurate for athletes, pregnant women, or elderly individuals.
        </p>
        <p>
          <strong>Formula:</strong> BMI = weight (kg) / height² (m²)
        </p>
      </div>
    </div>
  )
}

export default BMICalculator
