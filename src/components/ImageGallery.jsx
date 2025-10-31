import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ImageGallery.css'

const ImageGallery = () => {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [filter, setFilter] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageTitle, setImageTitle] = useState('')
  const [imageCategory, setImageCategory] = useState('nature')

  const categories = ['nature', 'urban', 'people', 'animals', 'food', 'architecture', 'abstract', 'travel']

  useEffect(() => {
    const saved = localStorage.getItem('gmax_image_gallery')
    if (saved) {
      setImages(JSON.parse(saved))
    } else {
      // Add some sample images
      const sampleImages = [
        { id: 1, url: '🏔️', title: 'Mountain Landscape', category: 'nature', likes: 0, addedAt: new Date().toISOString() },
        { id: 2, url: '🌆', title: 'City Skyline', category: 'urban', likes: 0, addedAt: new Date().toISOString() },
        { id: 3, url: '🦁', title: 'Wildlife', category: 'animals', likes: 0, addedAt: new Date().toISOString() },
        { id: 4, url: '🍕', title: 'Delicious Food', category: 'food', likes: 0, addedAt: new Date().toISOString() },
        { id: 5, url: '🏛️', title: 'Historic Building', category: 'architecture', likes: 0, addedAt: new Date().toISOString() },
        { id: 6, url: '✈️', title: 'Travel Adventure', category: 'travel', likes: 0, addedAt: new Date().toISOString() }
      ]
      setImages(sampleImages)
      localStorage.setItem('gmax_image_gallery', JSON.stringify(sampleImages))
    }
  }, [])

  const addImage = (e) => {
    e.preventDefault()
    if (imageUrl.trim() && imageTitle.trim()) {
      const image = {
        id: Date.now(),
        url: imageUrl,
        title: imageTitle,
        category: imageCategory,
        likes: 0,
        addedAt: new Date().toISOString()
      }
      const updated = [image, ...images]
      setImages(updated)
      localStorage.setItem('gmax_image_gallery', JSON.stringify(updated))
      
      setImageUrl('')
      setImageTitle('')
      setImageCategory('nature')
      setShowAddForm(false)
    }
  }

  const deleteImage = (id) => {
    const updated = images.filter(img => img.id !== id)
    setImages(updated)
    localStorage.setItem('gmax_image_gallery', JSON.stringify(updated))
  }

  const likeImage = (id) => {
    const updated = images.map(img =>
      img.id === id ? { ...img, likes: img.likes + 1 } : img
    )
    setImages(updated)
    localStorage.setItem('gmax_image_gallery', JSON.stringify(updated))
  }

  const openLightbox = (image) => {
    setLightboxImage(image)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const nextImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id)
    const nextIndex = (currentIndex + 1) % filteredImages.length
    setLightboxImage(filteredImages[nextIndex])
  }

  const previousImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id)
    const prevIndex = currentIndex - 1 < 0 ? filteredImages.length - 1 : currentIndex - 1
    setLightboxImage(filteredImages[prevIndex])
  }

  const filteredImages = filter === 'all'
    ? images
    : images.filter(img => img.category === filter)

  const getCategoryIcon = (cat) => {
    const icons = {
      nature: '🌿',
      urban: '🏙️',
      people: '👥',
      animals: '🐾',
      food: '🍽️',
      architecture: '🏛️',
      abstract: '🎨',
      travel: '✈️'
    }
    return icons[cat] || '📷'
  }

  return (
    <div className="image-gallery-container">
      <div className="gallery-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📸 Image Gallery</h1>
        <button className="add-image-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+ Add Image'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-image-form">
          <h2>Add New Image</h2>
          <form onSubmit={addImage}>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Image URL or emoji..."
              required
            />
            <input
              type="text"
              value={imageTitle}
              onChange={e => setImageTitle(e.target.value)}
              placeholder="Image title..."
              required
            />
            <select value={imageCategory} onChange={e => setImageCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">Add Image</button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({images.length})
        </button>
        {categories.map(cat => {
          const count = images.filter(img => img.category === cat).length
          return (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
            </button>
          )
        })}
      </div>

      <div className="images-grid">
        {filteredImages.map(image => (
          <div key={image.id} className="image-card">
            <div className="image-wrapper" onClick={() => openLightbox(image)}>
              <div className="image-content">{image.url}</div>
              <div className="image-overlay">
                <span className="view-icon">👁️ View</span>
              </div>
            </div>
            <div className="image-info">
              <h3>{image.title}</h3>
              <div className="image-meta">
                <span className="category-badge">
                  {getCategoryIcon(image.category)} {image.category}
                </span>
                <button className="like-btn" onClick={() => likeImage(image.id)}>
                  ❤️ {image.likes}
                </button>
                <button className="delete-btn" onClick={() => deleteImage(image.id)}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="empty-gallery">
          <p>No images found</p>
        </div>
      )}

      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); previousImage(); }}>
            ‹
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image">{lightboxImage.url}</div>
            <div className="lightbox-info">
              <h2>{lightboxImage.title}</h2>
              <div className="lightbox-meta">
                <span className="category-badge">
                  {getCategoryIcon(lightboxImage.category)} {lightboxImage.category}
                </span>
                <button className="like-btn" onClick={() => likeImage(lightboxImage.id)}>
                  ❤️ {lightboxImage.likes}
                </button>
              </div>
            </div>
          </div>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
