import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import { Edit, LogOut, MapPin, Mail, Phone } from 'lucide-react';
import { PrimaryButton, HealthcareCard, SectionWrapper } from '../styles/styledComponents';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock user data
  const userData = user || {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    location: 'New Delhi',
    savedHospitals: 5,
    bookings: 3,
    joinDate: 'January 2024',
  };

  return (
    <Box>
      {/* Profile Header */}
      <Box sx={{ backgroundColor: theme.palette.primary.lighter, py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="start">
            <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  fontSize: '3rem',
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                {userData.firstName[0]}
              </Avatar>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Member since {userData.joinDate}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                startIcon={<Edit size={18} />}
                variant="outlined"
                sx={{ mb: 1 }}
              >
                Edit Profile
              </Button>
              <Button
                fullWidth
                startIcon={<LogOut size={18} />}
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Saved Hospitals', value: userData.savedHospitals, color: 'primary' },
            { label: 'Bookings', value: userData.bookings, color: 'secondary' },
            { label: 'Reviews', value: 2, color: 'info' },
          ].map((stat, idx) => (
            <Grid item xs={6} sm={4} key={idx}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: `${stat.color}.main`,
                      mb: 0.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Personal Information */}
        <SectionWrapper sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                defaultValue={userData.firstName}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                defaultValue={userData.lastName}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                defaultValue={userData.email}
                fullWidth
                disabled
                InputProps={{
                  startAdornment: <Mail size={18} style={{ marginRight: '8px' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                defaultValue={userData.phone}
                fullWidth
                disabled
                InputProps={{
                  startAdornment: <Phone size={18} style={{ marginRight: '8px' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                defaultValue={userData.location}
                fullWidth
                disabled
                InputProps={{
                  startAdornment: <MapPin size={18} style={{ marginRight: '8px' }} />,
                }}
              />
            </Grid>
          </Grid>

          <Button variant="contained" sx={{ mt: 3 }}>
            Update Information
          </Button>
        </SectionWrapper>

        {/* Recent Bookings */}
        <SectionWrapper sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Recent Bookings
          </Typography>

          <Stack gap={2}>
            {[
              {
                hospital: 'City Medical Center',
                service: 'General Consultation',
                date: 'Feb 15, 2025 - 2:00 PM',
                status: 'Confirmed',
              },
              {
                hospital: 'Apollo Hospital',
                service: 'Blood Test',
                date: 'Feb 12, 2025 - 10:00 AM',
                status: 'Completed',
              },
              {
                hospital: 'Max Healthcare',
                service: 'CT Scan',
                date: 'Feb 10, 2025 - 3:30 PM',
                status: 'Completed',
              },
            ].map((booking, idx) => (
              <Card key={idx}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {booking.hospital}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {booking.service}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        backgroundColor:
                          booking.status === 'Completed'
                            ? theme.palette.secondary.lighter
                            : theme.palette.primary.lighter,
                        color:
                          booking.status === 'Completed'
                            ? theme.palette.secondary.main
                            : theme.palette.primary.main,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {booking.status}
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {booking.date}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
            View All Bookings
          </Button>
        </SectionWrapper>

        {/* Saved Hospitals */}
        <SectionWrapper>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Saved Hospitals
          </Typography>

          <Stack gap={2}>
            {['City Medical Center', 'Apollo Hospital', 'Max Healthcare', 'Fortis Hospital', 'Manipal Hospital'].map(
              (hospital, idx) => (
                <Card key={idx}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {hospital}
                    </Typography>
                    <Stack direction="row" gap={1}>
                      <Button size="small" variant="outlined">
                        View
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Remove
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )
            )}
          </Stack>
        </SectionWrapper>
      </Container>
    </Box>
  );
};

export default ProfilePage;
