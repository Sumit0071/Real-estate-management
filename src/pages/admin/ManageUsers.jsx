import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'USER',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(currentPage, 10);
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await adminService.searchUsers(searchQuery);
      setUsers(searchResults);
      setTotalPages(1);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: 'USER',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
      } else {
        await adminService.createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      if (isActive) {
        await adminService.deactivateUser(userId);
      } else {
        await adminService.activateUser(userId);
      }
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Failed to update user status');
    }
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
            <a href="/admin/dashboard" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Dashboard
            </a>
            <a href="/admin/users" className="block px-6 py-3 text-gray-900 bg-primary-50 border-r-2 border-primary-600">
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-600 mt-2">Create, edit, and manage user accounts</p>
            </div>
            <Button
              onClick={handleCreateUser}
              className="flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New User
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users by name, email, or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button onClick={handleSearch} className="flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search
              </Button>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  fetchUsers();
                }}
                variant="secondary"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading users...</div>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                              className={`${
                                user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
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
                <div className="text-xl text-gray-600 mb-4">No users found</div>
                <p className="text-gray-500">Start by adding your first user using the button above.</p>
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

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                )}
                {editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>
                  {editingUser ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
