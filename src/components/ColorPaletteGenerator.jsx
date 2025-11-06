import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ColorPaletteGenerator.css'

function ColorPaletteGenerator() {
  const navigate = useNavigate()
  const [baseColor, setBaseColor] = useState('#3B82F6')
  const [palettes, setPalettes] = useState({})
  const [copiedColor, setCopiedColor] = useState('')

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
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

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100
    
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return { r: r * 255, g: g * 255, b: b * 255 }
  }

  // Generate color harmony palettes
  const generatePalettes = () => {
    const rgb = hexToRgb(baseColor)
    if (!rgb) return

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    // Complementary (180° opposite)
    const complementary = [(hsl.h + 180) % 360]
    
    // Analogous (±30°)
    const analogous = [
      (hsl.h - 30 + 360) % 360,
      (hsl.h + 30) % 360
    ]
    
    // Triadic (120° apart)
    const triadic = [
      (hsl.h + 120) % 360,
      (hsl.h + 240) % 360
    ]
    
    // Split-Complementary (complementary ±30°)
    const splitComplementary = [
      (hsl.h + 150) % 360,
      (hsl.h + 210) % 360
    ]
    
    // Tetradic/Square (90° apart)
    const tetradic = [
      (hsl.h + 90) % 360,
      (hsl.h + 180) % 360,
      (hsl.h + 270) % 360
    ]

    // Monochromatic (same hue, different lightness)
    const monochromatic = [
      { h: hsl.h, s: hsl.s, l: Math.max(10, hsl.l - 20) },
      { h: hsl.h, s: hsl.s, l: Math.max(10, hsl.l - 10) },
      { h: hsl.h, s: hsl.s, l: Math.min(90, hsl.l + 10) },
      { h: hsl.h, s: hsl.s, l: Math.min(90, hsl.l + 20) }
    ]

    // Shades (darker variations)
    const shades = [0.8, 0.6, 0.4, 0.2].map(factor => ({
      r: rgb.r * factor,
      g: rgb.g * factor,
      b: rgb.b * factor
    }))

    // Tints (lighter variations)
    const tints = [0.2, 0.4, 0.6, 0.8].map(factor => ({
      r: rgb.r + (255 - rgb.r) * factor,
      g: rgb.g + (255 - rgb.g) * factor,
      b: rgb.b + (255 - rgb.b) * factor
    }))

    setPalettes({
      complementary: [baseColor, ...complementary.map(h => {
        const rgb = hslToRgb(h, hsl.s, hsl.l)
        return rgbToHex(rgb.r, rgb.g, rgb.b)
      })],
      analogous: [baseColor, ...analogous.map(h => {
        const rgb = hslToRgb(h, hsl.s, hsl.l)
        return rgbToHex(rgb.r, rgb.g, rgb.b)
      })],
      triadic: [baseColor, ...triadic.map(h => {
        const rgb = hslToRgb(h, hsl.s, hsl.l)
        return rgbToHex(rgb.r, rgb.g, rgb.b)
      })],
      splitComplementary: [baseColor, ...splitComplementary.map(h => {
        const rgb = hslToRgb(h, hsl.s, hsl.l)
        return rgbToHex(rgb.r, rgb.g, rgb.b)
      })],
      tetradic: [baseColor, ...tetradic.map(h => {
        const rgb = hslToRgb(h, hsl.s, hsl.l)
        return rgbToHex(rgb.r, rgb.g, rgb.b)
      })],
      monochromatic: monochromatic.map(({ h, s, l }) => {
        const rgb = hslToRgb(h, s, l)
        return rgbToHex(rgb.r, rgb.g, rgb.b)
      }),
      shades: [baseColor, ...shades.map(({ r, g, b }) => rgbToHex(r, g, b))],
      tints: [baseColor, ...tints.map(({ r, g, b }) => rgbToHex(r, g, b))]
    })
  }

  const copyColor = (color) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(''), 2000)
  }

  const exportAsCSS = () => {
    if (Object.keys(palettes).length === 0) {
      alert('Please generate palettes first')
      return
    }

    let css = ':root {\n'
    Object.entries(palettes).forEach(([name, colors]) => {
      colors.forEach((color, idx) => {
        css += `  --${name}-${idx + 1}: ${color};\n`
      })
    })
    css += '}'

    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'color-palette.css'
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportAsJSON = () => {
    if (Object.keys(palettes).length === 0) {
      alert('Please generate palettes first')
      return
    }

    const json = JSON.stringify(palettes, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'color-palette.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const presetColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ]

  return (
    <div className="palette-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="palette-container">
        <h1>Color Palette Generator</h1>
        <p className="subtitle">Create harmonious color schemes using color theory</p>

        <div className="color-picker-section">
          <div className="picker-controls">
            <div className="color-input-group">
              <label>Base Color</label>
              <div className="color-selector">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="preset-colors">
              <label>Quick Colors</label>
              <div className="preset-grid">
                {presetColors.map((color, idx) => (
                  <button
                    key={idx}
                    className="preset-color"
                    style={{ backgroundColor: color }}
                    onClick={() => setBaseColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={generatePalettes} className="generate-btn">
              🎨 Generate Palettes
            </button>
            <button onClick={exportAsCSS} className="export-btn" disabled={Object.keys(palettes).length === 0}>
              📄 Export CSS
            </button>
            <button onClick={exportAsJSON} className="export-btn" disabled={Object.keys(palettes).length === 0}>
              📦 Export JSON
            </button>
          </div>
        </div>

        {Object.keys(palettes).length > 0 && (
          <div className="palettes-section">
            {Object.entries(palettes).map(([name, colors]) => (
              <div key={name} className="palette-group">
                <h3>{name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
                <div className="color-swatches">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      onClick={() => copyColor(color)}
                      title="Click to copy"
                    >
                      <div className="swatch-info">
                        <span className="swatch-hex">{color}</span>
                        {copiedColor === color && <span className="copied-badge">✓ Copied!</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="info-section">
          <h3>Color Harmony Types</h3>
          <div className="harmony-grid">
            <div className="harmony-item">
              <h4>🎯 Complementary</h4>
              <p>Colors opposite on the color wheel. High contrast, vibrant combinations.</p>
            </div>
            <div className="harmony-item">
              <h4>🔄 Analogous</h4>
              <p>Adjacent colors on the wheel. Creates serene and comfortable designs.</p>
            </div>
            <div className="harmony-item">
              <h4>△ Triadic</h4>
              <p>Three colors evenly spaced. Vibrant and balanced combinations.</p>
            </div>
            <div className="harmony-item">
              <h4>✂️ Split-Complementary</h4>
              <p>Base color plus two adjacent to its complement. Good contrast with less tension.</p>
            </div>
            <div className="harmony-item">
              <h4>□ Tetradic</h4>
              <p>Four colors in two complementary pairs. Rich and complex combinations.</p>
            </div>
            <div className="harmony-item">
              <h4>🎨 Monochromatic</h4>
              <p>Same hue with varying lightness. Clean, elegant, and cohesive.</p>
            </div>
            <div className="harmony-item">
              <h4>🌑 Shades</h4>
              <p>Darker variations by adding black. Creates depth and sophistication.</p>
            </div>
            <div className="harmony-item">
              <h4>☀️ Tints</h4>
              <p>Lighter variations by adding white. Creates soft and airy palettes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorPaletteGenerator
