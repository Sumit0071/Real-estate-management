import { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import { authService } from '../services/authService';

const TestApiPage = () => {
  const [apiStatus, setApiStatus] = useState({
    backend: 'checking',
    properties: 'checking',
    auth: 'checking'
  });
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    testApiConnections();
  }, []);

  const testApiConnections = async () => {
    // Test 1: Check if backend is running
    try {
      const response = await fetch('http://localhost:8080/api/properties/public');
      if (response.ok) {
        setApiStatus(prev => ({ ...prev, backend: 'connected' }));
        
        // Test 2: Try to fetch properties
        try {
          const propertiesData = await propertyService.getAvailableProperties();
          setProperties(propertiesData.content || []);
          setApiStatus(prev => ({ ...prev, properties: 'working' }));
        } catch (propError) {
          console.error('Properties API error:', propError);
          setApiStatus(prev => ({ ...prev, properties: 'error' }));
        }
      } else {
        setApiStatus(prev => ({ ...prev, backend: 'error', properties: 'error' }));
      }
    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      setApiStatus(prev => ({ ...prev, backend: 'error', properties: 'error' }));
      setError('Cannot connect to backend. Make sure the Spring Boot server is running on http://localhost:8080');
    }

    // Test 3: Check auth endpoints
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' })
      });
      // Even if login fails, if we get a response, the auth endpoint is working
      setApiStatus(prev => ({ ...prev, auth: 'working' }));
    } catch (authError) {
      console.error('Auth API error:', authError);
      setApiStatus(prev => ({ ...prev, auth: 'error' }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'working':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'checking':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return '✓ Connected';
      case 'working':
        return '✓ Working';
      case 'error':
        return '✗ Error';
      case 'checking':
        return '⏳ Checking...';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* API Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Backend Server</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apiStatus.backend)}`}>
                {getStatusText(apiStatus.backend)}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Spring Boot server on port 8080
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Properties API</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apiStatus.properties)}`}>
                {getStatusText(apiStatus.properties)}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Property endpoints and data
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Authentication API</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apiStatus.auth)}`}>
                {getStatusText(apiStatus.auth)}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Login and registration endpoints
              </p>
            </div>
          </div>

          {/* Properties Data */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sample Properties Data ({properties.length} items)
            </h2>
            
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.slice(0, 6).map((property, index) => (
                  <div key={property.id || index} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{property.title || 'Property Title'}</h3>
                    <p className="text-sm text-gray-600">{property.location || 'Location'}</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${property.price?.toLocaleString() || 'Price not available'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No properties data available. This could mean:</p>
            )}
          </div>

          {/* Instructions */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Instructions</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900">1. Start the Backend Server:</h3>
                <code className="bg-gray-100 px-2 py-1 rounded">cd backend && mvn spring-boot:run</code>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">2. Verify Database Connection:</h3>
                <p>Make sure MySQL is running and the database 'dreamhome_db' exists</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">3. Check CORS Configuration:</h3>
                <p>Backend should allow origins: http://localhost:5173, http://localhost:3000</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={testApiConnections}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retest Connections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestApiPage;
