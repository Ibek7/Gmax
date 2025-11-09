import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/MockDataGenerator.css'

function MockDataGenerator() {
  const navigate = useNavigate()
  const [dataType, setDataType] = useState('person')
  const [count, setCount] = useState(5)
  const [generatedData, setGeneratedData] = useState([])

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle']
  
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
  
  const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Elm St', 'Washington Blvd', 'Park Ave', 'Lake Rd', 'Hill St', 'Pine St', 'Market St', 'Church St', 'Spring St', 'River Rd', 'Valley Dr']
  
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Boston']
  
  const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
  
  const companies = ['Tech Solutions Inc', 'Global Systems', 'Innovation Labs', 'Digital Ventures', 'Creative Studios', 'Enterprise Solutions', 'Cloud Services', 'Data Analytics Co', 'Software Development LLC', 'Consulting Group']
  
  const jobTitles = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'Marketing Manager', 'Sales Representative', 'HR Specialist', 'Financial Analyst', 'Project Manager', 'Customer Success Manager', 'DevOps Engineer', 'Business Analyst', 'Account Executive', 'Content Writer', 'Graphic Designer']
  
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'business.net', 'mail.com']

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const generatePerson = () => {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(domains)}`
    
    return {
      id: randomNumber(10000, 99999),
      firstName,
      lastName,
      email,
      phone: `+1 (${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
      age: randomNumber(18, 65),
      address: {
        street: `${randomNumber(100, 9999)} ${randomItem(streets)}`,
        city: randomItem(cities),
        state: randomItem(states),
        zipCode: randomNumber(10000, 99999).toString()
      }
    }
  }

  const generateCompany = () => {
    return {
      id: randomNumber(1000, 9999),
      name: randomItem(companies),
      industry: randomItem(['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Consulting']),
      employees: randomNumber(10, 10000),
      founded: randomNumber(1950, 2023),
      revenue: `$${randomNumber(1, 999)}M`,
      website: `www.${randomItem(companies).toLowerCase().replace(/\s+/g, '')}.com`
    }
  }

  const generateProduct = () => {
    const adjectives = ['Premium', 'Deluxe', 'Pro', 'Ultra', 'Smart', 'Advanced', 'Elite', 'Classic']
    const products = ['Widget', 'Gadget', 'Device', 'Tool', 'System', 'Platform', 'Solution', 'Service']
    
    return {
      id: randomNumber(1000, 9999),
      name: `${randomItem(adjectives)} ${randomItem(products)}`,
      price: (Math.random() * 999 + 1).toFixed(2),
      category: randomItem(['Electronics', 'Software', 'Hardware', 'Accessories', 'Services']),
      inStock: Math.random() > 0.3,
      rating: (Math.random() * 2 + 3).toFixed(1),
      sku: `SKU-${randomNumber(10000, 99999)}`
    }
  }

  const generateTransaction = () => {
    return {
      id: randomNumber(100000, 999999),
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: (Math.random() * 9999 + 1).toFixed(2),
      status: randomItem(['completed', 'pending', 'failed', 'refunded']),
      paymentMethod: randomItem(['credit_card', 'debit_card', 'paypal', 'bank_transfer']),
      currency: randomItem(['USD', 'EUR', 'GBP', 'JPY'])
    }
  }

  const generateUser = () => {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)
    
    return {
      id: randomNumber(10000, 99999),
      username: `${firstName.toLowerCase()}${randomNumber(10, 999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(domains)}`,
      role: randomItem(['admin', 'user', 'moderator', 'guest']),
      isActive: Math.random() > 0.2,
      createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  const generateAddress = () => {
    return {
      id: randomNumber(1000, 9999),
      street: `${randomNumber(100, 9999)} ${randomItem(streets)}`,
      city: randomItem(cities),
      state: randomItem(states),
      zipCode: randomNumber(10000, 99999).toString(),
      country: 'USA',
      type: randomItem(['home', 'work', 'billing', 'shipping'])
    }
  }

  const generateEvent = () => {
    const eventTypes = ['Conference', 'Workshop', 'Seminar', 'Meetup', 'Webinar', 'Training']
    
    return {
      id: randomNumber(1000, 9999),
      name: `${randomItem(adjectives)} ${randomItem(eventTypes)}`,
      date: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: `${randomItem(cities)}, ${randomItem(states)}`,
      attendees: randomNumber(10, 500),
      capacity: randomNumber(50, 1000),
      price: Math.random() > 0.5 ? (Math.random() * 500 + 10).toFixed(2) : 'Free'
    }
  }

  const generateData = () => {
    const data = []
    for (let i = 0; i < count; i++) {
      switch (dataType) {
        case 'person':
          data.push(generatePerson())
          break
        case 'company':
          data.push(generateCompany())
          break
        case 'product':
          data.push(generateProduct())
          break
        case 'transaction':
          data.push(generateTransaction())
          break
        case 'user':
          data.push(generateUser())
          break
        case 'address':
          data.push(generateAddress())
          break
        case 'event':
          data.push(generateEvent())
          break
        default:
          data.push(generatePerson())
      }
    }
    setGeneratedData(data)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2))
    alert('Data copied to clipboard!')
  }

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(generatedData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mock-${dataType}-data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const adjectives = ['Premium', 'Deluxe', 'Pro', 'Ultra', 'Smart', 'Advanced', 'Elite', 'Classic']

  return (
    <div className="mock-data-generator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="generator-container">
        <h1>Mock Data Generator</h1>
        <p className="subtitle">Generate random mock data for testing and development</p>

        <div className="controls-section">
          <div className="control-group">
            <label>Data Type:</label>
            <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
              <option value="person">Person</option>
              <option value="company">Company</option>
              <option value="product">Product</option>
              <option value="transaction">Transaction</option>
              <option value="user">User</option>
              <option value="address">Address</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div className="control-group">
            <label>Count: {count}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />
          </div>

          <button className="generate-btn" onClick={generateData}>
            Generate Data
          </button>
        </div>

        {generatedData.length > 0 && (
          <>
            <div className="actions-section">
              <button className="action-btn copy-btn" onClick={copyToClipboard}>
                📋 Copy JSON
              </button>
              <button className="action-btn download-btn" onClick={downloadJSON}>
                💾 Download JSON
              </button>
              <div className="data-count">
                Generated {generatedData.length} {dataType}(s)
              </div>
            </div>

            <div className="output-section">
              <pre>{JSON.stringify(generatedData, null, 2)}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MockDataGenerator
