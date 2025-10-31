import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MusicPlayer.css'

const MusicPlayer = () => {
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState([])
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(70)
  const [repeat, setRepeat] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [trackTitle, setTrackTitle] = useState('')
  const [trackArtist, setTrackArtist] = useState('')
  const [trackDuration, setTrackDuration] = useState(180)

  useEffect(() => {
    const saved = localStorage.getItem('gmax_music_playlist')
    if (saved) {
      const tracks = JSON.parse(saved)
      setPlaylist(tracks)
      if (tracks.length > 0) setCurrentTrack(tracks[0])
    }
  }, [])

  useEffect(() => {
    let interval
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            handleTrackEnd()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack])

  const addTrack = (e) => {
    e.preventDefault()
    if (trackTitle.trim() && trackArtist.trim()) {
      const track = {
        id: Date.now(),
        title: trackTitle,
        artist: trackArtist,
        duration: parseInt(trackDuration),
        addedAt: new Date().toISOString()
      }
      const updated = [...playlist, track]
      setPlaylist(updated)
      localStorage.setItem('gmax_music_playlist', JSON.stringify(updated))
      
      if (!currentTrack) setCurrentTrack(track)
      
      setTrackTitle('')
      setTrackArtist('')
      setTrackDuration(180)
      setShowAddForm(false)
    }
  }

  const deleteTrack = (id) => {
    const updated = playlist.filter(t => t.id !== id)
    setPlaylist(updated)
    localStorage.setItem('gmax_music_playlist', JSON.stringify(updated))
    
    if (currentTrack?.id === id) {
      setIsPlaying(false)
      setCurrentTime(0)
      setCurrentTrack(updated.length > 0 ? updated[0] : null)
    }
  }

  const playTrack = (track) => {
    setCurrentTrack(track)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTrackEnd = () => {
    if (repeat) {
      setCurrentTime(0)
    } else {
      nextTrack()
    }
  }

  const nextTrack = () => {
    if (playlist.length === 0) return
    
    let nextIndex
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length)
    } else {
      const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id)
      nextIndex = (currentIndex + 1) % playlist.length
    }
    
    setCurrentTrack(playlist[nextIndex])
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const previousTrack = () => {
    if (playlist.length === 0) return
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id)
    const prevIndex = currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1
    
    setCurrentTrack(playlist[prevIndex])
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const seekTrack = (e) => {
    const newTime = parseInt(e.target.value)
    setCurrentTime(newTime)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = currentTrack ? (currentTime / currentTrack.duration) * 100 : 0

  return (
    <div className="music-player-container">
      <div className="music-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎵 Music Player</h1>
        <button className="add-track-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+ Add Track'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-track-form">
          <h2>Add New Track</h2>
          <form onSubmit={addTrack}>
            <input
              type="text"
              value={trackTitle}
              onChange={e => setTrackTitle(e.target.value)}
              placeholder="Track title..."
              required
            />
            <input
              type="text"
              value={trackArtist}
              onChange={e => setTrackArtist(e.target.value)}
              placeholder="Artist name..."
              required
            />
            <input
              type="number"
              value={trackDuration}
              onChange={e => setTrackDuration(e.target.value)}
              placeholder="Duration (seconds)..."
              required
            />
            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">Add Track</button>
            </div>
          </form>
        </div>
      )}

      <div className="player-card">
        {currentTrack ? (
          <>
            <div className="now-playing">
              <div className="track-artwork">🎵</div>
              <div className="track-info">
                <h2>{currentTrack.title}</h2>
                <p>{currentTrack.artist}</p>
              </div>
            </div>

            <div className="progress-section">
              <span className="time-label">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={currentTrack.duration}
                value={currentTime}
                onChange={seekTrack}
                className="progress-slider"
              />
              <span className="time-label">{formatTime(currentTrack.duration)}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="player-controls">
              <button
                className={`control-btn ${shuffle ? 'active' : ''}`}
                onClick={() => setShuffle(!shuffle)}
              >
                🔀
              </button>
              <button className="control-btn" onClick={previousTrack}>⏮</button>
              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button className="control-btn" onClick={nextTrack}>⏭</button>
              <button
                className={`control-btn ${repeat ? 'active' : ''}`}
                onClick={() => setRepeat(!repeat)}
              >
                🔁
              </button>
            </div>

            <div className="volume-control">
              <span>🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                className="volume-slider"
              />
              <span>{volume}%</span>
            </div>
          </>
        ) : (
          <div className="no-track">
            <p>No track selected</p>
            <p>Add tracks to your playlist to get started</p>
          </div>
        )}
      </div>

      <div className="playlist-section">
        <h2>📋 Playlist ({playlist.length} tracks)</h2>
        {playlist.length === 0 ? (
          <div className="empty-playlist">
            <p>Your playlist is empty</p>
          </div>
        ) : (
          <div className="playlist-tracks">
            {playlist.map(track => (
              <div
                key={track.id}
                className={`playlist-track ${currentTrack?.id === track.id ? 'active' : ''}`}
              >
                <button onClick={() => playTrack(track)} className="track-play-btn">
                  {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                </button>
                <div className="track-details">
                  <span className="track-title">{track.title}</span>
                  <span className="track-artist">{track.artist}</span>
                </div>
                <span className="track-duration">{formatTime(track.duration)}</span>
                <button onClick={() => deleteTrack(track.id)} className="track-delete-btn">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicPlayer
