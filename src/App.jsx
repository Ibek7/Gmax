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
import JSONFormatter from './components/JSONFormatter'
import QRCodeGenerator from './components/QRCodeGenerator'
import ColorPaletteGenerator from './components/ColorPaletteGenerator'
import JWTDecoder from './components/JWTDecoder'
import MarkdownPreviewer from './components/MarkdownPreviewer'
import CaseConverter from './components/CaseConverter'
import UUIDGenerator from './components/UUIDGenerator'
import SQLFormatter from './components/SQLFormatter'
import ImageToBase64 from './components/ImageToBase64'
import PasswordGenerator from './components/PasswordGenerator'
import CSSMinifier from './components/CSSMinifier'
import HTMLEntityEncoder from './components/HTMLEntityEncoder'
import StringUtilities from './components/StringUtilities'
import JSONToCSV from './components/JSONToCSV'
import SlugGenerator from './components/SlugGenerator'
import JavaScriptFormatter from './components/JavaScriptFormatter'
import TextGenerator from './components/TextGenerator'
import StringEscaper from './components/StringEscaper'
import NumberBaseConverter from './components/NumberBaseConverter'
import UserAgentParser from './components/UserAgentParser'
import ChecksumGenerator from './components/ChecksumGenerator'
import TextEncodingConverter from './components/TextEncodingConverter'
import XMLFormatter from './components/XMLFormatter'
import HTTPStatusReference from './components/HTTPStatusReference'
import MockDataGenerator from './components/MockDataGenerator'
import JSONDiffViewer from './components/JSONDiffViewer'
import PlaceholderImageGenerator from './components/PlaceholderImageGenerator'
import CSSUnitConverter from './components/CSSUnitConverter'
import APIKeyGenerator from './components/APIKeyGenerator'
import ASCIIArtGenerator from './components/ASCIIArtGenerator'
import ColorPickerTool from './components/ColorPickerTool'
import MarkdownTableGenerator from './components/MarkdownTableGenerator'
import LoremTextVariants from './components/LoremTextVariants'
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
            <Route path="/json-formatter" element={<JSONFormatter />} />
            <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
            <Route path="/color-palette-generator" element={<ColorPaletteGenerator />} />
            <Route path="/jwt-decoder" element={<JWTDecoder />} />
            <Route path="/markdown-previewer" element={<MarkdownPreviewer />} />
            <Route path="/case-converter" element={<CaseConverter />} />
            <Route path="/uuid-generator" element={<UUIDGenerator />} />
            <Route path="/sql-formatter" element={<SQLFormatter />} />
            <Route path="/image-to-base64" element={<ImageToBase64 />} />
            <Route path="/password-generator" element={<PasswordGenerator />} />
            <Route path="/css-minifier" element={<CSSMinifier />} />
            <Route path="/html-entity-encoder" element={<HTMLEntityEncoder />} />
            <Route path="/string-utilities" element={<StringUtilities />} />
            <Route path="/json-to-csv" element={<JSONToCSV />} />
            <Route path="/slug-generator" element={<SlugGenerator />} />
            <Route path="/javascript-formatter" element={<JavaScriptFormatter />} />
            <Route path="/text-generator" element={<TextGenerator />} />
            <Route path="/string-escaper" element={<StringEscaper />} />
            <Route path="/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/user-agent-parser" element={<UserAgentParser />} />
            <Route path="/checksum-generator" element={<ChecksumGenerator />} />
            <Route path="/text-encoding-converter" element={<TextEncodingConverter />} />
            <Route path="/xml-formatter" element={<XMLFormatter />} />
            <Route path="/http-status-reference" element={<HTTPStatusReference />} />
            <Route path="/mock-data-generator" element={<MockDataGenerator />} />
            <Route path="/json-diff-viewer" element={<JSONDiffViewer />} />
            <Route path="/placeholder-image-generator" element={<PlaceholderImageGenerator />} />
            <Route path="/css-unit-converter" element={<CSSUnitConverter />} />
            <Route path="/api-key-generator" element={<APIKeyGenerator />} />
            <Route path="/ascii-art-generator" element={<ASCIIArtGenerator />} />
            <Route path="/color-picker-tool" element={<ColorPickerTool />} />
            <Route path="/markdown-table-generator" element={<MarkdownTableGenerator />} />
            <Route path="/lorem-text-variants" element={<LoremTextVariants />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App