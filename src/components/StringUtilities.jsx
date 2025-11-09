import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/StringUtilities.css'

function StringUtilities() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState(null)

  const calculateStats = (text) => {
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text.split('\n').length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length

    setStats({ chars, charsNoSpaces, words, lines, sentences, paragraphs })
  }

  const reverseString = () => {
    const reversed = input.split('').reverse().join('')
    setOutput(reversed)
    calculateStats(input)
  }

  const sortLines = (ascending = true) => {
    const lines = input.split('\n')
    const sorted = ascending 
      ? lines.sort((a, b) => a.localeCompare(b))
      : lines.sort((a, b) => b.localeCompare(a))
    setOutput(sorted.join('\n'))
    calculateStats(input)
  }

  const removeDuplicates = () => {
    const lines = input.split('\n')
    const unique = [...new Set(lines)]
    setOutput(unique.join('\n'))
    calculateStats(input)
  }

  const removeEmptyLines = () => {
    const lines = input.split('\n').filter(line => line.trim())
    setOutput(lines.join('\n'))
    calculateStats(input)
  }

  const toUpperCase = () => {
    setOutput(input.toUpperCase())
    calculateStats(input)
  }

  const toLowerCase = () => {
    setOutput(input.toLowerCase())
    calculateStats(input)
  }

  const capitalizeWords = () => {
    const capitalized = input.replace(/\b\w/g, char => char.toUpperCase())
    setOutput(capitalized)
    calculateStats(input)
  }

  const trimSpaces = () => {
    const trimmed = input.split('\n').map(line => line.trim()).join('\n')
    setOutput(trimmed)
    calculateStats(input)
  }

  const shuffleLines = () => {
    const lines = input.split('\n')
    const shuffled = lines.sort(() => Math.random() - 0.5)
    setOutput(shuffled.join('\n'))
    calculateStats(input)
  }

  const extractEmails = () => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = input.match(emailRegex) || []
    setOutput(emails.join('\n'))
    calculateStats(input)
  }

  const extractURLs = () => {
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = input.match(urlRegex) || []
    setOutput(urls.join('\n'))
    calculateStats(input)
  }

  const copyOutput = () => {
    if (!output) {
      alert('No output to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Text copied to clipboard!')
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setStats(null)
  }

  return (
    <div className="string-utilities">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="utilities-container">
        <h1>String Utilities</h1>
        <p className="subtitle">Powerful text manipulation and analysis tools</p>

        <div className="tools-section">
          <h3>Text Transformations</h3>
          <div className="tools-grid">
            <button onClick={reverseString} className="tool-btn">
              🔄 Reverse
            </button>
            <button onClick={() => sortLines(true)} className="tool-btn">
              ⬆️ Sort A-Z
            </button>
            <button onClick={() => sortLines(false)} className="tool-btn">
              ⬇️ Sort Z-A
            </button>
            <button onClick={removeDuplicates} className="tool-btn">
              🗑️ Remove Duplicates
            </button>
            <button onClick={removeEmptyLines} className="tool-btn">
              📝 Remove Empty Lines
            </button>
            <button onClick={toUpperCase} className="tool-btn">
              🔠 UPPERCASE
            </button>
            <button onClick={toLowerCase} className="tool-btn">
              🔡 lowercase
            </button>
            <button onClick={capitalizeWords} className="tool-btn">
              🅰️ Capitalize Words
            </button>
            <button onClick={trimSpaces} className="tool-btn">
              ✂️ Trim Spaces
            </button>
            <button onClick={shuffleLines} className="tool-btn">
              🎲 Shuffle Lines
            </button>
            <button onClick={extractEmails} className="tool-btn">
              📧 Extract Emails
            </button>
            <button onClick={extractURLs} className="tool-btn">
              🔗 Extract URLs
            </button>
          </div>
        </div>

        {stats && (
          <div className="stats-card">
            <h3>Text Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.chars}</span>
                <span className="stat-label">Characters</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.charsNoSpaces}</span>
                <span className="stat-label">Without Spaces</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.words}</span>
                <span className="stat-label">Words</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.lines}</span>
                <span className="stat-label">Lines</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.sentences}</span>
                <span className="stat-label">Sentences</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.paragraphs}</span>
                <span className="stat-label">Paragraphs</span>
              </div>
            </div>
          </div>
        )}

        <div className="editor-section">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Input Text</h3>
              <button onClick={clearAll} className="clear-btn-small">
                🗑️ Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter or paste your text here..."
              rows={15}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Output Text</h3>
              <button onClick={copyOutput} className="copy-btn" disabled={!output}>
                📋 Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Transformed text will appear here..."
              rows={15}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StringUtilities
