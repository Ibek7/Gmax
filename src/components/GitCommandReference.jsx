import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/GitCommandReference.css'

function GitCommandReference() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const commands = [
    {
      category: 'setup',
      name: 'git init',
      description: 'Initialize a new Git repository',
      example: 'git init',
      details: 'Creates a new .git directory in your project folder'
    },
    {
      category: 'setup',
      name: 'git clone',
      description: 'Clone a repository',
      example: 'git clone https://github.com/user/repo.git',
      details: 'Downloads a complete copy of a remote repository'
    },
    {
      category: 'basic',
      name: 'git status',
      description: 'Show the working tree status',
      example: 'git status',
      details: 'Displays paths with differences between index and HEAD'
    },
    {
      category: 'basic',
      name: 'git add',
      description: 'Add files to staging area',
      example: 'git add . or git add file.txt',
      details: 'Stages changes for the next commit'
    },
    {
      category: 'basic',
      name: 'git commit',
      description: 'Record changes to repository',
      example: 'git commit -m "commit message"',
      details: 'Saves staged changes with a descriptive message'
    },
    {
      category: 'basic',
      name: 'git push',
      description: 'Upload local changes to remote',
      example: 'git push origin main',
      details: 'Sends committed changes to remote repository'
    },
    {
      category: 'basic',
      name: 'git pull',
      description: 'Fetch and merge remote changes',
      example: 'git pull origin main',
      details: 'Downloads and integrates remote changes'
    },
    {
      category: 'branching',
      name: 'git branch',
      description: 'List, create, or delete branches',
      example: 'git branch feature-name',
      details: 'Manage different lines of development'
    },
    {
      category: 'branching',
      name: 'git checkout',
      description: 'Switch branches or restore files',
      example: 'git checkout branch-name',
      details: 'Move between branches or restore working tree files'
    },
    {
      category: 'branching',
      name: 'git merge',
      description: 'Merge branches together',
      example: 'git merge feature-branch',
      details: 'Combines changes from different branches'
    },
    {
      category: 'advanced',
      name: 'git rebase',
      description: 'Reapply commits on top of another base',
      example: 'git rebase main',
      details: 'Moves or combines commits to a new base'
    },
    {
      category: 'advanced',
      name: 'git stash',
      description: 'Temporarily save changes',
      example: 'git stash or git stash pop',
      details: 'Saves uncommitted changes for later use'
    },
    {
      category: 'advanced',
      name: 'git reset',
      description: 'Undo commits',
      example: 'git reset --soft HEAD~1',
      details: 'Moves HEAD to specified state'
    },
    {
      category: 'history',
      name: 'git log',
      description: 'Show commit history',
      example: 'git log --oneline',
      details: 'Displays commit history with various formatting options'
    },
    {
      category: 'history',
      name: 'git diff',
      description: 'Show changes between commits',
      example: 'git diff HEAD~1',
      details: 'Displays differences in files'
    },
    {
      category: 'remote',
      name: 'git remote',
      description: 'Manage remote repositories',
      example: 'git remote add origin URL',
      details: 'Add, remove, or show remote repositories'
    },
    {
      category: 'remote',
      name: 'git fetch',
      description: 'Download remote changes',
      example: 'git fetch origin',
      details: 'Retrieves changes without merging'
    },
    {
      category: 'undoing',
      name: 'git revert',
      description: 'Create new commit that undoes changes',
      example: 'git revert HEAD',
      details: 'Safely undo commits by creating inverse commit'
    },
    {
      category: 'undoing',
      name: 'git restore',
      description: 'Restore working tree files',
      example: 'git restore file.txt',
      details: 'Discard changes in working directory'
    },
    {
      category: 'advanced',
      name: 'git cherry-pick',
      description: 'Apply changes from specific commits',
      example: 'git cherry-pick commit-hash',
      details: 'Copy commits from one branch to another'
    }
  ]

  const categories = [
    { value: 'all', label: 'All Commands' },
    { value: 'setup', label: 'Setup' },
    { value: 'basic', label: 'Basic' },
    { value: 'branching', label: 'Branching' },
    { value: 'remote', label: 'Remote' },
    { value: 'history', label: 'History' },
    { value: 'undoing', label: 'Undoing' },
    { value: 'advanced', label: 'Advanced' }
  ]

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyCommand = (command) => {
    navigator.clipboard.writeText(command)
    alert('Command copied to clipboard!')
  }

  return (
    <div className="git-command-reference">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="reference-container">
        <h1>Git Command Reference</h1>
        <p className="subtitle">Quick reference guide for essential Git commands</p>

        <div className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={selectedCategory === cat.value ? 'active' : ''}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="commands-grid">
          {filteredCommands.map((cmd, index) => (
            <div key={index} className="command-card">
              <div className="command-header">
                <code className="command-name">{cmd.name}</code>
                <button
                  className="copy-btn"
                  onClick={() => copyCommand(cmd.example)}
                >
                  📋
                </button>
              </div>
              <p className="command-description">{cmd.description}</p>
              <div className="command-example">
                <label>Example:</label>
                <code>{cmd.example}</code>
              </div>
              <p className="command-details">{cmd.details}</p>
              <span className="category-badge">{cmd.category}</span>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="no-results">
            <p>No commands found matching your search.</p>
          </div>
        )}

        <div className="cheatsheet-section">
          <h3>Common Git Workflows</h3>
          <div className="workflow-grid">
            <div className="workflow-card">
              <h4>Start New Feature</h4>
              <code>
                git checkout -b feature-name<br/>
                # Make changes<br/>
                git add .<br/>
                git commit -m "Add feature"<br/>
                git push origin feature-name
              </code>
            </div>
            <div className="workflow-card">
              <h4>Update from Main</h4>
              <code>
                git checkout main<br/>
                git pull origin main<br/>
                git checkout feature-branch<br/>
                git merge main
              </code>
            </div>
            <div className="workflow-card">
              <h4>Undo Last Commit</h4>
              <code>
                git reset --soft HEAD~1<br/>
                # Or keep changes unstaged:<br/>
                git reset HEAD~1
              </code>
            </div>
            <div className="workflow-card">
              <h4>Save Work in Progress</h4>
              <code>
                git stash<br/>
                # Do other work<br/>
                git stash pop
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitCommandReference
