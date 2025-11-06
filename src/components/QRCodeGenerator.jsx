import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/QRCodeGenerator.css'

function QRCodeGenerator() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [size, setSize] = useState(256)
  const [errorCorrection, setErrorCorrection] = useState('M')
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('gmax_qr_history')
    return saved ? JSON.parse(saved) : []
  })

  // Generate QR code using QR Server API
  const generateQRCode = () => {
    if (!text.trim()) {
      alert('Please enter text or URL')
      return
    }

    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorCorrection}&color=${foreground.substring(1)}&bgcolor=${background.substring(1)}`
    setQrCode(url)
    addToHistory(text, url)
  }

  const addToHistory = (inputText, url) => {
    const newItem = {
      text: inputText.substring(0, 50),
      url,
      timestamp: new Date().toLocaleString(),
      id: Date.now()
    }

    const newHistory = [newItem, ...history].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem('gmax_qr_history', JSON.stringify(newHistory))
  }

  const downloadQRCode = () => {
    if (!qrCode) {
      alert('Please generate a QR code first')
      return
    }

    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qr-code-${Date.now()}.png`
    link.click()
  }

  const clearAll = () => {
    setText('')
    setQrCode('')
  }

  const clearHistory = () => {
    if (window.confirm('Clear all QR code history?')) {
      setHistory([])
      localStorage.removeItem('gmax_qr_history')
    }
  }

  const loadFromHistory = (item) => {
    setText(item.text)
    setQrCode(item.url)
  }

  const presets = [
    { name: 'Website', text: 'https://example.com', icon: '🌐' },
    { name: 'Email', text: 'mailto:example@email.com', icon: '📧' },
    { name: 'Phone', text: 'tel:+1234567890', icon: '�' },
    { name: 'WiFi', text: 'WIFI:T:WPA;S:NetworkName;P:Password;;', icon: '📶' },
    { name: 'SMS', text: 'sms:+1234567890?body=Hello', icon: '💬' },
    { name: 'Location', text: 'geo:37.7749,-122.4194', icon: '📍' },
    { name: 'vCard', text: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD', icon: '👤' }
  ]

  const loadPreset = (presetText) => {
    setText(presetText)
  }

  return (
    <div className="qr-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="qr-container">
        <h1>QR Code Generator</h1>
        <p className="subtitle">Create QR codes from text, URLs, or contact information</p>

        <div className="qr-main">
          <div className="qr-controls">
            <div className="input-section">
              <label>Text or URL</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, email, phone number..."
                rows={5}
              />
            </div>

            <div className="settings-grid">
              <div className="setting-group">
                <label>Size: {size}px</label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                />
              </div>

              <div className="setting-group">
                <label>Error Correction</label>
                <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value)}>
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              <div className="setting-group">
                <label>Foreground Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                  />
                  <input
                    type="text"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                  />
                </div>
              </div>

              <div className="setting-group">
                <label>Background Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                  />
                  <input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={generateQRCode} className="generate-btn">
                🎯 Generate QR Code
              </button>
              <button onClick={downloadQRCode} className="download-btn" disabled={!qrCode}>
                💾 Download PNG
              </button>
              <button onClick={clearAll} className="clear-btn">
                🗑️ Clear
              </button>
            </div>
          </div>

          <div className="qr-preview">
            <h3>QR Code Preview</h3>
            {qrCode ? (
              <div className="qr-display">
                <img src={qrCode} alt="QR Code" />
              </div>
            ) : (
              <div className="qr-placeholder">
                <div className="placeholder-icon">📱</div>
                <p>Your QR code will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div className="presets-section">
          <h3>Quick Templates</h3>
          <div className="preset-grid">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset.text)}
                className="preset-card"
              >
                <span className="preset-icon">{preset.icon}</span>
                <div className="preset-info">
                  <strong>{preset.name}</strong>
                  <code>{preset.text.length > 30 ? preset.text.substring(0, 30) + '...' : preset.text}</code>
                </div>
              </button>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>📜 Recent QR Codes</h3>
              <button onClick={clearHistory} className="clear-history-btn">
                🗑️ Clear All
              </button>
            </div>
            <div className="history-grid">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <img src={item.url} alt="QR Code" className="history-qr" />
                  <div className="history-info">
                    <p className="history-text">{item.text}...</p>
                    <span className="history-time">{item.timestamp}</span>
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

        <div className="info-section">
          <h3>QR Code Features</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Error Correction</strong>
              <p>Higher error correction allows the QR code to be read even if partially damaged. Higher levels increase QR code size.</p>
            </div>
            <div className="info-item">
              <strong>Custom Colors</strong>
              <p>Customize foreground and background colors. Ensure sufficient contrast for reliable scanning.</p>
            </div>
            <div className="info-item">
              <strong>Data Types</strong>
              <p>QR codes can store URLs, text, email addresses, phone numbers, WiFi credentials, vCards, and more.</p>
            </div>
            <div className="info-item">
              <strong>Size Guidelines</strong>
              <p>Larger QR codes (256px+) are better for printing. Smaller sizes work well for digital displays.</p>
            </div>
          </div>
        </div>

        <div className="format-guide">
          <h3>Format Examples</h3>
          <div className="format-grid">
            <div className="format-item">
              <h4>📧 Email</h4>
              <code>mailto:email@example.com</code>
            </div>
            <div className="format-item">
              <h4>📞 Phone</h4>
              <code>tel:+1234567890</code>
            </div>
            <div className="format-item">
              <h4>📱 SMS</h4>
              <code>sms:+1234567890?body=Message</code>
            </div>
            <div className="format-item">
              <h4>📍 Location</h4>
              <code>geo:latitude,longitude</code>
            </div>
            <div className="format-item">
              <h4>📶 WiFi</h4>
              <code>WIFI:T:WPA;S:SSID;P:Password;;</code>
            </div>
            <div className="format-item">
              <h4>👤 vCard</h4>
              <code>BEGIN:VCARD...</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator
