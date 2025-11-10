import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MarkdownTableGenerator.css'

function MarkdownTableGenerator() {
  const navigate = useNavigate()
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [alignment, setAlignment] = useState('left')
  const [tableData, setTableData] = useState([])
  const [markdown, setMarkdown] = useState('')

  const initializeTable = () => {
    const newData = Array(rows).fill(null).map(() => Array(cols).fill(''))
    setTableData(newData)
  }

  const updateCell = (rowIndex, colIndex, value) => {
    const newData = [...tableData]
    newData[rowIndex][colIndex] = value
    setTableData(newData)
  }

  const generateMarkdown = () => {
    if (tableData.length === 0) {
      alert('Please initialize table first!')
      return
    }

    let md = ''
    
    // Header row
    md += '| ' + tableData[0].map(cell => cell || 'Header').join(' | ') + ' |\n'
    
    // Alignment row
    const alignSymbol = {
      left: ':---',
      center: ':---:',
      right: '---:'
    }
    md += '| ' + Array(cols).fill(alignSymbol[alignment]).join(' | ') + ' |\n'
    
    // Data rows
    for (let i = 1; i < tableData.length; i++) {
      md += '| ' + tableData[i].map(cell => cell || 'Data').join(' | ') + ' |\n'
    }

    setMarkdown(md)
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown)
    alert('Markdown table copied to clipboard!')
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'table.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setRows(4)
    setCols(3)
    const sample = [
      ['Name', 'Age', 'City'],
      ['John Doe', '25', 'New York'],
      ['Jane Smith', '30', 'Los Angeles'],
      ['Bob Johnson', '35', 'Chicago']
    ]
    setTableData(sample)
  }

  return (
    <div className="markdown-table-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>Markdown Table Generator</h1>
        <p className="subtitle">Create formatted markdown tables with custom dimensions and alignment</p>

        <div className="controls-section">
          <div className="size-controls">
            <div className="control-group">
              <label>Rows: {rows}</label>
              <input
                type="range"
                min="2"
                max="20"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Columns: {cols}</label>
              <input
                type="range"
                min="2"
                max="10"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Alignment</label>
              <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="action-buttons">
            <button className="init-btn" onClick={initializeTable}>
              Initialize Table
            </button>
            <button className="sample-btn" onClick={loadSample}>
              Load Sample
            </button>
            <button className="generate-btn" onClick={generateMarkdown}>
              Generate Markdown
            </button>
          </div>
        </div>

        {tableData.length > 0 && (
          <div className="table-editor-section">
            <h3>Edit Table</h3>
            <div className="table-wrapper">
              <table className="editable-table">
                <thead>
                  <tr>
                    {tableData[0].map((_, colIndex) => (
                      <th key={colIndex}>
                        <input
                          type="text"
                          value={tableData[0][colIndex]}
                          onChange={(e) => updateCell(0, colIndex, e.target.value)}
                          placeholder={`Header ${colIndex + 1}`}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex + 1}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex}>
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateCell(rowIndex + 1, colIndex, e.target.value)}
                            placeholder="Data"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {markdown && (
          <div className="markdown-output-section">
            <div className="output-header">
              <h3>Generated Markdown</h3>
              <div className="output-actions">
                <button className="copy-btn" onClick={copyMarkdown}>
                  📋 Copy
                </button>
                <button className="download-btn" onClick={downloadMarkdown}>
                  💾 Download
                </button>
              </div>
            </div>
            <pre className="markdown-code">{markdown}</pre>

            <h3>Preview</h3>
            <div className="preview-table" dangerouslySetInnerHTML={{
              __html: markdownTableToHTML(markdown)
            }} />
          </div>
        )}

        <div className="info-section">
          <h3>Tips</h3>
          <ul>
            <li>First row will be treated as the table header</li>
            <li>Choose alignment before generating (left, center, or right)</li>
            <li>Empty cells will be filled with placeholder text</li>
            <li>Use pipe character | to separate columns in markdown</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Helper function to convert markdown table to HTML for preview
function markdownTableToHTML(markdown) {
  const lines = markdown.trim().split('\n')
  if (lines.length < 3) return ''

  const headers = lines[0].split('|').map(h => h.trim()).filter(h => h)
  const alignments = lines[1].split('|').map(a => a.trim()).filter(a => a)
  const rows = lines.slice(2).map(line => 
    line.split('|').map(cell => cell.trim()).filter(cell => cell)
  )

  let html = '<table><thead><tr>'
  headers.forEach((header, i) => {
    const align = alignments[i]?.includes(':---:') ? 'center' : 
                  alignments[i]?.endsWith(':') ? 'right' : 'left'
    html += `<th style="text-align: ${align}">${header}</th>`
  })
  html += '</tr></thead><tbody>'
  
  rows.forEach(row => {
    html += '<tr>'
    row.forEach((cell, i) => {
      const align = alignments[i]?.includes(':---:') ? 'center' : 
                    alignments[i]?.endsWith(':') ? 'right' : 'left'
      html += `<td style="text-align: ${align}">${cell}</td>`
    })
    html += '</tr>'
  })
  html += '</tbody></table>'
  
  return html
}

export default MarkdownTableGenerator
