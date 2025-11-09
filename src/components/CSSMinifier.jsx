import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CSSMinifier.css'

function CSSMinifier() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState(null)

  const minifyCSS = () => {
    if (!input.trim()) {
      alert('Please enter CSS code to minify')
      return
    }

    let minified = input
    
    // Remove comments
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')
    
    // Remove whitespace
    minified = minified.replace(/\s+/g, ' ')
    minified = minified.replace(/\s*{\s*/g, '{')
    minified = minified.replace(/\s*}\s*/g, '}')
    minified = minified.replace(/\s*:\s*/g, ':')
    minified = minified.replace(/\s*;\s*/g, ';')
    minified = minified.replace(/\s*,\s*/g, ',')
    minified = minified.replace(/;\s*}/g, '}')
    
    // Remove last semicolon in each block
    minified = minified.replace(/;}/g, '}')
    
    minified = minified.trim()
    
    const originalSize = new Blob([input]).size
    const minifiedSize = new Blob([minified]).size
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2)
    
    setOutput(minified)
    setStats({
      original: originalSize,
      minified: minifiedSize,
      savings: savings
    })
  }

  const beautifyCSS = () => {
    if (!input.trim()) {
      alert('Please enter CSS code to beautify')
      return
    }

    let beautified = input
    
    // Remove existing formatting
    beautified = beautified.replace(/\s+/g, ' ')
    beautified = beautified.trim()
    
    // Add line breaks and indentation
    beautified = beautified.replace(/\s*{\s*/g, ' {\n  ')
    beautified = beautified.replace(/\s*}\s*/g, '\n}\n\n')
    beautified = beautified.replace(/\s*;\s*/g, ';\n  ')
    beautified = beautified.replace(/\s*,\s*/g, ',\n  ')
    
    // Fix indentation for nested rules
    const lines = beautified.split('\n')
    let indentLevel = 0
    const formattedLines = lines.map(line => {
      line = line.trim()
      
      if (line.includes('}')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }
      
      const indented = '  '.repeat(indentLevel) + line
      
      if (line.includes('{')) {
        indentLevel++
      }
      
      return indented
    })
    
    beautified = formattedLines.join('\n')
    
    // Clean up extra newlines
    beautified = beautified.replace(/\n{3,}/g, '\n\n')
    
    setOutput(beautified)
    setStats(null)
  }

  const copyOutput = () => {
    if (!output) {
      alert('No output to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('CSS copied to clipboard!')
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setStats(null)
  }

  const loadSample = () => {
    const sample = `.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.button { background-color: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
.button:hover { background-color: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
@media (max-width: 768px) { .container { padding: 10px; } .button { width: 100%; } }`
    setInput(sample)
  }

  return (
    <div className="css-minifier">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="minifier-container">
        <h1>CSS Minifier</h1>
        <p className="subtitle">Minify or beautify your CSS code</p>

        <div className="action-buttons">
          <button onClick={minifyCSS} className="primary-btn">
            🗜️ Minify CSS
          </button>
          <button onClick={beautifyCSS} className="secondary-btn">
            ✨ Beautify CSS
          </button>
          <button onClick={loadSample} className="secondary-btn">
            📄 Load Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear
          </button>
        </div>

        {stats && (
          <div className="stats-card">
            <h3>Compression Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Original Size</span>
                <span className="stat-value">{stats.original} bytes</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Minified Size</span>
                <span className="stat-value">{stats.minified} bytes</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Savings</span>
                <span className="stat-value savings">{stats.savings}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="editor-section">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Input CSS</h3>
              <span className="char-count">{input.length} characters</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your CSS code here..."
              rows={15}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Output CSS</h3>
              <button onClick={copyOutput} className="copy-btn" disabled={!output}>
                📋 Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Processed CSS will appear here..."
              rows={15}
            />
          </div>
        </div>

        <div className="info-section">
          <h3>Benefits</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <div>
                <h4>Faster Load Times</h4>
                <p>Smaller file sizes mean faster page loads and better performance</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💾</span>
              <div>
                <h4>Reduced Bandwidth</h4>
                <p>Save bandwidth and hosting costs with compressed CSS files</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎨</span>
              <div>
                <h4>Better Readability</h4>
                <p>Beautify minified CSS to make it easier to read and maintain</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🔧</span>
              <div>
                <h4>Production Ready</h4>
                <p>Optimize CSS for production deployment with minimal effort</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSSMinifier
