import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ImageMetadataExtractor.css'

function ImageMetadataExtractor() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [exifData, setExifData] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file')
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
      
      // Load image to get dimensions
      const img = new Image()
      img.onload = () => {
        const basicMetadata = {
          filename: file.name,
          filesize: formatFileSize(file.size),
          filetype: file.type,
          width: img.width,
          height: img.height,
          aspectRatio: (img.width / img.height).toFixed(2),
          lastModified: new Date(file.lastModified).toLocaleString(),
          megapixels: ((img.width * img.height) / 1000000).toFixed(2)
        }
        setMetadata(basicMetadata)
        
        // Try to extract EXIF data
        extractEXIF(e.target.result)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const extractEXIF = (dataUrl) => {
    // Basic EXIF extraction (limited without external library)
    // This is a simplified version - real EXIF extraction requires libraries like exif-js
    const base64 = dataUrl.split(',')[1]
    const binary = atob(base64)
    
    // Check for JPEG EXIF marker (0xFFE1)
    let exifInfo = {
      hasEXIF: false,
      note: 'Advanced EXIF data extraction requires additional libraries. Basic metadata shown above.'
    }

    // Check if it's a JPEG with EXIF
    if (binary.charCodeAt(0) === 0xFF && binary.charCodeAt(1) === 0xD8) {
      // Look for EXIF marker
      for (let i = 2; i < binary.length - 1; i++) {
        if (binary.charCodeAt(i) === 0xFF && binary.charCodeAt(i + 1) === 0xE1) {
          exifInfo.hasEXIF = true
          exifInfo.note = 'EXIF data detected in image. Install exif-js library for detailed camera information.'
          break
        }
      }
    }

    setExifData(exifInfo)
  }

  const copyMetadata = () => {
    const text = JSON.stringify(metadata, null, 2)
    navigator.clipboard.writeText(text)
    alert('Metadata copied to clipboard!')
  }

  const downloadMetadata = () => {
    const data = {
      ...metadata,
      exif: exifData
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${metadata.filename}_metadata.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setMetadata(null)
    setExifData(null)
  }

  return (
    <div className="image-metadata-extractor">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="extractor-container">
        <h1>Image Metadata Extractor</h1>
        <p className="subtitle">Extract detailed information and metadata from image files</p>

        <div className="upload-section">
          <label className="upload-box">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div className="upload-content">
              <span className="upload-icon">📁</span>
              <p>Click to upload an image</p>
              <p className="upload-hint">Supports JPG, PNG, GIF, WebP, and more</p>
            </div>
          </label>
        </div>

        {imagePreview && (
          <div className="preview-section">
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
            <button className="clear-btn" onClick={clearImage}>
              Clear Image
            </button>
          </div>
        )}

        {metadata && (
          <div className="metadata-section">
            <div className="section-header">
              <h3>File Information</h3>
              <div className="action-buttons">
                <button className="copy-btn" onClick={copyMetadata}>
                  📋 Copy
                </button>
                <button className="download-btn" onClick={downloadMetadata}>
                  💾 Download JSON
                </button>
              </div>
            </div>

            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="label">Filename:</span>
                <span className="value">{metadata.filename}</span>
              </div>
              <div className="metadata-item">
                <span className="label">File Size:</span>
                <span className="value">{metadata.filesize}</span>
              </div>
              <div className="metadata-item">
                <span className="label">File Type:</span>
                <span className="value">{metadata.filetype}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Dimensions:</span>
                <span className="value">{metadata.width} × {metadata.height} px</span>
              </div>
              <div className="metadata-item">
                <span className="label">Aspect Ratio:</span>
                <span className="value">{metadata.aspectRatio}:1</span>
              </div>
              <div className="metadata-item">
                <span className="label">Megapixels:</span>
                <span className="value">{metadata.megapixels} MP</span>
              </div>
              <div className="metadata-item">
                <span className="label">Last Modified:</span>
                <span className="value">{metadata.lastModified}</span>
              </div>
            </div>
          </div>
        )}

        {exifData && (
          <div className="exif-section">
            <h3>EXIF Information</h3>
            <div className={`exif-status ${exifData.hasEXIF ? 'has-exif' : 'no-exif'}`}>
              <span className="status-icon">{exifData.hasEXIF ? '✓' : 'ⓘ'}</span>
              <p>{exifData.note}</p>
            </div>
            {exifData.hasEXIF && (
              <div className="exif-note">
                <p>
                  <strong>Note:</strong> This tool shows basic file metadata. For detailed EXIF data including
                  camera settings, GPS coordinates, and shooting parameters, consider using a dedicated EXIF
                  reader or installing the exif-js library.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="info-section">
          <h3>About Image Metadata</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>📊 File Properties</h4>
              <p>Basic information like filename, size, type, and modification date</p>
            </div>
            <div className="info-card">
              <h4>📐 Dimensions</h4>
              <p>Width, height, aspect ratio, and total megapixels</p>
            </div>
            <div className="info-card">
              <h4>📷 EXIF Data</h4>
              <p>Camera settings, GPS location, and shooting parameters (when available)</p>
            </div>
            <div className="info-card">
              <h4>💾 Export Options</h4>
              <p>Copy metadata to clipboard or download as JSON file</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageMetadataExtractor
