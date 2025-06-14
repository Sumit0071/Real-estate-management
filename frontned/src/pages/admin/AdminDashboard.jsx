import { useState, useEffect } from 'react';
import { HomeIcon, UserIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    recentUsers: [],
    recentProperties: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await adminService.getDashboardStats();
        setDashboardData(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <a href="/admin/dashboard" className="block px-6 py-3 text-gray-900 bg-primary-50 border-r-2 border-primary-600">
              Dashboard
            </a>
            <a href="/admin/users" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Users
            </a>
            <a href="/admin/properties" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Properties
            </a>
            <a href="/admin/inquiries" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Inquiries
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : dashboardData.totalUsers}
                  </div>
                  <div className="text-gray-600">Total Users</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100">
                  <HomeIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : dashboardData.totalProperties}
                  </div>
                  <div className="text-gray-600">Total Properties</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : dashboardData.soldProperties}
                  </div>
                  <div className="text-gray-600">Properties Sold</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : dashboardData.totalInquiries}
                  </div>
                  <div className="text-gray-600">Total Inquiries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading recent users...</p>
                </div>
              ) : dashboardData.recentUsers && dashboardData.recentUsers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {dashboardData.recentUsers.map((user) => (
                    <div key={user.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No recent users to display.</p>
                </div>
              )}
            </div>

            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading recent properties...</p>
                </div>
              ) : dashboardData.recentProperties && dashboardData.recentProperties.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {dashboardData.recentProperties.map((property) => (
                    <div key={property.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.city}, {property.state}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(property.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No recent properties to display.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;