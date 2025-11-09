import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/HTTPStatusReference.css'

function HTTPStatusReference() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const statusCodes = {
    '1xx': {
      name: 'Informational',
      color: '#3b82f6',
      codes: {
        100: { name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.' },
        101: { name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
        102: { name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.' },
        103: { name: 'Early Hints', description: 'Used to return some response headers before final HTTP message.' }
      }
    },
    '2xx': {
      name: 'Success',
      color: '#10b981',
      codes: {
        200: { name: 'OK', description: 'The request has succeeded. The meaning depends on the HTTP method used.' },
        201: { name: 'Created', description: 'The request has been fulfilled and resulted in a new resource being created.' },
        202: { name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.' },
        203: { name: 'Non-Authoritative Information', description: 'The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version.' },
        204: { name: 'No Content', description: 'The server successfully processed the request but is not returning any content.' },
        205: { name: 'Reset Content', description: 'The server successfully processed the request but is not returning any content and requires requester to reset document view.' },
        206: { name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client.' }
      }
    },
    '3xx': {
      name: 'Redirection',
      color: '#f59e0b',
      codes: {
        300: { name: 'Multiple Choices', description: 'Indicates multiple options for the resource from which the client may choose.' },
        301: { name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI.' },
        302: { name: 'Found', description: 'The resource was found but at a different URI. Client should continue to use the original URI for future requests.' },
        303: { name: 'See Other', description: 'The response to the request can be found under another URI using a GET method.' },
        304: { name: 'Not Modified', description: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
        307: { name: 'Temporary Redirect', description: 'The request should be repeated with another URI but future requests should still use the original URI.' },
        308: { name: 'Permanent Redirect', description: 'The request and all future requests should be repeated using another URI.' }
      }
    },
    '4xx': {
      name: 'Client Error',
      color: '#ef4444',
      codes: {
        400: { name: 'Bad Request', description: 'The server cannot process the request due to client error (e.g., malformed request syntax).' },
        401: { name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided.' },
        402: { name: 'Payment Required', description: 'Reserved for future use. Originally intended for digital payment systems.' },
        403: { name: 'Forbidden', description: 'The request was valid but the server is refusing action. The user might not have necessary permissions.' },
        404: { name: 'Not Found', description: 'The requested resource could not be found but may be available in the future.' },
        405: { name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource.' },
        406: { name: 'Not Acceptable', description: 'The requested resource is capable of generating only content not acceptable according to the Accept headers.' },
        407: { name: 'Proxy Authentication Required', description: 'The client must first authenticate itself with the proxy.' },
        408: { name: 'Request Timeout', description: 'The server timed out waiting for the request.' },
        409: { name: 'Conflict', description: 'The request could not be processed because of conflict in the current state of the resource.' },
        410: { name: 'Gone', description: 'The resource requested is no longer available and will not be available again.' },
        411: { name: 'Length Required', description: 'The request did not specify the length of its content, which is required by the requested resource.' },
        412: { name: 'Precondition Failed', description: 'The server does not meet one of the preconditions that the requester put on the request.' },
        413: { name: 'Payload Too Large', description: 'The request is larger than the server is willing or able to process.' },
        414: { name: 'URI Too Long', description: 'The URI provided was too long for the server to process.' },
        415: { name: 'Unsupported Media Type', description: 'The request entity has a media type which the server or resource does not support.' },
        416: { name: 'Range Not Satisfiable', description: 'The client has asked for a portion of the file, but the server cannot supply that portion.' },
        417: { name: 'Expectation Failed', description: 'The server cannot meet the requirements of the Expect request-header field.' },
        418: { name: "I'm a teapot", description: "Any attempt to brew coffee with a teapot should result in the error code 418 I'm a teapot. (April Fools' joke)" },
        422: { name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors.' },
        423: { name: 'Locked', description: 'The resource that is being accessed is locked.' },
        424: { name: 'Failed Dependency', description: 'The request failed due to failure of a previous request.' },
        425: { name: 'Too Early', description: 'The server is unwilling to risk processing a request that might be replayed.' },
        426: { name: 'Upgrade Required', description: 'The client should switch to a different protocol.' },
        428: { name: 'Precondition Required', description: 'The origin server requires the request to be conditional.' },
        429: { name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time (rate limiting).' },
        431: { name: 'Request Header Fields Too Large', description: 'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.' },
        451: { name: 'Unavailable For Legal Reasons', description: 'A server operator has received a legal demand to deny access to a resource.' }
      }
    },
    '5xx': {
      name: 'Server Error',
      color: '#8b5cf6',
      codes: {
        500: { name: 'Internal Server Error', description: 'A generic error message when the server encounters an unexpected condition.' },
        501: { name: 'Not Implemented', description: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.' },
        502: { name: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
        503: { name: 'Service Unavailable', description: 'The server is currently unavailable (overloaded or down for maintenance).' },
        504: { name: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
        505: { name: 'HTTP Version Not Supported', description: 'The server does not support the HTTP protocol version used in the request.' },
        506: { name: 'Variant Also Negotiates', description: 'Transparent content negotiation for the request results in a circular reference.' },
        507: { name: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request.' },
        508: { name: 'Loop Detected', description: 'The server detected an infinite loop while processing the request.' },
        510: { name: 'Not Extended', description: 'Further extensions to the request are required for the server to fulfill it.' },
        511: { name: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access.' }
      }
    }
  }

  const filterCodes = () => {
    const allCodes = []
    
    Object.entries(statusCodes).forEach(([category, data]) => {
      if (selectedCategory !== 'all' && category !== selectedCategory) return
      
      Object.entries(data.codes).forEach(([code, info]) => {
        const matchesSearch = searchTerm === '' || 
          code.includes(searchTerm) ||
          info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          info.description.toLowerCase().includes(searchTerm.toLowerCase())
        
        if (matchesSearch) {
          allCodes.push({
            code: parseInt(code),
            ...info,
            category,
            categoryName: data.name,
            color: data.color
          })
        }
      })
    })
    
    return allCodes.sort((a, b) => a.code - b.code)
  }

  const filteredCodes = filterCodes()

  return (
    <div className="http-status-reference">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="reference-container">
        <h1>HTTP Status Codes</h1>
        <p className="subtitle">Complete reference guide for HTTP status codes</p>

        <div className="filters-section">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code, name, or description..."
            className="search-input"
          />

          <div className="category-filters">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All ({Object.values(statusCodes).reduce((sum, cat) => sum + Object.keys(cat.codes).length, 0)})
            </button>
            {Object.entries(statusCodes).map(([key, data]) => (
              <button
                key={key}
                className={`filter-btn ${selectedCategory === key ? 'active' : ''}`}
                style={{ '--category-color': data.color }}
                onClick={() => setSelectedCategory(key)}
              >
                {data.name} ({Object.keys(data.codes).length})
              </button>
            ))}
          </div>
        </div>

        <div className="codes-section">
          {filteredCodes.length === 0 ? (
            <div className="no-results">
              No status codes match your search.
            </div>
          ) : (
            filteredCodes.map((item) => (
              <div
                key={item.code}
                className="code-card"
                style={{ borderLeftColor: item.color }}
              >
                <div className="code-header">
                  <div className="code-number" style={{ color: item.color }}>
                    {item.code}
                  </div>
                  <div className="code-info">
                    <h3>{item.name}</h3>
                    <span className="code-category">{item.categoryName}</span>
                  </div>
                </div>
                <p className="code-description">{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HTTPStatusReference
