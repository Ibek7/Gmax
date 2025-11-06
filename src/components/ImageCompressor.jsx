import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ImageCompressor.css'

export default function ImageCompressor() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [quality, setQuality] = useState(0.8)
  const [format, setFormat] = useState('image/jpeg')
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    
    const newImages = imageFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      originalFile: file,
      originalSize: file.size,
      preview: URL.createObjectURL(file),
      compressed: null,
      compressedSize: null,
      status: 'pending'
    }))
    
    setImages(prev => [...prev, ...newImages])
  }

  const compressImage = async (imageData) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob(
          (blob) => {
            resolve({
              ...imageData,
              compressed: blob,
              compressedSize: blob.size,
              status: 'completed'
            })
          },
          format,
          quality
        )
      }
      img.src = imageData.preview
    })
  }

  const compressAll = async () => {
    setProcessing(true)
    const compressed = []
    
    for (const img of images) {
      if (img.status === 'pending') {
        const result = await compressImage(img)
        compressed.push(result)
      } else {
        compressed.push(img)
      }
    }
    
    setImages(compressed)
    setProcessing(false)
  }

  const downloadImage = (imageData) => {
    if (!imageData.compressed) return
    
    const url = URL.createObjectURL(imageData.compressed)
    const a = document.createElement('a')
    const extension = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp'
    a.href = url
    a.download = `compressed_${imageData.name.split('.')[0]}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    images.forEach(img => {
      if (img.compressed) downloadImage(img)
    })
  }

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id))
  }

  const clearAll = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.preview)
    })
    setImages([])
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getSavingsPercent = (original, compressed) => {
    if (!compressed) return 0
    return Math.round(((original - compressed) / original) * 100)
  }

  return (
    <div className="image-compressor-container">
      <div className="compressor-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🖼️ Image Compressor</h1>
      </div>

      <div className="compressor-card">
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button 
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            📁 Select Images
          </button>
          
          <div className="settings-row">
            <div className="setting-group">
              <label>Quality: {Math.round(quality * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
            </div>
            
            <div className="setting-group">
              <label>Output Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
          </div>

          {images.length > 0 && (
            <div className="action-buttons">
              <button 
                className="compress-btn"
                onClick={compressAll}
                disabled={processing}
              >
                {processing ? '⏳ Processing...' : '🔄 Compress All'}
              </button>
              <button 
                className="download-all-btn"
                onClick={downloadAll}
                disabled={!images.some(img => img.compressed)}
              >
                📥 Download All
              </button>
              <button className="clear-btn" onClick={clearAll}>
                🗑️ Clear All
              </button>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="images-grid">
            {images.map(img => (
              <div key={img.id} className="image-item">
                <img src={img.preview} alt={img.name} className="image-preview" />
                <div className="image-info">
                  <div className="image-name">{img.name}</div>
                  <div className="image-sizes">
                    <div>Original: {formatBytes(img.originalSize)}</div>
                    {img.compressedSize && (
                      <>
                        <div>Compressed: {formatBytes(img.compressedSize)}</div>
                        <div className="savings">
                          Saved {getSavingsPercent(img.originalSize, img.compressedSize)}%
                        </div>
                      </>
                    )}
                  </div>
                  <div className="image-actions">
                    {img.compressed && (
                      <button 
                        className="download-btn"
                        onClick={() => downloadImage(img)}
                      >
                        📥 Download
                      </button>
                    )}
                    <button 
                      className="remove-btn"
                      onClick={() => removeImage(img.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="empty-state">
            <p>📸 No images selected</p>
            <p className="empty-hint">Click "Select Images" to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
