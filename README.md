# Gmax Creative Studio 🎨

A multi-faceted creative platform designed to inspire daily creativity through interactive modules, mini-games, and creative tools.

## ✨ Features

### 🏠 Dashboard
- Real-time clock and daily goals tracking
- Inspirational quotes rotation
- Quick access to all creative modules
- Progress visualization

### 🎮 Games Hub
- **Color Memory** - Test your memory with color sequences
- **Word Chain** - Build vocabulary through word associations
- **Pattern Puzzle** - Solve geometric challenges (Coming Soon)
- **Rhythm Tap** - Create music through rhythm (Coming Soon)

### ✍️ Creative Writing
- Daily writing prompts across multiple genres
- Word count tracking
- Story preservation
- Category-based prompt generation

### 🎨 Art Gallery
- Showcase of digital art concepts
- Interactive art viewing
- Creative inspiration gallery
- Visual storytelling elements

### 🎵 Music Lab
- Virtual instruments (Piano, Drums, Guitar, Synthesizer)
- Sound effects and audio manipulation
- Recording capabilities
- Interactive music creation

### 💻 Code Showcase
- Beautiful code examples
- Syntax highlighting for multiple languages
- Creative programming demonstrations
- Developer tools and utilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bekamguta/gmax-creative-studio.git
   cd gmax-creative-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm test` - Run test suite
- `npm run lint` - Check code quality with ESLint
- `npm run format` - Format code with Prettier

## 🎨 Themes

The application supports multiple themes:

- **Light Theme** ☀️ - Clean, bright interface
- **Dark Theme** 🌙 - Easy on the eyes for low-light environments
- **Neon Theme** ⚡ - Vibrant, cyberpunk-inspired design

Switch themes using the theme selector in the navigation bar.

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.jsx     # Main dashboard
│   ├── Navigation.jsx    # Navigation bar
│   ├── GamesHub.jsx      # Games collection
│   ├── CreativeWriting.jsx
│   ├── ArtGallery.jsx
│   ├── MusicLab.jsx
│   └── CodeShowcase.jsx
├── data/                 # Static data and content
│   ├── quotes.js         # Inspirational quotes
│   ├── writingPrompts.js # Writing prompts by genre
│   └── games.js          # Game templates and achievements
├── utils/                # Utility functions
│   └── helpers.js        # Common helper functions
├── styles/               # CSS stylesheets
│   ├── index.css         # Global styles and theme variables
│   ├── App.css          # App-specific styles
│   ├── Navigation.css    # Navigation styles
│   ├── Dashboard.css     # Dashboard styles
│   └── GamesHub.css      # Games hub styles
└── games/                # Game implementations (future)
```

## 🔧 Development Guidelines

### Adding New Features

1. **Create a new component** in the `src/components/` directory
2. **Add routing** in `App.jsx` if needed
3. **Create associated styles** in `src/styles/`
4. **Update navigation** in `Navigation.jsx`
5. **Add tests** for new functionality

### Adding New Content

1. **Quotes**: Add to `src/data/quotes.js`
2. **Writing Prompts**: Add to `src/data/writingPrompts.js`
3. **Games**: Add templates to `src/data/games.js`
4. **Themes**: Add CSS variables in `src/styles/index.css`

### Coding Standards

- Use functional React components with hooks
- Follow ESLint and Prettier configurations
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Maintain consistent file naming conventions

## 🎯 Daily Development Strategy

This project is designed to encourage regular development through:

### Small, Focused Commits
- **Feature additions**: Add one new game, prompt, or tool at a time
- **Style improvements**: Refine themes, animations, or layouts incrementally
- **Content updates**: Add new quotes, prompts, or data regularly
- **Bug fixes**: Address issues as they arise
- **Documentation**: Update README, add comments, improve guides

### Natural Development Flow
- **Morning**: Add new content (quotes, prompts, data)
- **Midday**: Implement new features or components
- **Afternoon**: Refine styles and user experience
- **Evening**: Update documentation and write tests

### Expansion Ideas
- Add more mini-games with increasing complexity
- Implement user accounts and progress saving
- Create collaborative features
- Add export functionality for creative work
- Integrate with external APIs for content
- Build mobile-responsive designs
- Add accessibility features

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router
- **Styling**: CSS Custom Properties, Responsive Design
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Audio**: Tone.js
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Inspired by creative coding communities
- Built with modern web technologies
- Designed for daily creative practice
- Encourages consistent development habits

---

**Happy Creating!** 🚀