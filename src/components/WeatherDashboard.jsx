import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/WeatherDashboard.css'

const WeatherDashboard = () => {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState('metric') // metric = Celsius, imperial = Fahrenheit
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('gmax_favorite_cities')
    if (saved) setFavorites(JSON.parse(saved))
    
    // Load default city weather
    loadWeather('New York')
  }, [])

  const loadWeather = async (cityName) => {
    setLoading(true)
    setError('')
    
    try {
      // Simulated weather data (in production, use real weather API)
      const mockWeather = {
        city: cityName,
        country: 'US',
        temp: Math.floor(Math.random() * 30) + 10,
        feelsLike: Math.floor(Math.random() * 30) + 10,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
        description: ['Clear Sky', 'Partly Cloudy', 'Rainy', 'Sunny', 'Cloudy'][Math.floor(Math.random() * 5)],
        icon: ['☀️', '⛅', '🌧️', '☁️', '⛈️'][Math.floor(Math.random() * 5)],
        sunrise: '06:30 AM',
        sunset: '06:45 PM'
      }

      const mockForecast = Array.from({ length: 5 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i],
        temp: Math.floor(Math.random() * 30) + 10,
        icon: ['☀️', '⛅', '🌧️', '☁️', '⛈️'][Math.floor(Math.random() * 5)],
        description: ['Clear', 'Cloudy', 'Rain', 'Sunny', 'Storm'][Math.floor(Math.random() * 5)]
      }))

      setWeather(mockWeather)
      setForecast(mockForecast)
    } catch (err) {
      setError('City not found. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (city.trim()) {
      loadWeather(city)
      setCity('')
    }
  }

  const addToFavorites = () => {
    if (weather && !favorites.includes(weather.city)) {
      const updated = [...favorites, weather.city]
      setFavorites(updated)
      localStorage.setItem('gmax_favorite_cities', JSON.stringify(updated))
    }
  }

  const removeFavorite = (cityName) => {
    const updated = favorites.filter(c => c !== cityName)
    setFavorites(updated)
    localStorage.setItem('gmax_favorite_cities', JSON.stringify(updated))
  }

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric')
  }

  const convertTemp = (temp) => {
    if (unit === 'imperial') {
      return Math.round((temp * 9/5) + 32)
    }
    return temp
  }

  const getWindSpeed = (speed) => {
    if (unit === 'imperial') {
      return `${(speed * 0.621371).toFixed(1)} mph`
    }
    return `${speed} km/h`
  }

  return (
    <div className="weather-container">
      <div className="weather-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🌤️ Weather Dashboard</h1>
        <button className="unit-toggle" onClick={toggleUnit}>
          °{unit === 'metric' ? 'C' : 'F'}
        </button>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Search for a city..."
            className="city-search"
          />
          <button type="submit" className="search-btn">🔍 Search</button>
        </form>
      </div>

      {error && <div className="weather-error">{error}</div>}

      {loading && <div className="weather-loading">Loading weather data...</div>}

      {weather && !loading && (
        <>
          <div className="current-weather">
            <div className="weather-main">
              <div className="weather-icon-large">{weather.icon}</div>
              <div className="weather-temp">
                <span className="temp-value">{convertTemp(weather.temp)}°</span>
                <span className="temp-unit">{unit === 'metric' ? 'C' : 'F'}</span>
              </div>
              <div className="weather-info">
                <h2>{weather.city}, {weather.country}</h2>
                <p className="weather-desc">{weather.description}</p>
                <p className="feels-like">Feels like {convertTemp(weather.feelsLike)}°{unit === 'metric' ? 'C' : 'F'}</p>
              </div>
            </div>

            <button className="favorite-btn" onClick={addToFavorites}>
              {favorites.includes(weather.city) ? '⭐ Favorited' : '☆ Add to Favorites'}
            </button>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{getWindSpeed(weather.windSpeed)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌡️</span>
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌅</span>
                <span className="detail-label">Sunrise</span>
                <span className="detail-value">{weather.sunrise}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌇</span>
                <span className="detail-label">Sunset</span>
                <span className="detail-value">{weather.sunset}</span>
              </div>
            </div>
          </div>

          <div className="forecast-section">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
              {forecast.map((day, idx) => (
                <div key={idx} className="forecast-card">
                  <span className="forecast-day">{day.day}</span>
                  <span className="forecast-icon">{day.icon}</span>
                  <span className="forecast-temp">{convertTemp(day.temp)}°</span>
                  <span className="forecast-desc">{day.description}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h3>⭐ Favorite Cities</h3>
          <div className="favorites-grid">
            {favorites.map((fav, idx) => (
              <div key={idx} className="favorite-item">
                <button onClick={() => loadWeather(fav)} className="fav-city-btn">
                  {fav}
                </button>
                <button onClick={() => removeFavorite(fav)} className="remove-fav">×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherDashboard
