import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import CSVImporter from './components/CSVImporter'
import MarkdownEditor from './components/MarkdownEditor'
import ThemePresets from './components/ThemePresets'
import ImageCompressor from './components/ImageCompressor'
import Stopwatch from './components/Stopwatch'
import ColorContrast from './components/ColorContrast'
import Base64Tool from './components/Base64Tool'
import LoremIpsum from './components/LoremIpsum'
import RegexTester from './components/RegexTester'
import URLTool from './components/URLTool'
import HashGenerator from './components/HashGenerator'
import DiffChecker from './components/DiffChecker'
import CronBuilder from './components/CronBuilder'
import TimestampConverter from './components/TimestampConverter'
import IPInfo from './components/IPInfo'
import GradientGenerator from './components/GradientGenerator'
import AmbientNoise from './components/AmbientNoise'
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
            <Route path="/ambient-noise" element={<AmbientNoise />} />
            <Route path="/csv-importer" element={<CSVImporter />} />
            <Route path="/markdown-editor" element={<MarkdownEditor />} />
            <Route path="/theme-presets" element={<ThemePresets />} />
            <Route path="/image-compressor" element={<ImageCompressor />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/color-contrast" element={<ColorContrast />} />
            <Route path="/base64-tool" element={<Base64Tool />} />
            <Route path="/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/regex-tester" element={<RegexTester />} />
            <Route path="/url-tool" element={<URLTool />} />
            <Route path="/hash-generator" element={<HashGenerator />} />
            <Route path="/diff-checker" element={<DiffChecker />} />
            <Route path="/cron-builder" element={<CronBuilder />} />
            <Route path="/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/ip-info" element={<IPInfo />} />
            <Route path="/gradient-generator" element={<GradientGenerator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App