import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/SlugGenerator.css'

function SlugGenerator() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [slugs, setSlugs] = useState({})

  const generateSlugs = (text) => {
    if (!text) {
      setSlugs({})
      return
    }

    const baseSlug = text
      .toLowerCase()
      .normalize('NFD') // Normalize unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()

    const kebabCase = baseSlug.replace(/\s+/g, '-')
    const snakeCase = baseSlug.replace(/\s+/g, '_')
    const camelCase = baseSlug
      .split(/\s+/)
      .map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('')
    const pascalCase = baseSlug
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
    const dotCase = baseSlug.replace(/\s+/g, '.')
    const pathCase = baseSlug.replace(/\s+/g, '/')
    const constCase = baseSlug.replace(/\s+/g, '_').toUpperCase()
    const trainCase = baseSlug
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-')

    setSlugs({
      'kebab-case': kebabCase,
      'snake_case': snakeCase,
      'camelCase': camelCase,
      'PascalCase': pascalCase,
      'dot.case': dotCase,
      'path/case': pathCase,
      'CONST_CASE': constCase,
      'Train-Case': trainCase
    })
  }

  const handleInputChange = (e) => {
    const text = e.target.value
    setInput(text)
    generateSlugs(text)
  }

  const copySlug = (slug) => {
    navigator.clipboard.writeText(slug)
    alert('Slug copied to clipboard!')
  }

  const clearAll = () => {
    setInput('')
    setSlugs({})
  }

  const loadSample = () => {
    const sample = 'Hello World! This is a Sample Title 123'
    setInput(sample)
    generateSlugs(sample)
  }

  return (
    <div className="slug-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>Slug Generator</h1>
        <p className="subtitle">Convert titles and text into URL-friendly slugs</p>

        <div className="action-buttons">
          <button onClick={loadSample} className="sample-btn">
            📄 Load Sample
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear
          </button>
        </div>

        <div className="input-section">
          <h3>Input Text</h3>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your title or text here...&#10;Example: Hello World! This is a Sample Title"
            rows={5}
          />
        </div>

        {Object.keys(slugs).length > 0 && (
          <div className="slugs-section">
            <h3>Generated Slugs</h3>
            <div className="slugs-grid">
              {Object.entries(slugs).map(([format, slug]) => (
                <div key={format} className="slug-card">
                  <div className="slug-header">
                    <span className="slug-format">{format}</span>
                    <button 
                      onClick={() => copySlug(slug)}
                      className="copy-btn-small"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                  <div className="slug-value">
                    {slug || '(empty)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Supported Formats</h3>
          <div className="formats-grid">
            <div className="format-item">
              <strong>kebab-case</strong>
              <span>Lowercase with hyphens (URLs, CSS)</span>
            </div>
            <div className="format-item">
              <strong>snake_case</strong>
              <span>Lowercase with underscores (Python, databases)</span>
            </div>
            <div className="format-item">
              <strong>camelCase</strong>
              <span>First word lowercase (JavaScript variables)</span>
            </div>
            <div className="format-item">
              <strong>PascalCase</strong>
              <span>All words capitalized (Classes, components)</span>
            </div>
            <div className="format-item">
              <strong>dot.case</strong>
              <span>Lowercase with dots (Configuration keys)</span>
            </div>
            <div className="format-item">
              <strong>path/case</strong>
              <span>Lowercase with slashes (File paths)</span>
            </div>
            <div className="format-item">
              <strong>CONST_CASE</strong>
              <span>Uppercase with underscores (Constants)</span>
            </div>
            <div className="format-item">
              <strong>Train-Case</strong>
              <span>Capitalized words with hyphens (HTTP headers)</span>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3>Features</h3>
          <ul>
            <li>✅ Automatic character transliteration (é → e, ñ → n)</li>
            <li>✅ Special character removal</li>
            <li>✅ Multiple case formats</li>
            <li>✅ Real-time slug generation</li>
            <li>✅ One-click copy to clipboard</li>
            <li>✅ SEO-friendly URL slugs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SlugGenerator
