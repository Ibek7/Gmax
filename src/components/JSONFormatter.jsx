import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JSONFormatter.css'

const JSONFormatter = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) {
      setError('Invalid JSON: ' + e.message)
    }
  }

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError('Invalid JSON: ' + e.message)
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    alert('Copied!')
  }

  return (
    <div className="json-formatter-container">
      <div className="json-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📋 JSON Formatter</h1>
      </div>

      <div className="json-card">
        <div className="json-section">
          <h3>Input JSON</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="json-textarea"
          />
        </div>

        <div className="json-actions">
          <button onClick={formatJSON} className="format-btn">✨ Format</button>
          <button onClick={minifyJSON} className="minify-btn">📦 Minify</button>
          <button onClick={copyOutput} disabled={!output} className="copy-btn">📋 Copy</button>
        </div>

        {error && <div className="json-error">{error}</div>}

        {output && (
          <div className="json-section">
            <h3>Output</h3>
            <pre className="json-output">{output}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default JSONFormatter
