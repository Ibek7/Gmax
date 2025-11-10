import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ColorPickerTool.css'

function ColorPickerTool() {
  const navigate = useNavigate()
  const [color, setColor] = useState('#3b82f6')
  const [savedColors, setSavedColors] = useState([])

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
        default: h = 0
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const rgbToCmyk = (r, g, b) => {
    let c = 1 - (r / 255)
    let m = 1 - (g / 255)
    let y = 1 - (b / 255)
    let k = Math.min(c, m, y)

    c = ((c - k) / (1 - k)) || 0
    m = ((m - k) / (1 - k)) || 0
    y = ((y - k) / (1 - k)) || 0

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    }
  }

  const getColorFormats = () => {
    const rgb = hexToRgb(color)
    if (!rgb) return null

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

    return {
      hex: color.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      rgbValues: rgb,
      hslValues: hsl,
      cmykValues: cmyk
    }
  }

  const getComplementary = () => {
    const rgb = hexToRgb(color)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
  }

  const getAnalogous = () => {
    const rgb = hexToRgb(color)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return [
      hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
    ]
  }

  const getTriadic = () => {
    const rgb = hexToRgb(color)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    return [
      hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
    ]
  }

  const hslToHex = (h, s, l) => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = n => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const saveColor = () => {
    if (!savedColors.includes(color)) {
      setSavedColors([color, ...savedColors.slice(0, 11)])
    }
  }

  const formats = getColorFormats()
  const harmonies = {
    complementary: getComplementary(),
    analogous: getAnalogous(),
    triadic: getTriadic()
  }

  return (
    <div className="color-picker-tool">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="picker-container">
        <h1>Color Picker</h1>
        <p className="subtitle">Advanced color picker with format conversion and color harmonies</p>

        <div className="main-picker-section">
          <div className="color-preview" style={{ backgroundColor: color }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-input-native"
            />
          </div>

          <div className="color-info">
            <h3>Selected Color</h3>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="hex-input"
              placeholder="#000000"
            />
            <button className="save-color-btn" onClick={saveColor}>
              💾 Save Color
            </button>
          </div>
        </div>

        {formats && (
          <div className="formats-section">
            <h3>Color Formats</h3>
            <div className="formats-grid">
              <div className="format-card">
                <label>HEX</label>
                <div className="format-value">
                  <code>{formats.hex}</code>
                  <button onClick={() => copyToClipboard(formats.hex)}>📋</button>
                </div>
              </div>

              <div className="format-card">
                <label>RGB</label>
                <div className="format-value">
                  <code>{formats.rgb}</code>
                  <button onClick={() => copyToClipboard(formats.rgb)}>📋</button>
                </div>
              </div>

              <div className="format-card">
                <label>RGBA</label>
                <div className="format-value">
                  <code>{formats.rgba}</code>
                  <button onClick={() => copyToClipboard(formats.rgba)}>📋</button>
                </div>
              </div>

              <div className="format-card">
                <label>HSL</label>
                <div className="format-value">
                  <code>{formats.hsl}</code>
                  <button onClick={() => copyToClipboard(formats.hsl)}>📋</button>
                </div>
              </div>

              <div className="format-card">
                <label>HSLA</label>
                <div className="format-value">
                  <code>{formats.hsla}</code>
                  <button onClick={() => copyToClipboard(formats.hsla)}>📋</button>
                </div>
              </div>

              <div className="format-card">
                <label>CMYK</label>
                <div className="format-value">
                  <code>{formats.cmyk}</code>
                  <button onClick={() => copyToClipboard(formats.cmyk)}>📋</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="harmonies-section">
          <h3>Color Harmonies</h3>
          
          <div className="harmony-group">
            <h4>Complementary</h4>
            <div className="harmony-colors">
              <div className="harmony-color" style={{ backgroundColor: color }}>
                <span>{color}</span>
              </div>
              <div className="harmony-color" style={{ backgroundColor: harmonies.complementary }}>
                <span>{harmonies.complementary}</span>
              </div>
            </div>
          </div>

          <div className="harmony-group">
            <h4>Analogous</h4>
            <div className="harmony-colors">
              <div className="harmony-color" style={{ backgroundColor: harmonies.analogous[0] }}>
                <span>{harmonies.analogous[0]}</span>
              </div>
              <div className="harmony-color" style={{ backgroundColor: color }}>
                <span>{color}</span>
              </div>
              <div className="harmony-color" style={{ backgroundColor: harmonies.analogous[1] }}>
                <span>{harmonies.analogous[1]}</span>
              </div>
            </div>
          </div>

          <div className="harmony-group">
            <h4>Triadic</h4>
            <div className="harmony-colors">
              <div className="harmony-color" style={{ backgroundColor: color }}>
                <span>{color}</span>
              </div>
              <div className="harmony-color" style={{ backgroundColor: harmonies.triadic[0] }}>
                <span>{harmonies.triadic[0]}</span>
              </div>
              <div className="harmony-color" style={{ backgroundColor: harmonies.triadic[1] }}>
                <span>{harmonies.triadic[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {savedColors.length > 0 && (
          <div className="saved-colors-section">
            <h3>Saved Colors</h3>
            <div className="saved-colors-grid">
              {savedColors.map((savedColor, index) => (
                <div
                  key={index}
                  className="saved-color"
                  style={{ backgroundColor: savedColor }}
                  onClick={() => setColor(savedColor)}
                  title={savedColor}
                >
                  <span>{savedColor}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ColorPickerTool
