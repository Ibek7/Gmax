import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/TextGenerator.css'

function TextGenerator() {
  const navigate = useNavigate()
  const [textType, setTextType] = useState('lorem')
  const [paragraphs, setParagraphs] = useState(3)
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(5)
  const [wordsPerSentence, setWordsPerSentence] = useState(15)
  const [output, setOutput] = useState('')

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ]

  const randomWords = [
    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'cat', 'mouse',
    'bird', 'fish', 'tree', 'house', 'car', 'road', 'sky', 'sun', 'moon', 'star',
    'water', 'fire', 'earth', 'wind', 'mountain', 'river', 'ocean', 'forest',
    'city', 'village', 'people', 'time', 'day', 'night', 'morning', 'evening',
    'book', 'pen', 'paper', 'table', 'chair', 'door', 'window', 'wall', 'floor',
    'computer', 'phone', 'internet', 'world', 'country', 'music', 'art', 'science'
  ]

  const businessWords = [
    'synergy', 'leverage', 'paradigm', 'strategy', 'innovation', 'solution',
    'platform', 'ecosystem', 'scalability', 'optimization', 'benchmark', 'metric',
    'stakeholder', 'revenue', 'growth', 'market', 'customer', 'enterprise',
    'workflow', 'productivity', 'efficiency', 'engagement', 'analytics', 'digital',
    'transformation', 'disruption', 'agile', 'implementation', 'deliverable',
    'sustainability', 'collaboration', 'initiative', 'framework', 'infrastructure',
    'bandwidth', 'mindshare', 'actionable', 'scalable', 'robust', 'seamless'
  ]

  const generateText = () => {
    let wordPool = loremWords
    if (textType === 'random') wordPool = randomWords
    if (textType === 'business') wordPool = businessWords

    const result = []

    for (let p = 0; p < paragraphs; p++) {
      const sentences = []
      
      for (let s = 0; s < sentencesPerParagraph; s++) {
        const words = []
        const numWords = Math.floor(wordsPerSentence * (0.8 + Math.random() * 0.4))
        
        for (let w = 0; w < numWords; w++) {
          const word = wordPool[Math.floor(Math.random() * wordPool.length)]
          words.push(w === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
        }
        
        sentences.push(words.join(' ') + '.')
      }
      
      result.push(sentences.join(' '))
    }

    setOutput(result.join('\n\n'))
  }

  const copyText = () => {
    if (!output) {
      alert('No text to copy')
      return
    }
    navigator.clipboard.writeText(output)
    alert('Text copied to clipboard!')
  }

  const downloadText = () => {
    if (!output) {
      alert('No text to download')
      return
    }
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStats = () => {
    if (!output) return null
    
    const chars = output.length
    const words = output.trim().split(/\s+/).length
    const sentences = output.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphCount = output.split(/\n\n+/).filter(p => p.trim()).length
    
    return { chars, words, sentences, paragraphs: paragraphCount }
  }

  const stats = getStats()

  return (
    <div className="text-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>Text Generator</h1>
        <p className="subtitle">Generate placeholder text for your designs and mockups</p>

        <div className="controls-section">
          <div className="control-group">
            <label>Text Type:</label>
            <select value={textType} onChange={(e) => setTextType(e.target.value)}>
              <option value="lorem">Lorem Ipsum (Classic)</option>
              <option value="random">Random Words</option>
              <option value="business">Business Jargon</option>
            </select>
          </div>

          <div className="control-group">
            <label>Paragraphs:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={paragraphs}
              onChange={(e) => setParagraphs(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Sentences per Paragraph:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={sentencesPerParagraph}
              onChange={(e) => setSentencesPerParagraph(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Words per Sentence (avg):</label>
            <input
              type="number"
              min="5"
              max="30"
              value={wordsPerSentence}
              onChange={(e) => setWordsPerSentence(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={generateText} className="generate-btn">
            ✨ Generate Text
          </button>
          <button onClick={copyText} className="copy-btn" disabled={!output}>
            📋 Copy
          </button>
          <button onClick={downloadText} className="download-btn" disabled={!output}>
            ⬇️ Download
          </button>
        </div>

        {stats && (
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-value">{stats.chars}</span>
              <span className="stat-label">Characters</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.words}</span>
              <span className="stat-label">Words</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.sentences}</span>
              <span className="stat-label">Sentences</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.paragraphs}</span>
              <span className="stat-label">Paragraphs</span>
            </div>
          </div>
        )}

        <div className="output-section">
          <h3>Generated Text</h3>
          <textarea
            value={output}
            readOnly
            placeholder="Click 'Generate Text' to create placeholder content..."
            rows={20}
          />
        </div>

        <div className="info-section">
          <h3>About Text Types</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>📜 Lorem Ipsum</h4>
              <p>Classic placeholder text derived from Latin literature, used in design and publishing since the 1500s.</p>
            </div>
            <div className="info-card">
              <h4>🎲 Random Words</h4>
              <p>Everyday English words combined randomly to create readable placeholder text.</p>
            </div>
            <div className="info-card">
              <h4>💼 Business Jargon</h4>
              <p>Corporate buzzwords and business terminology for professional mockups and presentations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextGenerator
