import React, { useEffect, useState } from 'react'
import '../styles/RecentProjectsSidebar.css'

const RECENT_PROJECTS_KEY = 'recentProjects'

const RecentProjectsSidebar = () => {
  const [recentProjects, setRecentProjects] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_PROJECTS_KEY)
    if (stored) {
      setRecentProjects(JSON.parse(stored))
    }
  }, [])

  return (
    <aside className="recent-projects-sidebar">
      <h3>Recent Projects</h3>
      <ul>
        {recentProjects.length === 0 ? (
          <li>No recent projects</li>
        ) : (
          recentProjects.slice(0, 5).map((proj, idx) => (
            <li key={idx}>
              <a href={proj.url}>{proj.name}</a>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}

export default RecentProjectsSidebar
