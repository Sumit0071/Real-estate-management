import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import AddPropertyModal from '../../components/admin/AddPropertyModal';
import { adminPropertyService } from '../../services/propertyService';

const ManageProperties = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const properties = await adminPropertyService.getAllProperties();
      setPropertyList(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddProperty = async (propertyData) => {
    try {
      const newProperty = await adminPropertyService.createProperty(propertyData);
      setPropertyList([...propertyList, newProperty]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding property:', error);
      setError('Failed to add property');
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleUpdateProperty = async (propertyData) => {
    try {
      const updatedProperty = await adminPropertyService.updateProperty(editingProperty.id, propertyData);
      setPropertyList(propertyList.map(p => p.id === editingProperty.id ? updatedProperty : p));
      setIsModalOpen(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
      setError('Failed to update property');
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await adminPropertyService.deleteProperty(propertyId);
        setPropertyList(propertyList.filter(property => property.id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
        setError('Failed to delete property');
      }
    }
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
            <a href="/admin/dashboard" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Dashboard
            </a>
            <a href="/admin/properties" className="block px-6 py-3 text-gray-900 bg-primary-50 border-r-2 border-primary-600">
              Manage Properties
            </a>
            <a href="/admin/users" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Users
            </a>
            <a href="/admin/inquiries" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Inquiries
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Properties</h1>
              <p className="text-gray-600 mt-2">Add, edit, and manage your property listings</p>
            </div>
            <Button
              onClick={() => {
                setEditingProperty(null);
                setIsModalOpen(true);
              }}
              className="flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Property
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Properties Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading properties...</div>
              </div>
            ) : propertyList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {propertyList.map((property) => (
                      <tr key={property.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : '/placeholder-property.jpg'}
                            alt={property.title}
                            className="h-16 w-24 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.city}, {property.state}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatPrice(property.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === 'AVAILABLE'
                              ? 'bg-green-100 text-green-800'
                              : property.status === 'SOLD'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(property)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600 mb-4">No properties found</div>
                <p className="text-gray-500">Start by adding your first property using the button above.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Property Modal */}
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={editingProperty ? handleUpdateProperty : handleAddProperty}
        property={editingProperty}
      />
    </div>
  );
};

export default ManageProperties;