import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/HTMLEntityEncoder.css'

function HTMLEntityEncoder() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '°': '&deg;',
    '±': '&plusmn;',
    '÷': '&divide;',
    '×': '&times;',
    ' ': '&nbsp;'
  }

  const encode = () => {
    if (!input.trim()) {
      alert('Please enter text to encode')
      return
    }

    let encoded = input
    for (const [char, entity] of Object.entries(htmlEntities)) {
      encoded = encoded.replace(new RegExp(char, 'g'), entity)
    }
    setOutput(encoded)
  }

  const decode = () => {
    if (!input.trim()) {
      alert('Please enter text to decode')
      return
    }

    let decoded = input
    for (const [char, entity] of Object.entries(htmlEntities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char)
    }
    
    // Decode numeric entities
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    
    setOutput(decoded)
  }

  const copyOutput = () => {
    if (!output) {
      alert('No output to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Text copied to clipboard!')
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="html-entity-encoder">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="encoder-container">
        <h1>HTML Entity Encoder</h1>
        <p className="subtitle">Encode and decode HTML entities and special characters</p>

        <div className="action-buttons">
          <button onClick={encode} className="primary-btn">
            🔒 Encode Entities
          </button>
          <button onClick={decode} className="secondary-btn">
            🔓 Decode Entities
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear
          </button>
        </div>

        <div className="editor-section">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Input Text</h3>
              <span className="char-count">{input.length} characters</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode/decode..."
              rows={15}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Output Text</h3>
              <button onClick={copyOutput} className="copy-btn" disabled={!output}>
                📋 Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Processed text will appear here..."
              rows={15}
            />
          </div>
        </div>

        <div className="entities-reference">
          <h3>Common HTML Entities Reference</h3>
          <div className="entities-grid">
            {Object.entries(htmlEntities).map(([char, entity]) => (
              <div key={char} className="entity-item">
                <span className="entity-char">{char}</span>
                <span className="entity-arrow">→</span>
                <code className="entity-code">{entity}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HTMLEntityEncoder
