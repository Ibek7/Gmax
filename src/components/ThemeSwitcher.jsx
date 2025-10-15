import React, { useEffect, useState } from 'react'
import '../styles/ThemeSwitcher.css'

const THEME_KEY = 'gmaxTheme'

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored) setTheme(stored)
    document.body.setAttribute('data-theme', stored || 'light')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
    document.body.setAttribute('data-theme', newTheme)
  }

  return (
    <button className="theme-switcher" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  )
}

export default ThemeSwitcher
