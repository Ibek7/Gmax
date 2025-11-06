import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AmbientNoise.css'

const SOUNDS = [
  { id: 'rain', label: 'Rain', src: '/assets/sounds/rain.mp3' },
  { id: 'waves', label: 'Waves', src: '/assets/sounds/waves.mp3' },
  { id: 'forest', label: 'Forest', src: '/assets/sounds/forest.mp3' },
  { id: 'white', label: 'White Noise', src: '/assets/sounds/white_noise.mp3' }
]

const STORAGE_KEY = 'gmax_ambient_settings'

export default function AmbientNoise() {
  const navigate = useNavigate()
  const audioRefs = useRef({})
  const [volumes, setVolumes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved).volumes
    } catch (e) {}
    return SOUNDS.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
  })
  const [playing, setPlaying] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved).playing
    } catch (e) {}
    return false
  })
  const [masterVolume, setMasterVolume] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved).master || 0.8
    } catch (e) {}
    return 0.8
  })

  useEffect(() => {
    // initialize Audio elements
    SOUNDS.forEach((s) => {
      if (!audioRefs.current[s.id]) {
        const a = new Audio(s.src)
        a.loop = true
        a.volume = (volumes[s.id] || 0) * masterVolume
        audioRefs.current[s.id] = a
      }
    })

    // If playing on mount, start
    if (playing) startAll()

    return () => {
      // Pause on unmount
      Object.values(audioRefs.current).forEach((a) => {
        try { a.pause() } catch (e) {}
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // persist settings
    const payload = { volumes, playing, master: masterVolume }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)) } catch (e) {}
  }, [volumes, playing, masterVolume])

  const startAll = () => {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      try {
        audio.volume = (volumes[id] || 0) * masterVolume
        // play returns a promise
        const p = audio.play()
        if (p && p.catch) p.catch(() => {})
      } catch (e) {}
    })
    setPlaying(true)
  }

  const pauseAll = () => {
    Object.values(audioRefs.current).forEach((a) => {
      try { a.pause() } catch (e) {}
    })
    setPlaying(false)
  }

  const togglePlay = () => {
    if (playing) pauseAll()
    else startAll()
  }

  const setVolume = (id, value) => {
    setVolumes((prev) => {
      const next = { ...prev, [id]: value }
      // apply immediately if audio exists
      const a = audioRefs.current[id]
      if (a) a.volume = value * masterVolume
      return next
    })
  }

  const setMaster = (v) => {
    setMasterVolume(v)
    // apply to all
    Object.entries(audioRefs.current).forEach(([id, a]) => {
      try { a.volume = (volumes[id] || 0) * v } catch (e) {}
    })
  }

  const stopAndReset = () => {
    pauseAll()
    const zeros = SOUNDS.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
    setVolumes(zeros)
    setMasterVolume(0.8)
    try { localStorage.removeItem(STORAGE_KEY) } catch (e) {}
  }

  return (
    <div className="ambient-container">
      <div className="ambient-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>🌧️ Ambient Noise</h1>
      </div>

      <div className="ambient-card">
        <div className="controls-row">
          <button onClick={togglePlay} className={`play-btn ${playing ? 'active' : ''}`}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={stopAndReset} className="reset-btn">Stop & Reset</button>
          <div className="master-volume">
            <label>Master Volume</label>
            <input type="range" min="0" max="1" step="0.01" value={masterVolume} onChange={(e) => setMaster(Number(e.target.value))} />
          </div>
        </div>

        <div className="sound-list">
          {SOUNDS.map((s) => (
            <div className="sound-item" key={s.id}>
              <div className="sound-meta">
                <div className="sound-label">{s.label}</div>
                <div className="sound-actions">
                  <button onClick={() => { setVolume(s.id, 0.7); if (!playing) startAll() }} className="quick-btn">▶ 70%</button>
                  <button onClick={() => { setVolume(s.id, 0.4); if (!playing) startAll() }} className="quick-btn">▶ 40%</button>
                </div>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={volumes[s.id] || 0} onChange={(e) => setVolume(s.id, Number(e.target.value))} />
            </div>
          ))}
        </div>

        <div className="ambient-info">
          <p>Mix multiple ambient sounds to create a personalized focus or relaxation environment. Settings persist across sessions.</p>
        </div>
      </div>
    </div>
  )
}
