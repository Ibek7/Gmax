import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/URLTool.css'

export default function URLTool() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [encodeType, setEncodeType] = useState('component')

  const handleEncode = () => {
    try {
      if (encodeType === 'component') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(encodeURI(input))
      }
    } catch (e) {
      alert('Error encoding: ' + e.message)
    }
  }

  const handleDecode = () => {
    try {
      if (encodeType === 'component') {
        setOutput(decodeURIComponent(input))
      } else {
        setOutput(decodeURI(input))
      }
    } catch (e) {
      alert('Error decoding: ' + e.message)
    }
  }

  const handleProcess = () => {
    if (!input.trim()) {
      alert('Please enter text')
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

  const clear = () => {
    setInput('')
    setOutput('')
  }

  const swap = () => {
    const temp = input
    setInput(output)
    setOutput(temp)
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="url-container">
      <div className="url-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔗 URL Encoder/Decoder</h1>
      </div>

      <div className="url-card">
        <div className="mode-section">
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

          <div className="type-toggle">
            <label>Encode Type</label>
            <select value={encodeType} onChange={(e) => setEncodeType(e.target.value)}>
              <option value="component">Component (encodeURIComponent)</option>
              <option value="full">Full URL (encodeURI)</option>
            </select>
          </div>
        </div>

        <div className="input-section">
          <h3>Input</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter encoded URL to decode...'}
            className="url-textarea"
          />
        </div>

        <div className="process-section">
          <button onClick={handleProcess} className="process-btn">
            {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
          </button>
          <button onClick={swap} className="swap-btn" disabled={!output}>
            ⇄ Swap
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
              className="url-textarea output"
            />
          </div>
        )}

        <div className="info-section">
          <h4>ℹ️ URL Encoding</h4>
          <div className="info-grid">
            <div>
              <strong>encodeURIComponent:</strong>
              <p>Encodes all characters except: A-Z a-z 0-9 - _ . ! ~ * ' ( )</p>
              <p>Use for: Query parameters, path segments</p>
            </div>
            <div>
              <strong>encodeURI:</strong>
              <p>Encodes fewer characters, preserves URL structure</p>
              <p>Use for: Complete URLs with protocol, domain, path</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
