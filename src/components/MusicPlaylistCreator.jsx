import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MusicPlaylistCreator.css'

const MusicPlaylistCreator = () => {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newTrack, setNewTrack] = useState({ title: '', artist: '', mood: 'energetic' })

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = () => {
    const saved = localStorage.getItem('gmax_playlists')
    if (saved) {
      setPlaylists(JSON.parse(saved))
    } else {
      const mock = [{
        id: 1,
        name: 'Focus Flow',
        tracks: [
          { id: 1, title: 'Lo-fi Beats', artist: 'Chill Artist', mood: 'calm' },
          { id: 2, title: 'Study Music', artist: 'Focus Tunes', mood: 'calm' }
        ],
        mood: 'calm'
      }]
      setPlaylists(mock)
      localStorage.setItem('gmax_playlists', JSON.stringify(mock))
    }
  }

  const createPlaylist = () => {
    const newPlaylist = {
      id: Date.now(),
      name: prompt('Playlist name:') || 'New Playlist',
      tracks: [],
      mood: 'mixed'
    }
    const updated = [...playlists, newPlaylist]
    setPlaylists(updated)
    localStorage.setItem('gmax_playlists', JSON.stringify(updated))
  }

  const addTrack = () => {
    if (!currentPlaylist || !newTrack.title) return
    const track = { ...newTrack, id: Date.now() }
    const updated = playlists.map(p => 
      p.id === currentPlaylist.id 
        ? { ...p, tracks: [...p.tracks, track] }
        : p
    )
    setPlaylists(updated)
    setCurrentPlaylist({ ...currentPlaylist, tracks: [...currentPlaylist.tracks, track] })
    localStorage.setItem('gmax_playlists', JSON.stringify(updated))
    setNewTrack({ title: '', artist: '', mood: 'energetic' })
    setShowModal(false)
  }

  return (
    <div className="music-playlist-container">
      <div className="playlist-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🎵 Music Playlist Creator</h1>
        <button onClick={createPlaylist}>+ New Playlist</button>
      </div>

      <div className="playlists-layout">
        <div className="playlists-sidebar">
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              className={`playlist-item ${currentPlaylist?.id === playlist.id ? 'active' : ''}`}
              onClick={() => setCurrentPlaylist(playlist)}
            >
              <h3>{playlist.name}</h3>
              <span>{playlist.tracks.length} tracks</span>
            </div>
          ))}
        </div>

        <div className="playlist-details">
          {currentPlaylist ? (
            <>
              <h2>{currentPlaylist.name}</h2>
              <button onClick={() => setShowModal(true)}>+ Add Track</button>
              <div className="tracks-list">
                {currentPlaylist.tracks.map(track => (
                  <div key={track.id} className="track-item">
                    <div>
                      <div className="track-title">{track.title}</div>
                      <div className="track-artist">{track.artist}</div>
                    </div>
                    <span className="mood-badge">{track.mood}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="select-prompt">Select a playlist to view tracks</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Track</h2>
            <input
              type="text"
              placeholder="Track title"
              value={newTrack.title}
              onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Artist"
              value={newTrack.artist}
              onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
            />
            <select value={newTrack.mood} onChange={(e) => setNewTrack({ ...newTrack, mood: e.target.value })}>
              <option value="energetic">Energetic</option>
              <option value="calm">Calm</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
            </select>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={addTrack}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicPlaylistCreator
