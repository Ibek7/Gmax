import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/RegexLibrary.css'

function RegexLibrary() {
  const navigate = useNavigate()
  const [selectedPattern, setSelectedPattern] = useState(null)
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState([])

  const patterns = [
    {
      name: 'Email Address',
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      description: 'Validates standard email addresses',
      example: 'user@example.com',
      flags: ''
    },
    {
      name: 'URL',
      pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      description: 'Matches HTTP/HTTPS URLs',
      example: 'https://www.example.com/path',
      flags: ''
    },
    {
      name: 'Phone Number (US)',
      pattern: /^(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
      description: 'US phone numbers with various formats',
      example: '(555) 123-4567 or +1-555-123-4567',
      flags: ''
    },
    {
      name: 'IPv4 Address',
      pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      description: 'Validates IPv4 addresses',
      example: '192.168.1.1',
      flags: ''
    },
    {
      name: 'Hexadecimal Color',
      pattern: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
      description: 'Hex color codes (3 or 6 digits)',
      example: '#FF5733 or #FFF',
      flags: ''
    },
    {
      name: 'Credit Card',
      pattern: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$/,
      description: 'Visa, Mastercard, American Express',
      example: '4111111111111111',
      flags: ''
    },
    {
      name: 'Date (MM/DD/YYYY)',
      pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
      description: 'US date format',
      example: '12/31/2023',
      flags: ''
    },
    {
      name: 'Time (24-hour)',
      pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      description: '24-hour time format',
      example: '14:30 or 14:30:45',
      flags: ''
    },
    {
      name: 'Username',
      pattern: /^[a-zA-Z0-9_-]{3,16}$/,
      description: 'Alphanumeric, underscore, hyphen (3-16 chars)',
      example: 'user_name-123',
      flags: ''
    },
    {
      name: 'Strong Password',
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      description: 'Min 8 chars, uppercase, lowercase, number, special char',
      example: 'Pass@123',
      flags: ''
    },
    {
      name: 'ZIP Code (US)',
      pattern: /^\d{5}(-\d{4})?$/,
      description: '5-digit or ZIP+4 format',
      example: '12345 or 12345-6789',
      flags: ''
    },
    {
      name: 'SSN',
      pattern: /^\d{3}-\d{2}-\d{4}$/,
      description: 'Social Security Number',
      example: '123-45-6789',
      flags: ''
    },
    {
      name: 'HTML Tags',
      pattern: /<\/?[\w\s="/.':;#-\/]+>/gi,
      description: 'Matches HTML tags',
      example: '<div class="container">',
      flags: 'gi'
    },
    {
      name: 'JavaScript Variable',
      pattern: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      description: 'Valid JavaScript variable names',
      example: 'myVariable_123',
      flags: ''
    }
  ]

  const testPattern = () => {
    if (!selectedPattern || !testString) {
      alert('Please select a pattern and enter test string')
      return
    }

    const regex = selectedPattern.pattern
    const isGlobal = selectedPattern.flags.includes('g')

    if (isGlobal) {
      const allMatches = testString.matchAll(new RegExp(regex.source, regex.flags))
      setMatches(Array.from(allMatches).map(m => m[0]))
    } else {
      const match = testString.match(regex)
      setMatches(match ? [match[0]] : [])
    }
  }

  const copyPattern = (pattern) => {
    navigator.clipboard.writeText(pattern.pattern.source)
    alert('Pattern copied to clipboard!')
  }

  return (
    <div className="regex-library">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="library-container">
        <h1>Regex Library</h1>
        <p className="subtitle">Common regular expression patterns with live testing</p>

        <div className="patterns-grid">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className={`pattern-card ${selectedPattern === pattern ? 'selected' : ''}`}
              onClick={() => setSelectedPattern(pattern)}
            >
              <div className="pattern-header">
                <h3>{pattern.name}</h3>
                <button
                  className="copy-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyPattern(pattern)
                  }}
                >
                  📋
                </button>
              </div>
              <p className="pattern-description">{pattern.description}</p>
              <code className="pattern-code">{pattern.pattern.source}</code>
              <p className="pattern-example">Example: {pattern.example}</p>
            </div>
          ))}
        </div>

        {selectedPattern && (
          <div className="tester-section">
            <h3>Test Pattern: {selectedPattern.name}</h3>
            <div className="test-area">
              <div className="pattern-display">
                <label>Regular Expression:</label>
                <code className="regex-display">
                  /{selectedPattern.pattern.source}/{selectedPattern.flags}
                </code>
              </div>

              <div className="input-group">
                <label>Test String:</label>
                <input
                  type="text"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Enter text to test..."
                />
              </div>

              <button className="test-btn" onClick={testPattern}>
                Test Pattern
              </button>

              {matches.length > 0 && (
                <div className="matches-result success">
                  <h4>✓ Match Found!</h4>
                  <div className="matches-list">
                    {matches.map((match, idx) => (
                      <div key={idx} className="match-item">
                        <strong>Match {idx + 1}:</strong> {match}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testString && matches.length === 0 && (
                <div className="matches-result failure">
                  <h4>✗ No Match</h4>
                  <p>The input does not match the pattern.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Regex Quick Reference</h3>
          <div className="reference-grid">
            <div className="ref-item">
              <code>.</code>
              <span>Any character</span>
            </div>
            <div className="ref-item">
              <code>\d</code>
              <span>Digit (0-9)</span>
            </div>
            <div className="ref-item">
              <code>\w</code>
              <span>Word character</span>
            </div>
            <div className="ref-item">
              <code>\s</code>
              <span>Whitespace</span>
            </div>
            <div className="ref-item">
              <code>^</code>
              <span>Start of string</span>
            </div>
            <div className="ref-item">
              <code>$</code>
              <span>End of string</span>
            </div>
            <div className="ref-item">
              <code>*</code>
              <span>0 or more</span>
            </div>
            <div className="ref-item">
              <code>+</code>
              <span>1 or more</span>
            </div>
            <div className="ref-item">
              <code>?</code>
              <span>0 or 1</span>
            </div>
            <div className="ref-item">
              <code>{'{n}'}</code>
              <span>Exactly n times</span>
            </div>
            <div className="ref-item">
              <code>[abc]</code>
              <span>Any of a, b, or c</span>
            </div>
            <div className="ref-item">
              <code>(x|y)</code>
              <span>x or y</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegexLibrary
