import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoremIpsum.css'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
]

export default function LoremIpsum() {
  const navigate = useNavigate()
  const [type, setType] = useState('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [startWithLorem, setStartWithLorem] = useState(true)

  const generateWords = (num) => {
    const words = []
    for (let i = 0; i < num; i++) {
      if (i === 0 && startWithLorem) {
        words.push('Lorem')
      } else {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
      }
    }
    return words.join(' ')
  }

  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 10) + 5
    const sentence = generateWords(wordCount)
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  }

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3
    const sentences = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  const generate = () => {
    let result = ''
    
    switch (type) {
      case 'paragraphs':
        const paragraphs = []
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph())
        }
        result = paragraphs.join('\n\n')
        break
      
      case 'sentences':
        const sentences = []
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence())
        }
        result = sentences.join(' ')
        break
      
      case 'words':
        result = generateWords(count)
        break
      
      default:
        break
    }
    
    setOutput(result)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  const clear = () => {
    setOutput('')
  }

  return (
    <div className="lorem-container">
      <div className="lorem-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📝 Lorem Ipsum Generator</h1>
      </div>

      <div className="lorem-card">
        <div className="settings-section">
          <div className="setting-group">
            <label>Generate</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Count: {count}</label>
            <input
              type="range"
              min="1"
              max={type === 'words' ? 500 : type === 'sentences' ? 50 : 20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>

          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
              />
              Start with "Lorem ipsum..."
            </label>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={generate} className="generate-btn">
            ✨ Generate
          </button>
          <button onClick={clear} className="clear-btn" disabled={!output}>
            🗑️ Clear
          </button>
        </div>

        {output && (
          <div className="output-section">
            <div className="output-header">
              <h3>Generated Text</h3>
              <div className="output-stats">
                <span>{output.split(' ').length} words</span>
                <span>{output.length} characters</span>
              </div>
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copy
              </button>
            </div>
            <div className="output-text">{output}</div>
          </div>
        )}

        <div className="info-section">
          <h4>ℹ️ About Lorem Ipsum</h4>
          <p>
            Lorem Ipsum is placeholder text commonly used in the graphic, print, and publishing 
            industries for previewing layouts and visual mockups. It has been the industry's 
            standard dummy text since the 1500s.
          </p>
        </div>
      </div>
    </div>
  )
}
