import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BrowserCompatibilityChecker.css'

function BrowserCompatibilityChecker() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const features = [
    {
      category: 'css',
      name: 'CSS Grid',
      chrome: '57+',
      firefox: '52+',
      safari: '10.1+',
      edge: '16+',
      support: 'full'
    },
    {
      category: 'css',
      name: 'CSS Flexbox',
      chrome: '29+',
      firefox: '28+',
      safari: '9+',
      edge: '12+',
      support: 'full'
    },
    {
      category: 'css',
      name: 'CSS Custom Properties',
      chrome: '49+',
      firefox: '31+',
      safari: '9.1+',
      edge: '15+',
      support: 'full'
    },
    {
      category: 'css',
      name: 'Container Queries',
      chrome: '105+',
      firefox: '110+',
      safari: '16+',
      edge: '105+',
      support: 'partial'
    },
    {
      category: 'js',
      name: 'Arrow Functions',
      chrome: '45+',
      firefox: '22+',
      safari: '10+',
      edge: '12+',
      support: 'full'
    },
    {
      category: 'js',
      name: 'Async/Await',
      chrome: '55+',
      firefox: '52+',
      safari: '10.1+',
      edge: '15+',
      support: 'full'
    },
    {
      category: 'js',
      name: 'ES Modules',
      chrome: '61+',
      firefox: '60+',
      safari: '10.1+',
      edge: '16+',
      support: 'full'
    },
    {
      category: 'js',
      name: 'Optional Chaining',
      chrome: '80+',
      firefox: '74+',
      safari: '13.1+',
      edge: '80+',
      support: 'full'
    },
    {
      category: 'html',
      name: 'Dialog Element',
      chrome: '37+',
      firefox: '98+',
      safari: '15.4+',
      edge: '79+',
      support: 'full'
    },
    {
      category: 'html',
      name: 'Picture Element',
      chrome: '38+',
      firefox: '38+',
      safari: '9.1+',
      edge: '13+',
      support: 'full'
    },
    {
      category: 'api',
      name: 'Fetch API',
      chrome: '42+',
      firefox: '39+',
      safari: '10.1+',
      edge: '14+',
      support: 'full'
    },
    {
      category: 'api',
      name: 'WebSockets',
      chrome: '16+',
      firefox: '11+',
      safari: '7+',
      edge: '12+',
      support: 'full'
    },
    {
      category: 'api',
      name: 'Service Workers',
      chrome: '40+',
      firefox: '44+',
      safari: '11.1+',
      edge: '17+',
      support: 'full'
    },
    {
      category: 'api',
      name: 'Web Components',
      chrome: '54+',
      firefox: '63+',
      safari: '10.1+',
      edge: '79+',
      support: 'full'
    },
    {
      category: 'css',
      name: 'Backdrop Filter',
      chrome: '76+',
      firefox: '103+',
      safari: '9+',
      edge: '79+',
      support: 'full'
    },
    {
      category: 'js',
      name: 'BigInt',
      chrome: '67+',
      firefox: '68+',
      safari: '14+',
      edge: '79+',
      support: 'full'
    },
    {
      category: 'api',
      name: 'WebRTC',
      chrome: '23+',
      firefox: '22+',
      safari: '11+',
      edge: '12+',
      support: 'partial'
    },
    {
      category: 'css',
      name: 'Subgrid',
      chrome: '117+',
      firefox: '71+',
      safari: '16+',
      edge: '117+',
      support: 'partial'
    }
  ]

  const categories = [
    { value: 'all', label: 'All Features' },
    { value: 'css', label: 'CSS' },
    { value: 'js', label: 'JavaScript' },
    { value: 'html', label: 'HTML' },
    { value: 'api', label: 'Web APIs' }
  ]

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getSupportBadgeClass = (support) => {
    return support === 'full' ? 'support-full' : 'support-partial'
  }

  return (
    <div className="browser-compatibility-checker">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="checker-container">
        <h1>Browser Compatibility Checker</h1>
        <p className="subtitle">Check browser support for modern CSS, JavaScript, HTML, and Web API features</p>

        <div className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={selectedCategory === cat.value ? 'active' : ''}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="features-table">
          <div className="table-header">
            <div className="header-cell feature-name">Feature</div>
            <div className="header-cell">Chrome</div>
            <div className="header-cell">Firefox</div>
            <div className="header-cell">Safari</div>
            <div className="header-cell">Edge</div>
            <div className="header-cell">Support</div>
          </div>

          {filteredFeatures.map((feature, index) => (
            <div key={index} className="table-row">
              <div className="table-cell feature-name">
                <strong>{feature.name}</strong>
                <span className="category-tag">{feature.category.toUpperCase()}</span>
              </div>
              <div className="table-cell browser-version chrome">{feature.chrome}</div>
              <div className="table-cell browser-version firefox">{feature.firefox}</div>
              <div className="table-cell browser-version safari">{feature.safari}</div>
              <div className="table-cell browser-version edge">{feature.edge}</div>
              <div className="table-cell">
                <span className={`support-badge ${getSupportBadgeClass(feature.support)}`}>
                  {feature.support}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="no-results">
            <p>No features found matching your search.</p>
          </div>
        )}

        <div className="info-section">
          <h3>About Browser Support</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>✓ Full Support</h4>
              <p>Feature is fully implemented and works consistently across the browser</p>
            </div>
            <div className="info-card">
              <h4>~ Partial Support</h4>
              <p>Feature works but may have limitations or require vendor prefixes</p>
            </div>
            <div className="info-card">
              <h4>📊 Version Numbers</h4>
              <p>Minimum browser version required for feature support</p>
            </div>
            <div className="info-card">
              <h4>💡 Pro Tip</h4>
              <p>Always test features in target browsers and use polyfills when needed</p>
            </div>
          </div>

          <div className="resources">
            <h4>Useful Resources</h4>
            <ul>
              <li><strong>Can I Use:</strong> Detailed compatibility tables for all web features</li>
              <li><strong>MDN Web Docs:</strong> Comprehensive documentation with browser compatibility</li>
              <li><strong>Autoprefixer:</strong> Automatically add vendor prefixes to CSS</li>
              <li><strong>Babel:</strong> Transpile modern JavaScript for older browsers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrowserCompatibilityChecker
