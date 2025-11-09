import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/NumberBaseConverter.css'

function NumberBaseConverter() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [inputBase, setInputBase] = useState(10)
  const [results, setResults] = useState(null)

  const convertNumber = () => {
    try {
      // Remove any spaces or underscores for readability
      const cleanInput = input.replace(/[\s_]/g, '')
      
      if (!cleanInput) {
        setResults(null)
        return
      }

      // Convert input to decimal first
      let decimal
      if (inputBase === 2) {
        if (!/^[01]+$/.test(cleanInput)) {
          throw new Error('Invalid binary number')
        }
        decimal = parseInt(cleanInput, 2)
      } else if (inputBase === 8) {
        if (!/^[0-7]+$/.test(cleanInput)) {
          throw new Error('Invalid octal number')
        }
        decimal = parseInt(cleanInput, 8)
      } else if (inputBase === 10) {
        if (!/^-?\d+$/.test(cleanInput)) {
          throw new Error('Invalid decimal number')
        }
        decimal = parseInt(cleanInput, 10)
      } else if (inputBase === 16) {
        if (!/^[0-9a-fA-F]+$/.test(cleanInput)) {
          throw new Error('Invalid hexadecimal number')
        }
        decimal = parseInt(cleanInput, 16)
      }

      if (isNaN(decimal)) {
        throw new Error('Invalid number')
      }

      // Convert to all bases
      setResults({
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        decimal: decimal.toString(10),
        hexadecimal: decimal.toString(16).toUpperCase(),
        binaryGrouped: groupBinary(decimal.toString(2)),
        hexLowercase: decimal.toString(16).toLowerCase()
      })
    } catch (err) {
      alert(`Error: ${err.message}`)
      setResults(null)
    }
  }

  const groupBinary = (binary) => {
    // Group binary digits in sets of 4 for readability
    return binary.split('').reverse().reduce((acc, digit, index) => {
      if (index > 0 && index % 4 === 0) {
        acc = ' ' + acc
      }
      return digit + acc
    }, '')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const clearAll = () => {
    setInput('')
    setResults(null)
  }

  const loadSample = () => {
    const samples = {
      2: '11010101',
      8: '755',
      10: '255',
      16: 'FF'
    }
    setInput(samples[inputBase])
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleBaseChange = (e) => {
    setInputBase(Number(e.target.value))
    setInput('')
    setResults(null)
  }

  return (
    <div className="number-base-converter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="converter-container">
        <h1>Number Base Converter</h1>
        <p className="subtitle">Convert between binary, octal, decimal, and hexadecimal</p>

        <div className="controls">
          <div className="control-group">
            <label>Input Base:</label>
            <select value={inputBase} onChange={handleBaseChange}>
              <option value={2}>Binary (Base 2)</option>
              <option value={8}>Octal (Base 8)</option>
              <option value={10}>Decimal (Base 10)</option>
              <option value={16}>Hexadecimal (Base 16)</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={loadSample} className="sample-btn">
            📄 Load Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear
          </button>
        </div>

        <div className="input-section">
          <h3>Input Number ({inputBase === 2 ? 'Binary' : inputBase === 8 ? 'Octal' : inputBase === 10 ? 'Decimal' : 'Hexadecimal'})</h3>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyUp={convertNumber}
            placeholder={
              inputBase === 2 ? 'Enter binary number (e.g., 11010101)' :
              inputBase === 8 ? 'Enter octal number (e.g., 755)' :
              inputBase === 10 ? 'Enter decimal number (e.g., 255)' :
              'Enter hexadecimal number (e.g., FF)'
            }
          />
        </div>

        {results && (
          <div className="results-section">
            <h3>Converted Values</h3>
            <div className="results-grid">
              <div className="result-card binary">
                <div className="result-header">
                  <div>
                    <span className="result-label">Binary (Base 2)</span>
                    <span className="result-prefix">0b</span>
                  </div>
                  <button onClick={() => copyToClipboard(results.binary)} className="copy-btn">
                    📋
                  </button>
                </div>
                <div className="result-value">{results.binary}</div>
                <div className="result-grouped">{results.binaryGrouped}</div>
              </div>

              <div className="result-card octal">
                <div className="result-header">
                  <div>
                    <span className="result-label">Octal (Base 8)</span>
                    <span className="result-prefix">0o</span>
                  </div>
                  <button onClick={() => copyToClipboard(results.octal)} className="copy-btn">
                    📋
                  </button>
                </div>
                <div className="result-value">{results.octal}</div>
              </div>

              <div className="result-card decimal">
                <div className="result-header">
                  <div>
                    <span className="result-label">Decimal (Base 10)</span>
                  </div>
                  <button onClick={() => copyToClipboard(results.decimal)} className="copy-btn">
                    📋
                  </button>
                </div>
                <div className="result-value">{results.decimal}</div>
              </div>

              <div className="result-card hex">
                <div className="result-header">
                  <div>
                    <span className="result-label">Hexadecimal (Base 16)</span>
                    <span className="result-prefix">0x</span>
                  </div>
                  <button onClick={() => copyToClipboard(results.hexadecimal)} className="copy-btn">
                    📋
                  </button>
                </div>
                <div className="result-value">{results.hexadecimal}</div>
                <div className="result-lowercase">Lowercase: {results.hexLowercase}</div>
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Number Base Reference</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>Binary (Base 2)</h4>
              <p>Uses digits: 0, 1</p>
              <p>Common in: Computer science, digital electronics</p>
              <p>Example: 1101 = 13₁₀</p>
            </div>
            <div className="info-card">
              <h4>Octal (Base 8)</h4>
              <p>Uses digits: 0-7</p>
              <p>Common in: File permissions (Unix/Linux)</p>
              <p>Example: 755 = 493₁₀</p>
            </div>
            <div className="info-card">
              <h4>Decimal (Base 10)</h4>
              <p>Uses digits: 0-9</p>
              <p>Common in: Everyday counting, mathematics</p>
              <p>Example: 255 = FF₁₆</p>
            </div>
            <div className="info-card">
              <h4>Hexadecimal (Base 16)</h4>
              <p>Uses digits: 0-9, A-F</p>
              <p>Common in: Colors, memory addresses, programming</p>
              <p>Example: FF = 255₁₀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberBaseConverter
