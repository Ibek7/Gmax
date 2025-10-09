import React, { useState } from 'react'

const CreativeWriting = () => {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [userStory, setUserStory] = useState('')
  
  const prompts = [
    "Write about a character who discovers they can hear colors",
    "A world where emotions are traded like currency",
    "The last library on Earth is about to close forever",
    "You wake up with the ability to taste memories",
    "A letter arrives 50 years late with urgent news"
  ]
  
  const generatePrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    setCurrentPrompt(randomPrompt)
  }
  
  return (
    <div className="creative-writing" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✍️ Creative Writing Studio</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Daily prompts to spark your imagination</p>
      </header>
      
      <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Today's Writing Prompt</h2>
        {currentPrompt ? (
          <blockquote style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            "{currentPrompt}"
          </blockquote>
        ) : (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Click the button below to get your writing prompt!</p>
        )}
        <button 
          onClick={generatePrompt}
          style={{ 
            background: 'var(--primary-color)', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem', 
            cursor: 'pointer' 
          }}
        >
          Generate New Prompt
        </button>
      </div>
      
      <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Story</h2>
        <textarea
          value={userStory}
          onChange={(e) => setUserStory(e.target.value)}
          placeholder="Start writing your story here..."
          style={{
            width: '100%',
            height: '300px',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            lineHeight: '1.6',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Word count: {userStory.split(' ').filter(word => word.length > 0).length}
        </div>
      </div>
    </div>
  )
}

export default CreativeWriting