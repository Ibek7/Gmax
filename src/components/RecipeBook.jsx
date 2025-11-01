import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/RecipeBook.css'

const RecipeBook = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewingRecipe, setViewingRecipe] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'breakfast',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'easy',
    ingredients: '',
    instructions: '',
    imageUrl: ''
  })

  const categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage']
  const difficulties = ['easy', 'medium', 'hard']

  useEffect(() => {
    const savedRecipes = localStorage.getItem('gmax_recipes')
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes))
    } else {
      const sampleRecipes = [
        {
          id: 1,
          title: 'Classic Pancakes',
          category: 'breakfast',
          prepTime: 10,
          cookTime: 15,
          servings: 4,
          difficulty: 'easy',
          ingredients: ['2 cups flour', '2 eggs', '1.5 cups milk', '2 tbsp sugar', '2 tsp baking powder', '1/2 tsp salt', '2 tbsp butter'],
          instructions: ['Mix dry ingredients in a bowl', 'Whisk eggs and milk together', 'Combine wet and dry ingredients', 'Heat pan over medium heat', 'Pour batter and cook until bubbles form', 'Flip and cook until golden'],
          imageUrl: '🥞',
          favorite: false
        },
        {
          id: 2,
          title: 'Chocolate Chip Cookies',
          category: 'dessert',
          prepTime: 15,
          cookTime: 12,
          servings: 24,
          difficulty: 'easy',
          ingredients: ['2.25 cups flour', '1 cup butter', '3/4 cup sugar', '2 eggs', '1 tsp vanilla', '1 tsp baking soda', '2 cups chocolate chips'],
          instructions: ['Preheat oven to 375°F', 'Cream butter and sugar', 'Beat in eggs and vanilla', 'Mix in flour and baking soda', 'Stir in chocolate chips', 'Bake for 10-12 minutes'],
          imageUrl: '🍪',
          favorite: false
        }
      ]
      setRecipes(sampleRecipes)
      localStorage.setItem('gmax_recipes', JSON.stringify(sampleRecipes))
    }
  }, [])

  const saveRecipes = (updatedRecipes) => {
    setRecipes(updatedRecipes)
    localStorage.setItem('gmax_recipes', JSON.stringify(updatedRecipes))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const addRecipe = (e) => {
    e.preventDefault()
    const recipe = {
      id: Date.now(),
      ...formData,
      prepTime: parseInt(formData.prepTime),
      cookTime: parseInt(formData.cookTime),
      servings: parseInt(formData.servings),
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      instructions: formData.instructions.split('\n').filter(i => i.trim()),
      favorite: false
    }
    
    saveRecipes([...recipes, recipe])
    setFormData({
      title: '',
      category: 'breakfast',
      prepTime: '',
      cookTime: '',
      servings: '',
      difficulty: 'easy',
      ingredients: '',
      instructions: '',
      imageUrl: ''
    })
    setShowAddForm(false)
  }

  const deleteRecipe = (id) => {
    saveRecipes(recipes.filter(r => r.id !== id))
    if (viewingRecipe?.id === id) setViewingRecipe(null)
  }

  const toggleFavorite = (id) => {
    saveRecipes(recipes.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r))
    if (viewingRecipe?.id === id) {
      setViewingRecipe({ ...viewingRecipe, favorite: !viewingRecipe.favorite })
    }
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category) => {
    const icons = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍽️',
      dessert: '🍰',
      snack: '🍿',
      beverage: '☕'
    }
    return icons[category] || '🍴'
  }

  if (viewingRecipe) {
    return (
      <div className="recipe-book-container">
        <div className="recipe-header">
          <button className="back-btn" onClick={() => setViewingRecipe(null)}>← Back to Recipes</button>
          <h1>Recipe Details</h1>
        </div>

        <div className="recipe-detail-card">
          <div className="recipe-detail-header">
            <div className="recipe-icon-large">{viewingRecipe.imageUrl || getCategoryIcon(viewingRecipe.category)}</div>
            <div className="recipe-title-section">
              <h2>{viewingRecipe.title}</h2>
              <div className="recipe-meta-tags">
                <span className="category-badge">{getCategoryIcon(viewingRecipe.category)} {viewingRecipe.category}</span>
                <span className={`difficulty-badge ${viewingRecipe.difficulty}`}>{viewingRecipe.difficulty}</span>
              </div>
            </div>
            <button 
              className={`favorite-btn-large ${viewingRecipe.favorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(viewingRecipe.id)}
            >
              {viewingRecipe.favorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="recipe-time-info">
            <div className="time-box">
              <span className="time-icon">⏱️</span>
              <span className="time-label">Prep</span>
              <span className="time-value">{viewingRecipe.prepTime} min</span>
            </div>
            <div className="time-box">
              <span className="time-icon">🔥</span>
              <span className="time-label">Cook</span>
              <span className="time-value">{viewingRecipe.cookTime} min</span>
            </div>
            <div className="time-box">
              <span className="time-icon">🍽️</span>
              <span className="time-label">Servings</span>
              <span className="time-value">{viewingRecipe.servings}</span>
            </div>
          </div>

          <div className="recipe-content-sections">
            <div className="ingredients-section">
              <h3>📝 Ingredients</h3>
              <ul className="ingredients-list">
                {viewingRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h3>👨‍🍳 Instructions</h3>
              <ol className="instructions-list">
                {viewingRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="recipe-actions">
            <button onClick={() => deleteRecipe(viewingRecipe.id)} className="delete-recipe-btn">
              🗑️ Delete Recipe
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="recipe-book-container">
      <div className="recipe-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>📖 Recipe Book</h1>
      </div>

      <div className="recipe-controls">
        <input
          type="text"
          placeholder="🔍 Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="category-filters">
          <button
            className={filterCategory === 'all' ? 'active' : ''}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={filterCategory === cat ? 'active' : ''}
              onClick={() => setFilterCategory(cat)}
            >
              {getCategoryIcon(cat)} {cat}
            </button>
          ))}
        </div>

        <button className="add-recipe-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add Recipe'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-recipe-form">
          <h2>Create New Recipe</h2>
          <form onSubmit={addRecipe}>
            <div className="form-row">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Recipe Title"
                required
              />
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Emoji (e.g., 🍕)"
              />
            </div>

            <div className="form-row">
              <select name="category" value={formData.category} onChange={handleInputChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{getCategoryIcon(cat)} {cat}</option>
                ))}
              </select>
              <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                placeholder="Prep Time (minutes)"
                required
              />
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleInputChange}
                placeholder="Cook Time (minutes)"
                required
              />
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                placeholder="Servings"
                required
              />
            </div>

            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="Ingredients (one per line)"
              rows="6"
              required
            />

            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Instructions (one per line)"
              rows="8"
              required
            />

            <button type="submit" className="submit-recipe-btn">Add Recipe</button>
          </form>
        </div>
      )}

      <div className="recipes-grid">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-card-header">
              <div className="recipe-icon">{recipe.imageUrl || getCategoryIcon(recipe.category)}</div>
              <button 
                className={`favorite-btn ${recipe.favorite ? 'active' : ''}`}
                onClick={() => toggleFavorite(recipe.id)}
              >
                {recipe.favorite ? '❤️' : '🤍'}
              </button>
            </div>
            <h3>{recipe.title}</h3>
            <div className="recipe-card-meta">
              <span className="category-tag">{recipe.category}</span>
              <span className={`difficulty-tag ${recipe.difficulty}`}>{recipe.difficulty}</span>
            </div>
            <div className="recipe-card-info">
              <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
              <span>🍽️ {recipe.servings} servings</span>
            </div>
            <button onClick={() => setViewingRecipe(recipe)} className="view-recipe-btn">
              View Recipe
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

export default RecipeBook
