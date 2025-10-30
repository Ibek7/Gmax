import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AnalyticsHub.css'

const AnalyticsHub = () => {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionTime: 0,
    bounceRate: 0,
    topPages: [],
    trafficSources: [],
    deviceBreakdown: []
  })

  useEffect(() => {
    const saved = localStorage.getItem('gmax_analytics')
    if (saved) {
      setAnalytics(JSON.parse(saved))
    } else {
      // Initialize with sample data
      const sampleData = {
        pageViews: 15420,
        uniqueVisitors: 8340,
        avgSessionTime: 245,
        bounceRate: 32.5,
        topPages: [
          { page: '/dashboard', views: 4250, percentage: 27.6 },
          { page: '/products', views: 3120, percentage: 20.2 },
          { page: '/about', views: 2890, percentage: 18.7 },
          { page: '/contact', views: 2340, percentage: 15.2 },
          { page: '/blog', views: 2820, percentage: 18.3 }
        ],
        trafficSources: [
          { source: 'Direct', visits: 5420, percentage: 35.2 },
          { source: 'Google', visits: 4680, percentage: 30.4 },
          { source: 'Social Media', visits: 3120, percentage: 20.2 },
          { source: 'Referral', visits: 2200, percentage: 14.2 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', users: 5140, percentage: 61.6 },
          { device: 'Mobile', users: 2580, percentage: 30.9 },
          { device: 'Tablet', users: 620, percentage: 7.5 }
        ]
      }
      setAnalytics(sampleData)
      localStorage.setItem('gmax_analytics', JSON.stringify(sampleData))
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getSourceColor = (source) => {
    const colors = {
      'Direct': '#4caf50',
      'Google': '#2196f3',
      'Social Media': '#9c27b0',
      'Referral': '#ff9800'
    }
    return colors[source] || '#666'
  }

  const getDeviceIcon = (device) => {
    const icons = {
      'Desktop': '💻',
      'Mobile': '📱',
      'Tablet': '📋'
    }
    return icons[device] || '🖥️'
  }

  return (
    <div className="analytics-hub-container">
      <div className="analytics-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📊 Analytics Hub</h1>
        <div className="date-range">Last 30 Days</div>
      </div>

      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-icon">👁️</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.pageViews.toLocaleString()}</div>
            <div className="metric-label">Page Views</div>
            <div className="metric-change positive">+12.5%</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.uniqueVisitors.toLocaleString()}</div>
            <div className="metric-label">Unique Visitors</div>
            <div className="metric-change positive">+8.3%</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{formatTime(analytics.avgSessionTime)}</div>
            <div className="metric-label">Avg Session</div>
            <div className="metric-change negative">-2.1%</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📉</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.bounceRate}%</div>
            <div className="metric-label">Bounce Rate</div>
            <div className="metric-change positive">-4.2%</div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-section">
          <h2>🏆 Top Pages</h2>
          <div className="top-pages-list">
            {analytics.topPages.map((page, idx) => (
              <div key={idx} className="page-item">
                <div className="page-info">
                  <span className="page-rank">#{idx + 1}</span>
                  <span className="page-path">{page.page}</span>
                </div>
                <div className="page-stats">
                  <span className="page-views">{page.views.toLocaleString()} views</span>
                  <div className="page-bar">
                    <div
                      className="page-bar-fill"
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-section">
          <h2>🌐 Traffic Sources</h2>
          <div className="traffic-sources">
            {analytics.trafficSources.map((source, idx) => (
              <div key={idx} className="source-item">
                <div className="source-header">
                  <span
                    className="source-dot"
                    style={{ background: getSourceColor(source.source) }}
                  ></span>
                  <span className="source-name">{source.source}</span>
                  <span className="source-percentage">{source.percentage}%</span>
                </div>
                <div className="source-bar">
                  <div
                    className="source-bar-fill"
                    style={{
                      width: `${source.percentage}%`,
                      background: getSourceColor(source.source)
                    }}
                  ></div>
                </div>
                <div className="source-visits">{source.visits.toLocaleString()} visits</div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-section">
          <h2>📱 Device Breakdown</h2>
          <div className="device-breakdown">
            {analytics.deviceBreakdown.map((device, idx) => (
              <div key={idx} className="device-item">
                <div className="device-icon">{getDeviceIcon(device.device)}</div>
                <div className="device-info">
                  <div className="device-name">{device.device}</div>
                  <div className="device-users">{device.users.toLocaleString()} users</div>
                </div>
                <div className="device-percentage">{device.percentage}%</div>
              </div>
            ))}
          </div>
          <div className="device-chart">
            {analytics.deviceBreakdown.map((device, idx) => (
              <div
                key={idx}
                className="chart-segment"
                style={{
                  width: `${device.percentage}%`,
                  background: idx === 0 ? '#4caf50' : idx === 1 ? '#2196f3' : '#ff9800'
                }}
                title={`${device.device}: ${device.percentage}%`}
              ></div>
            ))}
          </div>
        </div>

        <div className="analytics-section insights-section">
          <h2>💡 Key Insights</h2>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <span className="insight-text">Page views increased by 12.5% compared to last month</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">Mobile traffic grew by 18% - consider mobile optimization</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">⚡</span>
              <span className="insight-text">Average session time decreased - review content engagement</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">✨</span>
              <span className="insight-text">Bounce rate improved by 4.2% - great progress!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsHub
