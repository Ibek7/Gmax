import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CSSUnitConverter.css'

function CSSUnitConverter() {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState('px')
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [viewportWidth, setViewportWidth] = useState(1920)
  const [viewportHeight, setViewportHeight] = useState(1080)
  const [conversions, setConversions] = useState(null)

  const units = [
    { value: 'px', label: 'Pixels (px)' },
    { value: 'rem', label: 'Root Em (rem)' },
    { value: 'em', label: 'Em (em)' },
    { value: 'percent', label: 'Percent (%)' },
    { value: 'vw', label: 'Viewport Width (vw)' },
    { value: 'vh', label: 'Viewport Height (vh)' },
    { value: 'vmin', label: 'Viewport Min (vmin)' },
    { value: 'vmax', label: 'Viewport Max (vmax)' },
    { value: 'pt', label: 'Points (pt)' },
    { value: 'cm', label: 'Centimeters (cm)' },
    { value: 'mm', label: 'Millimeters (mm)' },
    { value: 'in', label: 'Inches (in)' }
  ]

  const convertUnits = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      alert('Please enter a valid number')
      return
    }

    let pixels = 0

    // Convert input to pixels first
    switch (inputUnit) {
      case 'px':
        pixels = value
        break
      case 'rem':
        pixels = value * baseFontSize
        break
      case 'em':
        pixels = value * baseFontSize
        break
      case 'percent':
        pixels = (value / 100) * baseFontSize
        break
      case 'vw':
        pixels = (value / 100) * viewportWidth
        break
      case 'vh':
        pixels = (value / 100) * viewportHeight
        break
      case 'vmin':
        pixels = (value / 100) * Math.min(viewportWidth, viewportHeight)
        break
      case 'vmax':
        pixels = (value / 100) * Math.max(viewportWidth, viewportHeight)
        break
      case 'pt':
        pixels = value * (96 / 72)
        break
      case 'cm':
        pixels = value * (96 / 2.54)
        break
      case 'mm':
        pixels = value * (96 / 25.4)
        break
      case 'in':
        pixels = value * 96
        break
      default:
        pixels = value
    }

    // Convert pixels to all other units
    const results = {
      px: pixels,
      rem: pixels / baseFontSize,
      em: pixels / baseFontSize,
      percent: (pixels / baseFontSize) * 100,
      vw: (pixels / viewportWidth) * 100,
      vh: (pixels / viewportHeight) * 100,
      vmin: (pixels / Math.min(viewportWidth, viewportHeight)) * 100,
      vmax: (pixels / Math.max(viewportWidth, viewportHeight)) * 100,
      pt: pixels * (72 / 96),
      cm: pixels * (2.54 / 96),
      mm: pixels * (25.4 / 96),
      in: pixels / 96
    }

    setConversions(results)
  }

  const copyValue = (value, unit) => {
    let unitSuffix = unit
    if (unit === 'percent') {
      unitSuffix = '%'
    }
    navigator.clipboard.writeText(`${value.toFixed(4)}${unitSuffix}`)
    alert('Value copied to clipboard!')
  }

  const formatValue = (value, unit) => {
    if (unit === 'percent') {
      return `${value.toFixed(4)}%`
    }
    return `${value.toFixed(4)}${unit}`
  }

  const getUnitDescription = (unit) => {
    const descriptions = {
      px: 'Absolute unit. 1px = 1/96th of an inch',
      rem: 'Relative to root element font size',
      em: 'Relative to parent element font size',
      percent: 'Relative to parent element (context-dependent)',
      vw: '1% of viewport width',
      vh: '1% of viewport height',
      vmin: '1% of viewport smaller dimension',
      vmax: '1% of viewport larger dimension',
      pt: 'Points. 1pt = 1/72th of an inch',
      cm: 'Centimeters',
      mm: 'Millimeters',
      in: 'Inches. 1in = 96px'
    }
    return descriptions[unit] || ''
  }

  const presetSizes = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: '4K', width: 3840, height: 2160 }
  ]

  return (
    <div className="css-unit-converter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="converter-container">
        <h1>CSS Unit Converter</h1>
        <p className="subtitle">Convert between CSS units with customizable base values</p>

        <div className="settings-section">
          <h3>Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Base Font Size (px)</label>
              <input
                type="number"
                value={baseFontSize}
                onChange={(e) => setBaseFontSize(parseFloat(e.target.value) || 16)}
                min="1"
              />
              <span className="setting-hint">Used for rem/em calculations</span>
            </div>

            <div className="setting-item">
              <label>Viewport Width (px)</label>
              <input
                type="number"
                value={viewportWidth}
                onChange={(e) => setViewportWidth(parseFloat(e.target.value) || 1920)}
                min="1"
              />
            </div>

            <div className="setting-item">
              <label>Viewport Height (px)</label>
              <input
                type="number"
                value={viewportHeight}
                onChange={(e) => setViewportHeight(parseFloat(e.target.value) || 1080)}
                min="1"
              />
            </div>

            <div className="setting-item">
              <label>Viewport Presets</label>
              <div className="preset-buttons">
                {presetSizes.map((preset) => (
                  <button
                    key={preset.name}
                    className="preset-btn"
                    onClick={() => {
                      setViewportWidth(preset.width)
                      setViewportHeight(preset.height)
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="converter-section">
          <h3>Convert</h3>
          <div className="input-row">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              step="any"
            />
            <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)}>
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            <button className="convert-btn" onClick={convertUnits}>
              Convert
            </button>
          </div>
        </div>

        {conversions && (
          <div className="results-section">
            <h3>Results</h3>
            <div className="results-grid">
              {units.map((unit) => (
                <div
                  key={unit.value}
                  className={`result-card ${unit.value === inputUnit ? 'active' : ''}`}
                >
                  <div className="result-header">
                    <h4>{unit.label}</h4>
                    {unit.value !== inputUnit && (
                      <button
                        className="copy-result-btn"
                        onClick={() => copyValue(conversions[unit.value], unit.value)}
                      >
                        📋
                      </button>
                    )}
                  </div>
                  <div className="result-value">
                    {formatValue(conversions[unit.value], unit.value)}
                  </div>
                  <div className="result-description">
                    {getUnitDescription(unit.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>About CSS Units</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>Absolute Units</h4>
              <p>Fixed units that don't change based on context: px, pt, cm, mm, in</p>
            </div>
            <div className="info-card">
              <h4>Relative Units</h4>
              <p>Units relative to other values: rem, em, %, vw, vh, vmin, vmax</p>
            </div>
            <div className="info-card">
              <h4>Best Practices</h4>
              <p>Use rem for font sizes, px for borders, % for widths, and viewport units for responsive layouts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSSUnitConverter
