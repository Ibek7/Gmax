import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MarkdownEditor.css'

const MarkdownEditor = () => {
  const navigate = useNavigate()
  const [markdown, setMarkdown] = useState('')
  const [documents, setDocuments] = useState([])
  const [currentDoc, setCurrentDoc] = useState(null)
  const [docName, setDocName] = useState('')
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('gmax_markdown_docs')
    if (saved) {
      const docs = JSON.parse(saved)
      setDocuments(docs)
      if (docs.length > 0) {
        loadDocument(docs[0])
      }
    }
  }, [])

  const parseMarkdown = (text) => {
    let html = text
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    
    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    
    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>')
    html = html.replace(/\n/g, '<br/>')
    
    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr/>')
    
    return html
  }

  const saveDocument = () => {
    if (!docName.trim()) {
      alert('Please enter a document name')
      return
    }

    const doc = {
      id: currentDoc?.id || Date.now(),
      name: docName,
      content: markdown,
      updatedAt: new Date().toISOString()
    }

    let updated
    if (currentDoc) {
      updated = documents.map(d => d.id === doc.id ? doc : d)
    } else {
      updated = [doc, ...documents]
    }

    setDocuments(updated)
    setCurrentDoc(doc)
    localStorage.setItem('gmax_markdown_docs', JSON.stringify(updated))
  }

  const loadDocument = (doc) => {
    setCurrentDoc(doc)
    setDocName(doc.name)
    setMarkdown(doc.content)
  }

  const newDocument = () => {
    setCurrentDoc(null)
    setDocName('Untitled Document')
    setMarkdown('# New Document\n\nStart writing your markdown here...')
  }

  const deleteDocument = (id) => {
    const updated = documents.filter(d => d.id !== id)
    setDocuments(updated)
    localStorage.setItem('gmax_markdown_docs', JSON.stringify(updated))
    
    if (currentDoc?.id === id) {
      if (updated.length > 0) {
        loadDocument(updated[0])
      } else {
        newDocument()
      }
    }
  }

  const exportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${docName || 'document'}.md`
    a.click()
  }

  const exportHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${docName}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  ${parseMarkdown(markdown)}
</body>
</html>`
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${docName || 'document'}.html`
    a.click()
  }

  return (
    <div className="markdown-editor-container">
      <div className="markdown-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📝 Markdown Editor</h1>
        <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? '◀' : '▶'} Docs
        </button>
      </div>

      <div className="editor-layout">
        {showSidebar && (
          <div className="docs-sidebar">
            <button className="new-doc-btn" onClick={newDocument}>
              + New Document
            </button>
            <div className="docs-list">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className={`doc-item ${currentDoc?.id === doc.id ? 'active' : ''}`}
                >
                  <div onClick={() => loadDocument(doc)} className="doc-info">
                    <span className="doc-name">{doc.name}</span>
                    <span className="doc-date">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="delete-doc-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDocument(doc.id)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="editor-main">
          <div className="editor-controls">
            <input
              type="text"
              value={docName}
              onChange={e => setDocName(e.target.value)}
              placeholder="Document name..."
              className="doc-name-input"
            />
            <div className="control-buttons">
              <button onClick={saveDocument} className="save-btn">💾 Save</button>
              <button onClick={exportMarkdown} className="export-btn">⬇ .md</button>
              <button onClick={exportHTML} className="export-btn">⬇ .html</button>
            </div>
          </div>

          <div className="editor-panels">
            <div className="editor-panel">
              <h3>📝 Editor</h3>
              <textarea
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                placeholder="Write your markdown here..."
                className="markdown-input"
              />
            </div>

            <div className="preview-panel">
              <h3>👁️ Preview</h3>
              <div
                className="markdown-preview"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarkdownEditor
