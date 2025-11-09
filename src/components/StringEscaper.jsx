import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/StringEscaper.css'

function StringEscaper() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [escapeType, setEscapeType] = useState('javascript')

  const escapeJavaScript = (str) => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\b/g, '\\b')
      .replace(/\f/g, '\\f')
  }

  const unescapeJavaScript = (str) => {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
  }

  const escapeHTML = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  const unescapeHTML = (str) => {
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
  }

  const escapeURL = (str) => {
    return encodeURIComponent(str)
  }

  const unescapeURL = (str) => {
    try {
      return decodeURIComponent(str)
    } catch {
      return str
    }
  }

  const escapeJSON = (str) => {
    return JSON.stringify(str)
  }

  const unescapeJSON = (str) => {
    try {
      return JSON.parse(str)
    } catch {
      return str
    }
  }

  const escapeSQL = (str) => {
    return str
      .replace(/'/g, "''")
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\0/g, '\\0')
  }

  const unescapeSQL = (str) => {
    return str
      .replace(/''/g, "'")
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\0/g, '\0')
  }

  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const escapeXML = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const unescapeXML = (str) => {
    return str
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
  }

  const escapers = {
    javascript: { escape: escapeJavaScript, unescape: unescapeJavaScript },
    html: { escape: escapeHTML, unescape: unescapeHTML },
    url: { escape: escapeURL, unescape: unescapeURL },
    json: { escape: escapeJSON, unescape: unescapeJSON },
    sql: { escape: escapeSQL, unescape: unescapeSQL },
    regex: { escape: escapeRegex, unescape: (str) => str },
    xml: { escape: escapeXML, unescape: unescapeXML }
  }

  const handleEscape = () => {
    const result = escapers[escapeType].escape(input)
    return result
  }

  const handleUnescape = () => {
    const result = escapers[escapeType].unescape(input)
    return result
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const clearAll = () => {
    setInput('')
  }

  const loadSample = () => {
    const samples = {
      javascript: 'Hello "World"\nNew line\tTab\nBackslash: \\',
      html: '<div class="container">Hello & Welcome</div>',
      url: 'https://example.com/search?q=hello world&lang=en',
      json: 'Hello "World"\nNew line',
      sql: "SELECT * FROM users WHERE name = 'O'Brien'",
      regex: 'Find .*+ patterns? in [text]',
      xml: '<tag attribute="value">Content & more</tag>'
    }
    setInput(samples[escapeType])
  }

  return (
    <div className="string-escaper">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="escaper-container">
        <h1>String Escaper / Unescaper</h1>
        <p className="subtitle">Escape and unescape strings for various programming contexts</p>

        <div className="type-selector">
          <label>Escape Type:</label>
          <select value={escapeType} onChange={(e) => setEscapeType(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="url">URL</option>
            <option value="json">JSON</option>
            <option value="sql">SQL</option>
            <option value="regex">Regex</option>
            <option value="xml">XML</option>
          </select>
        </div>

        <div className="action-buttons">
          <button onClick={loadSample} className="sample-btn">
            📄 Load Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear
          </button>
        </div>

        <div className="input-section">
          <h3>Input Text</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to escape/unescape..."
            rows={8}
          />
        </div>

        <div className="results-grid">
          <div className="result-card">
            <div className="result-header">
              <h3>🔒 Escaped</h3>
              <button 
                onClick={() => copyToClipboard(handleEscape())}
                className="copy-btn-small"
                disabled={!input}
              >
                📋 Copy
              </button>
            </div>
            <textarea
              value={input ? handleEscape() : ''}
              readOnly
              placeholder="Escaped output will appear here..."
              rows={8}
            />
          </div>

          <div className="result-card">
            <div className="result-header">
              <h3>🔓 Unescaped</h3>
              <button 
                onClick={() => copyToClipboard(handleUnescape())}
                className="copy-btn-small"
                disabled={!input}
              >
                📋 Copy
              </button>
            </div>
            <textarea
              value={input ? handleUnescape() : ''}
              readOnly
              placeholder="Unescaped output will appear here..."
              rows={8}
            />
          </div>
        </div>

        <div className="info-section">
          <h3>Escape Types Reference</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>JavaScript</strong>
              <span>Escapes quotes, newlines, tabs, backslashes</span>
            </div>
            <div className="info-item">
              <strong>HTML</strong>
              <span>Escapes &lt;, &gt;, &amp;, quotes</span>
            </div>
            <div className="info-item">
              <strong>URL</strong>
              <span>Percent-encoding for URLs (UTF-8)</span>
            </div>
            <div className="info-item">
              <strong>JSON</strong>
              <span>JSON string escaping with quotes</span>
            </div>
            <div className="info-item">
              <strong>SQL</strong>
              <span>Escapes single quotes for SQL strings</span>
            </div>
            <div className="info-item">
              <strong>Regex</strong>
              <span>Escapes regex special characters</span>
            </div>
            <div className="info-item">
              <strong>XML</strong>
              <span>Escapes XML entities and attributes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StringEscaper
