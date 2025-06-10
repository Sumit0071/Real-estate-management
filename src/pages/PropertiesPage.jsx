import { useState, useEffect } from 'react';
import PropertyCard from '../components/ui/PropertyCard';
import Button from '../components/ui/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { propertyService } from '../services/propertyService';
const PropertiesPage = () => {
  const [properties, setProperties] = useState( [] );
  const [loading, setLoading] = useState( true );
  const [filters, setFilters] = useState( {
    location: '',
    priceRange: '',
    search: ''
  } );
  const [currentPage, setCurrentPage] = useState( 1 );
  const propertiesPerPage = 6;

  useEffect( () => {
    // TODO: Implement API call to fetch properties
    const fetchProperties = async () => {
      try {
        const response = await propertyService.getAvailableProperties();
        console.log( 'Fetched properties:', response.content );
        setProperties( response.content );
      } catch ( error ) {
        console.error( 'Error fetching properties:', error );
      } finally {
        setLoading( false );
      }
    };
    fetchProperties();


  }, [] );

  const handleFilterChange = ( e ) => {
    const { name, value } = e.target;
    setFilters( prev => ( {
      ...prev,
      [name]: value
    } ) );
    setCurrentPage( 1 ); // Reset to first page when filters change
  };

  const handleSearch = async () => {
    // TODO: Implement API call with filters
    try {
      setLoading( true );
      const response = await propertyService.searchProperties( filters );
      setProperties( response.data );
    } catch ( error ) {
      console.error( 'Error searching properties:', error );
    } finally {
      setLoading( false );
    }
  };

  const handleViewDetails = ( propertyId ) => {
    window.location.href = `/property/${propertyId}`;
  };

  // Filter properties based on current filters
  const filteredProperties = properties.filter( property => {
    const matchesLocation = !filters.location ||
      property.location.toLowerCase().includes( filters.location.toLowerCase() );

    const matchesSearch = !filters.search ||
      property.title.toLowerCase().includes( filters.search.toLowerCase() ) ||
      property.location.toLowerCase().includes( filters.search.toLowerCase() );

    let matchesPrice = true;
    if ( filters.priceRange ) {
      switch ( filters.priceRange ) {
        case 'under-400k':
          matchesPrice = property.price < 400000;
          break;
        case '400k-600k':
          matchesPrice = property.price >= 400000 && property.price <= 600000;
          break;
        case 'over-600k':
          matchesPrice = property.price > 600000;
          break;
        default:
          matchesPrice = true;
      }
    }

    return matchesLocation && matchesSearch && matchesPrice;
  } );

  // Pagination
  const totalPages = Math.ceil( filteredProperties.length / propertiesPerPage );
  const startIndex = ( currentPage - 1 ) * propertiesPerPage;
  const currentProperties = filteredProperties.slice( startIndex, startIndex + propertiesPerPage );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">All Properties</h1>

          {/* Filter Bar */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search properties..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Locations</option>
                  <option value="Downtown">Downtown</option>
                  <option value="Suburbs">Suburbs</option>
                  <option value="Arts District">Arts District</option>
                  <option value="Miami Beach">Miami Beach</option>
                </select>
              </div>

              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Prices</option>
                  <option value="under-400k">Under $400k</option>
                  <option value="400k-600k">$400k - $600k</option>
                  <option value="over-600k">Over $600k</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {currentProperties.length} of {filteredProperties.length} properties
            </p>
          </div>
        )}

        {/* Property Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading properties...</div>
          </div>
        ) : currentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentProperties.map( ( property ) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ) )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No properties available</p>
            <p className="text-gray-400">Please check back later or contact us for more information.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage( prev => Math.max( prev - 1, 1 ) )}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {[...Array( totalPages )].map( ( _, index ) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                onClick={() => setCurrentPage( index + 1 )}
              >
                {index + 1}
              </Button>
            ) )}

            <Button
              variant="secondary"
              onClick={() => setCurrentPage( prev => Math.min( prev + 1, totalPages ) )}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;