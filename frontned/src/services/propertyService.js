import api from './api';

export const propertyService = {
  // Get all available properties (public endpoint)
  getAvailableProperties: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    try {
      const response = await api.get('/properties/public', {
        params: { page, size, sortBy, sortDir }
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch properties' };
    }
  },

  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch property' };
    }
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    try {
      const response = await api.get('/properties/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured properties' };
    }
  },

  // Search properties
  searchProperties: async (keyword, page = 0, size = 10) => {
    try {
      const response = await api.get('/properties/search', {
        params: { keyword, page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search properties' };
    }
  },

  // Filter properties
  filterProperties: async (filters) => {
    try {
      const response = await api.get('/properties/filter', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to filter properties' };
    }
  }
};

// Admin property service (requires authentication)
export const adminPropertyService = {
  // Get all properties (admin)
  getAllProperties: async () => {
    try {
      const response = await api.get('/properties/admin/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all properties' };
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties/admin', propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create property' };
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/admin/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update property' };
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/properties/admin/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete property' };
    }
  },

  // Update property status
  updatePropertyStatus: async (id, status) => {
    try {
      const response = await api.put(`/properties/admin/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update property status' };
    }
  }
};
