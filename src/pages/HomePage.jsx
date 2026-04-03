import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  MapPin,
  TrendingDown,
  Star,
  Clock,
  Shield,
  Zap,
  Heart,
  BarChart3,
  Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  PrimaryButton,
  SecondaryButton,
  HealthcareCard,
  GridContainer,
  SectionWrapper,
} from '../styles/styledComponents';

import HeroVisual from '../assets/hero-visual.png';
import HeroBg1 from '../assets/hospital-bg-1.png';
import HeroBg2 from '../assets/hospital-bg-2.png';
import HeroBg3 from '../assets/hospital-bg-3.png';
import HeroBg4 from '../assets/hospital-bg-4.png';
import HeroBg5 from '../assets/hospital-bg-5.png';

const heroImages = [HeroBg1, HeroBg2, HeroBg3, HeroBg4, HeroBg5];

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Hero slideshow state - only image changes, content stays static
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Handle hash scrolling (e.g., from other pages)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Small timeout to ensure the element is rendered and layout is stable
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  // Feature cards data
  const features = [
    {
      icon: MapPin,
      title: 'Find Nearby Hospitals',
      description: 'Discover hospitals near your location with real-time GPS tracking.',
    },
    {
      icon: TrendingDown,
      title: 'Compare Costs',
      description: 'Transparent pricing for tests, treatments, and procedures.',
    },
    {
      icon: Star,
      title: 'Read Reviews',
      description: 'Authentic patient reviews and hospital ratings to guide your choice.',
    },
    {
      icon: Shield,
      title: 'Verified Facilities',
      description: 'All hospitals are verified and up-to-date with their certifications.',
    },
  ];

  // How it works steps
  const steps = [
    {
      number: '1',
      title: 'Enter Your Location',
      description: 'Use GPS or type your city/area to find nearby hospitals.',
      icon: MapPin,
    },
    {
      number: '2',
      title: 'Browse & Compare',
      description: 'View hospital details, facilities, costs, and patient ratings.',
      icon: BarChart3,
    },
    {
      number: '3',
      title: 'Make Informed Choice',
      description: 'Compare prices and quality to find the best hospital for you.',
      icon: TrendingDown,
    },
    {
      number: '4',
      title: 'Book or Contact',
      description: 'Schedule appointments or contact hospitals directly.',
      icon: Clock,
    },
  ];

  return (
    <Box>
      {/* ============================================
          HERO SECTION - Fullscreen Slideshow
          ============================================ */}
      <Box
        id="hero-section"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden',
        }}
      >
        {/* Background Images Layer */}
        {heroImages.map((img, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 2s ease-in-out, transform 10s ease-out',
              transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)',
              zIndex: 0,
            }}
          />
        ))}

        {/* Dark Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.6) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content Overlay */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            px: { xs: 3, md: 6 },
          }}
        >
          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontWeight: 900,
              fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3.2rem', lg: '3.8rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: 3,
              textShadow: '0 4px 20px rgba(0,0,0,0.4)',
              maxWidth: '800px',
            }}
          >
            Find the <span style={{ color: theme.palette.primary.main }}>Right Hospital</span>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.92)',
              fontWeight: 400,
              fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.1rem' },
              lineHeight: 1.5,
              mb: 4,
              maxWidth: '600px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Compare costs, ratings, and facilities. Make informed healthcare
            decisions with Smart Hospital Discovery.
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={3}
            sx={{
              mb: 5,
            }}
          >
            <Button
              size="large"
              onClick={() => navigate('/dashboard')}
              startIcon={<Zap size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: 'white',
                px: 3,
                py: 1.3,
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '10px',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 30px rgba(239, 68, 68, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(239, 68, 68, 0.7)',
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Emergency: Find Now
            </Button>

            <Button
              size="large"
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              sx={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                px: 4,
                py: 1.3,
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                textTransform: 'none',
                letterSpacing: '0.02em',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '2px solid rgba(255, 255, 255, 0.7)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Hospitals
            </Button>
          </Stack>

          {/* Trust Badges */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'rgba(255, 255, 255, 0.12)',
              px: 2.5,
              py: 1,
              borderRadius: '100px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <Heart size={18} fill="white" color="white" />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                100K+ Happy Users
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'rgba(255, 255, 255, 0.12)',
              px: 2.5,
              py: 1,
              borderRadius: '100px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <Shield size={18} color="white" />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                5000+ Verified Hospitals
              </Typography>
            </Box>
            <Box sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              background: 'rgba(255, 255, 255, 0.12)',
              px: 2.5,
              py: 1,
              borderRadius: '100px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <Clock size={18} color="white" />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                24/7 Support
              </Typography>
            </Box>
          </Stack>
        </Box>





      </Box>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }} className="fade-in">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose Smart Hospital?
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Everything you need to make informed healthcare decisions in one platform.
          </Typography>
        </Box>

        <GridContainer>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <HealthcareCard key={index} className="slide-in-up">
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '16px',
                      backgroundColor: theme.palette.primary.lighter,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                      boxShadow: `0 4px 10px ${theme.palette.primary.main}15`,
                    }}
                  >
                    <IconComponent size={32} color={theme.palette.primary.main} />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      maxWidth: '240px',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </HealthcareCard>
            );
          })}
        </GridContainer>
      </Container>

      {/* ============================================
          HOW IT WORKS SECTION
          ============================================ */}
      <SectionWrapper
        id="how-it-works"
        sx={{
          backgroundColor: theme.palette.background.light,
          py: { xs: 8, md: 12 },
          borderRadius: 0,
          margin: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }} className="fade-in">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.25rem', md: '3rem' },
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: '650px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Get started in minutes with our simple four-step process designed to put your health first.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ position: 'relative' }}>
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={index} className="slide-in-up">
                  <Box
                    sx={{
                      textAlign: 'center',
                      position: 'relative',
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        backgroundColor: 'white',
                        '& .step-number': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      },
                    }}
                  >
                    {/* Step indicator */}
                    <Box
                      className="step-number"
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '22px',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: `0 8px 16px ${theme.palette.primary.main}30`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: 'white',
                          fontWeight: 800,
                        }}
                      >
                        {step.number}
                      </Typography>
                    </Box>

                    {/* Icon */}
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: '50%',
                        background: theme.palette.secondary.lighter,
                        display: 'flex',
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <StepIcon size={32} />
                    </Box>

                    {/* Text */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: 'text.primary',
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.7,
                        fontWeight: 450,
                      }}
                    >
                      {step.description}
                    </Typography>

                    {/* Connector line (desktop only) */}
                    {index < steps.length - 1 && (
                      <Box
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          position: 'absolute',
                          top: '65px',
                          right: '-15%',
                          width: '30%',
                          height: '2px',
                          background: `linear-gradient(90deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.light}20 100%)`,
                          zIndex: 0,
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </SectionWrapper>

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          {[
            { number: '5000+', label: 'Hospitals', icon: Shield },
            { number: '100K+', label: 'Happy Users', icon: Heart },
            { number: '50M+', label: 'Cost Comparisons', icon: BarChart3 },
            { number: '24/7', label: 'Support', icon: Clock },
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Grid item xs={6} sm={3} key={index} className="fade-in">
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    background: 'linear-gradient(135deg, #E6F2FF 0%, #E6F9F2 100%)',
                    border: 'none',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 1 }}>
                      <StatIcon size={32} color={theme.palette.primary.main} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      {/* <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'white',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
          >
            Ready to Find Your Hospital?
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Join thousands of users who trust Smart Hospital Discovery for their healthcare needs.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="center">
            <PrimaryButton
              size="large"
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              sx={{ background: 'white', color: theme.palette.primary.main }}
            >
              Find Hospitals
            </PrimaryButton>
          </Stack>
        </Container>
      </Box> */}
      {/* ============================================
          FLOATING EMERGENCY CALL BUTTON
          ============================================ */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: '100px',
            fontWeight: 800,
            fontSize: '0.7rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            animation: 'fadeInOut 2s infinite',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0.5 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.5 },
            },
          }}
        >
          24/7 EMERGENCY
        </Typography>
        <Button
          onClick={() => window.location.href = 'tel:108'}
          sx={{
            minWidth: 64,
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: 'white',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.5)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#dc2626',
              transform: 'scale(1.1)',
              boxShadow: '0 15px 30px rgba(239, 68, 68, 0.6)',
            },
            animation: 'pulse-red 2s infinite',
            '@keyframes pulse-red': {
              '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
              '70%': { boxShadow: '0 0 0 15px rgba(239, 68, 68, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
            }
          }}
        >
          <Phone size={32} fill="white" />
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
