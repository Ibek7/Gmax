import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MarkdownPreviewer.css'

function MarkdownPreviewer() {
  const navigate = useNavigate()
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Previewer

## Features
- **Bold** and *italic* text
- [Links](https://example.com)
- \`Inline code\` and code blocks
- > Blockquotes
- Lists and tables

### Code Block Example
\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### Table Example
| Feature | Status |
|---------|--------|
| Headers | ✅ |
| Lists   | ✅ |
| Links   | ✅ |

### Task List
- [x] Completed task
- [ ] Pending task
`)
  const [viewMode, setViewMode] = useState('split')

  // Simple markdown parser
  const parseMarkdown = (md) => {
    let html = md

    // Code blocks (must be before inline code)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`
    })

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />')

    // Task lists
    html = html.replace(/^- \[x\] (.+)$/gm, '<label class="task-item"><input type="checkbox" checked disabled /> $1</label>')
    html = html.replace(/^- \[ \] (.+)$/gm, '<label class="task-item"><input type="checkbox" disabled /> $1</label>')

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

    // Tables
    html = html.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim()).map(c => c.trim())
      return '<tr>' + cells.map(cell => {
        if (cell.match(/^-+$/)) return ''
        return `<td>${cell}</td>`
      }).join('') + '</tr>'
    })
    html = html.replace(/(<tr>.*<\/tr>\s*)+/g, match => {
      const rows = match.match(/<tr>.*?<\/tr>/g)
      if (!rows) return match
      const headerRow = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')
      const bodyRows = rows.slice(2).join('')
      return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`
    })

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>')
    html = html.replace(/\n/g, '<br />')

    return '<p>' + html + '</p>'
  }

  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown)
    alert('Markdown copied to clipboard!')
  }

  const copyHTML = () => {
    const html = parseMarkdown(markdown)
    navigator.clipboard.writeText(html)
    alert('HTML copied to clipboard!')
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'document.md'
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 2rem; line-height: 1.6; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    th { background: #f4f4f4; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  ${parseMarkdown(markdown)}
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'document.html'
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    if (window.confirm('Clear all markdown content?')) {
      setMarkdown('')
    }
  }

  const samples = [
    {
      name: 'Documentation',
      content: `# Project Documentation

## Installation
\`\`\`bash
npm install my-package
\`\`\`

## Usage
Import the package:
\`\`\`javascript
import { myFunction } from 'my-package';
\`\`\`

## Features
- Easy to use
- Lightweight
- Well documented`
    },
    {
      name: 'README',
      content: `# My Awesome Project

A brief description of your project.

## Getting Started
1. Clone the repository
2. Run \`npm install\`
3. Start with \`npm start\`

## License
MIT License`
    }
  ]

  const loadSample = (content) => {
    setMarkdown(content)
  }

  return (
    <div className="markdown-previewer">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="markdown-container">
        <div className="markdown-header">
          <h1>Markdown Previewer</h1>
          <div className="view-controls">
            <button
              onClick={() => setViewMode('editor')}
              className={viewMode === 'editor' ? 'active' : ''}
            >
              📝 Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={viewMode === 'split' ? 'active' : ''}
            >
              ⚡ Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={viewMode === 'preview' ? 'active' : ''}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        <div className="action-bar">
          <div className="samples-section">
            {samples.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => loadSample(sample.content)}
                className="sample-btn"
              >
                📄 {sample.name}
              </button>
            ))}
          </div>
          <div className="action-buttons">
            <button onClick={copyMarkdown} className="action-btn">📋 Copy MD</button>
            <button onClick={copyHTML} className="action-btn">📋 Copy HTML</button>
            <button onClick={downloadMarkdown} className="action-btn">💾 .md</button>
            <button onClick={downloadHTML} className="action-btn">💾 .html</button>
            <button onClick={clearAll} className="action-btn clear-btn">🗑️ Clear</button>
          </div>
        </div>

        <div className={`markdown-workspace ${viewMode}`}>
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className="editor-pane">
              <h3>Markdown Input</h3>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Enter your markdown here..."
              />
            </div>
          )}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="preview-pane">
              <h3>HTML Preview</h3>
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
              />
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>Markdown Syntax Guide</h3>
          <div className="syntax-grid">
            <div className="syntax-item">
              <strong># Header</strong>
              <code># H1, ## H2, ### H3</code>
            </div>
            <div className="syntax-item">
              <strong>**Bold**</strong>
              <code>**bold text**</code>
            </div>
            <div className="syntax-item">
              <strong>*Italic*</strong>
              <code>*italic text*</code>
            </div>
            <div className="syntax-item">
              <strong>[Link](url)</strong>
              <code>[text](https://url)</code>
            </div>
            <div className="syntax-item">
              <strong>![Image](url)</strong>
              <code>![alt](image.jpg)</code>
            </div>
            <div className="syntax-item">
              <strong>`Code`</strong>
              <code>`inline code`</code>
            </div>
            <div className="syntax-item">
              <strong>- List</strong>
              <code>- Item 1<br/>- Item 2</code>
            </div>
            <div className="syntax-item">
              <strong>&gt; Quote</strong>
              <code>&gt; blockquote</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarkdownPreviewer
