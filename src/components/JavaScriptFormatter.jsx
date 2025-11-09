import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JavaScriptFormatter.css'

function JavaScriptFormatter() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)

  const formatCode = () => {
    try {
      let code = input
      let indentLevel = 0
      let result = ''
      let inString = false
      let stringChar = ''
      let inComment = false
      let inMultilineComment = false
      
      const indent = ' '.repeat(indentSize)
      
      for (let i = 0; i < code.length; i++) {
        const char = code[i]
        const nextChar = code[i + 1]
        const prevChar = code[i - 1]
        
        // Handle multi-line comments
        if (char === '/' && nextChar === '*' && !inString) {
          inMultilineComment = true
          result += char
          continue
        }
        if (char === '*' && nextChar === '/' && inMultilineComment) {
          inMultilineComment = false
          result += char + nextChar
          i++
          continue
        }
        
        // Handle single-line comments
        if (char === '/' && nextChar === '/' && !inString && !inMultilineComment) {
          inComment = true
        }
        if (char === '\n' && inComment) {
          inComment = false
          result += char
          continue
        }
        
        // Skip formatting inside comments
        if (inComment || inMultilineComment) {
          result += char
          continue
        }
        
        // Handle strings
        if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
          if (!inString) {
            inString = true
            stringChar = char
          } else if (char === stringChar) {
            inString = false
            stringChar = ''
          }
        }
        
        // Skip formatting inside strings
        if (inString) {
          result += char
          continue
        }
        
        // Skip whitespace
        if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
          continue
        }
        
        // Handle opening braces
        if (char === '{' || char === '[') {
          result += char + '\n'
          indentLevel++
          result += indent.repeat(indentLevel)
          continue
        }
        
        // Handle closing braces
        if (char === '}' || char === ']') {
          indentLevel = Math.max(0, indentLevel - 1)
          result = result.trimEnd() + '\n' + indent.repeat(indentLevel) + char
          continue
        }
        
        // Handle semicolons
        if (char === ';') {
          result += char
          if (nextChar !== '}' && nextChar !== ']') {
            result += '\n' + indent.repeat(indentLevel)
          }
          continue
        }
        
        // Handle commas
        if (char === ',') {
          result += char + ' '
          continue
        }
        
        // Handle operators
        if ('+-*/%=<>!&|'.includes(char) && nextChar !== '=' && prevChar !== '=') {
          if (result[result.length - 1] !== ' ') {
            result += ' '
          }
          result += char
          if (nextChar !== ' ') {
            result += ' '
          }
          continue
        }
        
        // Handle parentheses
        if (char === '(') {
          result += char
          continue
        }
        if (char === ')') {
          result += char
          continue
        }
        
        // Add all other characters
        result += char
      }
      
      setOutput(result.trim())
    } catch (err) {
      alert(`Error formatting code: ${err.message}`)
    }
  }

  const minifyCode = () => {
    try {
      let code = input
      let result = ''
      let inString = false
      let stringChar = ''
      let inComment = false
      let inMultilineComment = false
      
      for (let i = 0; i < code.length; i++) {
        const char = code[i]
        const nextChar = code[i + 1]
        const prevChar = code[i - 1]
        
        // Handle multi-line comments - skip them
        if (char === '/' && nextChar === '*' && !inString) {
          inMultilineComment = true
          i++
          continue
        }
        if (char === '*' && nextChar === '/' && inMultilineComment) {
          inMultilineComment = false
          i++
          continue
        }
        if (inMultilineComment) continue
        
        // Handle single-line comments - skip them
        if (char === '/' && nextChar === '/' && !inString) {
          inComment = true
          i++
          continue
        }
        if (char === '\n' && inComment) {
          inComment = false
          continue
        }
        if (inComment) continue
        
        // Handle strings
        if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
          if (!inString) {
            inString = true
            stringChar = char
          } else if (char === stringChar) {
            inString = false
            stringChar = ''
          }
          result += char
          continue
        }
        
        // Keep strings as-is
        if (inString) {
          result += char
          continue
        }
        
        // Remove unnecessary whitespace
        if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
          const lastChar = result[result.length - 1]
          // Keep space between keywords and identifiers
          if (/[a-zA-Z0-9_$]/.test(lastChar) && /[a-zA-Z0-9_$]/.test(nextChar)) {
            result += ' '
          }
          continue
        }
        
        result += char
      }
      
      setOutput(result)
    } catch (err) {
      alert(`Error minifying code: ${err.message}`)
    }
  }

  const copyOutput = () => {
    if (!output) {
      alert('No output to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Code copied to clipboard!')
  }

  const downloadOutput = () => {
    if (!output) {
      alert('No output to download')
      return
    }
    
    const blob = new Blob([output], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.js'
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    const sample = `function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){total+=items[i].price*items[i].quantity;}return total;}const cart=[{name:"Apple",price:1.5,quantity:3},{name:"Banana",price:0.8,quantity:5}];console.log("Total:",calculateTotal(cart));`
    setInput(sample)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
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
    <div className="javascript-formatter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="formatter-container">
        <h1>JavaScript Formatter</h1>
        <p className="subtitle">Beautify and minify JavaScript code</p>

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
          <button onClick={formatCode} className="format-btn">
            ✨ Beautify
          </button>
          <button onClick={minifyCode} className="minify-btn">
            🗜️ Minify
          </button>
          <button onClick={loadSample} className="sample-btn">
            📄 Load Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear All
          </button>
        </div>

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
              <h3>Input Code</h3>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JavaScript code here..."
              rows={20}
              spellCheck={false}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Output Code</h3>
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
              placeholder="Formatted code will appear here..."
              rows={20}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JavaScriptFormatter
