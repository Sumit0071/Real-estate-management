import { HomeIcon, BanknotesIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const PropertyCard = ({ property, onViewDetails }) => {
  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="property-card">
      <div className="aspect-w-16 aspect-h-9 relative">
        <img 
          src={property.imageUrls ?.[0]||'https://via.placeholder.com/300x200'} 
          alt={property.title || 'Property Image'}
          className="w-full h-48 object-cover"
        />
        {property.status === 'Sold' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            Sold
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {property.title || 'Untitled Property'}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          {/* here location parameter for filtering needs to be changed or cities need to be included in the parameters for filtering */}
          <span className="text-sm">{property.city || 'Unknown Location'}</span>
        </div>
        
        <div className="flex items-center text-primary-600 font-bold text-xl mb-3">
          <BanknotesIcon className="h-5 w-5 mr-1" />
          {formatPrice(property.price)}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            {property.bedrooms ?? 'N/A'} Beds
          </div>
          <div>{property.bathrooms ?? 'N/A'} Baths</div>
          <div>{property.squareFeet ? `${property.squareFeet.toLocaleString()} sqft` : 'N/A sqft'}</div>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full"
          onClick={() => onViewDetails(property.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
