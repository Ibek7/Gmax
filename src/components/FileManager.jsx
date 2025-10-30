import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FileManager.css'

const FileManager = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('document')
  const [fileSize, setFileSize] = useState('')
  const [tags, setTags] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const fileTypes = ['all', 'document', 'image', 'video', 'code', 'spreadsheet']

  useEffect(() => {
    const saved = localStorage.getItem('gmax_file_manager')
    if (saved) {
      setFiles(JSON.parse(saved))
    }
  }, [])

  const addFile = (e) => {
    e.preventDefault()
    if (fileName.trim() && fileSize.trim()) {
      const file = {
        id: Date.now(),
        name: fileName,
        type: fileType,
        size: fileSize,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        uploadedAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        starred: false
      }
      const updated = [...files, file]
      setFiles(updated)
      localStorage.setItem('gmax_file_manager', JSON.stringify(updated))
      setFileName('')
      setFileSize('')
      setTags('')
      setFileType('document')
    }
  }

  const toggleStar = (id) => {
    const updated = files.map(f =>
      f.id === id ? { ...f, starred: !f.starred } : f
    )
    setFiles(updated)
    localStorage.setItem('gmax_file_manager', JSON.stringify(updated))
  }

  const deleteFile = (id) => {
    const updated = files.filter(f => f.id !== id)
    setFiles(updated)
    localStorage.setItem('gmax_file_manager', JSON.stringify(updated))
  }

  const getFileIcon = (type) => {
    const icons = {
      document: '📄',
      image: '🖼️',
      video: '🎬',
      code: '💻',
      spreadsheet: '📊'
    }
    return icons[type] || '📁'
  }

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || f.type === filterType
    return matchesSearch && matchesType
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.uploadedAt) - new Date(a.uploadedAt)
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'size') {
      return parseFloat(b.size) - parseFloat(a.size)
    }
    return 0
  })

  const totalSize = files.reduce((sum, f) => sum + parseFloat(f.size || 0), 0)
  const starredFiles = files.filter(f => f.starred)

  return (
    <div className="file-manager-container">
      <div className="file-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📁 File Manager</h1>
      </div>

      <div className="file-stats">
        <div className="file-stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <div className="stat-num">{files.length}</div>
            <div className="stat-lbl">Total Files</div>
          </div>
        </div>
        <div className="file-stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-info">
            <div className="stat-num">{totalSize.toFixed(2)} MB</div>
            <div className="stat-lbl">Storage Used</div>
          </div>
        </div>
        <div className="file-stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-num">{starredFiles.length}</div>
            <div className="stat-lbl">Starred</div>
          </div>
        </div>
      </div>

      <div className="add-file-section">
        <h2>Add New File</h2>
        <form onSubmit={addFile}>
          <div className="file-form-grid">
            <input
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="File name..."
              required
            />
            <select value={fileType} onChange={e => setFileType(e.target.value)}>
              {fileTypes.filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              value={fileSize}
              onChange={e => setFileSize(e.target.value)}
              placeholder="Size (MB)..."
              required
            />
          </div>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Tags (comma separated)..."
          />
          <button type="submit">Add File</button>
        </form>
      </div>

      <div className="file-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Search files..."
          className="file-search"
        />
        <div className="control-group">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="filter-select">
            {fileTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>
      </div>

      <div className="files-grid">
        {filteredFiles.map(file => (
          <div key={file.id} className="file-card">
            <div className="file-card-header">
              <span className="file-icon">{getFileIcon(file.type)}</span>
              <button
                className={`star-btn ${file.starred ? 'starred' : ''}`}
                onClick={() => toggleStar(file.id)}
              >
                {file.starred ? '⭐' : '☆'}
              </button>
            </div>
            <h3 className="file-name">{file.name}</h3>
            <div className="file-meta">
              <span className="file-size">{file.size} MB</span>
              <span className="file-type-badge">{file.type}</span>
            </div>
            {file.tags.length > 0 && (
              <div className="file-tags">
                {file.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            )}
            <div className="file-date">
              Added: {new Date(file.uploadedAt).toLocaleDateString()}
            </div>
            <button className="delete-file-btn" onClick={() => deleteFile(file.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="empty-files">
          <p>No files found</p>
        </div>
      )}
    </div>
  )
}

export default FileManager
