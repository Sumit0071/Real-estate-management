import { HomeIcon, BanknotesIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const PropertyCard = ({ property, onViewDetails }) => {
  const formatPrice = (price) => {
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
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.status === 'Sold' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            Sold
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center text-primary-600 font-bold text-xl mb-3">
          <BanknotesIcon className="h-5 w-5 mr-1" />
          {formatPrice(property.price)}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            {property.bedrooms} Beds
          </div>
          <div>{property.bathrooms} Baths</div>
          <div>{property.area.toLocaleString()} sqft</div>
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