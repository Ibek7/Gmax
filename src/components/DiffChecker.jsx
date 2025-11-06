import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DiffChecker.css'

function DiffChecker() {
  const navigate = useNavigate()
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diffMode, setDiffMode] = useState('chars') // 'chars' or 'lines'
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  // Calculate differences at character level
  const getCharDiff = (str1, str2) => {
    const s1 = ignoreCase ? str1.toLowerCase() : str1
    const s2 = ignoreCase ? str2.toLowerCase() : str2
    
    const len1 = s1.length
    const len2 = s2.length
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0))

    for (let i = 0; i <= len1; i++) matrix[i][0] = i
    for (let j = 0; j <= len2; j++) matrix[0][j] = j

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          )
        }
      }
    }

    const diff1 = []
    const diff2 = []
    let i = len1, j = len2

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
        diff1.unshift({ type: 'equal', char: str1[i - 1] })
        diff2.unshift({ type: 'equal', char: str2[j - 1] })
        i--
        j--
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] <= matrix[i - 1][j])) {
        diff1.unshift({ type: 'insert', char: '' })
        diff2.unshift({ type: 'insert', char: str2[j - 1] })
        j--
      } else if (i > 0) {
        diff1.unshift({ type: 'delete', char: str1[i - 1] })
        diff2.unshift({ type: 'delete', char: '' })
        i--
      }
    }

    return { diff1, diff2 }
  }

  // Calculate differences at line level
  const getLineDiff = (str1, str2) => {
    let lines1 = str1.split('\n')
    let lines2 = str2.split('\n')

    if (ignoreWhitespace) {
      lines1 = lines1.map(l => l.trim())
      lines2 = lines2.map(l => l.trim())
    }

    const len1 = lines1.length
    const len2 = lines2.length
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0))

    for (let i = 0; i <= len1; i++) matrix[i][0] = i
    for (let j = 0; j <= len2; j++) matrix[0][j] = j

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const line1 = ignoreCase ? lines1[i - 1].toLowerCase() : lines1[i - 1]
        const line2 = ignoreCase ? lines2[j - 1].toLowerCase() : lines2[j - 1]
        
        if (line1 === line2) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          )
        }
      }
    }

    const diff1 = []
    const diff2 = []
    let i = len1, j = len2

    while (i > 0 || j > 0) {
      const line1 = i > 0 ? (ignoreCase ? lines1[i - 1].toLowerCase() : lines1[i - 1]) : ''
      const line2 = j > 0 ? (ignoreCase ? lines2[j - 1].toLowerCase() : lines2[j - 1]) : ''

      if (i > 0 && j > 0 && line1 === line2) {
        diff1.unshift({ type: 'equal', line: str1.split('\n')[i - 1], lineNum: i })
        diff2.unshift({ type: 'equal', line: str2.split('\n')[j - 1], lineNum: j })
        i--
        j--
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] <= matrix[i - 1][j])) {
        diff1.unshift({ type: 'insert', line: '', lineNum: null })
        diff2.unshift({ type: 'insert', line: str2.split('\n')[j - 1], lineNum: j })
        j--
      } else if (i > 0) {
        diff1.unshift({ type: 'delete', line: str1.split('\n')[i - 1], lineNum: i })
        diff2.unshift({ type: 'delete', line: '', lineNum: null })
        i--
      }
    }

    return { diff1, diff2 }
  }

  const renderCharDiff = () => {
    const { diff1, diff2 } = getCharDiff(text1, text2)
    
    return (
      <div className="diff-display char-diff">
        <div className="diff-panel">
          <h3>Original Text</h3>
          <div className="diff-content">
            {diff1.map((item, idx) => (
              <span
                key={idx}
                className={`diff-char ${item.type}`}
              >
                {item.char || (item.type === 'insert' ? ' ' : '')}
              </span>
            ))}
          </div>
        </div>
        <div className="diff-panel">
          <h3>Modified Text</h3>
          <div className="diff-content">
            {diff2.map((item, idx) => (
              <span
                key={idx}
                className={`diff-char ${item.type}`}
              >
                {item.char || (item.type === 'delete' ? ' ' : '')}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderLineDiff = () => {
    const { diff1, diff2 } = getLineDiff(text1, text2)
    
    return (
      <div className="diff-display line-diff">
        <div className="diff-panel">
          <h3>Original Text</h3>
          <div className="diff-content">
            {diff1.map((item, idx) => (
              <div
                key={idx}
                className={`diff-line ${item.type}`}
              >
                <span className="line-num">{item.lineNum || ''}</span>
                <span className="line-text">{item.line || '\u00A0'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="diff-panel">
          <h3>Modified Text</h3>
          <div className="diff-content">
            {diff2.map((item, idx) => (
              <div
                key={idx}
                className={`diff-line ${item.type}`}
              >
                <span className="line-num">{item.lineNum || ''}</span>
                <span className="line-text">{item.line || '\u00A0'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getStats = () => {
    if (diffMode === 'chars') {
      const { diff1, diff2 } = getCharDiff(text1, text2)
      const deletions = diff1.filter(d => d.type === 'delete').length
      const insertions = diff2.filter(d => d.type === 'insert').length
      const unchanged = diff1.filter(d => d.type === 'equal').length
      return { deletions, insertions, unchanged }
    } else {
      const { diff1, diff2 } = getLineDiff(text1, text2)
      const deletions = diff1.filter(d => d.type === 'delete').length
      const insertions = diff2.filter(d => d.type === 'insert').length
      const unchanged = diff1.filter(d => d.type === 'equal').length
      return { deletions, insertions, unchanged }
    }
  }

  const swapTexts = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
  }

  const clearTexts = () => {
    setText1('')
    setText2('')
  }

  const stats = getStats()

  return (
    <div className="diff-checker">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="diff-container">
        <h1>Diff Checker</h1>
        <p className="subtitle">Compare two texts and see the differences highlighted</p>

        <div className="controls">
          <div className="mode-selector">
            <button
              className={diffMode === 'chars' ? 'active' : ''}
              onClick={() => setDiffMode('chars')}
            >
              Character Mode
            </button>
            <button
              className={diffMode === 'lines' ? 'active' : ''}
              onClick={() => setDiffMode('lines')}
            >
              Line Mode
            </button>
          </div>

          <div className="options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              />
              Ignore Whitespace
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
              />
              Ignore Case
            </label>
          </div>

          <div className="action-buttons">
            <button onClick={swapTexts} className="swap-btn">
              ⇄ Swap Texts
            </button>
            <button onClick={clearTexts} className="clear-btn">
              Clear All
            </button>
          </div>
        </div>

        <div className="input-area">
          <div className="input-panel">
            <label>Original Text</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter original text..."
              rows={10}
            />
          </div>
          <div className="input-panel">
            <label>Modified Text</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter modified text..."
              rows={10}
            />
          </div>
        </div>

        {(text1 || text2) && (
          <>
            <div className="stats">
              <div className="stat-item deletions">
                <span className="stat-label">Deletions</span>
                <span className="stat-value">{stats.deletions}</span>
              </div>
              <div className="stat-item insertions">
                <span className="stat-label">Insertions</span>
                <span className="stat-value">{stats.insertions}</span>
              </div>
              <div className="stat-item unchanged">
                <span className="stat-label">Unchanged</span>
                <span className="stat-value">{stats.unchanged}</span>
              </div>
            </div>

            {diffMode === 'chars' ? renderCharDiff() : renderLineDiff()}
          </>
        )}

        <div className="info-section">
          <h3>How to Use</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Character Mode</strong>
              <p>Shows differences at the character level. Best for comparing short texts or finding small changes.</p>
            </div>
            <div className="info-item">
              <strong>Line Mode</strong>
              <p>Shows differences at the line level. Best for comparing code, documents, or structured text.</p>
            </div>
            <div className="info-item">
              <strong>Ignore Whitespace</strong>
              <p>Ignores leading and trailing whitespace in line mode. Useful for code comparisons.</p>
            </div>
            <div className="info-item">
              <strong>Ignore Case</strong>
              <p>Makes the comparison case-insensitive. Useful when case differences don't matter.</p>
            </div>
          </div>
          <div className="legend">
            <h4>Color Legend</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color delete"></span>
                <span>Deleted (removed from original)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color insert"></span>
                <span>Inserted (added in modified)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color equal"></span>
                <span>Unchanged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiffChecker
