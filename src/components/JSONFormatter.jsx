import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JSONFormatter.css'

function JSONFormatter() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)

  const formatJSON = () => {
    setError('')
    setOutput('')

    if (!input.trim()) {
      setError('Please enter JSON to format')
      return
    }

    try {
      let parsed = JSON.parse(input)
      
      if (sortKeys) {
        parsed = sortObjectKeys(parsed)
      }

      const formatted = JSON.stringify(parsed, null, indentSize)
      setOutput(formatted)
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
    }
  }

  const sortObjectKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(item => sortObjectKeys(item))
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
          result[key] = sortObjectKeys(obj[key])
          return result
        }, {})
    }
    return obj
  }

  const minifyJSON = () => {
    setError('')
    setOutput('')

    if (!input.trim()) {
      setError('Please enter JSON to minify')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
    }
  }

  const validateJSON = () => {
    setError('')

    if (!input.trim()) {
      setError('Please enter JSON to validate')
      return
    }

    try {
      JSON.parse(input)
      setError('✅ Valid JSON!')
    } catch (err) {
      setError(`❌ Invalid JSON: ${err.message}`)
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const loadSample = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA",
        zipCode: "10001"
      },
      hobbies: ["reading", "coding", "gaming"],
      isActive: true,
      balance: 1234.56
    }
    setInput(JSON.stringify(sample, null, 2))
  }

  const escapeJSON = () => {
    setError('')
    setOutput('')

    if (!input.trim()) {
      setError('Please enter JSON to escape')
      return
    }

    const escaped = input
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
    
    setOutput(escaped)
  }

  const unescapeJSON = () => {
    setError('')
    setOutput('')

    if (!input.trim()) {
      setError('Please enter JSON to unescape')
      return
    }

    const unescaped = input
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
    
    setOutput(unescaped)
  }

  return (
    <div className="json-formatter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="json-container">
        <h1>JSON Formatter & Validator</h1>
        <p className="subtitle">Format, validate, minify, and manipulate JSON data</p>

        <div className="controls">
          <div className="control-group">
            <label>
              Indent Size:
              <select value={indentSize} onChange={(e) => setIndentSize(parseInt(e.target.value))}>
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </label>
          </div>

          <div className="control-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
              />
              Sort Keys Alphabetically
            </label>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={formatJSON} className="format-btn">
            🎨 Format
          </button>
          <button onClick={minifyJSON} className="minify-btn">
            �️ Minify
          </button>
          <button onClick={validateJSON} className="validate-btn">
            ✓ Validate
          </button>
          <button onClick={escapeJSON} className="escape-btn">
            🔒 Escape
          </button>
          <button onClick={unescapeJSON} className="unescape-btn">
            🔓 Unescape
          </button>
          <button onClick={loadSample} className="sample-btn">
            📄 Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            �️ Clear
          </button>
        </div>

        {error && (
          <div className={`error-message ${error.startsWith('✅') ? 'success' : 'error'}`}>
            {error}
          </div>
        )}

        <div className="editor-area">
          <div className="editor-panel">
            <h3>Input JSON</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              rows={20}
            />
          </div>

          <div className="editor-panel">
            <div className="output-header">
              <h3>Output</h3>
              {output && (
                <button onClick={copyOutput} className="copy-btn">
                  📋 Copy
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Formatted/minified JSON will appear here..."
              rows={20}
            />
          </div>
        </div>

        <div className="info-section">
          <h3>JSON Operations</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Format</strong>
              <p>Beautifies JSON with proper indentation and line breaks for better readability.</p>
            </div>
            <div className="info-item">
              <strong>Minify</strong>
              <p>Removes all whitespace and line breaks to reduce file size.</p>
            </div>
            <div className="info-item">
              <strong>Validate</strong>
              <p>Checks if the JSON syntax is valid and shows specific error messages.</p>
            </div>
            <div className="info-item">
              <strong>Escape/Unescape</strong>
              <p>Escapes special characters for embedding JSON in strings, or reverses the process.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JSONFormatter
