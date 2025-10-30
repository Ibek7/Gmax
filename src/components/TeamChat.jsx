import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TeamChat.css'

const TeamChat = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('You')

  useEffect(() => {
    const saved = localStorage.getItem('gmax_team_messages')
    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      const welcome = [
        { id: 1, user: 'System', text: 'Welcome to Team Chat!', time: new Date().toISOString() }
      ]
      setMessages(welcome)
    }
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: username,
        text: newMessage,
        time: new Date().toISOString()
      }
      const updated = [...messages, message]
      setMessages(updated)
      localStorage.setItem('gmax_team_messages', JSON.stringify(updated))
      setNewMessage('')
    }
  }

  return (
    <div className="team-chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>💬 Team Chat</h1>
        <div className="online-indicator">
          <span className="dot"></span> {messages.length} messages
        </div>
      </div>

      <div className="chat-window">
        <div className="messages-container">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.user === username ? 'own' : 'other'}`}>
              <div className="message-header">
                <strong>{msg.user}</strong>
                <span className="time">{new Date(msg.time).toLocaleTimeString()}</span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="message-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-btn">Send</button>
        </form>
      </div>
    </div>
  )
}

export default TeamChat
