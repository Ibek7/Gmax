import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Base64Tool.css'

export default function Base64Tool() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(encoded)
      setError('')
    } catch (e) {
      setError('Error encoding: ' + e.message)
    }
  }

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      setOutput(decoded)
      setError('')
    } catch (e) {
      setError('Error decoding: Invalid Base64 string')
    }
  }

  const handleProcess = () => {
    if (!input.trim()) {
      setError('Please enter text')
      return
    }
    
    if (mode === 'encode') {
      handleEncode()
    } else {
      handleDecode()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (mode === 'encode') {
        const base64 = event.target.result.split(',')[1]
        setOutput(base64)
      } else {
        setInput(event.target.result)
      }
    }
    
    if (mode === 'encode') {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="base64-container">
      <div className="base64-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔐 Base64 Encoder/Decoder</h1>
      </div>

      <div className="base64-card">
        <div className="mode-toggle">
          <button 
            className={`mode-btn ${mode === 'encode' ? 'active' : ''}`}
            onClick={() => { setMode('encode'); clear() }}
          >
            Encode
          </button>
          <button 
            className={`mode-btn ${mode === 'decode' ? 'active' : ''}`}
            onClick={() => { setMode('decode'); clear() }}
          >
            Decode
          </button>
        </div>

        <div className="input-section">
          <h3>Input</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            className="base64-textarea"
          />
          <div className="input-actions">
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" className="file-upload-btn">
              📁 Upload File
            </label>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="process-section">
          <button onClick={handleProcess} className="process-btn">
            {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
          </button>
          <button onClick={clear} className="clear-btn">
            🗑️ Clear
          </button>
        </div>

        {output && (
          <div className="output-section">
            <div className="output-header">
              <h3>Output</h3>
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="base64-textarea output"
            />
          </div>
        )}

        <div className="info-section">
          <h4>ℹ️ About Base64</h4>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format.
            It's commonly used to encode data for transmission over text-based protocols.
          </p>
        </div>
      </div>
    </div>
  )
}
