import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/PasswordGenerator.css'

const PasswordGenerator = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [strength, setStrength] = useState(0)
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('gmax_password_history')
    if (saved) setHistory(JSON.parse(saved))
    generatePassword()
  }, [])

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let chars = ''
    if (includeUppercase) chars += uppercase
    if (includeLowercase) chars += lowercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    if (chars === '') {
      setPassword('')
      setStrength(0)
      return
    }

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setPassword(newPassword)
    calculateStrength(newPassword)
    setCopied(false)
  }

  const calculateStrength = (pass) => {
    let score = 0
    
    // Length contribution
    if (pass.length >= 8) score += 20
    if (pass.length >= 12) score += 20
    if (pass.length >= 16) score += 20
    
    // Character variety
    if (/[a-z]/.test(pass)) score += 10
    if (/[A-Z]/.test(pass)) score += 10
    if (/[0-9]/.test(pass)) score += 10
    if (/[^a-zA-Z0-9]/.test(pass)) score += 10
    
    setStrength(score)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    saveToHistory(password)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveToHistory = (pass) => {
    const newEntry = {
      password: pass,
      timestamp: new Date().toISOString(),
      length: pass.length
    }
    const updated = [newEntry, ...history.slice(0, 9)]
    setHistory(updated)
    localStorage.setItem('gmax_password_history', JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('gmax_password_history')
  }

  const getStrengthLabel = () => {
    if (strength < 30) return { text: 'Weak', color: '#ff5252' }
    if (strength < 60) return { text: 'Fair', color: '#ff9800' }
    if (strength < 80) return { text: 'Good', color: '#ffc107' }
    return { text: 'Strong', color: '#4caf50' }
  }

  const strengthInfo = getStrengthLabel()

  return (
    <div className="password-gen-container">
      <div className="password-gen-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔐 Password Generator</h1>
      </div>

      <div className="generator-card">
        <div className="password-display">
          <input
            type="text"
            value={password}
            readOnly
            className="password-output"
            placeholder="Generate a password..."
          />
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={copyToClipboard}
            disabled={!password}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        <div className="strength-meter">
          <div className="strength-bar-bg">
            <div
              className="strength-bar-fill"
              style={{
                width: `${strength}%`,
                background: strengthInfo.color
              }}
            ></div>
          </div>
          <span className="strength-label" style={{ color: strengthInfo.color }}>
            {strengthInfo.text}
          </span>
        </div>

        <div className="options-section">
          <div className="length-control">
            <label>Password Length: {length}</label>
            <input
              type="range"
              min="4"
              max="32"
              value={length}
              onChange={e => setLength(parseInt(e.target.value))}
              className="length-slider"
            />
            <div className="length-labels">
              <span>4</span>
              <span>32</span>
            </div>
          </div>

          <div className="checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={e => setIncludeUppercase(e.target.checked)}
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={e => setIncludeLowercase(e.target.checked)}
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={e => setIncludeNumbers(e.target.checked)}
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={e => setIncludeSymbols(e.target.checked)}
              />
              <span>Symbols (!@#$%)</span>
            </label>
          </div>
        </div>

        <button className="generate-btn" onClick={generatePassword}>
          🔄 Generate New Password
        </button>
      </div>

      {history.length > 0 && (
        <div className="history-section">
          <div className="history-header">
            <h2>📜 Password History</h2>
            <button className="clear-history-btn" onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <div className="history-list">
            {history.map((entry, idx) => (
              <div key={idx} className="history-item">
                <code className="history-password">{entry.password}</code>
                <div className="history-meta">
                  <span className="history-length">{entry.length} chars</span>
                  <span className="history-time">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tips-section">
        <h3>💡 Password Security Tips</h3>
        <ul>
          <li>Use at least 12 characters for better security</li>
          <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
          <li>Never reuse passwords across different accounts</li>
          <li>Consider using a password manager</li>
          <li>Change passwords regularly for sensitive accounts</li>
        </ul>
      </div>
    </div>
  )
}

export default PasswordGenerator
