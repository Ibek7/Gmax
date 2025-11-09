import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/UserAgentParser.css'

function UserAgentParser() {
  const navigate = useNavigate()
  const [userAgent, setUserAgent] = useState('')
  const [parsed, setParsed] = useState(null)

  const parseUserAgent = (ua) => {
    if (!ua) {
      setParsed(null)
      return
    }

    const result = {
      browser: { name: 'Unknown', version: '' },
      os: { name: 'Unknown', version: '' },
      device: 'Desktop',
      engine: 'Unknown',
      raw: ua
    }

    // Browser Detection
    if (ua.includes('Firefox/')) {
      result.browser.name = 'Firefox'
      result.browser.version = ua.match(/Firefox\/([\d.]+)/)?.[1] || ''
    } else if (ua.includes('Edg/')) {
      result.browser.name = 'Microsoft Edge'
      result.browser.version = ua.match(/Edg\/([\d.]+)/)?.[1] || ''
    } else if (ua.includes('Chrome/')) {
      result.browser.name = 'Chrome'
      result.browser.version = ua.match(/Chrome\/([\d.]+)/)?.[1] || ''
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      result.browser.name = 'Safari'
      result.browser.version = ua.match(/Version\/([\d.]+)/)?.[1] || ''
    } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
      result.browser.name = 'Opera'
      result.browser.version = ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || ''
    }

    // OS Detection
    if (ua.includes('Windows NT 10.0')) {
      result.os.name = 'Windows'
      result.os.version = '10/11'
    } else if (ua.includes('Windows NT 6.3')) {
      result.os.name = 'Windows'
      result.os.version = '8.1'
    } else if (ua.includes('Windows NT 6.2')) {
      result.os.name = 'Windows'
      result.os.version = '8'
    } else if (ua.includes('Windows NT 6.1')) {
      result.os.name = 'Windows'
      result.os.version = '7'
    } else if (ua.includes('Mac OS X')) {
      result.os.name = 'macOS'
      result.os.version = ua.match(/Mac OS X ([\d_]+)/)?.[1].replace(/_/g, '.') || ''
    } else if (ua.includes('Linux')) {
      result.os.name = 'Linux'
    } else if (ua.includes('Android')) {
      result.os.name = 'Android'
      result.os.version = ua.match(/Android ([\d.]+)/)?.[1] || ''
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      result.os.name = ua.includes('iPad') ? 'iPadOS' : 'iOS'
      result.os.version = ua.match(/OS ([\d_]+)/)?.[1].replace(/_/g, '.') || ''
    }

    // Device Detection
    if (ua.includes('Mobile') || ua.includes('iPhone') || ua.includes('Android')) {
      result.device = 'Mobile'
    } else if (ua.includes('Tablet') || ua.includes('iPad')) {
      result.device = 'Tablet'
    }

    // Engine Detection
    if (ua.includes('Gecko/')) {
      result.engine = 'Gecko'
    } else if (ua.includes('AppleWebKit/')) {
      result.engine = 'WebKit'
    } else if (ua.includes('Trident/')) {
      result.engine = 'Trident'
    }

    setParsed(result)
  }

  const handleInputChange = (e) => {
    const ua = e.target.value
    setUserAgent(ua)
    parseUserAgent(ua)
  }

  const loadCurrentUA = () => {
    const currentUA = navigator.userAgent
    setUserAgent(currentUA)
    parseUserAgent(currentUA)
  }

  const loadSample = (type) => {
    const samples = {
      chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      android: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    }
    setUserAgent(samples[type])
    parseUserAgent(samples[type])
  }

  const copyToClipboard = () => {
    if (!userAgent) return
    navigator.clipboard.writeText(userAgent)
    alert('User agent copied to clipboard!')
  }

  const clearAll = () => {
    setUserAgent('')
    setParsed(null)
  }

  return (
    <div className="user-agent-parser">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="parser-container">
        <h1>User Agent Parser</h1>
        <p className="subtitle">Parse and analyze user agent strings</p>

        <div className="quick-load">
          <h3>Quick Load:</h3>
          <div className="quick-buttons">
            <button onClick={loadCurrentUA} className="current-btn">
              🖥️ Current Browser
            </button>
            <button onClick={() => loadSample('chrome')} className="sample-btn">
              Chrome
            </button>
            <button onClick={() => loadSample('firefox')} className="sample-btn">
              Firefox
            </button>
            <button onClick={() => loadSample('safari')} className="sample-btn">
              Safari
            </button>
            <button onClick={() => loadSample('edge')} className="sample-btn">
              Edge
            </button>
            <button onClick={() => loadSample('mobile')} className="sample-btn">
              iPhone
            </button>
            <button onClick={() => loadSample('android')} className="sample-btn">
              Android
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={copyToClipboard} className="copy-btn" disabled={!userAgent}>
            📋 Copy UA String
          </button>
          <button onClick={clearAll} className="clear-btn">
            🗑️ Clear
          </button>
        </div>

        <div className="input-section">
          <h3>User Agent String</h3>
          <textarea
            value={userAgent}
            onChange={handleInputChange}
            placeholder="Paste a user agent string here or use the quick load buttons above..."
            rows={4}
          />
        </div>

        {parsed && (
          <div className="results-section">
            <h3>Parsed Information</h3>
            
            <div className="info-grid">
              <div className="info-card browser">
                <div className="info-icon">🌐</div>
                <div className="info-content">
                  <h4>Browser</h4>
                  <p className="info-name">{parsed.browser.name}</p>
                  {parsed.browser.version && (
                    <p className="info-version">Version {parsed.browser.version}</p>
                  )}
                </div>
              </div>

              <div className="info-card os">
                <div className="info-icon">💻</div>
                <div className="info-content">
                  <h4>Operating System</h4>
                  <p className="info-name">{parsed.os.name}</p>
                  {parsed.os.version && (
                    <p className="info-version">{parsed.os.version}</p>
                  )}
                </div>
              </div>

              <div className="info-card device">
                <div className="info-icon">📱</div>
                <div className="info-content">
                  <h4>Device Type</h4>
                  <p className="info-name">{parsed.device}</p>
                </div>
              </div>

              <div className="info-card engine">
                <div className="info-icon">⚙️</div>
                <div className="info-content">
                  <h4>Rendering Engine</h4>
                  <p className="info-name">{parsed.engine}</p>
                </div>
              </div>
            </div>

            <div className="raw-section">
              <h4>Raw User Agent String</h4>
              <div className="raw-value">{parsed.raw}</div>
            </div>
          </div>
        )}

        <div className="about-section">
          <h3>About User Agent Strings</h3>
          <p>
            A user agent string is a text that a web browser sends to web servers to identify itself. 
            It contains information about the browser, operating system, and device being used. 
            This information helps websites deliver content optimized for specific platforms and browsers.
          </p>
          <div className="features-list">
            <div className="feature">✅ Detect browser name and version</div>
            <div className="feature">✅ Identify operating system</div>
            <div className="feature">✅ Determine device type (mobile, tablet, desktop)</div>
            <div className="feature">✅ Recognize rendering engine</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAgentParser
