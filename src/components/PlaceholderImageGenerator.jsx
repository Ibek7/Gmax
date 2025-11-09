import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/PlaceholderImageGenerator.css'

function PlaceholderImageGenerator() {
  const navigate = useNavigate()
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(400)
  const [imageType, setImageType] = useState('picsum')
  const [grayscale, setGrayscale] = useState(false)
  const [blur, setBlur] = useState(0)
  const [customText, setCustomText] = useState('600x400')
  const [bgColor, setBgColor] = useState('cccccc')
  const [textColor, setTextColor] = useState('333333')
  const [generatedUrls, setGeneratedUrls] = useState([])

  const generateImage = () => {
    let url = ''
    
    if (imageType === 'picsum') {
      url = `https://picsum.photos/${width}/${height}`
      if (grayscale) url += '?grayscale'
      if (blur > 0) url += `${grayscale ? '&' : '?'}blur=${blur}`
    } else if (imageType === 'placeholder') {
      url = `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(customText)}`
    } else if (imageType === 'placehold') {
      url = `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(customText)}`
    }

    const newUrl = {
      url,
      width,
      height,
      type: imageType,
      timestamp: Date.now()
    }

    setGeneratedUrls([newUrl, ...generatedUrls.slice(0, 4)])
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  const copyHTML = (url, width, height) => {
    const html = `<img src="${url}" alt="Placeholder" width="${width}" height="${height}" />`
    navigator.clipboard.writeText(html)
    alert('HTML copied to clipboard!')
  }

  const copyMarkdown = (url) => {
    const markdown = `![Placeholder](${url})`
    navigator.clipboard.writeText(markdown)
    alert('Markdown copied to clipboard!')
  }

  const commonSizes = [
    { name: 'Square Small', width: 200, height: 200 },
    { name: 'Square Medium', width: 400, height: 400 },
    { name: 'Square Large', width: 800, height: 800 },
    { name: 'Landscape 16:9', width: 1920, height: 1080 },
    { name: 'Landscape 4:3', width: 1024, height: 768 },
    { name: 'Portrait 9:16', width: 1080, height: 1920 },
    { name: 'Card', width: 600, height: 400 },
    { name: 'Banner', width: 1200, height: 300 },
    { name: 'Social Media', width: 1200, height: 630 },
    { name: 'Avatar', width: 150, height: 150 }
  ]

  const applySize = (size) => {
    setWidth(size.width)
    setHeight(size.height)
    setCustomText(`${size.width}x${size.height}`)
  }

  return (
    <div className="placeholder-image-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>Placeholder Image Generator</h1>
        <p className="subtitle">Generate placeholder images for your designs and mockups</p>

        <div className="controls-section">
          <div className="size-controls">
            <h3>Image Size</h3>
            <div className="dimension-inputs">
              <div className="input-group">
                <label>Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => {
                    setWidth(parseInt(e.target.value) || 0)
                    setCustomText(`${parseInt(e.target.value) || 0}x${height}`)
                  }}
                  min="1"
                  max="5000"
                />
              </div>
              <span className="dimension-separator">×</span>
              <div className="input-group">
                <label>Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(parseInt(e.target.value) || 0)
                    setCustomText(`${width}x${parseInt(e.target.value) || 0}`)
                  }}
                  min="1"
                  max="5000"
                />
              </div>
            </div>

            <div className="common-sizes">
              <h4>Quick Sizes</h4>
              <div className="size-buttons">
                {commonSizes.map((size, index) => (
                  <button
                    key={index}
                    className="size-btn"
                    onClick={() => applySize(size)}
                  >
                    {size.name}<br />
                    <span className="size-dimensions">{size.width}×{size.height}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="type-controls">
            <h3>Image Type</h3>
            <div className="type-options">
              <label className={`type-option ${imageType === 'picsum' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="picsum"
                  checked={imageType === 'picsum'}
                  onChange={(e) => setImageType(e.target.value)}
                />
                <div className="option-content">
                  <strong>Lorem Picsum</strong>
                  <span>Real photos from Unsplash</span>
                </div>
              </label>

              <label className={`type-option ${imageType === 'placeholder' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="placeholder"
                  checked={imageType === 'placeholder'}
                  onChange={(e) => setImageType(e.target.value)}
                />
                <div className="option-content">
                  <strong>Placeholder.com</strong>
                  <span>Customizable solid colors</span>
                </div>
              </label>

              <label className={`type-option ${imageType === 'placehold' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="placehold"
                  checked={imageType === 'placehold'}
                  onChange={(e) => setImageType(e.target.value)}
                />
                <div className="option-content">
                  <strong>Placehold.co</strong>
                  <span>Modern placeholder service</span>
                </div>
              </label>
            </div>

            {imageType === 'picsum' && (
              <div className="picsum-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={grayscale}
                    onChange={(e) => setGrayscale(e.target.checked)}
                  />
                  Grayscale
                </label>

                <div className="blur-control">
                  <label>Blur: {blur}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={blur}
                    onChange={(e) => setBlur(parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}

            {(imageType === 'placeholder' || imageType === 'placehold') && (
              <div className="custom-options">
                <div className="input-group">
                  <label>Custom Text</label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter text"
                  />
                </div>

                <div className="color-inputs">
                  <div className="input-group">
                    <label>Background Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                        placeholder="cccccc"
                      />
                      <input
                        type="color"
                        value={`#${bgColor}`}
                        onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Text Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                        placeholder="333333"
                      />
                      <input
                        type="color"
                        value={`#${textColor}`}
                        onChange={(e) => setTextColor(e.target.value.replace('#', ''))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="generate-btn" onClick={generateImage}>
            Generate Image
          </button>
        </div>

        {generatedUrls.length > 0 && (
          <div className="results-section">
            <h3>Generated Images</h3>
            {generatedUrls.map((item, index) => (
              <div key={item.timestamp} className="image-result">
                <img src={item.url} alt={`Placeholder ${item.width}x${item.height}`} />
                <div className="image-info">
                  <div className="image-details">
                    <strong>{item.width} × {item.height}</strong>
                    <span className="image-type">{item.type}</span>
                  </div>
                  <div className="image-url">
                    <code>{item.url}</code>
                  </div>
                  <div className="image-actions">
                    <button onClick={() => copyUrl(item.url)}>Copy URL</button>
                    <button onClick={() => copyHTML(item.url, item.width, item.height)}>Copy HTML</button>
                    <button onClick={() => copyMarkdown(item.url)}>Copy Markdown</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaceholderImageGenerator
