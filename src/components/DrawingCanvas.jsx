import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DrawingCanvas.css'

const DrawingCanvas = () => {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState('pen') // pen, eraser
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [backgroundColor])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.strokeStyle = tool === 'eraser' ? backgroundColor : currentColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `drawing-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const fillBackground = (color) => {
    setBackgroundColor(color)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Save current drawing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Fill background
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Restore drawing
    ctx.putImageData(imageData, 0, 0)
  }

  return (
    <div className="drawing-canvas-container">
      <div className="canvas-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎨 Drawing Canvas</h1>
      </div>

      <div className="canvas-main">
        <div className="canvas-tools">
          <div className="tool-section">
            <h3>🛠️ Tools</h3>
            <div className="tool-buttons">
              <button
                className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
                onClick={() => setTool('pen')}
              >
                ✏️ Pen
              </button>
              <button
                className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                onClick={() => setTool('eraser')}
              >
                🧹 Eraser
              </button>
            </div>
          </div>

          <div className="tool-section">
            <h3>🎨 Colors</h3>
            <div className="color-palette">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${currentColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
            <div className="custom-color-picker">
              <label>Custom Color:</label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="color-input"
              />
            </div>
          </div>

          <div className="tool-section">
            <h3>📏 Brush Size</h3>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-slider"
            />
            <span className="brush-size-label">{brushSize}px</span>
            <div className="brush-preview">
              <div
                className="brush-dot"
                style={{
                  width: brushSize + 'px',
                  height: brushSize + 'px',
                  backgroundColor: currentColor
                }}
              />
            </div>
          </div>

          <div className="tool-section">
            <h3>🖼️ Background</h3>
            <div className="background-buttons">
              <button onClick={() => fillBackground('#ffffff')} className="bg-btn white">
                White
              </button>
              <button onClick={() => fillBackground('#000000')} className="bg-btn black">
                Black
              </button>
              <button onClick={() => fillBackground('#f0f0f0')} className="bg-btn gray">
                Gray
              </button>
            </div>
          </div>

          <div className="tool-section">
            <h3>💾 Actions</h3>
            <button onClick={clearCanvas} className="action-btn clear">
              🗑️ Clear Canvas
            </button>
            <button onClick={saveDrawing} className="action-btn save">
              💾 Save Image
            </button>
          </div>
        </div>

        <div className="canvas-area">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="drawing-canvas"
          />
        </div>
      </div>

      <div className="canvas-info">
        <h3>ℹ️ How to Use</h3>
        <ul>
          <li>Select a tool (Pen or Eraser) from the tools section</li>
          <li>Choose a color from the palette or use the color picker</li>
          <li>Adjust the brush size with the slider</li>
          <li>Click and drag on the canvas to draw</li>
          <li>Change the background color or clear the canvas</li>
          <li>Save your artwork as a PNG image</li>
        </ul>
      </div>
    </div>
  )
}

export default DrawingCanvas
