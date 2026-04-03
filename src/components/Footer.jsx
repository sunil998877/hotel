import { Box, Container, Typography, Link, Divider, Grid, IconButton, Stack, useTheme } from '@mui/material';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Stethoscope } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0f172a',
        color: 'slate.300',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }} color="white">
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, color: 'white' }}>
              <Box
                sx={{
                  p: 0.6,
                  borderRadius: '8px',
                  bgcolor: theme.palette.primary.main,
                  display: 'flex'
                }}
              >
                <Stethoscope size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                Smart<span style={{ color: theme.palette.primary.main }}>Hospital</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8, mb: 3, maxWidth: 300 }}>
              Empowering patients with transparent healthcare discovery, cost comparison, and verified facility reviews. Find your care with confidence.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    color: 'white',
                    opacity: 0.6,
                    '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  size="small"
                >
                  <Icon size={18} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Discover Column */}
          <Grid item xs={6} md={2.5}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              Discover
            </Typography>
            <Stack spacing={1.5}>
              {['Home', 'Find Hospitals', 'Dashboard', 'Top Facilities', 'Health Packages'].map((item) => (
                <Link
                  key={item}
                  component={RouterLink}
                  to="/"
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    opacity: 0.7,
                    '&:hover': { opacity: 1, color: theme.palette.primary.main }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support Column */}
          <Grid item xs={6} md={2.5}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              Support
            </Typography>
            <Stack spacing={1.5}>
              {['How it Works', 'Privacy Policy', 'Terms of Service', 'Help Center', 'Partnerships'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    opacity: 0.7,
                    '&:hover': { opacity: 1, color: theme.palette.primary.main }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Column */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              Contact Us
            </Typography>
            <Stack spacing={2.5} sx={{ color: 'white' }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Mail size={20} color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.5 }}>Email Support</Typography>
                  <Typography variant="body2">care@smarthospital.com</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Phone size={20} color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.5 }}>Helpline</Typography>
                  <Typography variant="body2">+91 1800-CARE-NOW</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <MapPin size={20} color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.5 }}>Location</Typography>
                  <Typography variant="body2">Delhi NCR, India</Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" sx={{ opacity: 0.5 }} color="white">
            © {currentYear} Smart Hospital Discovery. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }} color="white">
            Made with ❤️ for a Healthier Bharat
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
