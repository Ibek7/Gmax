import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/SQLFormatter.css'

function SQLFormatter() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true)

  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
    'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'DATABASE',
    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS', 'ON', 'USING',
    'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL',
    'AS', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK', 'DEFAULT',
    'AUTO_INCREMENT', 'CASCADE', 'CONSTRAINT', 'TRIGGER', 'PROCEDURE', 'FUNCTION'
  ]

  const formatSQL = () => {
    if (!input.trim()) {
      alert('Please enter SQL code to format')
      return
    }

    let formatted = input.trim()
    const indent = ' '.repeat(indentSize)
    
    // Remove extra whitespace
    formatted = formatted.replace(/\s+/g, ' ')
    
    // Add line breaks before major keywords
    const breakKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 
                          'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN',
                          'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE',
                          'VALUES', 'SET', 'UNION', 'UNION ALL', 'AND', 'OR']
    
    breakKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, `\n${keyword}`)
    })
    
    // Format parentheses
    formatted = formatted.replace(/\(/g, '(\n' + indent)
    formatted = formatted.replace(/\)/g, '\n)')
    
    // Format commas
    formatted = formatted.replace(/,/g, ',\n' + indent)
    
    // Clean up extra newlines
    formatted = formatted.replace(/\n+/g, '\n')
    
    // Apply proper indentation
    const lines = formatted.split('\n')
    let indentLevel = 0
    const formattedLines = lines.map(line => {
      line = line.trim()
      
      if (line.includes(')')) indentLevel = Math.max(0, indentLevel - 1)
      
      const indented = indent.repeat(indentLevel) + line
      
      if (line.includes('(')) indentLevel++
      
      return indented
    })
    
    formatted = formattedLines.join('\n')
    
    // Apply keyword casing
    if (uppercaseKeywords) {
      sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        formatted = formatted.replace(regex, keyword.toUpperCase())
      })
    } else {
      sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        formatted = formatted.replace(regex, keyword.toLowerCase())
      })
    }
    
    setOutput(formatted)
  }

  const minifySQL = () => {
    if (!input.trim()) {
      alert('Please enter SQL code to minify')
      return
    }

    let minified = input.trim()
    minified = minified.replace(/\s+/g, ' ')
    minified = minified.replace(/\s*,\s*/g, ',')
    minified = minified.replace(/\s*\(\s*/g, '(')
    minified = minified.replace(/\s*\)\s*/g, ')')
    minified = minified.replace(/\s*=\s*/g, '=')
    
    setOutput(minified)
  }

  const copyOutput = () => {
    if (!output) {
      alert('No formatted SQL to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Formatted SQL copied to clipboard!')
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  const loadSample = () => {
    const sample = `SELECT u.id, u.username, u.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2024-01-01' AND u.status = 'active' GROUP BY u.id, u.username, u.email HAVING COUNT(o.id) > 5 ORDER BY total_spent DESC LIMIT 10`
    setInput(sample)
  }

  return (
    <div className="sql-formatter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="sql-container">
        <h1>SQL Formatter</h1>
        <p className="subtitle">Format and beautify SQL queries with proper indentation</p>

        <div className="controls-section">
          <div className="controls-grid">
            <div className="control-group">
              <label>Indent Size</label>
              <select value={indentSize} onChange={(e) => setIndentSize(parseInt(e.target.value))}>
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <div className="control-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={uppercaseKeywords}
                  onChange={(e) => setUppercaseKeywords(e.target.checked)}
                />
                Uppercase Keywords
              </label>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={formatSQL} className="primary-btn">
              ✨ Format SQL
            </button>
            <button onClick={minifySQL} className="secondary-btn">
              🗜️ Minify SQL
            </button>
            <button onClick={loadSample} className="secondary-btn">
              📄 Load Sample
            </button>
            <button onClick={clearAll} className="clear-btn">
              🗑️ Clear
            </button>
          </div>
        </div>

        <div className="editor-section">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Input SQL</h3>
              <span className="char-count">{input.length} characters</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your SQL query here..."
              rows={15}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Formatted SQL</h3>
              <button onClick={copyOutput} className="copy-btn" disabled={!output}>
                📋 Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Formatted SQL will appear here..."
              rows={15}
            />
          </div>
        </div>

        <div className="info-section">
          <h3>Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <div>
                <h4>Smart Formatting</h4>
                <p>Automatically indent and organize SQL statements for better readability</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔤</span>
              <div>
                <h4>Keyword Capitalization</h4>
                <p>Choose between uppercase or lowercase SQL keywords</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🗜️</span>
              <div>
                <h4>SQL Minification</h4>
                <p>Remove unnecessary whitespace to reduce query size</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <div>
                <h4>Customizable Indentation</h4>
                <p>Select your preferred indentation size (2, 4, or 8 spaces)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SQLFormatter
