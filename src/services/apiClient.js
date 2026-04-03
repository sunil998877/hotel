import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // allow cookies (for refresh token httpOnly cookie)
});

// Attach access token from localStorage (if available)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const authUrls = ['/auth/login', '/auth/signup', '/auth/refresh-token'];
    const isAuthUrl = authUrls.some((url) => originalRequest.url?.includes(url));

    if (error.response && error.response.status === 401 && !originalRequest._retry && !isAuthUrl) {
      // Attempt to refresh access token using httpOnly refresh cookie
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL.replace(/\/api\/?$/, '')}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken || refreshResponse.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem('authToken', newAccessToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
          return apiClient(originalRequest);
        }

        processQueue(new Error('Failed to refresh token'), null);
        // Redirect to login if refresh did not provide token
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default apiClient;
