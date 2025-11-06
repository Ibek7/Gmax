import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CronBuilder.css'

function CronBuilder() {
  const navigate = useNavigate()
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [dayOfMonth, setDayOfMonth] = useState('*')
  const [month, setMonth] = useState('*')
  const [dayOfWeek, setDayOfWeek] = useState('*')
  const [cronExpression, setCronExpression] = useState('* * * * *')
  const [humanReadable, setHumanReadable] = useState('')
  const [nextRuns, setNextRuns] = useState([])

  const presets = [
    { name: 'Every minute', cron: '* * * * *' },
    { name: 'Every 5 minutes', cron: '*/5 * * * *' },
    { name: 'Every hour', cron: '0 * * * *' },
    { name: 'Every day at midnight', cron: '0 0 * * *' },
    { name: 'Every day at noon', cron: '0 12 * * *' },
    { name: 'Every Monday at 9 AM', cron: '0 9 * * 1' },
    { name: 'Every weekday at 9 AM', cron: '0 9 * * 1-5' },
    { name: 'First day of month', cron: '0 0 1 * *' },
    { name: 'Every Sunday at midnight', cron: '0 0 * * 0' }
  ]

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
    setCronExpression(expression)
    setHumanReadable(generateHumanReadable(minute, hour, dayOfMonth, month, dayOfWeek))
    setNextRuns(calculateNextRuns(minute, hour, dayOfMonth, month, dayOfWeek))
  }, [minute, hour, dayOfMonth, month, dayOfWeek])

  const generateHumanReadable = (min, hr, dom, mon, dow) => {
    let parts = []

    // Minute
    if (min === '*') {
      parts.push('every minute')
    } else if (min.includes('/')) {
      const interval = min.split('/')[1]
      parts.push(`every ${interval} minutes`)
    } else if (min.includes(',')) {
      parts.push(`at minutes ${min}`)
    } else if (min.includes('-')) {
      parts.push(`at minutes ${min}`)
    } else {
      parts.push(`at minute ${min}`)
    }

    // Hour
    if (hr !== '*') {
      if (hr.includes('/')) {
        const interval = hr.split('/')[1]
        parts.push(`every ${interval} hours`)
      } else if (hr.includes(',')) {
        parts.push(`at hours ${hr}`)
      } else if (hr.includes('-')) {
        parts.push(`between hours ${hr}`)
      } else {
        const hour12 = parseInt(hr) % 12 || 12
        const ampm = parseInt(hr) >= 12 ? 'PM' : 'AM'
        parts.push(`at ${hour12}:00 ${ampm}`)
      }
    }

    // Day of month
    if (dom !== '*') {
      if (dom.includes('/')) {
        const interval = dom.split('/')[1]
        parts.push(`every ${interval} days`)
      } else if (dom.includes(',')) {
        parts.push(`on days ${dom}`)
      } else if (dom.includes('-')) {
        parts.push(`on days ${dom}`)
      } else {
        parts.push(`on day ${dom}`)
      }
    }

    // Month
    if (mon !== '*') {
      if (mon.includes(',')) {
        const months = mon.split(',').map(m => monthNames[parseInt(m) - 1]).join(', ')
        parts.push(`in ${months}`)
      } else if (mon.includes('-')) {
        const [start, end] = mon.split('-')
        parts.push(`from ${monthNames[parseInt(start) - 1]} to ${monthNames[parseInt(end) - 1]}`)
      } else {
        parts.push(`in ${monthNames[parseInt(mon) - 1]}`)
      }
    }

    // Day of week
    if (dow !== '*') {
      if (dow.includes(',')) {
        const days = dow.split(',').map(d => dayNames[parseInt(d)]).join(', ')
        parts.push(`on ${days}`)
      } else if (dow.includes('-')) {
        const [start, end] = dow.split('-')
        parts.push(`from ${dayNames[parseInt(start)]} to ${dayNames[parseInt(end)]}`)
      } else if (dow === '1-5') {
        parts.push('on weekdays')
      } else {
        parts.push(`on ${dayNames[parseInt(dow)]}`)
      }
    }

    return parts.join(', ').charAt(0).toUpperCase() + parts.join(', ').slice(1)
  }

  const calculateNextRuns = (min, hr, dom, mon, dow) => {
    const runs = []
    const now = new Date()
    let current = new Date(now)

    // Simplified next run calculation (for demonstration)
    for (let i = 0; i < 5; i++) {
      current = new Date(current.getTime() + 60000) // Add 1 minute
      
      if (matchesCron(current, min, hr, dom, mon, dow)) {
        runs.push(new Date(current))
        if (runs.length >= 5) break
      }

      // Prevent infinite loop
      if (i > 10000) break
    }

    return runs.length > 0 ? runs : [new Date(now.getTime() + 60000)]
  }

  const matchesCron = (date, min, hr, dom, mon, dow) => {
    const minute = date.getMinutes()
    const hour = date.getHours()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const weekday = date.getDay()

    // Simplified matching
    const minMatch = min === '*' || min === minute.toString() || 
                     (min.includes('/') && minute % parseInt(min.split('/')[1]) === 0)
    const hrMatch = hr === '*' || hr === hour.toString()
    const domMatch = dom === '*' || dom === day.toString()
    const monMatch = mon === '*' || mon === month.toString()
    const dowMatch = dow === '*' || dow === weekday.toString()

    return minMatch && hrMatch && domMatch && monMatch && dowMatch
  }

  const loadPreset = (cron) => {
    const [m, h, d, mo, dw] = cron.split(' ')
    setMinute(m)
    setHour(h)
    setDayOfMonth(d)
    setMonth(mo)
    setDayOfWeek(dw)
  }

  const copyCronExpression = () => {
    navigator.clipboard.writeText(cronExpression)
  }

  return (
    <div className="cron-builder">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="cron-container">
        <h1>Cron Expression Builder</h1>
        <p className="subtitle">Build and visualize cron expressions with ease</p>

        <div className="cron-output">
          <div className="expression-display">
            <h3>Cron Expression</h3>
            <div className="expression-box">
              <code>{cronExpression}</code>
              <button onClick={copyCronExpression} className="copy-btn">
                📋 Copy
              </button>
            </div>
          </div>
          <div className="human-readable">
            <h3>Human Readable</h3>
            <p>{humanReadable}</p>
          </div>
        </div>

        <div className="presets">
          <h3>Presets</h3>
          <div className="preset-buttons">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset.cron)}
                className="preset-btn"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="cron-fields">
          <div className="field-group">
            <label>
              Minute (0-59)
              <span className="field-hint">* = every minute</span>
            </label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="*"
            />
            <div className="examples">
              <button onClick={() => setMinute('*')}>*</button>
              <button onClick={() => setMinute('0')}>0</button>
              <button onClick={() => setMinute('*/5')}>*/5</button>
              <button onClick={() => setMinute('0,15,30,45')}>0,15,30,45</button>
            </div>
          </div>

          <div className="field-group">
            <label>
              Hour (0-23)
              <span className="field-hint">* = every hour</span>
            </label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="*"
            />
            <div className="examples">
              <button onClick={() => setHour('*')}>*</button>
              <button onClick={() => setHour('0')}>0</button>
              <button onClick={() => setHour('9')}>9</button>
              <button onClick={() => setHour('*/2')}>*/2</button>
            </div>
          </div>

          <div className="field-group">
            <label>
              Day of Month (1-31)
              <span className="field-hint">* = every day</span>
            </label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              placeholder="*"
            />
            <div className="examples">
              <button onClick={() => setDayOfMonth('*')}>*</button>
              <button onClick={() => setDayOfMonth('1')}>1</button>
              <button onClick={() => setDayOfMonth('15')}>15</button>
              <button onClick={() => setDayOfMonth('*/2')}>*/2</button>
            </div>
          </div>

          <div className="field-group">
            <label>
              Month (1-12)
              <span className="field-hint">* = every month</span>
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="*"
            />
            <div className="examples">
              <button onClick={() => setMonth('*')}>*</button>
              <button onClick={() => setMonth('1')}>1</button>
              <button onClick={() => setMonth('6')}>6</button>
              <button onClick={() => setMonth('1,7')}>1,7</button>
            </div>
          </div>

          <div className="field-group">
            <label>
              Day of Week (0-6)
              <span className="field-hint">0 = Sunday, 6 = Saturday</span>
            </label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              placeholder="*"
            />
            <div className="examples">
              <button onClick={() => setDayOfWeek('*')}>*</button>
              <button onClick={() => setDayOfWeek('0')}>0</button>
              <button onClick={() => setDayOfWeek('1')}>1</button>
              <button onClick={() => setDayOfWeek('1-5')}>1-5</button>
            </div>
          </div>
        </div>

        <div className="next-runs">
          <h3>Next 5 Scheduled Runs</h3>
          <div className="run-list">
            {nextRuns.map((run, idx) => (
              <div key={idx} className="run-item">
                <span className="run-number">#{idx + 1}</span>
                <span className="run-date">{run.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Cron Expression Format</h3>
          <div className="format-info">
            <code>* * * * *</code>
            <div className="format-labels">
              <span>minute</span>
              <span>hour</span>
              <span>day</span>
              <span>month</span>
              <span>weekday</span>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <strong>Special Characters</strong>
              <p><code>*</code> - Any value</p>
              <p><code>,</code> - Value list (e.g., 1,3,5)</p>
              <p><code>-</code> - Range (e.g., 1-5)</p>
              <p><code>/</code> - Step values (e.g., */5)</p>
            </div>
            <div className="info-item">
              <strong>Examples</strong>
              <p><code>0 0 * * *</code> - Daily at midnight</p>
              <p><code>*/15 * * * *</code> - Every 15 minutes</p>
              <p><code>0 9-17 * * 1-5</code> - Weekdays 9 AM to 5 PM</p>
              <p><code>0 0 1 */3 *</code> - Quarterly on 1st day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CronBuilder
