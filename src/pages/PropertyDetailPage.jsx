import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HomeIcon, MapPinIcon, CalendarIcon, CheckIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import { propertyService } from '../services/propertyService';
import { paymentAPI } from '../services/paymentAPI'; // Assuming you have a payment API service

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState( null );
  const [loading, setLoading] = useState( true );
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
  useEffect( () => {
    // TODO: Implement API call to fetch property details
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getPropertyById( id );

        setProperty( response );
      } catch ( error ) {
        console.error( 'Error fetching property:', error );
      } finally {
        setLoading( false );
      }
    };
    fetchProperty();


  }, [id] );

  if ( loading ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-600">Loading property details...</div>
        </div>
      </div>
    );
  }

  if ( !property ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
          <p className="text-gray-600 mt-2 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.location.href = '/properties'} className="mt-4">
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const handlePurchase = async () => {
    try {
      const orderData = await paymentAPI.createOrder( property.price, "USD" );

      const options = {
        key: RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DreamHome',
        description: property.title,
        order_id: orderData.id,
        handler: function ( response ) {
          alert( 'Payment successful: ' + response.razorpay_payment_id );
          // TODO: Call your backend to verify payment and update property status
        },
        //add your details like contact number and email to verify the test payment process
        // prefill: {
        //   name: 'Customer Name',
        //   email: 'customer@example.com',
        //   contact: '9999999999',
        // },
        theme: {
          color: '#6366F1',
        },
      };

      const rzp = new window.Razorpay( options );
      rzp.open();
    } catch ( error ) {
      console.error( 'Purchase error:', error );
      alert( 'Failed to initiate payment' );
    }
  };

  const formatPrice = ( price ) => {
    return new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    } ).format( price );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/properties'}
          >
            ← Back to Properties
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={property.imageUrls?.[0] || 'https://via.placeholder.com/600x400'}
              alt={property.title}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                {property.status === 'Sold' && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Sold
                  </span>
                )}
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span className="text-lg">{property.city}</span>
              </div>

              <div className="text-3xl font-bold text-primary-600 mb-6">
                {formatPrice( property.price )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.squareFeet}</div>
                  <div className="text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                  <div className="text-gray-600">Built</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features?.map( ( feature, index ) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ) )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Property Details</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="text-gray-900 font-medium">Residential</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${property.status === 'For Sale' ? 'text-green-600' : 'text-red-600'}`}>
                    {property.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="text-gray-900 font-medium">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID:</span>
                  <span className="text-gray-900 font-medium">#{property.id.toString().padStart( 6, '0' )}</span>
                </div>
              </div>

              {property.status?.toString().toLowerCase() === 'available' ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePurchase}
                >
                  Buy Now
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled
                >
                  Property Sold
                </Button>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Interested? Contact our sales team for more information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;