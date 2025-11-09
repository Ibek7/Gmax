import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ChecksumGenerator.css'

function ChecksumGenerator() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [checksums, setChecksums] = useState(null)

  const generateChecksums = async (text) => {
    if (!text) {
      setChecksums(null)
      return
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    try {
      const results = {
        md5: await calculateMD5(text),
        sha1: await calculateSHA(data, 'SHA-1'),
        sha256: await calculateSHA(data, 'SHA-256'),
        sha384: await calculateSHA(data, 'SHA-384'),
        sha512: await calculateSHA(data, 'SHA-512')
      }
      setChecksums(results)
    } catch (error) {
      alert('Error generating checksums: ' + error.message)
    }
  }

  const calculateSHA = async (data, algorithm) => {
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const calculateMD5 = async (text) => {
    // Simple MD5 implementation (not cryptographically secure, for demo purposes)
    // In production, use a proper MD5 library
    const md5 = (str) => {
      const rotateLeft = (value, shift) => (value << shift) | (value >>> (32 - shift))
      
      const addUnsigned = (x, y) => {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF)
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xFFFF)
      }
      
      const F = (x, y, z) => (x & y) | (~x & z)
      const G = (x, y, z) => (x & z) | (y & ~z)
      const H = (x, y, z) => x ^ y ^ z
      const I = (x, y, z) => y ^ (x | ~z)
      
      const FF = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }
      
      const GG = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }
      
      const HH = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }
      
      const II = (a, b, c, d, x, s, ac) => {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
      }
      
      const convertToWordArray = (str) => {
        const wordArray = []
        for (let i = 0; i < str.length * 8; i += 8) {
          wordArray[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32)
        }
        return wordArray
      }
      
      const wordToHex = (value) => {
        let hex = ''
        for (let i = 0; i < 4; i++) {
          hex += ((value >> (i * 8)) & 0xFF).toString(16).padStart(2, '0')
        }
        return hex
      }
      
      const x = convertToWordArray(str)
      const len = str.length * 8
      x[len >> 5] |= 0x80 << (len % 32)
      x[(((len + 64) >>> 9) << 4) + 14] = len
      
      let a = 0x67452301
      let b = 0xEFCDAB89
      let c = 0x98BADCFE
      let d = 0x10325476
      
      for (let i = 0; i < x.length; i += 16) {
        const olda = a, oldb = b, oldc = c, oldd = d
        
        a = FF(a, b, c, d, x[i + 0], 7, 0xD76AA478)
        d = FF(d, a, b, c, x[i + 1], 12, 0xE8C7B756)
        c = FF(c, d, a, b, x[i + 2], 17, 0x242070DB)
        b = FF(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE)
        a = FF(a, b, c, d, x[i + 4], 7, 0xF57C0FAF)
        d = FF(d, a, b, c, x[i + 5], 12, 0x4787C62A)
        c = FF(c, d, a, b, x[i + 6], 17, 0xA8304613)
        b = FF(b, c, d, a, x[i + 7], 22, 0xFD469501)
        a = FF(a, b, c, d, x[i + 8], 7, 0x698098D8)
        d = FF(d, a, b, c, x[i + 9], 12, 0x8B44F7AF)
        c = FF(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1)
        b = FF(b, c, d, a, x[i + 11], 22, 0x895CD7BE)
        a = FF(a, b, c, d, x[i + 12], 7, 0x6B901122)
        d = FF(d, a, b, c, x[i + 13], 12, 0xFD987193)
        c = FF(c, d, a, b, x[i + 14], 17, 0xA679438E)
        b = FF(b, c, d, a, x[i + 15], 22, 0x49B40821)
        
        a = GG(a, b, c, d, x[i + 1], 5, 0xF61E2562)
        d = GG(d, a, b, c, x[i + 6], 9, 0xC040B340)
        c = GG(c, d, a, b, x[i + 11], 14, 0x265E5A51)
        b = GG(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA)
        a = GG(a, b, c, d, x[i + 5], 5, 0xD62F105D)
        d = GG(d, a, b, c, x[i + 10], 9, 0x02441453)
        c = GG(c, d, a, b, x[i + 15], 14, 0xD8A1E681)
        b = GG(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8)
        a = GG(a, b, c, d, x[i + 9], 5, 0x21E1CDE6)
        d = GG(d, a, b, c, x[i + 14], 9, 0xC33707D6)
        c = GG(c, d, a, b, x[i + 3], 14, 0xF4D50D87)
        b = GG(b, c, d, a, x[i + 8], 20, 0x455A14ED)
        a = GG(a, b, c, d, x[i + 13], 5, 0xA9E3E905)
        d = GG(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8)
        c = GG(c, d, a, b, x[i + 7], 14, 0x676F02D9)
        b = GG(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A)
        
        a = HH(a, b, c, d, x[i + 5], 4, 0xFFFA3942)
        d = HH(d, a, b, c, x[i + 8], 11, 0x8771F681)
        c = HH(c, d, a, b, x[i + 11], 16, 0x6D9D6122)
        b = HH(b, c, d, a, x[i + 14], 23, 0xFDE5380C)
        a = HH(a, b, c, d, x[i + 1], 4, 0xA4BEEA44)
        d = HH(d, a, b, c, x[i + 4], 11, 0x4BDECFA9)
        c = HH(c, d, a, b, x[i + 7], 16, 0xF6BB4B60)
        b = HH(b, c, d, a, x[i + 10], 23, 0xBEBFBC70)
        a = HH(a, b, c, d, x[i + 13], 4, 0x289B7EC6)
        d = HH(d, a, b, c, x[i + 0], 11, 0xEAA127FA)
        c = HH(c, d, a, b, x[i + 3], 16, 0xD4EF3085)
        b = HH(b, c, d, a, x[i + 6], 23, 0x04881D05)
        a = HH(a, b, c, d, x[i + 9], 4, 0xD9D4D039)
        d = HH(d, a, b, c, x[i + 12], 11, 0xE6DB99E5)
        c = HH(c, d, a, b, x[i + 15], 16, 0x1FA27CF8)
        b = HH(b, c, d, a, x[i + 2], 23, 0xC4AC5665)
        
        a = II(a, b, c, d, x[i + 0], 6, 0xF4292244)
        d = II(d, a, b, c, x[i + 7], 10, 0x432AFF97)
        c = II(c, d, a, b, x[i + 14], 15, 0xAB9423A7)
        b = II(b, c, d, a, x[i + 5], 21, 0xFC93A039)
        a = II(a, b, c, d, x[i + 12], 6, 0x655B59C3)
        d = II(d, a, b, c, x[i + 3], 10, 0x8F0CCC92)
        c = II(c, d, a, b, x[i + 10], 15, 0xFFEFF47D)
        b = II(b, c, d, a, x[i + 1], 21, 0x85845DD1)
        a = II(a, b, c, d, x[i + 8], 6, 0x6FA87E4F)
        d = II(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0)
        c = II(c, d, a, b, x[i + 6], 15, 0xA3014314)
        b = II(b, c, d, a, x[i + 13], 21, 0x4E0811A1)
        a = II(a, b, c, d, x[i + 4], 6, 0xF7537E82)
        d = II(d, a, b, c, x[i + 11], 10, 0xBD3AF235)
        c = II(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB)
        b = II(b, c, d, a, x[i + 9], 21, 0xEB86D391)
        
        a = addUnsigned(a, olda)
        b = addUnsigned(b, oldb)
        c = addUnsigned(c, oldc)
        d = addUnsigned(d, oldd)
      }
      
      return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
    }
    
    return md5(text)
  }

  const handleInputChange = (e) => {
    const text = e.target.value
    setInput(text)
    generateChecksums(text)
  }

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash)
    alert('Hash copied to clipboard!')
  }

  const loadSample = () => {
    const sample = 'The quick brown fox jumps over the lazy dog'
    setInput(sample)
    generateChecksums(sample)
  }

  const clearAll = () => {
    setInput('')
    setChecksums(null)
  }

  return (
    <div className="checksum-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>Checksum Generator</h1>
        <p className="subtitle">Generate cryptographic hashes for text</p>

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
            placeholder="Enter text to generate checksums..."
            rows={6}
          />
        </div>

        {checksums && (
          <div className="checksums-section">
            <h3>Generated Hashes</h3>
            
            <div className="hash-card">
              <div className="hash-header">
                <div>
                  <h4>MD5</h4>
                  <span className="hash-info">128-bit hash (not cryptographically secure)</span>
                </div>
                <button onClick={() => copyHash(checksums.md5)} className="copy-btn">
                  📋 Copy
                </button>
              </div>
              <div className="hash-value">{checksums.md5}</div>
            </div>

            <div className="hash-card">
              <div className="hash-header">
                <div>
                  <h4>SHA-1</h4>
                  <span className="hash-info">160-bit hash (deprecated for security)</span>
                </div>
                <button onClick={() => copyHash(checksums.sha1)} className="copy-btn">
                  📋 Copy
                </button>
              </div>
              <div className="hash-value">{checksums.sha1}</div>
            </div>

            <div className="hash-card">
              <div className="hash-header">
                <div>
                  <h4>SHA-256</h4>
                  <span className="hash-info">256-bit hash (recommended for most uses)</span>
                </div>
                <button onClick={() => copyHash(checksums.sha256)} className="copy-btn">
                  📋 Copy
                </button>
              </div>
              <div className="hash-value">{checksums.sha256}</div>
            </div>

            <div className="hash-card">
              <div className="hash-header">
                <div>
                  <h4>SHA-384</h4>
                  <span className="hash-info">384-bit hash (extra security)</span>
                </div>
                <button onClick={() => copyHash(checksums.sha384)} className="copy-btn">
                  📋 Copy
                </button>
              </div>
              <div className="hash-value">{checksums.sha384}</div>
            </div>

            <div className="hash-card">
              <div className="hash-header">
                <div>
                  <h4>SHA-512</h4>
                  <span className="hash-info">512-bit hash (maximum security)</span>
                </div>
                <button onClick={() => copyHash(checksums.sha512)} className="copy-btn">
                  📋 Copy
                </button>
              </div>
              <div className="hash-value">{checksums.sha512}</div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Use Cases</h3>
          <ul>
            <li>✅ File integrity verification</li>
            <li>✅ Password hashing (use SHA-256 or higher)</li>
            <li>✅ Digital signatures</li>
            <li>✅ Data deduplication</li>
            <li>✅ Blockchain and cryptocurrency</li>
            <li>⚠️ MD5 and SHA-1 are not recommended for security-critical applications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChecksumGenerator
