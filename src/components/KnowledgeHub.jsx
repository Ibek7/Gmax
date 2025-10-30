import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/KnowledgeHub.css'

const KnowledgeHub = () => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const defaultArticles = [
    { id: 1, title: 'Getting Started with React', category: 'Development', tags: ['react', 'javascript'], content: 'Learn React basics...' },
    { id: 2, title: 'Design Principles', category: 'Design', tags: ['ui', 'ux'], content: 'Core design principles...' },
    { id: 3, title: 'Agile Methodologies', category: 'Process', tags: ['agile', 'scrum'], content: 'Understanding agile...' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('gmax_knowledge_articles')
    setArticles(saved ? JSON.parse(saved) : defaultArticles)
  }, [])

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="knowledge-container">
      <div className="knowledge-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📚 Knowledge Hub</h1>
        <input 
          type="search" 
          placeholder="Search articles..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="articles-grid">
        {filteredArticles.map(article => (
          <div key={article.id} className="article-card">
            <div className="category-tag">{article.category}</div>
            <h3>{article.title}</h3>
            <div className="tags">
              {article.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
            <p>{article.content}</p>
            <button className="read-more-btn">Read More →</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KnowledgeHub
