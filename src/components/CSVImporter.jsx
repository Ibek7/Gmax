import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CSVImporter.css'

export default function CSVImporter() {
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState([])
  const [errors, setErrors] = useState([])

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (lines.length === 0) return []
    const headers = lines[0].split(',').map(h => h.trim())
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(',').map(c => c.trim())
      const obj = {}
      headers.forEach((h, i) => obj[h] = cols[i] || '')
      return obj
    })
    return { headers, rows }
  }

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFileName(f.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target.result)
        if (!parsed.rows) throw new Error('Invalid CSV')
        setPreview(parsed)
        setErrors([])
      } catch (err) {
        setErrors([err.message])
      }
    }
    reader.readAsText(f)
  }

  const importToExpense = () => {
    if (!preview.rows) return
    // Expect headers: description,amount,paidBy,splitAmong
    const mapped = preview.rows.map(r => ({
      description: r.description || r.Description || '',
      amount: parseFloat(r.amount || r.Amount || '0') || 0,
      paidBy: r.paidBy || r.PaidBy || '',
      splitAmong: (r.splitAmong || r.SplitAmong || '').split(';').map(s => s.trim()).filter(Boolean)
    }))

    // Save to localStorage key used by ExpenseSplitter
    try {
      const groups = JSON.parse(localStorage.getItem('gmax_expense_groups') || '[]')
      const importGroup = { id: Date.now(), name: `Imported - ${fileName}`, expenses: mapped, members: Array.from(new Set(mapped.flatMap(m => [m.paidBy, ...m.splitAmong]).filter(Boolean))) }
      localStorage.setItem('gmax_expense_groups', JSON.stringify([importGroup, ...groups]))
      alert('Imported ' + mapped.length + ' expenses into Expense Splitter')
    } catch (e) {
      alert('Import failed: ' + e.message)
    }
  }

  return (
    <div className="csv-importer-container">
      <div className="csv-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📥 CSV Importer</h1>
      </div>

      <div className="csv-card">
        <p>Upload a CSV exported from spreadsheets. Expected columns (case-insensitive): <strong>description, amount, paidBy, splitAmong</strong>. Use semicolon to separate multiple names in splitAmong.</p>
        <input type="file" accept=".csv,text/csv" onChange={handleFile} />

        {errors.length > 0 && (
          <div className="csv-errors">
            {errors.map((err, i) => <div key={i} className="csv-error">{err}</div>)}
          </div>
        )}

        {preview.headers && (
          <div className="csv-preview">
            <h3>Preview ({preview.rows.length} rows)</h3>
            <table>
              <thead>
                <tr>{preview.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 6).map((r, idx) => (
                  <tr key={idx}>{preview.headers.map((h, i) => <td key={i}>{r[h]}</td>)}</tr>
                ))}
              </tbody>
            </table>

            <div className="csv-actions">
              <button onClick={importToExpense} className="btn import">Import to Expense Splitter</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
