import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoremTextVariants.css'

function LoremTextVariants() {
  const navigate = useNavigate()
  const [style, setStyle] = useState('lorem')
  const [type, setType] = useState('paragraphs')
  const [count, setCount] = useState(3)
  const [generatedText, setGeneratedText] = useState('')

  const textLibraries = {
    lorem: {
      words: [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
        'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis',
        'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum',
        'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non',
        'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
        'est', 'laborum', 'vitae', 'risus', 'viverra', 'sapien', 'faucibus', 'orci', 'luctus'
      ]
    },
    hipster: {
      words: [
        'artisan', 'brooklyn', 'chambray', 'craft', 'beer', 'dreamcatcher', 'ethical', 'farm-to-table',
        'fixie', 'food', 'truck', 'gluten-free', 'hashtag', 'irony', 'jean', 'shorts', 'kale',
        'chips', 'keytar', 'kickstarter', 'letterpress', 'locavore', 'meditation', 'messenger', 'bag',
        'microdosing', 'mustache', 'neutra', 'normcore', 'organic', 'paleo', 'PBR', 'photo', 'booth',
        'pickled', 'pinterest', 'pitchfork', 'plaid', 'polaroid', 'pour-over', 'quinoa', 'raw',
        'denim', 'readymade', 'retro', 'roof', 'party', 'salvia', 'scenester', 'selfies', 'semiotics',
        'slow-carb', 'small', 'batch', 'sriracha', 'stumptown', 'sustainable', 'synth', 'tattooed',
        'taxidermy', 'thundercats', 'tote', 'bag', 'truffaut', 'try-hard', 'tumblr', 'typewriter',
        'vegan', 'vinyl', 'viral', 'waistcoat', 'wayfarers', 'williamsburg', 'XOXO', 'YOLO'
      ]
    },
    corporate: {
      words: [
        'synergy', 'leverage', 'paradigm', 'shift', 'actionable', 'insights', 'bandwidth', 'best',
        'practices', 'blue-sky', 'thinking', 'boilerplate', 'brainstorm', 'circle', 'back', 'core',
        'competency', 'customer-centric', 'deliverables', 'disruptive', 'innovation', 'drill-down',
        'ecosystem', 'empower', 'engagement', 'enterprise', 'facilitator', 'framework', 'game-changer',
        'generation', 'holistic', 'approach', 'ideate', 'impact', 'implementation', 'incentivize',
        'interface', 'key', 'performance', 'indicator', 'KPI', 'low-hanging', 'fruit', 'market',
        'leader', 'metrics', 'milestone', 'mission-critical', 'monetize', 'next-generation', 'optimize',
        'out-of-the-box', 'pivot', 'proactive', 'productivity', 'robust', 'ROI', 'scalable', 'seamless',
        'solution', 'stakeholder', 'strategic', 'streamline', 'synergize', 'thought', 'leadership',
        'touch', 'base', 'value-add', 'vertical', 'win-win', 'workflow'
      ]
    },
    pirate: {
      words: [
        'ahoy', 'avast', 'aye', 'barnacle', 'bilge', 'booty', 'bounty', 'buccaneer', 'cannon',
        'captain', 'cutlass', 'davy', 'jones', 'locker', 'doubloon', 'first', 'mate', 'grog',
        'hearty', 'hornswaggle', 'jolly', 'roger', 'landlubber', 'matey', 'parley', 'pieces',
        'of', 'eight', 'pillage', 'plunder', 'privateer', 'rum', 'sail', 'scallywag', 'scurvy',
        'sea', 'dog', 'shanty', 'shiver', 'me', 'timbers', 'shipmate', 'skull', 'crossbones',
        'swashbuckler', 'treasure', 'walk', 'the', 'plank', 'weigh', 'anchor', 'yo-ho-ho',
        'black', 'spot', 'dead', 'mens', 'chest', 'keelhaul', 'marooned', 'port', 'starboard'
      ]
    },
    tech: {
      words: [
        'algorithm', 'API', 'agile', 'backend', 'blockchain', 'boolean', 'browser', 'cache',
        'cloud', 'computing', 'compile', 'component', 'container', 'database', 'debug', 'deploy',
        'DevOps', 'Docker', 'encryption', 'endpoint', 'framework', 'frontend', 'function', 'Git',
        'GitHub', 'IDE', 'interface', 'JavaScript', 'JSON', 'Kubernetes', 'latency', 'library',
        'machine', 'learning', 'microservices', 'middleware', 'mobile', 'module', 'MongoDB', 'node',
        'npm', 'object', 'open-source', 'optimize', 'parameters', 'protocol', 'Python', 'query',
        'React', 'refactor', 'repository', 'REST', 'runtime', 'scalability', 'schema', 'SDK',
        'server', 'serverless', 'socket', 'SQL', 'stack', 'syntax', 'thread', 'TypeScript',
        'variable', 'version', 'control', 'virtual', 'machine', 'webpack', 'workflow', 'XML'
      ]
    }
  }

  const generateWord = () => {
    const words = textLibraries[style].words
    return words[Math.floor(Math.random() * words.length)]
  }

  const generateSentence = () => {
    const length = Math.floor(Math.random() * 10) + 5 // 5-15 words
    const words = []
    for (let i = 0; i < length; i++) {
      words.push(generateWord())
    }
    const sentence = words.join(' ')
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  }

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3 // 3-7 sentences
    const sentences = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  const generate = () => {
    let result = []

    if (type === 'words') {
      for (let i = 0; i < count; i++) {
        result.push(generateWord())
      }
      setGeneratedText(result.join(' '))
    } else if (type === 'sentences') {
      for (let i = 0; i < count; i++) {
        result.push(generateSentence())
      }
      setGeneratedText(result.join(' '))
    } else if (type === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        result.push(generateParagraph())
      }
      setGeneratedText(result.join('\n\n'))
    }
  }

  const copyText = () => {
    navigator.clipboard.writeText(generatedText)
    alert('Text copied to clipboard!')
  }

  const downloadText = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${style}-ipsum.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="lorem-text-variants">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>Lorem Text Variants</h1>
        <p className="subtitle">Generate placeholder text in various fun styles</p>

        <div className="controls-section">
          <div className="style-selector">
            <label>Style</label>
            <div className="style-buttons">
              <button
                className={style === 'lorem' ? 'active' : ''}
                onClick={() => setStyle('lorem')}
              >
                Classic Lorem
              </button>
              <button
                className={style === 'hipster' ? 'active' : ''}
                onClick={() => setStyle('hipster')}
              >
                Hipster
              </button>
              <button
                className={style === 'corporate' ? 'active' : ''}
                onClick={() => setStyle('corporate')}
              >
                Corporate
              </button>
              <button
                className={style === 'pirate' ? 'active' : ''}
                onClick={() => setStyle('pirate')}
              >
                Pirate
              </button>
              <button
                className={style === 'tech' ? 'active' : ''}
                onClick={() => setStyle('tech')}
              >
                Tech
              </button>
            </div>
          </div>

          <div className="type-count-controls">
            <div className="control-group">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="paragraphs">Paragraphs</option>
              </select>
            </div>

            <div className="control-group">
              <label>Count: {count}</label>
              <input
                type="range"
                min="1"
                max={type === 'words' ? '100' : type === 'sentences' ? '20' : '10'}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
              />
            </div>
          </div>

          <button className="generate-btn" onClick={generate}>
            Generate Text
          </button>
        </div>

        {generatedText && (
          <div className="output-section">
            <div className="output-header">
              <h3>Generated Text</h3>
              <div className="output-actions">
                <button className="copy-btn" onClick={copyText}>
                  📋 Copy
                </button>
                <button className="download-btn" onClick={downloadText}>
                  💾 Download
                </button>
              </div>
            </div>
            <div className="text-output">{generatedText}</div>
          </div>
        )}

        <div className="info-section">
          <h3>About Text Styles</h3>
          <div className="style-info">
            <div className="info-card">
              <h4>Classic Lorem</h4>
              <p>Traditional Latin placeholder text from Cicero's writings</p>
            </div>
            <div className="info-card">
              <h4>Hipster</h4>
              <p>Trendy Brooklyn-inspired words like artisan, craft beer, and organic</p>
            </div>
            <div className="info-card">
              <h4>Corporate</h4>
              <p>Business jargon with synergy, leverage, and actionable insights</p>
            </div>
            <div className="info-card">
              <h4>Pirate</h4>
              <p>Nautical language with ahoy, matey, and treasure</p>
            </div>
            <div className="info-card">
              <h4>Tech</h4>
              <p>Programming and technology terms like API, cloud, and framework</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoremTextVariants
