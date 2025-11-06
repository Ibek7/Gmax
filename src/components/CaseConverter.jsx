import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CaseConverter.css'

function CaseConverter() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')

  const toCamelCase = (str) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (chr) => chr.toLowerCase())
  }

  const toPascalCase = (str) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }

  const toSnakeCase = (str) => {
    return str
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()
  }

  const toKebabCase = (str) => {
    return str
      .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
  }

  const toConstantCase = (str) => {
    return toSnakeCase(str).toUpperCase()
  }

  const toDotCase = (str) => {
    return str
      .replace(/[A-Z]/g, (letter) => `.${letter.toLowerCase()}`)
      .replace(/[^a-zA-Z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .toLowerCase()
  }

  const toPathCase = (str) => {
    return str
      .replace(/[A-Z]/g, (letter) => `/${letter.toLowerCase()}`)
      .replace(/[^a-zA-Z0-9]+/g, '/')
      .replace(/^\/+|\/+$/g, '')
      .toLowerCase()
  }

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => ' ' + chr.toUpperCase())
      .replace(/^[a-z]/, (chr) => chr.toUpperCase())
      .trim()
  }

  const toSentenceCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }

  const toUpperCase = (str) => {
    return str.toUpperCase()
  }

  const toLowerCase = (str) => {
    return str.toLowerCase()
  }

  const toAlternatingCase = (str) => {
    return str
      .split('')
      .map((char, idx) => idx % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
      .join('')
  }

  const toInverseCase = (str) => {
    return str
      .split('')
      .map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase())
      .join('')
  }

  const conversions = [
    { name: 'camelCase', fn: toCamelCase, example: 'myVariableName', icon: '🐪' },
    { name: 'PascalCase', fn: toPascalCase, example: 'MyClassName', icon: '🅿️' },
    { name: 'snake_case', fn: toSnakeCase, example: 'my_variable_name', icon: '🐍' },
    { name: 'kebab-case', fn: toKebabCase, example: 'my-variable-name', icon: '�串' },
    { name: 'CONSTANT_CASE', fn: toConstantCase, example: 'MY_CONSTANT_NAME', icon: '🔠' },
    { name: 'dot.case', fn: toDotCase, example: 'my.variable.name', icon: '⚫' },
    { name: 'path/case', fn: toPathCase, example: 'my/path/name', icon: '📁' },
    { name: 'Title Case', fn: toTitleCase, example: 'My Variable Name', icon: '📰' },
    { name: 'Sentence case', fn: toSentenceCase, example: 'My variable name', icon: '📝' },
    { name: 'UPPERCASE', fn: toUpperCase, example: 'MY VARIABLE NAME', icon: '🔼' },
    { name: 'lowercase', fn: toLowerCase, example: 'my variable name', icon: '🔽' },
    { name: 'aLtErNaTiNg', fn: toAlternatingCase, example: 'mY vArIaBlE nAmE', icon: '🔀' },
    { name: 'iNVERSE', fn: toInverseCase, example: 'mY vARIABLE nAME', icon: '🔃' }
  ]

  const copyToClipboard = (text, name) => {
    navigator.clipboard.writeText(text)
    alert(`${name} copied to clipboard!`)
  }

  const copyAll = () => {
    const allConversions = conversions
      .map(({ name, fn }) => `${name}: ${fn(inputText)}`)
      .join('\n')
    navigator.clipboard.writeText(allConversions)
    alert('All conversions copied to clipboard!')
  }

  const clearAll = () => {
    setInputText('')
  }

  const samples = [
    'Hello World Example',
    'myVariableName',
    'UserAccountSettings',
    'data-attribute-name',
    'API_ENDPOINT_URL'
  ]

  return (
    <div className="case-converter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="case-container">
        <h1>Case Converter</h1>
        <p className="subtitle">Transform text between different naming conventions</p>

        <div className="input-section">
          <label>Input Text</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to convert (e.g., 'hello world', 'myVariable', 'user_name')..."
            rows={4}
          />

          <div className="samples-section">
            <label>Quick Samples</label>
            <div className="samples-grid">
              {samples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(sample)}
                  className="sample-btn"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="input-actions">
            <button onClick={copyAll} className="action-btn" disabled={!inputText.trim()}>
              📋 Copy All Conversions
            </button>
            <button onClick={clearAll} className="action-btn clear-btn">
              🗑️ Clear
            </button>
          </div>
        </div>

        {inputText.trim() && (
          <div className="conversions-section">
            <h3>Converted Results</h3>
            <div className="conversions-grid">
              {conversions.map(({ name, fn, example, icon }) => {
                const result = fn(inputText)
                return (
                  <div key={name} className="conversion-card">
                    <div className="conversion-header">
                      <div className="conversion-title">
                        <span className="conversion-icon">{icon}</span>
                        <strong>{name}</strong>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result, name)}
                        className="copy-btn"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <div className="conversion-result">
                      <code>{result}</code>
                    </div>
                    <div className="conversion-example">
                      Example: <code>{example}</code>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Naming Convention Guide</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>🐪 camelCase</h4>
              <p>First word lowercase, subsequent words capitalized. Common in JavaScript, Java variables.</p>
            </div>
            <div className="info-item">
              <h4>🅿️ PascalCase</h4>
              <p>All words capitalized, no separators. Used for class names in most languages.</p>
            </div>
            <div className="info-item">
              <h4>🐍 snake_case</h4>
              <p>Lowercase words separated by underscores. Popular in Python, Ruby, database names.</p>
            </div>
            <div className="info-item">
              <h4>🍒 kebab-case</h4>
              <p>Lowercase words separated by hyphens. Used in URLs, CSS classes, file names.</p>
            </div>
            <div className="info-item">
              <h4>🔠 CONSTANT_CASE</h4>
              <p>Uppercase snake_case. Standard for constants and environment variables.</p>
            </div>
            <div className="info-item">
              <h4>⚫ dot.case</h4>
              <p>Words separated by dots. Used in package names, DNS, configuration keys.</p>
            </div>
            <div className="info-item">
              <h4>📁 path/case</h4>
              <p>Words separated by slashes. Used for file paths and URL routes.</p>
            </div>
            <div className="info-item">
              <h4>📰 Title Case</h4>
              <p>Each word capitalized with spaces. Used for headings, titles, and proper names.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseConverter
