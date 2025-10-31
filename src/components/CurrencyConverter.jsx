import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CurrencyConverter.css'

const CurrencyConverter = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState(0)
  const [rates, setRates] = useState({})
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])

  const currencies = {
    USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
    GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    CHF: { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    MXN: { name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
    ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
    KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' }
  }

  useEffect(() => {
    // Simulated exchange rates (in production, use real API)
    const mockRates = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.50,
      CNY: 7.24,
      INR: 83.12,
      CAD: 1.36,
      AUD: 1.53,
      CHF: 0.88,
      BRL: 4.97,
      MXN: 17.08,
      ZAR: 18.75,
      SGD: 1.34,
      NZD: 1.63,
      KRW: 1320.50
    }
    setRates(mockRates)

    const savedFavorites = localStorage.getItem('gmax_favorite_conversions')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))

    const savedHistory = localStorage.getItem('gmax_conversion_history')
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  useEffect(() => {
    convertCurrency()
  }, [amount, fromCurrency, toCurrency, rates])

  const convertCurrency = () => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      const fromRate = rates[fromCurrency]
      const toRate = rates[toCurrency]
      const converted = (amount / fromRate) * toRate
      setResult(converted.toFixed(2))
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const addToFavorites = () => {
    const fav = { from: fromCurrency, to: toCurrency }
    if (!favorites.some(f => f.from === fromCurrency && f.to === toCurrency)) {
      const updated = [...favorites, fav]
      setFavorites(updated)
      localStorage.setItem('gmax_favorite_conversions', JSON.stringify(updated))
    }
  }

  const removeFavorite = (index) => {
    const updated = favorites.filter((_, i) => i !== index)
    setFavorites(updated)
    localStorage.setItem('gmax_favorite_conversions', JSON.stringify(updated))
  }

  const loadFavorite = (fav) => {
    setFromCurrency(fav.from)
    setToCurrency(fav.to)
  }

  const saveToHistory = () => {
    const entry = {
      amount,
      from: fromCurrency,
      to: toCurrency,
      result,
      timestamp: new Date().toISOString()
    }
    const updated = [entry, ...history.slice(0, 9)]
    setHistory(updated)
    localStorage.setItem('gmax_conversion_history', JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('gmax_conversion_history')
  }

  return (
    <div className="currency-converter-container">
      <div className="currency-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💱 Currency Converter</h1>
      </div>

      <div className="converter-card">
        <div className="conversion-section">
          <div className="currency-input-group">
            <label>From</label>
            <div className="input-row">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="amount-input"
                min="0"
                step="0.01"
              />
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value)}
                className="currency-select"
              >
                {Object.entries(currencies).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.flag} {code}
                  </option>
                ))}
              </select>
            </div>
            <span className="currency-name">{currencies[fromCurrency].name}</span>
          </div>

          <button className="swap-btn" onClick={swapCurrencies}>
            ⇄
          </button>

          <div className="currency-input-group">
            <label>To</label>
            <div className="input-row">
              <input
                type="text"
                value={result}
                readOnly
                className="amount-input result-input"
              />
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="currency-select"
              >
                {Object.entries(currencies).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.flag} {code}
                  </option>
                ))}
              </select>
            </div>
            <span className="currency-name">{currencies[toCurrency].name}</span>
          </div>
        </div>

        <div className="conversion-rate">
          1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
        </div>

        <div className="converter-actions">
          <button className="favorite-btn" onClick={addToFavorites}>
            ⭐ Save as Favorite
          </button>
          <button className="history-btn" onClick={saveToHistory}>
            📝 Save to History
          </button>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h2>⭐ Favorite Conversions</h2>
          <div className="favorites-grid">
            {favorites.map((fav, idx) => (
              <div key={idx} className="favorite-card">
                <button onClick={() => loadFavorite(fav)} className="fav-load-btn">
                  <span className="fav-currencies">
                    {currencies[fav.from].flag} {fav.from} → {currencies[fav.to].flag} {fav.to}
                  </span>
                </button>
                <button onClick={() => removeFavorite(idx)} className="fav-remove-btn">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <div className="history-header">
            <h2>📜 Conversion History</h2>
            <button className="clear-history-btn" onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <div className="history-list">
            {history.map((entry, idx) => (
              <div key={idx} className="history-item">
                <div className="history-conversion">
                  <span className="history-amount">
                    {currencies[entry.from].flag} {entry.amount} {entry.from}
                  </span>
                  <span className="history-arrow">→</span>
                  <span className="history-result">
                    {currencies[entry.to].flag} {entry.result} {entry.to}
                  </span>
                </div>
                <span className="history-time">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="popular-rates">
        <h2>📊 Popular Exchange Rates</h2>
        <div className="rates-grid">
          {['EUR', 'GBP', 'JPY', 'CNY', 'INR', 'CAD'].map(currency => (
            <div key={currency} className="rate-card">
              <div className="rate-header">
                <span className="rate-flag">{currencies[currency].flag}</span>
                <span className="rate-code">{currency}</span>
              </div>
              <div className="rate-value">
                1 USD = {rates[currency]?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CurrencyConverter
