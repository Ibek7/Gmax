import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/GradientGenerator.css'

function GradientGenerator() {
  const navigate = useNavigate()
  const [gradientType, setGradientType] = useState('linear')
  const [angle, setAngle] = useState(90)
  const [colors, setColors] = useState([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ])
  const [radialShape, setRadialShape] = useState('circle')
  const [radialPosition, setRadialPosition] = useState('center')

  const generateCSS = () => {
    const colorStops = colors
      .sort((a, b) => a.position - b.position)
      .map(c => `${c.color} ${c.position}%`)
      .join(', ')

    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`
    } else if (gradientType === 'radial') {
      return `radial-gradient(${radialShape} at ${radialPosition}, ${colorStops})`
    } else {
      // Conic gradient
      return `conic-gradient(from ${angle}deg, ${colorStops})`
    }
  }

  const addColor = () => {
    const newPosition = colors.length > 0 
      ? Math.floor((colors[colors.length - 1].position + 100) / 2)
      : 50
    setColors([...colors, { color: '#ffffff', position: newPosition }])
  }

  const removeColor = (index) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index))
    }
  }

  const updateColor = (index, field, value) => {
    const newColors = [...colors]
    newColors[index][field] = value
    setColors(newColors)
  }

  const copyCSS = () => {
    const css = `background: ${generateCSS()};`
    navigator.clipboard.writeText(css)
  }

  const copyGradient = () => {
    navigator.clipboard.writeText(generateCSS())
  }

  const randomGradient = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    const numColors = Math.floor(Math.random() * 3) + 2 // 2-4 colors
    const newColors = []
    
    for (let i = 0; i < numColors; i++) {
      newColors.push({
        color: randomColor(),
        position: Math.floor((100 / (numColors - 1)) * i)
      })
    }
    
    setColors(newColors)
    setAngle(Math.floor(Math.random() * 360))
  }

  const presets = [
    {
      name: 'Sunset',
      type: 'linear',
      angle: 90,
      colors: [
        { color: '#ff6b6b', position: 0 },
        { color: '#feca57', position: 100 }
      ]
    },
    {
      name: 'Ocean',
      type: 'linear',
      angle: 135,
      colors: [
        { color: '#0575e6', position: 0 },
        { color: '#021b79', position: 100 }
      ]
    },
    {
      name: 'Forest',
      type: 'linear',
      angle: 180,
      colors: [
        { color: '#134e5e', position: 0 },
        { color: '#71b280', position: 100 }
      ]
    },
    {
      name: 'Purple Rain',
      type: 'linear',
      angle: 45,
      colors: [
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 }
      ]
    },
    {
      name: 'Candy',
      type: 'linear',
      angle: 90,
      colors: [
        { color: '#fc5c7d', position: 0 },
        { color: '#6a82fb', position: 100 }
      ]
    },
    {
      name: 'Aurora',
      type: 'linear',
      angle: 135,
      colors: [
        { color: '#00c6ff', position: 0 },
        { color: '#0072ff', position: 100 }
      ]
    }
  ]

  const loadPreset = (preset) => {
    setGradientType(preset.type)
    setAngle(preset.angle)
    setColors(preset.colors)
  }

  return (
    <div className="gradient-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="gradient-container">
        <h1>Gradient Generator</h1>
        <p className="subtitle">Create beautiful CSS gradients with live preview</p>

        <div className="gradient-preview" style={{ background: generateCSS() }}>
          <div className="preview-overlay">
            <h3>Live Preview</h3>
          </div>
        </div>

        <div className="gradient-controls">
          <div className="type-selector">
            <button
              className={gradientType === 'linear' ? 'active' : ''}
              onClick={() => setGradientType('linear')}
            >
              Linear
            </button>
            <button
              className={gradientType === 'radial' ? 'active' : ''}
              onClick={() => setGradientType('radial')}
            >
              Radial
            </button>
            <button
              className={gradientType === 'conic' ? 'active' : ''}
              onClick={() => setGradientType('conic')}
            >
              Conic
            </button>
          </div>

          {gradientType === 'linear' || gradientType === 'conic' ? (
            <div className="angle-control">
              <label>Angle: {angle}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
              />
            </div>
          ) : (
            <>
              <div className="radial-controls">
                <div className="control-group">
                  <label>Shape</label>
                  <select value={radialShape} onChange={(e) => setRadialShape(e.target.value)}>
                    <option value="circle">Circle</option>
                    <option value="ellipse">Ellipse</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>Position</label>
                  <select value={radialPosition} onChange={(e) => setRadialPosition(e.target.value)}>
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="top left">Top Left</option>
                    <option value="top right">Top Right</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="bottom right">Bottom Right</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="color-stops">
            <div className="stops-header">
              <h3>Color Stops</h3>
              <button onClick={addColor} className="add-color-btn">+ Add Color</button>
            </div>
            {colors.map((colorStop, index) => (
              <div key={index} className="color-stop">
                <input
                  type="color"
                  value={colorStop.color}
                  onChange={(e) => updateColor(index, 'color', e.target.value)}
                />
                <input
                  type="text"
                  value={colorStop.color}
                  onChange={(e) => updateColor(index, 'color', e.target.value)}
                  className="color-text"
                />
                <div className="position-control">
                  <label>{colorStop.position}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={colorStop.position}
                    onChange={(e) => updateColor(index, 'position', parseInt(e.target.value))}
                  />
                </div>
                {colors.length > 2 && (
                  <button onClick={() => removeColor(index)} className="remove-btn">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={randomGradient} className="random-btn">
              🎲 Random Gradient
            </button>
            <button onClick={copyGradient} className="copy-btn">
              📋 Copy Gradient
            </button>
            <button onClick={copyCSS} className="copy-css-btn">
              📋 Copy CSS
            </button>
          </div>
        </div>

        <div className="css-output">
          <h3>Generated CSS</h3>
          <div className="code-block">
            <code>{`background: ${generateCSS()};`}</code>
          </div>
        </div>

        <div className="presets">
          <h3>Gradient Presets</h3>
          <div className="preset-grid">
            {presets.map((preset, idx) => (
              <div
                key={idx}
                className="preset-card"
                onClick={() => loadPreset(preset)}
              >
                <div
                  className="preset-preview"
                  style={{
                    background: `linear-gradient(${preset.angle}deg, ${preset.colors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                  }}
                />
                <p>{preset.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>About CSS Gradients</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Linear Gradients</strong>
              <p>Creates a gradient along a straight line. The angle determines the direction (0° = top to bottom, 90° = left to right).</p>
            </div>
            <div className="info-item">
              <strong>Radial Gradients</strong>
              <p>Creates a gradient radiating from a center point. Can be circular or elliptical with customizable positioning.</p>
            </div>
            <div className="info-item">
              <strong>Conic Gradients</strong>
              <p>Creates a gradient rotating around a center point, like a color wheel. Useful for pie charts and creative effects.</p>
            </div>
            <div className="info-item">
              <strong>Browser Support</strong>
              <p>CSS gradients are supported in all modern browsers. For older browsers, consider providing a solid color fallback.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GradientGenerator
