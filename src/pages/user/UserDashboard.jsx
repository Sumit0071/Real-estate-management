import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CalendarIcon, HomeIcon } from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const { user } = useAuth();
  const [userPurchases, setUserPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch user purchases
    // const fetchUserPurchases = async () => {
    //   try {
    //     const response = await userAPI.getUserPurchases(user?.id);
    //     setUserPurchases(response.data);
    //   } catch (error) {
    //     console.error('Error fetching user purchases:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // if (user?.id) {
    //   fetchUserPurchases();
    // }

    // Temporary placeholder
    setUserPurchases([]);
    setLoading(false);
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your properties and track your real estate investments.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <HomeIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : userPurchases.length}
                </div>
                <div className="text-gray-600">Properties Owned</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(userPurchases.reduce((total, purchase) => total + purchase.amount, 0))}
                </div>
                <div className="text-gray-600">Total Investment</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent-100">
                <HomeIcon className="h-6 w-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {userPurchases.length > 0 ? formatPrice(userPurchases[userPurchases.length - 1].amount) : '$0'}
                </div>
                <div className="text-gray-600">Latest Purchase</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Purchased Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Purchased Properties</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading your properties...</div>
            </div>
          ) : userPurchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPurchases.map((purchase) => (
                <div key={purchase.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={purchase.image}
                    alt={purchase.propertyTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {purchase.propertyTitle}
                    </h3>
                    <div className="text-primary-600 font-bold text-xl mb-2">
                      {formatPrice(purchase.amount)}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Purchased on {formatDate(purchase.purchaseDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HomeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't purchased any properties yet. Browse our listings to find your dream home!
              </p>
              <a
                href="/properties"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Properties
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;