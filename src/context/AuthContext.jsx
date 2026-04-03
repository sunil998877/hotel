import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await authService.getCurrentUser();
          // Backend returns: { status: 'success', data: { user: { ... } } }
          if (userData && userData.data && userData.data.user) {
            setUser(userData.data.user);
          } else {
             setUser(userData.data || userData);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Only clear if it's a 401/Unauthorized, otherwise keep for retry
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      
      // Save token manually to be 100% sure persistent session is ready
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      setUser(response.data.user || response.data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
  try {
    setError(null);

    // authService.register already returns backend JSON
    const payload = await authService.register(userData);

    // Do not automatically set user here; wait for them to log in manually.

    return payload;
  } catch (err) {
    setError(err?.message || 'Registration failed');
    throw err;
  }
};




  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
