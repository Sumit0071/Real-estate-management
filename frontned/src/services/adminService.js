import api from './api';

export const adminService = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard statistics' };
    }
  },

  // User Management
  getAllUsers: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    try {
      const response = await api.get('/admin/users', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  activateUser: async (id) => {
    try {
      const response = await api.put(`/admin/users/${id}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to activate user' };
    }
  },

  deactivateUser: async (id) => {
    try {
      const response = await api.put(`/admin/users/${id}/deactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to deactivate user' };
    }
  },

  searchUsers: async (query) => {
    try {
      const response = await api.get('/admin/users/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search users' };
    }
  },

  // Property Statistics
  getPropertyStats: async () => {
    try {
      const response = await api.get('/admin/properties/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch property statistics' };
    }
  },

  // Inquiry Management
  getAllInquiries: async (page = 0, size = 10) => {
    try {
      const response = await api.get('/admin/inquiries', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inquiries' };
    }
  },

  respondToInquiry: async (id, response) => {
    try {
      await api.put(`/admin/inquiries/${id}/respond`, { response });
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to respond to inquiry' };
    }
  },

  // System Information
  getSystemInfo: async () => {
    try {
      const response = await api.get('/admin/system/info');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch system information' };
    }
  }
};

export default adminService;
