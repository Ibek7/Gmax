import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import GamesHub from './components/GamesHub'
import CreativeWriting from './components/CreativeWriting'
import ArtGallery from './components/ArtGallery'
import MusicLab from './components/MusicLab'
import CodeShowcase from './components/CodeShowcase'
import NotFound from './components/NotFound'
import './styles/App.css'

function App() {
  const [currentTheme, setCurrentTheme] = useState('default')

  return (
    <Router>
      <div className={`app theme-${currentTheme}`}>
        <Navigation currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<GamesHub />} />
            <Route path="/writing" element={<CreativeWriting />} />
            <Route path="/art" element={<ArtGallery />} />
            <Route path="/music" element={<MusicLab />} />
            <Route path="/code" element={<CodeShowcase />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App