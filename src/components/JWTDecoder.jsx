import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/JWTDecoder.css'

function JWTDecoder() {
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState(null)
  const [error, setError] = useState('')

  // Base64 URL decode
  const base64UrlDecode = (str) => {
    // Replace URL-safe characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    // Pad with '=' to make length multiple of 4
    while (base64.length % 4 !== 0) {
      base64 += '='
    }
    try {
      const decoded = atob(base64)
      return JSON.parse(decoded)
    } catch (e) {
      throw new Error('Invalid Base64 encoding')
    }
  }

  const decodeToken = () => {
    setError('')
    setDecoded(null)

    if (!token.trim()) {
      setError('Please enter a JWT token')
      return
    }

    try {
      const parts = token.trim().split('.')
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.')
      }

      const [headerB64, payloadB64, signature] = parts

      const header = base64UrlDecode(headerB64)
      const payload = base64UrlDecode(payloadB64)

      setDecoded({
        header,
        payload,
        signature,
        raw: {
          header: headerB64,
          payload: payloadB64,
          signature
        }
      })
    } catch (err) {
      setError(err.message || 'Failed to decode JWT token')
    }
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  const isExpired = (exp) => {
    if (!exp) return false
    return Date.now() >= exp * 1000
  }

  const sampleTokens = [
    {
      name: 'Basic JWT',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    },
    {
      name: 'With Expiration',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkphbmUgU21pdGgiLCJlbWFpbCI6ImphbmVAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjMyNTQyMn0.M9yl8vY_V4Eb2BqPLLfz5ZCCpLb9qb6lhPqvLg0hNMg'
    }
  ]

  const loadSample = (sampleToken) => {
    setToken(sampleToken)
  }

  return (
    <div className="jwt-decoder">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="jwt-container">
        <h1>JWT Decoder</h1>
        <p className="subtitle">Decode and inspect JSON Web Tokens</p>

        <div className="input-section">
          <label>JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            rows={6}
          />
          
          <div className="sample-tokens">
            <label>Sample Tokens</label>
            <div className="samples-grid">
              {sampleTokens.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => loadSample(sample.token)}
                  className="sample-btn"
                >
                  📄 {sample.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={decodeToken} className="decode-btn">
            🔓 Decode JWT
          </button>
        </div>

        {error && (
          <div className="error-message">
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {decoded && (
          <div className="decoded-section">
            <div className="token-part header-part">
              <div className="part-header">
                <h3>📋 Header</h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), 'Header')}
                  className="copy-btn"
                >
                  📋 Copy
                </button>
              </div>
              <div className="json-display">
                <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
              </div>
              <div className="raw-value">
                <label>Raw (Base64):</label>
                <code>{decoded.raw.header}</code>
              </div>
            </div>

            <div className="token-part payload-part">
              <div className="part-header">
                <h3>📦 Payload</h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'Payload')}
                  className="copy-btn"
                >
                  📋 Copy
                </button>
              </div>
              <div className="json-display">
                <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
              </div>
              <div className="raw-value">
                <label>Raw (Base64):</label>
                <code>{decoded.raw.payload}</code>
              </div>
              
              {(decoded.payload.iat || decoded.payload.exp || decoded.payload.nbf) && (
                <div className="time-claims">
                  <h4>⏰ Time Claims</h4>
                  {decoded.payload.iat && (
                    <div className="claim-item">
                      <strong>Issued At (iat):</strong>
                      <span>{formatTimestamp(decoded.payload.iat)}</span>
                    </div>
                  )}
                  {decoded.payload.exp && (
                    <div className="claim-item">
                      <strong>Expires At (exp):</strong>
                      <span className={isExpired(decoded.payload.exp) ? 'expired' : 'valid'}>
                        {formatTimestamp(decoded.payload.exp)}
                        {isExpired(decoded.payload.exp) ? ' ⚠️ EXPIRED' : ' ✓ Valid'}
                      </span>
                    </div>
                  )}
                  {decoded.payload.nbf && (
                    <div className="claim-item">
                      <strong>Not Before (nbf):</strong>
                      <span>{formatTimestamp(decoded.payload.nbf)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="token-part signature-part">
              <div className="part-header">
                <h3>🔐 Signature</h3>
                <button
                  onClick={() => copyToClipboard(decoded.signature, 'Signature')}
                  className="copy-btn"
                >
                  📋 Copy
                </button>
              </div>
              <div className="signature-display">
                <code>{decoded.signature}</code>
              </div>
              <div className="signature-note">
                <strong>⚠️ Note:</strong> This tool only decodes the JWT. Signature verification requires the secret key and is not performed client-side.
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>About JWT Tokens</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>🔑 What is JWT?</h4>
              <p>JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It's commonly used for authentication and authorization.</p>
            </div>
            <div className="info-item">
              <h4>📝 JWT Structure</h4>
              <p>JWTs consist of three parts separated by dots: Header (algorithm & token type), Payload (claims/data), and Signature (verification).</p>
            </div>
            <div className="info-item">
              <h4>🔒 Security Note</h4>
              <p>Never share your JWT tokens publicly. They often contain sensitive information and can be used to impersonate users. This tool works entirely in your browser.</p>
            </div>
            <div className="info-item">
              <h4>⏱️ Common Claims</h4>
              <p><strong>iss:</strong> Issuer, <strong>sub:</strong> Subject, <strong>aud:</strong> Audience, <strong>exp:</strong> Expiration, <strong>iat:</strong> Issued At, <strong>nbf:</strong> Not Before</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JWTDecoder
