import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/APIKeyGenerator.css'

function APIKeyGenerator() {
  const navigate = useNavigate()
  const [keyType, setKeyType] = useState('apikey')
  const [length, setLength] = useState(32)
  const [includePrefix, setIncludePrefix] = useState(true)
  const [customPrefix, setCustomPrefix] = useState('sk')
  const [generatedKeys, setGeneratedKeys] = useState([])

  const generateRandomString = (len, chars) => {
    let result = ''
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateAPIKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let key = ''
    
    if (includePrefix && customPrefix) {
      key = `${customPrefix}_${generateRandomString(length, chars)}`
    } else {
      key = generateRandomString(length, chars)
    }
    
    return key
  }

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const generateJWT = () => {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }
    
    const payload = {
      sub: generateUUID(),
      name: 'API User',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (3600 * 24) // 24 hours
    }
    
    const base64Header = btoa(JSON.stringify(header))
    const base64Payload = btoa(JSON.stringify(payload))
    const signature = generateRandomString(43, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
    
    return `${base64Header}.${base64Payload}.${signature}`
  }

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return generateRandomString(64, chars)
  }

  const generateHexKey = () => {
    const chars = '0123456789abcdef'
    return generateRandomString(length, chars)
  }

  const generateBase64Key = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    return generateRandomString(length, chars)
  }

  const generateOAuth = () => {
    const clientId = generateRandomString(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
    const clientSecret = generateRandomString(64, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
    return {
      client_id: clientId,
      client_secret: clientSecret
    }
  }

  const generateKey = () => {
    let key = ''
    let metadata = {}
    
    switch (keyType) {
      case 'apikey':
        key = generateAPIKey()
        break
      case 'uuid':
        key = generateUUID()
        break
      case 'jwt':
        key = generateJWT()
        break
      case 'token':
        key = generateToken()
        break
      case 'hex':
        key = generateHexKey()
        break
      case 'base64':
        key = generateBase64Key()
        break
      case 'oauth':
        const oauth = generateOAuth()
        key = JSON.stringify(oauth, null, 2)
        metadata = oauth
        break
      default:
        key = generateAPIKey()
    }

    const newKey = {
      key,
      type: keyType,
      length: key.length,
      timestamp: new Date().toISOString(),
      metadata
    }

    setGeneratedKeys([newKey, ...generatedKeys.slice(0, 9)])
  }

  const copyKey = (key) => {
    navigator.clipboard.writeText(key)
    alert('Key copied to clipboard!')
  }

  const clearHistory = () => {
    setGeneratedKeys([])
  }

  return (
    <div className="api-key-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>API Key Generator</h1>
        <p className="subtitle">Generate secure API keys, tokens, and credentials for your applications</p>

        <div className="controls-section">
          <div className="type-selection">
            <h3>Key Type</h3>
            <div className="type-buttons">
              <button
                className={`type-btn ${keyType === 'apikey' ? 'active' : ''}`}
                onClick={() => setKeyType('apikey')}
              >
                API Key
              </button>
              <button
                className={`type-btn ${keyType === 'uuid' ? 'active' : ''}`}
                onClick={() => setKeyType('uuid')}
              >
                UUID
              </button>
              <button
                className={`type-btn ${keyType === 'jwt' ? 'active' : ''}`}
                onClick={() => setKeyType('jwt')}
              >
                JWT Token
              </button>
              <button
                className={`type-btn ${keyType === 'token' ? 'active' : ''}`}
                onClick={() => setKeyType('token')}
              >
                Bearer Token
              </button>
              <button
                className={`type-btn ${keyType === 'hex' ? 'active' : ''}`}
                onClick={() => setKeyType('hex')}
              >
                Hex Key
              </button>
              <button
                className={`type-btn ${keyType === 'base64' ? 'active' : ''}`}
                onClick={() => setKeyType('base64')}
              >
                Base64 Key
              </button>
              <button
                className={`type-btn ${keyType === 'oauth' ? 'active' : ''}`}
                onClick={() => setKeyType('oauth')}
              >
                OAuth Credentials
              </button>
            </div>
          </div>

          {(keyType === 'apikey' || keyType === 'hex' || keyType === 'base64') && (
            <div className="options-section">
              <div className="option-group">
                <label>Key Length: {length}</label>
                <input
                  type="range"
                  min="16"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                />
              </div>

              {keyType === 'apikey' && (
                <div className="option-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={includePrefix}
                      onChange={(e) => setIncludePrefix(e.target.checked)}
                    />
                    Include Prefix
                  </label>
                  
                  {includePrefix && (
                    <input
                      type="text"
                      value={customPrefix}
                      onChange={(e) => setCustomPrefix(e.target.value)}
                      placeholder="Enter prefix (e.g., sk, pk, api)"
                      className="prefix-input"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          <button className="generate-btn" onClick={generateKey}>
            Generate {keyType === 'oauth' ? 'Credentials' : 'Key'}
          </button>
        </div>

        {generatedKeys.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h3>Generated Keys ({generatedKeys.length})</h3>
              <button className="clear-btn" onClick={clearHistory}>
                Clear History
              </button>
            </div>

            <div className="keys-list">
              {generatedKeys.map((item, index) => (
                <div key={index} className="key-item">
                  <div className="key-header">
                    <span className="key-type-badge">{item.type.toUpperCase()}</span>
                    <span className="key-timestamp">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  
                  <div className="key-content">
                    <pre>{item.key}</pre>
                  </div>
                  
                  <div className="key-footer">
                    <span className="key-length">Length: {item.length} characters</span>
                    <button className="copy-key-btn" onClick={() => copyKey(item.key)}>
                      📋 Copy Key
                    </button>
                  </div>

                  {item.type === 'oauth' && (
                    <div className="oauth-details">
                      <div className="oauth-field">
                        <strong>Client ID:</strong>
                        <code>{item.metadata.client_id}</code>
                        <button onClick={() => copyKey(item.metadata.client_id)}>📋</button>
                      </div>
                      <div className="oauth-field">
                        <strong>Client Secret:</strong>
                        <code>{item.metadata.client_secret}</code>
                        <button onClick={() => copyKey(item.metadata.client_secret)}>📋</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>⚠️ Security Notice</h3>
          <p>
            These keys are generated client-side for development and testing purposes only. 
            For production applications, always use cryptographically secure random generation 
            on your server and implement proper key rotation and storage practices.
          </p>
        </div>
      </div>
    </div>
  )
}

export default APIKeyGenerator
