import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ImageToBase64.css'

function ImageToBase64() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('encode') // 'encode' or 'decode'
  const [base64String, setBase64String] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageInfo, setImageInfo] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target.result
      setBase64String(result)
      setImagePreview(result)
      
      // Get image dimensions and size
      const img = new Image()
      img.onload = () => {
        setImageInfo({
          width: img.width,
          height: img.height,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type,
          name: file.name,
          base64Size: (result.length / 1024).toFixed(2) + ' KB'
        })
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const handleBase64Input = (value) => {
    setBase64String(value)
    
    // Try to preview if it's a valid data URL
    if (value.startsWith('data:image')) {
      setImagePreview(value)
      
      const img = new Image()
      img.onload = () => {
        const mimeMatch = value.match(/data:(image\/[^;]+)/)
        setImageInfo({
          width: img.width,
          height: img.height,
          type: mimeMatch ? mimeMatch[1] : 'unknown',
          base64Size: (value.length / 1024).toFixed(2) + ' KB'
        })
      }
      img.onerror = () => {
        setImagePreview(null)
        setImageInfo(null)
      }
      img.src = value
    } else {
      setImagePreview(null)
      setImageInfo(null)
    }
  }

  const copyToClipboard = () => {
    if (!base64String) {
      alert('No Base64 string to copy')
      return
    }
    navigator.clipboard.writeText(base64String)
    alert('Base64 string copied to clipboard!')
  }

  const copyDataURL = () => {
    if (!base64String) {
      alert('No data URL to copy')
      return
    }
    navigator.clipboard.writeText(base64String)
    alert('Data URL copied to clipboard!')
  }

  const copyBase64Only = () => {
    if (!base64String) {
      alert('No Base64 string to copy')
      return
    }
    const base64Only = base64String.replace(/^data:image\/[^;]+;base64,/, '')
    navigator.clipboard.writeText(base64Only)
    alert('Base64 string (without prefix) copied to clipboard!')
  }

  const downloadImage = () => {
    if (!imagePreview) {
      alert('No image to download')
      return
    }

    const link = document.createElement('a')
    link.href = imagePreview
    link.download = `image-${Date.now()}.png`
    link.click()
  }

  const clearAll = () => {
    setBase64String('')
    setImagePreview(null)
    setImageInfo(null)
  }

  return (
    <div className="image-to-base64">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="base64-container">
        <h1>Image to Base64 Converter</h1>
        <p className="subtitle">Convert images to Base64 strings and vice versa</p>

        <div className="mode-selector">
          <button
            className={mode === 'encode' ? 'active' : ''}
            onClick={() => setMode('encode')}
          >
            🖼️ Image → Base64
          </button>
          <button
            className={mode === 'decode' ? 'active' : ''}
            onClick={() => setMode('decode')}
          >
            📝 Base64 → Image
          </button>
        </div>

        {mode === 'encode' ? (
          <div className="encode-section">
            <div className="upload-area">
              <label htmlFor="file-upload" className="upload-label">
                <div className="upload-content">
                  <span className="upload-icon">📁</span>
                  <span className="upload-text">Click to upload an image</span>
                  <span className="upload-hint">Supports: JPG, PNG, GIF, WEBP, SVG</span>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {imagePreview && (
              <>
                <div className="preview-section">
                  <h3>Image Preview</h3>
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                  
                  {imageInfo && (
                    <div className="image-info">
                      <div className="info-item">
                        <strong>File:</strong> {imageInfo.name}
                      </div>
                      <div className="info-item">
                        <strong>Dimensions:</strong> {imageInfo.width} × {imageInfo.height} px
                      </div>
                      <div className="info-item">
                        <strong>Type:</strong> {imageInfo.type}
                      </div>
                      <div className="info-item">
                        <strong>Original Size:</strong> {imageInfo.size}
                      </div>
                      <div className="info-item">
                        <strong>Base64 Size:</strong> {imageInfo.base64Size}
                      </div>
                    </div>
                  )}
                </div>

                <div className="output-section">
                  <div className="output-header">
                    <h3>Base64 Output</h3>
                    <div className="output-actions">
                      <button onClick={copyDataURL} className="action-btn">
                        📋 Copy Data URL
                      </button>
                      <button onClick={copyBase64Only} className="action-btn">
                        📋 Copy Base64 Only
                      </button>
                      <button onClick={clearAll} className="action-btn clear-btn">
                        🗑️ Clear
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={base64String}
                    readOnly
                    rows={10}
                    className="output-textarea"
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="decode-section">
            <div className="input-section">
              <label>Base64 String (with or without data URL prefix)</label>
              <textarea
                value={base64String}
                onChange={(e) => handleBase64Input(e.target.value)}
                placeholder="Paste Base64 string here... (e.g., data:image/png;base64,iVBORw0KG...)"
                rows={10}
              />
            </div>

            {imagePreview && (
              <>
                <div className="preview-section">
                  <h3>Decoded Image</h3>
                  <img src={imagePreview} alt="Decoded" className="preview-image" />
                  
                  {imageInfo && (
                    <div className="image-info">
                      <div className="info-item">
                        <strong>Dimensions:</strong> {imageInfo.width} × {imageInfo.height} px
                      </div>
                      <div className="info-item">
                        <strong>Type:</strong> {imageInfo.type}
                      </div>
                      <div className="info-item">
                        <strong>Base64 Size:</strong> {imageInfo.base64Size}
                      </div>
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  <button onClick={downloadImage} className="action-btn">
                    💾 Download Image
                  </button>
                  <button onClick={clearAll} className="action-btn clear-btn">
                    🗑️ Clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="info-section">
          <h3>Use Cases</h3>
          <div className="use-cases-grid">
            <div className="use-case-item">
              <h4>📧 Email Templates</h4>
              <p>Embed images directly in HTML emails without external hosting</p>
            </div>
            <div className="use-case-item">
              <h4>🎨 CSS Background</h4>
              <p>Use Base64 images as CSS backgrounds for faster loading</p>
            </div>
            <div className="use-case-item">
              <h4>📄 Data Storage</h4>
              <p>Store images in JSON/databases without separate file storage</p>
            </div>
            <div className="use-case-item">
              <h4>⚡ Performance</h4>
              <p>Reduce HTTP requests by embedding small images inline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageToBase64
