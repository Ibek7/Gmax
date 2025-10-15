import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRandomQuote } from '../data/quotes'
import '../styles/Dashboard.css'
import RecentProjectsSidebar from './RecentProjectsSidebar'
import ThemeSwitcher from './ThemeSwitcher'

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dailyGoal, setDailyGoal] = useState(5)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [todaysQuote, setTodaysQuote] = useState(getRandomQuote())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const refreshQuote = () => {
    setTodaysQuote(getRandomQuote())
  }
  
  return (
    <div className="dashboard" style={{ display: 'flex', flexDirection: 'row' }}>
      <RecentProjectsSidebar />
      <div style={{ flex: 1 }}>
        <header className="dashboard-header">
          <ThemeSwitcher />
          <h1 className="dashboard-title">Welcome to Gmax Creative Studio</h1>
          <p className="dashboard-subtitle">Your daily hub for creative inspiration and productivity</p>
        </header>
        <DailyInspiration />
        <div className="stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="modules-section">
          <h2 className="section-title">Creative Modules</h2>
          <div className="modules-grid">
            {featuredModules.map((module, index) => (
              <Link key={index} to={module.path} className="module-card">
                <div className="module-icon" style={{ color: module.color }}>
                  {module.icon}
                </div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <div className="module-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="daily-goals">
          <h2 className="section-title">Today's Creative Goals</h2>
          <div className="goals-container">
            <div className="goal-item">
              <input type="checkbox" id="goal1" onChange={(e) => setCompletedTasks(prev => e.target.checked ? prev + 1 : prev - 1)} />
              <label htmlFor="goal1">Explore a new creative technique</label>
            </div>
            <div className="goal-item">
              <input type="checkbox" id="goal2" onChange={(e) => setCompletedTasks(prev => e.target.checked ? prev + 1 : prev - 1)} />
              <label htmlFor="goal2">Complete one mini-project</label>
            </div>
            <div className="goal-item">
              <input type="checkbox" id="goal3" onChange={(e) => setCompletedTasks(prev => e.target.checked ? prev + 1 : prev - 1)} />
              <label htmlFor="goal3">Share creative work with others</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
      color: 'var(--warning-color)'
    }
  ]
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Welcome to Gmax Creative Studio</h1>
        <p className="dashboard-subtitle">Your daily hub for creative inspiration and productivity</p>
      </header>
      
      <div className="quote-section">
        <blockquote className="daily-quote">
          "{todaysQuote.text}" — {todaysQuote.author}
        </blockquote>
        <button onClick={refreshQuote} className="refresh-quote-btn">
          🎲 New Quote
          <DailyInspiration />
        </button>
      </div>
      
      <div className="stats-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="modules-section">
        <h2 className="section-title">Creative Modules</h2>
        <div className="modules-grid">
          {featuredModules.map((module, index) => (
            <Link key={index} to={module.path} className="module-card">
              <div className="module-icon" style={{ color: module.color }}>
                {module.icon}
              </div>
              <h3 className="module-title">{module.title}</h3>
              <p className="module-description">{module.description}</p>
              <div className="module-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="daily-goals">
        <h2 className="section-title">Today's Creative Goals</h2>
        <div className="goals-container">
          <div className="goal-item">
            <input type="checkbox" id="goal1" onChange={(e) => setCompletedTasks(prev => e.target.checked ? prev + 1 : prev - 1)} />
            <label htmlFor="goal1">Explore a new creative technique</label>
          </div>
          <div className="goal-item">
            <input type="checkbox" id="goal2" onChange={(e) => setCompletedTasks(prev => e.target.checked ? prev + 1 : prev - 1)} />
            <label htmlFor="goal2">Complete one mini-project</label>
          </div>
          <div className="goal-item">
            <input type="checkbox" id="goal3" onChange={(e) => setCompletedTasks(prev => e.target.checked ? prev + 1 : prev - 1)} />
            <label htmlFor="goal3">Share creative work with others</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard