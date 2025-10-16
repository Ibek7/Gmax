import React, { useState, useEffect } from 'react'
import '../styles/VoiceNotes.css'

const VOICE_NOTES_KEY = 'gmaxVoiceNotes'

const VoiceNotes = () => {
  const [notes, setNotes] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [currentNote, setCurrentNote] = useState('')
  const [playingId, setPlayingId] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(VOICE_NOTES_KEY)
    if (stored) {
      setNotes(JSON.parse(stored))
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data])
        }
      }
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const newNote = {
          id: Date.now(),
          audioUrl,
          text: currentNote || 'Untitled Note',
          createdAt: new Date().toISOString(),
          duration: 0
        }
        
        const updatedNotes = [newNote, ...notes]
        setNotes(updatedNotes)
        localStorage.setItem(VOICE_NOTES_KEY, JSON.stringify(updatedNotes))
        setAudioChunks([])
        setCurrentNote('')
      }
      
      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to record voice notes')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const playNote = (noteId, audioUrl) => {
    if (playingId === noteId) {
      setPlayingId(null)
      return
    }
    
    const audio = new Audio(audioUrl)
    audio.play()
    setPlayingId(noteId)
    
    audio.onended = () => {
      setPlayingId(null)
    }
  }

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem(VOICE_NOTES_KEY, JSON.stringify(updatedNotes))
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="voice-notes">
      <header className="voice-notes-header">
        <h1>🎙️ Voice Notes</h1>
        <p>Capture creative ideas on the go with voice recordings</p>
      </header>

      <div className="recording-section">
        <div className="recorder-card">
          <div className={`recording-indicator ${isRecording ? 'active' : ''}`}>
            {isRecording ? '🔴 Recording...' : '🎤 Ready to Record'}
          </div>
          
          {isRecording && (
            <input
              type="text"
              placeholder="Add a title for this note..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              className="note-title-input"
            />
          )}
          
          <button 
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
          </button>
          
          <p className="recorder-hint">
            {isRecording ? 'Click stop when finished' : 'Click to start capturing your ideas'}
          </p>
        </div>
      </div>

      <div className="notes-section">
        <h2>📝 Your Voice Notes ({notes.length})</h2>
        
        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎤</div>
            <p>No voice notes yet</p>
            <p className="empty-subtitle">Start recording to capture your creative ideas!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3>{note.text}</h3>
                  <button 
                    className="delete-note-btn"
                    onClick={() => deleteNote(note.id)}
                  >
                    🗑️
                  </button>
                </div>
                
                <p className="note-date">{formatDate(note.createdAt)}</p>
                
                <button 
                  className={`play-btn ${playingId === note.id ? 'playing' : ''}`}
                  onClick={() => playNote(note.id, note.audioUrl)}
                >
                  {playingId === note.id ? '⏸️ Pause' : '▶️ Play'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceNotes
