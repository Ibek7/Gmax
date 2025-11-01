import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/QRCodeGenerator.css'

const QRCodeGenerator = () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [qrSize, setQrSize] = useState(256)
  const [qrColor, setQrColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrCode, setQrCode] = useState(null)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('gmax_qr_history')
    return saved ? JSON.parse(saved) : []
  })

  const generateQRCode = () => {
    if (!inputText.trim()) {
      alert('Please enter text or URL')
      return
    }

    // Using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(inputText)}&color=${qrColor.slice(1)}&bgcolor=${bgColor.slice(1)}`
    
    setQrCode(qrUrl)
    addToHistory(inputText, qrUrl)
  }

  const addToHistory = (text, url) => {
    const newItem = {
      text: text.substring(0, 50),
      url,
      timestamp: new Date().toLocaleString(),
      id: Date.now()
    }

    const newHistory = [newItem, ...history].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem('gmax_qr_history', JSON.stringify(newHistory))
  }

  const downloadQRCode = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qr-code-${Date.now()}.png`
    link.click()
  }

  const clearHistory = () => {
    if (window.confirm('Clear all QR code history?')) {
      setHistory([])
      localStorage.removeItem('gmax_qr_history')
    }
  }

  const loadFromHistory = (item) => {
    setInputText(item.text)
    setQrCode(item.url)
  }

  const quickPresets = [
    { name: 'WiFi', format: 'WIFI:T:WPA;S:YourSSID;P:YourPassword;;', icon: '📶' },
    { name: 'Email', format: 'mailto:example@email.com', icon: '📧' },
    { name: 'Phone', format: 'tel:+1234567890', icon: '📱' },
    { name: 'SMS', format: 'sms:+1234567890?body=Hello', icon: '💬' },
    { name: 'Website', format: 'https://example.com', icon: '🌐' },
    { name: 'vCard', format: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD', icon: '👤' }
  ]

  return (
    <div className="qr-code-container">
      <div className="qr-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📱 QR Code Generator</h1>
      </div>

      <div className="qr-generator-card">
        <div className="input-section">
          <label>Enter Text or URL</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text, URL, or use a preset format below..."
            className="qr-textarea"
            rows="4"
          />
        </div>

        <div className="quick-presets">
          <h4>📋 Quick Presets</h4>
          <div className="presets-grid">
            {quickPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setInputText(preset.format)}
                className="preset-btn"
              >
                <span className="preset-icon">{preset.icon}</span>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="customization-section">
          <h4>🎨 Customization</h4>
          <div className="custom-grid">
            <div className="custom-item">
              <label>Size: {qrSize}px</label>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="size-slider"
              />
            </div>

            <div className="custom-item">
              <label>QR Color</label>
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="color-picker"
              />
            </div>

            <div className="custom-item">
              <label>Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="color-picker"
              />
            </div>
          </div>
        </div>

        <button onClick={generateQRCode} className="generate-qr-btn">
          🎯 Generate QR Code
        </button>
      </div>

      {qrCode && (
        <div className="qr-display-card">
          <h3>Your QR Code</h3>
          <div className="qr-image-container">
            <img src={qrCode} alt="QR Code" className="qr-image" />
          </div>
          <div className="qr-actions">
            <button onClick={downloadQRCode} className="download-btn">
              💾 Download
            </button>
            <button
              onClick={() => {
                setQrCode(null)
                setInputText('')
              }}
              className="clear-btn"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="qr-history-card">
          <div className="history-header">
            <h3>📜 Recent QR Codes</h3>
            <button onClick={clearHistory} className="clear-history-btn">
              🗑️ Clear All
            </button>
          </div>
          <div className="history-grid">
            {history.map((item) => (
              <div key={item.id} className="history-qr-item">
                <img src={item.url} alt="QR Code" className="history-qr-img" />
                <div className="history-qr-info">
                  <p className="history-qr-text">{item.text}...</p>
                  <span className="history-qr-time">{item.timestamp}</span>
                  <button
                    onClick={() => loadFromHistory(item)}
                    className="load-btn"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="qr-info-card">
        <h3>ℹ️ How to Use QR Codes</h3>
        <ul>
          <li><strong>URLs:</strong> Direct link to websites - just paste the URL</li>
          <li><strong>WiFi:</strong> Format: WIFI:T:WPA;S:NetworkName;P:Password;;</li>
          <li><strong>Contact:</strong> Use vCard format for business cards</li>
          <li><strong>Email/Phone:</strong> Use mailto: or tel: prefixes</li>
          <li><strong>Text:</strong> Any plain text up to ~4000 characters</li>
          <li><strong>Scan:</strong> Use your phone camera to scan generated codes</li>
        </ul>
      </div>
    </div>
  )
}

export default QRCodeGenerator
