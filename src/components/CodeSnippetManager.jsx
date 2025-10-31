import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CodeSnippetManager.css'

const CodeSnippetManager = () => {
  const navigate = useNavigate()
  const [snippets, setSnippets] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [tags, setTags] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  const languages = ['javascript', 'python', 'java', 'html', 'css', 'typescript', 'react', 'sql', 'bash', 'other']

  useEffect(() => {
    const saved = localStorage.getItem('gmax_code_snippets')
    if (saved) setSnippets(JSON.parse(saved))
  }, [])

  const addSnippet = (e) => {
    e.preventDefault()
    if (title.trim() && code.trim()) {
      const snippet = {
        id: Date.now(),
        title,
        code,
        language,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        createdAt: new Date().toISOString(),
        favorite: false
      }
      const updated = [snippet, ...snippets]
      setSnippets(updated)
      localStorage.setItem('gmax_code_snippets', JSON.stringify(updated))
      
      setTitle('')
      setCode('')
      setLanguage('javascript')
      setTags('')
      setShowAddForm(false)
    }
  }

  const deleteSnippet = (id) => {
    const updated = snippets.filter(s => s.id !== id)
    setSnippets(updated)
    localStorage.setItem('gmax_code_snippets', JSON.stringify(updated))
  }

  const toggleFavorite = (id) => {
    const updated = snippets.map(s =>
      s.id === id ? { ...s, favorite: !s.favorite } : s
    )
    setSnippets(updated)
    localStorage.setItem('gmax_code_snippets', JSON.stringify(updated))
  }

  const copyToClipboard = (id, code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      html: '🌐',
      css: '🎨',
      typescript: '🔷',
      react: '⚛️',
      sql: '🗄️',
      bash: '💻',
      other: '📝'
    }
    return icons[lang] || '📝'
  }

  const filteredSnippets = snippets
    .filter(s => filterLanguage === 'all' || s.language === filterLanguage)
    .filter(s => 
      searchTerm === '' ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  return (
    <div className="snippet-manager-container">
      <div className="snippet-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💾 Code Snippet Manager</h1>
        <button className="add-snippet-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+ Add Snippet'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-snippet-form">
          <h2>Add New Snippet</h2>
          <form onSubmit={addSnippet}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Snippet title..."
              required
            />
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {getLanguageIcon(lang)} {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows="10"
              required
            />
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Tags (comma-separated)..."
            />
            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">Add Snippet</button>
            </div>
          </form>
        </div>
      )}

      <div className="snippet-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Search snippets..."
          className="search-input"
        />
        <div className="language-filters">
          <button
            className={`filter-btn ${filterLanguage === 'all' ? 'active' : ''}`}
            onClick={() => setFilterLanguage('all')}
          >
            All
          </button>
          {languages.map(lang => {
            const count = snippets.filter(s => s.language === lang).length
            if (count === 0) return null
            return (
              <button
                key={lang}
                className={`filter-btn ${filterLanguage === lang ? 'active' : ''}`}
                onClick={() => setFilterLanguage(lang)}
              >
                {getLanguageIcon(lang)} {lang} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className="snippets-grid">
        {filteredSnippets.map(snippet => (
          <div key={snippet.id} className="snippet-card">
            <div className="snippet-card-header">
              <div className="snippet-title-row">
                <span className="language-badge">
                  {getLanguageIcon(snippet.language)} {snippet.language}
                </span>
                <h3>{snippet.title}</h3>
              </div>
              <div className="snippet-actions">
                <button
                  className={`favorite-icon ${snippet.favorite ? 'active' : ''}`}
                  onClick={() => toggleFavorite(snippet.id)}
                >
                  {snippet.favorite ? '⭐' : '☆'}
                </button>
                <button
                  className="copy-icon"
                  onClick={() => copyToClipboard(snippet.id, snippet.code)}
                >
                  {copiedId === snippet.id ? '✓' : '📋'}
                </button>
                <button
                  className="delete-icon"
                  onClick={() => deleteSnippet(snippet.id)}
                >
                  🗑️
                </button>
              </div>
            </div>

            <pre className="snippet-code">
              <code>{snippet.code}</code>
            </pre>

            {snippet.tags.length > 0 && (
              <div className="snippet-tags">
                {snippet.tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
            )}

            <div className="snippet-footer">
              <span className="snippet-date">
                {new Date(snippet.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredSnippets.length === 0 && (
        <div className="empty-snippets">
          <p>No snippets found</p>
          {searchTerm && <p>Try a different search term</p>}
        </div>
      )}
    </div>
  )
}

export default CodeSnippetManager
