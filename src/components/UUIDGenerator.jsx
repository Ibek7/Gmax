import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/UUIDGenerator.css'

function UUIDGenerator() {
  const navigate = useNavigate()
  const [uuids, setUuids] = useState([])
  const [version, setVersion] = useState('v4')
  const [quantity, setQuantity] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [withHyphens, setWithHyphens] = useState(true)

  // Generate UUID v4 (random)
  const generateUUIDv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Generate UUID v1 (timestamp-based)
  const generateUUIDv1 = () => {
    const now = Date.now()
    const timestamp = now * 10000 + 122192928000000000 // Convert to 100-nanosecond intervals
    const timeHex = timestamp.toString(16).padStart(16, '0')
    
    const timeLow = timeHex.slice(-8)
    const timeMid = timeHex.slice(-12, -8)
    const timeHi = '1' + timeHex.slice(-15, -12) // Version 1
    
    const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000
    const node = Array.from({ length: 6 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('')
    
    return `${timeLow}-${timeMid}-${timeHi}-${clockSeq.toString(16)}-${node}`
  }

  const generateUUIDs = () => {
    const newUuids = []
    for (let i = 0; i < quantity; i++) {
      let uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1()
      
      if (!withHyphens) {
        uuid = uuid.replace(/-/g, '')
      }
      
      if (uppercase) {
        uuid = uuid.toUpperCase()
      }
      
      newUuids.push({
        id: Date.now() + i,
        value: uuid,
        timestamp: new Date().toLocaleString()
      })
    }
    
    setUuids([...newUuids, ...uuids])
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('UUID copied to clipboard!')
  }

  const copyAll = () => {
    const allUuids = uuids.map(u => u.value).join('\n')
    navigator.clipboard.writeText(allUuids)
    alert(`${uuids.length} UUIDs copied to clipboard!`)
  }

  const clearAll = () => {
    if (window.confirm('Clear all generated UUIDs?')) {
      setUuids([])
    }
  }

  const downloadUUIDs = () => {
    const content = uuids.map(u => u.value).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uuids-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="uuid-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="uuid-container">
        <h1>UUID/GUID Generator</h1>
        <p className="subtitle">Generate unique identifiers for your applications</p>

        <div className="generator-section">
          <div className="controls-grid">
            <div className="control-group">
              <label>Version</label>
              <select value={version} onChange={(e) => setVersion(e.target.value)}>
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Timestamp)</option>
              </select>
            </div>

            <div className="control-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                min="1"
                max="100"
              />
            </div>

            <div className="control-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                />
                Uppercase
              </label>
            </div>

            <div className="control-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={withHyphens}
                  onChange={(e) => setWithHyphens(e.target.checked)}
                />
                Include Hyphens
              </label>
            </div>
          </div>

          <button onClick={generateUUIDs} className="generate-btn">
            🎲 Generate {quantity > 1 ? `${quantity} UUIDs` : 'UUID'}
          </button>

          <div className="info-box">
            <strong>ℹ️ Version Information:</strong>
            {version === 'v4' ? (
              <p><strong>Version 4:</strong> Randomly generated UUID using cryptographic randomness. Most commonly used for general-purpose unique identifiers.</p>
            ) : (
              <p><strong>Version 1:</strong> Timestamp-based UUID incorporating current time and node information. Useful when temporal ordering is important.</p>
            )}
          </div>
        </div>

        {uuids.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h3>Generated UUIDs ({uuids.length})</h3>
              <div className="results-actions">
                <button onClick={copyAll} className="action-btn">
                  📋 Copy All
                </button>
                <button onClick={downloadUUIDs} className="action-btn">
                  💾 Download
                </button>
                <button onClick={clearAll} className="action-btn clear-btn">
                  🗑️ Clear All
                </button>
              </div>
            </div>

            <div className="uuid-list">
              {uuids.map((uuid) => (
                <div key={uuid.id} className="uuid-item">
                  <div className="uuid-value">
                    <code>{uuid.value}</code>
                  </div>
                  <div className="uuid-meta">
                    <span className="timestamp">{uuid.timestamp}</span>
                    <button
                      onClick={() => copyToClipboard(uuid.value)}
                      className="copy-btn"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="usage-guide">
          <h3>Usage Guide</h3>
          <div className="guide-grid">
            <div className="guide-item">
              <h4>🔑 Database Primary Keys</h4>
              <p>Use UUIDs as globally unique primary keys in distributed databases to avoid ID conflicts.</p>
            </div>
            <div className="guide-item">
              <h4>🌐 API Identifiers</h4>
              <p>Generate unique resource identifiers for REST APIs and microservices.</p>
            </div>
            <div className="guide-item">
              <h4>📁 File Names</h4>
              <p>Create unique file names to prevent overwrites in cloud storage systems.</p>
            </div>
            <div className="guide-item">
              <h4>🎫 Session Tokens</h4>
              <p>Generate random session identifiers for user authentication and tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UUIDGenerator
