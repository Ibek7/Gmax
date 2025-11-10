import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CodeDiffTool.css'

function CodeDiffTool() {
  const navigate = useNavigate()
  const [leftCode, setLeftCode] = useState('')
  const [rightCode, setRightCode] = useState('')
  const [diffResult, setDiffResult] = useState(null)
  const [language, setLanguage] = useState('javascript')
  const [viewMode, setViewMode] = useState('split')

  const computeDiff = () => {
    const leftLines = leftCode.split('\n')
    const rightLines = rightCode.split('\n')
    
    const diff = []
    const maxLength = Math.max(leftLines.length, rightLines.length)
    
    for (let i = 0; i < maxLength; i++) {
      const leftLine = leftLines[i] || ''
      const rightLine = rightLines[i] || ''
      
      if (leftLine === rightLine) {
        diff.push({ type: 'equal', left: leftLine, right: rightLine, lineNum: i + 1 })
      } else if (!leftLines[i] && rightLines[i]) {
        diff.push({ type: 'added', left: '', right: rightLine, lineNum: i + 1 })
      } else if (leftLines[i] && !rightLines[i]) {
        diff.push({ type: 'deleted', left: leftLine, right: '', lineNum: i + 1 })
      } else {
        diff.push({ type: 'modified', left: leftLine, right: rightLine, lineNum: i + 1 })
      }
    }
    
    setDiffResult(diff)
  }

  const clearAll = () => {
    setLeftCode('')
    setRightCode('')
    setDiffResult(null)
  }

  const loadSample = () => {
    const sampleLeft = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const result = calculateTotal(cart);
console.log(result);`

    const sampleRight = `function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);
}

const result = calculateTotal(cart);
console.log('Total:', result);`

    setLeftCode(sampleLeft)
    setRightCode(sampleRight)
  }

  const getStats = () => {
    if (!diffResult) return null
    
    const stats = {
      equal: 0,
      added: 0,
      deleted: 0,
      modified: 0
    }
    
    diffResult.forEach(item => {
      stats[item.type]++
    })
    
    return stats
  }

  const stats = getStats()

  return (
    <div className="code-diff-tool">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="diff-container">
        <h1>Code Diff Tool</h1>
        <p className="subtitle">Compare two code snippets side-by-side with syntax highlighting</p>

        <div className="controls-section">
          <div className="control-group">
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="text">Plain Text</option>
            </select>
          </div>

          <div className="control-group">
            <label>View Mode</label>
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <option value="split">Split View</option>
              <option value="unified">Unified View</option>
            </select>
          </div>

          <div className="action-buttons">
            <button className="sample-btn" onClick={loadSample}>
              Load Sample
            </button>
            <button className="compare-btn" onClick={computeDiff}>
              Compare Code
            </button>
            <button className="clear-btn" onClick={clearAll}>
              Clear All
            </button>
          </div>
        </div>

        <div className="editor-section">
          <div className="editor-wrapper">
            <h3>Original Code (Left)</h3>
            <textarea
              className="code-editor"
              value={leftCode}
              onChange={(e) => setLeftCode(e.target.value)}
              placeholder="Paste your original code here..."
              spellCheck="false"
            />
          </div>

          <div className="editor-wrapper">
            <h3>Modified Code (Right)</h3>
            <textarea
              className="code-editor"
              value={rightCode}
              onChange={(e) => setRightCode(e.target.value)}
              placeholder="Paste your modified code here..."
              spellCheck="false"
            />
          </div>
        </div>

        {diffResult && stats && (
          <div className="diff-section">
            <div className="stats-bar">
              <h3>Comparison Results</h3>
              <div className="stats">
                <span className="stat equal">
                  ✓ {stats.equal} unchanged
                </span>
                <span className="stat added">
                  + {stats.added} added
                </span>
                <span className="stat deleted">
                  - {stats.deleted} deleted
                </span>
                <span className="stat modified">
                  ~ {stats.modified} modified
                </span>
              </div>
            </div>

            <div className={`diff-display ${viewMode}`}>
              {viewMode === 'split' ? (
                <div className="split-view">
                  <div className="diff-pane left-pane">
                    {diffResult.map((item, index) => (
                      <div
                        key={index}
                        className={`diff-line ${item.type}`}
                      >
                        <span className="line-number">{item.lineNum}</span>
                        <pre className="line-content">{item.left || ' '}</pre>
                      </div>
                    ))}
                  </div>
                  <div className="diff-pane right-pane">
                    {diffResult.map((item, index) => (
                      <div
                        key={index}
                        className={`diff-line ${item.type}`}
                      >
                        <span className="line-number">{item.lineNum}</span>
                        <pre className="line-content">{item.right || ' '}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="unified-view">
                  {diffResult.map((item, index) => {
                    if (item.type === 'equal') {
                      return (
                        <div key={index} className="diff-line equal">
                          <span className="line-number">{item.lineNum}</span>
                          <pre className="line-content">{item.left}</pre>
                        </div>
                      )
                    } else if (item.type === 'modified') {
                      return (
                        <div key={index}>
                          <div className="diff-line deleted">
                            <span className="line-number">-{item.lineNum}</span>
                            <pre className="line-content">{item.left}</pre>
                          </div>
                          <div className="diff-line added">
                            <span className="line-number">+{item.lineNum}</span>
                            <pre className="line-content">{item.right}</pre>
                          </div>
                        </div>
                      )
                    } else if (item.type === 'added') {
                      return (
                        <div key={index} className="diff-line added">
                          <span className="line-number">+{item.lineNum}</span>
                          <pre className="line-content">{item.right}</pre>
                        </div>
                      )
                    } else {
                      return (
                        <div key={index} className="diff-line deleted">
                          <span className="line-number">-{item.lineNum}</span>
                          <pre className="line-content">{item.left}</pre>
                        </div>
                      )
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>How to Use</h3>
          <ul>
            <li>Paste your original code in the left editor</li>
            <li>Paste your modified code in the right editor</li>
            <li>Click "Compare Code" to see the differences</li>
            <li>Green lines are additions, red lines are deletions</li>
            <li>Yellow lines indicate modifications</li>
            <li>Switch between Split and Unified view modes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CodeDiffTool
