import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/HashGenerator.css'

function HashGenerator() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  })
  const [selectedAlgo, setSelectedAlgo] = useState('sha256')
  const [history, setHistory] = useState([])
  const [copiedHash, setCopiedHash] = useState('')

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gmax_hash_history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  // Save history to localStorage
  const saveToHistory = (input, hash, algorithm) => {
    const newEntry = {
      id: Date.now(),
      input: input.length > 50 ? input.substring(0, 50) + '...' : input,
      hash,
      algorithm,
      timestamp: new Date().toISOString()
    }
    const newHistory = [newEntry, ...history].slice(0, 10) // Keep last 10
    setHistory(newHistory)
    localStorage.setItem('gmax_hash_history', JSON.stringify(newHistory))
  }

  // Generate hashes using Web Crypto API
  const generateHash = async (algorithm, text) => {
    if (!text) return ''
    
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      const hashBuffer = await crypto.subtle.digest(algorithm, data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      return hashHex
    } catch (error) {
      console.error('Error generating hash:', error)
      return ''
    }
  }

  // MD5 implementation (not available in Web Crypto API)
  const md5 = (string) => {
    if (!string) return ''
    
    function rotateLeft(value, shift) {
      return (value << shift) | (value >>> (32 - shift))
    }

    function addUnsigned(x, y) {
      const lsw = (x & 0xFFFF) + (y & 0xFFFF)
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
      return (msw << 16) | (lsw & 0xFFFF)
    }

    function md5_F(x, y, z) { return (x & y) | ((~x) & z) }
    function md5_G(x, y, z) { return (x & z) | (y & (~z)) }
    function md5_H(x, y, z) { return x ^ y ^ z }
    function md5_I(x, y, z) { return y ^ (x | (~z)) }

    function md5_FF(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(md5_F(b, c, d), x), ac))
      return addUnsigned(rotateLeft(a, s), b)
    }

    function md5_GG(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(md5_G(b, c, d), x), ac))
      return addUnsigned(rotateLeft(a, s), b)
    }

    function md5_HH(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(md5_H(b, c, d), x), ac))
      return addUnsigned(rotateLeft(a, s), b)
    }

    function md5_II(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(md5_I(b, c, d), x), ac))
      return addUnsigned(rotateLeft(a, s), b)
    }

    function convertToWordArray(string) {
      let wordArray = []
      for (let i = 0; i < string.length * 8; i += 8) {
        wordArray[i >> 5] |= (string.charCodeAt(i / 8) & 0xFF) << (i % 32)
      }
      return wordArray
    }

    function wordToHex(value) {
      let hex = '', byte
      for (let i = 0; i < 4; i++) {
        byte = (value >>> (i * 8)) & 0xFF
        hex += ('0' + byte.toString(16)).slice(-2)
      }
      return hex
    }

    function utf8Encode(string) {
      string = string.replace(/\r\n/g, '\n')
      let utftext = ''
      for (let n = 0; n < string.length; n++) {
        const c = string.charCodeAt(n)
        if (c < 128) {
          utftext += String.fromCharCode(c)
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192)
          utftext += String.fromCharCode((c & 63) | 128)
        } else {
          utftext += String.fromCharCode((c >> 12) | 224)
          utftext += String.fromCharCode(((c >> 6) & 63) | 128)
          utftext += String.fromCharCode((c & 63) | 128)
        }
      }
      return utftext
    }

    let x = [], k, AA, BB, CC, DD, a, b, c, d
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21

    string = utf8Encode(string)
    x = convertToWordArray(string)
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476

    const xl = x.length
    for (k = 0; k < xl; k += 16) {
      AA = a; BB = b; CC = c; DD = d
      a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
      d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
      c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
      b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
      a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
      d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
      c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
      b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
      a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
      d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
      c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
      b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
      a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
      d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
      c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
      b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
      a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
      d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
      c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
      b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
      a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
      d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453)
      c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
      b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
      a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
      d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
      c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
      b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
      a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
      d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
      c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
      b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
      a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
      d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
      c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
      b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
      a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
      d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
      c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
      b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
      a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
      d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
      c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
      b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
      a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
      d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
      c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
      b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
      a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244)
      d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
      c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
      b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
      a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
      d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
      c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
      b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
      a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
      d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
      c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314)
      b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
      a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
      d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
      c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
      b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
      a = addUnsigned(a, AA)
      b = addUnsigned(b, BB)
      c = addUnsigned(c, CC)
      d = addUnsigned(d, DD)
    }

    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase()
  }

  // Generate all hashes
  useEffect(() => {
    const generateAllHashes = async () => {
      if (!input) {
        setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
        return
      }

      const [sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
        generateHash('SHA-1', input),
        generateHash('SHA-256', input),
        generateHash('SHA-512', input)
      ])

      const md5Hash = md5(input)

      setHashes({
        md5: md5Hash,
        sha1: sha1Hash,
        sha256: sha256Hash,
        sha512: sha512Hash
      })
    }

    generateAllHashes()
  }, [input])

  const handleCopy = (hash, algorithm) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(algorithm)
    saveToHistory(input, hash, algorithm)
    setTimeout(() => setCopiedHash(''), 2000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInput(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('gmax_hash_history')
  }

  return (
    <div className="hash-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="hash-container">
        <h1>Hash Generator</h1>
        <p className="subtitle">Generate cryptographic hashes using various algorithms</p>

        <div className="input-section">
          <label>Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            rows={6}
          />
          
          <div className="file-upload">
            <label htmlFor="file-input" className="file-label">
              📁 Or upload a text file
            </label>
            <input
              id="file-input"
              type="file"
              accept=".txt,.json,.xml,.csv"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <div className="algorithm-selector">
          <button
            className={selectedAlgo === 'md5' ? 'active' : ''}
            onClick={() => setSelectedAlgo('md5')}
          >
            MD5
          </button>
          <button
            className={selectedAlgo === 'sha1' ? 'active' : ''}
            onClick={() => setSelectedAlgo('sha1')}
          >
            SHA-1
          </button>
          <button
            className={selectedAlgo === 'sha256' ? 'active' : ''}
            onClick={() => setSelectedAlgo('sha256')}
          >
            SHA-256
          </button>
          <button
            className={selectedAlgo === 'sha512' ? 'active' : ''}
            onClick={() => setSelectedAlgo('sha512')}
          >
            SHA-512
          </button>
        </div>

        <div className="hash-outputs">
          <div className={`hash-output ${selectedAlgo === 'md5' ? 'selected' : ''}`}>
            <div className="hash-header">
              <h3>MD5 <span className="hash-length">128-bit</span></h3>
              <button
                onClick={() => handleCopy(hashes.md5, 'md5')}
                disabled={!hashes.md5}
                className={copiedHash === 'md5' ? 'copied' : ''}
              >
                {copiedHash === 'md5' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="hash-value">{hashes.md5 || 'Enter text to generate hash'}</div>
          </div>

          <div className={`hash-output ${selectedAlgo === 'sha1' ? 'selected' : ''}`}>
            <div className="hash-header">
              <h3>SHA-1 <span className="hash-length">160-bit</span></h3>
              <button
                onClick={() => handleCopy(hashes.sha1, 'sha1')}
                disabled={!hashes.sha1}
                className={copiedHash === 'sha1' ? 'copied' : ''}
              >
                {copiedHash === 'sha1' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="hash-value">{hashes.sha1 || 'Enter text to generate hash'}</div>
          </div>

          <div className={`hash-output ${selectedAlgo === 'sha256' ? 'selected' : ''}`}>
            <div className="hash-header">
              <h3>SHA-256 <span className="hash-length">256-bit</span></h3>
              <button
                onClick={() => handleCopy(hashes.sha256, 'sha256')}
                disabled={!hashes.sha256}
                className={copiedHash === 'sha256' ? 'copied' : ''}
              >
                {copiedHash === 'sha256' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="hash-value">{hashes.sha256 || 'Enter text to generate hash'}</div>
          </div>

          <div className={`hash-output ${selectedAlgo === 'sha512' ? 'selected' : ''}`}>
            <div className="hash-header">
              <h3>SHA-512 <span className="hash-length">512-bit</span></h3>
              <button
                onClick={() => handleCopy(hashes.sha512, 'sha512')}
                disabled={!hashes.sha512}
                className={copiedHash === 'sha512' ? 'copied' : ''}
              >
                {copiedHash === 'sha512' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="hash-value">{hashes.sha512 || 'Enter text to generate hash'}</div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="hash-history">
            <div className="history-header">
              <h3>Recent Hashes</h3>
              <button onClick={clearHistory} className="clear-btn">Clear History</button>
            </div>
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-input">{item.input}</div>
                  <div className="history-meta">
                    <span className="history-algo">{item.algorithm.toUpperCase()}</span>
                    <span className="history-time">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="history-hash">{item.hash}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>About Hash Algorithms</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>MD5</strong>
              <p>Produces 128-bit hash. Fast but no longer secure for cryptographic purposes. Good for checksums.</p>
            </div>
            <div className="info-item">
              <strong>SHA-1</strong>
              <p>Produces 160-bit hash. Deprecated for security. Better than MD5 but not recommended for new applications.</p>
            </div>
            <div className="info-item">
              <strong>SHA-256</strong>
              <p>Produces 256-bit hash. Part of SHA-2 family. Currently the most widely used secure hash algorithm.</p>
            </div>
            <div className="info-item">
              <strong>SHA-512</strong>
              <p>Produces 512-bit hash. More secure than SHA-256 but slower. Good for highly sensitive data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HashGenerator
