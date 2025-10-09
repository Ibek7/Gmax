import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../components/Dashboard'

// Mock the quotes data
jest.mock('../data/quotes', () => ({
  getRandomQuote: () => ({
    text: "Test quote text",
    author: "Test Author",
    category: "test"
  })
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    renderWithRouter(<Dashboard />)
    const titleElement = screen.getByText(/Welcome to Gmax Creative Studio/i)
    expect(titleElement).toBeInTheDocument()
  })
  
  test('displays creative modules section', () => {
    renderWithRouter(<Dashboard />)
    const modulesSection = screen.getByText(/Creative Modules/i)
    expect(modulesSection).toBeInTheDocument()
  })
  
  test('shows daily goals section', () => {
    renderWithRouter(<Dashboard />)
    const goalsSection = screen.getByText(/Today's Creative Goals/i)
    expect(goalsSection).toBeInTheDocument()
  })
  
  test('displays random quote', () => {
    renderWithRouter(<Dashboard />)
    const quoteText = screen.getByText(/Test quote text/i)
    const quoteAuthor = screen.getByText(/Test Author/i)
    expect(quoteText).toBeInTheDocument()
    expect(quoteAuthor).toBeInTheDocument()
  })
})