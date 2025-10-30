import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/RecipeManager.css'

const RecipeManager = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [title, setTitle] = useState('')
  const [cuisine, setCuisine] = useState('italian')
  const [prepTime, setPrepTime] = useState('')
  const [servings, setServings] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [filterCuisine, setFilterCuisine] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const cuisines = ['italian', 'mexican', 'asian', 'american', 'indian', 'mediterranean', 'french', 'other']

  useEffect(() => {
    const saved = localStorage.getItem('gmax_recipes')
    if (saved) setRecipes(JSON.parse(saved))
  }, [])

  const addRecipe = (e) => {
    e.preventDefault()
    if (title.trim() && ingredients.trim() && instructions.trim()) {
      const recipe = {
        id: Date.now(),
        title,
        cuisine,
        prepTime: parseInt(prepTime) || 30,
        servings: parseInt(servings) || 4,
        ingredients: ingredients.split('\n').filter(i => i.trim()),
        instructions: instructions.split('\n').filter(i => i.trim()),
        rating: 0,
        cooked: 0,
        createdAt: new Date().toISOString()
      }
      const updated = [...recipes, recipe]
      setRecipes(updated)
      localStorage.setItem('gmax_recipes', JSON.stringify(updated))
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle('')
    setCuisine('italian')
    setPrepTime('')
    setServings('')
    setIngredients('')
    setInstructions('')
    setShowAddForm(false)
  }

  const rateRecipe = (id, rating) => {
    const updated = recipes.map(r => r.id === id ? { ...r, rating } : r)
    setRecipes(updated)
    localStorage.setItem('gmax_recipes', JSON.stringify(updated))
  }

  const markCooked = (id) => {
    const updated = recipes.map(r => r.id === id ? { ...r, cooked: r.cooked + 1 } : r)
    setRecipes(updated)
    localStorage.setItem('gmax_recipes', JSON.stringify(updated))
  }

  const deleteRecipe = (id) => {
    const updated = recipes.filter(r => r.id !== id)
    setRecipes(updated)
    localStorage.setItem('gmax_recipes', JSON.stringify(updated))
  }

  const filteredRecipes = recipes.filter(r => {
    const matchesCuisine = filterCuisine === 'all' || r.cuisine === filterCuisine
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCuisine && matchesSearch
  })

  const getCuisineIcon = (cuisine) => {
    const icons = {
      italian: '🍝',
      mexican: '🌮',
      asian: '🍜',
      american: '🍔',
      indian: '🍛',
      mediterranean: '🥗',
      french: '🥐',
      other: '🍽️'
    }
    return icons[cuisine] || '🍽️'
  }

  return (
    <div className="recipe-manager-container">
      <div className="recipe-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>👨‍🍳 Recipe Manager</h1>
        <button className="add-recipe-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+ Add Recipe'}
        </button>
      </div>

      <div className="recipe-stats">
        <div className="recipe-stat">
          <span className="stat-num">{recipes.length}</span>
          <span className="stat-label">Total Recipes</span>
        </div>
        <div className="recipe-stat">
          <span className="stat-num">{recipes.reduce((sum, r) => sum + r.cooked, 0)}</span>
          <span className="stat-label">Times Cooked</span>
        </div>
        <div className="recipe-stat">
          <span className="stat-num">{cuisines.length - 1}</span>
          <span className="stat-label">Cuisines</span>
        </div>
      </div>

      {showAddForm && (
        <div className="add-recipe-form">
          <h2>Add New Recipe</h2>
          <form onSubmit={addRecipe}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Recipe title..."
              required
            />
            <div className="form-grid">
              <select value={cuisine} onChange={e => setCuisine(e.target.value)}>
                {cuisines.map(c => (
                  <option key={c} value={c}>{getCuisineIcon(c)} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
              <input
                type="number"
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                placeholder="Prep time (min)"
              />
              <input
                type="number"
                value={servings}
                onChange={e => setServings(e.target.value)}
                placeholder="Servings"
              />
            </div>
            <textarea
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              placeholder="Ingredients (one per line)..."
              rows="5"
              required
            ></textarea>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Instructions (one step per line)..."
              rows="6"
              required
            ></textarea>
            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
              <button type="submit" className="submit-btn">Add Recipe</button>
            </div>
          </form>
        </div>
      )}

      <div className="recipe-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Search recipes or ingredients..."
          className="recipe-search"
        />
        <div className="cuisine-filters">
          <button
            className={`cuisine-btn ${filterCuisine === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCuisine('all')}
          >
            All
          </button>
          {cuisines.map(c => (
            <button
              key={c}
              className={`cuisine-btn ${filterCuisine === c ? 'active' : ''}`}
              onClick={() => setFilterCuisine(c)}
            >
              {getCuisineIcon(c)} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-card-header">
              <span className="cuisine-badge">{getCuisineIcon(recipe.cuisine)} {recipe.cuisine}</span>
              <button className="delete-recipe-btn" onClick={() => deleteRecipe(recipe.id)}>×</button>
            </div>
            <h3>{recipe.title}</h3>
            <div className="recipe-meta">
              <span>⏱️ {recipe.prepTime} min</span>
              <span>🍽️ {recipe.servings} servings</span>
            </div>
            <div className="recipe-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star ${recipe.rating >= star ? 'filled' : ''}`}
                  onClick={() => rateRecipe(recipe.id, star)}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div className="recipe-cooked">
              Cooked {recipe.cooked} times
            </div>
            <button className="cook-btn" onClick={() => markCooked(recipe.id)}>
              🍳 Mark as Cooked
            </button>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="empty-recipes">
          <p>No recipes found</p>
        </div>
      )}
    </div>
  )
}

export default RecipeManager
