import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Mail, Lock, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { PrimaryButton, HealthcareCard } from '../../styles/styledComponents';
import { authService } from '../../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Step 1: Request Reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!email) {
      setValidationErrors({ email: 'Email is required' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationErrors({ email: 'Invalid email format' });
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep(1);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const errors = {};
    if (!resetToken.trim()) errors.resetToken = 'Verification code is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    if (newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword);
      setStep(2);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
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
            {/* Stepper */}
            <Stepper activeStep={step} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Enter Email</StepLabel>
              </Step>
              <Step>
                <StepLabel>Reset Password</StepLabel>
              </Step>
              <Step>
                <StepLabel>Complete</StepLabel>
              </Step>
            </Stepper>

            {/* Step 0: Request Reset */}
            {step === 0 && (
              <>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Mail size={48} color={theme.palette.primary.main} style={{ marginBottom: '16px', opacity: 0.8 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                    Forgot Password?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleRequestReset}>
                  <Stack gap={2.5}>
                    <TextField
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationErrors({ ...validationErrors, email: '' });
                      }}
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

                    <PrimaryButton
                      fullWidth
                      type="submit"
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </PrimaryButton>
                  </Stack>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
                  <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/login')}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Back to Login
                  </Button>
                </Box>
              </>
            )}

            {/* Step 1: Reset Password */}
            {step === 1 && (
              <>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Lock size={48} color={theme.palette.primary.main} style={{ marginBottom: '16px', opacity: 0.8 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                    Reset Your Password
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Enter the verification code and your new password.
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleResetPassword}>
                  <Stack gap={2.5}>
                    <TextField
                      label="Verification Code"
                      value={resetToken}
                      onChange={(e) => {
                        setResetToken(e.target.value);
                        setValidationErrors({ ...validationErrors, resetToken: '' });
                      }}
                      fullWidth
                      placeholder="Enter code from email"
                      error={!!validationErrors.resetToken}
                      helperText={validationErrors.resetToken}
                    />

                    <TextField
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setValidationErrors({ ...validationErrors, newPassword: '' });
                      }}
                      fullWidth
                      placeholder="At least 8 characters"
                      error={!!validationErrors.newPassword}
                      helperText={validationErrors.newPassword}
                    />

                    <TextField
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setValidationErrors({ ...validationErrors, confirmPassword: '' });
                      }}
                      fullWidth
                      placeholder="Repeat password"
                      error={!!validationErrors.confirmPassword}
                      helperText={validationErrors.confirmPassword}
                    />

                    <PrimaryButton
                      fullWidth
                      type="submit"
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </PrimaryButton>
                  </Stack>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
                  <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => setStep(0)}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Back to Email
                  </Button>
                </Box>
              </>
            )}

            {/* Step 2: Success */}
            {step === 2 && (
              <>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Check size={40} color="white" />
                  </Box>

                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                    Password Reset Successful!
                  </Typography>

                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
                    Your password has been reset successfully. You can now log in with your new password.
                  </Typography>

                  <PrimaryButton
                    fullWidth
                    onClick={() => navigate('/login')}
                    endIcon={<ArrowRight size={18} />}
                  >
                    Go to Login
                  </PrimaryButton>
                </Box>
              </>
            )}
          </CardContent>
        </HealthcareCard>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
