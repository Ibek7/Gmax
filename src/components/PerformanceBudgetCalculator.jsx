import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/PerformanceBudgetCalculator.css'

function PerformanceBudgetCalculator() {
  const navigate = useNavigate()
  
  const [budget, setBudget] = useState({
    html: 50,
    css: 75,
    js: 200,
    images: 500,
    fonts: 100,
    other: 50
  })

  const [metrics, setMetrics] = useState({
    targetLoadTime: 3,
    targetTTI: 5,
    targetFCP: 1.8,
    targetLCP: 2.5
  })

  const calculateTotals = () => {
    const totalSize = Object.values(budget).reduce((sum, val) => sum + val, 0)
    const estimatedLoadTime = calculateLoadTime(totalSize)
    
    return {
      totalSize,
      estimatedLoadTime,
      meetsBudget: estimatedLoadTime <= metrics.targetLoadTime,
      breakdown: {
        html: ((budget.html / totalSize) * 100).toFixed(1),
        css: ((budget.css / totalSize) * 100).toFixed(1),
        js: ((budget.js / totalSize) * 100).toFixed(1),
        images: ((budget.images / totalSize) * 100).toFixed(1),
        fonts: ((budget.fonts / totalSize) * 100).toFixed(1),
        other: ((budget.other / totalSize) * 100).toFixed(1)
      }
    }
  }

  const calculateLoadTime = (sizeKB) => {
    // Simulated load time calculation
    // Assumes 3G connection (~750 Kbps)
    const connectionSpeed = 750 / 8 // KB per second
    const loadTime = sizeKB / connectionSpeed
    return parseFloat(loadTime.toFixed(2))
  }

  const getRecommendations = () => {
    const recommendations = []
    const totals = calculateTotals()

    if (budget.js > 150) {
      recommendations.push({
        type: 'warning',
        message: 'JavaScript bundle is large. Consider code splitting and lazy loading.'
      })
    }

    if (budget.images > 400) {
      recommendations.push({
        type: 'warning',
        message: 'Image sizes are high. Use modern formats (WebP, AVIF) and lazy loading.'
      })
    }

    if (budget.css > 100) {
      recommendations.push({
        type: 'info',
        message: 'CSS is substantial. Consider critical CSS and async loading for non-critical styles.'
      })
    }

    if (totals.totalSize > 1000) {
      recommendations.push({
        type: 'error',
        message: 'Total page weight exceeds 1MB. This may impact mobile users significantly.'
      })
    }

    if (totals.estimatedLoadTime > metrics.targetLoadTime) {
      recommendations.push({
        type: 'error',
        message: `Estimated load time (${totals.estimatedLoadTime}s) exceeds target (${metrics.targetLoadTime}s).`
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        message: 'Great! Your performance budget looks good. Keep monitoring as you add features.'
      })
    }

    return recommendations
  }

  const totals = calculateTotals()
  const recommendations = getRecommendations()

  const connectionTypes = [
    { name: 'Fast 4G', speed: 4000, loadTime: (totals.totalSize / (4000 / 8)).toFixed(2) },
    { name: '3G', speed: 750, loadTime: (totals.totalSize / (750 / 8)).toFixed(2) },
    { name: 'Slow 3G', speed: 400, loadTime: (totals.totalSize / (400 / 8)).toFixed(2) },
    { name: '2G', speed: 50, loadTime: (totals.totalSize / (50 / 8)).toFixed(2) }
  ]

  return (
    <div className="performance-budget-calculator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="calculator-container">
        <h1>Performance Budget Calculator</h1>
        <p className="subtitle">Track and optimize your website's performance budget</p>

        <div className="budget-section">
          <h2>Resource Budget (KB)</h2>
          <div className="budget-grid">
            <div className="budget-item">
              <label>
                <span className="label-text">HTML</span>
                <span className="budget-value">{budget.html} KB</span>
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={budget.html}
                onChange={(e) => setBudget({...budget, html: parseInt(e.target.value)})}
              />
            </div>

            <div className="budget-item">
              <label>
                <span className="label-text">CSS</span>
                <span className="budget-value">{budget.css} KB</span>
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={budget.css}
                onChange={(e) => setBudget({...budget, css: parseInt(e.target.value)})}
              />
            </div>

            <div className="budget-item">
              <label>
                <span className="label-text">JavaScript</span>
                <span className="budget-value">{budget.js} KB</span>
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                value={budget.js}
                onChange={(e) => setBudget({...budget, js: parseInt(e.target.value)})}
              />
            </div>

            <div className="budget-item">
              <label>
                <span className="label-text">Images</span>
                <span className="budget-value">{budget.images} KB</span>
              </label>
              <input
                type="range"
                min="50"
                max="2000"
                value={budget.images}
                onChange={(e) => setBudget({...budget, images: parseInt(e.target.value)})}
              />
            </div>

            <div className="budget-item">
              <label>
                <span className="label-text">Fonts</span>
                <span className="budget-value">{budget.fonts} KB</span>
              </label>
              <input
                type="range"
                min="20"
                max="500"
                value={budget.fonts}
                onChange={(e) => setBudget({...budget, fonts: parseInt(e.target.value)})}
              />
            </div>

            <div className="budget-item">
              <label>
                <span className="label-text">Other</span>
                <span className="budget-value">{budget.other} KB</span>
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={budget.other}
                onChange={(e) => setBudget({...budget, other: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>

        <div className="summary-section">
          <div className="total-card">
            <h3>Total Page Weight</h3>
            <div className={`total-size ${totals.meetsBudget ? 'good' : 'bad'}`}>
              {totals.totalSize} KB
            </div>
            <p className="size-mb">({(totals.totalSize / 1024).toFixed(2)} MB)</p>
          </div>

          <div className="breakdown-card">
            <h3>Resource Breakdown</h3>
            <div className="breakdown-bars">
              {Object.entries(totals.breakdown).map(([key, percent]) => (
                <div key={key} className="breakdown-item">
                  <div className="breakdown-label">
                    <span>{key.toUpperCase()}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className={`breakdown-fill ${key}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="metrics-section">
          <h2>Performance Targets</h2>
          <div className="metrics-grid">
            <div className="metric-item">
              <label>Target Load Time (seconds)</label>
              <input
                type="number"
                value={metrics.targetLoadTime}
                onChange={(e) => setMetrics({...metrics, targetLoadTime: parseFloat(e.target.value) || 0})}
                step="0.1"
              />
            </div>
            <div className="metric-item">
              <label>Target TTI (seconds)</label>
              <input
                type="number"
                value={metrics.targetTTI}
                onChange={(e) => setMetrics({...metrics, targetTTI: parseFloat(e.target.value) || 0})}
                step="0.1"
              />
            </div>
            <div className="metric-item">
              <label>Target FCP (seconds)</label>
              <input
                type="number"
                value={metrics.targetFCP}
                onChange={(e) => setMetrics({...metrics, targetFCP: parseFloat(e.target.value) || 0})}
                step="0.1"
              />
            </div>
            <div className="metric-item">
              <label>Target LCP (seconds)</label>
              <input
                type="number"
                value={metrics.targetLCP}
                onChange={(e) => setMetrics({...metrics, targetLCP: parseFloat(e.target.value) || 0})}
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="connection-section">
          <h2>Load Time by Connection</h2>
          <div className="connection-grid">
            {connectionTypes.map((conn, idx) => (
              <div key={idx} className="connection-card">
                <h4>{conn.name}</h4>
                <p className="connection-speed">{conn.speed} Kbps</p>
                <div className="connection-time">{conn.loadTime}s</div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations-section">
          <h2>Recommendations</h2>
          <div className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`recommendation ${rec.type}`}>
                <span className="rec-icon">
                  {rec.type === 'success' && '✓'}
                  {rec.type === 'warning' && '⚠'}
                  {rec.type === 'error' && '✗'}
                  {rec.type === 'info' && 'ⓘ'}
                </span>
                <p>{rec.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Core Web Vitals Reference</h3>
          <ul>
            <li><strong>LCP (Largest Contentful Paint):</strong> Should occur within 2.5s</li>
            <li><strong>FID (First Input Delay):</strong> Should be less than 100ms</li>
            <li><strong>CLS (Cumulative Layout Shift):</strong> Should be less than 0.1</li>
            <li><strong>FCP (First Contentful Paint):</strong> Should occur within 1.8s</li>
            <li><strong>TTI (Time to Interactive):</strong> Should occur within 3.8s</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PerformanceBudgetCalculator
