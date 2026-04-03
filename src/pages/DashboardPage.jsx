import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Stack,
  Chip,
  Rating,
  useTheme,
  Paper,
} from '@mui/material';

import {
  MapPin,
  Navigation,
  Filter,
  DollarSign,
  AlertCircle,
  Zap,
  Heart,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';

import {
  PrimaryButton,
  SecondaryButton,
  HealthcareCard,
  GridContainer,
} from '../styles/styledComponents';

import MapView from '../components/MapView';

import { useGeolocation } from '../hooks';
import { formatCurrency } from '../utils/helpers';
import { hospitalService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const symptomMap = {
  // English Symptoms
  'headache': 'Neurology',
  'fever': 'General Physician',
  'cough': 'Pulmonology',
  'chest pain': 'Cardiology',
  'pregnancy': 'Maternity',
  'bone': 'Orthopedics',
  'joint pain': 'Orthopedics',
  'eye': 'Ophthalmology',
  'skin': 'Dermatology',
  'stomach': 'Gastroenterology',

  // Hindi Symptoms
  'सर दर्द': 'Neurology',
  'बुखार': 'General Physician',
  'खांसी': 'Pulmonology',
  'दिल में दर्द': 'Cardiology',
  'गर्भावस्था': 'Maternity',
  'हड्डी': 'Orthopedics',
  'आंख': 'Ophthalmology',
  'त्वचा': 'Dermatology',
  'पेट': 'Gastroenterology',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t, language } = useLanguage();
  const searchInputRef = useRef(null);
  const { location, error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation();

  const getInitialState = () => {
    try {
      const saved = sessionStorage.getItem('dashboardSearchState');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
    return {
      routingHospital: null
    };
  };

  const initialState = getInitialState();

  const [searchInput, setSearchInput] = useState(initialState.searchInput || '');
  const [diseaseInput, setDiseaseInput] = useState(initialState.diseaseInput || '');
  const [radius, setRadius] = useState(initialState.radius || 10);
  const [hospitals, setHospitals] = useState(initialState.hospitals || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(initialState.hasSearched || false);
  const [isPendingLocationSearch, setIsPendingLocationSearch] = useState(false);
  const [pendingSearchType, setPendingSearchType] = useState(null); // 'text' or 'nearby'
  const [viewMode, setViewMode] = useState(initialState.viewMode || 'list'); // 'list' or 'map'
  const [routingHospital, setRoutingHospital] = useState(initialState.routingHospital || null);
  const [sortBy, setSortBy] = useState(initialState.sortBy || 'distance'); // 'distance', 'rating', 'price'

  const [formErrors, setFormErrors] = useState({
    disease: '',
    search: '',
    radius: '',
  });

  const [filters, setFilters] = useState(initialState.filters || {
    ICU: false,
    MRI: false,
    Emergency: false,
  });

  // Save state on change
  useEffect(() => {
    sessionStorage.setItem('dashboardSearchState', JSON.stringify({
      searchInput,
      diseaseInput,
      radius,
      hospitals,
      hasSearched,
      viewMode,
      filters,
      sortBy,
      routingHospital
    }));
  }, [searchInput, diseaseInput, radius, hospitals, hasSearched, viewMode, filters, sortBy, routingHospital]);

  const getActiveFacilities = () => {
    return Object.keys(filters)
      .filter((f) => filters[f])
      .join(',');
  };

  const handleSearch = async () => {
    const nextErrors = { disease: '', search: '', radius: '' };
    if (!diseaseInput.trim()) nextErrors.disease = 'Disease is required';
    if (!searchInput.trim()) nextErrors.search = 'City / hospital name is required';
    setFormErrors(nextErrors);

    if (nextErrors.disease || nextErrors.search) {
      setError('Please fill the required fields.');
      return;
    }

    if (location || geoError) {
      performTextSearch(location);
    } else {
      setLoading(true);
      setError(null);
      setPendingSearchType('text');
      setIsPendingLocationSearch(true);
      getCurrentLocation();

      // Fallback if it takes too long
      setTimeout(() => {
        setIsPendingLocationSearch((prev) => {
          if (prev) {
            performTextSearch(null); // Proceed without location
            return false;
          }
          return prev;
        });
      }, 5000);
    }
  };

  const performTextSearch = async (currentLocation) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hospitalService.searchByLocation(
        searchInput,
        diseaseInput,
        getActiveFacilities(),
        currentLocation?.latitude,
        currentLocation?.longitude
      );
      setHospitals(response.data?.hospitals || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search hospitals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle search once location is available
  useEffect(() => {
    if (isPendingLocationSearch && location) {
      setIsPendingLocationSearch(false);
      if (pendingSearchType === 'text') {
        performTextSearch(location);
      } else {
        handleSearchAfterLocationFound();
      }
    }
  }, [location, isPendingLocationSearch, pendingSearchType]);

  const handleSearchAfterLocationFound = async () => {
    if (!location) return;

    const nextErrors = { disease: '', search: '', radius: '' };
    if (!diseaseInput.trim()) nextErrors.disease = 'Disease is required';
    const radiusNum = Number(radius);
    if (!Number.isFinite(radiusNum) || radiusNum <= 0) nextErrors.radius = 'Radius must be greater than 0';
    setFormErrors(nextErrors);
    if (nextErrors.disease || nextErrors.radius) {
      setError('Please fill the required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await hospitalService.searchNearby(
        location.latitude,
        location.longitude,
        radius,
        diseaseInput,
        getActiveFacilities()
      );
      setHospitals(response.data?.hospitals || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to get nearby hospitals.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByLocation = async () => {
    const nextErrors = { disease: '', search: '', radius: '' };
    if (!diseaseInput.trim()) nextErrors.disease = 'Disease is required';
    const radiusNum = Number(radius);
    if (!Number.isFinite(radiusNum) || radiusNum <= 0) nextErrors.radius = 'Radius must be greater than 0';
    setFormErrors(nextErrors);
    if (nextErrors.disease || nextErrors.radius) {
      setError('Please fill the required fields.');
      return;
    }

    if (geoError) {
      setError(geoError);
      return;
    }

    if (location) {
      handleSearchAfterLocationFound();
      return;
    }

    // If location not yet available, request it and set pending
    setLoading(true);
    setError(null);
    setPendingSearchType('nearby');
    setIsPendingLocationSearch(true);
    getCurrentLocation();

    // Fallback if it takes too long
    setTimeout(() => {
      setIsPendingLocationSearch((prev) => {
        if (prev) {
          setError('Wait... GPS is taking a bit longer than expected. Please check browser permissions.');
          setLoading(false);
          return false;
        }
        return prev;
      });
    }, 10000);
  };

  const handleFilterChange = (facility) => {
    setFilters((prev) => ({ ...prev, [facility]: !prev[facility] }));
  };

  const handleShowDirectionsOnMap = (hospital) => {
    setRoutingHospital(hospital);
    setViewMode('map');
    // Scroll to top to see map if on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLike = (id) => {
    setHospitals((prev) =>
      prev.map((h) => (h._id === id ? { ...h, isLiked: !h.isLiked } : h))
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
              {t('find_hospitals')}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {t('search_desc')}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ bgcolor: theme.palette.grey[100], p: 0.5, borderRadius: '12px' }}>
            <Button
              size="small"
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'contained' : 'text'}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 2 }}
            >
              List
            </Button>
            <Button
              size="small"
              onClick={() => setViewMode('map')}
              variant={viewMode === 'map' ? 'contained' : 'text'}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 2 }}
            >
              Map
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Disease Search Section */}
          <Grid item xs={12}>
            <HealthcareCard sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Stethoscope size={20} color={theme.palette.primary.main} />
                  {t('search_by_specialty')}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      placeholder={language === 'en' ? 'e.g. Headache, Fever, Bones...' : 'जैसे: सर दर्द, बुखार, हड्डी...'}
                      value={diseaseInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDiseaseInput(val);
                        // Symptom Check logic
                        const specialty = symptomMap[val.toLowerCase()];
                        if (specialty) {
                          setDiseaseInput(specialty);
                        }
                        setFormErrors((p) => ({ ...p, disease: '' }));
                      }}
                      variant="outlined"
                      required
                      error={Boolean(formErrors.disease)}
                      helperText={formErrors.disease}
                      InputProps={{
                        startAdornment: <HeartPulse size={20} color={theme.palette.text.secondary} style={{ marginRight: '12px' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {['Cardiology', 'OPD', 'Orthopedics', 'Maternity'].map((d) => (
                        <Chip
                          key={d}
                          label={d === 'OPD' ? 'Fever' : d === 'Orthopedics' ? 'Bone/Joints' : d}
                          onClick={() => {
                            setDiseaseInput(d);
                            setFormErrors((p) => ({ ...p, disease: '' }));
                          }}
                          variant={diseaseInput === d ? 'contained' : 'outlined'}
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '8px', cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </HealthcareCard>
          </Grid>

          {/* GPS Search Card */}
          <Grid item xs={12} md={6}>
            <HealthcareCard sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.primary.lighter}`,
              boxShadow: '0 8px 32px rgba(0, 102, 204, 0.05)'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: theme.palette.primary.main }}>
                  <Navigation size={22} />
                  {t('search_near_me')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Use your current GPS location to find the closest medical facilities within a specific radius.
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('radius')}
                        value={radius}
                        onChange={(e) => {
                          setRadius(Number(e.target.value));
                          setFormErrors((p) => ({ ...p, radius: '' }));
                        }}
                        size="small"
                        required
                        error={Boolean(formErrors.radius)}
                        helperText={formErrors.radius}
                        InputProps={{
                          inputProps: { min: 1, max: 50 },
                          sx: { borderRadius: '12px', bgcolor: 'white' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      <PrimaryButton
                        fullWidth
                        startIcon={geoLoading ? <CircularProgress size={16} color="inherit" /> : <Navigation size={18} />}
                        onClick={handleSearchByLocation}
                        disabled={geoLoading}
                        sx={{ py: 1.5 }}
                      >
                        {geoLoading ? 'Locating...' : t('search_near_me')}
                      </PrimaryButton>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </HealthcareCard>
          </Grid>

          {/* Text/Location Search Card */}
          <Grid item xs={12} md={6}>
            <HealthcareCard sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.secondary.lighter}`,
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.05)'
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: theme.palette.secondary.dark }}>
                  <Filter size={22} />
                  {t('search_by_name')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Type a hospital name or a city (e.g. New Delhi) to see all hospitals in that area instantly.
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        placeholder="e.g. Apollo, Max, Delhi..."
                        value={searchInput}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          setFormErrors((p) => ({ ...p, search: '' }));
                        }}
                        size="small"
                        inputRef={searchInputRef}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        required
                        error={Boolean(formErrors.search)}
                        helperText={formErrors.search}
                        InputProps={{
                          sx: { borderRadius: '12px', bgcolor: 'white' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                          height: '45px',
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 800,
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                          boxShadow: `0 4px 12px ${theme.palette.secondary.main}40`,
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 18px ${theme.palette.secondary.main}60` }
                        }}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </HealthcareCard>
          </Grid>
        </Grid>

        {/* FILTERS & SORTING */}
        <Box sx={{ mb: 4, pt: 2, display: 'flex', flexDirection: 'column', gap: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          {/* Facilities Filter */}
          <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 700, mr: 1, display: 'flex', alignItems: 'center' }}>
              <Filter size={16} style={{ marginRight: 4 }} /> Facilities:
            </Typography>
            {['ICU', 'MRI', 'Emergency'].map((f) => (
              <Chip
                key={f}
                label={f}
                clickable
                color={filters[f] ? 'primary' : 'default'}
                onClick={() => handleFilterChange(f)}
                icon={filters[f] ? <Zap size={14} /> : undefined}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Box>

          {/* Sort By Filter */}
          {hasSearched && hospitals.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 700, mr: 1, display: 'flex', alignItems: 'center' }}>
                <Navigation size={16} style={{ marginRight: 4 }} /> Sort By:
              </Typography>
              <Chip
                label="Distance (Nearest)"
                clickable
                color={sortBy === 'distance' ? 'secondary' : 'default'}
                onClick={() => setSortBy('distance')}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label="Rating (Highest)"
                clickable
                color={sortBy === 'rating' ? 'secondary' : 'default'}
                onClick={() => setSortBy('rating')}
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label="Price (Lowest)"
                clickable
                color={sortBy === 'price' ? 'secondary' : 'default'}
                onClick={() => setSortBy('price')}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}
        </Box>

        {/* ERROR */}
        {(error || geoError) && (
          <Paper
            sx={{
              p: 2,
              mb: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              backgroundColor: '#FFF5F5',
              border: '1px solid #FEB2B2',
              borderRadius: '12px'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <AlertCircle color={theme.palette.error.main} size={20} />
              <Typography variant="body2" color="error" fontWeight={500}>
                {error || geoError}
              </Typography>
            </Box>

            {(geoError || error?.includes('GPS')) && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => {
                  if (searchInputRef.current) searchInputRef.current.focus();
                  setError(null);
                }}
                sx={{ ml: { sm: 'auto' }, textTransform: 'none', fontSize: '0.75rem' }}
              >
                Type Manually Instead
              </Button>
            )}
          </Paper>
        )}

        {hospitals.length > 0 && (
          <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight={600}>
              {hospitals.length} hospitals found
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => {
                  setRoutingHospital(null);
                  setHospitals([]);
                  setHasSearched(false);
                }}
                size="small"
              >
                Clear Results
              </Button>
            </Box>
          </Paper>
        )}

        {/* LOADING */}
        {loading && (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        )}

        {/* RESULTS SECTION */}
        {hasSearched && !loading && (
          <>
            {viewMode === 'list' ? (
              <GridContainer>
                {hospitals
                  .sort((a, b) => {
                    if (sortBy === 'distance') {
                      return (a.distance || 999) - (b.distance || 999);
                    }
                    if (sortBy === 'rating') {
                      return (b.rating?.average || 0) - (a.rating?.average || 0);
                    }
                    if (sortBy === 'price') {
                      const getPrice = (h) => h.diseasePrice ? h.diseasePrice.min : (h.averageCost || 999999);
                      return getPrice(a) - getPrice(b);
                    }
                    return 0;
                  })
                  .map((h) => (
                    <Grid item xs={12} md={4} key={h._id}>
                      <HealthcareCard className="slide-up">
                        <CardContent sx={{ position: 'relative', p: 3 }}>
                          {/* Live Status Badge */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 20,
                              right: 20,
                              zIndex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              gap: 0.5
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor: '#10b981',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: '6px',
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                              }}
                            >
                              <Box sx={{ width: 6, height: 6, bgcolor: 'white', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                              OPEN
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.6rem' }}>
                              Wait: 15-20 min
                            </Typography>
                          </Box>

                          <Stack direction="row" justifyContent="space-between" mb={1} pr={8}>
                            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                              {h.name}
                            </Typography>
                          </Stack>

                          <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                            <MapPin size={14} color={theme.palette.text.secondary} />
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '200px' }}>
                              {h.address?.street}, {h.address?.city}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Rating value={h.rating?.average || 0} readOnly size="small" precision={0.1} />
                            <Typography variant="body2" fontWeight={700}>{h.rating?.average || 0}</Typography>
                            <Typography variant="caption" color="text.secondary">({h.rating?.totalReviews || 0} reviews)</Typography>
                          </Box>

                          <Stack direction="row" spacing={2} mb={1}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                bgcolor: theme.palette.primary.lighter,
                                px: 1,
                                py: 0.5,
                                borderRadius: '6px'
                              }}
                            >
                              <MapPin size={14} color={theme.palette.primary.main} />
                              <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                {h.distance ? `${h.distance} km` : 'Location unknown'}
                              </Typography>
                            </Box>
                            {sortBy === 'distance' && hospitals.indexOf(h) === 0 && (
                              <Chip label="Nearest to you" size="small" color="primary" sx={{ height: '24px', fontWeight: 700 }} />
                            )}
                          </Stack>

                          {/* Disease-Specific Price */}
                          {h.diseasePrice ? (
                            <Box
                              p={1.5}
                              bgcolor={theme.palette.secondary.lighter}
                              borderRadius="8px"
                              mb={2}
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <DollarSign size={18} color={theme.palette.secondary.main} />
                              <Box flex={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  {h.diseasePrice.label}
                                </Typography>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 800, color: theme.palette.secondary.main }}
                                  >
                                    {formatCurrency(h.diseasePrice.min)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    — {formatCurrency(h.diseasePrice.max)}
                                  </Typography>
                                </Box>
                              </Box>
                              {h.diseasePrice.source === 'actual' && (
                                <Chip label="Verified" size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: '20px' }} />
                              )}
                              {h.diseasePrice.source === 'estimated' && (
                                <Chip label="Est." size="small" color="warning" variant="outlined" sx={{ fontSize: '0.65rem', height: '20px' }} />
                              )}
                            </Box>
                          ) : (
                            h.averageCost ? (
                              <Box
                                p={1.5}
                                bgcolor={theme.palette.secondary.lighter}
                                borderRadius="8px"
                                mb={2}
                                display="flex"
                                alignItems="center"
                                gap={1}
                              >
                                <DollarSign size={18} color={theme.palette.secondary.main} />
                                <Box>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Average Cost
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, color: theme.palette.secondary.main }}
                                  >
                                    {formatCurrency(h.averageCost)}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : null
                          )}

                          <Stack direction="row" spacing={1} mt={1}>
                            <PrimaryButton
                              fullWidth
                              size="small"
                              onClick={() => navigate(`/hospital/${h._id}${diseaseInput ? `?disease=${encodeURIComponent(diseaseInput)}` : ''}`)}
                              sx={{ fontSize: '0.75rem', py: 1 }}
                            >
                              Details
                            </PrimaryButton>
                            <SecondaryButton
                              fullWidth
                              size="small"
                              startIcon={<Navigation size={14} />}
                              onClick={() => handleShowDirectionsOnMap(h)}
                              sx={{ fontSize: '0.75rem', py: 1 }}
                            >
                              Directions
                            </SecondaryButton>
                          </Stack>
                        </CardContent>
                      </HealthcareCard>
                    </Grid>
                  ))}
              </GridContainer>
            ) : (
              <Box sx={{ height: '600px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <MapView
                  hospitals={hospitals}
                  userLocation={location}
                  routingHospital={routingHospital}
                  onHospitalSelect={(h) => navigate(`/hospital/${h._id}${diseaseInput ? `?disease=${encodeURIComponent(diseaseInput)}` : ''}`)}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;
