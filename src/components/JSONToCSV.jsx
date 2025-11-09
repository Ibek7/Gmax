import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JSONToCSV.css'

function JSONToCSV() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('json-to-csv') // 'json-to-csv' or 'csv-to-json'
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const convertJSONToCSV = () => {
    try {
      setError('')
      const data = JSON.parse(input)
      
      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of objects')
      }

      if (data.length === 0) {
        setOutput('')
        setPreview(null)
        return
      }

      // Extract all unique keys from all objects
      const allKeys = [...new Set(data.flatMap(obj => Object.keys(obj)))]
      
      // Create CSV header
      const header = allKeys.join(',')
      
      // Create CSV rows
      const rows = data.map(obj => {
        return allKeys.map(key => {
          const value = obj[key]
          if (value === null || value === undefined) return ''
          
          // Handle nested objects/arrays
          let stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
          
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            stringValue = '"' + stringValue.replace(/"/g, '""') + '"'
          }
          
          return stringValue
        }).join(',')
      })

      const csv = [header, ...rows].join('\n')
      setOutput(csv)
      
      // Create preview (first 5 rows)
      setPreview({
        headers: allKeys,
        rows: data.slice(0, 5).map(obj => allKeys.map(key => obj[key]))
      })
      
    } catch (err) {
      setError(`Error: ${err.message}`)
      setOutput('')
      setPreview(null)
    }
  }

  const convertCSVToJSON = () => {
    try {
      setError('')
      const lines = input.trim().split('\n')
      
      if (lines.length === 0) {
        setOutput('[]')
        setPreview(null)
        return
      }

      // Parse header
      const headers = parseCSVLine(lines[0])
      
      // Parse rows
      const data = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = parseCSVLine(lines[i])
        const obj = {}
        
        headers.forEach((header, index) => {
          let value = values[index] || ''
          
          // Try to parse as JSON for nested structures
          if (value.startsWith('{') || value.startsWith('[')) {
            try {
              value = JSON.parse(value)
            } catch {
              // Keep as string if not valid JSON
            }
          }
          // Try to parse as number
          else if (!isNaN(value) && value !== '') {
            value = Number(value)
          }
          // Try to parse as boolean
          else if (value === 'true') value = true
          else if (value === 'false') value = false
          // null/undefined
          else if (value === 'null') value = null
          else if (value === 'undefined') value = undefined
          
          obj[header] = value
        })
        
        data.push(obj)
      }

      const json = JSON.stringify(data, null, 2)
      setOutput(json)
      
      // Create preview (first 5 rows)
      setPreview({
        headers,
        rows: data.slice(0, 5).map(obj => headers.map(key => obj[key]))
      })
      
    } catch (err) {
      setError(`Error: ${err.message}`)
      setOutput('')
      setPreview(null)
    }
  }

  const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const next = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && next === '"') {
          // Escaped quote
          current += '"'
          i++
        } else {
          // Toggle quotes
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  const handleConvert = () => {
    if (mode === 'json-to-csv') {
      convertJSONToCSV()
    } else {
      convertCSVToJSON()
    }
  }

  const copyOutput = () => {
    if (!output) {
      alert('No output to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Output copied to clipboard!')
  }

  const downloadOutput = () => {
    if (!output) {
      alert('No output to download')
      return
    }
    
    const extension = mode === 'json-to-csv' ? 'csv' : 'json'
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    if (mode === 'json-to-csv') {
      const sample = JSON.stringify([
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, active: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, active: true },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, active: false }
      ], null, 2)
      setInput(sample)
    } else {
      const sample = `id,name,email,age,active
1,John Doe,john@example.com,30,true
2,Jane Smith,jane@example.com,25,true
3,Bob Johnson,bob@example.com,35,false`
      setInput(sample)
    }
    setError('')
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setPreview(null)
  }

  const switchMode = () => {
    setMode(mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv')
    setInput('')
    setOutput('')
    setError('')
    setPreview(null)
  }

  return (
    <div className="json-to-csv">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="converter-container">
        <h1>JSON ⇄ CSV Converter</h1>
        <p className="subtitle">Convert between JSON and CSV formats seamlessly</p>

        <div className="mode-switcher">
          <button 
            className={`mode-btn ${mode === 'json-to-csv' ? 'active' : ''}`}
            onClick={switchMode}
          >
            JSON → CSV
          </button>
          <button 
            className={`mode-btn ${mode === 'csv-to-json' ? 'active' : ''}`}
            onClick={switchMode}
          >
            CSV → JSON
          </button>
        </div>

        <div className="action-buttons">
          <button onClick={handleConvert} className="convert-btn">
            🔄 Convert
          </button>
          <button onClick={loadSample} className="sample-btn">
            📄 Load Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear All
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {preview && (
          <div className="preview-section">
            <h3>Preview (First 5 Rows)</h3>
            <div className="preview-table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    {preview.headers.map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>
                          {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="editor-section">
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Input {mode === 'json-to-csv' ? '(JSON)' : '(CSV)'}</h3>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'json-to-csv' 
                ? 'Paste your JSON array here...\n[\n  { "id": 1, "name": "Example" }\n]' 
                : 'Paste your CSV here...\nid,name\n1,Example'}
              rows={15}
            />
          </div>

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Output {mode === 'json-to-csv' ? '(CSV)' : '(JSON)'}</h3>
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
              placeholder="Converted data will appear here..."
              rows={15}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JSONToCSV
