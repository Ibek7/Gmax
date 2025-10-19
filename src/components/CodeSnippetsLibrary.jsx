import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CodeSnippetsLibrary.css'

const CodeSnippetsLibrary = () => {
  const navigate = useNavigate()
  const [snippets, setSnippets] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newSnippet, setNewSnippet] = useState({
    title: '',
    code: '',
    language: 'javascript',
    tags: []
  })

  const languages = ['javascript', 'python', 'java', 'css', 'html', 'react', 'typescript']

  useEffect(() => {
    loadSnippets()
  }, [])

  const loadSnippets = () => {
    const saved = localStorage.getItem('gmax_code_snippets')
    if (saved) {
      setSnippets(JSON.parse(saved))
    } else {
      const mock = [
        {
          id: 1,
          title: 'Array Map Function',
          code: 'const doubled = arr.map(x => x * 2)',
          language: 'javascript',
          tags: ['array', 'functional'],
          date: new Date().toISOString()
        }
      ]
      setSnippets(mock)
      localStorage.setItem('gmax_code_snippets', JSON.stringify(mock))
    }
  }

  const saveSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) return
    const snippet = { ...newSnippet, id: Date.now(), date: new Date().toISOString() }
    const updated = [snippet, ...snippets]
    setSnippets(updated)
    localStorage.setItem('gmax_code_snippets', JSON.stringify(updated))
    setShowModal(false)
    setNewSnippet({ title: '', code: '', language: 'javascript', tags: [] })
  }

  const deleteSnippet = (id) => {
    const updated = snippets.filter(s => s.id !== id)
    setSnippets(updated)
    localStorage.setItem('gmax_code_snippets', JSON.stringify(updated))
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    alert('Copied to clipboard!')
  }

  const filteredSnippets = snippets.filter(s => {
    const matchesLang = filter === 'all' || s.language === filter
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.code.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesLang && matchesSearch
  })

  return (
    <div className="code-snippets-container">
      <div className="snippets-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💻 Code Snippets Library</h1>
        <button onClick={() => setShowModal(true)}>+ Add Snippet</button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="language-filter">
          <option value="all">All Languages</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="snippets-grid">
        {filteredSnippets.map(snippet => (
          <div key={snippet.id} className="snippet-card">
            <div className="snippet-header">
              <h3>{snippet.title}</h3>
              <span className="language-badge">{snippet.language}</span>
            </div>
            <pre className="snippet-code">{snippet.code}</pre>
            <div className="snippet-actions">
              <button onClick={() => copyToClipboard(snippet.code)}>📋 Copy</button>
              <button onClick={() => deleteSnippet(snippet.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Code Snippet</h2>
            <input
              type="text"
              placeholder="Snippet title"
              value={newSnippet.title}
              onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
            />
            <select
              value={newSnippet.language}
              onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <textarea
              placeholder="Paste your code here..."
              value={newSnippet.code}
              onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={saveSnippet}>Save Snippet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeSnippetsLibrary
