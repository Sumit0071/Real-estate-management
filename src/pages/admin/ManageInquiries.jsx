import { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [currentPage]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllInquiries(currentPage, 10);
      setInquiries(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponse(inquiry.adminResponse || '');
    setIsModalOpen(true);
  };

  const handleSaveResponse = async () => {
    try {
      await adminService.respondToInquiry(selectedInquiry.id, response);
      setIsModalOpen(false);
      setSelectedInquiry(null);
      setResponse('');
      fetchInquiries();
    } catch (error) {
      console.error('Error saving response:', error);
      setError('Failed to save response');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'RESPONDED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESPONDED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <a href="/admin/users" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Users
            </a>
            <a href="/admin/properties" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Properties
            </a>
            <a href="/admin/inquiries" className="block px-6 py-3 text-gray-900 bg-primary-50 border-r-2 border-primary-600">
              Manage Inquiries
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Inquiries</h1>
            <p className="text-gray-600 mt-2">View and respond to property inquiries</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Inquiries Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading inquiries...</div>
              </div>
            ) : inquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {inquiry.user.firstName} {inquiry.user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{inquiry.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inquiry.property.city}, {inquiry.property.state}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {inquiry.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(inquiry.status)}
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                              {inquiry.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            onClick={() => handleRespond(inquiry)}
                            variant="primary"
                            size="sm"
                          >
                            {inquiry.status === 'RESPONDED' ? 'Edit Response' : 'Respond'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600 mb-4">No inquiries found</div>
                <p className="text-gray-500">No property inquiries have been submitted yet.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Respond to Inquiry
              </h3>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Original Message:</h4>
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-900">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response:
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your response to the inquiry..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedInquiry(null);
                    setResponse('');
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveResponse}>
                  Save Response
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInquiries;
