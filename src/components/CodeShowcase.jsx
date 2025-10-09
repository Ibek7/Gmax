import React, { useState } from 'react'

const CodeShowcase = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  
  const codeExamples = {
    javascript: {
      title: 'Creative JavaScript Animation',
      code: `// Particle System Animation
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;
    this.life = 255;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 2;
  }
  
  draw(ctx) {
    ctx.globalAlpha = this.life / 255;
    ctx.fillStyle = \`hsl(\${this.life}, 50%, 50%)\`;
    ctx.fillRect(this.x, this.y, 3, 3);
  }
}`
    },
    python: {
      title: 'Creative Python Art Generator',
      code: `# Fractal Art Generator
import turtle
import math

def draw_fractal(length, depth):
    if depth == 0:
        turtle.forward(length)
    else:
        # Draw fractal branch
        draw_fractal(length/3, depth-1)
        turtle.left(60)
        draw_fractal(length/3, depth-1)
        turtle.right(120)
        draw_fractal(length/3, depth-1)
        turtle.left(60)
        draw_fractal(length/3, depth-1)

# Create beautiful fractal
turtle.speed(0)
turtle.color("rainbow")
draw_fractal(300, 4)`
    },
    css: {
      title: 'Creative CSS Animation',
      code: `/* Morphing Button Effect */
.creative-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 50px;
  padding: 15px 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.creative-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3));
  transition: left 0.5s ease;
}

.creative-button:hover::before {
  left: 100%;
}`
    }
  }
  
  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨', color: '#f7df1e' },
    { id: 'python', name: 'Python', icon: '🐍', color: '#3776ab' },
    { id: 'css', name: 'CSS', icon: '🎨', color: '#1572b6' }
  ]
  
  return (
    <div className="code-showcase" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💻 Code Showcase</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Beautiful code examples and creative programming</p>
      </header>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        {languages.map(lang => (
          <button
            key={lang.id}
            onClick={() => setSelectedLanguage(lang.id)}
            style={{
              background: selectedLanguage === lang.id ? lang.color : 'var(--surface-color)',
              color: selectedLanguage === lang.id ? 'white' : 'var(--text-primary)',
              border: `2px solid ${lang.color}`,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            <span>{lang.icon}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
      
      <div style={{ background: 'var(--surface-color)', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ 
          background: languages.find(l => l.id === selectedLanguage)?.color, 
          color: 'white', 
          padding: '1rem',
          fontWeight: '600'
        }}>
          {codeExamples[selectedLanguage].title}
        </div>
        <pre style={{ 
          margin: 0, 
          padding: '2rem', 
          background: '#1a1a1a', 
          color: '#f8f8f2',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          overflowX: 'auto'
        }}>
          <code>{codeExamples[selectedLanguage].code}</code>
        </pre>
      </div>
      
      <div style={{ marginTop: '2rem', background: 'var(--surface-color)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Code Tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {['Syntax Highlighter', 'Code Formatter', 'Color Picker', 'Font Tester', 'Regex Builder', 'JSON Viewer'].map(tool => (
            <div
              key={tool}
              style={{
                background: 'var(--background-color)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CodeShowcase