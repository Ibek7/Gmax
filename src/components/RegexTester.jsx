import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/RegexTester.css'

export default function RegexTester() {
  const navigate = useNavigate()
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false })
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    testRegex()
  }, [pattern, testString, flags])

  const testRegex = () => {
    if (!pattern) {
      setMatches([])
      setError('')
      return
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('')
      
      const regex = new RegExp(pattern, flagString)
      const foundMatches = []
      
      if (flags.g) {
        let match
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          })
        }
      } else {
        const match = regex.exec(testString)
        if (match) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          })
        }
      }
      
      setMatches(foundMatches)
      setError('')
    } catch (e) {
      setError('Invalid regex pattern: ' + e.message)
      setMatches([])
    }
  }

  const toggleFlag = (flag) => {
    setFlags({ ...flags, [flag]: !flags[flag] })
  }

  const highlightMatches = () => {
    if (!testString || matches.length === 0) return testString

    let result = []
    let lastIndex = 0

    matches.forEach((match, idx) => {
      result.push(testString.slice(lastIndex, match.index))
      result.push(
        <mark key={idx} className="regex-match">
          {match.text}
        </mark>
      )
      lastIndex = match.index + match.text.length
    })
    
    result.push(testString.slice(lastIndex))
    return result
  }

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { name: 'Phone', pattern: '\\+?[1-9]\\d{1,14}' },
    { name: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
    { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' }
  ]

  const loadPattern = (p) => {
    setPattern(p)
  }

  return (
    <div className="regex-container">
      <div className="regex-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔍 Regex Tester</h1>
      </div>

      <div className="regex-card">
        <div className="pattern-section">
          <div className="pattern-input-group">
            <label>Regular Expression</label>
            <div className="pattern-input-wrapper">
              <span className="pattern-prefix">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="pattern-input"
              />
              <span className="pattern-suffix">/</span>
            </div>
          </div>

          <div className="flags-section">
            <label>Flags</label>
            <div className="flags-group">
              <button
                className={`flag-btn ${flags.g ? 'active' : ''}`}
                onClick={() => toggleFlag('g')}
                title="Global - Find all matches"
              >
                g
              </button>
              <button
                className={`flag-btn ${flags.i ? 'active' : ''}`}
                onClick={() => toggleFlag('i')}
                title="Case insensitive"
              >
                i
              </button>
              <button
                className={`flag-btn ${flags.m ? 'active' : ''}`}
                onClick={() => toggleFlag('m')}
                title="Multiline - ^ and $ match line starts/ends"
              >
                m
              </button>
              <button
                className={`flag-btn ${flags.s ? 'active' : ''}`}
                onClick={() => toggleFlag('s')}
                title="Dot all - . matches newlines"
              >
                s
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="test-section">
          <label>Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against the regex..."
            className="test-textarea"
          />
        </div>

        <div className="results-section">
          <div className="results-header">
            <h3>Results</h3>
            <span className="match-count">
              {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </span>
          </div>
          
          {testString && (
            <div className="highlighted-text">
              {highlightMatches()}
            </div>
          )}

          {matches.length > 0 && (
            <div className="matches-list">
              {matches.map((match, idx) => (
                <div key={idx} className="match-item">
                  <div className="match-header">
                    <span className="match-label">Match {idx + 1}</span>
                    <span className="match-index">Index: {match.index}</span>
                  </div>
                  <div className="match-text">{match.text}</div>
                  {match.groups.length > 0 && (
                    <div className="match-groups">
                      <strong>Groups:</strong>
                      {match.groups.map((group, gIdx) => (
                        <span key={gIdx} className="group-item">
                          {gIdx + 1}: {group || '(empty)'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="common-patterns">
          <h4>Common Patterns</h4>
          <div className="patterns-grid">
            {commonPatterns.map((p, idx) => (
              <button
                key={idx}
                className="pattern-btn"
                onClick={() => loadPattern(p.pattern)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
