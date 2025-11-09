import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/XMLFormatter.css'

function XMLFormatter() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [error, setError] = useState('')

  const formatXML = () => {
    try {
      setError('')
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input, 'text/xml')
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror')
      if (parserError) {
        setError('Invalid XML: ' + parserError.textContent)
        setOutput('')
        return
      }

      const formatted = formatNode(xmlDoc, 0)
      setOutput(formatted.trim())
    } catch (err) {
      setError('Error formatting XML: ' + err.message)
      setOutput('')
    }
  }

  const formatNode = (node, level) => {
    const indent = ' '.repeat(indentSize * level)
    let result = ''

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.nodeName
      const attributes = Array.from(node.attributes || [])
        .map(attr => ` ${attr.name}="${attr.value}"`)
        .join('')

      const hasChildren = node.childNodes.length > 0
      const hasTextContent = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE

      if (hasTextContent) {
        // Inline text content
        result += `${indent}<${tagName}${attributes}>${node.textContent}</${tagName}>\n`
      } else if (hasChildren) {
        // Has child elements
        result += `${indent}<${tagName}${attributes}>\n`
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            result += formatNode(child, level + 1)
          } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            result += `${' '.repeat(indentSize * (level + 1))}${child.textContent.trim()}\n`
          }
        })
        result += `${indent}</${tagName}>\n`
      } else {
        // Self-closing tag
        result += `${indent}<${tagName}${attributes} />\n`
      }
    } else if (node.nodeType === Node.DOCUMENT_NODE) {
      // Document node - process children
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          result += formatNode(child, level)
        }
      })
    }

    return result
  }

  const minifyXML = () => {
    try {
      setError('')
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input, 'text/xml')
      
      const parserError = xmlDoc.querySelector('parsererror')
      if (parserError) {
        setError('Invalid XML: ' + parserError.textContent)
        setOutput('')
        return
      }

      const minified = new XMLSerializer().serializeToString(xmlDoc)
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim()
      
      setOutput(minified)
    } catch (err) {
      setError('Error minifying XML: ' + err.message)
      setOutput('')
    }
  }

  const validateXML = () => {
    try {
      setError('')
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(input, 'text/xml')
      
      const parserError = xmlDoc.querySelector('parsererror')
      if (parserError) {
        setError('❌ Invalid XML: ' + parserError.textContent)
      } else {
        alert('✅ Valid XML!')
      }
    } catch (err) {
      setError('❌ Error validating XML: ' + err.message)
    }
  }

  const copyOutput = () => {
    if (!output) {
      alert('No output to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('XML copied to clipboard!')
  }

  const downloadOutput = () => {
    if (!output) {
      alert('No output to download')
      return
    }
    
    const blob = new Blob([output], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.xml'
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    const sample = `<?xml version="1.0" encoding="UTF-8"?><bookstore><book category="cooking"><title lang="en">Everyday Italian</title><author>Giada De Laurentiis</author><year>2005</year><price>30.00</price></book><book category="children"><title lang="en">Harry Potter</title><author>J K. Rowling</author><year>2005</year><price>29.99</price></book></bookstore>`
    setInput(sample)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const getStats = () => {
    if (!input || !output) return null
    
    return {
      original: input.length,
      formatted: output.length,
      difference: output.length - input.length,
      percentage: input.length > 0 ? ((output.length - input.length) / input.length * 100).toFixed(1) : 0
    }
  }

  const stats = getStats()

  return (
    <div className="xml-formatter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="formatter-container">
        <h1>XML Formatter</h1>
        <p className="subtitle">Format, minify, and validate XML documents</p>

        <div className="controls">
          <div className="indent-control">
            <label>Indent Size:</label>
            <select value={indentSize} onChange={(e) => setIndentSize(Number(e.target.value))}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={formatXML} className="format-btn">
            ✨ Format XML
          </button>
          <button onClick={minifyXML} className="minify-btn">
            🗜️ Minify XML
          </button>
          <button onClick={validateXML} className="validate-btn">
            ✅ Validate XML
          </button>
          <button onClick={loadSample} className="sample-btn">
            📄 Load Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear All
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {stats && (
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">Original:</span>
              <span className="stat-value">{stats.original} chars</span>
            </div>
            <div className="stat">
              <span className="stat-label">Formatted:</span>
              <span className="stat-value">{stats.formatted} chars</span>
            </div>
            <div className="stat">
              <span className="stat-label">Difference:</span>
              <span className={`stat-value ${stats.difference > 0 ? 'positive' : 'negative'}`}>
                {stats.difference > 0 ? '+' : ''}{stats.difference} ({stats.percentage}%)
              </span>
            </div>
          </div>
        )}

        <div className="editor-section">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Input XML</h3>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your XML here..."
              rows={20}
              spellCheck={false}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Output XML</h3>
              <div className="output-actions">
                <button onClick={copyOutput} className="action-btn" disabled={!output}>
                  📋 Copy
                </button>
                <button onClick={downloadOutput} className="action-btn" disabled={!output}>
                  ⬇️ Download
                </button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Formatted XML will appear here..."
              rows={20}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default XMLFormatter
