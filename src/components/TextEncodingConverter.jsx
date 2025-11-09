import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TextEncodingConverter.css'

function TextEncodingConverter() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [encodings, setEncodings] = useState(null)

  const convertEncodings = (text) => {
    if (!text) {
      setEncodings(null)
      return
    }

    try {
      const results = {
        utf8: text,
        base64: btoa(unescape(encodeURIComponent(text))),
        hex: Array.from(new TextEncoder().encode(text))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(''),
        binary: Array.from(new TextEncoder().encode(text))
          .map(b => b.toString(2).padStart(8, '0'))
          .join(' '),
        decimal: Array.from(new TextEncoder().encode(text))
          .map(b => b.toString())
          .join(' '),
        octal: Array.from(new TextEncoder().encode(text))
          .map(b => b.toString(8).padStart(3, '0'))
          .join(' '),
        urlEncoded: encodeURIComponent(text),
        htmlEntities: text.replace(/[&<>"']/g, char => {
          const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          }
          return entities[char] || char
        })
      }
      
      setEncodings(results)
    } catch (error) {
      alert('Error encoding text: ' + error.message)
    }
  }

  const decodeFrom = (encoding, value) => {
    try {
      let decoded = ''
      
      switch (encoding) {
        case 'base64':
          decoded = decodeURIComponent(escape(atob(value)))
          break
        case 'hex':
          const hexBytes = value.match(/.{1,2}/g) || []
          decoded = new TextDecoder().decode(
            new Uint8Array(hexBytes.map(byte => parseInt(byte, 16)))
          )
          break
        case 'binary':
          const binaryBytes = value.split(' ').filter(b => b)
          decoded = new TextDecoder().decode(
            new Uint8Array(binaryBytes.map(byte => parseInt(byte, 2)))
          )
          break
        case 'decimal':
          const decimalBytes = value.split(' ').filter(b => b)
          decoded = new TextDecoder().decode(
            new Uint8Array(decimalBytes.map(byte => parseInt(byte, 10)))
          )
          break
        case 'octal':
          const octalBytes = value.split(' ').filter(b => b)
          decoded = new TextDecoder().decode(
            new Uint8Array(octalBytes.map(byte => parseInt(byte, 8)))
          )
          break
        case 'urlEncoded':
          decoded = decodeURIComponent(value)
          break
        case 'htmlEntities':
          const textarea = document.createElement('textarea')
          textarea.innerHTML = value
          decoded = textarea.value
          break
        default:
          decoded = value
      }
      
      setInput(decoded)
      convertEncodings(decoded)
    } catch (error) {
      alert(`Error decoding from ${encoding}: ` + error.message)
    }
  }

  const handleInputChange = (e) => {
    const text = e.target.value
    setInput(text)
    convertEncodings(text)
  }

  const copyEncoding = (value) => {
    navigator.clipboard.writeText(value)
    alert('Encoding copied to clipboard!')
  }

  const loadSample = () => {
    const sample = 'Hello, World! 👋'
    setInput(sample)
    convertEncodings(sample)
  }

  const clearAll = () => {
    setInput('')
    setEncodings(null)
  }

  return (
    <div className="text-encoding-converter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="converter-container">
        <h1>Text Encoding Converter</h1>
        <p className="subtitle">Convert text between different encoding formats</p>

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
            placeholder="Enter text to convert to various encodings..."
            rows={6}
          />
        </div>

        {encodings && (
          <div className="encodings-section">
            <h3>Encoded Formats</h3>
            
            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>UTF-8 (Plain Text)</h4>
                  <span className="encoding-info">Standard text encoding</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.utf8)} className="copy-btn">
                    📋 Copy
                  </button>
                </div>
              </div>
              <div className="encoding-value">{encodings.utf8}</div>
            </div>

            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>Base64</h4>
                  <span className="encoding-info">Binary-to-text encoding</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.base64)} className="copy-btn">
                    📋 Copy
                  </button>
                  <button onClick={() => decodeFrom('base64', encodings.base64)} className="decode-btn">
                    🔓 Decode
                  </button>
                </div>
              </div>
              <div className="encoding-value">{encodings.base64}</div>
            </div>

            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>Hexadecimal</h4>
                  <span className="encoding-info">Base-16 representation</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.hex)} className="copy-btn">
                    📋 Copy
                  </button>
                  <button onClick={() => decodeFrom('hex', encodings.hex)} className="decode-btn">
                    🔓 Decode
                  </button>
                </div>
              </div>
              <div className="encoding-value">{encodings.hex}</div>
            </div>

            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>Binary</h4>
                  <span className="encoding-info">Base-2 representation</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.binary)} className="copy-btn">
                    📋 Copy
                  </button>
                  <button onClick={() => decodeFrom('binary', encodings.binary)} className="decode-btn">
                    🔓 Decode
                  </button>
                </div>
              </div>
              <div className="encoding-value small-text">{encodings.binary}</div>
            </div>

            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>Decimal (ASCII)</h4>
                  <span className="encoding-info">Base-10 byte values</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.decimal)} className="copy-btn">
                    📋 Copy
                  </button>
                  <button onClick={() => decodeFrom('decimal', encodings.decimal)} className="decode-btn">
                    🔓 Decode
                  </button>
                </div>
              </div>
              <div className="encoding-value">{encodings.decimal}</div>
            </div>

            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>Octal</h4>
                  <span className="encoding-info">Base-8 representation</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.octal)} className="copy-btn">
                    📋 Copy
                  </button>
                  <button onClick={() => decodeFrom('octal', encodings.octal)} className="decode-btn">
                    🔓 Decode
                  </button>
                </div>
              </div>
              <div className="encoding-value">{encodings.octal}</div>
            </div>

            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>URL Encoded</h4>
                  <span className="encoding-info">Percent encoding for URLs</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.urlEncoded)} className="copy-btn">
                    📋 Copy
                  </button>
                  <button onClick={() => decodeFrom('urlEncoded', encodings.urlEncoded)} className="decode-btn">
                    🔓 Decode
                  </button>
                </div>
              </div>
              <div className="encoding-value">{encodings.urlEncoded}</div>
            </div>

            <div className="encoding-card">
              <div className="encoding-header">
                <div>
                  <h4>HTML Entities</h4>
                  <span className="encoding-info">HTML special characters</span>
                </div>
                <div className="encoding-actions">
                  <button onClick={() => copyEncoding(encodings.htmlEntities)} className="copy-btn">
                    📋 Copy
                  </button>
                  <button onClick={() => decodeFrom('htmlEntities', encodings.htmlEntities)} className="decode-btn">
                    🔓 Decode
                  </button>
                </div>
              </div>
              <div className="encoding-value">{encodings.htmlEntities}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextEncodingConverter
