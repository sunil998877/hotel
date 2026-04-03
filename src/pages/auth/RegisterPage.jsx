import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Stack,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    useTheme,
} from '@mui/material';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
} from 'lucide-react';

import { PrimaryButton, HealthcareCard } from '../../styles/styledComponents';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { register, loading, error } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [localError, setLocalError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.phone) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Phone must be 10 digits';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            errors.agreeTerms = 'You must agree to the terms';
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
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
            };

            if (formData.phone) {
                payload.phone = String(formData.phone).replace(/\D/g, '');
            }

            await register(payload);

            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            // err is expected to be backend payload (or axios error)
            const payload = err?.response?.data || err;

            // Handle validation errors mapping
            if (payload?.code === 'VALIDATION_ERROR' && payload.errors) {
                // payload.errors is an object mapping field -> { msg, param, value }
                const fieldErrors = {};
                Object.keys(payload.errors).forEach((k) => {
                    fieldErrors[k] = payload.errors[k].msg || payload.errors[k].message || 'Invalid';
                });
                setValidationErrors(fieldErrors);
                setLocalError('Please correct the highlighted fields.');
                return;
            }

            setLocalError(payload?.message || 'Registration failed. Please try again.');
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
                    <Box p={4}>
                        {/* Header */}
                        <Box textAlign="center" mb={4}>
                            <Typography
                                variant="h3"
                                fontWeight={800}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Create Account
                            </Typography>
                            <Typography color="text.secondary">
                                Join Smart Hospital Discovery
                            </Typography>
                        </Box>

                        {/* Errors */}
                        {(error || localError) && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error || localError}
                            </Alert>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                {/* Name */}
                                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        error={!!validationErrors.firstName}
                                        helperText={validationErrors.firstName}
                                        InputProps={{
                                            startAdornment: (
                                                <User size={16} style={{ marginRight: 8 }} />
                                            ),
                                        }}
                                    />
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        error={!!validationErrors.lastName}
                                        helperText={validationErrors.lastName}
                                        InputProps={{
                                            startAdornment: (
                                                <User size={16} style={{ marginRight: 8 }} />
                                            ),
                                        }}
                                    />
                                </Box>

                                {/* Email */}
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!validationErrors.email}
                                    helperText={validationErrors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <Mail size={16} style={{ marginRight: 8 }} />
                                        ),
                                    }}
                                />

                                {/* Phone */}
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={!!validationErrors.phone}
                                    helperText={validationErrors.phone}
                                    InputProps={{
                                        startAdornment: (
                                            <Phone size={16} style={{ marginRight: 8 }} />
                                        ),
                                    }}
                                />

                                {/* Password */}
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!validationErrors.password}
                                    helperText={validationErrors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <Lock size={16} style={{ marginRight: 8 }} />
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {/* Confirm Password */}
                                <TextField
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={!!validationErrors.confirmPassword}
                                    helperText={validationErrors.confirmPassword}
                                    InputProps={{
                                        startAdornment: (
                                            <Lock size={16} style={{ marginRight: 8 }} />
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff size={16} />
                                                    ) : (
                                                        <Eye size={16} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {/* Terms */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="I agree to the Terms & Conditions"
                                />
                                {validationErrors.agreeTerms && (
                                    <Typography variant="caption" color="error">
                                        {validationErrors.agreeTerms}
                                    </Typography>
                                )}

                                {/* Submit */}
                                <PrimaryButton
                                    type="submit"
                                    fullWidth
                                    disabled={isSubmitting}
                                    endIcon={
                                        isSubmitting ? (
                                            <CircularProgress size={18} color="inherit" />
                                        ) : (
                                            <ArrowRight size={18} />
                                        )
                                    }
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                                </PrimaryButton>
                            </Stack>
                        </form>

                        {/* Login Link */}
                        <Box textAlign="center" mt={3}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link to="/login" style={{ fontWeight: 700 }}>
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </HealthcareCard>
            </Container>
        </Box>
    );
};

export default RegisterPage;
