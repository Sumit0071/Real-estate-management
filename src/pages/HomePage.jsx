import { useState, useEffect } from 'react';
import PropertyCard from '../components/ui/PropertyCard';
import Button from '../components/ui/Button';

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch featured properties
    // const fetchFeaturedProperties = async () => {
    //   try {
    //     const response = await propertyAPI.getFeaturedProperties();
    //     setFeaturedProperties(response.data);
    //   } catch (error) {
    //     console.error('Error fetching properties:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchFeaturedProperties();

    // Temporary placeholder
    setFeaturedProperties([]);
    setLoading(false);
  }, []);

  const handleViewDetails = (propertyId) => {
    window.location.href = `/property/${propertyId}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover the perfect property that matches your lifestyle and budget
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/properties'}
            className="text-xl px-8 py-4"
          >
            View Properties
          </Button>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked properties that offer the best value and location
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading featured properties...</div>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600 mb-4">No featured properties available</div>
              <p className="text-gray-500">Please check back later or browse all properties.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.href = '/properties'}
            >
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-xl">Properties Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-xl">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-xl">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;