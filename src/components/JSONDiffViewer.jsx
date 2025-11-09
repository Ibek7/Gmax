import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JSONDiffViewer.css'

function JSONDiffViewer() {
  const navigate = useNavigate()
  const [json1, setJson1] = useState('')
  const [json2, setJson2] = useState('')
  const [differences, setDifferences] = useState(null)
  const [error, setError] = useState('')

  const sampleJSON1 = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001'
    },
    skills: ['JavaScript', 'React', 'Node.js'],
    active: true
  }

  const sampleJSON2 = {
    name: 'John Doe',
    age: 31,
    email: 'john.doe@example.com',
    address: {
      street: '123 Main St',
      city: 'Los Angeles',
      zipCode: '90001',
      country: 'USA'
    },
    skills: ['JavaScript', 'React', 'Python'],
    active: true,
    verified: true
  }

  const loadSample = () => {
    setJson1(JSON.stringify(sampleJSON1, null, 2))
    setJson2(JSON.stringify(sampleJSON2, null, 2))
    setError('')
    setDifferences(null)
  }

  const compareJSON = () => {
    try {
      setError('')
      const obj1 = JSON.parse(json1)
      const obj2 = JSON.parse(json2)
      
      const diffs = findDifferences(obj1, obj2)
      setDifferences(diffs)
    } catch (err) {
      setError('Invalid JSON: ' + err.message)
      setDifferences(null)
    }
  }

  const findDifferences = (obj1, obj2, path = '') => {
    const diffs = {
      added: [],
      removed: [],
      modified: [],
      unchanged: []
    }

    const allKeys = new Set([
      ...Object.keys(obj1 || {}),
      ...Object.keys(obj2 || {})
    ])

    allKeys.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key
      const val1 = obj1?.[key]
      const val2 = obj2?.[key]

      if (!(key in obj1)) {
        diffs.added.push({
          path: currentPath,
          value: val2
        })
      } else if (!(key in obj2)) {
        diffs.removed.push({
          path: currentPath,
          value: val1
        })
      } else if (isObject(val1) && isObject(val2)) {
        const nestedDiffs = findDifferences(val1, val2, currentPath)
        diffs.added.push(...nestedDiffs.added)
        diffs.removed.push(...nestedDiffs.removed)
        diffs.modified.push(...nestedDiffs.modified)
        diffs.unchanged.push(...nestedDiffs.unchanged)
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        diffs.modified.push({
          path: currentPath,
          oldValue: val1,
          newValue: val2
        })
      } else {
        diffs.unchanged.push({
          path: currentPath,
          value: val1
        })
      }
    })

    return diffs
  }

  const isObject = (val) => {
    return val !== null && typeof val === 'object' && !Array.isArray(val)
  }

  const formatValue = (val) => {
    if (val === null) return 'null'
    if (val === undefined) return 'undefined'
    if (typeof val === 'object') return JSON.stringify(val)
    if (typeof val === 'string') return `"${val}"`
    return String(val)
  }

  const getTotalChanges = () => {
    if (!differences) return 0
    return differences.added.length + differences.removed.length + differences.modified.length
  }

  return (
    <div className="json-diff-viewer">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="diff-container">
        <h1>JSON Diff Viewer</h1>
        <p className="subtitle">Compare two JSON objects and visualize differences</p>

        <div className="actions-row">
          <button className="sample-btn" onClick={loadSample}>
            Load Sample
          </button>
          <button className="compare-btn" onClick={compareJSON}>
            Compare JSON
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="inputs-section">
          <div className="input-panel">
            <h3>JSON Object 1</h3>
            <textarea
              value={json1}
              onChange={(e) => setJson1(e.target.value)}
              placeholder="Paste your first JSON object here..."
            />
          </div>

          <div className="input-panel">
            <h3>JSON Object 2</h3>
            <textarea
              value={json2}
              onChange={(e) => setJson2(e.target.value)}
              placeholder="Paste your second JSON object here..."
            />
          </div>
        </div>

        {differences && (
          <div className="results-section">
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Changes:</span>
                <span className="stat-value">{getTotalChanges()}</span>
              </div>
              <div className="stat-item added-stat">
                <span className="stat-label">Added:</span>
                <span className="stat-value">{differences.added.length}</span>
              </div>
              <div className="stat-item removed-stat">
                <span className="stat-label">Removed:</span>
                <span className="stat-value">{differences.removed.length}</span>
              </div>
              <div className="stat-item modified-stat">
                <span className="stat-label">Modified:</span>
                <span className="stat-value">{differences.modified.length}</span>
              </div>
              <div className="stat-item unchanged-stat">
                <span className="stat-label">Unchanged:</span>
                <span className="stat-value">{differences.unchanged.length}</span>
              </div>
            </div>

            <div className="differences-list">
              {differences.added.length > 0 && (
                <div className="diff-section">
                  <h3 className="section-title added-title">➕ Added Properties</h3>
                  {differences.added.map((item, index) => (
                    <div key={index} className="diff-item added-item">
                      <span className="diff-path">{item.path}</span>
                      <span className="diff-value">{formatValue(item.value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {differences.removed.length > 0 && (
                <div className="diff-section">
                  <h3 className="section-title removed-title">➖ Removed Properties</h3>
                  {differences.removed.map((item, index) => (
                    <div key={index} className="diff-item removed-item">
                      <span className="diff-path">{item.path}</span>
                      <span className="diff-value">{formatValue(item.value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {differences.modified.length > 0 && (
                <div className="diff-section">
                  <h3 className="section-title modified-title">✏️ Modified Properties</h3>
                  {differences.modified.map((item, index) => (
                    <div key={index} className="diff-item modified-item">
                      <span className="diff-path">{item.path}</span>
                      <div className="value-comparison">
                        <span className="old-value">{formatValue(item.oldValue)}</span>
                        <span className="arrow">→</span>
                        <span className="new-value">{formatValue(item.newValue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JSONDiffViewer
