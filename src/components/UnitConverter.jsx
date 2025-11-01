import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/UnitConverter.css'

const UnitConverter = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('meter')
  const [toUnit, setToUnit] = useState('kilometer')
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState(null)

  const conversions = {
    length: {
      name: 'Length',
      icon: '📏',
      units: {
        meter: { name: 'Meter', symbol: 'm', toBase: 1 },
        kilometer: { name: 'Kilometer', symbol: 'km', toBase: 1000 },
        centimeter: { name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
        millimeter: { name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
        mile: { name: 'Mile', symbol: 'mi', toBase: 1609.34 },
        yard: { name: 'Yard', symbol: 'yd', toBase: 0.9144 },
        foot: { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
        inch: { name: 'Inch', symbol: 'in', toBase: 0.0254 }
      }
    },
    weight: {
      name: 'Weight',
      icon: '⚖️',
      units: {
        kilogram: { name: 'Kilogram', symbol: 'kg', toBase: 1 },
        gram: { name: 'Gram', symbol: 'g', toBase: 0.001 },
        milligram: { name: 'Milligram', symbol: 'mg', toBase: 0.000001 },
        ton: { name: 'Metric Ton', symbol: 't', toBase: 1000 },
        pound: { name: 'Pound', symbol: 'lb', toBase: 0.453592 },
        ounce: { name: 'Ounce', symbol: 'oz', toBase: 0.0283495 }
      }
    },
    temperature: {
      name: 'Temperature',
      icon: '🌡️',
      units: {
        celsius: { name: 'Celsius', symbol: '°C' },
        fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
        kelvin: { name: 'Kelvin', symbol: 'K' }
      }
    },
    volume: {
      name: 'Volume',
      icon: '🧪',
      units: {
        liter: { name: 'Liter', symbol: 'L', toBase: 1 },
        milliliter: { name: 'Milliliter', symbol: 'mL', toBase: 0.001 },
        gallon: { name: 'Gallon (US)', symbol: 'gal', toBase: 3.78541 },
        quart: { name: 'Quart', symbol: 'qt', toBase: 0.946353 },
        pint: { name: 'Pint', symbol: 'pt', toBase: 0.473176 },
        cup: { name: 'Cup', symbol: 'cup', toBase: 0.236588 },
        tablespoon: { name: 'Tablespoon', symbol: 'tbsp', toBase: 0.0147868 },
        teaspoon: { name: 'Teaspoon', symbol: 'tsp', toBase: 0.00492892 }
      }
    },
    time: {
      name: 'Time',
      icon: '⏰',
      units: {
        second: { name: 'Second', symbol: 's', toBase: 1 },
        minute: { name: 'Minute', symbol: 'min', toBase: 60 },
        hour: { name: 'Hour', symbol: 'h', toBase: 3600 },
        day: { name: 'Day', symbol: 'd', toBase: 86400 },
        week: { name: 'Week', symbol: 'wk', toBase: 604800 },
        month: { name: 'Month', symbol: 'mo', toBase: 2592000 },
        year: { name: 'Year', symbol: 'yr', toBase: 31536000 }
      }
    }
  }

  const convertTemperature = (value, from, to) => {
    let celsius
    
    // Convert to Celsius first
    if (from === 'celsius') celsius = value
    else if (from === 'fahrenheit') celsius = (value - 32) * 5/9
    else if (from === 'kelvin') celsius = value - 273.15
    
    // Convert from Celsius to target
    if (to === 'celsius') return celsius
    if (to === 'fahrenheit') return (celsius * 9/5) + 32
    if (to === 'kelvin') return celsius + 273.15
  }

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setResult('Please enter a valid number')
      return
    }

    if (category === 'temperature') {
      const converted = convertTemperature(value, fromUnit, toUnit)
      setResult(converted.toFixed(2))
    } else {
      const fromUnitData = conversions[category].units[fromUnit]
      const toUnitData = conversions[category].units[toUnit]
      
      const baseValue = value * fromUnitData.toBase
      const converted = baseValue / toUnitData.toBase
      
      setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
    }
  }

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    const firstUnit = Object.keys(conversions[newCategory].units)[0]
    const secondUnit = Object.keys(conversions[newCategory].units)[1]
    setFromUnit(firstUnit)
    setToUnit(secondUnit)
    setInputValue('')
    setResult(null)
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (result) {
      setInputValue(result)
      setResult(inputValue)
    }
  }

  const currentUnits = conversions[category].units

  return (
    <div className="unit-converter-container">
      <div className="converter-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🔄 Unit Converter</h1>
      </div>

      <div className="category-selector">
        {Object.entries(conversions).map(([key, cat]) => (
          <button
            key={key}
            className={`category-btn ${category === key ? 'active' : ''}`}
            onClick={() => handleCategoryChange(key)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="converter-card">
        <div className="conversion-section">
          <div className="input-block">
            <label>From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="unit-select"
            >
              {Object.entries(currentUnits).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && convert()}
              placeholder="Enter value"
              className="value-input"
            />
          </div>

          <button onClick={swapUnits} className="swap-btn">
            🔄
          </button>

          <div className="input-block">
            <label>To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="unit-select"
            >
              {Object.entries(currentUnits).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
            <div className="result-display">
              {result !== null ? (
                <>
                  <span className="result-value">{result}</span>
                  <span className="result-unit">{currentUnits[toUnit].symbol}</span>
                </>
              ) : (
                <span className="placeholder">Result will appear here</span>
              )}
            </div>
          </div>
        </div>

        <button onClick={convert} className="convert-btn">
          Convert
        </button>

        {result !== null && typeof result === 'number' && (
          <div className="conversion-formula">
            <strong>Formula:</strong> {inputValue} {currentUnits[fromUnit].symbol} = {result} {currentUnits[toUnit].symbol}
          </div>
        )}
      </div>

      <div className="quick-conversions">
        <h3>📊 Quick Reference</h3>
        <div className="quick-grid">
          {category === 'length' && (
            <>
              <div className="quick-item">1 km = 1000 m</div>
              <div className="quick-item">1 mi = 1.609 km</div>
              <div className="quick-item">1 ft = 12 in</div>
              <div className="quick-item">1 yd = 3 ft</div>
            </>
          )}
          {category === 'weight' && (
            <>
              <div className="quick-item">1 kg = 1000 g</div>
              <div className="quick-item">1 lb = 16 oz</div>
              <div className="quick-item">1 kg ≈ 2.205 lb</div>
              <div className="quick-item">1 ton = 1000 kg</div>
            </>
          )}
          {category === 'temperature' && (
            <>
              <div className="quick-item">0°C = 32°F = 273.15K</div>
              <div className="quick-item">100°C = 212°F = 373.15K</div>
              <div className="quick-item">-40°C = -40°F</div>
              <div className="quick-item">37°C = 98.6°F (body temp)</div>
            </>
          )}
          {category === 'volume' && (
            <>
              <div className="quick-item">1 L = 1000 mL</div>
              <div className="quick-item">1 gal = 4 qt</div>
              <div className="quick-item">1 cup = 16 tbsp</div>
              <div className="quick-item">1 L ≈ 0.264 gal</div>
            </>
          )}
          {category === 'time' && (
            <>
              <div className="quick-item">1 min = 60 s</div>
              <div className="quick-item">1 hr = 60 min</div>
              <div className="quick-item">1 day = 24 hr</div>
              <div className="quick-item">1 wk = 7 days</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UnitConverter
