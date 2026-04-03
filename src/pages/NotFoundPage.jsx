import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, useTheme } from '@mui/material';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { PrimaryButton } from '../styles/styledComponents';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.secondary.lighter} 100%)`,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <AlertCircle
            size={100}
            color={theme.palette.primary.main}
            style={{ marginBottom: '24px', opacity: 0.8 }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '3rem', md: '4rem' },
              color: theme.palette.primary.main,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              lineHeight: 1.6,
              maxWidth: '400px',
              mx: 'auto',
            }}
          >
            Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" flexDirection={{ xs: 'column', sm: 'row' }}>
            <PrimaryButton
              onClick={() => navigate('/')}
              startIcon={<Home size={18} />}
            >
              Go to Home
            </PrimaryButton>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft size={18} />}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
