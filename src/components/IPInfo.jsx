import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/IPInfo.css'

function IPInfo() {
  const navigate = useNavigate()
  const [ipAddress, setIpAddress] = useState('')
  const [ipInfo, setIpInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchIPInfo = async (ip) => {
    setLoading(true)
    setError('')
    setIpInfo(null)

    try {
      // Using ip-api.com free API (no key required)
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`)
      const data = await response.json()

      if (data.status === 'fail') {
        setError(data.message || 'Failed to fetch IP information')
      } else {
        setIpInfo(data)
      }
    } catch (err) {
      setError('Failed to fetch IP information. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  const getMyIP = async () => {
    setLoading(true)
    setError('')
    setIpInfo(null)

    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setIpAddress(data.ip)
      await fetchIPInfo(data.ip)
    } catch (err) {
      setError('Failed to get your IP address')
      setLoading(false)
    }
  }

  const handleLookup = () => {
    if (!ipAddress.trim()) {
      setError('Please enter an IP address')
      return
    }
    fetchIPInfo(ipAddress)
  }

  const isValidIP = (ip) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  const exampleIPs = [
    { label: 'Google DNS', ip: '8.8.8.8' },
    { label: 'Cloudflare DNS', ip: '1.1.1.1' },
    { label: 'OpenDNS', ip: '208.67.222.222' },
    { label: 'Quad9 DNS', ip: '9.9.9.9' }
  ]

  return (
    <div className="ip-info">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="ip-container">
        <h1>IP Address Info</h1>
        <p className="subtitle">Look up geolocation and details for any IP address</p>

        <div className="lookup-section">
          <div className="input-group">
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            />
            <button onClick={handleLookup} className="lookup-btn" disabled={loading}>
              {loading ? 'Looking up...' : 'Lookup'}
            </button>
            <button onClick={getMyIP} className="my-ip-btn" disabled={loading}>
              My IP
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {ipInfo && (
          <div className="ip-results">
            <div className="result-header">
              <h2>{ipInfo.query}</h2>
              <span className="ip-type">{isValidIP(ipInfo.query) ? 'IPv4' : 'IPv6'}</span>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <div className="card-icon">🌍</div>
                <h3>Location</h3>
                <div className="info-details">
                  <div className="info-row">
                    <span className="label">Country</span>
                    <span className="value">{ipInfo.country} ({ipInfo.countryCode})</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Region</span>
                    <span className="value">{ipInfo.regionName} ({ipInfo.region})</span>
                  </div>
                  <div className="info-row">
                    <span className="label">City</span>
                    <span className="value">{ipInfo.city}</span>
                  </div>
                  {ipInfo.zip && (
                    <div className="info-row">
                      <span className="label">ZIP Code</span>
                      <span className="value">{ipInfo.zip}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-card">
                <div className="card-icon">📍</div>
                <h3>Coordinates</h3>
                <div className="info-details">
                  <div className="info-row">
                    <span className="label">Latitude</span>
                    <span className="value">{ipInfo.lat}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Longitude</span>
                    <span className="value">{ipInfo.lon}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Timezone</span>
                    <span className="value">{ipInfo.timezone}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${ipInfo.lat},${ipInfo.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    View on Map →
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="card-icon">🌐</div>
                <h3>Network</h3>
                <div className="info-details">
                  <div className="info-row">
                    <span className="label">ISP</span>
                    <span className="value">{ipInfo.isp}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Organization</span>
                    <span className="value">{ipInfo.org}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">AS Number</span>
                    <span className="value">{ipInfo.as}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="map-preview">
              <iframe
                title="IP Location Map"
                width="100%"
                height="400"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${ipInfo.lon-0.1},${ipInfo.lat-0.1},${ipInfo.lon+0.1},${ipInfo.lat+0.1}&layer=mapnik&marker=${ipInfo.lat},${ipInfo.lon}`}
              />
            </div>
          </div>
        )}

        <div className="examples-section">
          <h3>Try These Examples</h3>
          <div className="example-grid">
            {exampleIPs.map((example, idx) => (
              <div
                key={idx}
                className="example-card"
                onClick={() => {
                  setIpAddress(example.ip)
                  fetchIPInfo(example.ip)
                }}
              >
                <h4>{example.label}</h4>
                <code>{example.ip}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>About IP Address Lookup</h3>
          <div className="info-items">
            <div className="info-item">
              <strong>What is an IP Address?</strong>
              <p>An IP (Internet Protocol) address is a unique numerical label assigned to each device connected to a computer network. It serves two main purposes: host identification and location addressing.</p>
            </div>
            <div className="info-item">
              <strong>IPv4 vs IPv6</strong>
              <p>IPv4 uses 32-bit addresses (e.g., 192.168.1.1) while IPv6 uses 128-bit addresses (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334). IPv6 was created to address IPv4 address exhaustion.</p>
            </div>
            <div className="info-item">
              <strong>Geolocation Accuracy</strong>
              <p>IP geolocation data is approximate and typically accurate to the city level. The exact location may vary based on the ISP's infrastructure and routing.</p>
            </div>
            <div className="info-item">
              <strong>Privacy Note</strong>
              <p>This tool uses public IP address databases. No personal information is stored or logged. The data shown is publicly available information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IPInfo
