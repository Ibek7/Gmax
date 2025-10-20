import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreativeToolbox.css'

const CreativeToolbox = () => {
  const navigate = useNavigate()
  const [activeTool, setActiveTool] = useState('colorPalette')
  const [colorPalette, setColorPalette] = useState([])
  const [nameResult, setNameResult] = useState('')
  const [loremText, setLoremText] = useState('')
  const [diceResult, setDiceResult] = useState(null)

  const tools = [
    { id: 'colorPalette', name: 'Color Palette', icon: '🎨' },
    { id: 'nameGenerator', name: 'Name Generator', icon: '🏷️' },
    { id: 'loremIpsum', name: 'Lorem Ipsum', icon: '📝' },
    { id: 'diceRoller', name: 'Dice Roller', icon: '🎲' },
    { id: 'timer', name: 'Quick Timer', icon: '⏱️' }
  ]

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  }

  const generateColorPalette = () => {
    const palette = Array.from({ length: 5 }, () => generateRandomColor())
    setColorPalette(palette)
  }

  const generateName = (type) => {
    const firstNames = ['Nova', 'Luna', 'Atlas', 'Phoenix', 'Orion', 'Stella', 'Aurora', 'Sage']
    const lastNames = ['Storm', 'Rivers', 'Knight', 'Moon', 'Star', 'Wolf', 'Stone', 'Sky']
    const projectNames = ['Nebula', 'Eclipse', 'Horizon', 'Zenith', 'Odyssey', 'Catalyst', 'Nexus', 'Prism']
    
    if (type === 'character') {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)]
      const last = lastNames[Math.floor(Math.random() * lastNames.length)]
      setNameResult(`${first} ${last}`)
    } else {
      setNameResult(projectNames[Math.floor(Math.random() * projectNames.length)])
    }
  }

  const generateLorem = (paragraphs) => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
    setLoremText(Array.from({ length: paragraphs }, () => lorem).join('\n\n'))
  }

  const rollDice = (sides) => {
    const result = Math.floor(Math.random() * sides) + 1
    setDiceResult({ sides, result })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="creative-toolbox-container">
      <div className="toolbox-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🧰 Creative Toolbox</h1>
      </div>

      <div className="toolbox-layout">
        <div className="tools-sidebar">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-name">{tool.name}</span>
            </button>
          ))}
        </div>

        <div className="tool-content">
          {activeTool === 'colorPalette' && (
            <div className="tool-section">
              <h2>🎨 Color Palette Generator</h2>
              <p>Generate random color palettes for your creative projects</p>
              <button className="generate-btn" onClick={generateColorPalette}>
                Generate Palette
              </button>
              {colorPalette.length > 0 && (
                <div className="color-palette-display">
                  {colorPalette.map((color, i) => (
                    <div key={i} className="color-swatch">
                      <div className="color-box" style={{ background: color }} />
                      <div className="color-code">{color}</div>
                      <button onClick={() => copyToClipboard(color)}>📋 Copy</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTool === 'nameGenerator' && (
            <div className="tool-section">
              <h2>🏷️ Name Generator</h2>
              <p>Generate creative names for characters or projects</p>
              <div className="name-buttons">
                <button onClick={() => generateName('character')}>Character Name</button>
                <button onClick={() => generateName('project')}>Project Name</button>
              </div>
              {nameResult && (
                <div className="name-result">
                  <h3>{nameResult}</h3>
                  <button onClick={() => copyToClipboard(nameResult)}>📋 Copy</button>
                </div>
              )}
            </div>
          )}

          {activeTool === 'loremIpsum' && (
            <div className="tool-section">
              <h2>📝 Lorem Ipsum Generator</h2>
              <p>Generate placeholder text for your designs</p>
              <div className="lorem-buttons">
                <button onClick={() => generateLorem(1)}>1 Paragraph</button>
                <button onClick={() => generateLorem(3)}>3 Paragraphs</button>
                <button onClick={() => generateLorem(5)}>5 Paragraphs</button>
              </div>
              {loremText && (
                <div className="lorem-result">
                  <pre>{loremText}</pre>
                  <button onClick={() => copyToClipboard(loremText)}>📋 Copy All</button>
                </div>
              )}
            </div>
          )}

          {activeTool === 'diceRoller' && (
            <div className="tool-section">
              <h2>🎲 Dice Roller</h2>
              <p>Roll dice for randomization and decision making</p>
              <div className="dice-buttons">
                <button onClick={() => rollDice(6)}>D6</button>
                <button onClick={() => rollDice(10)}>D10</button>
                <button onClick={() => rollDice(20)}>D20</button>
                <button onClick={() => rollDice(100)}>D100</button>
              </div>
              {diceResult && (
                <div className="dice-result">
                  <div className="dice-display">{diceResult.result}</div>
                  <p>Rolled a D{diceResult.sides}</p>
                </div>
              )}
            </div>
          )}

          {activeTool === 'timer' && (
            <div className="tool-section">
              <h2>⏱️ Quick Timer</h2>
              <p>Set quick timers for focused work sessions</p>
              <div className="timer-presets">
                <button onClick={() => alert('Timer: 5 minutes started!')}>5 min</button>
                <button onClick={() => alert('Timer: 15 minutes started!')}>15 min</button>
                <button onClick={() => alert('Timer: 25 min (Pomodoro)')}>25 min</button>
                <button onClick={() => alert('Timer: 30 minutes started!')}>30 min</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreativeToolbox
