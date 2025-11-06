import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TimestampConverter.css'

function TimestampConverter() {
  const navigate = useNavigate()
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [inputTimestamp, setInputTimestamp] = useState('')
  const [inputDate, setInputDate] = useState('')
  const [selectedTimezone, setSelectedTimezone] = useState('local')
  const [convertedResults, setConvertedResults] = useState(null)

  const timezones = [
    { value: 'local', label: 'Local Time' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Dubai', label: 'Dubai' },
    { value: 'Australia/Sydney', label: 'Sydney' }
  ]

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000)
    
    if (timezone === 'local') {
      return {
        full: date.toLocaleString(),
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        iso: date.toISOString(),
        utc: date.toUTCString()
      }
    }

    // For specific timezones
    const options = { timeZone: timezone }
    return {
      full: date.toLocaleString('en-US', options),
      date: date.toLocaleDateString('en-US', options),
      time: date.toLocaleTimeString('en-US', options),
      iso: date.toISOString(),
      utc: date.toUTCString()
    }
  }

  const handleTimestampConvert = () => {
    if (!inputTimestamp) return

    const timestamp = parseInt(inputTimestamp)
    if (isNaN(timestamp)) {
      alert('Please enter a valid timestamp')
      return
    }

    const results = formatDate(timestamp, selectedTimezone)
    setConvertedResults({ ...results, timestamp })
  }

  const handleDateConvert = () => {
    if (!inputDate) return

    const date = new Date(inputDate)
    if (isNaN(date.getTime())) {
      alert('Please enter a valid date')
      return
    }

    const timestamp = Math.floor(date.getTime() / 1000)
    const results = formatDate(timestamp, selectedTimezone)
    setConvertedResults({ ...results, timestamp })
  }

  const useCurrentTimestamp = () => {
    setInputTimestamp(currentTimestamp.toString())
    const results = formatDate(currentTimestamp, selectedTimezone)
    setConvertedResults({ ...results, timestamp: currentTimestamp })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const getRelativeTime = (timestamp) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp
    
    if (diff < 60) return `${diff} seconds ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`
    return `${Math.floor(diff / 31536000)} years ago`
  }

  const commonTimestamps = [
    { label: 'Unix Epoch', value: 0, description: 'January 1, 1970' },
    { label: 'Y2K', value: 946684800, description: 'January 1, 2000' },
    { label: 'Today Start', value: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000), description: 'Beginning of today' },
    { label: 'This Week Start', value: Math.floor(new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0, 0, 0, 0) / 1000), description: 'Start of this week' },
    { label: 'This Month Start', value: Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000), description: 'Start of this month' },
    { label: 'This Year Start', value: Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000), description: 'Start of this year' }
  ]

  return (
    <div className="timestamp-converter">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="timestamp-container">
        <h1>Timestamp Converter</h1>
        <p className="subtitle">Convert between Unix timestamps and human-readable dates</p>

        <div className="current-time">
          <div className="live-timestamp">
            <h3>Current Unix Timestamp</h3>
            <div className="timestamp-display">
              <code>{currentTimestamp}</code>
              <button onClick={() => copyToClipboard(currentTimestamp.toString())} className="copy-btn">
                📋
              </button>
            </div>
            <p className="current-date">{new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="timezone-selector">
          <label>Timezone</label>
          <select value={selectedTimezone} onChange={(e) => setSelectedTimezone(e.target.value)}>
            {timezones.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className="converters">
          <div className="converter-section">
            <h3>Timestamp to Date</h3>
            <div className="input-group">
              <input
                type="text"
                value={inputTimestamp}
                onChange={(e) => setInputTimestamp(e.target.value)}
                placeholder="Enter Unix timestamp..."
              />
              <div className="button-group">
                <button onClick={handleTimestampConvert} className="convert-btn">
                  Convert
                </button>
                <button onClick={useCurrentTimestamp} className="current-btn">
                  Use Current
                </button>
              </div>
            </div>
          </div>

          <div className="converter-section">
            <h3>Date to Timestamp</h3>
            <div className="input-group">
              <input
                type="datetime-local"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
              />
              <button onClick={handleDateConvert} className="convert-btn">
                Convert
              </button>
            </div>
          </div>
        </div>

        {convertedResults && (
          <div className="results">
            <h3>Conversion Results</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Unix Timestamp</span>
                <div className="result-value">
                  <code>{convertedResults.timestamp}</code>
                  <button onClick={() => copyToClipboard(convertedResults.timestamp.toString())}>
                    📋
                  </button>
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Full Date & Time</span>
                <div className="result-value">
                  <span>{convertedResults.full}</span>
                  <button onClick={() => copyToClipboard(convertedResults.full)}>
                    📋
                  </button>
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Date</span>
                <div className="result-value">
                  <span>{convertedResults.date}</span>
                  <button onClick={() => copyToClipboard(convertedResults.date)}>
                    📋
                  </button>
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Time</span>
                <div className="result-value">
                  <span>{convertedResults.time}</span>
                  <button onClick={() => copyToClipboard(convertedResults.time)}>
                    📋
                  </button>
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">ISO 8601</span>
                <div className="result-value">
                  <code>{convertedResults.iso}</code>
                  <button onClick={() => copyToClipboard(convertedResults.iso)}>
                    📋
                  </button>
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">UTC String</span>
                <div className="result-value">
                  <span>{convertedResults.utc}</span>
                  <button onClick={() => copyToClipboard(convertedResults.utc)}>
                    📋
                  </button>
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Relative Time</span>
                <div className="result-value">
                  <span>{getRelativeTime(convertedResults.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="common-timestamps">
          <h3>Common Timestamps</h3>
          <div className="timestamp-grid">
            {commonTimestamps.map((item, idx) => (
              <div
                key={idx}
                className="timestamp-card"
                onClick={() => {
                  setInputTimestamp(item.value.toString())
                  const results = formatDate(item.value, selectedTimezone)
                  setConvertedResults({ ...results, timestamp: item.value })
                }}
              >
                <h4>{item.label}</h4>
                <code>{item.value}</code>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>About Unix Timestamps</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>What is a Unix Timestamp?</strong>
              <p>A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting leap seconds.</p>
            </div>
            <div className="info-item">
              <strong>Why Use Timestamps?</strong>
              <p>Timestamps are timezone-independent and make it easy to calculate time differences. They're commonly used in databases and APIs.</p>
            </div>
            <div className="info-item">
              <strong>Precision</strong>
              <p>Unix timestamps are typically in seconds. For millisecond precision (JavaScript), multiply by 1000 or divide by 1000 when converting.</p>
            </div>
            <div className="info-item">
              <strong>Year 2038 Problem</strong>
              <p>32-bit systems will overflow on January 19, 2038 at 03:14:07 UTC when the timestamp exceeds 2,147,483,647.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimestampConverter
