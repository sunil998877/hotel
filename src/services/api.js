import apiClient from './apiClient';

/* ==================== Hospital Services ==================== */
export const hospitalService = {
  searchNearby: async (latitude, longitude, radius = 10, disease = '', facilities = '') => {
    const response = await apiClient.get('/hospitals/nearby', {
      params: { latitude, longitude, radius, disease, facilities },
    });
    return response.data;
  },

  searchByLocation: async (searchInput, disease = '', facilities = '', latitude = null, longitude = null) => {
    const params = { q: searchInput, disease, facilities };
    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    const response = await apiClient.get('/hospitals/search', { params });
    return response.data;
  },

  getHospitalDetails: async (hospitalId, disease = '') => {
    const params = {};
    if (disease) params.disease = disease;
    const response = await apiClient.get(`/hospitals/${hospitalId}`, { params });
    return response.data;
  },

  getTestCosts: async (hospitalId) => {
    const response = await apiClient.get(`/hospitals/${hospitalId}/tests`);
    return response.data;
  },

  getTreatmentCosts: async (hospitalId) => {
    const response = await apiClient.get(`/hospitals/${hospitalId}/treatments`);
    return response.data;
  },

  getRatings: async (hospitalId) => {
    const response = await apiClient.get(`/hospitals/${hospitalId}/ratings`);
    return response.data;
  },
};

/* ==================== Auth Services ==================== */
export const authService = {
  // ✅ FIXED: register → signup
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      // Return formatted backend error to caller for UI handling
      if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    }
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });

    if (response.data?.accessToken) {
      localStorage.setItem('authToken', response.data.accessToken);
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

/* ==================== Geocoding Services ==================== */
export const geocodingService = {
  getCoordinates: async (address) => {
    const response = await apiClient.post('/geocoding/coordinates', { address });
    return response.data;
  },
};
