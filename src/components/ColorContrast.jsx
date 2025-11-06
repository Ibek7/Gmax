import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ColorContrast.css'

export default function ColorContrast() {
  const navigate = useNavigate()
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(16)
  const [isBold, setIsBold] = useState(false)

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const getContrastRatio = () => {
    const fg = hexToRgb(foreground)
    const bg = hexToRgb(background)
    if (!fg || !bg) return 1

    const l1 = getLuminance(fg.r, fg.g, fg.b)
    const l2 = getLuminance(bg.r, bg.g, bg.b)
    
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  const ratio = getContrastRatio()

  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold)

  const wcagLevels = {
    normalAAA: { threshold: 7, label: 'AAA (Normal Text)', pass: ratio >= 7 },
    normalAA: { threshold: 4.5, label: 'AA (Normal Text)', pass: ratio >= 4.5 },
    largeAAA: { threshold: 4.5, label: 'AAA (Large Text)', pass: ratio >= 4.5 },
    largeAA: { threshold: 3, label: 'AA (Large Text)', pass: ratio >= 3 }
  }

  const getOverallStatus = () => {
    if (isLargeText) {
      if (wcagLevels.largeAAA.pass) return { level: 'AAA', color: '#10b981' }
      if (wcagLevels.largeAA.pass) return { level: 'AA', color: '#3b82f6' }
      return { level: 'Fail', color: '#ef4444' }
    } else {
      if (wcagLevels.normalAAA.pass) return { level: 'AAA', color: '#10b981' }
      if (wcagLevels.normalAA.pass) return { level: 'AA', color: '#3b82f6' }
      return { level: 'Fail', color: '#ef4444' }
    }
  }

  const status = getOverallStatus()

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
  }

  const presets = [
    { name: 'Black on White', fg: '#000000', bg: '#ffffff' },
    { name: 'White on Black', fg: '#ffffff', bg: '#000000' },
    { name: 'Blue on Yellow', fg: '#0000ff', bg: '#ffff00' },
    { name: 'Dark Gray on Light', fg: '#595959', bg: '#f5f5f5' },
    { name: 'Navy on Cream', fg: '#001f3f', bg: '#fff8dc' }
  ]

  const applyPreset = (preset) => {
    setForeground(preset.fg)
    setBackground(preset.bg)
  }

  return (
    <div className="color-contrast-container">
      <div className="contrast-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎨 Color Contrast Checker</h1>
      </div>

      <div className="contrast-card">
        <div className="contrast-info">
          <p>
            Check color contrast ratios for accessibility compliance with WCAG 2.1 standards.
            Ensure your text is readable for users with visual impairments.
          </p>
        </div>

        <div className="color-inputs">
          <div className="color-group">
            <label>Foreground (Text)</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="color-input"
                placeholder="#000000"
              />
            </div>
          </div>

          <button className="swap-btn" onClick={swapColors}>
            ⇄
          </button>

          <div className="color-group">
            <label>Background</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="color-input"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        <div className="text-options">
          <div className="option-group">
            <label>Font Size: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="48"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
          <div className="option-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={isBold}
                onChange={(e) => setIsBold(e.target.checked)}
              />
              Bold Text
            </label>
          </div>
        </div>

        <div className="preview-section" style={{ backgroundColor: background }}>
          <p
            style={{
              color: foreground,
              fontSize: `${fontSize}px`,
              fontWeight: isBold ? 'bold' : 'normal'
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div className="ratio-display">
          <div className="ratio-value" style={{ color: status.color }}>
            {ratio.toFixed(2)}:1
          </div>
          <div className="ratio-status" style={{ color: status.color }}>
            WCAG {status.level}
          </div>
        </div>

        <div className="wcag-results">
          <div className="result-row">
            <span className="result-label">{wcagLevels.normalAA.label}</span>
            <span className={`result-badge ${wcagLevels.normalAA.pass ? 'pass' : 'fail'}`}>
              {wcagLevels.normalAA.pass ? '✓ Pass' : '✗ Fail'}
            </span>
            <span className="result-threshold">≥ {wcagLevels.normalAA.threshold}:1</span>
          </div>
          <div className="result-row">
            <span className="result-label">{wcagLevels.normalAAA.label}</span>
            <span className={`result-badge ${wcagLevels.normalAAA.pass ? 'pass' : 'fail'}`}>
              {wcagLevels.normalAAA.pass ? '✓ Pass' : '✗ Fail'}
            </span>
            <span className="result-threshold">≥ {wcagLevels.normalAAA.threshold}:1</span>
          </div>
          <div className="result-row">
            <span className="result-label">{wcagLevels.largeAA.label}</span>
            <span className={`result-badge ${wcagLevels.largeAA.pass ? 'pass' : 'fail'}`}>
              {wcagLevels.largeAA.pass ? '✓ Pass' : '✗ Fail'}
            </span>
            <span className="result-threshold">≥ {wcagLevels.largeAA.threshold}:1</span>
          </div>
          <div className="result-row">
            <span className="result-label">{wcagLevels.largeAAA.label}</span>
            <span className={`result-badge ${wcagLevels.largeAAA.pass ? 'pass' : 'fail'}`}>
              {wcagLevels.largeAAA.pass ? '✓ Pass' : '✗ Fail'}
            </span>
            <span className="result-threshold">≥ {wcagLevels.largeAAA.threshold}:1</span>
          </div>
        </div>

        <div className="wcag-note">
          <strong>Note:</strong> Large text is defined as 18pt (24px) or 14pt (18.67px) bold and above.
          {isLargeText && <span className="large-text-indicator"> (Current text qualifies as large)</span>}
        </div>

        <div className="presets-section">
          <h3>Quick Presets</h3>
          <div className="presets-grid">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                className="preset-btn"
                onClick={() => applyPreset(preset)}
              >
                <div className="preset-preview">
                  <div style={{ background: preset.bg, color: preset.fg, padding: '8px' }}>
                    Aa
                  </div>
                </div>
                <div className="preset-name">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
