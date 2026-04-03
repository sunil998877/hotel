import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  useTheme,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { PrimaryButton, HealthcareCard } from '../../styles/styledComponents';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLocalError(null);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.secondary.lighter} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <HealthcareCard>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Sign in to your Smart Hospital account
              </Typography>
            </Box>

            {/* Success Alert from Registration */}
            {location.state?.message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {location.state.message}
              </Alert>
            )}

            {/* Error Alert */}
            {(error || localError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error || localError}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Stack gap={2.5}>
                {/* Email Field */}
                <TextField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  placeholder="your@email.com"
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  InputProps={{
                    startAdornment: (
                      <Mail size={18} style={{ marginRight: '12px', color: theme.palette.primary.main }} />
                    ),
                  }}
                />

                {/* Password Field */}
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  placeholder="••••••••"
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                  InputProps={{
                    startAdornment: (
                      <Lock size={18} style={{ marginRight: '12px', color: theme.palette.primary.main }} />
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'right' }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                {/* Submit Button */}
                <PrimaryButton
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </PrimaryButton>
              </Stack>
            </form>

            {/* Sign Up Link */}
            <Box sx={{ mt: 3, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </HealthcareCard>
      </Container>
    </Box>
  );
};

export default LoginPage;
