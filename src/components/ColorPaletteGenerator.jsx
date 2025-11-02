import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ColorPalette.css'

const ColorPaletteGenerator = () => {
  const navigate = useNavigate()
  const [baseColor, setBaseColor] = useState('#3498db')
  const [palettes, setPalettes] = useState([])
  const [savedPalettes, setSavedPalettes] = useState(() => {
    const saved = localStorage.getItem('gmax_color_palettes')
    return saved ? JSON.parse(saved) : []
  })

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  const adjustColor = (hex, amount) => {
    const rgb = hexToRgb(hex)
    return rgbToHex(
      Math.max(0, Math.min(255, rgb.r + amount)),
      Math.max(0, Math.min(255, rgb.g + amount)),
      Math.max(0, Math.min(255, rgb.b + amount))
    )
  }

  const generateComplementary = (hex) => {
    const rgb = hexToRgb(hex)
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b)
  }

  const generateAnalogous = (hex) => {
    const colors = [hex]
    for (let i = 1; i <= 2; i++) {
      colors.push(adjustColor(hex, i * 20))
      colors.push(adjustColor(hex, -i * 20))
    }
    return colors.slice(0, 5)
  }

  const generateTriadic = (hex) => {
    const rgb = hexToRgb(hex)
    return [
      hex,
      rgbToHex(rgb.g, rgb.b, rgb.r),
      rgbToHex(rgb.b, rgb.r, rgb.g)
    ]
  }

  const generateMonochromatic = (hex) => {
    return [
      adjustColor(hex, -60),
      adjustColor(hex, -30),
      hex,
      adjustColor(hex, 30),
      adjustColor(hex, 60)
    ]
  }

  const generatePalettes = () => {
    setPalettes([
      { name: 'Monochromatic', colors: generateMonochromatic(baseColor) },
      { name: 'Analogous', colors: generateAnalogous(baseColor) },
      { name: 'Complementary', colors: [baseColor, generateComplementary(baseColor)] },
      { name: 'Triadic', colors: generateTriadic(baseColor) },
      { name: 'Split Complementary', colors: [
        baseColor,
        adjustColor(generateComplementary(baseColor), 30),
        adjustColor(generateComplementary(baseColor), -30)
      ]}
    ])
  }

  const copyColor = (color) => {
    navigator.clipboard.writeText(color)
    alert(`Copied ${color}!`)
  }

  const savePalette = (palette) => {
    const newPalette = {
      ...palette,
      id: Date.now(),
      timestamp: new Date().toLocaleString()
    }
    const updated = [newPalette, ...savedPalettes].slice(0, 10)
    setSavedPalettes(updated)
    localStorage.setItem('gmax_color_palettes', JSON.stringify(updated))
  }

  const deletePalette = (id) => {
    const updated = savedPalettes.filter(p => p.id !== id)
    setSavedPalettes(updated)
    localStorage.setItem('gmax_color_palettes', JSON.stringify(updated))
  }

  return (
    <div className="color-palette-container">
      <div className="palette-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎨 Color Palette Generator</h1>
      </div>

      <div className="generator-card">
        <div className="color-picker-section">
          <label>Choose Base Color</label>
          <div className="picker-row">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="color-input-large"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="hex-input"
            />
            <button onClick={generatePalettes} className="generate-btn">
              Generate Palettes
            </button>
          </div>
        </div>
      </div>

      {palettes.length > 0 && (
        <div className="palettes-section">
          {palettes.map((palette, index) => (
            <div key={index} className="palette-card">
              <div className="palette-card-header">
                <h3>{palette.name}</h3>
                <button onClick={() => savePalette(palette)} className="save-palette-btn">
                  💾 Save
                </button>
              </div>
              <div className="colors-row">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="color-box"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                  >
                    <span className="color-hex">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {savedPalettes.length > 0 && (
        <div className="saved-palettes-section">
          <h2>💾 Saved Palettes</h2>
          {savedPalettes.map((palette) => (
            <div key={palette.id} className="saved-palette-item">
              <div className="saved-palette-header">
                <h4>{palette.name}</h4>
                <span className="palette-timestamp">{palette.timestamp}</span>
                <button onClick={() => deletePalette(palette.id)} className="delete-palette-btn">
                  🗑️
                </button>
              </div>
              <div className="colors-row">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="color-box-small"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorPaletteGenerator
